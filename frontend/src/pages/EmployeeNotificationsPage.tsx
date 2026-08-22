import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import NotificationItem from '@/components/notifications/NotificationItem';
import NotificationFilters from '@/components/notifications/NotificationFilters';
import EmptyState from '@/components/ui/EmptyState';
import { useNotificationsMock, useNotificationStatsMock } from '@/hooks/useNotifications';
import type { NotificationFilter, NotificationSortOption } from '@/types/notification.types';

export default function EmployeeNotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<NotificationSortOption>('newest');
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const notifications = useNotificationsMock();
  const stats = useNotificationStatsMock();

  const filteredNotifications = useMemo(() => {
    let result = notifications;

    if (filter === 'unread') {
      result = result.filter((n) => !n.read);
    } else if (filter !== 'all') {
      result = result.filter((n) => n.type === filter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q)
      );
    }

    return [...result].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [notifications, filter, searchQuery, sortBy]);

  const handleMarkRead = useCallback((_id: string) => {}, []);

  const handleMarkAllRead = useCallback(() => {
    setIsMarkingAll(true);
    setTimeout(() => {
      setIsMarkingAll(false);
    }, 500);
  }, []);

  const handleNavigate = useCallback(
    (route: string) => {
      navigate(route);
    },
    [navigate]
  );

  const handleDelete = useCallback((_id: string) => {}, []);

  const hasActiveFilters = filter !== 'all' || searchQuery.trim().length > 0;

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500">
              Stay updated with your attendance, leave, salary and workplace activity.
            </p>
          </div>
          <div>
            {stats.unread > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={isMarkingAll}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                <CheckCheck className="h-4 w-4" />
                {isMarkingAll ? 'Marking...' : 'Mark all as read'}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-500">
            All <span className="font-medium text-gray-900">{stats.total}</span>
          </span>
          <span className="text-sm text-gray-500">
            Unread <span className="font-medium text-brand-600">{stats.unread}</span>
          </span>
          <span className="text-sm text-gray-500">
            Today <span className="font-medium text-gray-900">{stats.today}</span>
          </span>
        </div>

        <NotificationFilters
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {filteredNotifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="h-12 w-12" />}
            title={
              hasActiveFilters
                ? 'No notifications found'
                : 'No notifications yet'
            }
            description={
              hasActiveFilters
                ? 'Try changing your search or filters.'
                : 'When you receive notifications, they will appear here.'
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onNavigate={handleNavigate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
