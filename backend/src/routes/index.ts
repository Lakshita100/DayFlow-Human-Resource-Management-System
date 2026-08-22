import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller.js';
import authRoutes from './auth.routes.js';
import employeeRoutes from './employee.routes.js';
import profileRoutes from './profile.routes.js';
import skillRoutes from './skill.routes.js';
import documentRoutes from './document.routes.js';
import attendanceRoutes from './attendance.routes.js';
import timeOffRoutes from './timeoff.routes.js';
import salaryRoutes from './salary.routes.js';
import leaveRoutes from './leave.routes.js';
import notificationRoutes from './notification.routes.js';
import calendarRoutes from './calendar.routes.js';

const router = Router();

router.get('/health', healthCheck);
router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/', skillRoutes);
router.use('/', documentRoutes);
router.use('/', profileRoutes);
router.use('/employees/:employeeId/salary', salaryRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/time-off', timeOffRoutes);
router.use('/leave', leaveRoutes);
router.use('/documents', documentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/calendar', calendarRoutes);

export default router;
