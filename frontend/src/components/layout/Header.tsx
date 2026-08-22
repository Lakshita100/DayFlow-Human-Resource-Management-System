import { useState } from 'react';
import { Search, Bell, Menu, CheckCircle2, X } from 'lucide-react';
import UserMenu from './UserMenu';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center border-b border-gray-100 bg-white/90 px-3 sm:px-6 backdrop-blur-md">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="mr-2 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Desktop Search */}
      <div className="relative hidden w-full max-w-md md:block">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-16 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
          ⌘K
        </kbd>
      </div>

      {/* Mobile Search Overlay toggle */}
      {!showMobileSearch ? (
        <button
          onClick={() => setShowMobileSearch(true)}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 md:hidden"
          aria-label="Toggle search"
        >
          <Search size={20} />
        </button>
      ) : (
        <div className="absolute inset-x-0 top-0 z-30 flex h-16 items-center bg-white px-3 border-b border-gray-200 md:hidden">
          <Search size={18} className="text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search..."
            className="w-full text-sm text-gray-900 focus:outline-none"
          />
          <button
            onClick={() => setShowMobileSearch(false)}
            className="p-2 text-gray-500 hover:text-gray-700"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Right section */}
      <div className="ml-auto flex items-center gap-1.5 sm:gap-4">
        {/* Check-in Status (hidden on small mobile) */}
        <div className="hidden items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 sm:flex">
          <CheckCircle2 size={14} className="text-green-500" />
          <span className="text-xs font-medium text-green-700">Checked In</span>
        </div>

        {/* Time (hidden on tablet and mobile) */}
        <div className="hidden text-sm font-medium text-gray-600 lg:block">
          09:15 AM
        </div>

        {/* Divider */}
        <div className="hidden h-6 w-px bg-gray-200 sm:block" />

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
