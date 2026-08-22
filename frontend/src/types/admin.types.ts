export interface AdminKpiData {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  absentToday: number;
}

export interface AttendanceTrendPoint {
  day: string;
  present: number;
  absent: number;
  leave: number;
}

export interface AttendanceBreakdown {
  present: number;
  absent: number;
  onLeave: number;
  halfDay: number;
  weeklyOff: number;
}

export interface ActionRequired {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  actionLabel: string;
  actionPath: string;
  count: number;
}

export interface PendingLeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  appliedOn: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface RecentEmployee {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface DepartmentDistribution {
  department: string;
  count: number;
}

export interface LeaveAnalytics {
  totalRequests: number;
  approved: number;
  pending: number;
  rejected: number;
  byType: {
    type: string;
    percentage: number;
    color: string;
  }[];
}

export interface AdminActivityItem {
  id: string;
  type: 'employee_added' | 'leave_approved' | 'leave_rejected' | 'profile_updated' | 'salary_updated' | 'attendance_flagged';
  title: string;
  description: string;
  timestamp: string;
}

export interface AdminQuickAction {
  label: string;
  description: string;
  icon: string;
  path: string;
}
