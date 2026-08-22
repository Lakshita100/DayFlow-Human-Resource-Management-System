import { Prisma, LeaveType, LeaveStatus } from '@prisma/client';
import { prisma } from '../config/database.js';

const includeEmployee = {
  employee: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      department: true,
      companyId: true,
      user: { select: { loginId: true, email: true } },
    },
  },
};

export const timeOffRepository = {
  async findConflicts(employeeId: string, from: Date, to: Date) {
    return prisma.timeOff.findMany({
      where: {
        employeeId,
        status: { in: [LeaveStatus.PENDING, LeaveStatus.APPROVED] },
        startDate: { lte: to },
        endDate: { gte: from },
      },
    });
  },

  async create(data: {
    employeeId: string;
    type: LeaveType;
    startDate: Date;
    endDate: Date;
    reason?: string;
    status?: LeaveStatus;
  }) {
    return prisma.timeOff.create({ data });
  },

  async findByIdWithEmployee(id: string) {
    return prisma.timeOff.findUnique({ where: { id }, include: includeEmployee });
  },

  async findManyByEmployee(employeeId: string) {
    return prisma.timeOff.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findCompanyRequests(params: {
    companyId: string;
    employeeId?: string;
    type?: LeaveType;
    status?: LeaveStatus;
    search?: string;
    page: number;
    limit: number;
  }) {
    const { companyId, employeeId, type, status, search, page, limit } = params;

    const where: Prisma.TimeOffWhereInput = {
      ...(type && { type }),
      ...(status && { status }),
      employee: {
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
      },
    };

    const [requests, total] = await Promise.all([
      prisma.timeOff.findMany({
        where,
        include: includeEmployee,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.timeOff.count({ where }),
    ]);

    return { requests, total };
  },

  async updateStatus(id: string, data: { status: LeaveStatus; approvedBy?: string }) {
    return prisma.timeOff.update({ where: { id }, data });
  },

  async getAllocation(employeeId: string, type: LeaveType, year: number) {
    return prisma.leaveAllocation.findUnique({
      where: { employeeId_type_year: { employeeId, type, year } },
    });
  },

  async upsertAllocation(employeeId: string, type: LeaveType, year: number, total: number) {
    return prisma.leaveAllocation.upsert({
      where: { employeeId_type_year: { employeeId, type, year } },
      update: {},
      create: { employeeId, type, year, total, used: 0 },
    });
  },

  async deductAllocation(tx: Prisma.TransactionClient, allocationId: string, days: number) {
    const alloc = await tx.leaveAllocation.findUnique({ where: { id: allocationId } });
    if (!alloc) throw new Error('ALLOCATION_MISSING');
    if (alloc.used + days > alloc.total) throw new Error('INSUFFICIENT_ALLOCATION');
    return tx.leaveAllocation.update({
      where: { id: allocationId },
      data: { used: alloc.used + days },
    });
  },

  async restoreAllocation(tx: Prisma.TransactionClient, allocationId: string, days: number) {
    const alloc = await tx.leaveAllocation.findUnique({ where: { id: allocationId } });
    if (!alloc) throw new Error('ALLOCATION_MISSING');
    return tx.leaveAllocation.update({
      where: { id: allocationId },
      data: { used: Math.max(0, alloc.used - days) },
    });
  },

  async findAllocationById(id: string) {
    return prisma.leaveAllocation.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            companyId: true,
            user: { select: { loginId: true, email: true } },
          },
        },
      },
    });
  },

  async listAllocations(params: {
    companyId: string;
    year: number;
    page: number;
    limit: number;
  }) {
    const { companyId, year, page, limit } = params;
    const where: Prisma.LeaveAllocationWhereInput = { year, employee: { companyId } };

    const [allocations, total] = await Promise.all([
      prisma.leaveAllocation.findMany({
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
        orderBy: [{ employeeId: 'asc' }, { type: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.leaveAllocation.count({ where }),
    ]);

    return { allocations, total };
  },

  async ensureAllocationsForYear(employeeId: string, year: number) {
    const defaults: Array<{ type: LeaveType; total: number }> = [
      { type: LeaveType.PAID, total: 20 },
      { type: LeaveType.SICK, total: 10 },
      { type: LeaveType.UNPAID, total: 365 },
    ];

    for (const d of defaults) {
      await this.getOrCreateAllocation(employeeId, d.type, year, d.total);
    }

    return prisma.leaveAllocation.findMany({
      where: { employeeId, year },
      orderBy: { type: 'asc' },
    });
  },

  async getOrCreateAllocation(employeeId: string, type: LeaveType, year: number, defaultTotal: number) {
    return prisma.leaveAllocation.upsert({
      where: { employeeId_type_year: { employeeId, type, year } },
      update: {},
      create: { employeeId, type, year, total: defaultTotal, used: 0 },
    });
  },
};
