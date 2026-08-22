import type { UserSettings, AccountInfo } from '@/types/settings.types';

export const mockAccountInfo: AccountInfo = {
  employeeId: 'EMP1024',
  email: 'rahul.sharma@dayflow.com',
  phone: '+91 98765 43210',
  status: 'Active',
};

export const mockUserSettings: UserSettings = {
  language: 'English',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  theme: 'light',
  notificationPreferences: {
    leaveUpdates: true,
    attendanceUpdates: true,
    salaryNotifications: true,
    documentUpdates: true,
    announcements: false,
  },
};

export function getMockUserSettings(): UserSettings {
  return { ...mockUserSettings, notificationPreferences: { ...mockUserSettings.notificationPreferences } };
}

export function getMockAccountInfo(): AccountInfo {
  return { ...mockAccountInfo };
}
