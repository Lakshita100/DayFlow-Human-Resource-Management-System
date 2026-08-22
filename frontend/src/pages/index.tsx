import { useState, useCallback } from 'react';
import { Pencil, AlertCircle } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PersonalInformationCard from '@/components/profile/PersonalInformationCard';
import ProfessionalInformationCard from '@/components/profile/ProfessionalInformationCard';
import PrivateInformationCard from '@/components/profile/PrivateInformationCard';
import SkillsCard from '@/components/profile/SkillsCard';
import EditProfileModal from '@/components/profile/EditProfileModal';
import ProfileSkeleton from '@/components/profile/ProfileSkeleton';
import { mockEmployeeProfile } from '@/data/mockProfile';
import type { FullEmployeeProfile, ProfileUpdatePayload } from '@/types/profile.types';
import DashboardGreeting from '@/components/dashboard/DashboardGreeting';
import SummaryCards from '@/components/dashboard/SummaryCards';
import QuickActions from '@/components/dashboard/QuickActions';
import AttendanceOverview from '@/components/dashboard/AttendanceOverview';
import LeaveBalanceChart from '@/components/dashboard/LeaveBalanceChart';
import UpcomingLeave from '@/components/dashboard/UpcomingLeave';
import NotificationsPreview from '@/components/dashboard/NotificationsPreview';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { mockDashboardSummary } from '@/data/mockDashboard';
import type { DashboardSummary } from '@/types/dashboard.types';
import AttendanceSummary from '@/components/attendance/AttendanceSummary';
import { AttendanceSummarySkeleton } from '@/components/attendance/AttendanceSkeleton';
import {
  useTodayAttendance,
  useCheckIn,
  useCheckOut,
} from '@/hooks/useAttendance';
import { useWorkingHours } from '@/hooks/useWorkingHours';
import EmployeeAttendancePage from '@/pages/EmployeeAttendancePage';
import EmployeeLeavePage from '@/pages/EmployeeLeavePage';
import EmployeeSalaryPage from '@/pages/EmployeeSalaryPage';
import EmployeeDocumentsPage from '@/pages/EmployeeDocumentsPage';
import EmployeeNotificationsPage from '@/pages/EmployeeNotificationsPage';
import EmployeeCalendarPage from '@/pages/EmployeeCalendarPage';
import EmployeeSettingsPage from '@/pages/EmployeeSettingsPage';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: string;
}

function PlaceholderPage({ title, description, icon = '📋' }: PlaceholderPageProps) {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 text-5xl">{icon}</div>
        <h1 className="mb-2 text-xl font-semibold text-gray-900">{title}</h1>
        <p className="max-w-md text-center text-sm text-gray-500">
          {description ?? `The ${title.toLowerCase()} page is under construction and will be available soon.`}
        </p>
        <div className="mt-6 rounded-full bg-brand-50 px-4 py-2 text-xs font-medium text-brand-700">
          Coming Soon
        </div>
      </div>
    </PageContainer>
  );
}

export function EmployeeDashboard() {
  const { data: today, isLoading, isError, refetch } = useTodayAttendance();
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();
  const workingHours = useWorkingHours(today);

  const summary: DashboardSummary = {
    todayStatus: {
      status:
        !today || today.status === 'not_checked_in' ? 'absent' : 'present',
      checkedInAt: today?.checkInTime ?? null,
    },
    workingHours: {
      total: workingHours,
      description:
        today?.status === 'checked_in'
          ? "Today's running time"
          : "Today's total time",
    },
    monthlyAttendance: mockDashboardSummary.monthlyAttendance,
    leaveBalance: mockDashboardSummary.leaveBalance,
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <DashboardGreeting />

        {isLoading ? (
          <AttendanceSummarySkeleton />
        ) : isError || !today ? (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-gray-100 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-red-500" />
              <p className="text-sm text-gray-600">
                Unable to load your attendance status.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Retry
            </button>
          </div>
        ) : (
          <AttendanceSummary
            today={today}
            onCheckIn={() => checkInMutation.mutate()}
            onCheckOut={() => checkOutMutation.mutate()}
            isCheckingIn={checkInMutation.isPending}
            isCheckingOut={checkOutMutation.isPending}
          />
        )}

        {(checkInMutation.isError || checkOutMutation.isError) && (
          <p className="rounded-lg bg-red-50 px-4 py-2.5 text-xs font-medium text-red-600">
            Something went wrong while marking your attendance. Please try again.
          </p>
        )}

        <SummaryCards data={summary} />

        <QuickActions />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AttendanceOverview />
          </div>
          <div>
            <LeaveBalanceChart />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UpcomingLeave />
          <NotificationsPreview />
        </div>

        <RecentActivity />
      </div>
    </PageContainer>
  );
}

