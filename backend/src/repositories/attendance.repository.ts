import { PrismaClient, AttendanceStatus, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class AttendanceRepository {
  async findTodayByEmployee(employeeId: string, startOfDay: Date, endOfDay: Date) {
    return prisma.attendance.findFirst({
      where: {
        employeeId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }

  async createCheckIn(employeeId: string, date: Date, checkInTime: Date) {
    return prisma.attendance.create({
      data: {
        employeeId,
        date,
        checkIn: checkInTime,
        status: AttendanceStatus.PRESENT,
      },
    });
  }

  async updateCheckOut(id: string, checkOutTime: Date, workHours: number, extraHours: number, status: AttendanceStatus) {
    return prisma.attendance.update({
      where: { id },
      data: {
        checkOut: checkOutTime,
        workHours,
        extraHours,
        status,
      },
    });
  }

  async findRecords(where: Prisma.AttendanceWhereInput, skip: number, take: number) {
    const [items, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip,
        take,
        orderBy: { date: 'desc' },
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
      prisma.attendance.count({ where }),
    ]);

    return { items, total };
  }

  async getMonthlyOverview(companyId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const records = await prisma.attendance.findMany({
      where: {
        employee: { companyId },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalDays = endDate.getDate();
    const present = records.filter((r) => r.status === AttendanceStatus.PRESENT).length;
    const absent = records.filter((r) => r.status === AttendanceStatus.ABSENT).length;
    const halfDay = records.filter((r) => r.status === AttendanceStatus.HALF_DAY).length;
    const leave = records.filter((r) => r.status === AttendanceStatus.LEAVE).length;

    return {
      month,
      year,
      totalDays,
      present,
      absent,
      halfDay,
      leave,
    };
  }
}

export const attendanceRepository = new AttendanceRepository();
