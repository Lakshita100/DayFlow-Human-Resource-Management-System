import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import PublicRoute from '@/components/common/PublicRoute';
import HealthPage from '@/pages/HealthPage';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import ChangePasswordPage from '@/pages/auth/ChangePasswordPage';
import UnauthorizedPage from '@/pages/auth/UnauthorizedPage';
import AdminDashboard from '@/pages/admin/dashboard/AdminDashboard';
import AdminEmployeesPage from '@/pages/admin/employees/AdminEmployeesPage';
import AdminAttendancePage from '@/pages/admin/attendance/AdminAttendancePage';
import AdminTimeOffPage from '@/pages/admin/timeoff/AdminTimeOffPage';
import AdminPayrollPage from '@/pages/admin/payroll/AdminPayrollPage';
import AdminNotificationsPage from '@/pages/admin/notifications/AdminNotificationsPage';
import AdminSettingsPage from '@/pages/admin/settings/AdminSettingsPage';
import AdminProfilePage from '@/pages/admin/profile/AdminProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';
import {
  EmployeeDashboard,
  ProfilePage,
  EmployeeAttendance,
  LeavePage,
  SalaryPage,
  DocumentsPage,
  CalendarPage,
  NotificationsPage,
  SettingsPage,
} from '@/pages/index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <SignUpPage />
      </PublicRoute>
    ),
  },
  {
    path: '/change-password',
    element: (
      <ProtectedRoute>
        <ChangePasswordPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/health',
    element: <RootLayout />,
    children: [
      { index: true, element: <HealthPage /> },
    ],
  },
  {
    path: '/employee',
    element: (
      <ProtectedRoute allowedRoles={['EMPLOYEE', 'HR', 'ADMIN']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <EmployeeDashboard /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'attendance', element: <EmployeeAttendance /> },
      { path: 'leave', element: <LeavePage /> },
      { path: 'salary', element: <SalaryPage /> },
      { path: 'documents', element: <DocumentsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'employees', element: <AdminEmployeesPage /> },
      { path: 'attendance', element: <AdminAttendancePage /> },
      { path: 'time-off', element: <AdminTimeOffPage /> },
      { path: 'payroll', element: <AdminPayrollPage /> },
      { path: 'notifications', element: <AdminNotificationsPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
      { path: 'profile', element: <AdminProfilePage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
