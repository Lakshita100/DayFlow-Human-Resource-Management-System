import apiClient from '@/api/client';
import type { ApiResponse } from '@/types/common.types';
import type { UserSettings, ChangePasswordPayload } from '@/types/settings.types';

export async function getUserSettings(): Promise<UserSettings> {
  const res = await apiClient.get<ApiResponse<UserSettings>>('/settings');
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch settings');
  return res.data.data;
}

export async function updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
  const res = await apiClient.patch<ApiResponse<UserSettings>>('/settings', settings);
  if (!res.data.data) throw new Error(res.data.message || 'Failed to update settings');
  return res.data.data;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await apiClient.post('/auth/change-password', payload);
}
