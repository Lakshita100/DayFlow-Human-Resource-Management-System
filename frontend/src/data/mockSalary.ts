import type {
  SalaryMonth,
  SalaryRecord,
  PaymentStatus,
} from '@/types/salary.types';

export const salaryMonths: SalaryMonth[] = [
  { month: 'may', year: 2026, label: 'May 2026' },
  { month: 'apr', year: 2026, label: 'April 2026' },
  { month: 'mar', year: 2026, label: 'March 2026' },
  { month: 'feb', year: 2026, label: 'February 2026' },
  { month: 'jan', year: 2026, label: 'January 2026' },
  { month: 'dec', year: 2025, label: 'December 2025' },
];

const EMPLOYEE_ID = 'EMP1024';
const EMPLOYEE_NAME = 'Rahul Sharma';
const COMPANY_NAME = 'Dayflow Technologies Pvt. Ltd.';

function buildRecord(
  id: string,
  month: string,
  year: number,
  monthLabel: string,
  bonus: number,
  otherDeductions: number,
  grossSalary: number,
  netSalary: number,
  paymentStatus: PaymentStatus,
  paymentDate: string | null
): SalaryRecord {
  const basicSalary = 62500;
  const hra = 25000;
  const allowances = 12500;
  const lta = 5208;
  const fixedAllowance = 9792;

  const pf = 1800;
  const professionalTax = 200;

  const earningsComponents = [
    { name: 'Basic Salary', amount: basicSalary },
    { name: 'HRA', amount: hra },
    { name: 'Allowances', amount: allowances },
    { name: 'LTA', amount: lta },
    { name: 'Fixed Allowance', amount: fixedAllowance },
  ];
  if (bonus > 0) {
    earningsComponents.push({ name: 'Bonus', amount: bonus });
  }

  const deductionComponents = [
    { name: 'PF', amount: pf },
    { name: 'Professional Tax', amount: professionalTax },
  ];
  if (otherDeductions > 0) {
    deductionComponents.push({ name: 'Other Deductions', amount: otherDeductions });
  }

  const totalDeductions = pf + professionalTax + otherDeductions;

  return {
    id,
    month,
    year,
    monthLabel,
    employeeId: EMPLOYEE_ID,
    employeeName: EMPLOYEE_NAME,
    companyName: COMPANY_NAME,
    earnings: {
      basicSalary,
      hra,
      allowances,
      bonus,
      lta,
      fixedAllowance,
      components: earningsComponents,
    },
    deductions: {
      pf,
      professionalTax,
      otherDeductions,
      components: deductionComponents,
    },
    grossSalary,
    totalDeductions,
    netSalary,
    paymentDate,
    paymentStatus,
    payslipUrl: null,
  };
}

export const mockSalaryRecords: Record<string, SalaryRecord> = {
  'may-2026': buildRecord(
    'SAL-MAY-2026-1024',
    'may',
    2026,
    'May 2026',
    0,
    0,
    115000,
    113000,
    'processing',
    null
  ),
  'apr-2026': buildRecord(
    'SAL-APR-2026-1024',
    'apr',
    2026,
    'April 2026',
    5000,
    0,
    120000,
    118000,
    'paid',
    '2026-04-30'
  ),
  'mar-2026': buildRecord(
    'SAL-MAR-2026-1024',
    'mar',
    2026,
    'March 2026',
    0,
    500,
    115000,
    112500,
    'paid',
    '2026-03-31'
  ),
  'feb-2026': buildRecord(
    'SAL-FEB-2026-1024',
    'feb',
    2026,
    'February 2026',
    0,
    0,
    115000,
    113000,
    'paid',
    '2026-02-28'
  ),
  'jan-2026': buildRecord(
    'SAL-JAN-2026-1024',
    'jan',
    2026,
    'January 2026',
    10000,
    0,
    125000,
    123000,
    'paid',
    '2026-01-31'
  ),
  'dec-2025': buildRecord(
    'SAL-DEC-2025-1024',
    'dec',
    2025,
    'December 2025',
    0,
    0,
    115000,
    113000,
    'paid',
    '2025-12-31'
  ),
};

export function getMockSalaryRecord(
  month: string,
  year: number
): SalaryRecord | null {
  const key = `${month}-${year}`;
  return mockSalaryRecords[key] ?? null;
}

export function getMockSalaryHistory(): SalaryRecord[] {
  return Object.values(mockSalaryRecords).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    const monthOrder = [
      'jan', 'feb', 'mar', 'apr', 'may', 'jun',
      'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
    ];
    return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
  });
}
