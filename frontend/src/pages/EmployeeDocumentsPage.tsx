import { useState, useCallback, useMemo } from 'react';
import { Plus, FileText } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import DocumentStatsCards from '@/components/documents/DocumentStats';
import DocumentCategories from '@/components/documents/DocumentCategories';
import DocumentToolbar from '@/components/documents/DocumentToolbar';
import DocumentCard from '@/components/documents/DocumentCard';
import DocumentList from '@/components/documents/DocumentList';
import DocumentPreview from '@/components/documents/DocumentPreview';
import DocumentDetailsDrawer from '@/components/documents/DocumentDetailsDrawer';
import UploadDocumentDialog from '@/components/documents/UploadDocumentDialog';
import DeleteDocumentDialog from '@/components/documents/DeleteDocumentDialog';
import EmptyState from '@/components/ui/EmptyState';

import {
  useDocumentsMock,
  useDocumentStatsMock,
  useDocumentCategoriesMock,
} from '@/hooks/useDocuments';
import type {
  DocumentRecord,
  DocumentFilters,
  DocumentSortOption,
  DocumentViewMode,
  DocumentCategory,
  DocumentUploadPayload,
} from '@/types/document.types';

function getExpiryStatus(date: string | null): 'valid' | 'expiring-soon' | 'expired' | 'none' {
  if (!date) return 'none';
  const diff = (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return 'expired';
  if (diff <= 90) return 'expiring-soon';
  return 'valid';
}

function sortDocuments(docs: DocumentRecord[], sort: DocumentSortOption): DocumentRecord[] {
  const sorted = [...docs];
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime());
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'expiry-soonest':
      return sorted.sort((a, b) => {
        if (!a.expiryDate && !b.expiryDate) return 0;
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      });
    default:
      return sorted;
  }
}

export default function EmployeeDocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<DocumentFilters>({
    category: 'all',
    status: 'all',
    fileType: 'all',
    expiry: 'all',
  });
  const [sortBy, setSortBy] = useState<DocumentSortOption>('newest');
  const [viewMode, setViewMode] = useState<DocumentViewMode>('grid');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [detailsDoc, setDetailsDoc] = useState<DocumentRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteDoc, setDeleteDoc] = useState<DocumentRecord | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Data
  const allDocuments = useDocumentsMock();
  const stats = useDocumentStatsMock();
  const categories = useDocumentCategoriesMock();

  // Filtered + sorted documents
  const filteredDocuments = useMemo(() => {
    let docs = allDocuments;

    // Category filter
    if (selectedCategory !== 'all') {
      docs = docs.filter((d) => d.category === selectedCategory);
    }

    // Status filter
    if (filters.status !== 'all') {
      docs = docs.filter((d) => d.status === filters.status);
    }

    // Expiry filter
    if (filters.expiry !== 'all') {
      docs = docs.filter((d) => getExpiryStatus(d.expiryDate) === filters.expiry);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.fileName.toLowerCase().includes(q)
      );
    }

    return sortDocuments(docs, sortBy);
  }, [allDocuments, selectedCategory, filters, searchQuery, sortBy]);

  // Handlers
  const handleCategorySelect = useCallback((cat: DocumentCategory | 'all') => {
    setSelectedCategory(cat);
  }, []);

  const handleViewDocument = useCallback((doc: DocumentRecord) => {
    setPreviewDoc(doc);
    setIsPreviewOpen(true);
  }, []);

  const handleDetailsDocument = useCallback((doc: DocumentRecord) => {
    setDetailsDoc(doc);
    setIsDetailsOpen(true);
  }, []);

  const handleDownloadDocument = useCallback((doc: DocumentRecord) => {
    // Mock download
    const link = window.document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.fileName;
    link.click();
  }, []);

  const handleDeleteDocument = useCallback((doc: DocumentRecord) => {
    setDeleteDoc(doc);
    setIsDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async (_id: string) => {
    setIsDeleting(true);
    // Mock delete
    await new Promise((r) => setTimeout(r, 800));
    setIsDeleting(false);
    setIsDeleteOpen(false);
    setDeleteDoc(null);
  }, []);

  const handleUpload = useCallback(async (_payload: DocumentUploadPayload) => {
    // Mock upload
    await new Promise((r) => setTimeout(r, 1200));
  }, []);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            <p className="text-sm text-gray-500">
              Manage your personal and employment-related documents.
            </p>
          </div>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            Upload Document
          </button>
        </div>

        {/* Stats */}
        <DocumentStatsCards stats={stats} />

        {/* Categories */}
        <DocumentCategories
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={handleCategorySelect}
        />

        {/* Toolbar */}
        <DocumentToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Document count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Documents */}
        {filteredDocuments.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-12 w-12" />}
            title={searchQuery || filters.status !== 'all' || filters.expiry !== 'all' || selectedCategory !== 'all'
              ? 'No documents found'
              : 'No documents yet'}
            description={
              searchQuery || filters.status !== 'all' || filters.expiry !== 'all' || selectedCategory !== 'all'
                ? 'Try changing your search or filters.'
                : 'Upload your important documents to keep everything organized in one place.'
            }
            action={
              searchQuery || filters.status !== 'all' || filters.expiry !== 'all' || selectedCategory !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({ category: 'all', status: 'all', fileType: 'all', expiry: 'all' });
                    setSelectedCategory('all');
                  }}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                >
                  <Plus className="h-4 w-4" />
                  Upload Document
                </button>
              )
            }
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onView={handleViewDocument}
                onDownload={handleDownloadDocument}
                onDelete={handleDeleteDocument}
                onDetails={handleDetailsDocument}
              />
            ))}
          </div>
        ) : (
          <DocumentList
            documents={filteredDocuments}
            onView={handleViewDocument}
            onDownload={handleDownloadDocument}
            onDelete={handleDeleteDocument}
            onDetails={handleDetailsDocument}
          />
        )}
      </div>

      {/* Upload Dialog */}
      <UploadDocumentDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />

      {/* Preview Modal */}
      <DocumentPreview
        document={previewDoc}
        isOpen={isPreviewOpen}
        onClose={() => { setIsPreviewOpen(false); setPreviewDoc(null); }}
        onDownload={handleDownloadDocument}
      />

      {/* Details Drawer */}
      <DocumentDetailsDrawer
        document={detailsDoc}
        isOpen={isDetailsOpen}
        onClose={() => { setIsDetailsOpen(false); setDetailsDoc(null); }}
      />

      {/* Delete Confirmation */}
      <DeleteDocumentDialog
        document={deleteDoc}
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setDeleteDoc(null); }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </PageContainer>
  );
}
