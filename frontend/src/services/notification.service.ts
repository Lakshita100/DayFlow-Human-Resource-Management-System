import apiClient from '@/api/client';
import type { ApiResponse } from '@/types/common.types';
import type { Notification } from '@/types/notification.types';

export async function getNotifications(): Promise<Notification[]> {
  const res = await apiClient.get<ApiResponse<Notification[]>>('/notifications');
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch notifications');
  return res.data.data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.patch('/notifications/read-all');
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(`/notifications/${id}`);
}
