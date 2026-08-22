import { attendanceRepository } from '../repositories/attendance.repository.js';
import { employeeRepository } from '../repositories/employee.repository.js';
import { AttendanceStatus } from '@prisma/client';

export class AttendanceService {
  async checkIn(userId: string) {
    const employee = await employeeRepository.findByUserId(userId);
    if (!employee) {
      throw new Error('Employee record not found for this user');
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const existing = await attendanceRepository.findTodayByEmployee(employee.id, startOfDay, endOfDay);
    if (existing && existing.checkIn) {
      throw new Error('You have already checked in today');
    }

    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const record = await attendanceRepository.createCheckIn(employee.id, todayDate, now);

    return {
      id: record.id,
      date: record.date,
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      status: record.status,
      workHours: record.workHours,
      extraHours: record.extraHours,
    };
  }

  async checkOut(userId: string) {
    const employee = await employeeRepository.findByUserId(userId);
    if (!employee) {
      throw new Error('Employee record not found for this user');
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const existing = await attendanceRepository.findTodayByEmployee(employee.id, startOfDay, endOfDay);
    if (!existing || !existing.checkIn) {
      throw new Error('You must check in before checking out');
    }
    if (existing.checkOut) {
      throw new Error('You have already checked out today');
    }

    const checkInMs = new Date(existing.checkIn).getTime();
    const checkOutMs = now.getTime();
    const diffHours = (checkOutMs - checkInMs) / (1000 * 60 * 60);
    const workHours = Math.round(diffHours * 100) / 100;
    const extraHours = Math.max(0, Math.round((workHours - 8) * 100) / 100);

    const status = workHours < 4 ? AttendanceStatus.HALF_DAY : AttendanceStatus.PRESENT;

    const updated = await attendanceRepository.updateCheckOut(existing.id, now, workHours, extraHours, status);

    return {
      id: updated.id,
      date: updated.date,
      checkIn: updated.checkIn,
      checkOut: updated.checkOut,
      status: updated.status,
      workHours: updated.workHours,
      extraHours: updated.extraHours,
    };
  }

  async getTodayAttendance(userId: string) {
    const employee = await employeeRepository.findByUserId(userId);
    if (!employee) {
      throw new Error('Employee record not found');
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const record = await attendanceRepository.findTodayByEmployee(employee.id, startOfDay, endOfDay);

    return {
      date: now.toISOString().split('T')[0],
      checkIn: record?.checkIn ? new Date(record.checkIn).toTimeString().split(' ')[0] : null,
      checkOut: record?.checkOut ? new Date(record.checkOut).toTimeString().split(' ')[0] : null,
      status: record?.status || AttendanceStatus.ABSENT,
      workHours: record?.workHours || 0,
      extraHours: record?.extraHours || 0,
      isCheckedIn: !!record?.checkIn,
      isCheckedOut: !!record?.checkOut,
    };
  }

  async getAttendanceRecords(companyId: string, options: { page?: string; limit?: string; month?: string; year?: string; status?: AttendanceStatus; employeeId?: string }) {
    const page = Math.max(1, parseInt(options.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(options.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const where: any = {
      employee: { companyId },
    };

    if (options.employeeId) {
      where.employeeId = options.employeeId;
    }

    if (options.status) {
      where.status = options.status;
    }

    if (options.month && options.year) {
      const m = parseInt(options.month, 10);
      const y = parseInt(options.year, 10);
      where.date = {
        gte: new Date(y, m - 1, 1),
        lte: new Date(y, m, 0, 23, 59, 59),
      };
    }

    const { items, total } = await attendanceRepository.findRecords(where, skip, limit);

    const formatted = items.map((r) => ({
      id: r.id,
      employeeId: r.employee.employeeId,
      employeeName: `${r.employee.firstName} ${r.employee.lastName}`,
      department: r.employee.department,
      date: new Date(r.date).toISOString().split('T')[0],
      checkIn: r.checkIn ? new Date(r.checkIn).toTimeString().split(' ')[0]?.slice(0, 5) : null,
      checkOut: r.checkOut ? new Date(r.checkOut).toTimeString().split(' ')[0]?.slice(0, 5) : null,
      workHours: r.workHours || 0,
      extraHours: r.extraHours || 0,
      status: r.status,
    }));

    return {
      items: formatted,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getMonthlyOverview(companyId: string, month: number, year: number) {
    return attendanceRepository.getMonthlyOverview(companyId, month, year);
  }
}

export const attendanceService = new AttendanceService();
