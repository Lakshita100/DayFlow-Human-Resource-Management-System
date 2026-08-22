export type SettingsSection = 'profile' | 'account' | 'security' | 'notifications' | 'appearance';

export interface UserSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'system';
  notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences {
  leaveUpdates: boolean;
  attendanceUpdates: boolean;
  salaryNotifications: boolean;
  documentUpdates: boolean;
  announcements: boolean;
}

export interface AccountInfo {
  employeeId: string;
  email: string;
  phone: string;
  status: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
