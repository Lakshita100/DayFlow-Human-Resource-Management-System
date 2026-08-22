import type { LeaveRequestStatus } from '@/types/leave.types';

interface StatusBadgeProps {
  status: LeaveRequestStatus | string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: 'bg-orange-50', text: 'text-orange-700' },
  approved: { label: 'Approved', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  rejected: { label: 'Rejected', bg: 'bg-red-50', text: 'text-red-700' },
  cancelled: { label: 'Cancelled', bg: 'bg-gray-100', text: 'text-gray-600' },
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, bg: 'bg-gray-100', text: 'text-gray-600' };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.text} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      }`}
    >
      {config.label}
    </span>
  );
}
