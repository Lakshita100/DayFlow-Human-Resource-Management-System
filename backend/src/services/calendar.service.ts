import { calendarRepository } from '../repositories/calendar.repository.js';
import { employeeRepository } from '../repositories/employee.repository.js';

export class CalendarService {
  async getCalendarEvents(userId: string, year?: number, month?: number) {
    const employee = await employeeRepository.findByUserId(userId);
    if (!employee) {
      throw new Error('Employee record not found');
    }

    const currentYear = year || new Date().getFullYear();
    const currentMonth = month || new Date().getMonth() + 1;

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const [attendanceList, leaveList] = await Promise.all([
      calendarRepository.getAttendanceEvents(employee.id, startDate, endDate),
      calendarRepository.getLeaveEvents(employee.id, startDate, endDate),
    ]);

    const events: Array<{
      id: string;
      title: string;
      date: string;
      type: 'attendance' | 'leave' | 'holiday';
      status: string;
      details?: string;
    }> = [];

    attendanceList.forEach((att) => {
      events.push({
        id: `att-${att.id}`,
        title: `Attendance: ${att.status}`,
        date: new Date(att.date).toISOString().split('T')[0],
        type: 'attendance',
        status: att.status,
        details: att.workHours ? `${att.workHours} hrs worked` : undefined,
      });
    });

    leaveList.forEach((l) => {
      events.push({
        id: `leave-${l.id}`,
        title: `${l.type} Leave (Approved)`,
        date: new Date(l.startDate).toISOString().split('T')[0],
        type: 'leave',
        status: l.status,
        details: l.reason || undefined,
      });
    });

    return events;
  }
}

export const calendarService = new CalendarService();
