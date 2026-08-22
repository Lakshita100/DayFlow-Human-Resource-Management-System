import { ArrowRight, Clock, CalendarOff, Wallet, CheckCircle } from 'lucide-react';
import type { ActivityItem } from '@/types/dashboard.types';
import { mockRecentActivity } from '@/data/mockDashboard';

interface RecentActivityProps {
  data?: ActivityItem[];
}

const iconMap: Record<string, typeof Clock> = {
  clock: Clock,
  'calendar-off': CalendarOff,
  wallet: Wallet,
  'check-circle': CheckCircle,
};

const statusColorMap: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-700',
  yellow: 'bg-amber-50 text-amber-700',
  blue: 'bg-blue-50 text-blue-700',
  red: 'bg-rose-50 text-rose-700',
  gray: 'bg-gray-50 text-gray-600',
};

export default function RecentActivity({ data = mockRecentActivity }: RecentActivityProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-xs font-medium text-brand-600 hover:text-brand-700">
          View All
        </button>
      </div>

      <div className="space-y-1">
        {data.map((item, index) => {
          const Icon = iconMap[item.icon] ?? Clock;
          return (
            <div
              key={item.id}
              className={`flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-gray-50 ${
                index < data.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                <Icon size={18} className="text-gray-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {item.status && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      statusColorMap[item.statusColor ?? 'gray']
                    }`}
                  >
                    {item.status}
                  </span>
                )}
                <span className="text-[11px] text-gray-400">{item.timestamp}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50">
        View All Activity
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
