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

interface TimeOffRequestTableProps {
  requests: AdminTimeOffRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  loadingId?: string | null;
}

export default function TimeOffRequestTable({ requests, onApprove, onReject, loadingId }: TimeOffRequestTableProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-xs font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">Start Date</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">End Date</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">Type</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {requests.map((req) => {
              const isLoading = loadingId === req.id;
              return (
                <tr key={req.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                        {getInitials(req.employeeName)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{req.employeeName}</p>
                        <p className="text-xs text-gray-400">{req.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{req.startDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{req.endDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${typeBadge[req.type]}`}>
                      {typeLabel[req.type]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={req.status.toLowerCase()} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {req.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onReject(req.id)}
                          disabled={isLoading}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
                        >
                          <XCircle size={13} />
                          Reject
                        </button>
                        <button
                          onClick={() => onApprove(req.id)}
                          disabled={isLoading}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <CheckCircle size={13} />
                          Approve
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {requests.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <p className="text-sm font-medium text-gray-900">No requests found.</p>
                  <p className="mt-1 text-xs text-gray-500">No time-off requests match your criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
