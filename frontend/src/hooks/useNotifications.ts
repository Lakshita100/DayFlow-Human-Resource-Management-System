import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as notificationApi from '@/services/notification.service';
import { getMockNotifications, getMockNotificationStats } from '@/data/mockNotifications';
import type { Notification } from '@/types/notification.types';

const USE_MOCK = true;

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications(),
    enabled: !USE_MOCK,
  });
}

export function useNotificationsMock(): Notification[] {
  return getMockNotifications();
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
        unread: data.filter((n) => !n.read).length,
        today: data.filter((n) => new Date(n.createdAt).getTime() >= todayStart).length,
      };
    },
    enabled: !USE_MOCK,
  });
}

export function useNotificationStatsMock() {
  return getMockNotificationStats();
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

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationApi.deleteNotification(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['notifications'] }); },
  });
}
