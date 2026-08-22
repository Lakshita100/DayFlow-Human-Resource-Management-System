import { useState } from 'react';
import { User, Shield, Bell, Palette, Save } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { useAuth } from '@/hooks/useAuth';

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'appearance'>('profile');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { key: 'profile' as const, label: 'Profile', icon: User },
    { key: 'security' as const, label: 'Security', icon: Shield },
    { key: 'notifications' as const, label: 'Notifications', icon: Bell },
    { key: 'appearance' as const, label: 'Appearance', icon: Palette },
  ];

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your account and preferences.</p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full shrink-0 lg:w-56">
            <nav className="flex gap-1 overflow-x-auto rounded-xl border border-gray-100 bg-white p-1.5 shadow-card lg:flex-col scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2.5 shrink-0 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      activeTab === tab.key
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === 'profile' && (
              <div className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-card">
                <h3 className="mb-6 text-base font-semibold text-gray-900">Profile Information</h3>
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mb-6 text-center sm:text-left">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
                    {user ? getInitials(user.name) : 'U'}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{user?.name ?? 'User'}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <p className="mt-1 text-xs text-gray-400 font-mono">{user?.role} &middot; {user?.employeeId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Full Name</label>
                    <input type="text" defaultValue={user?.name ?? ''} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Email</label>
                    <input type="email" defaultValue={user?.email ?? ''} disabled className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Employee ID</label>
                    <input type="text" defaultValue={user?.employeeId ?? ''} disabled className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500 font-mono cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Role</label>
                    <input type="text" defaultValue={user?.role ?? ''} disabled className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={handleSave} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700">
                    <Save size={16} />
                    {saved ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-card">
                  <h3 className="mb-4 text-base font-semibold text-gray-900">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">Current Password</label>
                      <input type="password" placeholder="Enter current password" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">New Password</label>
                      <input type="password" placeholder="Enter new password" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">Confirm New Password</label>
                      <input type="password" placeholder="Confirm new password" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100" />
                    </div>
                    <button onClick={handleSave} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700">
                      <Shield size={16} />
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-card">
                <h3 className="mb-4 text-base font-semibold text-gray-900">Notification Preferences</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Leave Requests', desc: 'Get notified when employees submit leave requests', default: true },
                    { label: 'Attendance Alerts', desc: 'Get notified about attendance irregularities', default: true },
                    { label: 'Payroll Updates', desc: 'Get notified about payroll processing', default: false },
                    { label: 'New Employee', desc: 'Get notified when a new employee is added', default: true },
                    { label: 'System Updates', desc: 'Get notified about system changes', default: false },
                  ].map((pref) => (
                    <div key={pref.label} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3.5 sm:p-4">
                      <div className="min-w-0 pr-2">
                        <p className="text-sm font-medium text-gray-900">{pref.label}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{pref.desc}</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center shrink-0">
                        <input type="checkbox" defaultChecked={pref.default} className="peer sr-only" />
                        <div className="h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand-600 peer-checked:after:translate-x-full" />
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={handleSave} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700">
                    <Save size={16} />
                    {saved ? 'Saved!' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-card">
                <h3 className="mb-4 text-base font-semibold text-gray-900">Appearance Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-500">Theme</label>
                    <div className="flex flex-wrap gap-2.5">
                      {['Light', 'Dark', 'System'].map((theme) => (
                        <button
                          key={theme}
                          className={`flex-1 sm:flex-none rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                            theme === 'Light'
                              ? 'border-brand-300 bg-brand-50 text-brand-700 font-semibold'
                              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-500">Sidebar</label>
                    <div className="flex flex-wrap gap-2.5">
                      {['Expanded', 'Collapsed'].map((s) => (
                        <button
                          key={s}
                          className={`flex-1 sm:flex-none rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                            s === 'Expanded'
                              ? 'border-brand-300 bg-brand-50 text-brand-700 font-semibold'
                              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={handleSave} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700">
                    <Save size={16} />
                    {saved ? 'Saved!' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
