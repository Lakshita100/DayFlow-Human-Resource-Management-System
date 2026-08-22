import { useState, useMemo } from 'react';
import { Bell, Check, CheckCheck, CalendarOff, Wallet, Users, Info, AlertTriangle, type LucideIcon } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { mockNotifications } from '@/data/adminNotificationsMock';
import type { NotificationItem } from '@/types/admin-pages.types';

const typeConfig: Record<NotificationItem['type'], { icon: LucideIcon; bg: string; color: string }> = {
  leave: { icon: CalendarOff, bg: 'bg-violet-50', color: 'text-violet-600' },
  payroll: { icon: Wallet, bg: 'bg-amber-50', color: 'text-amber-600' },
  team: { icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
  info: { icon: Info, bg: 'bg-gray-50', color: 'text-gray-600' },
  success: { icon: Check, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  warning: { icon: AlertTriangle, bg: 'bg-orange-50', color: 'text-orange-600' },
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = useMemo(() => {
    return notifications.filter((n) => filter === 'unread' || !n.isRead);
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="mt-1 text-sm text-gray-500">Stay updated with your organization&apos;s activity.</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <CheckCheck size={16} />
              Mark All Read ({unreadCount})
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'unread' ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white shadow-card">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <Bell size={40} className="mb-3 text-gray-300" />
              <p className="text-sm font-medium text-gray-900">No notifications</p>
              <p className="mt-1 text-xs text-gray-500">
                {filter === 'unread' ? "You're all caught up!" : 'No notifications yet.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((notification) => {
                const config = typeConfig[notification.type];
                const Icon = config.icon;
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-5 transition-colors hover:bg-gray-50/50 ${
                      !notification.isRead ? 'bg-brand-50/30' : ''
                    }`}
                  >
                    <div className={`shrink-0 rounded-lg ${config.bg} p-2.5`}>
                      <Icon size={18} className={config.color} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                          )}
                        </div>
                        <span className="shrink-0 text-[11px] text-gray-400">{notification.createdAt}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                      {!notification.isRead && (
                        <button
                          onClick={() => markRead(notification.id)}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                        >
                          <Check size={12} />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
