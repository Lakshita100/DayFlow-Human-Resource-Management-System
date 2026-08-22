import { AlertTriangle, RefreshCw } from 'lucide-react';

interface AttendanceErrorProps {
  onRetry: () => void;
}

export default function AttendanceError({ onRetry }: AttendanceErrorProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white py-12 text-center shadow-card">
      <div className="mb-3 rounded-full bg-rose-50 p-3">
        <AlertTriangle size={24} className="text-rose-500" />
      </div>
      <p className="text-sm font-medium text-gray-900">Unable to load attendance.</p>
      <p className="mt-1 text-xs text-gray-500">Something went wrong while fetching attendance data.</p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
      >
        <RefreshCw size={14} />
        Try Again
      </button>
    </div>
  );
}
