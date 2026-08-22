import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { LeaveAnalytics } from '@/types/admin.types';

interface AdminLeaveAnalyticsProps {
  data: LeaveAnalytics;
}

const statusItems = [
  { key: 'approved' as const, label: 'Approved', color: 'bg-emerald-500', textColor: 'text-emerald-600' },
  { key: 'pending' as const, label: 'Pending', color: 'bg-amber-400', textColor: 'text-amber-500' },
  { key: 'rejected' as const, label: 'Rejected', color: 'bg-rose-400', textColor: 'text-rose-500' },
];

export default function AdminLeaveAnalytics({ data }: AdminLeaveAnalyticsProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Leave Overview</h3>

      <div className="flex items-center gap-6">
        <div className="relative h-36 w-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.byType}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={55}
                paddingAngle={3}
                dataKey="percentage"
                strokeWidth={0}
              >
                {data.byType.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-gray-900">{data.totalRequests}</span>
            <span className="text-[10px] text-gray-400">Total</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {data.byType.map((item) => (
            <div key={item.type}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.type}</span>
                </div>
                <span className="text-xs font-medium text-gray-900">{item.percentage}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-4">
        <div className="grid grid-cols-3 gap-3">
          {statusItems.map((item) => (
            <div key={item.key} className="text-center">
              <p className={`text-lg font-bold ${item.textColor}`}>{data[item.key]}</p>
              <p className="text-[11px] text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
