export type NotificationType = 'attendance' | 'leave' | 'salary' | 'documents' | 'announcements' | 'system';

export type NotificationFilter = 'all' | 'unread' | NotificationType;

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  relatedRoute?: string;
  relatedId?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  today: number;
}

export type NotificationSortOption = 'newest' | 'oldest';
