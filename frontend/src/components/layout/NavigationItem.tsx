import { NavLink } from 'react-router-dom';
import type { NavItem } from '@/types/navigation.types';

interface NavigationItemProps {
  item: NavItem;
  collapsed?: boolean;
  onClick?: () => void;
}

export default function NavigationItem({
  item,
  collapsed = false,
  onClick,
}: NavigationItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
          isActive
            ? 'bg-brand-50 text-brand-700 font-semibold'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        } ${collapsed ? 'justify-center px-2' : ''}`
      }
      title={collapsed ? item.label : undefined}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={20}
            className={`shrink-0 transition-colors duration-150 ${
              isActive ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600'
            }`}
          />
          {!collapsed && <span>{item.label}</span>}
        </>
      )}
    </NavLink>
  );
}
