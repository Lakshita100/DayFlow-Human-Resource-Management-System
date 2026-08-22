import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HealthPage from '@/pages/HealthPage';
import LoginPage from '@/pages/auth/LoginPage';
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
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/employee/dashboard" replace />,
      },
      {
        path: 'health',
        element: <HealthPage />,
      },
    ],
  },
  {
    path: '/employee',
    element: <DashboardLayout />,
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
    element: <DashboardLayout />,
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
