import { Router } from 'express';
import {
  createRequest,
  getMyRequests,
  getMyRequest,
  listCompanyRequests,
  getRequest,
  approveRequest,
  rejectRequest,
  cancelRequest,
  getMyAllocations,
  listCompanyAllocations,
  adjustAllocation,
} from '../controllers/timeoff.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole, requireOwnershipOrRole } from '../middleware/authorization.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  createTimeOffSchema,
  timeOffListQuerySchema,
  myTimeOffQuerySchema,
  idParamSchema,
  allocationsQuerySchema,
  adjustAllocationSchema,
} from '../validators/timeoff.validator.js';
import { ownershipHelpers } from '../utils/ownership.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth);

// Allocations
router.get('/allocations/me', validate({ query: allocationsQuerySchema }), getMyAllocations);
router.get(
  '/allocations',
  requireRole(Role.ADMIN, Role.HR),
  validate({ query: allocationsQuerySchema }),
  listCompanyAllocations
);
router.patch(
  '/allocations/:id',
  requireRole(Role.ADMIN),
  validate({ params: idParamSchema, body: adjustAllocationSchema }),
  adjustAllocation
);

// Employee self-service
router.post('/', validate({ body: createTimeOffSchema }), createRequest);
router.get('/me', validate({ query: myTimeOffQuerySchema }), getMyRequests);
router.get('/me/:id', validate({ params: idParamSchema }), getMyRequest);

// Admin/HR management
router.get(
  '/',
  requireRole(Role.ADMIN, Role.HR),
  validate({ query: timeOffListQuerySchema }),
  listCompanyRequests
);
router.get('/:id', requireRole(Role.ADMIN, Role.HR), validate({ params: idParamSchema }), getRequest);
router.patch(
  '/:id/approve',
  requireRole(Role.ADMIN, Role.HR),
  validate({ params: idParamSchema }),
  approveRequest
);
router.patch(
  '/:id/reject',
  requireRole(Role.ADMIN, Role.HR),
  validate({ params: idParamSchema }),
  rejectRequest
);

// Cancel: owner or ADMIN/HR (service enforces approved-cancel is manager-only)
router.patch(
  '/:id/cancel',
  requireOwnershipOrRole(ownershipHelpers.getTimeOffOwnerId, Role.ADMIN, Role.HR),
  validate({ params: idParamSchema }),
  cancelRequest
);

export default router;
