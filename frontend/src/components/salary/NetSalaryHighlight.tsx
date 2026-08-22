import { Wallet, Calendar } from 'lucide-react';
import type { SalaryRecord, PaymentStatus } from '@/types/salary.types';

interface NetSalaryHighlightProps {
  record: SalaryRecord;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const statusConfig: Record<PaymentStatus, { label: string; bg: string; text: string; dot: string }> = {
  paid: {
    label: 'Paid',
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  processing: {
    label: 'Processing',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  pending: {
    label: 'Pending',
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
  },
  failed: {
    label: 'Failed',
    bg: 'bg-red-100',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
};

export default function NetSalaryHighlight({ record }: NetSalaryHighlightProps) {
  const status = statusConfig[record.paymentStatus];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="h-5 w-5 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-900">Net Salary</h3>
      </div>

      <div className="space-y-3">
        <p className="text-3xl font-bold text-emerald-600">
          {formatINR(record.netSalary)}
        </p>

        <p className="text-sm text-gray-500">For {record.monthLabel}</p>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.bg} ${status.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>

        {record.paymentDate && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Payment Date: {formatDate(record.paymentDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
