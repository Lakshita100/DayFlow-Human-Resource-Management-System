import { Router } from 'express';
import {
  getMyProfile,
  getEmployeeProfile,
  updateMyProfile,
  updateEmployeeProfile,
  updatePublicProfile,
  updateMyPublicProfile,
  uploadProfilePicture,
  removeProfilePicture,
} from '../controllers/profile.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole, requireOwnershipOrRole } from '../middleware/authorization.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { profilePublicSchema, profilePrivateSchema } from '../validators/profile.validator.js';
import { uploadLogo, handleUploadError } from '../config/upload.js';
import { ownershipHelpers } from '../utils/ownership.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth);

// /me routes must be declared before /:id
router.get('/me/profile', getMyProfile);
router.patch('/me/profile', validate({ body: profilePrivateSchema }), updateMyProfile);
router.patch('/me', validate({ body: profilePublicSchema }), updateMyPublicProfile);

router.get(
  '/:id/profile',
  requireRole(Role.ADMIN, Role.HR, Role.EMPLOYEE),
  getEmployeeProfile
);

router.patch(
  '/:id/profile',
  requireRole(Role.ADMIN, Role.HR),
  validate({ body: profilePublicSchema.merge(profilePrivateSchema) }),
  updateEmployeeProfile
);

router.patch('/:id', requireRole(Role.ADMIN, Role.HR), validate({ body: profilePublicSchema }), updatePublicProfile);

// Profile picture: owner or ADMIN/HR
router.post(
  '/:id/profile-picture',
  requireOwnershipOrRole(ownershipHelpers.getEmployeeOwnerId, Role.ADMIN, Role.HR),
  uploadLogo,
  handleUploadError,
  uploadProfilePicture
);

router.delete(
  '/:id/profile-picture',
  requireOwnershipOrRole(ownershipHelpers.getEmployeeOwnerId, Role.ADMIN, Role.HR),
  removeProfilePicture
);

export default router;