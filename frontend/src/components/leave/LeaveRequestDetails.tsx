import { X, Calendar, Clock, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import type { LeaveRequest } from '@/types/leave.types';

interface LeaveRequestDetailsProps {
  request: LeaveRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
        <Icon className="h-4 w-4 text-gray-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function LeaveRequestDetails({ request, isOpen, onClose }: LeaveRequestDetailsProps) {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Leave Request Details</h2>
            <StatusBadge status={request.status} size="md" />
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          <DetailRow icon={Calendar} label="Leave Type" value={request.leaveTypeLabel} />

          <DetailRow
            icon={Clock}
            label="Date Range"
            value={`${formatDate(request.startDate)} - ${formatDate(request.endDate)}`}
          />

          <DetailRow icon={Clock} label="Days" value={`${request.days} day(s)`} />

          <DetailRow icon={Calendar} label="Applied On" value={formatDate(request.appliedOn)} />

          <DetailRow icon={FileText} label="Remarks" value={request.remarks || 'None'} />

          {request.status === 'rejected' && request.rejectionReason && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-red-700">Rejection Reason</p>
                  <p className="mt-0.5 text-sm text-red-800">{request.rejectionReason}</p>
                </div>
              </div>
            </div>
          )}

          {request.status === 'approved' && request.approvedBy && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-emerald-700">Approved By</p>
                  <p className="mt-0.5 text-sm text-emerald-800">{request.approvedBy}</p>
                  {request.approvedOn && (
                    <p className="mt-1 text-xs text-emerald-600">{formatDate(request.approvedOn)}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {request.attachmentName && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <FileText className="h-4 w-4 text-gray-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Attachment</p>
                <p className="text-sm font-medium text-blue-600 truncate">{request.attachmentName}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
