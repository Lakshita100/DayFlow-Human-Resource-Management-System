import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import type { NotificationFilter, NotificationSortOption } from '@/types/notification.types';

interface NotificationFiltersProps {
  filter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: NotificationSortOption;
  onSortChange: (sort: NotificationSortOption) => void;
}

const filterOptions: { value: NotificationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'leave', label: 'Leave' },
  { value: 'salary', label: 'Salary' },
  { value: 'documents', label: 'Documents' },
  { value: 'announcements', label: 'Announcements' },
  { value: 'system', label: 'System' },
];

export default function NotificationFilters({
  filter, onFilterChange, searchQuery, onSearchChange, sortBy, onSortChange,
}: NotificationFiltersProps) {
  const [showSort, setShowSort] = useState(false);

  return (
    <div className="space-y-3">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onFilterChange(opt.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === opt.value
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Search + Sort */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">{sortBy === 'newest' ? 'Newest' : 'Oldest'}</span>
          </button>
          {showSort && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
              <div className="absolute right-0 z-20 mt-1 w-36 rounded-xl border border-gray-100 bg-white py-1 shadow-dropdown">
                {(['newest', 'oldest'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { onSortChange(opt); setShowSort(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                      sortBy === opt ? 'bg-brand-50 font-medium text-brand-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {opt === 'newest' ? 'Newest First' : 'Oldest First'}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
