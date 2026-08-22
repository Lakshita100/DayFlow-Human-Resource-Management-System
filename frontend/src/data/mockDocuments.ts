import type {
  DocumentRecord,
  DocumentCategory,
  DocumentStatus,
} from '@/types/document.types';

function buildDoc(
  id: string,
  name: string,
  category: DocumentCategory,
  fileName: string,
  fileType: string,
  fileSize: number,
  uploadedAt: string,
  status: DocumentStatus,
  expiryDate: string | null,
  description: string,
  reviewComment: string | null
): DocumentRecord {
  return {
    id,
    name,
    category,
    fileName,
    fileType,
    fileSize,
    fileUrl: `/documents/${fileName}`,
    uploadedAt,
    updatedAt: uploadedAt,
    status,
    expiryDate,
    description,
    reviewComment,
  };
}

export const mockDocuments: DocumentRecord[] = [
  buildDoc(
    'DOC-001',
    'Aadhaar Card',
    'identity',
    'aadhaar_card.pdf',
    'pdf',
    1843200,
    '2026-06-12',
    'verified',
    null,
    'Government issued Aadhaar identity card',
    null
  ),
  buildDoc(
    'DOC-002',
    'PAN Card',
    'identity',
    'pan_card.pdf',
    'pdf',
    524288,
    '2026-06-12',
    'verified',
    null,
    'Permanent Account Number card',
    null
  ),
  buildDoc(
    'DOC-003',
    'Resume - Rahul Sharma',
    'personal',
    'resume_rahul.pdf',
    'pdf',
    2097152,
    '2026-06-15',
    'verified',
    null,
    'Updated resume with latest experience',
    null
  ),
  buildDoc(
    'DOC-004',
    'Degree Certificate - B.Tech',
    'education',
    'btech_degree.pdf',
    'pdf',
    3145728,
    '2026-06-12',
    'verified',
    null,
    'Bachelor of Technology degree certificate from IIT Delhi',
    null
  ),
  buildDoc(
    'DOC-005',
    'Class 12 Marksheet',
    'education',
    'class12_marksheet.pdf',
    'pdf',
    1572864,
    '2026-06-12',
    'verified',
    null,
    'CBSE Class 12 marksheet',
    null
  ),
  buildDoc(
    'DOC-006',
    'Offer Letter',
    'employment',
    'offer_letter.pdf',
    'pdf',
    1048576,
    '2026-06-15',
    'verified',
    null,
    'Dayflow Technologies offer letter dated 15 June 2026',
    null
  ),
  buildDoc(
    'DOC-007',
    'Experience Letter - Previous',
    'employment',
    'exp_letter_prev.pdf',
    'pdf',
    786432,
    '2026-06-15',
    'pending',
    null,
    'Experience letter from previous employer',
    'Document under review'
  ),
  buildDoc(
    'DOC-008',
    'Passport',
    'identity',
    'passport.pdf',
    'pdf',
    2621440,
    '2026-06-12',
    'verified',
    '2031-03-15',
    'Indian passport - valid until March 2031',
    null
  ),
  buildDoc(
    'DOC-009',
    'Bank Account Details',
    'banking',
    'bank_details.pdf',
    'pdf',
    262144,
    '2026-06-15',
    'verified',
    null,
    'Savings account details for salary credit',
    null
  ),
  buildDoc(
    'DOC-010',
    'Form 16 - FY 2025-26',
    'tax',
    'form16_fy2026.pdf',
    'pdf',
    1310720,
    '2026-07-20',
    'verified',
    null,
    'Tax deduction certificate for FY 2025-26',
    null
  ),
  buildDoc(
    'DOC-011',
    'Driving License',
    'identity',
    'driving_license.pdf',
    'pdf',
    921600,
    '2026-06-12',
    'verified',
    '2026-08-15',
    'Driving license expiring soon',
    null
  ),
  buildDoc(
    'DOC-012',
    'NDA Agreement',
    'employment',
    'nda_agreement.pdf',
    'pdf',
    419430,
    '2026-06-15',
    'verified',
    null,
    'Non-disclosure agreement signed during onboarding',
    null
  ),
];

export const documentCategories: { key: DocumentCategory; label: string; icon: string }[] = [
  { key: 'personal', label: 'Personal', icon: 'User' },
  { key: 'identity', label: 'Identity', icon: 'Fingerprint' },
  { key: 'education', label: 'Education', icon: 'GraduationCap' },
  { key: 'employment', label: 'Employment', icon: 'Briefcase' },
  { key: 'banking', label: 'Banking', icon: 'Landmark' },
  { key: 'tax', label: 'Tax', icon: 'Receipt' },
  { key: 'certificates', label: 'Certificates', icon: 'Award' },
  { key: 'other', label: 'Other', icon: 'Folder' },
];

export function getMockDocuments(): DocumentRecord[] {
  return [...mockDocuments];
}

export function getMockDocumentById(id: string): DocumentRecord | undefined {
  return mockDocuments.find((d) => d.id === id);
}

export function getMockDocumentStats() {
  const total = mockDocuments.length;
  const verified = mockDocuments.filter((d) => d.status === 'verified').length;
  const pending = mockDocuments.filter((d) => d.status === 'pending').length;
  const expiringSoon = mockDocuments.filter((d) => {
    if (!d.expiryDate) return false;
    const expiry = new Date(d.expiryDate);
    const now = new Date();
    const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 90 && diffDays > 0;
  }).length;
  return { total, verified, pending, expiringSoon };
}

export function getMockDocumentCategories() {
  return documentCategories.map((cat) => ({
    ...cat,
    count: mockDocuments.filter((d) => d.category === cat.key).length,
  }));
}
