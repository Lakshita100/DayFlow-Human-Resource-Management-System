import { Router } from 'express';
import { salaryController } from '../controllers/salary.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/authorization.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  updateSalarySchema,
  updateComponentsSchema,
  updatePFSchema,
  updateTaxSchema,
} from '../validators/salary.validator.js';
import { Role } from '@prisma/client';

const router = Router({ mergeParams: true });

// All salary routes require authentication
router.use(requireAuth);

// GET /api/employees/:employeeId/salary
router.get('/', salaryController.getSalary);

// PUT /api/employees/:employeeId/salary (Admin / HR only)
router.put(
  '/',
  requireRole(Role.ADMIN, Role.HR),
  validate({ body: updateSalarySchema }),
  salaryController.updateSalary
);

// PUT /api/employees/:employeeId/salary/components (Admin / HR only)
router.put(
  '/components',
  requireRole(Role.ADMIN, Role.HR),
  validate({ body: updateComponentsSchema }),
  salaryController.updateComponents
);

// PUT /api/employees/:employeeId/salary/pf (Admin / HR only)
router.put(
  '/pf',
  requireRole(Role.ADMIN, Role.HR),
  validate({ body: updatePFSchema }),
  salaryController.updatePF
);

// PUT /api/employees/:employeeId/salary/tax (Admin / HR only)
router.put(
  '/tax',
  requireRole(Role.ADMIN, Role.HR),
  validate({ body: updateTaxSchema }),
  salaryController.updateTax
);

export default router;
