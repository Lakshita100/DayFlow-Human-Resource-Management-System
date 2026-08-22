import { PrismaClient, LeaveStatus, LeaveType, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class LeaveRepository {
  async getLeaveAllocations(employeeId: string, year: number) {
    return prisma.leaveAllocation.findMany({
      where: { employeeId, year },
    });
  }

  async createDefaultAllocation(employeeId: string, year: number) {
    const defaultTypes: Array<{ type: LeaveType; total: number }> = [
      { type: LeaveType.PAID, total: 15 },
      { type: LeaveType.SICK, total: 10 },
      { type: LeaveType.UNPAID, total: 30 },
    ];

    return prisma.$transaction(
      defaultTypes.map((item) =>
        prisma.leaveAllocation.upsert({
          where: {
            employeeId_type_year: {
              employeeId,
              type: item.type,
              year,
            },
          },
          update: {},
          create: {
            employeeId,
            type: item.type,
            total: item.total,
            used: 0,
            year,
          },
        })
      )
    );
  }

  async createLeaveRequest(employeeId: string, type: LeaveType, startDate: Date, endDate: Date, reason?: string) {
    return prisma.timeOff.create({
      data: {
        employeeId,
        type,
        startDate,
        endDate,
        reason,
        status: LeaveStatus.PENDING,
      },
    });
  }

  async findLeaveRequests(where: Prisma.TimeOffWhereInput, skip: number, take: number) {
    const [items, total] = await Promise.all([
      prisma.timeOff.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              employeeId: true,
              department: true,
              designation: true,
            },
          },
        },
      }),
      prisma.timeOff.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return prisma.timeOff.findUnique({
      where: { id },
      include: {
        employee: true,
      },
    });
  }

  async updateLeaveStatus(id: string, status: LeaveStatus, approvedBy?: string) {
    return prisma.timeOff.update({
      where: { id },
      data: {
        status,
        approvedBy,
      },
    });
  }

  async incrementUsedDays(employeeId: string, type: LeaveType, days: number, year: number) {
    return prisma.leaveAllocation.updateMany({
      where: { employeeId, type, year },
      data: {
        used: { increment: days },
      },
    });
  }
}

export const leaveRepository = new LeaveRepository();
