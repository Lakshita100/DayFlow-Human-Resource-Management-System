import { Router } from 'express';
import { login, getMe, changePassword, logout } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { loginSchema, changePasswordSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/login', validate({ body: loginSchema }), login);
router.get('/me', requireAuth, getMe);
router.post('/change-password', requireAuth, validate({ body: changePasswordSchema }), changePassword);
router.post('/logout', requireAuth, logout);

export default router;
