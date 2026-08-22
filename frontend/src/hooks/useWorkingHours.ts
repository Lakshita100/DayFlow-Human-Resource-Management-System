import { useEffect, useState } from 'react';
import type { TodayAttendance } from '@/types/attendance.types';

function parseTimeToDate(time: string | null): Date | null {
  if (!time) return null;
  const match = time.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function formatElapsed(totalMinutes: number): string {
  const safeMinutes = Math.max(0, totalMinutes);
  return `${String(Math.floor(safeMinutes / 60)).padStart(2, '0')}h ${String(
    safeMinutes % 60
  ).padStart(2, '0')}m`;
}

/**
 * Returns the working-hours string for today's attendance.
 * While checked in, it ticks live by deriving elapsed time from the
 * backend-provided check-in time; otherwise it reflects the stored value.
 */
export function useWorkingHours(today: TodayAttendance | undefined | null): string {
  const [now, setNow] = useState(() => Date.now());

  const isActive = today?.status === 'checked_in';

  useEffect(() => {
    if (!isActive) return;
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, [isActive]);

  if (!today) return '--';

  if (isActive) {
    const start = parseTimeToDate(today.checkInTime);
    if (start) {
      const diffMinutes = Math.floor((now - start.getTime()) / 60_000);
      return formatElapsed(diffMinutes);
    }
  }

  return today.workingHours ?? '--';
}
