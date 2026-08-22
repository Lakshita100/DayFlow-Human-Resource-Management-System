import { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import AdminKpiCards from './components/AdminKpiCards';
import AdminAttendanceChart from './components/AdminAttendanceChart';
import AdminAttendanceBreakdown from './components/AdminAttendanceBreakdown';
import AdminActionRequired from './components/AdminActionRequired';
import AdminPendingLeave from './components/AdminPendingLeave';
import AdminRecentEmployees from './components/AdminRecentEmployees';
import AdminWorkforceDistribution from './components/AdminWorkforceDistribution';
import AdminLeaveAnalytics from './components/AdminLeaveAnalytics';
import AdminRecentActivity from './components/AdminRecentActivity';
import AdminQuickActions from './components/AdminQuickActions';
import {
  mockAdminKpi,
  mockAttendanceTrend,
  mockAttendanceBreakdown,
  mockActionRequired,
  mockPendingLeaveRequests,
  mockRecentEmployees,
  mockDepartmentDistribution,
  mockLeaveAnalytics,
  mockAdminActivity,
  mockAdminQuickActions,
} from '@/data/adminDashboardMock';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getCurrentDate(): string {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function AdminDashboard() {
  const greeting = getGreeting();
  const [loading] = useState(false);

  if (loading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <div>
            <div className="mb-2 h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-4 w-80 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-3 h-4 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="mb-2 h-8 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                  </div>
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="h-80 animate-pulse rounded-xl border border-gray-100 bg-white p-6">
                <div className="mb-4 h-4 w-40 animate-pulse rounded bg-gray-200" />
                <div className="h-64 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
            <div>
              <div className="h-80 animate-pulse rounded-xl border border-gray-100 bg-white p-6">
                <div className="mb-4 h-4 w-36 animate-pulse rounded bg-gray-200" />
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-8 animate-pulse rounded bg-gray-100" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Row 0: Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {greeting}, Admin 👋
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Here&apos;s an overview of your organization&apos;s workforce today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{getCurrentDate()}</span>
          </div>
        </div>

        {/* Row 1: KPI Cards */}
        <AdminKpiCards data={mockAdminKpi} />

        {/* Row 2: Attendance Overview + Breakdown */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AdminAttendanceChart data={mockAttendanceTrend} />
          </div>
          <div>
            <AdminAttendanceBreakdown data={mockAttendanceBreakdown} />
          </div>
        </div>

        {/* Row 3: Action Required + Pending Leave */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdminActionRequired data={mockActionRequired} />
          <AdminPendingLeave data={mockPendingLeaveRequests} />
        </div>

        {/* Row 4: Workforce Distribution + Leave Analytics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdminWorkforceDistribution data={mockDepartmentDistribution} />
          <AdminLeaveAnalytics data={mockLeaveAnalytics} />
        </div>

        {/* Row 5: Recent Employees + Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdminRecentEmployees data={mockRecentEmployees} />
          <AdminRecentActivity data={mockAdminActivity} />
        </div>

        {/* Row 6: Quick Actions */}
        <AdminQuickActions data={mockAdminQuickActions} />
      </div>
    </PageContainer>
  );
}
