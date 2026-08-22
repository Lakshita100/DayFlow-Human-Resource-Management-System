import { Shield } from 'lucide-react';
import type { EmployeePrivateInfo } from '@/types/profile.types';

interface PrivateInformationCardProps {
  data: EmployeePrivateInfo;
}

interface FieldRowProps {
  label: string;
  value: string | null;
}

function FieldRow({ label, value }: FieldRowProps) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-4">
      <dt className="w-40 shrink-0 text-sm text-gray-500">{label}</dt>
      <dd className="flex-1 text-sm font-medium text-gray-900">{value || 'Not added yet'}</dd>
    </div>
  );
}

export default function PrivateInformationCard({ data }: PrivateInformationCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Private Information</h3>
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
          <Shield size={12} />
          Restricted
        </div>
      </div>

      <div className="mb-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
        Only authorized HR/Admin users can access sensitive employee information.
      </div>

      <dl className="divide-y divide-gray-50">
        <FieldRow label="Emergency Contact" value={data.emergencyContactName} />
        <FieldRow label="Emergency Phone" value={data.emergencyContactPhone} />
        <FieldRow label="Private Email" value={data.privateEmail} />
        <FieldRow label="Private Address" value={data.privateAddress} />
      </dl>
    </div>
  );
}
