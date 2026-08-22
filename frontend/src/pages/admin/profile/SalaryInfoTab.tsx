import { IndianRupee, CalendarDays, Coffee, ShieldCheck } from 'lucide-react';
import type { AdminSalaryInfo } from '@/types/admin-pages.types';

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

interface SalaryInfoTabProps {
  salary: AdminSalaryInfo;
}

function SummaryCard({
  label,
  value,
  suffix,
  icon: Icon,
}: {
  label: string;
  value: string;
  suffix: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50">
          <Icon size={15} className="text-brand-600" />
        </div>
      </div>
      <p className="mt-3 text-xl font-bold text-gray-900">{value}</p>
      <p className="mt-0.5 text-xs text-gray-400">{suffix}</p>
    </div>
  );
}

export default function SalaryInfoTab({ salary }: SalaryInfoTabProps) {
  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Salary Information</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Your current compensation structure and statutory deductions.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700">
          <ShieldCheck size={12} className="mr-1" />
          Admin Only
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Monthly Wage" value={formatINR(salary.monthlyWage)} suffix="Per month" icon={IndianRupee} />
        <SummaryCard label="Yearly Wage" value={formatINR(salary.yearlyWage)} suffix="Per year" icon={IndianRupee} />
        <SummaryCard label="Working Days" value={`${salary.workingDaysPerWeek} days`} suffix="Per week" icon={CalendarDays} />
        <SummaryCard label="Break Time" value={salary.breakTime} suffix="Per day" icon={Coffee} />
      </div>

      {/* Main content: components (left) | PF + Tax (right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* LEFT — Salary Components */}
        <div className="lg:col-span-3">
          <div className="h-full rounded-xl border border-gray-100 bg-white shadow-card">
            <div className="border-b border-gray-50 px-6 py-5">
              <h3 className="text-base font-semibold text-gray-900">Salary Components</h3>
              <p className="mt-0.5 text-sm text-gray-500">Breakdown of your monthly compensation.</p>
            </div>
            <ul className="divide-y divide-gray-50 px-6">
              {salary.components.map((comp) => (
                <li key={comp.name} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{comp.name}</p>
                    <p className="mt-0.5 line-clamp-2 max-w-md text-xs leading-relaxed text-gray-400">
                      {comp.description}
                    </p>
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatINR(comp.amount)}
                      <span className="ml-1 text-xs font-normal text-gray-400">/ month</span>
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-brand-600">{comp.percentage.toFixed(2)}%</p>
                  </div>
                </li>
              ))}
              {salary.components.length === 0 && (
                <li className="py-10 text-center text-sm text-gray-500">
                  No salary components configured.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* RIGHT — PF + Tax */}
        <div className="space-y-6 lg:col-span-2">
          {/* Provident Fund */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-card">
            <div className="border-b border-gray-50 px-6 py-5">
              <h3 className="text-base font-semibold text-gray-900">Provident Fund (PF)</h3>
              <p className="mt-0.5 text-sm text-gray-500">Monthly PF contributions.</p>
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-50 px-6 py-4">
              <div className="pr-4">
                <p className="text-xs font-medium text-gray-400">Employee Contribution</p>
                <p className="mt-2 text-lg font-bold text-gray-900">{formatINR(salary.providentFund.employeeAmount)}</p>
                <p className="mt-0.5 text-xs text-brand-600">{salary.providentFund.employeePercentage}% of basic</p>
                <p className="mt-0.5 text-[11px] text-gray-400">per month</p>
              </div>
              <div className="pl-4">
                <p className="text-xs font-medium text-gray-400">Employer Contribution</p>
                <p className="mt-2 text-lg font-bold text-gray-900">{formatINR(salary.providentFund.employerAmount)}</p>
                <p className="mt-0.5 text-xs text-brand-600">{salary.providentFund.employerPercentage}% of basic</p>
                <p className="mt-0.5 text-[11px] text-gray-400">per month</p>
              </div>
            </div>
            <div className="mx-6 mb-4 rounded-lg bg-gray-50 px-4 py-2.5">
              <p className="text-[11px] leading-relaxed text-gray-500">{salary.providentFund.description}</p>
            </div>
          </div>

          {/* Tax Deductions */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-card">
            <div className="border-b border-gray-50 px-6 py-5">
              <h3 className="text-base font-semibold text-gray-900">Tax Deductions</h3>
              <p className="mt-0.5 text-sm text-gray-500">Applicable deductions from salary.</p>
            </div>
            <ul className="divide-y divide-gray-50 px-6">
              {salary.taxDeductions.map((tax) => (
                <li key={tax.name} className="flex items-center justify-between py-4">
                  <p className="text-sm font-medium text-gray-900">{tax.name}</p>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatINR(tax.amount)}
                      <span className="ml-1 text-xs font-normal text-gray-400">/ month</span>
                    </p>
                    {tax.percentage !== null && (
                      <p className="mt-0.5 text-xs font-medium text-brand-600">{tax.percentage}%</p>
                    )}
                  </div>
                </li>
              ))}
              {salary.taxDeductions.length === 0 && (
                <li className="py-10 text-center text-sm text-gray-500">No deductions configured.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
