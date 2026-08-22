import { CalendarOff } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import type { UpcomingLeave as UpcomingLeaveType } from "@/types/leave.types";

interface UpcomingLeaveProps {
  leaves: UpcomingLeaveType[];
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const startStr = start.toLocaleDateString("en-US", options);
  const endStr = end.toLocaleDateString("en-US", options);

  return `${startStr} - ${endStr}`;
}

export default function UpcomingLeave({ leaves }: UpcomingLeaveProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <h2 className="text-sm font-semibold text-gray-900">Upcoming Time Off</h2>

      {leaves.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 text-gray-400">
          <CalendarOff className="h-8 w-8" />
          <p className="text-sm">No upcoming leave.</p>
        </div>
      ) : (
        <div className="mt-4">
          {leaves.map((leave, index) => (
            <div
              key={leave.id}
              className={`flex items-center justify-between py-3 ${
                index < leaves.length - 1 ? "border-b border-gray-50" : ""
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-gray-900">
                  {leave.leaveType}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDateRange(leave.startDate, leave.endDate)}
                </span>
                <span className="text-xs text-gray-400">
                  {leave.days} day(s)
                </span>
              </div>

              <StatusBadge status={leave.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
