import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR';

  function handleMyProfile() {
    setOpen(false);
    navigate(isAdmin ? '/admin/profile' : '/employee/profile');
  }

  function handleSettings() {
    setOpen(false);
    navigate(isAdmin ? '/admin/settings' : '/employee/settings');
  }

  const initials = user ? getInitials(user.name) : 'U';
  const displayName = user?.name ?? 'User';
  const employeeId = user?.employeeId ?? '';
  const email = user?.email ?? '';

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          {initials}
        </div>
        <div className="hidden text-left lg:block">
          <p className="text-sm font-medium text-gray-900">{displayName}</p>
          <p className="text-xs text-gray-500">{employeeId}</p>
        </div>
        <ChevronDown
          size={16}
          className={`hidden text-gray-400 transition-transform duration-200 lg:block ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-gray-100 bg-white py-1 shadow-dropdown">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
          <div className="py-1">
            <button
              onClick={handleMyProfile}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <User size={16} className="text-gray-400" />
              My Profile
            </button>
            <button
              onClick={handleSettings}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Settings size={16} className="text-gray-400" />
              Settings
            </button>
          </div>
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
