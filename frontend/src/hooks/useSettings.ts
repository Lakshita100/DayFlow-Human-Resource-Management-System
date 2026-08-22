import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as settingsApi from '@/services/settings.service';
import { getMockUserSettings } from '@/data/mockSettings';
import type { UserSettings } from '@/types/settings.types';

const USE_MOCK = true;

export function useUserSettings() {
  return useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: () => settingsApi.getUserSettings(),
    enabled: !USE_MOCK,
  });
}

export function useUserSettingsMock(): UserSettings {
  return getMockUserSettings();
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Partial<UserSettings>) => settingsApi.updateUserSettings(settings),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['settings'] }); },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
      settingsApi.changePassword(payload),
  });
}
