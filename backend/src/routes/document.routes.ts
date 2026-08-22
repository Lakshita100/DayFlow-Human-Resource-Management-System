import { Router } from 'express';
import {
  listDocuments,
  getDocument,
  uploadDocument,
  deleteDocument,
} from '../controllers/document.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/authorization.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { documentQuerySchema } from '../validators/document.validator.js';
import { uploadDocument as uploadDocumentMiddleware, handleUploadError } from '../config/upload.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth);

router.get(
  '/employees/:id/documents',
  requireRole(Role.ADMIN, Role.HR, Role.EMPLOYEE),
  validate({ query: documentQuerySchema }),
  listDocuments
);

router.get(
  '/employees/:id/documents/:documentId',
  requireRole(Role.ADMIN, Role.HR, Role.EMPLOYEE),
  getDocument
);

router.post(
  '/employees/:id/documents',
  requireRole(Role.ADMIN, Role.HR),
  uploadDocumentMiddleware,
  handleUploadError,
  uploadDocument
);

router.delete(
  '/employees/:id/documents/:documentId',
  requireRole(Role.ADMIN, Role.HR),
  deleteDocument
);

export default router;