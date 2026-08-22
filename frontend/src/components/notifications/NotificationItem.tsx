import {
  Clock, Calendar, Wallet, FileText, Megaphone, Info, CheckCheck, Trash2,
} from 'lucide-react';
import type { Notification, NotificationType } from '@/types/notification.types';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onNavigate: (route: string) => void;
  onDelete?: (id: string) => void;
}

const typeConfig: Record<NotificationType, {
  icon: React.ComponentType<{ className?: string }>;
  bg: string;
  color: string;
  label: string;
}> = {
  attendance: { icon: Clock, bg: 'bg-emerald-50', color: 'text-emerald-600', label: 'Attendance' },
  leave: { icon: Calendar, bg: 'bg-brand-50', color: 'text-brand-600', label: 'Leave' },
  salary: { icon: Wallet, bg: 'bg-amber-50', color: 'text-amber-600', label: 'Salary' },
  documents: { icon: FileText, bg: 'bg-blue-50', color: 'text-blue-600', label: 'Documents' },
  announcements: { icon: Megaphone, bg: 'bg-purple-50', color: 'text-purple-600', label: 'Announcements' },
  system: { icon: Info, bg: 'bg-gray-100', color: 'text-gray-600', label: 'System' },
};

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function NotificationItem({ notification, onMarkRead, onNavigate, onDelete }: NotificationItemProps) {
  const config = typeConfig[notification.type] ?? typeConfig.system;
  const Icon = config.icon;

  const handleClick = () => {
    if (!notification.read) onMarkRead(notification.id);
    if (notification.relatedRoute) onNavigate(notification.relatedRoute);
  };

  return (
    <div
      onClick={handleClick}
      className={`group flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer ${
        notification.read
          ? 'border-gray-100 bg-white hover:bg-gray-50/50'
          : 'border-brand-100 bg-brand-50/30 hover:bg-brand-50/50'
      }`}
    >
      {/* Icon */}
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
        <Icon className={`h-5 w-5 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className={`text-sm ${notification.read ? 'font-medium text-gray-700' : 'font-semibold text-gray-900'}`}>
            {notification.title}
          </h4>
          {!notification.read && (
            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand-500" />
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{notification.message}</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-xs text-gray-400">{formatTimeAgo(notification.createdAt)}</span>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${config.bg} ${config.color}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {notification.read && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
            <CheckCheck className="h-3 w-3" />
            Read
          </span>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
