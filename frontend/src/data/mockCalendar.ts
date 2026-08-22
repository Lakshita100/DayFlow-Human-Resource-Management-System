import type { CalendarEvent } from '@/types/calendar.types';

export const mockCalendarEvents: CalendarEvent[] = [
  { id: 'EVT-001', title: 'Company Holiday', type: 'holiday', date: '2026-08-15', description: 'Independence Day' },
  { id: 'EVT-002', title: 'Present', type: 'attendance', date: '2026-08-18', startTime: '09:00', endTime: '18:00', status: 'present' },
  { id: 'EVT-003', title: 'Present', type: 'attendance', date: '2026-08-19', startTime: '09:05', endTime: '18:10', status: 'present' },
  { id: 'EVT-004', title: 'Present', type: 'attendance', date: '2026-08-20', startTime: '08:55', endTime: '17:50', status: 'present' },
  { id: 'EVT-005', title: 'Sick Leave', type: 'leave', date: '2026-08-21', status: 'approved', description: 'Medical appointment' },
  { id: 'EVT-006', title: 'Present', type: 'attendance', date: '2026-08-22', startTime: '09:00', status: 'present' },
  { id: 'EVT-007', title: 'Weekly Off', type: 'weekly-off', date: '2026-08-23' },
  { id: 'EVT-008', title: 'Weekly Off', type: 'weekly-off', date: '2026-08-24' },
  { id: 'EVT-009', title: 'Company Town Hall', type: 'event', date: '2026-08-25', startTime: '10:00', endTime: '11:30', description: 'Quarterly company update meeting', relatedRoute: '/employee/dashboard' },
  { id: 'EVT-010', title: 'Casual Leave', type: 'leave', date: '2026-08-26', status: 'pending', description: 'Personal work' },
  { id: 'EVT-011', title: 'Company Holiday', type: 'holiday', date: '2026-08-26', description: 'Janmashtami' },
  { id: 'EVT-012', title: 'Team Building Event', type: 'event', date: '2026-08-28', startTime: '14:00', endTime: '17:00', description: 'Team outing and activities' },
  { id: 'EVT-013', title: 'Present', type: 'attendance', date: '2026-07-14', startTime: '09:00', endTime: '18:00', status: 'present' },
  { id: 'EVT-014', title: 'Present', type: 'attendance', date: '2026-07-15', startTime: '09:10', endTime: '18:05', status: 'late' },
  { id: 'EVT-015', title: 'Company Holiday', type: 'holiday', date: '2026-07-17', description: 'Muharram' },
  { id: 'EVT-016', title: 'Earned Leave', type: 'leave', date: '2026-07-20', status: 'approved', description: 'Family function' },
  { id: 'EVT-017', title: 'Earned Leave', type: 'leave', date: '2026-07-21', status: 'approved', description: 'Family function' },
  { id: 'EVT-018', title: 'Weekly Off', type: 'weekly-off', date: '2026-07-19' },
  { id: 'EVT-019', title: 'Weekly Off', type: 'weekly-off', date: '2026-07-20' },
  { id: 'EVT-020', title: 'Workshop', type: 'event', date: '2026-07-25', startTime: '09:00', endTime: '13:00', description: 'React best practices workshop' },
];

export function getMockCalendarEvents(): CalendarEvent[] {
  return [...mockCalendarEvents];
}

export function getMockEventsForMonth(year: number, month: number): CalendarEvent[] {
  return mockCalendarEvents.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

export function getMockEventsForDate(dateStr: string): CalendarEvent[] {
  return mockCalendarEvents.filter((e) => e.date === dateStr);
}