export function AdminDashboard() {
  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-white sm:p-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-brand-100">
            Overview of your organization&apos;s workforce.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Employees', value: '148', sub: 'Active' },
            { label: 'Present Today', value: '132', sub: '89% Attendance' },
            { label: 'On Leave', value: '16', sub: 'Today' },
            { label: 'Open Positions', value: '5', sub: 'To Fill' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-card"
            >
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="mt-0.5 text-xs text-gray-400">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Placeholder Sections */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
            <h3 className="mb-4 font-semibold text-gray-900">Department Overview</h3>
            <p className="text-sm text-gray-500">
              Department analytics and breakdown will appear here.
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
            <h3 className="mb-4 font-semibold text-gray-900">Recent Requests</h3>
            <p className="text-sm text-gray-500">
              Pending approvals and requests will be listed here.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export function ProfilePage() {
  const [profile, setProfile] = useState<FullEmployeeProfile>(mockEmployeeProfile);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading] = useState(false);

  const handleSaveProfile = useCallback(async (data: ProfileUpdatePayload) => {
    setProfile((prev) => ({
      ...prev,
      employee: {
        ...prev.employee,
        phone: data.phone ?? prev.employee.phone,
      },
      personalInfo: {
        ...prev.personalInfo,
        address: data.address ?? prev.personalInfo.address,
        city: data.city ?? prev.personalInfo.city,
        state: data.state ?? prev.personalInfo.state,
        zipCode: data.zipCode ?? prev.personalInfo.zipCode,
        country: data.country ?? prev.personalInfo.country,
      },
      privateInfo: {
        ...prev.privateInfo,
        emergencyContactName: data.emergencyContactName ?? prev.privateInfo.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone ?? prev.privateInfo.emergencyContactPhone,
      },
    }));
  }, []);

  if (isLoading) {
    return (
      <PageContainer>
        <ProfileSkeleton />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        </div>

        <ProfileHeader
          profile={profile.employee}
          onEditPhoto={() => {}}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PersonalInformationCard data={profile.personalInfo} />
          <ProfessionalInformationCard data={profile.employee} />
        </div>

        <PrivateInformationCard data={profile.privateInfo} />

        <SkillsCard
          skills={profile.skills}
          onEdit={() => {}}
        />
      </div>

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </PageContainer>
  );
}

export function EmployeeAttendance() {
  return <EmployeeAttendancePage />;
}

export function AdminAttendance() {
  return <PlaceholderPage title="Attendance Management" icon="⏰" />;
}

export function LeavePage() {
  return <EmployeeLeavePage />;
}

export function AdminTimeOff() {
  return <PlaceholderPage title="Time-Off Management" icon="📅" />;
}

export function SalaryPage() {
  return <EmployeeSalaryPage />;
}

export function AdminPayroll() {
  return <PlaceholderPage title="Payroll Management" icon="💰" />;
}

export function EmployeeListPage() {
  return <PlaceholderPage title="Employees" icon="👥" />;
}

export function DocumentsPage() {
  return <EmployeeDocumentsPage />;
}

export function NotificationsPage() {
  return <EmployeeNotificationsPage />;
}

export function CalendarPage() {
  return <EmployeeCalendarPage />;
}

export function SettingsPage() {
  return <EmployeeSettingsPage />;
}
