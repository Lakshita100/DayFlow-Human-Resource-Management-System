import { Prisma, AttendanceStatus } from '@prisma/client';
import { prisma } from '../config/database.js';

export function startOfDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export const attendanceRepository = {
  async findByEmployeeAndDate(employeeId: string, date: Date) {
    return prisma.attendance.findUnique({
      where: { employeeId_date: { employeeId, date: startOfDay(date) } },
    });
  },

  async create(data: {
    employeeId: string;
    date: Date;
    checkIn: Date;
    status: AttendanceStatus;
  }) {
    return prisma.attendance.create({ data });
  },

  async update(id: string, data: Prisma.AttendanceUpdateInput) {
    return prisma.attendance.update({ where: { id }, data });
  },

  async findByIdWithEmployee(id: string) {
    return prisma.attendance.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            user: { select: { id: true, loginId: true, email: true } },
            company: { select: { id: true, name: true } },
          },
        },
      },
    });
  },

  async findRangeForEmployee(employeeId: string, from: Date, to: Date) {
    return prisma.attendance.findMany({
      where: { employeeId, date: { gte: startOfDay(from), lte: startOfDay(to) } },
      orderBy: { date: 'desc' },
    });
  },

  async findCompanyAttendance(params: {
    companyId: string;
    date?: Date;
    from?: Date;
    to?: Date;
    employeeId?: string;
    search?: string;
    page: number;
    limit: number;
  }) {
    const { companyId, date, from, to, employeeId, search, page, limit } = params;

    const employeeWhere: Prisma.EmployeeWhereInput = {
      companyId,
      ...(employeeId && { id: employeeId }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { user: { loginId: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const where: Prisma.AttendanceWhereInput = {
      employee: employeeWhere,
      ...(date && { date: startOfDay(date) }),
      ...((from || to) && {
        date: {
          ...(from && { gte: startOfDay(from) }),
          ...(to && { lte: startOfDay(to) }),
        },
      }),
    };

    const [records, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              department: true,
              designation: true,
              profilePicture: true,
              user: { select: { loginId: true, email: true } },
            },
          },
        },
        orderBy: [{ date: 'desc' }, { checkIn: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.attendance.count({ where }),
    ]);

    return { records, total };
  },

  async aggregateRange(params: { employeeIds: string[]; from: Date; to: Date }) {
    const { employeeIds, from, to } = params;
    return prisma.attendance.groupBy({
      by: ['status'],
      where: {
        employeeId: { in: employeeIds },
        date: { gte: startOfDay(from), lte: startOfDay(to) },
      },
      _count: { _all: true },
      _sum: { workHours: true, extraHours: true },
    });
  },

  async sumHoursForEmployees(employeeIds: string[], from: Date, to: Date) {
    const agg = await prisma.attendance.aggregate({
      where: {
        employeeId: { in: employeeIds },
        date: { gte: startOfDay(from), lte: startOfDay(to) },
      },
      _sum: { workHours: true, extraHours: true },
    });
    return { workHours: agg._sum.workHours ?? 0, extraHours: agg._sum.extraHours ?? 0 };
  },

  async countByStatus(employeeIds: string[], from: Date, to: Date) {
    const grouped = await prisma.attendance.groupBy({
      by: ['status'],
      where: {
        employeeId: { in: employeeIds },
        date: { gte: startOfDay(from), lte: startOfDay(to) },
      },
      _count: { status: true },
    });
    const counts: Record<string, number> = {};
    for (const g of grouped) {
      counts[g.status] = g._count.status;
    }
    return counts;
  },

  async findApprovedLeaveDates(employeeId: string, from: Date, to: Date) {
    return prisma.timeOff.findMany({
      where: {
        employeeId,
        status: 'APPROVED',
        startDate: { lte: startOfDay(to) },
        endDate: { gte: startOfDay(from) },
      },
      select: { type: true, startDate: true, endDate: true },
    });
  },

  async findOnLeaveEmployeeCount(companyId: string, date: Date) {
    return prisma.timeOff.count({
      where: {
        status: 'APPROVED',
        startDate: { lte: startOfDay(date) },
        endDate: { gte: startOfDay(date) },
        employee: { companyId },
      },
    });
  },
};
