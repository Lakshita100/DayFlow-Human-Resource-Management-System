import { Router } from 'express';
import {
  getLeaveBalance,
  createLeaveRequest,
  getLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
} from '../controllers/leave.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/authorization.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createLeaveSchema, leaveQuerySchema } from '../validators/leave.validator.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth);

router.get('/balance', getLeaveBalance);
router.post('/requests', validate({ body: createLeaveSchema }), createLeaveRequest);
router.get('/requests', validate({ query: leaveQuerySchema }), getLeaveRequests);

router.put('/requests/:id/approve', requireRole(Role.ADMIN, Role.HR), approveLeaveRequest);
router.put('/requests/:id/reject', requireRole(Role.ADMIN, Role.HR), rejectLeaveRequest);

export default router;
