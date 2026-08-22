import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import type { LeaveRequest, LeaveRequestStatus } from '@/types/leave.types';

interface LeaveRequestTableProps {
  requests: LeaveRequest[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (request: LeaveRequest) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function renderStatus(status: LeaveRequestStatus) {
  return <StatusBadge status={status} size="sm" />;
}

export default function LeaveRequestTable({
  requests,
  total,
  page,
  totalPages,
  onPageChange,
  onViewDetails,
}: LeaveRequestTableProps) {
  if (requests.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        No leave requests found.
      </div>
    );
  }

  const startRecord = (page - 1) * 10 + 1;
  const endRecord = Math.min(page * 10, total);

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Leave Type
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date Range
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Days
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Applied On
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Remarks
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr
                  key={req.id}
                  className="border-t border-gray-50 transition-colors hover:bg-gray-50/50"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    {req.leaveTypeLabel}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {formatDate(req.startDate)} - {formatDate(req.endDate)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {req.days}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {formatDate(req.appliedOn)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {renderStatus(req.status)}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-gray-600">
                    {req.remarks || '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onViewDetails(req)}
                      className="inline-flex items-center justify-center rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3">
          <p className="text-xs text-gray-500">
            Showing {startRecord} to {endRecord} of {total} records
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-1.5 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-1.5 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {requests.map((req) => (
          <button
            key={req.id}
            type="button"
            onClick={() => onViewDetails(req)}
            className="w-full rounded-xl border border-gray-100 bg-white p-4 text-left shadow-card transition-colors hover:bg-gray-50/50"
          >
            <div className="flex items-start justify-between">
              <span className="font-medium text-gray-900">
                {req.leaveTypeLabel}
              </span>
              {renderStatus(req.status)}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {formatDate(req.startDate)} - {formatDate(req.endDate)}
              <span className="ml-2 text-gray-400">| {req.days} days</span>
            </p>
            {req.remarks && (
              <p className="mt-1.5 truncate text-sm text-gray-400">
                {req.remarks}
              </p>
            )}
          </button>
        ))}
      </div>
    </>
  );
}
