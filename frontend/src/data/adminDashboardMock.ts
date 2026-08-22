import type {
  AdminKpiData,
  AttendanceTrendPoint,
  AttendanceBreakdown,
  ActionRequired,
  PendingLeaveRequest,
  RecentEmployee,
  DepartmentDistribution,
  LeaveAnalytics,
  AdminActivityItem,
  AdminQuickAction,
} from '@/types/admin.types';

export const mockAdminKpi: AdminKpiData = {
  totalEmployees: 148,
  presentToday: 126,
  onLeave: 12,
  absentToday: 10,
};

export const mockAttendanceTrend: AttendanceTrendPoint[] = [
  { day: 'Mon', present: 128, absent: 14, leave: 6 },
  { day: 'Tue', present: 132, absent: 10, leave: 6 },
  { day: 'Wed', present: 126, absent: 16, leave: 6 },
  { day: 'Thu', present: 134, absent: 8, leave: 6 },
  { day: 'Fri', present: 126, absent: 10, leave: 12 },
];

export const mockAttendanceBreakdown: AttendanceBreakdown = {
  present: 126,
  absent: 10,
  onLeave: 12,
  halfDay: 4,
  weeklyOff: 8,
};

export const mockActionRequired: ActionRequired[] = [
  {
    id: '1',
    type: 'critical',
    title: '12 Leave Requests Pending',
    description: 'Review employee leave applications awaiting approval.',
    actionLabel: 'Review Requests',
    actionPath: '/admin/time-off',
    count: 12,
  },
  {
    id: '2',
    type: 'warning',
    title: '10 Employees Absent Today',
    description: 'Multiple employees are marked absent without prior notice.',
    actionLabel: 'View Attendance',
    actionPath: '/admin/attendance',
    count: 10,
  },
  {
    id: '3',
    type: 'info',
    title: '3 Documents Pending Verification',
    description: 'Employee documents are awaiting HR verification.',
    actionLabel: 'Review Documents',
    actionPath: '/admin/employees',
    count: 3,
  },
];

export const mockPendingLeaveRequests: PendingLeaveRequest[] = [
  {
    id: '1',
    employeeName: 'Priya Sharma',
    employeeId: 'EMP024',
    department: 'Engineering',
    leaveType: 'Sick Leave',
    startDate: '22 Aug 2026',
    endDate: '24 Aug 2026',
    days: 3,
    appliedOn: '20 Aug 2026',
    status: 'pending',
  },
  {
    id: '2',
    employeeName: 'Amit Patel',
    employeeId: 'EMP037',
    department: 'Marketing',
    leaveType: 'Paid Leave',
    startDate: '28 Aug 2026',
    endDate: '29 Aug 2026',
    days: 2,
    appliedOn: '21 Aug 2026',
    status: 'pending',
  },
  {
    id: '3',
    employeeName: 'Neha Gupta',
    employeeId: 'EMP015',
    department: 'Design',
    leaveType: 'Sick Leave',
    startDate: '25 Aug 2026',
    endDate: '26 Aug 2026',
    days: 2,
    appliedOn: '22 Aug 2026',
    status: 'pending',
  },
  {
    id: '4',
    employeeName: 'Rohit Verma',
    employeeId: 'EMP042',
    department: 'Finance',
    leaveType: 'Unpaid Leave',
    startDate: '01 Sep 2026',
    endDate: '03 Sep 2026',
    days: 3,
    appliedOn: '22 Aug 2026',
    status: 'pending',
  },
  {
    id: '5',
    employeeName: 'Ananya Singh',
    employeeId: 'EMP019',
    department: 'Engineering',
    leaveType: 'Paid Leave',
    startDate: '05 Sep 2026',
    endDate: '06 Sep 2026',
    days: 2,
    appliedOn: '21 Aug 2026',
    status: 'pending',
  },
];

export const mockRecentEmployees: RecentEmployee[] = [
  {
    id: '1',
    firstName: 'Kavya',
    lastName: 'Nair',
    employeeId: 'EMP048',
    department: 'Engineering',
    designation: 'Frontend Developer',
    dateOfJoining: '18 Aug 2026',
    status: 'ACTIVE',
  },
  {
    id: '2',
    firstName: 'Arjun',
    lastName: 'Mehta',
    employeeId: 'EMP047',
    department: 'Marketing',
    designation: 'Content Strategist',
    dateOfJoining: '12 Aug 2026',
    status: 'ACTIVE',
  },
  {
    id: '3',
    firstName: 'Divya',
    lastName: 'Reddy',
    employeeId: 'EMP046',
    department: 'Design',
    designation: 'UI/UX Designer',
    dateOfJoining: '05 Aug 2026',
    status: 'ACTIVE',
  },
  {
    id: '4',
    firstName: 'Suresh',
    lastName: 'Kumar',
    employeeId: 'EMP045',
    department: 'Operations',
    designation: 'Operations Analyst',
    dateOfJoining: '01 Aug 2026',
    status: 'ACTIVE',
  },
];

export const mockDepartmentDistribution: DepartmentDistribution[] = [
  { department: 'Engineering', count: 42 },
  { department: 'Design', count: 18 },
  { department: 'Marketing', count: 22 },
  { department: 'HR', count: 8 },
  { department: 'Finance', count: 14 },
  { department: 'Operations', count: 32 },
  { department: 'Sales', count: 12 },
];

export const mockLeaveAnalytics: LeaveAnalytics = {
  totalRequests: 86,
  approved: 61,
  pending: 12,
  rejected: 13,
  byType: [
    { type: 'Paid Leave', percentage: 45, color: '#7c3aed' },
    { type: 'Sick Leave', percentage: 30, color: '#f59e0b' },
    { type: 'Unpaid Leave', percentage: 25, color: '#6b7280' },
  ],
};

export const mockAdminActivity: AdminActivityItem[] = [
  {
    id: '1',
    type: 'employee_added',
    title: 'New employee added',
    description: 'Kavya Nair was added to Engineering as Frontend Developer.',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'leave_approved',
    title: 'Leave request approved',
    description: 'Amit Patel\'s paid leave (28-29 Aug) was approved.',
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    type: 'profile_updated',
    title: 'Employee profile updated',
    description: 'Neha Gupta updated contact information.',
    timestamp: '6 hours ago',
  },
  {
    id: '4',
    type: 'salary_updated',
    title: 'Salary structure updated',
    description: 'Rohit Verma\'s salary structure was modified.',
    timestamp: '1 day ago',
  },
  {
    id: '5',
    type: 'attendance_flagged',
    title: 'Attendance flagged',
    description: '3 employees have been absent for 3+ consecutive days.',
    timestamp: '1 day ago',
  },
  {
    id: '6',
    type: 'leave_rejected',
    title: 'Leave request rejected',
    description: 'Ananya Singh\'s unpaid leave request was rejected.',
    timestamp: '2 days ago',
  },
];

export const mockAdminQuickActions: AdminQuickAction[] = [
  {
    label: 'Add Employee',
    description: 'Onboard new',
    icon: 'user-plus',
    path: '/admin/employees',
  },
  {
    label: 'View Employees',
    description: 'Manage team',
    icon: 'users',
    path: '/admin/employees',
  },
  {
    label: 'Review Leave',
    description: '12 pending',
    icon: 'calendar-off',
    path: '/admin/time-off',
  },
  {
    label: 'View Attendance',
    description: 'Track hours',
    icon: 'clock',
    path: '/admin/attendance',
  },
  {
    label: 'Manage Payroll',
    description: 'Salary data',
    icon: 'wallet',
    path: '/admin/payroll',
  },
];
