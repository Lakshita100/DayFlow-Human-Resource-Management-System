import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AttendanceTrendPoint } from '@/types/admin.types';

interface AdminAttendanceChartProps {
  data: AttendanceTrendPoint[];
}

type Period = 'week' | 'month' | 'quarter';

export default function AdminAttendanceChart({ data }: AdminAttendanceChartProps) {
  const [period, setPeriod] = useState<Period>('week');

  const filteredData = period === 'week' ? data : period === 'month' ? data.concat(data.slice(0, 3)) : data.concat(data).concat(data.slice(0, 2));

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Attendance Overview</h3>
          <p className="mt-1 text-xs text-gray-500">Workforce attendance for the current period</p>
        </div>
        <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          {(['week', 'month', 'quarter'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                period === p
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                fontSize: '12px',
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
            />
            <Line
              type="monotone"
              dataKey="present"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4, fill: '#10b981' }}
              activeDot={{ r: 6 }}
              name="Present"
            />
            <Line
              type="monotone"
              dataKey="absent"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={{ r: 4, fill: '#f43f5e' }}
              activeDot={{ r: 6 }}
              name="Absent"
            />
            <Line
              type="monotone"
              dataKey="leave"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 4, fill: '#8b5cf6' }}
              activeDot={{ r: 6 }}
              name="Leave"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
