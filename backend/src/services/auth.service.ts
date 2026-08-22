import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository.js';
import { companyRepository } from '../repositories/company.repository.js';
import { createError } from '../middleware/error.middleware.js';
import { env } from '../config/env.js';
import { prisma } from '../config/database.js';
import type { AuthUser } from '../types/index.js';
import type { SignupInput } from '../validators/auth.validator.js';

const JWT_ROUNDS = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// In-memory rate limiting (production should use Redis)
const loginAttempts = new Map<string, { count: number; lockedUntil: number | null }>();

function getLoginAttempts(key: string): { count: number; lockedUntil: number | null } {
  const attempts = loginAttempts.get(key);
  if (!attempts) return { count: 0, lockedUntil: null };

  if (attempts.lockedUntil && Date.now() > attempts.lockedUntil) {
    loginAttempts.delete(key);
    return { count: 0, lockedUntil: null };
  }

  return attempts;
}

function recordLoginAttempt(key: string, success: boolean): void {
  if (success) {
    loginAttempts.delete(key);
    return;
  }

  const current = getLoginAttempts(key);
  const newCount = current.count + 1;

  if (newCount >= MAX_LOGIN_ATTEMPTS) {
    loginAttempts.set(key, {
      count: newCount,
      lockedUntil: Date.now() + LOCKOUT_DURATION_MS,
    });
  } else {
    loginAttempts.set(key, {
      count: newCount,
      lockedUntil: null,
    });
  }
}

function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      userId: user.id,
      loginId: user.loginId,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    },
    env.JWT_SECRET,
    { expiresIn: 86400 }
  );
}

function sanitizeUser(user: {
  id: string;
  loginId: string;
  email: string;
  role: string;
  companyId: string | null;
  mustChangePassword: boolean;
  employee?: {
    firstName: string;
    lastName: string;
    employeeId: string;
  } | null;
  company?: {
    id: string;
    name: string;
    logoUrl: string | null;
  } | null;
}) {
  return {
    id: user.id,
    loginId: user.loginId,
    email: user.email,
    name: user.employee ? `${user.employee.firstName} ${user.employee.lastName}` : user.email,
    role: user.role,
    employeeId: user.employee?.employeeId || '',
    companyId: user.companyId,
    company: user.company
      ? {
          id: user.company.id,
          name: user.company.name,
          logoUrl: user.company.logoUrl,
        }
      : null,
    mustChangePassword: user.mustChangePassword,
  };
}

function generateCompanyPrefix(companyName: string): string {
  const cleaned = companyName.replace(/[^a-zA-Z]/g, '').toUpperCase();
  return cleaned.substring(0, 2);
}

function sanitizeCompanyName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

function sanitizeAdminName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

