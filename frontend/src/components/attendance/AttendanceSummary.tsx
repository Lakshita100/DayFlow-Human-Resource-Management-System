import TodayStatusCard from "./TodayStatusCard";
import WorkingHoursCard from "./WorkingHoursCard";
import { TodayAttendance } from "@/types/attendance.types";

interface AttendanceSummaryProps {
  today: TodayAttendance;
  onCheckIn: () => void;
  onCheckOut: () => void;
  isCheckingIn: boolean;
  isCheckingOut: boolean;
}

export default function AttendanceSummary({
  today,
  onCheckIn,
  onCheckOut,
  isCheckingIn,
  isCheckingOut,
}: AttendanceSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <TodayStatusCard
        today={today}
        onCheckIn={onCheckIn}
        onCheckOut={onCheckOut}
        isCheckingIn={isCheckingIn}
        isCheckingOut={isCheckingOut}
      />
      <WorkingHoursCard hours={today.workingHours} />
    </div>
  );
}
