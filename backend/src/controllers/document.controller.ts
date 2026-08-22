import { Response } from 'express';
import { documentService } from '../services/document.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { asyncHandler } from '../utils/async-handler.js';
import type { AuthRequest } from '../types/index.js';

function getString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') return value[0];
  return undefined;
}

export const listDocuments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  const companyId = req.user!.companyId!;
  const result = await documentService.listDocuments(id, companyId, {
    page: getString(req.query.page) || '1',
    limit: getString(req.query.limit) || '20',
  });
  sendSuccess(res, result);
});

export const getDocument = asyncHandler(async (req: AuthRequest, res: Response) => {
  const documentId = getString(req.params.documentId)!;
  const companyId = req.user!.companyId!;
  const document = await documentService.getDocument(documentId, companyId);
  sendSuccess(res, document);
});

export const uploadDocument = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  const companyId = req.user!.companyId!;

  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded', code: 'NO_FILE' });
    return;
  }

  const result = await documentService.createDocument(id, companyId, req.file, req.body);
  sendCreated(res, result);
});

export const deleteDocument = asyncHandler(async (req: AuthRequest, res: Response) => {
  const documentId = getString(req.params.documentId)!;
  const companyId = req.user!.companyId!;
  await documentService.deleteDocument(documentId, companyId);
  sendSuccess(res, null, 'Document deleted successfully');
});
