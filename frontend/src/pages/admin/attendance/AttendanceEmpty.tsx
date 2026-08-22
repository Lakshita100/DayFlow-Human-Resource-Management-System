import { Clock } from 'lucide-react';

interface AttendanceEmptyProps {
  hasSearch: boolean;
}

export default function AttendanceEmpty({ hasSearch }: AttendanceEmptyProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white py-12 text-center shadow-card">
      <Clock size={40} className="mb-3 text-gray-300" />
      <p className="text-sm font-medium text-gray-900">
        {hasSearch ? 'No employees found' : 'No attendance records'}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        {hasSearch
          ? 'Try searching by employee name or ID.'
          : 'No attendance data is available for this date.'}
      </p>
    </div>
  );
}
