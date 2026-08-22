import { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { AttendanceFilters as FiltersType, AttendanceStatus } from '@/types/attendance.types';

interface AttendanceFiltersProps {
  filters: FiltersType;
  onApply: (filters: FiltersType) => void;
  onClear: () => void;
}

const statusOptions: Array<{ value: AttendanceStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All Status' },
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'half_day', label: 'Half Day' },
  { value: 'leave', label: 'Leave' },
  { value: 'weekly_off', label: 'Weekly Off' },
];

export default function AttendanceFilters({ filters, onApply, onClear }: AttendanceFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState<AttendanceStatus | 'all'>(filters.status);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    setLocalStatus(filters.status);
  }, [filters.status]);

  const hasActiveFilters = filters.status !== 'all';

  function handleApply() {
    onApply({ ...filters, status: localStatus });
    setIsOpen(false);
  }

  function handleClear() {
    setLocalStatus('all');
    onClear();
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
          hasActiveFilters
            ? 'border-brand-200 bg-brand-50 text-brand-700'
            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <SlidersHorizontal size={16} />
        Filter
        {hasActiveFilters && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
            1
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-gray-100 bg-white p-4 shadow-dropdown">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">Filters</h4>
            <button onClick={() => setIsOpen(false)} className="rounded p-0.5 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">Status</label>
              <div className="space-y-1">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLocalStatus(opt.value)}
                    className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                      localStatus === opt.value
                        ? 'bg-brand-50 font-medium text-brand-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleClear}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
