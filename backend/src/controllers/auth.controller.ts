import { Response } from 'express';
import { authService } from '../services/auth.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { asyncHandler } from '../utils/async-handler.js';
import type { AuthRequest } from '../types/index.js';

export const signup = asyncHandler(async (req: AuthRequest, res: Response) => {
  const logoFile = req.file ? `/uploads/logos/${req.file.filename}` : undefined;
  const result = await authService.signup({
    ...req.body,
    logoFile,
  });
  sendCreated(res, result);
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { loginId, password } = req.body;
  const result = await authService.login(loginId, password);
  sendSuccess(res, result);
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  sendSuccess(res, user);
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(req.user!.id, currentPassword, newPassword);
  sendSuccess(res, result);
});

export const logout = asyncHandler(async (_req: AuthRequest, res: Response) => {
  sendSuccess(res, null, 'Logged out successfully');
});
