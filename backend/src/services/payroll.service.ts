import { prisma } from '../config/database.js';
import { payrollRepository } from '../repositories/payroll.repository.js';
import { createError } from '../middleware/error.middleware.js';

/**
 * PAYROLL BUSINESS RULES (documented assumptions):
 * - Pay period = calendar month (UTC). Working days = Mon-Fri in period.
 *   No holiday calendar exists in schema; holidays are NOT excluded.
 * - presentDays: Attendance rows with checkIn set; HALF_DAY counts as 0.5.
 * - Approved PAID/SICK leave weekdays inside period => paidLeaveDays.
 * - Approved UNPAID leave weekdays inside period => unpaidLeaveDays.
 * - absentDays = workingDays - payableDays - unpaidLeaveDays (floored at 0).
 * - payableDays = presentDays + paidLeaveDays (+ half days at 0.5).
 * - dailyRate = monthly earnings / workingDays.
 * - Unpaid leave AND absences reduce pay via daily-rate deductions.
 * - Fixed DEDUCTION components are flat monthly amounts (not pro-rated).
 * - netSalary >= 0.
 */

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function startOfDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function countWorkingDays(from: Date, to: Date): number {
  let count = 0;
  const cur = new Date(startOfDay(from));
  while (cur <= startOfDay(to)) {
    const day = cur.getUTCDay();
    if (day !== 0 && day !== 6) count++;
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return count;
}

function weekdayIntersection(startA: Date, endA: Date, startB: Date, endB: Date): number {
  const from = startOfDay(startA > startB ? startA : startB);
  const to = startOfDay(endA < endB ? endA : endB);
  if (from > to) return 0;
  return countWorkingDays(from, to);
}

export interface ComputedPayroll {
  workingDays: number;
  presentDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  absentDays: number;
  payableDays: number;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
}

export function computePayroll(
  components: Array<{ name: string; type: string; amount: number }>,
  attendanceRows: Array<{ status: string; checkIn: Date | null }>,
  approvedLeaves: Array<{ type: string; startDate: Date; endDate: Date }>,
  periodStart: Date,
  periodEnd: Date
): ComputedPayroll {
  const workingDays = countWorkingDays(periodStart, periodEnd);

  let presentDays = 0;
  for (const row of attendanceRows) {
    if (!row.checkIn) continue;
    if (row.status === 'PRESENT') presentDays += 1;
    else if (row.status === 'HALF_DAY') presentDays += 0.5;
  }

  let paidLeaveDays = 0;
  let unpaidLeaveDays = 0;
  for (const l of approvedLeaves) {
    const days = weekdayIntersection(l.startDate, l.endDate, periodStart, periodEnd);
    if (l.type === 'UNPAID') unpaidLeaveDays += days;
    else paidLeaveDays += days;
  }

  const payableDays = round2(presentDays + paidLeaveDays);
  const absentDays = Math.max(0, round2(workingDays - payableDays - unpaidLeaveDays));

  let earnings = 0;
  let fixedDeductions = 0;
  for (const c of components) {
    if (c.type === 'EARNING') earnings += c.amount;
    else fixedDeductions += c.amount;
  }

  const dailyRate = workingDays > 0 ? earnings / workingDays : 0;
  const unpaidDeduction = round2(unpaidLeaveDays * dailyRate);
  const absentDeduction = round2(absentDays * dailyRate);

  const grossSalary = round2(earnings);
  const totalDeductions = round2(fixedDeductions + unpaidDeduction + absentDeduction);
  const netSalary = Math.max(0, round2(grossSalary - totalDeductions));

  return {
    workingDays,
    presentDays: round2(presentDays),
    paidLeaveDays,
    unpaidLeaveDays,
    absentDays,
    payableDays,
    grossSalary,
    totalDeductions,
    netSalary,
  };
}

function formatPayroll(p: any) {
  return {
    id: p.id,
    employeeId: p.employeeId,
    employeeName: p.employee ? `${p.employee.firstName} ${p.employee.lastName}` : undefined,
    department: p.employee?.department,
    loginId: p.employee?.user?.loginId ?? null,
    periodStart: p.periodStart.toISOString().split('T')[0],
    periodEnd: p.periodEnd.toISOString().split('T')[0],
    workingDays: p.workingDays,
    presentDays: p.presentDays,
    paidLeaveDays: p.paidLeaveDays,
    unpaidLeaveDays: p.unpaidLeaveDays,
    absentDays: p.absentDays,
    payableDays: p.payableDays,
    grossSalary: p.grossSalary,
    totalDeductions: p.totalDeductions,
    netSalary: p.netSalary,
    status: p.status,
    generatedBy: p.generatedBy,
    createdAt: p.createdAt.toISOString(),
  };
}

class PayrollService {
  async generateForCompany(companyId: string, generatedBy: string, month: number, year: number) {
    if (month < 1 || month > 12) {
      throw createError('Month must be between 1 and 12', 400, 'INVALID_MONTH');
    }

    const periodStart = new Date(Date.UTC(year, month - 1, 1));
    const periodEnd = new Date(Date.UTC(year, month, 0));

    const employees = await payrollRepository.activeEmployeesWithStructures(companyId);

    const generated: any[] = [];
    const skipped: string[] = [];
    const missingStructure: string[] = [];

    const allEmployees = await prisma.employee.findMany({
      where: { companyId, status: 'ACTIVE' },
      select: { id: true, firstName: true, lastName: true },
    });
    const withStructureIds = new Set(employees.map((e) => e.id));
    for (const e of allEmployees) {
      if (!withStructureIds.has(e.id)) missingStructure.push(`${e.firstName} ${e.lastName}`);
    }

    for (const emp of employees) {
      const structure = emp.salaryStructure;
      if (!structure || structure.components.length === 0) continue;

      const existing = await payrollRepository.payrollExists(emp.id, periodStart, periodEnd);
      if (existing) {
        skipped.push(`${emp.firstName} ${emp.lastName}`);
        continue;
      }

      const [attendanceRows, leaves] = await Promise.all([
        prisma.attendance.findMany({
          where: {
            employeeId: emp.id,
            date: { gte: periodStart, lte: periodEnd },
          },
          select: { status: true, checkIn: true },
        }),
        prisma.timeOff.findMany({
          where: {
            employeeId: emp.id,
            status: 'APPROVED',
            startDate: { lte: periodEnd },
            endDate: { gte: periodStart },
          },
          select: { type: true, startDate: true, endDate: true },
        }),
      ]);

      const computed = computePayroll(
        structure.components.map((c) => ({ name: c.name, type: c.type, amount: c.amount })),
        attendanceRows,
        leaves,
        structure.effectiveFrom > periodStart ? structure.effectiveFrom : periodStart,
        structure.effectiveTo && structure.effectiveTo < periodEnd ? structure.effectiveTo : periodEnd
      );

      try {
        const created = await payrollRepository.createPayroll({
          employee: { connect: { id: emp.id } },
          company: { connect: { id: companyId } },
          periodStart,
          periodEnd,
          ...computed,
          status: 'GENERATED',
          generatedBy,
        });
        generated.push(created);
      } catch (err: unknown) {
        if (
          err &&
          typeof err === 'object' &&
          'code' in err &&
          (err as { code: string }).code === 'P2002'
        ) {
          skipped.push(`${emp.firstName} ${emp.lastName}`);
          continue;
        }
        throw err;
      }
    }

    console.log(JSON.stringify({
      level: 'INFO',
      event: 'PAYROLL_GENERATED',
      companyId,
      period: `${year}-${String(month).padStart(2, '0')}`,
      generated: generated.length,
      skipped: skipped.length,
    }));

    return {
      period: `${year}-${String(month).padStart(2, '0')}`,
      generatedCount: generated.length,
      skippedCount: skipped.length,
      skipped,
      missingSalaryStructure: missingStructure,
    };
  }

  async listCompanyPayrolls(
    companyId: string,
    query: { year?: string; month?: string; page?: string; limit?: string }
  ) {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);

    const { payrolls, total } = await payrollRepository.listCompanyPayrolls({
      companyId,
      year: query.year ? Number(query.year) : undefined,
      month: query.month ? Number(query.month) : undefined,
      page,
      limit,
    });

    return {
      payrolls: payrolls.map(formatPayroll),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getCompanyPayroll(payrollId: string, companyId: string) {
    const payroll = await payrollRepository.findPayrollById(payrollId);
    if (!payroll || payroll.employee.companyId !== companyId) {
      throw createError('Payslip not found', 404, 'PAYROLL_NOT_FOUND');
    }
    return formatPayroll(payroll);
  }

  async getMyPayrolls(userId: string, companyId: string) {
    const employee = await prisma.employee.findFirst({
      where: { userId, companyId },
      select: { id: true },
    });
    if (!employee) {
      throw createError('Employee profile not found', 404, 'EMPLOYEE_NOT_FOUND');
    }
    const payrolls = await payrollRepository.listEmployeePayrolls(employee.id);
    return { payslips: payrolls.map(formatPayroll) };
  }

  async getMyPayslip(userId: string, companyId: string, payrollId: string) {
    const employee = await prisma.employee.findFirst({
      where: { userId, companyId },
      select: { id: true },
    });
    if (!employee) {
      throw createError('Employee profile not found', 404, 'EMPLOYEE_NOT_FOUND');
    }
    const payroll = await payrollRepository.findPayrollById(payrollId);
    if (!payroll || payroll.employeeId !== employee.id) {
      throw createError('Payslip not found', 404, 'PAYROLL_NOT_FOUND');
    }
    return formatPayroll(payroll);
  }

  async getMySalary(userId: string, companyId: string) {
    const employee = await prisma.employee.findFirst({
      where: { userId, companyId },
      select: { id: true },
    });
    if (!employee) {
      throw createError('Employee profile not found', 404, 'EMPLOYEE_NOT_FOUND');
    }
    const structure = await payrollRepository.findStructureByEmployee(employee.id);
    if (!structure) {
      throw createError('No salary structure assigned', 404, 'SALARY_STRUCTURE_NOT_FOUND');
    }
    return this.formatStructure(structure);
  }

  async setSalaryStructure(
    companyId: string,
    employeeId: string,
    input: {
      effectiveFrom: string;
      effectiveTo?: string | null;
      components: Array<{ name: string; type: 'EARNING' | 'DEDUCTION'; amount: number }>;
    }
  ) {
    const employee = await payrollRepository.findEmployeeInCompany(employeeId, companyId);
    if (!employee) {
      throw createError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
    }

    const existing = await payrollRepository.findStructureByEmployee(employeeId);
    if (existing) {
      throw createError(
        'Salary structure already exists for this employee. Use PATCH to update.',
        409,
        'SALARY_STRUCTURE_EXISTS'
      );
    }

    const structure = await payrollRepository.createStructure({
      employeeId,
      effectiveFrom: new Date(input.effectiveFrom + 'T00:00:00Z'),
      effectiveTo: input.effectiveTo ? new Date(input.effectiveTo + 'T00:00:00Z') : undefined,
      components: input.components,
    });

    return this.formatStructure(structure as any);
  }

  async updateSalaryStructure(
    companyId: string,
    employeeId: string,
    input: {
      effectiveFrom?: string;
      effectiveTo?: string | null;
      components?: Array<{ name: string; type: 'EARNING' | 'DEDUCTION'; amount: number }>;
    }
  ) {
    const employee = await payrollRepository.findEmployeeInCompany(employeeId, companyId);
    if (!employee) {
      throw createError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
    }

    const existing = await payrollRepository.findStructureByEmployee(employeeId);
    if (!existing) {
      throw createError('Salary structure not found', 404, 'SALARY_STRUCTURE_NOT_FOUND');
    }

    const structure = await payrollRepository.updateStructure(existing.id, {
      effectiveFrom: input.effectiveFrom ? new Date(input.effectiveFrom + 'T00:00:00Z') : undefined,
      effectiveTo: input.effectiveTo !== undefined
        ? input.effectiveTo ? new Date(input.effectiveTo + 'T00:00:00Z') : null
        : undefined,
      components: input.components?.map((c) => ({
        name: c.name,
        type: c.type as 'EARNING' | 'DEDUCTION',
        amount: c.amount,
      })),
    });

    return this.formatStructure(structure as any);
  }

  async listStructures(companyId: string, query: { page?: string; limit?: string }) {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);
    const { structures, total } = await payrollRepository.listStructures(companyId, page, limit);

    return {
      structures: structures.map((s: any) => ({
        id: s.id,
        employeeId: s.employeeId,
        employeeName: `${s.employee.firstName} ${s.employee.lastName}`,
        loginId: s.employee.user?.loginId ?? null,
        effectiveFrom: s.effectiveFrom.toISOString().split('T')[0],
        effectiveTo: s.effectiveTo?.toISOString().split('T')[0] ?? null,
        components: s.components,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  private formatStructure(s: any) {
    return {
      id: s.id,
      employeeId: s.employeeId,
      effectiveFrom: s.effectiveFrom.toISOString().split('T')[0],
      effectiveTo: s.effectiveTo?.toISOString().split('T')[0] ?? null,
      components: s.components.map((c: any) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        amount: c.amount,
      })),
    };
  }
}

export const payrollService = new PayrollService();
