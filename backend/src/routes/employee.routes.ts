import { Router } from 'express';
import {
  listEmployees,
  getEmployeeById,
  getCurrentEmployee,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
  getCompanyStats,
} from '../controllers/employee.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/authorization.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeStatusSchema,
  employeeQuerySchema,
  employeeIdParamSchema,
} from '../validators/employee.validator.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth);

router.get(
  '/me',
  getCurrentEmployee
);

router.get(
  '/stats',
  requireRole(Role.ADMIN, Role.HR),
  getCompanyStats
);

router.get(
  '/',
  requireRole(Role.ADMIN, Role.HR, Role.EMPLOYEE),
  validate({ query: employeeQuerySchema }),
  listEmployees
);

router.get(
  '/:id',
  requireRole(Role.ADMIN, Role.HR, Role.EMPLOYEE),
  validate({ params: employeeIdParamSchema }),
  getEmployeeById
);

router.post(
  '/',
  requireRole(Role.ADMIN, Role.HR),
  validate({ body: createEmployeeSchema }),
  createEmployee
);

router.patch(
  '/:id',
  requireRole(Role.ADMIN, Role.HR),
  validate({ params: employeeIdParamSchema, body: updateEmployeeSchema }),
  updateEmployee
);

router.patch(
  '/:id/status',
  requireRole(Role.ADMIN),
  validate({ params: employeeIdParamSchema, body: employeeStatusSchema }),
  updateEmployeeStatus
);

export default router;
