import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { requireAuth } from '../../src/middleware/auth.middleware';
import { requireRole, requireOwnershipOrRole } from '../../src/middleware/authorization.middleware';
import { TEST_USERS, generateTestToken } from '../helpers/tokens';
import { errorHandler } from '../../src/middleware/error.middleware';

vi.mock('../../src/repositories/user.repository', () => ({
  userRepository: {
    findById: vi.fn(),
  },
}));

import { userRepository } from '../../src/repositories/user.repository';

function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/admin-only', requireAuth, requireRole(Role.ADMIN), (_req, res) => {
    res.json({ success: true, message: 'Admin access granted' });
  });

  app.get('/api/hr-or-admin', requireAuth, requireRole(Role.ADMIN, Role.HR), (_req, res) => {
    res.json({ success: true, message: 'HR/Admin access granted' });
  });

  app.get('/api/any-authenticated', requireAuth, (_req, res) => {
    res.json({ success: true, message: 'Authenticated access granted' });
  });

  app.get('/api/resource/:id', 
    requireAuth, 
    requireOwnershipOrRole(async (req) => {
      const { id } = req.params;
      if (id === 'own-resource') return req.user!.id;
      if (id === 'other-resource') return 'other-user-id';
      return null;
    }, Role.ADMIN, Role.HR),
    (_req, res) => {
      res.json({ success: true, message: 'Resource access granted' });
    }
  );

  app.use(errorHandler);
  return app;
}

describe('Authorization Integration Tests', () => {
  let app: express.Express;

  beforeEach(() => {
    app = createApp();
    vi.clearAllMocks();
  });

  describe('Role-based access', () => {
    it('should allow ADMIN to access admin-only endpoint', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        id: TEST_USERS.admin.id,
        email: TEST_USERS.admin.email,
        loginId: TEST_USERS.admin.loginId,
        role: TEST_USERS.admin.role,
        companyId: TEST_USERS.admin.companyId,
        isActive: true,
        mustChangePassword: false,
      } as any);

      const token = generateTestToken(TEST_USERS.admin);
      const res = await request(app)
        .get('/api/admin-only')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should deny HR from admin-only endpoint', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        id: TEST_USERS.hr.id,
        email: TEST_USERS.hr.email,
        loginId: TEST_USERS.hr.loginId,
        role: TEST_USERS.hr.role,
        companyId: TEST_USERS.hr.companyId,
        isActive: true,
        mustChangePassword: false,
      } as any);

      const token = generateTestToken(TEST_USERS.hr);
      const res = await request(app)
        .get('/api/admin-only')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should deny EMPLOYEE from admin-only endpoint', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        id: TEST_USERS.employee1.id,
        email: TEST_USERS.employee1.email,
        loginId: TEST_USERS.employee1.loginId,
        role: TEST_USERS.employee1.role,
        companyId: TEST_USERS.employee1.companyId,
        isActive: true,
        mustChangePassword: false,
      } as any);

      const token = generateTestToken(TEST_USERS.employee1);
      const res = await request(app)
        .get('/api/admin-only')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should allow both ADMIN and HR to hr-or-admin endpoint', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        id: TEST_USERS.hr.id,
        email: TEST_USERS.hr.email,
        loginId: TEST_USERS.hr.loginId,
        role: TEST_USERS.hr.role,
        companyId: TEST_USERS.hr.companyId,
        isActive: true,
        mustChangePassword: false,
      } as any);

      const token = generateTestToken(TEST_USERS.hr);
      const res = await request(app)
        .get('/api/hr-or-admin')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should deny EMPLOYEE from hr-or-admin endpoint', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        id: TEST_USERS.employee1.id,
        email: TEST_USERS.employee1.email,
        loginId: TEST_USERS.employee1.loginId,
        role: TEST_USERS.employee1.role,
        companyId: TEST_USERS.employee1.companyId,
        isActive: true,
        mustChangePassword: false,
      } as any);

      const token = generateTestToken(TEST_USERS.employee1);
      const res = await request(app)
        .get('/api/hr-or-admin')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Ownership-based access', () => {
    it('should allow access to own resource', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        id: TEST_USERS.employee1.id,
        email: TEST_USERS.employee1.email,
        loginId: TEST_USERS.employee1.loginId,
        role: TEST_USERS.employee1.role,
        companyId: TEST_USERS.employee1.companyId,
        isActive: true,
        mustChangePassword: false,
      } as any);

      const token = generateTestToken(TEST_USERS.employee1);
      const res = await request(app)
        .get('/api/resource/own-resource')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should deny access to other employee resource', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        id: TEST_USERS.employee1.id,
        email: TEST_USERS.employee1.email,
        loginId: TEST_USERS.employee1.loginId,
        role: TEST_USERS.employee1.role,
        companyId: TEST_USERS.employee1.companyId,
        isActive: true,
        mustChangePassword: false,
      } as any);

      const token = generateTestToken(TEST_USERS.employee1);
      const res = await request(app)
        .get('/api/resource/other-resource')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should allow ADMIN to access any resource', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        id: TEST_USERS.admin.id,
        email: TEST_USERS.admin.email,
        loginId: TEST_USERS.admin.loginId,
        role: TEST_USERS.admin.role,
        companyId: TEST_USERS.admin.companyId,
        isActive: true,
        mustChangePassword: false,
      } as any);

      const token = generateTestToken(TEST_USERS.admin);
      const res = await request(app)
        .get('/api/resource/other-resource')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Unauthenticated access', () => {
    it('should reject request without token', async () => {
      const res = await request(app).get('/api/admin-only');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject request with invalid token', async () => {
      const res = await request(app)
        .get('/api/admin-only')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
