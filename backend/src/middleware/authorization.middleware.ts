import { Response, NextFunction } from 'express';
import { createError } from './error.middleware.js';
import type { AuthRequest, AuthUser } from '../types/index.js';
import { Role } from '@prisma/client';

export function requireRole(...roles: Role[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(createError('Authentication required', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(createError('Insufficient permissions', 403));
      return;
    }

    next();
  };
}

export function requireOwnershipOrRole(
  getResourceOwnerId: (req: AuthRequest) => Promise<string | null>,
  ...roles: Role[]
) {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        next(createError('Authentication required', 401));
        return;
      }

      if (roles.includes(req.user.role)) {
        next();
        return;
      }

      const ownerId = await getResourceOwnerId(req);
      if (ownerId && ownerId === req.user.id) {
        next();
        return;
      }

      next(createError('Insufficient permissions', 403));
    } catch (error) {
      next(error);
    }
  };
}
