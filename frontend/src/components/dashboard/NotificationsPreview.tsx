import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarOff, Wallet, Users, Info } from 'lucide-react';
import type { DashboardNotification } from '@/types/dashboard.types';
import { mockNotifications } from '@/data/mockDashboard';

interface NotificationsPreviewProps {
  data?: DashboardNotification[];
}

const typeConfig = {
  leave: { icon: CalendarOff, iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
  payroll: { icon: Wallet, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  team: { icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  info: { icon: Info, iconBg: 'bg-gray-50', iconColor: 'text-gray-600' },
  success: { icon: Info, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  warning: { icon: Info, iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
};

export default function NotificationsPreview({ data = mockNotifications }: NotificationsPreviewProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
        <button
          onClick={() => navigate('/employee/notifications')}
          className="text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          View All
        </button>
      </div>

      {data.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400">
          You&apos;re all caught up.
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((notification) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;
            return (
              <div
                key={notification.id}
                className="flex gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
              >
                <div className={`shrink-0 rounded-lg ${config.iconBg} p-2`}>
                  <Icon size={16} className={config.iconColor} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    {!notification.read && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                    {notification.description}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400">{notification.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => navigate('/employee/notifications')}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
      >
        View All Notifications
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
