import { Lock } from 'lucide-react';
import type { EmployeeProfile } from '@/types/profile.types';

interface ProfessionalInformationCardProps {
  data: EmployeeProfile;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatEmploymentType(type: string): string {
  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface FieldRowProps {
  label: string;
  value: string;
  locked?: boolean;
}

function FieldRow({ label, value, locked = false }: FieldRowProps) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-4">
      <dt className="w-40 shrink-0 text-sm text-gray-500">{label}</dt>
      <dd className="flex flex-1 items-center gap-1.5 text-sm font-medium text-gray-900">
        {locked && <Lock size={12} className="shrink-0 text-gray-400" />}
        {value}
      </dd>
    </div>
  );
}

export default function ProfessionalInformationCard({ data }: ProfessionalInformationCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Professional Information</h3>
      <dl className="divide-y divide-gray-50">
        <FieldRow label="Employee ID" value={data.employeeId} locked />
        <FieldRow label="Department" value={data.department} locked />
        <FieldRow label="Designation" value={data.designation} />
        <FieldRow label="Joining Date" value={formatDate(data.dateOfJoining)} locked />
        <FieldRow label="Employment Type" value={formatEmploymentType(data.employmentType)} locked />
        <FieldRow label="Work Location" value={data.workLocation} />
        <FieldRow label="Reporting To" value={data.reportingTo ?? 'Not assigned'} />
      </dl>
    </div>
  );
}
