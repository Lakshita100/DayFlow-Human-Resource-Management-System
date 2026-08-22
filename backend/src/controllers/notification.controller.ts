import { Response } from 'express';
import { notificationService } from '../services/notification.service.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/async-handler.js';
import type { AuthRequest } from '../types/index.js';

export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await notificationService.getNotifications(req.user!.id);
  sendSuccess(res, result);
});

export const markNotificationRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const rawId = req.params.id;
  const id = typeof rawId === 'string' ? rawId : (Array.isArray(rawId) ? rawId[0] : '');
  if (!id) {
    res.status(400).json({ success: false, message: 'Notification ID is required' });
    return;
  }
  await notificationService.markAsRead(id, req.user!.id);
  sendSuccess(res, null, 'Notification marked as read');
});

export const markAllNotificationsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  await notificationService.markAllAsRead(req.user!.id);
  sendSuccess(res, null, 'All notifications marked as read');
});
