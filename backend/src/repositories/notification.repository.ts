import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class NotificationRepository {
  async findByUser(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async create(userId: string, title: string, message: string) {
    return prisma.notification.create({
      data: {
        userId,
        title,
        message,
        isRead: false,
      },
    });
  }
}

export const notificationRepository = new NotificationRepository();
