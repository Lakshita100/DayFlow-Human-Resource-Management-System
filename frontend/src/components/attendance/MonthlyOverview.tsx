import { MonthlyOverview as MonthlyOverviewType } from "@/types/attendance.types";
import { TrendingUp } from "lucide-react";

interface MonthlyOverviewCardProps {
  data: MonthlyOverviewType;
}

export default function MonthlyOverviewCard({
  data,
}: MonthlyOverviewCardProps) {
  const stats = [
    { label: "Present", count: data.present, dot: "bg-emerald-500" },
    { label: "Half Day", count: data.halfDay, dot: "bg-orange-500" },
    { label: "Absent", count: data.absent, dot: "bg-red-500" },
    { label: "Leave", count: data.leave, dot: "bg-blue-500" },
    { label: "Weekly Off", count: data.weeklyOff, dot: "bg-sky-400" },
  ];

  const percentage = data.attendancePercentage;
  const percentageColor =
    percentage >= 90
      ? "text-emerald-600"
      : percentage >= 75
        ? "text-brand-600"
        : "text-red-600";

  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-card p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          This Month Overview
        </h3>
        <p className="text-xs text-gray-400">Attendance breakdown</p>
      </div>

      <div className="space-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${stat.dot}`} />
              <span className="text-sm text-gray-600">{stat.label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {stat.count}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 my-4" />

      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="text-brand-600" size={16} />
        <span className="text-sm text-gray-600">Attendance Percentage</span>
      </div>
      <p className={`text-2xl font-bold ${percentageColor}`}>
        {percentage.toFixed(2)}%
      </p>
    </div>
  );
}
