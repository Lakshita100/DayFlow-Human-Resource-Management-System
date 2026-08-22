import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import type { LeaveBalanceDetail } from '@/types/dashboard.types';
import { mockLeaveBalance } from '@/data/mockDashboard';

interface LeaveBalanceChartProps {
  data?: LeaveBalanceDetail[];
}

export default function LeaveBalanceChart({ data = mockLeaveBalance }: LeaveBalanceChartProps) {
  const navigate = useNavigate();

  const totalBalance = data.reduce((acc, item) => acc + (item.total - item.used), 0);
  const chartData = data.map((item) => ({
    name: item.type,
    value: item.total - item.used,
    color: item.color,
  }));

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Leave Balance</h3>

      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{totalBalance}</span>
            <span className="text-[10px] text-gray-400">Days Left</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-3">
          {data.map((item) => (
            <div key={item.type}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.type}</span>
                </div>
                <span className="text-xs font-medium text-gray-900">
                  {item.total - item.used} days
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${((item.total - item.used) / item.total) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate('/employee/leave')}
        className="mt-5 w-full rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100"
      >
        Apply Leave
      </button>
    </div>
  );
}
