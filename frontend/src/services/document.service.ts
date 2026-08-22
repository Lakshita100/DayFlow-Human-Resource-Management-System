import apiClient from '@/api/client';
import type { ApiResponse } from '@/types/common.types';
import type { DocumentRecord } from '@/types/document.types';

export async function getDocuments(): Promise<DocumentRecord[]> {
  const res = await apiClient.get<ApiResponse<DocumentRecord[]>>('/documents');
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch documents');
  return res.data.data;
}

export async function getDocumentById(id: string): Promise<DocumentRecord> {
  const res = await apiClient.get<ApiResponse<DocumentRecord>>(`/documents/${id}`);
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch document');
  return res.data.data;
}

export async function uploadDocument(formData: FormData): Promise<DocumentRecord> {
  const res = await apiClient.post<ApiResponse<DocumentRecord>>('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (!res.data.data) throw new Error(res.data.message || 'Failed to upload document');
  return res.data.data;
}

export async function deleteDocument(id: string): Promise<void> {
  await apiClient.delete(`/documents/${id}`);
}

export async function downloadDocument(id: string): Promise<Blob> {
  const res = await apiClient.get(`/documents/${id}/download`, { responseType: 'blob' });
  return res.data;
}
