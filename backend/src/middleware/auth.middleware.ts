import { Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { createError } from './error.middleware.js';
import type { AuthRequest } from '../types/index.js';
import { userRepository } from '../repositories/user.repository.js';

export async function requireAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Authentication required', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw createError('Authentication required', 401);
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch {
      throw createError('Invalid or expired token', 401);
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw createError('User not found', 401);
    }

    if (!user.isActive) {
      throw createError('Account is inactive', 401);
    }

    req.user = {
      id: user.id,
      loginId: user.loginId,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      mustChangePassword: user.mustChangePassword,
    };

    next();
  } catch (error) {
    next(error);
  }
}
