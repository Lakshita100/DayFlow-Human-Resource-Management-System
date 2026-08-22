import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { PendingLeaveRequest } from '@/types/admin.types';

interface AdminPendingLeaveProps {
  data: PendingLeaveRequest[];
}

const leaveTypeColor: Record<string, string> = {
  'Sick Leave': 'bg-amber-50 text-amber-700',
  'Paid Leave': 'bg-violet-50 text-violet-700',
  'Unpaid Leave': 'bg-gray-50 text-gray-600',
};

export default function AdminPendingLeave({ data }: AdminPendingLeaveProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Pending Leave Requests</h3>
        <button
          onClick={() => navigate('/admin/time-off')}
          className="text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          View All
        </button>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <p className="text-sm font-medium text-gray-900">You&apos;re all caught up.</p>
          <p className="mt-1 text-xs text-gray-500">No pending leave requests.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-xs font-medium text-gray-500">Employee</th>
                <th className="pb-2 text-xs font-medium text-gray-500">Type</th>
                <th className="hidden pb-2 text-xs font-medium text-gray-500 sm:table-cell">Date Range</th>
                <th className="hidden pb-2 text-xs font-medium text-gray-500 md:table-cell">Days</th>
                <th className="hidden pb-2 text-xs font-medium text-gray-500 lg:table-cell">Applied</th>
                <th className="pb-2 text-xs font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((req) => (
                <tr key={req.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{req.employeeName}</p>
                      <p className="text-xs text-gray-400">{req.employeeId} &middot; {req.department}</p>
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        leaveTypeColor[req.leaveType] ?? 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {req.leaveType}
                    </span>
                  </td>
                  <td className="hidden py-3 text-sm text-gray-600 sm:table-cell">
                    {req.startDate} &ndash; {req.endDate}
                  </td>
                  <td className="hidden py-3 text-sm text-gray-600 md:table-cell">
                    {req.days} day{req.days > 1 ? 's' : ''}
                  </td>
                  <td className="hidden py-3 text-xs text-gray-400 lg:table-cell">
                    {req.appliedOn}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => navigate('/admin/time-off')}
                      className="rounded-md bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.length > 0 && (
        <button
          onClick={() => navigate('/admin/time-off')}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          View All Requests
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
