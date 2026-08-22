import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { RecentEmployee } from '@/types/admin.types';

interface AdminRecentEmployeesProps {
  data: RecentEmployee[];
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

const deptColors: Record<string, string> = {
  Engineering: 'bg-blue-50 text-blue-700',
  Design: 'bg-violet-50 text-violet-700',
  Marketing: 'bg-amber-50 text-amber-700',
  HR: 'bg-emerald-50 text-emerald-700',
  Finance: 'bg-rose-50 text-rose-700',
  Operations: 'bg-gray-50 text-gray-600',
  Sales: 'bg-cyan-50 text-cyan-700',
};

export default function AdminRecentEmployees({ data }: AdminRecentEmployeesProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Recently Joined</h3>
        <button
          onClick={() => navigate('/admin/employees')}
          className="text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          View All
        </button>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <p className="text-sm font-medium text-gray-900">No recent employees.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((emp) => (
            <div
              key={emp.id}
              className="flex items-center gap-3 rounded-lg border border-gray-100 p-3.5 transition-colors hover:border-gray-200 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                {getInitials(emp.firstName, emp.lastName)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {emp.firstName} {emp.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {emp.employeeId} &middot; {emp.designation}
                </p>
              </div>
              <div className="hidden shrink-0 sm:block">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    deptColors[emp.department] ?? 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {emp.department}
                </span>
              </div>
              <div className="hidden shrink-0 text-right md:block">
                <p className="text-xs text-gray-500">Joined</p>
                <p className="text-xs font-medium text-gray-700">{emp.dateOfJoining}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/admin/employees')}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
      >
        View All Employees
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
