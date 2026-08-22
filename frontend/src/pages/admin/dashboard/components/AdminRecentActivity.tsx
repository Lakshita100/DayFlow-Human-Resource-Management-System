import {
  UserPlus,
  CalendarCheck,
  UserCog,
  DollarSign,
  AlertTriangle,
  CalendarX,
  type LucideIcon,
} from 'lucide-react';
import type { AdminActivityItem } from '@/types/admin.types';

interface AdminRecentActivityProps {
  data: AdminActivityItem[];
}

const typeConfig: Record<
  AdminActivityItem['type'],
  { icon: LucideIcon; bg: string; color: string }
> = {
  employee_added: { icon: UserPlus, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  leave_approved: { icon: CalendarCheck, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  leave_rejected: { icon: CalendarX, bg: 'bg-rose-50', color: 'text-rose-600' },
  profile_updated: { icon: UserCog, bg: 'bg-blue-50', color: 'text-blue-600' },
  salary_updated: { icon: DollarSign, bg: 'bg-amber-50', color: 'text-amber-600' },
  attendance_flagged: { icon: AlertTriangle, bg: 'bg-rose-50', color: 'text-rose-600' },
};

export default function AdminRecentActivity({ data }: AdminRecentActivityProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <p className="text-sm font-medium text-gray-900">No recent activity.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {data.map((item, index) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;
            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-gray-50 ${
                  index < data.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bg}`}
                >
                  <Icon size={16} className={config.color} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                </div>
                <span className="shrink-0 text-[11px] text-gray-400">{item.timestamp}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
