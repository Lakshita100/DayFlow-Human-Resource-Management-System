import { PrismaClient, LeaveStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class CalendarRepository {
  async getAttendanceEvents(employeeId: string, startDate: Date, endDate: Date) {
    return prisma.attendance.findMany({
      where: {
        employeeId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async getLeaveEvents(employeeId: string, startDate: Date, endDate: Date) {
    return prisma.timeOff.findMany({
      where: {
        employeeId,
        status: LeaveStatus.APPROVED,
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
    });
  }
}

export const calendarRepository = new CalendarRepository();
