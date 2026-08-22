import { Router } from 'express';
import { getDocuments, uploadDocument, deleteDocument } from '../controllers/document.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getDocuments);
router.post('/', uploadDocument);
router.delete('/:id', deleteDocument);

export default router;
