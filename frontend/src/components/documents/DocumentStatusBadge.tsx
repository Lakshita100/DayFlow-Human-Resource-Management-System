import { CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import type { DocumentStatus } from '@/types/document.types';

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<DocumentStatus, {
  label: string;
  bg: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  verified: {
    label: 'Verified',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    icon: CheckCircle,
  },
  pending: {
    label: 'Pending Review',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    icon: Clock,
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: XCircle,
  },
  expired: {
    label: 'Expired',
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: AlertTriangle,
  },
};

export default function DocumentStatusBadge({ status, size = 'sm' }: DocumentStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    icon: Clock,
  };
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bg} ${config.text} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      }`}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      {config.label}
    </span>
  );
}
