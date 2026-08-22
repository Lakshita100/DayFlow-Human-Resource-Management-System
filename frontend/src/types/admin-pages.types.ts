export interface EmployeeListItem {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  employmentType: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface EmployeeListFilters {
  search: string;
  department: string;
  status: 'ALL' | 'ACTIVE' | 'INACTIVE';
}

export interface AdminAttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workHours: number | null;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
}

export interface AdminTimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  type: 'PAID' | 'SICK' | 'UNPAID';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedOn: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  effectiveFrom: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'leave' | 'payroll' | 'team';
  isRead: boolean;
  createdAt: string;
}
