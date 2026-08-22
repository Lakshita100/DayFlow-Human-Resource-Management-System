import { useState, useEffect, useRef, useCallback } from 'react';
import { Mail, Phone, Building2, MapPin, User, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { PageTabs } from '@/components/ui/Tabs';
import Avatar from '@/components/ui/Avatar';
import { mockAdminProfile, mockAdminSalaryInfo, mockAdminResume } from '@/data/adminProfileMock';
import ResumeTab from './ResumeTab';
import ResumeSkeleton from './ResumeSkeleton';
import SalaryInfoTab from './SalaryInfoTab';
import SalaryInfoSkeleton from './SalaryInfoSkeleton';
import ChangePhotoModal from './ChangePhotoModal';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

function ProfileInfoRow({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
        <Icon size={16} className="text-gray-500" />
      </div>
      <div>
        <p className="text-[11px] font-medium text-gray-400 uppercase">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function AdminProfilePage() {
  const [activeTab, setActiveTab] = useState('resume');
  const [resumeLoading, setResumeLoading] = useState(true);
  const [salaryLoading, setSalaryLoading] = useState(true);
  const profile = mockAdminProfile;

  // Profile photo state (frontend-only until upload API exists)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setResumeLoading(true);
    setSalaryLoading(true);
    const t = setTimeout(() => {
      setResumeLoading(false);
      setSalaryLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, [activeTab]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

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
    // No profile-photo upload API exists yet — keep in frontend state only.
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

  const tabs = [
    { key: 'resume', label: 'Resume' },
    { key: 'private', label: 'Private Info' },
    { key: 'salary', label: 'Salary Info' },
  ];

  return (
    <PageContainer>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-0.5 text-sm text-gray-500">View and manage your professional profile.</p>
        </div>

        {/* Profile Header Card */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Avatar with change-photo interaction */}
            <div className="group shrink-0">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
                <Avatar
                  src={avatarUrl}
                  name={profile.name}
                  className="h-full w-full text-lg sm:text-xl lg:text-2xl"
                />
                {/* Hover overlay (desktop) */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change profile photo"
                  className="absolute inset-0 hidden cursor-pointer items-center justify-center rounded-full bg-black/35 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex"
                >
                  <span className="text-[10px] font-medium text-white">Change photo</span>
                </button>
                {/* Camera button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change profile photo"
                  className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-white shadow-md transition-colors hover:bg-brand-700 sm:h-8 sm:w-8"
                >
                  <Camera size={13} />
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

            {/* Info Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <ProfileInfoRow label="Name" value={profile.name} icon={User} />
                <ProfileInfoRow label="Login ID" value={profile.loginId} icon={User} />
                <ProfileInfoRow label="Email" value={profile.email} icon={Mail} />
                <ProfileInfoRow label="Mobile" value={profile.mobile} icon={Phone} />
                <ProfileInfoRow label="Company" value={profile.company} icon={Building2} />
                <ProfileInfoRow label="Department" value={profile.department} icon={Building2} />
                <ProfileInfoRow label="Manager" value={profile.manager ?? '\u2014'} icon={User} />
                <ProfileInfoRow label="Location" value={profile.location} icon={MapPin} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <PageTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'resume' && (resumeLoading ? <ResumeSkeleton /> : <ResumeTab resume={mockAdminResume} />)}

        {activeTab === 'private' && (
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
            <h3 className="mb-4 text-base font-semibold text-gray-900">Private Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-gray-400">Emergency Contact</p>
                <p className="text-sm text-gray-900">Not configured</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Private Email</p>
                <p className="text-sm text-gray-900">Not configured</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Private Address</p>
                <p className="text-sm text-gray-900">Not configured</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'salary' && (salaryLoading ? <SalaryInfoSkeleton /> : <SalaryInfoTab salary={mockAdminSalaryInfo} />)}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle size={18} className="shrink-0 text-rose-500" />
          )}
          <p className="text-sm text-gray-700">{toast.message}</p>
        </div>
      )}

      {/* Change Photo Modal */}
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
