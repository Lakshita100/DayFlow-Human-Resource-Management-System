import type { NotificationItem } from '@/types/admin-pages.types';

export const mockNotifications: NotificationItem[] = [
  { id: '1', title: 'Leave request pending', message: 'John Doe has submitted a sick leave request for 22-24 Aug. Awaiting your review.', type: 'leave', isRead: false, createdAt: '2 hours ago' },
  { id: '2', title: 'New employee onboarded', message: 'Kavya Nair has been added to the Engineering department as Frontend Developer.', type: 'info', isRead: false, createdAt: '4 hours ago' },
  { id: '3', title: 'Payroll processed', message: 'Monthly payroll for August 2026 has been processed successfully.', type: 'payroll', isRead: false, createdAt: '1 day ago' },
  { id: '4', title: 'Leave approved', message: 'Amit Patel paid leave request (28-29 Aug) has been approved.', type: 'success', isRead: true, createdAt: '1 day ago' },
  { id: '5', title: 'Attendance alert', message: '3 employees have been absent for 3 consecutive days. Please review.', type: 'warning', isRead: true, createdAt: '2 days ago' },
  { id: '6', title: 'Team update', message: 'Engineering team standup meeting has been rescheduled to 10:00 AM.', type: 'team', isRead: true, createdAt: '2 days ago' },
  { id: '7', title: 'Salary structure updated', message: 'Rohit Verma salary structure has been updated effective from 01 Jul 2026.', type: 'payroll', isRead: true, createdAt: '3 days ago' },
  { id: '8', title: 'Document uploaded', message: 'Priya Sharma uploaded a new document: Experience Certificate.', type: 'info', isRead: true, createdAt: '3 days ago' },
  { id: '9', title: 'Leave request rejected', message: 'Sneha Iyer unpaid leave request (20-22 Jul) has been rejected.', type: 'leave', isRead: true, createdAt: '5 days ago' },
  { id: '10', title: 'Profile updated', message: 'Neha Gupta updated emergency contact information.', type: 'info', isRead: true, createdAt: '5 days ago' },
];
