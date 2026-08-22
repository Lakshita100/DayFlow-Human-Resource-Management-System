import { Prisma, PayrollStatus } from '@prisma/client';
import { prisma } from '../config/database.js';

export const payrollRepository = {
  async findStructureByEmployee(employeeId: string) {
    return prisma.salaryStructure.findUnique({
      where: { employeeId },
      include: { components: true },
    });
  },

  async createStructure(data: {
    employeeId: string;
    effectiveFrom: Date;
    effectiveTo?: Date;
    components: Array<{ name: string; type: 'EARNING' | 'DEDUCTION'; amount: number }>;
  }) {
    return prisma.salaryStructure.create({
      data: {
        employeeId: data.employeeId,
        effectiveFrom: data.effectiveFrom,
        effectiveTo: data.effectiveTo,
        components: { create: data.components },
      },
      include: { components: true },
    });
  },

  async updateStructure(
    id: string,
    data: {
      effectiveFrom?: Date;
      effectiveTo?: Date | null;
      components?: Array<{ name: string; type: 'EARNING' | 'DEDUCTION'; amount: number }>;
    }
  ) {
    return prisma.salaryStructure.update({
      where: { id },
      data: {
        effectiveFrom: data.effectiveFrom,
        effectiveTo: data.effectiveTo,
        ...(data.components && {
          components: { deleteMany: {}, create: data.components },
        }),
      },
      include: { components: true },
    });
  },

  async findEmployeeInCompany(employeeId: string, companyId: string) {
    return prisma.employee.findFirst({
      where: { id: employeeId, companyId },
      select: { id: true, firstName: true, lastName: true, status: true, userId: true },
    });
  },

  async listStructures(companyId: string, page: number, limit: number) {
    const where: Prisma.SalaryStructureWhereInput = { employee: { companyId } };

    const [structures, total] = await Promise.all([
      prisma.salaryStructure.findMany({
        where,
        include: {
          components: true,
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              department: true,
              user: { select: { loginId: true, email: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.salaryStructure.count({ where }),
    ]);

    return { structures, total };
  },

  async activeEmployeesWithStructures(companyId: string) {
    return prisma.employee.findMany({
      where: { companyId, status: 'ACTIVE', salaryStructure: { isNot: null } },
      select: { id: true, firstName: true, lastName: true, salaryStructure: true },
      include: { salaryStructure: { include: { components: true } } },
    });
  },

  async payrollExists(employeeId: string, periodStart: Date, periodEnd: Date) {
    return prisma.payroll.findUnique({
      where: {
        employeeId_periodStart_periodEnd: { employeeId, periodStart, periodEnd },
      },
    });
  },

  async createPayroll(data: Prisma.PayrollCreateInput) {
    return prisma.payroll.create({ data });
  },

  async findPayrollById(id: string) {
    return prisma.payroll.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
            designation: true,
            companyId: true,
            user: { select: { loginId: true, email: true } },
          },
        },
      },
    });
  },

  async listCompanyPayrolls(params: {
    companyId: string;
    year?: number;
    month?: number;
    page: number;
    limit: number;
  }) {
    const { companyId, year, month, page, limit } = params;

    let periodStartFilter;
    if (year && month) {
      periodStartFilter = new Date(Date.UTC(year, month - 1, 1));
    }

    const where: Prisma.PayrollWhereInput = {
      companyId,
      ...(periodStartFilter && { periodStart: periodStartFilter }),
    };

    const [payrolls, total] = await Promise.all([
      prisma.payroll.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              department: true,
              user: { select: { loginId: true, email: true } },
            },
          },
        },
        orderBy: [{ periodStart: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payroll.count({ where }),
    ]);

    return { payrolls, total };
  },

  async listEmployeePayrolls(employeeId: string) {
    return prisma.payroll.findMany({
      where: { employeeId },
      orderBy: { periodStart: 'desc' },
    });
  },
};
