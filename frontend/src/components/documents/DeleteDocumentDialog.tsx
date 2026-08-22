import { AlertTriangle } from 'lucide-react';
import type { DocumentRecord } from '@/types/document.types';

interface DeleteDocumentDialogProps {
  document: DocumentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isDeleting: boolean;
}

export default function DeleteDocumentDialog({ document, isOpen, onClose, onConfirm, isDeleting }: DeleteDocumentDialogProps) {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900">Delete this document?</h3>
        <p className="mt-2 text-sm text-gray-500">
          Are you sure you want to delete <span className="font-medium text-gray-700">{document.name}</span>?
          This action cannot be undone.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(document.id)}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Document'}
          </button>
        </div>
      </div>
    </div>
  );
}
