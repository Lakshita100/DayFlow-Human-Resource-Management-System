import { useState, useRef, useEffect, useCallback } from 'react';
import { User, Shield, Bell, Palette, Save, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '@/components/ui/Avatar';
import ChangePhotoModal from '../profile/ChangePhotoModal';
import { mockAdminProfile } from '@/data/adminProfileMock';
import { useUploadAvatar } from '@/hooks/useEmployees';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  const uploadAvatarMutation = useUploadAvatar();

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
    setSelectedFile(file);
    setPendingUrl(URL.createObjectURL(file));
    setPhotoModalOpen(true);
  }, []);

  const handleSavePhoto = useCallback(() => {
    if (!selectedFile || !user) return;
    const employeeId = (user as any).employeeId || user.id || 'me';

    uploadAvatarMutation.mutate(
      { id: employeeId, file: selectedFile },
      {
        onSuccess: (data) => {
          if (pendingUrl) URL.revokeObjectURL(pendingUrl);
          setAvatarUrl(data.avatarUrl);
          setPhotoModalOpen(false);
          setPendingUrl(null);
          setSelectedFile(null);
          setToast({ type: 'success', message: 'Profile photo uploaded & saved successfully.' });
        },
        onError: (err: any) => {
          setToast({ type: 'error', message: err?.message || 'Failed to upload profile photo.' });
        },
      }
    );
  }, [selectedFile, user, pendingUrl, uploadAvatarMutation]);

  const handleCancelPhoto = useCallback(() => {
    if (pendingUrl) URL.revokeObjectURL(pendingUrl);
    setPhotoModalOpen(false);
    setPendingUrl(null);
    setSelectedFile(null);
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
          {/* Navigation Tabs */}
          <div className="w-full shrink-0 lg:w-64">
            <nav className="flex flex-row space-x-1 overflow-x-auto rounded-xl border border-gray-100 bg-white p-2 shadow-card lg:flex-col lg:space-x-0 lg:space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap lg:w-full ${
                      active
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={18} className={active ? 'text-brand-600' : 'text-gray-400'} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Contents */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Photo Card */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
                  <h2 className="text-base font-semibold text-gray-900">Profile Photo</h2>
                  <p className="mt-0.5 text-sm text-gray-500">This photo will be displayed across your account.</p>

                  <div className="mt-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
                    <div className="relative group">
                      <Avatar
                        src={avatarUrl}
                        name={formData.name}
                        className="h-24 w-24 text-2xl font-bold shadow-md"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                        title="Upload new photo"
                      >
                        <Camera size={16} />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    <div className="text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50"
                        >
                          Upload Photo
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-gray-400">
                        Supports JPG, PNG or WEBP up to 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile Information Form */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">Profile Information</h2>
                      <p className="mt-0.5 text-sm text-gray-500">View and update your personal details.</p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-900 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">Employee ID</label>
                      <input
                        type="text"
                        disabled
                        value={mockAdminProfile.loginId}
                        className="mt-1 w-full rounded-lg border border-gray-150 bg-gray-50 px-3.5 py-2 text-sm text-gray-500 font-mono cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        disabled
                        value={user?.email ?? mockAdminProfile.email}
                        className="mt-1 w-full rounded-lg border border-gray-150 bg-gray-50 px-3.5 py-2 text-sm text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">Mobile Number</label>
                      <input
                        type="text"
                        value={formData.mobile}
                        onChange={(e) => setFormData((p) => ({ ...p, mobile: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-900 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">Company</label>
                      <input
                        type="text"
                        disabled
                        value={mockAdminProfile.company}
                        className="mt-1 w-full rounded-lg border border-gray-150 bg-gray-50 px-3.5 py-2 text-sm text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">Department</label>
                      <input
                        type="text"
                        disabled
                        value={mockAdminProfile.department}
                        className="mt-1 w-full rounded-lg border border-gray-150 bg-gray-50 px-3.5 py-2 text-sm text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">Manager</label>
                      <input
                        type="text"
                        disabled
                        value={mockAdminProfile.manager ?? 'System Administrator'}
                        className="mt-1 w-full rounded-lg border border-gray-150 bg-gray-50 px-3.5 py-2 text-sm text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-900 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
                    >
                      <Save size={16} />
                      {savingProfile ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
                <h2 className="text-base font-semibold text-gray-900">Security Settings</h2>
                <p className="mt-0.5 text-sm text-gray-500">Manage password and security options.</p>

                <div className="mt-6 space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                  <button
                    onClick={handleSecuritySave}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                  >
                    <Save size={16} />
                    {securitySaved ? 'Updated!' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
                <h2 className="text-base font-semibold text-gray-900">Notification Preferences</h2>
                <p className="mt-0.5 text-sm text-gray-500">Choose when and how you get notified.</p>

                <div className="mt-6 space-y-4">
                  {['Email notifications for leave requests', 'Email notifications for payroll updates', 'Browser push notifications', 'System alerts'].map((pref, i) => (
                    <label key={i} className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                      <span className="text-sm text-gray-700">{pref}</span>
                    </label>
                  ))}
                  <button
                    onClick={handleNotifSave}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 mt-4"
                  >
                    <Save size={16} />
                    {notifSaved ? 'Saved!' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
                <h2 className="text-base font-semibold text-gray-900">Appearance</h2>
                <p className="mt-0.5 text-sm text-gray-500">Customize theme and display settings.</p>

                <div className="mt-6 space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Theme</label>
                    <select className="mt-1 w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100">
                      <option>System Default</option>
                      <option>Light</option>
                      <option>Dark</option>
                    </select>
                  </div>
                  <button
                    onClick={handleAppSave}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                  >
                    <Save size={16} />
                    {appSaved ? 'Saved!' : 'Save Appearance'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Photo Confirmation Modal */}
        <ChangePhotoModal
          open={photoModalOpen}
          imageUrl={pendingUrl || ''}
          saving={uploadAvatarMutation.isPending}
          onSave={handleSavePhoto}
          onCancel={handleCancelPhoto}
        />

        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-xl transition-all ${
              toast.type === 'success'
                ? 'bg-emerald-800 text-white'
                : 'bg-rose-800 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
