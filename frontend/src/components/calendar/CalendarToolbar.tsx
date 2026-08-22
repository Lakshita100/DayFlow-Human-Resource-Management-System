import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarViewMode } from '@/types/calendar.types';

interface CalendarToolbarProps {
  year: number;
  month: number;
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarToolbar({ year, month, viewMode, onViewModeChange, onPrev, onNext, onToday }: CalendarToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onPrev} className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="min-w-[160px] text-center text-lg font-semibold text-gray-900">
          {monthNames[month]} {year}
        </h2>
        <button onClick={onNext} className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50">
          <ChevronRight className="h-4 w-4" />
        </button>
        <button onClick={onToday} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Today
        </button>
      </div>
      <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
        {(['month', 'week', 'list'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === mode ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
