import { Router } from 'express';
import {
  checkIn,
  checkOut,
  getMyAttendance,
  getMyMonthlySummary,
  listCompanyAttendance,
  getAttendanceSummary,
  correctAttendance,
} from '../controllers/attendance.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/authorization.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  attendanceListQuerySchema,
  myAttendanceQuerySchema,
  monthlyQuerySchema,
  summaryQuerySchema,
  attendanceCorrectionSchema,
} from '../validators/attendance.validator.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth);

// Employee self-service
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/me', validate({ query: myAttendanceQuerySchema }), getMyAttendance);
router.get('/me/monthly', validate({ query: monthlyQuerySchema }), getMyMonthlySummary);

// Admin/HR management
router.get(
  '/',
  requireRole(Role.ADMIN, Role.HR),
  validate({ query: attendanceListQuerySchema }),
  listCompanyAttendance
);
router.get(
  '/summary',
  requireRole(Role.ADMIN, Role.HR),
  validate({ query: summaryQuerySchema }),
  getAttendanceSummary
);
router.patch(
  '/:id',
  requireRole(Role.ADMIN, Role.HR),
  validate({ body: attendanceCorrectionSchema }),
  correctAttendance
);

export default router;
