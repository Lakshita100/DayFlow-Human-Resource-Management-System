import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { UpcomingLeave as UpcomingLeaveType } from '@/types/dashboard.types';
import { mockUpcomingLeaves } from '@/data/mockDashboard';

interface UpcomingLeaveProps {
  data?: UpcomingLeaveType[];
}

const statusConfig = {
  pending: {
    label: 'Pending Approval',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
  },
  approved: {
    label: 'Approved',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-400',
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    dot: 'bg-rose-400',
  },
};

export default function UpcomingLeave({ data = mockUpcomingLeaves }: UpcomingLeaveProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Upcoming Leave</h3>
        <button
          onClick={() => navigate('/employee/leave')}
          className="text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          View All
        </button>
      </div>

      {data.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400">
          No upcoming leave requests.
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((leave) => {
            const status = statusConfig[leave.status];
            return (
              <div
                key={leave.id}
                className="rounded-lg border border-gray-100 p-3.5 transition-colors hover:border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{leave.type}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {leave.startDate} \u2013 {leave.endDate}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {leave.days} Day{leave.days > 1 ? 's' : ''}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${status.bg} ${status.text}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => navigate('/employee/leave')}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
      >
        View All Requests
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
