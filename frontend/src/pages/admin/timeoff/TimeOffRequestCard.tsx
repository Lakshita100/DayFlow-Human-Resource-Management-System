import { CheckCircle, XCircle } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import type { AdminTimeOffRequest } from '@/types/admin-pages.types';

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const typeLabel: Record<string, string> = {
  PAID: 'Paid Time Off',
  SICK: 'Sick Time Off',
  UNPAID: 'Unpaid Time Off',
};

const typeBadge: Record<string, string> = {
  PAID: 'bg-brand-50 text-brand-700',
  SICK: 'bg-amber-50 text-amber-700',
  UNPAID: 'bg-gray-100 text-gray-600',
};

interface TimeOffRequestCardProps {
  request: AdminTimeOffRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  loading?: boolean;
}

export default function TimeOffRequestCard({ request, onApprove, onReject, loading }: TimeOffRequestCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
          {getInitials(request.employeeName)}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{request.employeeName}</p>
          <p className="text-xs text-gray-400">{request.employeeId}</p>
        </div>
        <StatusBadge status={request.status.toLowerCase()} />
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[11px] font-medium text-gray-400">Start Date</p>
          <p className="text-gray-700">{request.startDate}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-gray-400">End Date</p>
          <p className="text-gray-700">{request.endDate}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-gray-400">Type</p>
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${typeBadge[request.type]}`}>
            {typeLabel[request.type]}
          </span>
        </div>
        <div>
          <p className="text-[11px] font-medium text-gray-400">Duration</p>
          <p className="text-gray-700">{request.days} day{request.days > 1 ? 's' : ''}</p>
        </div>
      </div>

      {request.status === 'PENDING' && (
        <div className="flex gap-2 border-t border-gray-50 pt-3">
          <button
            onClick={() => onReject(request.id)}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
          >
            <XCircle size={13} />
            Reject
          </button>
          <button
            onClick={() => onApprove(request.id)}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            <CheckCircle size={13} />
            Approve
          </button>
        </div>
      )}
    </div>
  );
}
