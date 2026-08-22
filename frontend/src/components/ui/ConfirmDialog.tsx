import { useEffect, useRef } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmColor = 'bg-rose-600 hover:bg-rose-700',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onCancel();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onCancel} aria-hidden="true" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-2xl focus:outline-none"
      >
        <button
          onClick={onCancel}
          className="absolute right-3 top-3 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-full bg-rose-50">
          <AlertTriangle size={20} className="text-rose-500" />
        </div>

        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{description}</p>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2.5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 ${confirmColor}`}
          >
            {loading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
