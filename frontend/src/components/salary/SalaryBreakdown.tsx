import type { SalaryRecord } from '@/types/salary.types';

interface SalaryBreakdownProps {
  record: SalaryRecord;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function SalaryBreakdown({ record }: SalaryBreakdownProps) {
  const { earnings, deductions, grossSalary, totalDeductions, netSalary } = record;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="text-sm font-semibold text-gray-900">Salary Breakdown</h3>

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Earnings */}
        <div>
          <h4 className="mb-3 border-l-2 border-emerald-500 pl-3 text-sm font-semibold text-gray-900">
            Earnings
          </h4>
          <div className="space-y-0">
            {earnings.components.map((component) => (
              <div
                key={component.name}
                className="flex items-center justify-between border-b border-gray-50 py-2"
              >
                <span className="text-sm text-gray-600">{component.name}</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatINR(component.amount)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <span className="text-sm font-semibold text-gray-900">Gross Earnings</span>
            <span className="text-sm font-bold text-emerald-600">{formatINR(grossSalary)}</span>
          </div>
        </div>

        {/* Deductions */}
        <div>
          <h4 className="mb-3 border-l-2 border-red-500 pl-3 text-sm font-semibold text-gray-900">
            Deductions
          </h4>
          <div className="space-y-0">
            {deductions.components.map((component) => (
              <div
                key={component.name}
                className="flex items-center justify-between border-b border-gray-50 py-2"
              >
                <span className="text-sm text-gray-600">{component.name}</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatINR(component.amount)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <span className="text-sm font-semibold text-gray-900">Total Deductions</span>
            <span className="text-sm font-bold text-red-600">{formatINR(totalDeductions)}</span>
          </div>
        </div>
      </div>

      {/* Net Salary */}
      <div className="mt-6 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
        <span className="text-base font-bold text-gray-900">Net Salary</span>
        <span className="text-base font-bold text-emerald-600">{formatINR(netSalary)}</span>
      </div>
    </div>
  );
}
