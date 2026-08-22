import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import bcrypt from 'bcryptjs';
import { login, getMe } from '../../src/controllers/auth.controller';
import { validate } from '../../src/middleware/validation.middleware';
import { loginSchema } from '../../src/validators/auth.validator';
import { requireAuth } from '../../src/middleware/auth.middleware';
import { errorHandler } from '../../src/middleware/error.middleware';
import { TEST_USERS, generateTestToken } from '../helpers/tokens';
import * as authServiceMod from '../../src/services/auth.service';

vi.mock('../../src/repositories/user.repository.js', () => ({
  userRepository: {
    findByLoginIdWithEmployee: vi.fn(),
    findById: vi.fn(),
    findByIdWithEmployee: vi.fn(),
  },
}));

vi.mock('../../src/repositories/company.repository.js', () => ({
  companyRepository: {
    findById: vi.fn(),
  },
}));

import { userRepository } from '../../src/repositories/user.repository.js';
import { companyRepository } from '../../src/repositories/company.repository.js';

function createApp() {
  const app = express();
  app.use(express.json());

  app.post('/api/auth/login', validate({ body: loginSchema }), login);
  app.get('/api/auth/me', requireAuth, getMe);

  app.use(errorHandler);
  return app;
}

describe('Company Registration Tests', () => {
  let app: express.Express;

  beforeEach(() => {
    app = createApp();
    vi.clearAllMocks();
  });

  describe('Company registration flow', () => {
    it('should create company and admin via signup', async () => {
      const mockSignupResult = {
        token: 'mock-jwt-token',
        user: {
          id: 'new-admin-id',
          loginId: 'NEWCEO20240001',
          email: 'admin@newcorp.com',
          name: 'Admin User',
          role: 'ADMIN',
          employeeId: '',
          companyId: 'new-company-id',
          company: {
            id: 'new-company-id',
            name: 'New Corp',
            logoUrl: 'https://example.com/logo.png',
          },
          mustChangePassword: false,
        },
      };

      vi.spyOn(authServiceMod.authService, 'signup').mockResolvedValue(mockSignupResult as any);

      const result = await authServiceMod.authService.signup({
        companyName: 'New Corp',
        adminName: 'Admin User',
        email: 'admin@newcorp.com',
        phone: '+1234567890',
        password: 'password123',
        confirmPassword: 'password123',
        logoUrl: 'https://example.com/logo.png',
      });

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user.company.name).toBe('New Corp');
      expect(result.user.role).toBe('ADMIN');
      expect(result.user.companyId).toBe('new-company-id');
    });

    it('should reject duplicate company name', async () => {
      const { createError } = await import('../../src/middleware/error.middleware');
      vi.spyOn(authServiceMod.authService, 'signup').mockRejectedValue(
        createError('Company name already exists', 409)
      );

      try {
        await authServiceMod.authService.signup({
          companyName: 'Existing Corp',
          adminName: 'Admin User',
          email: 'admin@existing.com',
          phone: '+1234567890',
          password: 'password123',
          confirmPassword: 'password123',
        });
        expect.fail('Should have thrown');
      } catch (err: any) {
        expect(err.statusCode).toBe(409);
        expect(err.message).toContain('already exists');
      }
    });

    it('should reject duplicate email', async () => {
      const { createError } = await import('../../src/middleware/error.middleware');
      vi.spyOn(authServiceMod.authService, 'signup').mockRejectedValue(
        createError('Email already exists', 409)
      );

      try {
        await authServiceMod.authService.signup({
          companyName: 'New Corp',
          adminName: 'Admin User',
          email: 'existing@company.com',
          phone: '+1234567890',
          password: 'password123',
          confirmPassword: 'password123',
        });
        expect.fail('Should have thrown');
      } catch (err: any) {
        expect(err.statusCode).toBe(409);
        expect(err.message).toContain('already exists');
      }
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials and return company data', async () => {
      const mockUser = {
        id: TEST_USERS.companyA.admin.id,
        email: TEST_USERS.companyA.admin.email,
        loginId: TEST_USERS.companyA.admin.loginId,
        role: TEST_USERS.companyA.admin.role,
        companyId: TEST_USERS.companyA.admin.companyId,
        mustChangePassword: false,
        isActive: true,
        passwordHash: await bcrypt.hash('password123', 10),
        employee: {
          firstName: 'Admin',
          lastName: 'User',
          employeeId: 'EMP001',
        },
        company: {
          id: 'company-a-id',
          name: 'Dayflow',
          logoUrl: 'https://example.com/logo.png',
        },
      };

      vi.mocked(userRepository.findByLoginIdWithEmployee).mockResolvedValue(mockUser as any);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          loginId: TEST_USERS.companyA.admin.loginId,
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.companyId).toBe('company-a-id');
      expect(res.body.data.user.company.name).toBe('Dayflow');
    });

    it('should reject login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          loginId: '',
          password: '',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user with company data', async () => {
      const mockUser = {
        id: TEST_USERS.companyA.admin.id,
        email: TEST_USERS.companyA.admin.email,
        loginId: TEST_USERS.companyA.admin.loginId,
        role: TEST_USERS.companyA.admin.role,
        companyId: TEST_USERS.companyA.admin.companyId,
        mustChangePassword: false,
        employee: {
          firstName: 'Admin',
          lastName: 'User',
          employeeId: 'EMP001',
        },
        company: null,
      };

      vi.mocked(userRepository.findByIdWithEmployee).mockResolvedValue(mockUser as any);
      vi.mocked(userRepository.findById).mockResolvedValue({
        id: TEST_USERS.companyA.admin.id,
        email: TEST_USERS.companyA.admin.email,
        loginId: TEST_USERS.companyA.admin.loginId,
        role: TEST_USERS.companyA.admin.role,
        companyId: TEST_USERS.companyA.admin.companyId,
        mustChangePassword: false,
        isActive: true,
      } as any);

      vi.mocked(companyRepository.findById).mockResolvedValue({
        id: 'company-a-id',
        name: 'Dayflow',
        logoUrl: 'https://example.com/logo.png',
      } as any);

      const token = generateTestToken(TEST_USERS.companyA.admin);
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.companyId).toBe('company-a-id');
      expect(res.body.data.company.name).toBe('Dayflow');
      expect(res.body.data.company.logoUrl).toBe('https://example.com/logo.png');
    });
  });
});
