import PageContainer from '@/components/layout/PageContainer';

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
  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-white sm:p-8">
          <h1 className="text-2xl font-bold">Good Morning, Rahul</h1>
          <p className="mt-1 text-brand-100">
            Here&apos;s what&apos;s happening with your work today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Days Present', value: '22', sub: 'This Month' },
            { label: 'Leave Balance', value: '8', sub: 'Days Remaining' },
            { label: 'Pending Tasks', value: '5', sub: 'To Review' },
            { label: 'Team Members', value: '12', sub: 'In Department' },
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
            <h3 className="mb-4 font-semibold text-gray-900">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { text: 'Attendance marked for today', time: '9:00 AM' },
                { text: 'Leave request approved', time: 'Yesterday' },
                { text: 'Payslip generated for August', time: 'Aug 1' },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center justify-between border-b border-gray-50 py-2 last:border-0"
                >
                  <span className="text-sm text-gray-600">{item.text}</span>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
            <h3 className="mb-4 font-semibold text-gray-900">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Mark Attendance', emoji: '⏰' },
                { label: 'Apply Leave', emoji: '📅' },
                { label: 'View Payslip', emoji: '💰' },
                { label: 'Submit Request', emoji: '📝' },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm font-medium text-gray-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                >
                  <span className="text-2xl">{action.emoji}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
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
  return <PlaceholderPage title="My Profile" icon="👤" />;
}

export function EmployeeAttendance() {
  return <PlaceholderPage title="Attendance" icon="⏰" />;
}

export function AdminAttendance() {
  return <PlaceholderPage title="Attendance Management" icon="⏰" />;
}

export function LeavePage() {
  return <PlaceholderPage title="Leave" icon="📅" />;
}

export function AdminTimeOff() {
  return <PlaceholderPage title="Time-Off Management" icon="📅" />;
}

export function SalaryPage() {
  return <PlaceholderPage title="My Salary" icon="💰" />;
}

export function AdminPayroll() {
  return <PlaceholderPage title="Payroll Management" icon="💰" />;
}

export function EmployeeListPage() {
  return <PlaceholderPage title="Employees" icon="👥" />;
}

export function DocumentsPage() {
  return <PlaceholderPage title="Documents" icon="📄" />;
}

export function NotificationsPage() {
  return <PlaceholderPage title="Notifications" icon="🔔" />;
}

export function CalendarPage() {
  return <PlaceholderPage title="Calendar" icon="📅" />;
}

export function SettingsPage() {
  return <PlaceholderPage title="Settings" icon="⚙️" />;
}
