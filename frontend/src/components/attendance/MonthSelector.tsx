import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthSelectorProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function MonthSelector({ month, year, onChange }: MonthSelectorProps) {
  function goBack() {
    if (month === 1) {
      onChange(12, year - 1);
    } else {
      onChange(month - 1, year);
    }
  }

  function goForward() {
    if (month === 12) {
      onChange(1, year + 1);
    } else {
      onChange(month + 1, year);
    }
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white">
      <button
        onClick={goBack}
        className="rounded-l-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
        aria-label="Previous month"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="min-w-[120px] px-2 text-center text-sm font-medium text-gray-700">
        {monthNames[month - 1]} {year}
      </span>
      <button
        onClick={goForward}
        className="rounded-r-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
        aria-label="Next month"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
