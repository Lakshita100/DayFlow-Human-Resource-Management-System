import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useLeaveBalanceMock } from "@/hooks/useLeave";

const SEGMENT_COLORS: Record<string, string> = {
  PAID: "#7c3aed",
  paid: "#7c3aed",
  SICK: "#f59e0b",
  sick: "#f59e0b",
  UNPAID: "#6b7280",
  unpaid: "#6b7280",
};

export default function LeaveBalanceOverview() {
  const data = useLeaveBalanceMock();

  const balances: any[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.balances)
    ? (data as any).balances
    : Array.isArray((data as any)?.allocations)
    ? (data as any).allocations
    : [];

  const chartData = balances.map((b: any) => {
    const typeKey = (b.type || '').toString().toLowerCase();
    const uppercaseType = (b.type || '').toString().toUpperCase();
    return {
      name: b.label || `${b.type || 'Leave'} Leave`,
      value: b.available ?? Math.max(0, (b.total ?? 0) - (b.used ?? 0)),
      color: SEGMENT_COLORS[uppercaseType] ?? SEGMENT_COLORS[typeKey] ?? b.color ?? "#3b82f6",
    };
  });

  const totalUsed = balances.reduce((sum: number, b: any) => sum + (b.used ?? 0), 0);
  const totalPending = balances.reduce((sum: number, b: any) => sum + (b.pending ?? 0), 0);
  const totalAvailable = balances.reduce(
    (sum: number, b: any) => sum + (b.available ?? Math.max(0, (b.total ?? 0) - (b.used ?? 0))),
    0
  );

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="text-sm font-semibold text-gray-900">Leave Balance</h3>
      <p className="mt-1 text-xs text-gray-400">
        Annual leave allocation breakdown
      </p>

      <div className="mt-6 flex flex-row items-center gap-6">
        {/* Donut chart */}
        <div className="relative h-[160px] w-[160px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 160 160"
          >
            <text
              x="50%"
              y="46%"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-gray-900 text-xl font-bold"
            >
              {totalAvailable}
            </text>
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-gray-400 text-[10px]"
            >
              Days Available
            </text>
          </svg>
        </div>

        {/* Breakdown list */}
        <div className="flex-1 space-y-3">
          {balances.map((balance: any, idx: number) => {
            const typeKey = (balance.type || '').toString().toLowerCase();
            const uppercaseType = (balance.type || '').toString().toUpperCase();
            const color = SEGMENT_COLORS[uppercaseType] ?? SEGMENT_COLORS[typeKey] ?? balance.color ?? "#3b82f6";
            return (
              <div key={balance.type || idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-700">
                    {balance.label || `${balance.type || 'Leave'} Leave`}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {balance.used ?? 0} / {balance.total ?? 0} days
                </span>
              </div>
            );
          })}

          <div className="border-t border-gray-100 pt-3" />

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Used</span>
            <span className="text-sm font-medium text-gray-900">
              {totalUsed} days
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Pending</span>
            <span className="text-sm font-medium text-gray-900">
              {totalPending} days
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Available</span>
            <span className="text-sm font-medium text-gray-900">
              {totalAvailable} days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
