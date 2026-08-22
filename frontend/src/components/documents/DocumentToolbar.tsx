import { useState, useRef } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Grid3X3, List, X } from 'lucide-react';
import type { DocumentFilters, DocumentSortOption, DocumentViewMode, DocumentStatus } from '@/types/document.types';

interface DocumentToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: DocumentFilters;
  onFiltersChange: (filters: DocumentFilters) => void;
  sortBy: DocumentSortOption;
  onSortChange: (sort: DocumentSortOption) => void;
  viewMode: DocumentViewMode;
  onViewModeChange: (mode: DocumentViewMode) => void;
}

const sortOptions: { value: DocumentSortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'expiry-soonest', label: 'Expiry Soonest' },
];

const statusOptions: { value: DocumentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
];

const expiryOptions = [
  { value: 'all' as const, label: 'All Documents' },
  { value: 'valid' as const, label: 'Valid' },
  { value: 'expiring-soon' as const, label: 'Expiring Soon' },
  { value: 'expired' as const, label: 'Expired' },
];

export default function DocumentToolbar({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: DocumentToolbarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters =
    filters.status !== 'all' || filters.expiry !== 'all';

  const clearFilters = () => {
    onFiltersChange({ ...filters, status: 'all', expiry: 'all' });
  };

  return (
    <div className="space-y-3">
      {/* Main toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
            hasActiveFilters
              ? 'border-brand-200 bg-brand-50 text-brand-700'
              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
              {(filters.status !== 'all' ? 1 : 0) + (filters.expiry !== 'all' ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Sort */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setShowSort(!showSort)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">{sortOptions.find((o) => o.value === sortBy)?.label}</span>
          </button>
          {showSort && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
              <div className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-dropdown">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { onSortChange(opt.value); setShowSort(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                      sortBy === opt.value
                        ? 'bg-brand-50 font-medium text-brand-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`rounded-md p-1.5 transition-colors ${
              viewMode === 'grid'
                ? 'bg-brand-50 text-brand-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`rounded-md p-1.5 transition-colors ${
              viewMode === 'list'
                ? 'bg-brand-50 text-brand-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-card">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Status</label>
              <select
                value={filters.status}
                onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as DocumentStatus | 'all' })}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Expiry</label>
              <select
                value={filters.expiry}
                onChange={(e) => onFiltersChange({ ...filters, expiry: e.target.value as DocumentFilters['expiry'] })}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {expiryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                <X className="h-3 w-3" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
