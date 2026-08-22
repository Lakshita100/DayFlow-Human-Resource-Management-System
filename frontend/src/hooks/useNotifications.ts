import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as notificationApi from '@/services/notification.service';
import { getMockNotifications, getMockNotificationStats } from '@/data/mockNotifications';
import type { Notification } from '@/types/notification.types';

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications(),
  });
}

export function useNotificationsMock(): Notification[] {
  const query = useNotifications();
  return query.data ?? getMockNotifications();
}

export function useNotificationStats() {
  return useQuery({
    queryKey: ['notifications', 'stats'],
    queryFn: async () => {
      const data = await notificationApi.getNotifications();
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      return {
        total: data.length,
        unread: data.filter((n) => !n.read && !(n as any).isRead).length,
        today: data.filter((n) => new Date((n as any).createdAt || Date.now()).getTime() >= todayStart).length,
      };
    },
  });
}

export function useNotificationStatsMock() {
  const query = useNotificationStats();
  return query.data ?? getMockNotificationStats();
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationApi.markNotificationRead(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['notifications'] }); },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationApi.markAllNotificationsRead(),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['notifications'] }); },
  });
}
