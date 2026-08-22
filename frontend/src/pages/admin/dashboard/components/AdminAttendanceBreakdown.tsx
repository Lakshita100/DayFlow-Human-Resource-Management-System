import type { AttendanceBreakdown } from '@/types/admin.types';

interface AdminAttendanceBreakdownProps {
  data: AttendanceBreakdown;
}

const total = (d: AttendanceBreakdown) =>
  d.present + d.absent + d.onLeave + d.halfDay + d.weeklyOff;

const items = [
  { key: 'present' as const, label: 'Present', color: 'bg-emerald-500', textColor: 'text-emerald-600' },
  { key: 'absent' as const, label: 'Absent', color: 'bg-rose-400', textColor: 'text-rose-500' },
  { key: 'onLeave' as const, label: 'On Leave', color: 'bg-violet-400', textColor: 'text-violet-500' },
  { key: 'halfDay' as const, label: 'Half Day', color: 'bg-amber-400', textColor: 'text-amber-500' },
  { key: 'weeklyOff' as const, label: 'Weekly Off', color: 'bg-gray-300', textColor: 'text-gray-500' },
];

export default function AdminAttendanceBreakdown({ data }: AdminAttendanceBreakdownProps) {
  const totalEmployees = total(data);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Attendance Breakdown</h3>

      <div className="space-y-4">
        {items.map((item) => {
          const count = data[item.key];
          const pct = totalEmployees > 0 ? ((count / totalEmployees) * 100).toFixed(1) : '0';
          return (
            <div key={item.key}>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${item.textColor}`}>{count}</span>
                  <span className="text-xs text-gray-400">{pct}%</span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100">
                <div
                  className={`h-2 rounded-full transition-all ${item.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Total Workforce</span>
          <span className="text-sm font-bold text-gray-900">{totalEmployees}</span>
        </div>
      </div>
    </div>
  );
}
