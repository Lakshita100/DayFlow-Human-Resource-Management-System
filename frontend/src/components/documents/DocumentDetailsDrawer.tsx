import { X, FileText, Image, File, Calendar, Tag, HardDrive, Clock, MessageSquare } from 'lucide-react';
import DocumentStatusBadge from './DocumentStatusBadge';
import type { DocumentRecord } from '@/types/document.types';

interface DocumentDetailsDrawerProps {
  document: DocumentRecord | null;
  isOpen: boolean;
  onClose: () => void;
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

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    personal: 'bg-blue-50 text-blue-700',
    identity: 'bg-purple-50 text-purple-700',
    education: 'bg-emerald-50 text-emerald-700',
    employment: 'bg-brand-50 text-brand-700',
    banking: 'bg-amber-50 text-amber-700',
    tax: 'bg-indigo-50 text-indigo-700',
    certificates: 'bg-pink-50 text-pink-700',
    other: 'bg-gray-100 text-gray-600',
  };
  return colors[category] ?? 'bg-gray-100 text-gray-600';
}

export default function DocumentDetailsDrawer({ document, isOpen, onClose }: DocumentDetailsDrawerProps) {
  if (!isOpen || !document) return null;

  const FileIcon = getFileIcon(document.fileType);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Document Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* File preview */}
          <div className="mb-6 flex items-center justify-center rounded-xl bg-gray-50 p-8">
            <div className="flex flex-col items-center">
              <FileIcon className="h-16 w-16 text-gray-300" />
              <p className="mt-2 text-sm font-medium text-gray-700">{document.fileName}</p>
              <p className="text-xs text-gray-400">{document.fileType.toUpperCase()} · {formatFileSize(document.fileSize)}</p>
            </div>
          </div>

          {/* Document name + status */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{document.name}</h3>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryColor(document.category)}`}>
                {document.category.charAt(0).toUpperCase() + document.category.slice(1)}
              </span>
              <DocumentStatusBadge status={document.status} />
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-4">
            <DetailRow icon={FileText} label="File Name" value={document.fileName} />
            <DetailRow icon={HardDrive} label="File Size" value={formatFileSize(document.fileSize)} />
            <DetailRow icon={Tag} label="File Type" value={document.fileType.toUpperCase()} />
            <DetailRow icon={Calendar} label="Uploaded" value={formatDate(document.uploadedAt)} />
            <DetailRow icon={Clock} label="Last Updated" value={formatDate(document.updatedAt)} />

            {document.expiryDate && (
              <DetailRow icon={Calendar} label="Expiry Date" value={formatDate(document.expiryDate)} />
            )}

            {document.description && (
              <DetailRow icon={MessageSquare} label="Description" value={document.description} />
            )}

            {document.reviewComment && (
              <div className="rounded-xl bg-orange-50 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-4 w-4 text-orange-500" />
                  <p className="text-xs font-medium text-orange-700">Review Comment</p>
                </div>
                <p className="text-sm text-orange-600">{document.reviewComment}</p>
              </div>
            )}

            {document.status === 'verified' && (
              <div className="rounded-xl bg-emerald-50 p-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                    <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-emerald-700">Verified</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
