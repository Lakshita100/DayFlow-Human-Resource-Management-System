import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository.js';
import { createError } from '../middleware/error.middleware.js';
import { env } from '../config/env.js';
import type { AuthUser } from '../types/index.js';

const JWT_ROUNDS = 10;

function generateToken(user: AuthUser): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: 86400 }
  );
}

function sanitizeUser(user: { id: string; email: string; role: string; mustChangePassword: boolean }) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
  };
}

export const authService = {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw createError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw createError('Account is inactive', 401);
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw createError('Invalid email or password', 401);
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    };

    const token = generateToken(authUser);

    return {
      token,
      user: sanitizeUser(authUser),
    };
  },

  async getMe(userId: string) {
    const user = await userRepository.findByIdWithEmployee(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    return {
      ...sanitizeUser(user),
      employee: user.employee
        ? {
            id: user.employee.id,
            firstName: user.employee.firstName,
            lastName: user.employee.lastName,
            employeeId: user.employee.employeeId,
          }
        : null,
    };
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    const passwordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!passwordValid) {
      throw createError('Current password is incorrect', 400);
    }

    const newHash = await bcrypt.hash(newPassword, JWT_ROUNDS);
    await userRepository.updatePassword(userId, newHash);

    if (user.mustChangePassword) {
      await userRepository.clearMustChangePassword(userId);
    }

    return { message: 'Password changed successfully' };
  },

  verifyToken(token: string): AuthUser {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    return {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role as AuthUser['role'],
      mustChangePassword: false,
    };
  },
};
