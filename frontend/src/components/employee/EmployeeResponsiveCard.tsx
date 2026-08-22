import { Mail } from 'lucide-react';
import type { EmployeeListItem } from '@/types/admin-pages.types';

interface EmployeeResponsiveCardProps {
  employee: EmployeeListItem;
  onSelect: (employee: EmployeeListItem) => void;
  deptColors?: Record<string, string>;
}

function getInitials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

const defaultDeptColors: Record<string, string> = {
  Engineering: 'bg-blue-50 text-blue-700',
  Design: 'bg-violet-50 text-violet-700',
  Marketing: 'bg-amber-50 text-amber-700',
  HR: 'bg-emerald-50 text-emerald-700',
  Finance: 'bg-rose-50 text-rose-700',
  Operations: 'bg-gray-50 text-gray-600',
  Management: 'bg-indigo-50 text-indigo-700',
};

export default function EmployeeResponsiveCard({
  employee,
  onSelect,
  deptColors = defaultDeptColors,
}: EmployeeResponsiveCardProps) {
  return (
    <div
      onClick={() => onSelect(employee)}
      className="group relative cursor-pointer rounded-xl border border-gray-100 bg-white p-4 shadow-card transition-all hover:border-brand-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
            {getInitials(employee.firstName, employee.lastName)}
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-brand-600">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-xs text-gray-500 font-mono">{employee.employeeId}</p>
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            employee.status === 'ACTIVE'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-gray-50 text-gray-500 border border-gray-100'
          }`}
        >
          {employee.status === 'ACTIVE' ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="mt-3.5 space-y-2 border-t border-gray-50 pt-3 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Department:</span>
          <span
            className={`rounded-full px-2 py-0.5 font-medium ${
              deptColors[employee.department] ?? 'bg-gray-50 text-gray-600'
            }`}
          >
            {employee.department}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Role:</span>
          <span className="font-medium text-gray-800">{employee.designation}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate text-gray-500 pt-1">
          <Mail size={13} className="shrink-0 text-gray-400" />
          <span className="truncate">{employee.email}</span>
        </div>
      </div>
    </div>
  );
}
