export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave' | 'holiday' | 'none';

export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected';

export type NotificationType = 'info' | 'success' | 'warning' | 'leave' | 'payroll' | 'team';

export interface DashboardSummary {
  todayStatus: {
    status: 'present' | 'absent' | 'half_day';
    checkedInAt: string | null;
  };
  workingHours: {
    total: string;
    description: string;
  };
  monthlyAttendance: {
    present: number;
    totalWorking: number;
    description: string;
  };
  leaveBalance: {
    total: number;
    description: string;
  };
}

export interface AttendanceDay {
  date: number;
  status: AttendanceStatus;
}

export interface AttendanceMonth {
  year: number;
  month: number;
  days: AttendanceDay[];
  summary: {
    present: number;
    absent: number;
    halfDay: number;
    leave: number;
  };
}

export interface LeaveBalanceDetail {
  type: string;
  total: number;
  used: number;
  color: string;
}

export interface UpcomingLeave {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveRequestStatus;
  reason?: string;
}

export interface DashboardNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  statusColor?: string;
}
