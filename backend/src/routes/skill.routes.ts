import { Router } from 'express';
import {
  listSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getEmployeeSkills,
  assignSkill,
  removeSkill,
} from '../controllers/skill.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/authorization.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  skillCreateSchema,
  skillUpdateSchema,
  skillQuerySchema,
  skillAssignSchema,
} from '../validators/skill.validator.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth);

// Global skill catalog
router.get('/skills', requireRole(Role.ADMIN, Role.HR, Role.EMPLOYEE), validate({ query: skillQuerySchema }), listSkills);
router.post('/skills', requireRole(Role.ADMIN, Role.HR), validate({ body: skillCreateSchema }), createSkill);
router.patch('/skills/:id', requireRole(Role.ADMIN), validate({ body: skillUpdateSchema }), updateSkill);
router.delete('/skills/:id', requireRole(Role.ADMIN), deleteSkill);

// Employee-skill associations
router.get(
  '/employees/:id/skills',
  requireRole(Role.ADMIN, Role.HR, Role.EMPLOYEE),
  getEmployeeSkills
);

router.post(
  '/employees/:id/skills',
  requireRole(Role.ADMIN, Role.HR),
  validate({ body: skillAssignSchema }),
  assignSkill
);

router.delete(
  '/employees/:id/skills/:skillId',
  requireRole(Role.ADMIN, Role.HR),
  removeSkill
);

export default router;