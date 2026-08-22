import { X, Download, FileText, Image, File } from 'lucide-react';
import DocumentStatusBadge from './DocumentStatusBadge';
import type { DocumentRecord } from '@/types/document.types';

interface DocumentPreviewProps {
  document: DocumentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (doc: DocumentRecord) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getFileIcon(fileType: string) {
  const type = fileType.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)) return Image;
  if (type === 'pdf') return FileText;
  return File;
}

export default function DocumentPreview({ document, isOpen, onClose, onDownload }: DocumentPreviewProps) {
  if (!isOpen || !document) return null;

  const FileIcon = getFileIcon(document.fileType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Document Preview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(document)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex items-center justify-center bg-gray-50 p-8">
          <div className="flex flex-col items-center">
            <FileIcon className="h-20 w-20 text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-700">{document.fileName}</p>
            <p className="text-xs text-gray-400">{document.fileType.toUpperCase()} · {formatFileSize(document.fileSize)}</p>
          </div>
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">{document.name}</h3>
              <p className="text-sm text-gray-500">
                {document.category.charAt(0).toUpperCase() + document.category.slice(1)}
              </p>
            </div>
            <DocumentStatusBadge status={document.status} size="md" />
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
            <div>
              <p className="text-xs text-gray-500">Uploaded</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(document.uploadedAt)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">File Size</p>
              <p className="text-sm font-medium text-gray-900">{formatFileSize(document.fileSize)}</p>
            </div>
            {document.expiryDate && (
              <div>
                <p className="text-xs text-gray-500">Expiry Date</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(document.expiryDate)}</p>
              </div>
            )}
            {document.description && (
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-gray-700">{document.description}</p>
              </div>
            )}
          </div>

          {document.reviewComment && (
            <div className="mt-4 rounded-xl bg-orange-50 p-4">
              <p className="text-xs font-medium text-orange-700">Review Comment</p>
              <p className="mt-1 text-sm text-orange-600">{document.reviewComment}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
