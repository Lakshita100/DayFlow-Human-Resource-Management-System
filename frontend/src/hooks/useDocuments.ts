import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as documentApi from '@/services/document.service';
import {
  getMockDocuments,
  getMockDocumentById,
  getMockDocumentStats,
  getMockDocumentCategories,
} from '@/data/mockDocuments';
import type { DocumentRecord } from '@/types/document.types';

export function useDocuments() {
  return useQuery<DocumentRecord[]>({
    queryKey: ['documents'],
    queryFn: () => documentApi.getDocuments(),
  });
}

export function useDocumentsMock(): DocumentRecord[] {
  const query = useDocuments();
  return query.data ?? getMockDocuments();
}

export function useDocumentById(id: string) {
  return useQuery<DocumentRecord>({
    queryKey: ['documents', id],
    queryFn: () => documentApi.getDocumentById(id),
    enabled: !!id,
  });
}

export function useDocumentByIdMock(id: string): DocumentRecord | undefined {
  return getMockDocumentById(id);
}

export function useDocumentStats() {
  return useQuery({
    queryKey: ['documents', 'stats'],
    queryFn: async () => {
      const docs = await documentApi.getDocuments();
      const total = docs.length;
      const verified = docs.filter((d) => d.status === 'verified').length;
      const pending = docs.filter((d) => d.status === 'pending').length;
      const expiringSoon = docs.filter((d) => {
        if (!d.expiryDate) return false;
        const diff = (new Date(d.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        return diff <= 90 && diff > 0;
      }).length;
      return { total, verified, pending, expiringSoon };
    },
  });
}

export function useDocumentStatsMock() {
  const query = useDocumentStats();
  return query.data ?? getMockDocumentStats();
}

export function useDocumentCategories() {
  return useQuery({
    queryKey: ['documents', 'categories'],
    queryFn: async () => {
      const docs = await documentApi.getDocuments();
      const cats = ['personal', 'identity', 'education', 'employment', 'banking', 'tax', 'certificates', 'other'] as const;
      return cats.map((key) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        icon: key,
        count: docs.filter((d) => d.category === key).length,
      }));
    },
  });
}

export function useDocumentCategoriesMock() {
  const query = useDocumentCategories();
  return query.data ?? getMockDocumentCategories();
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => documentApi.uploadDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentApi.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDownloadDocument() {
  return useMutation({
    mutationFn: (id: string) => documentApi.downloadDocument(id),
  });
}
