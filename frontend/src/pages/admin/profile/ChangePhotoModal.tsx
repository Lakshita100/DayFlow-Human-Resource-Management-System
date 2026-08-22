import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ChangePhotoModalProps {
  open: boolean;
  imageUrl: string;
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export default function ChangePhotoModal({ open, imageUrl, saving, onCancel, onSave }: ChangePhotoModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && open && !saving) onCancel();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, saving, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={saving ? undefined : onCancel} />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Change profile photo"
        className="relative mx-4 w-full max-w-[440px] rounded-xl border border-gray-100 bg-white p-6 shadow-xl focus:outline-none"
      >
        <button
          onClick={onCancel}
          disabled={saving}
          className="absolute right-3 top-3 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <h3 className="text-base font-semibold text-gray-900">Change Profile Photo</h3>
        <p className="mt-1 text-xs text-gray-500">Preview</p>

        <div className="flex flex-col items-center py-6">
          <img
            src={imageUrl}
            alt="Selected profile photo preview"
            className="h-36 w-36 rounded-full object-cover object-center ring-4 ring-gray-50"
          />
          <p className="mt-4 text-xs text-gray-400">Your profile photo will be visible across Dayflow.</p>
        </div>

        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {saving && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {saving ? 'Saving...' : 'Save Photo'}
          </button>
        </div>
      </div>
    </div>
  );
}
