import type { Notification, NotificationType } from '@/types/notification.types';

function buildNotification(
  id: string,
  type: NotificationType,
  title: string,
  message: string,
  createdAt: string,
  read: boolean,
  relatedRoute?: string,
  relatedId?: string,
): Notification {
  return { id, type, title, message, createdAt, read, relatedRoute, relatedId };
}

export const mockNotifications: Notification[] = [
  buildNotification('NTF-001', 'leave', 'Leave Request Approved', 'Your leave request for 22 May – 24 May has been approved by your manager.', '2026-08-22T10:30:00', false, '/employee/leave', 'LR-001'),
  buildNotification('NTF-002', 'salary', 'Monthly Payslip Available', 'Your payslip for July 2026 is now available for download.', '2026-08-21T16:20:00', false, '/employee/salary'),
  buildNotification('NTF-003', 'attendance', 'Attendance Reminder', 'You have not checked in today. Please mark your attendance.', '2026-08-22T09:00:00', false, '/employee/attendance'),
  buildNotification('NTF-004', 'documents', 'Document Verification Complete', 'Your Aadhaar Card has been verified successfully.', '2026-08-20T14:15:00', true, '/employee/documents', 'DOC-001'),
  buildNotification('NTF-005', 'announcements', 'Company Town Hall', 'Join us for the quarterly town hall meeting on 25 August at 10:00 AM.', '2026-08-19T11:00:00', true),
  buildNotification('NTF-006', 'system', 'Password Expiry Warning', 'Your password will expire in 15 days. Please update it soon.', '2026-08-18T08:00:00', true, '/employee/settings'),
  buildNotification('NTF-007', 'leave', 'Leave Request Rejected', 'Your sick leave request for 15 August has been rejected. Reason: Insufficient documentation.', '2026-08-17T15:45:00', true, '/employee/leave', 'LR-003'),
  buildNotification('NTF-008', 'attendance', 'Late Check-in Detected', 'A late check-in was recorded on 16 August 2026 at 10:15 AM.', '2026-08-16T10:20:00', true, '/employee/attendance'),
  buildNotification('NTF-009', 'salary', 'Salary Credited', 'Your salary for August 2026 has been credited to your account.', '2026-08-15T09:00:00', true, '/employee/salary'),
  buildNotification('NTF-010', 'documents', 'Document Expiring Soon', 'Your Driving License expires on 15 August 2026. Please renew it.', '2026-08-14T08:00:00', true, '/employee/documents', 'DOC-011'),
  buildNotification('NTF-011', 'announcements', 'New Holiday Announced', '26 August 2026 has been declared a company holiday for Janmashtami.', '2026-08-13T12:00:00', true),
  buildNotification('NTF-012', 'system', 'System Maintenance', 'The HRMS system will undergo maintenance on 23 August from 2:00 AM to 6:00 AM IST.', '2026-08-12T10:00:00', true),
];

export function getMockNotifications(): Notification[] {
  return [...mockNotifications];
}

export function getMockNotificationStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return {
    total: mockNotifications.length,
    unread: mockNotifications.filter((n) => !n.read).length,
    today: mockNotifications.filter((n) => new Date(n.createdAt).getTime() >= todayStart).length,
  };
}
