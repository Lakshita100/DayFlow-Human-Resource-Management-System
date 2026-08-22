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
import {
  EmployeeDashboard,
  AdminDashboard,
  ProfilePage,
  EmployeeAttendance,
  AdminAttendance,
  LeavePage,
  AdminTimeOff,
  SalaryPage,
  AdminPayroll,
  EmployeeListPage,
  DocumentsPage,
  NotificationsPage,
  CalendarPage,
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
      { path: 'employees', element: <EmployeeListPage /> },
      { path: 'attendance', element: <AdminAttendance /> },
      { path: 'time-off', element: <AdminTimeOff /> },
      { path: 'payroll', element: <AdminPayroll /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
