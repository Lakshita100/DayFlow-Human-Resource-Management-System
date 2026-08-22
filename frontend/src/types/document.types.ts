export type DocumentStatus = 'verified' | 'pending' | 'rejected' | 'expired';

export type DocumentCategory =
  | 'personal'
  | 'identity'
  | 'education'
  | 'employment'
  | 'banking'
  | 'tax'
  | 'certificates'
  | 'other';

export interface DocumentRecord {
  id: string;
  name: string;
  category: DocumentCategory;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
  updatedAt: string;
  status: DocumentStatus;
  expiryDate: string | null;
  description: string;
  reviewComment: string | null;
}

export interface DocumentStats {
  total: number;
  verified: number;
  pending: number;
  expiringSoon: number;
}

export interface DocumentCategoryInfo {
  key: DocumentCategory;
  label: string;
  count: number;
}

export type DocumentSortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'expiry-soonest';

export type DocumentViewMode = 'grid' | 'list';

export interface DocumentFilters {
  category: DocumentCategory | 'all';
  status: DocumentStatus | 'all';
  fileType: string | 'all';
  expiry: 'all' | 'valid' | 'expiring-soon' | 'expired';
}

export interface DocumentUploadPayload {
  name: string;
  category: DocumentCategory;
  file: File;
  expiryDate?: string;
  description?: string;
}
