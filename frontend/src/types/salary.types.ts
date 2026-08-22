export type PaymentStatus = 'paid' | 'processing' | 'pending' | 'failed';

export interface SalaryComponent {
  name: string;
  amount: number;
}

export interface SalaryEarnings {
  basicSalary: number;
  hra: number;
  allowances: number;
  bonus: number;
  lta: number;
  fixedAllowance: number;
  components: SalaryComponent[];
}

export interface SalaryDeductions {
  pf: number;
  professionalTax: number;
  otherDeductions: number;
  components: SalaryComponent[];
}

export interface SalaryRecord {
  id: string;
  month: string;
  year: number;
  monthLabel: string;
  employeeId: string;
  employeeName: string;
  companyName: string;
  earnings: SalaryEarnings;
  deductions: SalaryDeductions;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  paymentDate: string | null;
  paymentStatus: PaymentStatus;
  payslipUrl: string | null;
}

export interface SalaryMonth {
  month: string;
  year: number;
  label: string;
}

export interface SalarySummary {
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  paymentStatus: PaymentStatus;
  paymentDate: string | null;
  monthLabel: string;
}
