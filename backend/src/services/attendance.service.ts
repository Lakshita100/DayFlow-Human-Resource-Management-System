import { prisma } from '../config/database.js';
import { attendanceRepository, startOfDay } from '../repositories/attendance.repository.js';
import { employeeRepository } from '../repositories/employee.repository.js';
import { createError } from '../middleware/error.middleware.js';
import { env } from '../config/env.js';
import type { Attendance } from '@prisma/client';

const P2002 = 'P2002';

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function formatRecord(record: Attendance, onLeaveDates?: Set<string>) {
  const dateKey = startOfDay(record.date).toISOString().split('T')[0];
  let displayStatus = record.status as string;
  if (!record.checkIn && onLeaveDates?.has(dateKey)) {
    displayStatus = 'LEAVE';
  }
  return {
    id: record.id,
    employeeId: record.employeeId,
    date: dateKey,
    checkIn: record.checkIn?.toISOString() ?? null,
    checkOut: record.checkOut?.toISOString() ?? null,
    workHours: record.workHours,
    extraHours: record.extraHours,
    status: record.status,
    displayStatus,
  };
}

async function resolveActiveEmployee(userId: string, companyId: string) {
  const employee = await employeeRepository.findByUserIdAndCompany(userId, companyId);
  if (!employee) {
    throw createError('Employee profile not found', 404, 'EMPLOYEE_NOT_FOUND');
  }
  if (employee.status !== 'ACTIVE') {
    throw createError('Employee account is inactive', 403, 'EMPLOYEE_INACTIVE');
  }
  return employee;
}

async function getApprovedLeaveDateKeys(employeeId: string, from: Date, to: Date): Promise<Set<string>> {
  const leaves = await attendanceRepository.findApprovedLeaveDates(employeeId, from, to);
  const keys = new Set<string>();
  for (const l of leaves) {
    let cur = startOfDay(l.startDate);
    const end = startOfDay(l.endDate);
    while (cur <= end) {
      keys.add(cur.toISOString().split('T')[0]);
      cur = new Date(cur.getTime() + 86400000);
    }
  }
  return keys;
}

