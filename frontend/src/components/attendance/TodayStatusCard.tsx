import { Clock, CheckCircle, LogIn, LogOut } from 'lucide-react';
import type { TodayAttendance } from '@/types/attendance.types';

interface TodayStatusCardProps {
  today: TodayAttendance;
  onCheckIn: () => void;
  onCheckOut: () => void;
  isCheckingIn: boolean;
  isCheckingOut: boolean;
}

export default function TodayStatusCard({
  today,
  onCheckIn,
  onCheckOut,
  isCheckingIn,
  isCheckingOut,
}: TodayStatusCardProps) {
  const renderStatusIndicator = () => {
    if (today.status === 'checked_in') {
      return <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />;
    }
    if (today.status === 'checked_out') {
      return <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-400" />;
    }
    return <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />;
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gray-50 p-2.5">
            <Clock size={20} className="text-gray-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              {renderStatusIndicator()}
              <h3 className="text-sm font-semibold text-gray-900">Today's Attendance</h3>
            </div>
            <p className="mt-0.5 text-xs text-gray-400">{today.date}</p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        {today.status === 'not_checked_in' && (
          <div className="flex flex-col items-start gap-3">
            <div>
              <p className="text-lg font-semibold text-gray-900">Not Checked In</p>
              <p className="mt-0.5 text-sm text-gray-400">You haven't checked in today</p>
            </div>
            <button
              onClick={onCheckIn}
              disabled={isCheckingIn}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCheckingIn ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <LogIn size={16} />
              )}
              {isCheckingIn ? 'Checking In...' : 'Check In'}
            </button>
          </div>
        )}

        {today.status === 'checked_in' && (
          <div className="flex flex-col items-start gap-3">
            <div>
              <p className="text-lg font-semibold text-emerald-600">Present</p>
              <p className="mt-0.5 text-sm text-gray-400">
                Checked in at: {today.checkInTime}
              </p>
              {today.workingHours && (
                <p className="mt-1 text-sm font-medium text-blue-600">
                  Current working time: {today.workingHours}
                </p>
              )}
            </div>
            <button
              onClick={onCheckOut}
              disabled={isCheckingOut}
              className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCheckingOut ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <LogOut size={16} />
              )}
              {isCheckingOut ? 'Checking Out...' : 'Check Out'}
            </button>
          </div>
        )}

        {today.status === 'checked_out' && (
          <div className="flex flex-col items-start gap-3">
            <p className="text-lg font-semibold text-gray-500">Attendance Completed</p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="rounded-lg bg-gray-50 px-3 py-2">
                <p className="text-xs text-gray-400">Check In</p>
                <p className="text-sm font-medium text-gray-900">{today.checkInTime}</p>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2">
                <p className="text-xs text-gray-400">Check Out</p>
                <p className="text-sm font-medium text-gray-900">{today.checkOutTime}</p>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2">
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-sm font-medium text-gray-900">{today.workingHours}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
              <CheckCircle size={12} />
              Completed for today
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
