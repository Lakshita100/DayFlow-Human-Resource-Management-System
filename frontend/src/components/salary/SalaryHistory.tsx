import { Eye } from 'lucide-react';
import type { SalaryRecord } from '@/types/salary.types';

interface SalaryHistoryProps {
  records: SalaryRecord[];
  onViewPayslip: (record: SalaryRecord) => void;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    paid: 'bg-emerald-50 text-emerald-700',
    processing: 'bg-blue-50 text-blue-700',
    pending: 'bg-orange-50 text-orange-700',
    failed: 'bg-red-50 text-red-700',
  };
  return styles[status] || 'bg-gray-100 text-gray-700';
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function SalaryHistory({ records, onViewPayslip }: SalaryHistoryProps) {
  if (!records || records.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        No salary records available.
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-gray-100 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Salary
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {record.monthLabel}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-700">
                    {formatINR(record.grossSalary)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-red-600">
                    {formatINR(record.totalDeductions)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-emerald-600 font-medium">
                    {formatINR(record.netSalary)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatDate(record.paymentDate)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                        record.paymentStatus
                      )}`}
                    >
                      {capitalize(record.paymentStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onViewPayslip(record)}
                      className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {records.map((record) => (
          <div
            key={record.id}
            onClick={() => onViewPayslip(record)}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-card cursor-pointer active:bg-gray-50"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-900">{record.monthLabel}</span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                  record.paymentStatus
                )}`}
              >
                {capitalize(record.paymentStatus)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-4">
                <div>
                  <p className="text-gray-500 text-xs">Gross</p>
                  <p className="text-gray-700">{formatINR(record.grossSalary)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Deductions</p>
                  <p className="text-red-600">{formatINR(record.totalDeductions)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Net</p>
                  <p className="text-emerald-600 font-medium">{formatINR(record.netSalary)}</p>
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {formatDate(record.paymentDate)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
