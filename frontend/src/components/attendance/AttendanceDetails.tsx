import { X, Clock, CalendarDays, CheckCircle, AlertCircle } from 'lucide-react';
import type { AttendanceRecord } from '@/types/attendance.types';

interface AttendanceDetailsProps {
  record: AttendanceRecord | null;
  onClose: () => void;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  present: { label: 'Present', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  absent: { label: 'Absent', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  half_day: { label: 'Half Day', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  leave: { label: 'Leave', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  weekly_off: { label: 'Weekly Off', bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-400' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AttendanceDetails({ record, onClose }: AttendanceDetailsProps) {
  if (!record) return null;

  const fallbackStatus = { label: record.status, bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' };
  const status = statusConfig[record.status] ?? fallbackStatus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Attendance Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-gray-50 p-2.5">
              <CalendarDays size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{formatDate(record.date)}</p>
              <p className="text-sm text-gray-500">{record.day}</p>
            </div>
            <span className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.bg} ${status.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <Clock size={16} className="shrink-0 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Check In</p>
                <p className="text-sm font-medium text-gray-900">{record.checkIn ?? '--'}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">Check Out</p>
                <p className="text-sm font-medium text-gray-900">{record.checkOut ?? '--'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <Clock size={16} className="shrink-0 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Working Hours</p>
                <p className="text-sm font-medium text-gray-900">{record.workingHours ?? '--'}</p>
              </div>
              {record.extraHours && (
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Extra Hours</p>
                  <p className="text-sm font-medium text-emerald-600">{record.extraHours}</p>
                </div>
              )}
            </div>

            {record.remarks && record.remarks !== '-' && (
              <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                {record.status === 'leave' ? (
                  <CheckCircle size={16} className="mt-0.5 shrink-0 text-blue-400" />
                ) : record.status === 'absent' ? (
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
                ) : (
                  <Clock size={16} className="mt-0.5 shrink-0 text-gray-400" />
                )}
                <div>
                  <p className="text-xs text-gray-400">Remarks</p>
                  <p className="text-sm text-gray-700">{record.remarks}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
