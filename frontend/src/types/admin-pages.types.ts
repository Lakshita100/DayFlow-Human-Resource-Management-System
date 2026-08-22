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
  extraHours: number | null;
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

export interface AdminLeaveBalance {
  type: 'PAID' | 'SICK';
  label: string;
  available: number;
  used: number;
  pending: number;
  total: number;
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

export interface AdminProfile {
  id: string;
  name: string;
  loginId: string;
  email: string;
  mobile: string;
  avatar: string | null;
  company: string;
  department: string;
  manager: string | null;
  location: string;
}

export interface SalaryComponentDetail {
  name: string;
  amount: number;
  percentage: number;
  description: string;
}

export interface ProvidentFundDetail {
  employeeAmount: number;
  employeePercentage: number;
  employerAmount: number;
  employerPercentage: number;
  description: string;
}

export interface TaxDeductionDetail {
  name: string;
  amount: number;
  percentage: number | null;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface AdminResume {
  about: string | null;
  jobLove: string | null;
  interests: string[];
  skills: string[];
  certifications: Certification[];
}

export interface AdminSalaryInfo {
  monthlyWage: number;
  yearlyWage: number;
  workingDaysPerWeek: number;
  breakTime: string;
  components: SalaryComponentDetail[];
  providentFund: ProvidentFundDetail;
  taxDeductions: TaxDeductionDetail[];
}
