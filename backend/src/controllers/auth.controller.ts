import { Response } from 'express';
import { authService } from '../services/auth.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import type { AuthRequest } from '../types/index.js';

export async function login(req: AuthRequest, res: Response): Promise<void> {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  sendSuccess(res, result);
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  const user = await authService.getMe(req.user!.id);
  sendSuccess(res, user);
}

export async function changePassword(req: AuthRequest, res: Response): Promise<void> {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(req.user!.id, currentPassword, newPassword);
  sendSuccess(res, result);
}

export async function logout(_req: AuthRequest, res: Response): Promise<void> {
  sendSuccess(res, null, 'Logged out successfully');
}
