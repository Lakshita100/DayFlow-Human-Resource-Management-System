import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AttendanceTrend } from '@/types/attendance.types';

interface AttendanceTrendChartProps {
  data: AttendanceTrend;
}

type Period = 'thisMonth' | 'lastMonth' | 'last3Months';

const periodLabels: Record<Period, string> = {
  thisMonth: 'This Month',
  lastMonth: 'Last Month',
  last3Months: 'Last 3 Months',
};

export default function AttendanceTrendChart({ data }: AttendanceTrendChartProps) {
  const [period, setPeriod] = useState<Period>('thisMonth');
  const chartData = data[period];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Attendance Trend</h3>
          <p className="text-xs text-gray-400">Weekly attendance percentage</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-gray-50 p-0.5">
          {(Object.keys(periodLabels) as Period[]).map((key) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                period === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {periodLabels[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Attendance']}
            />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke="#7c3aed"
              strokeWidth={2}
              dot={{ fill: '#7c3aed', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
