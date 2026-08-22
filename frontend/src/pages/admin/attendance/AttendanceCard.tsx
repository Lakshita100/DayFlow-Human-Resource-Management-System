import { AdminAttendanceRecord } from '@/types/admin-pages.types';
import { formatHours, getInitials, isWorking } from './utils';

export default function AttendanceCard({ record }: { record: AdminAttendanceRecord }) {
  const working = isWorking(record);
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
          {getInitials(record.employeeName)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{record.employeeName}</p>
          <p className="text-xs text-gray-400">{record.employeeId}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[11px] font-medium text-gray-400">Check In</p>
          <p className="text-gray-700">{record.checkIn ?? '\u2014'}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-gray-400">Check Out</p>
          {record.checkOut ? (
            <p className="text-gray-700">{record.checkOut}</p>
          ) : working ? (
            <p className="inline-flex items-center gap-1.5 text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Working
            </p>
          ) : (
            <p className="text-gray-300">&mdash;</p>
          )}
        </div>
        <div>
          <p className="text-[11px] font-medium text-gray-400">Work Hours</p>
          <p className="font-medium text-gray-700">{formatHours(record.workHours)}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-gray-400">Extra Hours</p>
          <p className="font-medium text-gray-700">{formatHours(record.extraHours)}</p>
        </div>
      </div>
    </div>
  );
}
