export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave' | 'weekly_off';

export type AttendanceAction = 'not_checked_in' | 'checked_in' | 'checked_out';

export interface AttendanceRecord {
  id: string;
  date: string;
  day: string;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: string | null;
  status: AttendanceStatus;
  remarks: string;
  extraHours?: string | null;
}

export interface TodayAttendance {
  status: AttendanceAction;
  checkInTime: string | null;
  checkOutTime: string | null;
  workingHours: string | null;
  date: string;
}

export interface MonthlyOverview {
  present: number;
  halfDay: number;
  absent: number;
  leave: number;
  weeklyOff: number;
  totalWorkingDays: number;
  attendancePercentage: number;
}

export interface AttendanceTrendPoint {
  label: string;
  percentage: number;
}

export interface AttendanceTrend {
  thisMonth: AttendanceTrendPoint[];
  lastMonth: AttendanceTrendPoint[];
  last3Months: AttendanceTrendPoint[];
}

export interface AttendanceFilters {
  status: AttendanceStatus | 'all';
  dateFrom: string | null;
  dateTo: string | null;
}

export interface AttendanceQueryParams {
  page: number;
  limit: number;
  month: number;
  year: number;
  status: AttendanceStatus | 'all';
  dateFrom: string | null;
  dateTo: string | null;
}

export interface AttendancePaginatedResponse {
  records: AttendanceRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
