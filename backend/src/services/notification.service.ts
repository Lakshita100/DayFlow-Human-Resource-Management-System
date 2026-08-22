import { notificationRepository } from '../repositories/notification.repository.js';

export class NotificationService {
  async getNotifications(userId: string) {
    const list = await notificationRepository.findByUser(userId);
    return list.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: 'info' as const,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString().split('T')[0],
    }));
  }

  async markAsRead(id: string, userId: string) {
    return notificationRepository.markAsRead(id, userId);
  }

  async markAllAsRead(userId: string) {
    return notificationRepository.markAllAsRead(userId);
  }
}

export const notificationService = new NotificationService();
