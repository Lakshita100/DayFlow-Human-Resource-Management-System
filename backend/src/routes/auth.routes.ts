import { Router } from 'express';
import { signup, login, getMe, changePassword, logout } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { signupSchema, loginSchema, changePasswordSchema } from '../validators/auth.validator.js';
import { uploadLogo, handleUploadError } from '../config/upload.js';

const router = Router();

router.post(
  '/signup',
  uploadLogo,
  handleUploadError,
  validate({ body: signupSchema }),
  signup
);
router.post('/login', validate({ body: loginSchema }), login);
router.get('/me', requireAuth, getMe);
router.post('/change-password', requireAuth, validate({ body: changePasswordSchema }), changePassword);
router.post('/logout', requireAuth, logout);

export default router;