export const authService = {
  async signup(input: SignupInput & { logoFile?: string }) {
    const companyName = sanitizeCompanyName(input.companyName);
    const adminName = sanitizeAdminName(input.adminName);
    const email = input.email.toLowerCase().trim();

    const existingCompany = await companyRepository.findByName(companyName);
    if (existingCompany) {
      throw createError(
        'A company with this name already exists',
        409,
        'COMPANY_NAME_EXISTS'
      );
    }

    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      throw createError(
        'An account with this email already exists',
        409,
        'EMAIL_EXISTS'
      );
    }

    const prefix = generateCompanyPrefix(companyName);
    if (prefix.length < 2) {
      throw createError(
        'Company name must contain at least 2 letters for prefix generation',
        400,
        'INVALID_COMPANY_NAME'
      );
    }

    const logoUrl = input.logoFile || null;

    try {
      const result = await prisma.$transaction(async (tx) => {
        const company = await tx.company.create({
          data: {
            name: companyName,
            prefix,
            logoUrl,
          },
        });

        const passwordHash = await bcrypt.hash(input.password, JWT_ROUNDS);

        const adminUser = await tx.user.create({
          data: {
            email,
            passwordHash,
            role: 'ADMIN',
            companyId: company.id,
            mustChangePassword: false,
            isActive: true,
          },
        });

        return { company, adminUser };
      });

      const authUser: AuthUser = {
        id: result.adminUser.id,
        loginId: result.adminUser.loginId,
        email: result.adminUser.email,
        role: result.adminUser.role,
        companyId: result.company.id,
        mustChangePassword: false,
      };

      const token = generateToken(authUser);

      console.info(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        event: 'COMPANY_REGISTERED',
        companyId: result.company.id,
        companyName: result.company.name,
        adminEmail: email,
      }));

      return {
        token,
        user: {
          id: result.adminUser.id,
          loginId: result.adminUser.loginId,
          email: result.adminUser.email,
          name: adminName,
          role: result.adminUser.role,
          employeeId: '',
          companyId: result.company.id,
          company: {
            id: result.company.id,
            name: result.company.name,
            logoUrl: result.company.logoUrl,
          },
          mustChangePassword: false,
        },
      };
    } catch (error: any) {
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        if (target?.includes('name')) {
          throw createError('A company with this name already exists', 409, 'COMPANY_NAME_EXISTS');
        }
        if (target?.includes('email')) {
          throw createError('An account with this email already exists', 409, 'EMAIL_EXISTS');
        }
        throw createError('A record with this information already exists', 409, 'DUPLICATE_RECORD');
      }
      if (error.statusCode) throw error;
      throw createError('Failed to create company. Please try again.', 500, 'REGISTRATION_FAILED');
    }
  },

  async login(loginId: string, password: string) {
    const normalizedLoginId = loginId.trim().toUpperCase();

    const lockKey = `login:${normalizedLoginId}`;
    const attempts = getLoginAttempts(lockKey);

    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
      const remainingMinutes = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
      throw createError(
        `Account is temporarily locked. Try again in ${remainingMinutes} minute(s)`,
        429,
        'ACCOUNT_LOCKED',
        { lockedUntil: new Date(attempts.lockedUntil).toISOString(), remainingMinutes }
      );
    }

    const user = await userRepository.findByLoginIdWithEmployee(normalizedLoginId);
    if (!user) {
      recordLoginAttempt(lockKey, false);
      console.warn(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'WARN',
        event: 'LOGIN_FAILED',
        reason: 'USER_NOT_FOUND',
        loginId: normalizedLoginId,
      }));
      throw createError('Invalid login ID or password', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      console.warn(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'WARN',
        event: 'LOGIN_FAILED',
        reason: 'ACCOUNT_INACTIVE',
        userId: user.id,
        loginId: normalizedLoginId,
      }));
      throw createError(
        'Account is inactive. Contact your administrator',
        401,
        'ACCOUNT_INACTIVE'
      );
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      recordLoginAttempt(lockKey, false);
      const updatedAttempts = getLoginAttempts(lockKey);
      const remainingAttempts = MAX_LOGIN_ATTEMPTS - updatedAttempts.count;

      console.warn(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'WARN',
        event: 'LOGIN_FAILED',
        reason: 'INVALID_PASSWORD',
        userId: user.id,
        loginId: normalizedLoginId,
        attemptsRemaining: remainingAttempts,
      }));

      if (remainingAttempts <= 0) {
        throw createError(
          'Account locked due to too many failed attempts. Try again in 15 minutes',
          429,
          'ACCOUNT_LOCKED'
        );
      }

      throw createError(
        `Invalid login ID or password. ${remainingAttempts} attempt(s) remaining`,
        401,
        'INVALID_CREDENTIALS',
        { attemptsRemaining: remainingAttempts }
      );
    }

    recordLoginAttempt(lockKey, true);

    const authUser: AuthUser = {
      id: user.id,
      loginId: user.loginId,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      mustChangePassword: user.mustChangePassword,
    };

    const token = generateToken(authUser);

    console.info(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      event: 'LOGIN_SUCCESS',
      userId: user.id,
      loginId: normalizedLoginId,
      role: user.role,
      companyId: user.companyId,
    }));

    return {
      token,
      user: sanitizeUser({
        ...authUser,
        employee: user.employee,
        company: user.company,
      }),
    };
  },

  async getMe(userId: string) {
    const user = await userRepository.findByIdWithEmployee(userId);
    if (!user) {
      throw createError('User not found', 404, 'USER_NOT_FOUND');
    }

    const company = user.companyId
      ? await companyRepository.findById(user.companyId)
      : null;

    return sanitizeUser({
      ...user,
      company,
    });
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw createError('User not found', 404, 'USER_NOT_FOUND');
    }

    const passwordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!passwordValid) {
      console.warn(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'WARN',
        event: 'PASSWORD_CHANGE_FAILED',
        reason: 'INCORRECT_CURRENT_PASSWORD',
        userId,
      }));
      throw createError('Current password is incorrect', 400, 'INCORRECT_PASSWORD');
    }

    const newHash = await bcrypt.hash(newPassword, JWT_ROUNDS);
    await userRepository.updatePassword(userId, newHash);

    if (user.mustChangePassword) {
      await userRepository.clearMustChangePassword(userId);
    }

    console.info(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      event: 'PASSWORD_CHANGED',
      userId,
      forced: user.mustChangePassword,
    }));

    return { message: 'Password changed successfully' };
  },

  verifyToken(token: string): AuthUser {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      loginId: string;
      email: string;
      role: string;
      companyId: string | null;
    };

    return {
      id: decoded.userId,
      loginId: decoded.loginId,
      email: decoded.email,
      role: decoded.role as AuthUser['role'],
      companyId: decoded.companyId,
      mustChangePassword: false,
    };
  },
};
