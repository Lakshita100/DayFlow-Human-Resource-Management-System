import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller.js';
import authRoutes from './auth.routes.js';
import salaryRoutes from './salary.routes.js';
import employeeRoutes from './employee.routes.js';

const router = Router();

router.get('/health', healthCheck);
router.use('/auth', authRoutes);
router.use('/employees/:employeeId/salary', salaryRoutes);
router.use('/employees', employeeRoutes);

export default router;
