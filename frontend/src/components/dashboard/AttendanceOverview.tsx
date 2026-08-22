import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AttendanceMonth, AttendanceStatus } from '@/types/dashboard.types';
import { mockAttendanceMonth } from '@/data/mockDashboard';

const statusColors: Record<AttendanceStatus, string> = {
  present: 'bg-emerald-500',
  absent: 'bg-rose-400',
  half_day: 'bg-amber-400',
  leave: 'bg-violet-400',
  holiday: 'bg-gray-200',
  none: 'bg-gray-100',
};

const statusLabels: Record<AttendanceStatus, string> = {
  present: 'Present',
  absent: 'Absent',
  half_day: 'Half Day',
  leave: 'Leave',
  holiday: 'Holiday',
  none: '',
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface AttendanceOverviewProps {
  data?: AttendanceMonth;
}

export default function AttendanceOverview({ data = mockAttendanceMonth }: AttendanceOverviewProps) {
  const [currentMonth, setCurrentMonth] = useState(data.month);
  const [currentYear, setCurrentYear] = useState(data.year);

  function handlePrev() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function handleNext() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  const displayMonth = currentMonth === data.month && currentYear === data.year
    ? data
    : { ...data, days: [], summary: { present: 0, absent: 0, halfDay: 0, leave: 0 } };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Attendance Overview</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-[120px] text-center text-sm font-medium text-gray-700">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={handleNext}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      {displayMonth.days.length > 0 ? (
        <>
          <div className="mb-3 grid grid-cols-7 gap-1 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="py-1 text-[10px] font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {displayMonth.days.map((day) => (
              <div
                key={day.date}
                className="group relative flex aspect-square items-center justify-center"
              >
                <div
                  className={`h-7 w-7 rounded-full ${statusColors[day.status]} flex items-center justify-center text-[11px] font-medium text-white transition-transform group-hover:scale-110`}
                  title={`${day.date} - ${statusLabels[day.status]}`}
                >
                  {day.date}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex h-40 items-center justify-center text-sm text-gray-400">
          No attendance data for this month.
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
        {([
          ['present', 'Present'],
          ['absent', 'Absent'],
          ['half_day', 'Half Day'],
          ['leave', 'Leave'],
        ] as const).map(([status, label]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-full ${statusColors[status]}`} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-3 grid grid-cols-4 gap-2">
        {[
          { label: 'Present', value: displayMonth.summary.present, color: 'text-emerald-600' },
          { label: 'Absent', value: displayMonth.summary.absent, color: 'text-rose-500' },
          { label: 'Half Day', value: displayMonth.summary.halfDay, color: 'text-amber-500' },
          { label: 'Leave', value: displayMonth.summary.leave, color: 'text-violet-500' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