class AttendanceService {
  async checkIn(userId: string, companyId: string) {
    const employee = await resolveActiveEmployee(userId, companyId);

    const now = new Date();
    const today = startOfDay(now);

    const existing = await attendanceRepository.findByEmployeeAndDate(employee.id, today);
    if (existing?.checkIn) {
      throw createError('Already checked in today', 409, 'ALREADY_CHECKED_IN');
    }

    try {
      const record = existing
        ? await attendanceRepository.update(existing.id, { checkIn: now, status: 'PRESENT' })
        : await attendanceRepository.create({
            employeeId: employee.id,
            date: today,
            checkIn: now,
            status: 'PRESENT',
          });
      return formatRecord(record);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'code' in err &&
        (err as { code: string }).code === P2002
      ) {
        throw createError('Already checked in today', 409, 'ALREADY_CHECKED_IN');
      }
      throw err;
    }
  }

  async checkOut(userId: string, companyId: string) {
    const employee = await resolveActiveEmployee(userId, companyId);

    const now = new Date();
    const today = startOfDay(now);

    const record = await attendanceRepository.findByEmployeeAndDate(employee.id, today);
    if (!record || !record.checkIn) {
      throw createError('No active check-in found for today', 400, 'NO_ACTIVE_CHECK_IN');
    }
    if (record.checkOut) {
      throw createError('Already checked out today', 409, 'ALREADY_CHECKED_OUT');
    }

    const workMs = now.getTime() - record.checkIn.getTime();
    if (workMs <= 0) {
      throw createError('Check-out time must be after check-in time', 400, 'INVALID_TIME_RANGE');
    }

    const workHours = round2(workMs / 3600000);
    const extraHours = round2(Math.max(0, workHours - env.STANDARD_WORK_HOURS));

    const updated = await attendanceRepository.update(record.id, {
      checkOut: now,
      workHours,
      extraHours,
      status: 'PRESENT',
    });

    return formatRecord(updated);
  }

  async getMyRecords(
    userId: string,
    companyId: string,
    query: { from?: string; to?: string; page?: string; limit?: string }
  ) {
    const employee = await resolveActiveEmployee(userId, companyId);

    const to = query.to ? new Date(query.to) : new Date();
    const from = query.from
      ? new Date(query.from)
      : new Date(to.getTime() - 30 * 86400000);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      throw createError('Invalid date range', 400, 'INVALID_DATE_RANGE');
    }
    if (startOfDay(from) > startOfDay(to)) {
      throw createError('From date must be before or equal to to date', 400, 'INVALID_DATE_RANGE');
    }

    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);

    const [records, leaveKeys] = await Promise.all([
      attendanceRepository.findRangeForEmployee(employee.id, from, to),
      getApprovedLeaveDateKeys(employee.id, from, to),
    ]);

    const startIdx = (page - 1) * limit;

    return {
      records: records.slice(startIdx, startIdx + limit).map((r) => formatRecord(r, leaveKeys)),
      pagination: {
        page,
        limit,
        total: records.length,
        totalPages: Math.ceil(records.length / limit),
      },
    };
  }

  async getMyMonthlySummary(userId: string, companyId: string, year: number, month: number) {
    const employee = await resolveActiveEmployee(userId, companyId);

    if (month < 1 || month > 12) {
      throw createError('Month must be between 1 and 12', 400, 'INVALID_MONTH');
    }

    const from = new Date(Date.UTC(year, month - 1, 1));
    const to = new Date(Date.UTC(year, month, 0));

    let workingDays = 0;
    for (let d = new Date(from); d <= to; d.setUTCDate(d.getUTCDate() + 1)) {
      const day = d.getUTCDay();
      if (day !== 0 && day !== 6) workingDays++;
    }

    const [records, leaveKeys] = await Promise.all([
      attendanceRepository.findRangeForEmployee(employee.id, from, to),
      getApprovedLeaveDateKeys(employee.id, from, to),
    ]);

    let presentDays = 0;
    let halfDays = 0;
    let absentRecords = 0;
    let totalWorkHours = 0;
    let totalExtraHours = 0;

    for (const r of records) {
      if (r.checkIn) presentDays++;
      else if (r.status === 'HALF_DAY') halfDays++;
      else absentRecords++;
      totalWorkHours += r.workHours ?? 0;
      totalExtraHours += r.extraHours ?? 0;
    }

    const leaveDays = [...leaveKeys].filter((k) => {
      const dt = new Date(k + 'T00:00:00Z').getUTCDay();
      return dt !== 0 && dt !== 6;
    }).length;

    return {
      year,
      month,
      standardWorkHoursPerDay: env.STANDARD_WORK_HOURS,
      totalWorkingDays: workingDays,
      presentDays,
      halfDays,
      absentRecords,
      leaveDays,
      totalWorkHours: round2(totalWorkHours),
      totalExtraHours: round2(totalExtraHours),
    };
  }

  async adminList(
    companyId: string,
    query: {
      date?: string;
      from?: string;
      to?: string;
      employeeId?: string;
      search?: string;
      page?: string;
      limit?: string;
    }
  ) {
    const parseDate = (s?: string) => {
      if (!s) return undefined;
      const d = new Date(s);
      if (isNaN(d.getTime())) {
        throw createError(`Invalid date: ${s}`, 400, 'INVALID_DATE');
      }
      return d;
    };

    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);

    const { records, total } = await attendanceRepository.findCompanyAttendance({
      companyId,
      date: parseDate(query.date),
      from: parseDate(query.from),
      to: parseDate(query.to),
      employeeId: query.employeeId,
      search: query.search,
      page,
      limit,
    });

    return {
      records: records.map((r) => ({
        id: r.id,
        employeeId: r.employeeId,
        employeeName: `${r.employee.firstName} ${r.employee.lastName}`,
        loginId: r.employee.user?.loginId ?? null,
        email: r.employee.user?.email ?? null,
        department: r.employee.department,
        designation: r.employee.designation,
        date: startOfDay(r.date).toISOString().split('T')[0],
        checkIn: r.checkIn?.toISOString() ?? null,
        checkOut: r.checkOut?.toISOString() ?? null,
        workHours: r.workHours,
        extraHours: r.extraHours,
        status: r.status,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async companySummary(companyId: string, dateStr?: string) {
    const date = dateStr ? new Date(dateStr) : new Date();
    if (dateStr && isNaN(date.getTime())) {
      throw createError('Invalid date', 400, 'INVALID_DATE');
    }
    const day = startOfDay(date);

    const activeEmployees = await employeeRepository.countActiveByCompany(companyId);

    const employeeIds = (
      await prisma.employee.findMany({
        where: { companyId, status: 'ACTIVE' },
        select: { id: true },
      })
    ).map((e) => e.id);

    const [statusCounts, hours] = await Promise.all([
      attendanceRepository.countByStatus(employeeIds, day, day),
      attendanceRepository.sumHoursForEmployees(employeeIds, day, day),
    ]);

    const checkedIn = (statusCounts.PRESENT ?? 0) + (statusCounts.HALF_DAY ?? 0);
    const onLeave = await attendanceRepository.findOnLeaveEmployeeCount(companyId, day);

    const isPastOrToday = day <= startOfDay(new Date());

    return {
      date: day.toISOString().split('T')[0],
      totalEmployees: activeEmployees,
      present: checkedIn,
      onLeave,
      absent: isPastOrToday
        ? Math.max(0, activeEmployees - checkedIn - onLeave)
        : null,
      notCheckedIn: isPastOrToday ? Math.max(0, activeEmployees - checkedIn - onLeave) : null,
      totalWorkHours: hours.workHours,
      totalExtraHours: hours.extraHours,
    };
  }

  async correctAttendance(
    attendanceId: string,
    companyId: string,
    data: { checkIn?: string; checkOut?: string; status?: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE' }
  ) {
    const record = await attendanceRepository.findByIdWithEmployee(attendanceId);
    if (!record || record.employee.company?.id !== companyId) {
      throw createError('Attendance record not found', 404, 'ATTENDANCE_NOT_FOUND');
    }

    const checkIn = data.checkIn ? new Date(data.checkIn) : record.checkIn;
    const checkOut = data.checkOut !== undefined
      ? data.checkOut ? new Date(data.checkOut) : null
      : record.checkOut;

    if (isNaN(checkIn!.getTime())) {
      throw createError('Invalid check-in timestamp', 400, 'INVALID_TIMESTAMP');
    }
    if (checkOut && isNaN(checkOut.getTime())) {
      throw createError('Invalid check-out timestamp', 400, 'INVALID_TIMESTAMP');
    }
    if (checkOut && checkOut.getTime() <= checkIn!.getTime()) {
      throw createError('Check-out must be after check-in', 400, 'INVALID_TIME_RANGE');
    }

    let workHours: number | null = null;
    let extraHours: number | null = null;
    if (checkOut) {
      workHours = round2((checkOut.getTime() - checkIn!.getTime()) / 3600000);
      extraHours = round2(Math.max(0, workHours - env.STANDARD_WORK_HOURS));
    }

    const updated = await attendanceRepository.update(attendanceId, {
      checkIn,
      checkOut,
      workHours,
      extraHours,
      ...(data.status && { status: data.status }),
    });

    console.log(JSON.stringify({
      level: 'INFO',
      event: 'ATTENDANCE_CORRECTED',
      attendanceId,
      companyId,
      changedFields: Object.keys(data),
    }));

    return formatRecord(updated);
  }
}

export const attendanceService = new AttendanceService();
