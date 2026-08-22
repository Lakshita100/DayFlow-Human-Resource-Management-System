import { Camera, Mail, Building2, CalendarDays, Briefcase } from 'lucide-react';
import type { EmployeeProfile } from '@/types/profile.types';

interface ProfileHeaderProps {
  profile: EmployeeProfile;
  onEditPhoto: () => void;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const statusConfig = {
  ACTIVE: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  INACTIVE: { label: 'Inactive', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
};

export default function ProfileHeader({ profile, onEditPhoto }: ProfileHeaderProps) {
  const initials = getInitials(profile.firstName, profile.lastName);
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const status = statusConfig[profile.status];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-col items-start gap-6 sm:flex-row">
        {/* Avatar */}
        <div className="relative shrink-0">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={fullName}
              className="h-24 w-24 rounded-2xl object-cover ring-4 ring-gray-50"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-brand-100 text-2xl font-bold text-brand-700 ring-4 ring-gray-50">
              {initials}
            </div>
          )}
          <button
            onClick={onEditPhoto}
            className="absolute -bottom-1 -right-1 rounded-lg bg-white p-1.5 text-gray-500 shadow-md transition-colors hover:bg-brand-50 hover:text-brand-600"
            aria-label="Change profile photo"
          >
            <Camera size={14} />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
              <p className="mt-0.5 text-sm text-gray-500">{profile.designation}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-medium ${status.bg} ${status.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Briefcase size={14} className="text-gray-400" />
              {profile.employeeId}
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 size={14} className="text-gray-400" />
              {profile.department}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-gray-400" />
              Joined {formatDate(profile.dateOfJoining)}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={14} className="text-gray-400" />
              {profile.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
