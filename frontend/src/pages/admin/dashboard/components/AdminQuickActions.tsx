import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Users,
  CalendarOff,
  Clock,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import type { AdminQuickAction } from '@/types/admin.types';

interface AdminQuickActionsProps {
  data: AdminQuickAction[];
}

const iconMap: Record<string, LucideIcon> = {
  'user-plus': UserPlus,
  users: Users,
  'calendar-off': CalendarOff,
  clock: Clock,
  wallet: Wallet,
};

const colorMap: Record<string, { iconBg: string; iconColor: string }> = {
  'user-plus': { iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  users: { iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  'calendar-off': { iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  clock: { iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
  wallet: { iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
};

export default function AdminQuickActions({ data }: AdminQuickActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {data.map((action) => {
          const Icon = iconMap[action.icon] ?? Users;
          const colors = colorMap[action.icon] ?? { iconBg: 'bg-gray-50', iconColor: 'text-gray-600' };
          return (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="group flex flex-col items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-center transition-all hover:border-gray-200 hover:bg-white hover:shadow-sm"
            >
              <div
                className={`rounded-lg ${colors.iconBg} p-2.5 transition-transform group-hover:scale-105`}
              >
                <Icon size={20} className={colors.iconColor} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{action.label}</p>
                <p className="mt-0.5 text-xs text-gray-400">{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
