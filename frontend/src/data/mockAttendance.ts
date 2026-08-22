import type {
  AttendanceRecord,
  TodayAttendance,
  MonthlyOverview,
  AttendanceTrend,
  AttendancePaginatedResponse,
} from '@/types/attendance.types';

export const mockTodayAttendance: TodayAttendance = {
  status: 'not_checked_in',
  checkInTime: null,
  checkOutTime: null,
  workingHours: null,
  date: '2026-08-22',
};

export const mockMonthlyOverview: MonthlyOverview = {
  present: 14,
  halfDay: 1,
  absent: 1,
  leave: 2,
  weeklyOff: 4,
  totalWorkingDays: 22,
  attendancePercentage: 72.73,
};

export const mockAttendanceTrend: AttendanceTrend = {
  thisMonth: [
    { label: 'Week 1', percentage: 100 },
    { label: 'Week 2', percentage: 85.71 },
    { label: 'Week 3', percentage: 71.43 },
    { label: 'Week 4', percentage: 66.67 },
  ],
  lastMonth: [
    { label: 'Week 1', percentage: 100 },
    { label: 'Week 2', percentage: 100 },
    { label: 'Week 3', percentage: 85.71 },
    { label: 'Week 4', percentage: 90 },
  ],
  last3Months: [
    { label: 'Jun', percentage: 90.48 },
    { label: 'Jul', percentage: 95.24 },
    { label: 'Aug', percentage: 72.73 },
  ],
};

const mockRecords: AttendanceRecord[] = [
  {
    id: 'att-001',
    date: '2026-08-22',
    day: 'Friday',
    checkIn: '09:15 AM',
    checkOut: null,
    workingHours: '03h 45m',
    status: 'present',
    remarks: 'Working',
  },
  {
    id: 'att-002',
    date: '2026-08-21',
    day: 'Thursday',
    checkIn: '09:08 AM',
    checkOut: '06:03 PM',
    workingHours: '08h 55m',
    status: 'present',
    remarks: '-',
  },
  {
    id: 'att-003',
    date: '2026-08-20',
    day: 'Wednesday',
    checkIn: '09:12 AM',
    checkOut: '06:10 PM',
    workingHours: '08h 58m',
    status: 'present',
    remarks: '-',
  },
  {
    id: 'att-004',
    date: '2026-08-19',
    day: 'Tuesday',
    checkIn: null,
    checkOut: null,
    workingHours: null,
    status: 'weekly_off',
    remarks: '-',
  },
  {
    id: 'att-005',
    date: '2026-08-18',
    day: 'Monday',
    checkIn: null,
    checkOut: null,
    workingHours: null,
    status: 'weekly_off',
    remarks: '-',
  },
  {
    id: 'att-006',
    date: '2026-08-15',
    day: 'Friday',
    checkIn: '09:05 AM',
    checkOut: '01:30 PM',
    workingHours: '04h 25m',
    status: 'half_day',
    remarks: 'Left early - personal',
  },
  {
    id: 'att-007',
    date: '2026-08-14',
    day: 'Thursday',
    checkIn: '09:10 AM',
    checkOut: '06:05 PM',
    workingHours: '08h 55m',
    status: 'present',
    remarks: '-',
  },
  {
    id: 'att-008',
    date: '2026-08-13',
    day: 'Wednesday',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    workingHours: '09h 00m',
    status: 'present',
    remarks: '-',
  },
  {
    id: 'att-009',
    date: '2026-08-12',
    day: 'Tuesday',
    checkIn: null,
    checkOut: null,
    workingHours: null,
    status: 'leave',
    remarks: 'Sick Leave',
  },
  {
    id: 'att-010',
    date: '2026-08-11',
    day: 'Monday',
    checkIn: '09:20 AM',
    checkOut: '06:15 PM',
    workingHours: '08h 55m',
    status: 'present',
    remarks: '-',
  },
  {
    id: 'att-011',
    date: '2026-08-08',
    day: 'Friday',
    checkIn: '09:05 AM',
    checkOut: '06:10 PM',
    workingHours: '09h 05m',
    status: 'present',
    remarks: '-',
  },
  {
    id: 'att-012',
    date: '2026-08-07',
    day: 'Thursday',
    checkIn: '09:12 AM',
    checkOut: '06:08 PM',
    workingHours: '08h 56m',
    status: 'present',
    remarks: '-',
  },
  {
    id: 'att-013',
    date: '2026-08-06',
    day: 'Wednesday',
    checkIn: null,
    checkOut: null,
    workingHours: null,
    status: 'weekly_off',
    remarks: '-',
  },
  {
    id: 'att-014',
    date: '2026-08-05',
    day: 'Tuesday',
    checkIn: null,
    checkOut: null,
    workingHours: null,
    status: 'weekly_off',
    remarks: '-',
  },
  {
    id: 'att-015',
    date: '2026-08-04',
    day: 'Monday',
    checkIn: '09:18 AM',
    checkOut: '06:22 PM',
    workingHours: '09h 04m',
    status: 'present',
    remarks: '-',
  },
  {
    id: 'att-016',
    date: '2026-08-01',
    day: 'Friday',
    checkIn: '09:30 AM',
    checkOut: null,
    workingHours: null,
    status: 'absent',
    remarks: 'No show',
  },
  {
    id: 'att-017',
    date: '2026-07-31',
    day: 'Thursday',
    checkIn: '09:08 AM',
    checkOut: '06:05 PM',
    workingHours: '08h 57m',
    status: 'present',
    remarks: '-',
  },
  {
    id: 'att-018',
    date: '2026-07-30',
    day: 'Wednesday',
    checkIn: '09:14 AM',
    checkOut: '06:12 PM',
    workingHours: '08h 58m',
    status: 'present',
    remarks: '-',
  },
  {
    id: 'att-019',
    date: '2026-07-29',
    day: 'Tuesday',
    checkIn: null,
    checkOut: null,
    workingHours: null,
    status: 'leave',
    remarks: 'Casual Leave',
  },
  {
    id: 'att-020',
    date: '2026-07-28',
    day: 'Monday',
    checkIn: '09:02 AM',
    checkOut: '06:00 PM',
    workingHours: '08h 58m',
    status: 'present',
    remarks: '-',
  },
  {
    id: 'att-021',
    date: '2026-07-25',
    day: 'Friday',
    checkIn: '09:10 AM',
    checkOut: '06:08 PM',
    workingHours: '08h 58m',
    status: 'present',
    remarks: '-',
  },
  {
    id: 'att-022',
    date: '2026-07-24',
    day: 'Thursday',
    checkIn: '09:06 AM',
    checkOut: '06:04 PM',
    workingHours: '08h 58m',
    status: 'present',
    remarks: '-',
  },
];

function formatMockTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatMockDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseMockTime(time: string | null, date: Date): number | null {
  if (!time) return null;
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  date.setHours(hours, minutes, 0, 0);
  return date.getTime();
}

export function simulateMockCheckIn(prev: TodayAttendance | undefined): TodayAttendance {
  const now = new Date();
  if (prev && prev.status === 'checked_in') return prev;
  if (prev && prev.status === 'checked_out') return prev;
  return {
    status: 'checked_in',
    checkInTime: formatMockTime(now),
    checkOutTime: null,
    workingHours: '00h 00m',
    date: formatMockDate(now),
  };
}

export function simulateMockCheckOut(prev: TodayAttendance | undefined): TodayAttendance {
  if (!prev || prev.status !== 'checked_in') return prev ?? mockTodayAttendance;
  const now = new Date();
  const startTime = parseMockTime(prev.checkInTime, new Date());
  let workingHours = prev.workingHours;
  if (startTime !== null) {
    const elapsedMinutes = Math.max(0, Math.floor((now.getTime() - startTime) / 60000));
    workingHours = `${String(Math.floor(elapsedMinutes / 60)).padStart(2, '0')}h ${String(
      elapsedMinutes % 60
    ).padStart(2, '0')}m`;
  }
  return {
    ...prev,
    status: 'checked_out',
    checkOutTime: formatMockTime(now),
    workingHours,
  };
}

export function getMockAttendancePage(
  page: number,
  limit: number,
  month: number,
  year: number,
  statusFilter: string = 'all',
): AttendancePaginatedResponse {
  let filtered = mockRecords;

  filtered = filtered.filter((r) => {
    const d = new Date(r.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  if (statusFilter !== 'all') {
    filtered = filtered.filter((r) => r.status === statusFilter);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const records = filtered.slice(start, start + limit);

  return { records, total, page, limit, totalPages };
}
