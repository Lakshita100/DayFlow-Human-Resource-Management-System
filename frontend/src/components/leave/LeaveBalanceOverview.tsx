import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useLeaveBalanceMock } from "@/hooks/useLeave";

const SEGMENT_COLORS: Record<string, string> = {
  paid: "#7c3aed",
  sick: "#f59e0b",
  unpaid: "#6b7280",
};

export default function LeaveBalanceOverview() {
  const data = useLeaveBalanceMock();

  const chartData = data.balances.map((b: any) => ({
    name: b.label,
    value: b.available,
    color: SEGMENT_COLORS[b.type] ?? b.color,
  }));

  const totalUsed = data.balances.reduce((sum: number, b: any) => sum + b.used, 0);
  const totalPending = data.balances.reduce((sum: number, b: any) => sum + b.pending, 0);
  const totalAvailable = data.balances.reduce((sum: number, b: any) => sum + b.available, 0);

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
          {data.balances.map((balance: any) => (
            <div key={balance.type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: balance.color }}
                />
                <span className="text-sm text-gray-700">{balance.label}</span>
              </div>
              <span className="text-sm text-gray-500">
                {balance.used} / {balance.total} days
              </span>
            </div>
          ))}

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
