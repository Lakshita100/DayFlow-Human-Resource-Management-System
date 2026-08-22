import { Response } from 'express';
import { documentService } from '../services/document.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { asyncHandler } from '../utils/async-handler.js';
import type { AuthRequest } from '../types/index.js';

export const getDocuments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await documentService.getDocuments(req.user!.id);
  sendSuccess(res, result);
});

export const uploadDocument = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await documentService.uploadDocument(req.user!.id, req.body);
  sendCreated(res, result, 'Document uploaded successfully');
});

export const deleteDocument = asyncHandler(async (req: AuthRequest, res: Response) => {
  const rawId = req.params.id;
  const id = typeof rawId === 'string' ? rawId : (Array.isArray(rawId) ? rawId[0] : '');
  if (!id) {
    res.status(400).json({ success: false, message: 'Document ID is required' });
    return;
  }
  await documentService.deleteDocument(id, req.user!.id);
  sendSuccess(res, null, 'Document deleted successfully');
});
