import {
  LayoutDashboard,
  User,
  Clock,
  CalendarOff,
  Wallet,
  FileText,
  Bell,
  Calendar,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const employeeNavigation: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
      { label: 'My Profile', path: '/employee/profile', icon: User },
      { label: 'Attendance', path: '/employee/attendance', icon: Clock },
      { label: 'Leave', path: '/employee/leave', icon: CalendarOff },
    ],
  },
  {
    title: 'Work',
    items: [
      { label: 'My Salary', path: '/employee/salary', icon: Wallet },
      { label: 'Documents', path: '/employee/documents', icon: FileText },
      { label: 'Notifications', path: '/employee/notifications', icon: Bell },
      { label: 'Calendar', path: '/employee/calendar', icon: Calendar },
      { label: 'Settings', path: '/employee/settings', icon: Settings },
    ],
  },
];

export const adminNavigation: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Employees', path: '/admin/employees', icon: Users },
      { label: 'Attendance', path: '/admin/attendance', icon: Clock },
      { label: 'Time-Off', path: '/admin/time-off', icon: CalendarOff },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Payroll', path: '/admin/payroll', icon: Wallet },
      { label: 'Notifications', path: '/admin/notifications', icon: Bell },
      { label: 'Settings', path: '/admin/settings', icon: Settings },
    ],
  },
];
