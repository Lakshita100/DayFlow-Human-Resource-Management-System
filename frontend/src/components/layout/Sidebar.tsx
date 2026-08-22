import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Zap,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
} from 'lucide-react';
import NavigationItem from './NavigationItem';
import {
  employeeNavigation,
  adminNavigation,
  type NavGroup,
} from '@/types/navigation.types';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getRoleLabel(role: string): string {
  if (role === 'ADMIN') return 'Administrator';
  if (role === 'HR') return 'HR Manager';
  return 'Employee';
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const navigation: NavGroup[] = isAdminRoute ? adminNavigation : employeeNavigation;

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const initials = user ? getInitials(user.name) : 'U';
  const displayName = user?.name ?? 'User';
  const roleLabel = user ? getRoleLabel(user.role) : '';

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <Zap size={18} className="text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Dayflow
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 lg:flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-3 pt-4 pb-2">
          <div className={`rounded-lg px-3 py-2 text-xs font-medium ${
            isAdminRoute
              ? 'bg-brand-50 text-brand-700'
              : 'bg-blue-50 text-blue-700'
          }`}>
            {isAdminRoute ? 'Admin Panel' : 'Employee Portal'}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {navigation.map((group) => (
          <div key={group.title} className="mb-4">
            {!collapsed && (
              <h3 className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {group.title}
              </h3>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavigationItem key={item.path} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile (bottom) */}
      {!collapsed && (
        <div className="border-t border-gray-100 p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{displayName}</p>
              <p className="truncate text-xs text-gray-500">{roleLabel}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:flex-col border-r border-gray-100 shadow-sidebar transition-all duration-300 ${
          collapsed ? 'lg:w-[68px]' : 'lg:w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
