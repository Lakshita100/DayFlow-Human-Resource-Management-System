import type {
  DashboardSummary,
  AttendanceMonth,
  LeaveBalanceDetail,
  UpcomingLeave,
  DashboardNotification,
  ActivityItem,
} from '@/types/dashboard.types';

export const mockDashboardSummary: DashboardSummary = {
  todayStatus: {
    status: 'present',
    checkedInAt: '09:15 AM',
  },
  workingHours: {
    total: '03h 45m',
    description: "Today's total time",
  },
  monthlyAttendance: {
    present: 21,
    totalWorking: 26,
    description: 'Days Present',
  },
  leaveBalance: {
    total: 12,
    description: 'Days Available',
  },
};

function generateAttendanceDays(): AttendanceMonth['days'] {
  const days: AttendanceMonth['days'] = [];
  const totalDays = 31;

  const statuses: Array<'present' | 'absent' | 'half_day' | 'leave' | 'holiday' | 'none'> = [
    'present', 'present', 'present', 'present', 'present',
    'present', 'holiday', 'present', 'present', 'present',
    'present', 'present', 'half_day', 'present', 'present',
    'present', 'present', 'present', 'holiday', 'present',
    'present', 'present', 'leave', 'leave', 'present',
    'present', 'present', 'present', 'present', 'present', 'none',
  ];

  for (let i = 1; i <= totalDays; i++) {
    days.push({
      date: i,
      status: statuses[i - 1] ?? 'none',
    });
  }
  return days;
}

export const mockAttendanceMonth: AttendanceMonth = {
  year: 2026,
  month: 5,
  days: generateAttendanceDays(),
  summary: {
    present: 21,
    absent: 1,
    halfDay: 1,
    leave: 2,
  },
};

export const mockLeaveBalance: LeaveBalanceDetail[] = [
  { type: 'Paid Leave', total: 12, used: 4, color: '#7c3aed' },
  { type: 'Sick Leave', total: 6, used: 3, color: '#f59e0b' },
  { type: 'Unpaid Leave', total: 3, used: 2, color: '#6b7280' },
];

export const mockUpcomingLeaves: UpcomingLeave[] = [
  {
    id: '1',
    type: 'Sick Leave',
    startDate: '22 May 2026',
    endDate: '24 May 2026',
    days: 3,
    status: 'pending',
    reason: 'Medical appointment',
  },
  {
    id: '2',
    type: 'Paid Leave',
    startDate: '30 May 2026',
    endDate: '31 May 2026',
    days: 2,
    status: 'approved',
  },
];

export const mockNotifications: DashboardNotification[] = [
  {
    id: '1',
    type: 'leave',
    title: 'Leave request submitted',
    description: 'Your leave request has been submitted successfully.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'payroll',
    title: 'Monthly payslip available',
    description: 'Your monthly payslip for May 2026 is now available.',
    timestamp: '1 day ago',
    read: false,
  },
  {
    id: '3',
    type: 'team',
    title: 'Team announcement',
    description: 'Team outing scheduled for next Friday.',
    timestamp: '2 days ago',
    read: true,
  },
];

export const mockRecentActivity: ActivityItem[] = [
  {
    id: '1',
    icon: 'clock',
    title: 'Checked in',
    description: 'Today, 09:15 AM',
    timestamp: '2 hours ago',
    status: 'Present',
    statusColor: 'green',
  },
  {
    id: '2',
    icon: 'calendar-off',
    title: 'Leave request submitted',
    description: 'Sick Leave \u2022 22 May \u2013 24 May',
    timestamp: 'Yesterday',
    status: 'Pending',
    statusColor: 'yellow',
  },
  {
    id: '3',
    icon: 'wallet',
    title: 'Payslip generated',
    description: 'May 2026',
    timestamp: '3 days ago',
    status: 'Available',
    statusColor: 'blue',
  },
  {
    id: '4',
    icon: 'check-circle',
    title: 'Leave approved',
    description: 'Paid Leave \u2022 30 May \u2013 31 May',
    timestamp: '5 days ago',
    status: 'Approved',
    statusColor: 'green',
  },
];
