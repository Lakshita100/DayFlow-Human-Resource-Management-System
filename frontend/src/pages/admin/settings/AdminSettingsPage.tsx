import { useState, useRef, useEffect, useCallback } from 'react';
import { User, Shield, Bell, Palette, Save, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '@/components/ui/Avatar';
import ChangePhotoModal from '../profile/ChangePhotoModal';
import { mockAdminProfile } from '@/data/adminProfileMock';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'appearance'>('profile');

  // Profile Form & Photo State
  const [formData, setFormData] = useState({
    name: user?.name ?? mockAdminProfile.name,
    mobile: mockAdminProfile.mobile,
    location: mockAdminProfile.location,
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(mockAdminProfile.avatar);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security tab state
  const [securitySaved, setSecuritySaved] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);
  const [appSaved, setAppSaved] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const tabs = [
    { key: 'profile' as const, label: 'Profile', icon: User },
    { key: 'security' as const, label: 'Security', icon: Shield },
    { key: 'notifications' as const, label: 'Notifications', icon: Bell },
    { key: 'appearance' as const, label: 'Appearance', icon: Palette },
  ];

  // Photo handlers
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setToast({ type: 'error', message: 'Please select a JPG, PNG, or WEBP image.' });
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setToast({ type: 'error', message: 'Image must be smaller than 5 MB.' });
      return;
    }
    setPendingUrl(URL.createObjectURL(file));
    setPhotoModalOpen(true);
  }, []);

  const handleSavePhoto = useCallback(() => {
    if (!pendingUrl) return;
    setSavingPhoto(true);
    setTimeout(() => {
      URL.revokeObjectURL(pendingUrl);
      setAvatarUrl(pendingUrl);
      setSavingPhoto(false);
      setPhotoModalOpen(false);
      setPendingUrl(null);
      setToast({ type: 'success', message: 'Profile photo updated successfully.' });
    }, 800);
  }, [pendingUrl]);

  const handleCancelPhoto = useCallback(() => {
    if (pendingUrl) URL.revokeObjectURL(pendingUrl);
    setPhotoModalOpen(false);
    setPendingUrl(null);
  }, [pendingUrl]);

  // Profile save handler
  const handleSaveProfile = () => {
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      setToast({ type: 'success', message: 'Profile information saved successfully.' });
    }, 600);
  };

  const handleSecuritySave = () => {
    setSecuritySaved(true);
    setTimeout(() => setSecuritySaved(false), 2000);
  };

  const handleNotifSave = () => {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 2000);
  };

  const handleAppSave = () => {
    setAppSaved(true);
    setTimeout(() => setAppSaved(false), 2000);
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your account and preferences.</p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Settings Tab Navigation */}
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

          {/* Tab Content */}
          <div className="flex-1 min-w-0">
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-card">
                <h3 className="mb-6 text-base font-semibold text-gray-900">Profile Information</h3>

                {/* Avatar & Photo Upload Section */}
                <div className="flex flex-col sm:flex-row items-center gap-5 mb-8 pb-6 border-b border-gray-100 text-center sm:text-left">
                  <div className="relative group shrink-0">
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24">
                      <Avatar
                        src={avatarUrl}
                        name={formData.name}
                        className="h-full w-full text-xl sm:text-2xl"
                      />
                      {/* Change photo overlay button */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Change profile photo"
                        className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-white shadow-md transition-colors hover:bg-brand-700"
                      >
                        <Camera size={14} />
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                      aria-hidden="true"
                      tabIndex={-1}
                    />
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{formData.name}</h4>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      {user?.loginId || user?.employeeId || mockAdminProfile.loginId} &middot; {user?.role || 'ADMIN'}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      Allowed JPG, PNG, or WEBP. Max size of 5 MB.
                    </p>
                  </div>
                </div>

                {/* Profile Form Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Login / Employee ID</label>
                    <input
                      type="text"
                      value={user?.loginId || user?.employeeId || mockAdminProfile.loginId}
                      disabled
                      className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500 font-mono cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Email Address</label>
                    <input
                      type="email"
                      value={user?.email ?? mockAdminProfile.email}
                      disabled
                      className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Mobile Number</label>
                    <input
                      type="text"
                      value={formData.mobile}
                      onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Company</label>
                    <input
                      type="text"
                      value={user?.company?.name ?? mockAdminProfile.company}
                      disabled
                      className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Department</label>
                    <input
                      type="text"
                      value={mockAdminProfile.department}
                      disabled
                      className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Manager</label>
                    <input
                      type="text"
                      value={mockAdminProfile.manager ?? 'N/A'}
                      disabled
                      className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Office Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
                  >
                    {savingProfile ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
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
                    <button onClick={handleSecuritySave} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700">
                      <Shield size={16} />
                      {securitySaved ? 'Updated!' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
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
                  <button onClick={handleNotifSave} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700">
                    <Save size={16} />
                    {notifSaved ? 'Saved!' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {/* APPEARANCE TAB */}
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
                  <button onClick={handleAppSave} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700">
                    <Save size={16} />
                    {appSaved ? 'Saved!' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2">
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle size={18} className="shrink-0 text-rose-500" />
          )}
          <p className="text-sm text-gray-700 font-medium">{toast.message}</p>
        </div>
      )}

      {/* Change Photo Preview Modal */}
      <ChangePhotoModal
        open={photoModalOpen}
        imageUrl={pendingUrl ?? ''}
        saving={savingPhoto}
        onCancel={handleCancelPhoto}
        onSave={handleSavePhoto}
      />
    </PageContainer>
  );
}
