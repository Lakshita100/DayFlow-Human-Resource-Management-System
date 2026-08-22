import { Router } from 'express';
import {
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceRecords,
  getMonthlyOverview,
} from '../controllers/attendance.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/authorization.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth);

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/today', getTodayAttendance);
router.get('/monthly-overview', getMonthlyOverview);
router.get('/', requireRole(Role.ADMIN, Role.HR, Role.EMPLOYEE), getAttendanceRecords);

export default router;
