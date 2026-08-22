import { AdminAttendanceRecord } from '@/types/admin-pages.types';
import { formatHours, getInitials, isWorking } from './utils';

export default function AttendanceRow({ record }: { record: AdminAttendanceRecord }) {
  const working = isWorking(record);
  return (
    <tr className="transition-colors hover:bg-gray-50/50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
            {getInitials(record.employeeName)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{record.employeeName}</p>
            <p className="text-xs text-gray-400">{record.employeeId}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">
        {record.checkIn ?? <span className="text-gray-300">&mdash;</span>}
      </td>
      <td className="px-6 py-4 text-sm">
        {record.checkOut ? (
          <span className="text-gray-700">{record.checkOut}</span>
        ) : working ? (
          <span className="inline-flex items-center gap-1.5 text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Working
          </span>
        ) : (
          <span className="text-gray-300">&mdash;</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-700">{formatHours(record.workHours)}</td>
      <td className="px-6 py-4 text-sm font-medium text-gray-700">{formatHours(record.extraHours)}</td>
    </tr>
  );
}
