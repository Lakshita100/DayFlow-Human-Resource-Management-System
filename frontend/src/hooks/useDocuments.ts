import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as documentApi from '@/services/document.service';
import {
  getMockDocuments,
  getMockDocumentById,
  getMockDocumentStats,
  getMockDocumentCategories,
} from '@/data/mockDocuments';
import type { DocumentRecord } from '@/types/document.types';

const USE_MOCK = true;

export function useDocuments() {
  return useQuery<DocumentRecord[]>({
    queryKey: ['documents'],
    queryFn: () => documentApi.getDocuments(),
    enabled: !USE_MOCK,
  });
}

export function useDocumentsMock(): DocumentRecord[] {
  return getMockDocuments();
}

export function useDocumentById(id: string) {
  return useQuery<DocumentRecord>({
    queryKey: ['documents', id],
    queryFn: () => documentApi.getDocumentById(id),
    enabled: !USE_MOCK && !!id,
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
    enabled: !USE_MOCK,
  });
}

export function useDocumentStatsMock() {
  return getMockDocumentStats();
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
    enabled: !USE_MOCK,
  });
}

export function useDocumentCategoriesMock() {
  return getMockDocumentCategories();
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => documentApi.uploadDocument(formData),
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
