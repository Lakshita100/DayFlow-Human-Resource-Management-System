import type { EmployeePersonalInfo } from '@/types/profile.types';

interface PersonalInformationCardProps {
  data: EmployeePersonalInfo;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Not provided';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface FieldRowProps {
  label: string;
  value: string | null;
}

function FieldRow({ label, value }: FieldRowProps) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-4">
      <dt className="w-40 shrink-0 text-sm text-gray-500">{label}</dt>
      <dd className="flex-1 text-sm font-medium text-gray-900">{value || 'Not provided'}</dd>
    </div>
  );
}

export default function PersonalInformationCard({ data }: PersonalInformationCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Personal Information</h3>
      <dl className="divide-y divide-gray-50">
        <FieldRow label="Date of Birth" value={formatDate(data.dateOfBirth)} />
        <FieldRow label="Gender" value={data.gender} />
        <FieldRow label="Address" value={data.address} />
        <FieldRow label="City" value={data.city} />
        <FieldRow label="State" value={data.state} />
        <FieldRow label="Zip Code" value={data.zipCode} />
        <FieldRow label="Country" value={data.country} />
      </dl>
    </div>
  );
}
