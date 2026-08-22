import { FileText, Image, File, MoreVertical, Eye, Download, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import DocumentStatusBadge from './DocumentStatusBadge';
import type { DocumentRecord } from '@/types/document.types';

interface DocumentCardProps {
  document: DocumentRecord;
  onView: (doc: DocumentRecord) => void;
  onDownload: (doc: DocumentRecord) => void;
  onDelete?: (doc: DocumentRecord) => void;
  onDetails: (doc: DocumentRecord) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getExpiryInfo(expiryDate: string | null): { label: string; color: string; urgent: boolean } | null {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: 'Expired', color: 'text-red-600', urgent: true };
  if (diffDays <= 30) return { label: `Expires in ${diffDays}d`, color: 'text-red-600', urgent: true };
  if (diffDays <= 90) return { label: `Expires in ${diffDays}d`, color: 'text-amber-600', urgent: false };
  return { label: `Valid until ${formatDate(expiryDate)}`, color: 'text-gray-500', urgent: false };
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

export default function DocumentCard({ document, onView, onDownload, onDelete, onDetails }: DocumentCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const FileIcon = getFileIcon(document.fileType);
  const expiryInfo = getExpiryInfo(document.expiryDate);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <div className="group rounded-xl border border-gray-100 bg-white p-4 shadow-card transition-shadow hover:shadow-md">
      {/* File preview area */}
      <div
        className="mb-3 flex h-24 cursor-pointer items-center justify-center rounded-lg bg-gray-50 transition-colors hover:bg-gray-100"
        onClick={() => onView(document)}
      >
        <FileIcon className="h-10 w-10 text-gray-300" />
      </div>

      {/* Document info */}
      <div className="mb-2">
        <h4
          className="cursor-pointer text-sm font-semibold text-gray-900 truncate hover:text-brand-600"
          onClick={() => onDetails(document)}
        >
          {document.name}
        </h4>
        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${getCategoryColor(document.category)}`}>
          {document.category.charAt(0).toUpperCase() + document.category.slice(1)}
        </span>
      </div>

      {/* Meta info */}
      <div className="mb-3 space-y-1">
        <p className="text-xs text-gray-500">
          {document.fileType.toUpperCase()} · {formatFileSize(document.fileSize)}
        </p>
        <p className="text-xs text-gray-400">
          Uploaded {formatDate(document.uploadedAt)}
        </p>
        {expiryInfo && (
          <p className={`text-xs font-medium ${expiryInfo.color}`}>
            {expiryInfo.label}
          </p>
        )}
      </div>

      {/* Status + Actions */}
      <div className="flex items-center justify-between">
        <DocumentStatusBadge status={document.status} />

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 z-20 mt-1 w-40 rounded-xl border border-gray-100 bg-white py-1 shadow-dropdown">
                <button
                  onClick={() => { onView(document); setShowMenu(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button
                  onClick={() => { onDownload(document); setShowMenu(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={() => { onDetails(document); setShowMenu(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FileText className="h-4 w-4" />
                  Details
                </button>
                {onDelete && (
                  <>
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={() => { onDelete(document); setShowMenu(false); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
