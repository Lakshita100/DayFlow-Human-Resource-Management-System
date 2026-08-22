import type { PayrollRecord } from '@/types/admin-pages.types';

export const mockPayrollRecords: PayrollRecord[] = [
  { id: '1', employeeId: 'EMP001', employeeName: 'Admin User', department: 'Management', designation: 'System Administrator', basicSalary: 120000, hra: 48000, allowances: 25000, deductions: 12000, netSalary: 181000, effectiveFrom: '01 Jan 2026', status: 'ACTIVE' },
  { id: '2', employeeId: 'EMP002', employeeName: 'HR Manager', department: 'Human Resources', designation: 'HR Manager', basicSalary: 95000, hra: 38000, allowances: 18000, deductions: 9500, netSalary: 141500, effectiveFrom: '01 Jan 2026', status: 'ACTIVE' },
  { id: '3', employeeId: 'EMP003', employeeName: 'John Doe', department: 'Engineering', designation: 'Software Developer', basicSalary: 80000, hra: 32000, allowances: 15000, deductions: 8000, netSalary: 119000, effectiveFrom: '01 Feb 2026', status: 'ACTIVE' },
  { id: '4', employeeId: 'EMP004', employeeName: 'Jane Smith', department: 'Engineering', designation: 'Senior Software Developer', basicSalary: 110000, hra: 44000, allowances: 22000, deductions: 11000, netSalary: 165000, effectiveFrom: '01 Feb 2026', status: 'ACTIVE' },
  { id: '5', employeeId: 'EMP005', employeeName: 'Bob Wilson', department: 'Marketing', designation: 'Marketing Specialist', basicSalary: 65000, hra: 26000, allowances: 12000, deductions: 6500, netSalary: 96500, effectiveFrom: '01 Mar 2026', status: 'ACTIVE' },
  { id: '6', employeeId: 'EMP006', employeeName: 'Priya Sharma', department: 'Engineering', designation: 'Frontend Developer', basicSalary: 85000, hra: 34000, allowances: 16000, deductions: 8500, netSalary: 126500, effectiveFrom: '01 Apr 2026', status: 'ACTIVE' },
  { id: '7', employeeId: 'EMP007', employeeName: 'Amit Patel', department: 'Marketing', designation: 'Content Strategist', basicSalary: 70000, hra: 28000, allowances: 13000, deductions: 7000, netSalary: 104000, effectiveFrom: '01 May 2026', status: 'ACTIVE' },
  { id: '8', employeeId: 'EMP008', employeeName: 'Neha Gupta', department: 'Design', designation: 'UI/UX Designer', basicSalary: 75000, hra: 30000, allowances: 14000, deductions: 7500, netSalary: 111500, effectiveFrom: '01 Jun 2026', status: 'ACTIVE' },
  { id: '9', employeeId: 'EMP009', employeeName: 'Rohit Verma', department: 'Finance', designation: 'Financial Analyst', basicSalary: 90000, hra: 36000, allowances: 17000, deductions: 9000, netSalary: 134000, effectiveFrom: '01 Jul 2026', status: 'ACTIVE' },
  { id: '10', employeeId: 'EMP011', employeeName: 'Vikram Rao', department: 'Operations', designation: 'Operations Manager', basicSalary: 88000, hra: 35200, allowances: 16500, deductions: 8800, netSalary: 130900, effectiveFrom: '01 Sep 2026', status: 'ACTIVE' },
  { id: '11', employeeId: 'EMP012', employeeName: 'Sneha Iyer', department: 'HR', designation: 'HR Coordinator', basicSalary: 55000, hra: 22000, allowances: 10000, deductions: 5500, netSalary: 81500, effectiveFrom: '01 Oct 2026', status: 'ACTIVE' },
];
