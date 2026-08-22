import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { requireAuth } from '../../src/middleware/auth.middleware';
import { requireRole } from '../../src/middleware/authorization.middleware';
import { TEST_USERS, generateTestToken } from '../helpers/tokens';
import { errorHandler } from '../../src/middleware/error.middleware';
import { Role } from '@prisma/client';

vi.mock('../../src/repositories/user.repository', () => ({
  userRepository: {
    findById: vi.fn(),
  },
}));

vi.mock('../../src/repositories/company.repository', () => ({
  companyRepository: {
    findById: vi.fn(),
  },
}));

import { userRepository } from '../../src/repositories/user.repository';
import { companyRepository } from '../../src/repositories/company.repository';

function createApp() {
  const app = express();
  app.use(express.json());

  // Endpoint to get company data - simulates fetching company-specific resources
  app.get('/api/company/:companyId/employees',
    requireAuth,
    requireRole(Role.ADMIN, Role.HR),
    async (req, res) => {
      const { companyId } = req.params;
      const userCompanyId = req.user!.companyId;

      // Simulate tenant isolation check
      if (userCompanyId !== companyId) {
        res.status(403).json({ success: false, message: 'Access denied: cross-company access' });
        return;
      }

      res.json({
        success: true,
        data: { companyId, employees: [] },
      });
    }
  );

  // Endpoint to get user's own company
  app.get('/api/my-company',
    requireAuth,
    async (req, res) => {
      res.json({
        success: true,
        data: { companyId: req.user!.companyId },
      });
    }
  );

  // Admin-only endpoint
  app.get('/api/admin/dashboard',
    requireAuth,
    requireRole(Role.ADMIN),
    async (req, res) => {
      res.json({
        success: true,
        data: { companyId: req.user!.companyId, role: req.user!.role },
      });
    }
  );

  app.use(errorHandler);
  return app;
}

describe('Multi-Company Isolation Tests', () => {
  let app: express.Express;

  beforeEach(() => {
    app = createApp();
    vi.clearAllMocks();
  });

  describe('Company isolation', () => {
    it('should allow Company A admin to access Company A resources', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        id: TEST_USERS.companyA.admin.id,
        email: TEST_USERS.companyA.admin.email,
        role: TEST_USERS.companyA.admin.role,
        companyId: TEST_USERS.companyA.admin.companyId,
        isActive: true,
        mustChangePassword: false,
      } as any);

      const token = generateTestToken(TEST_USERS.companyA.admin);
      const res = await request(app)
        .get('/api/company/company-a-id/employees')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.companyId).toBe('company-a-id');
    });

    it('should deny Company A admin access to Company B resources', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        id: TEST_USERS.companyA.admin.id,
        email: TEST_USERS.companyA.admin.email,
        role: TEST_USERS.companyA.admin.role,
        companyId: TEST_USERS.companyA.admin.companyId,
        isActive: true,
        mustChangePassword: false,
      } as any);

      const token = generateTestToken(TEST_USERS.companyA.admin);
      const res = await request(app)
        .get('/api/company/company-b-id/employees')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Access denied');
    });

    it('should deny Company B admin access to Company A resources', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        id: TEST_USERS.companyB.admin.id,
        email: TEST_USERS.companyB.admin.email,
        role: TEST_USERS.companyB.admin.role,
        companyId: TEST_USERS.companyB.admin.companyId,
        isActive: true,
        mustChangePassword: false,
      } as any);

      const token = generateTestToken(TEST_USERS.companyB.admin);
      const res = await request(app)
        .get('/api/company/company-a-id/employees')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('JWT company context', () => {
    it('should include companyId in JWT token', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        id: TEST_USERS.companyA.admin.id,
        email: TEST_USERS.companyA.admin.email,
        role: TEST_USERS.companyA.admin.role,
        companyId: TEST_USERS.companyA.admin.companyId,
        isActive: true,
        mustChangePassword: false,
      } as any);

      const token = generateTestToken(TEST_USERS.companyA.admin);
      const res = await request(app)
        .get('/api/my-company')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.companyId).toBe('company-a-id');
    });

    it('should have different companyId for different companies', async () => {
      vi.mocked(userRepository.findById)
        .mockResolvedValueOnce({
          id: TEST_USERS.companyA.admin.id,
          email: TEST_USERS.companyA.admin.email,
          role: TEST_USERS.companyA.admin.role,
          companyId: TEST_USERS.companyA.admin.companyId,
          isActive: true,
          mustChangePassword: false,
        } as any)
        .mockResolvedValueOnce({
          id: TEST_USERS.companyB.admin.id,
          email: TEST_USERS.companyB.admin.email,
          role: TEST_USERS.companyB.admin.role,
          companyId: TEST_USERS.companyB.admin.companyId,
          isActive: true,
          mustChangePassword: false,
        } as any);

      const tokenA = generateTestToken(TEST_USERS.companyA.admin);
      const tokenB = generateTestToken(TEST_USERS.companyB.admin);

      const resA = await request(app)
        .get('/api/my-company')
        .set('Authorization', `Bearer ${tokenA}`);

      const resB = await request(app)
        .get('/api/my-company')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(resA.body.data.companyId).toBe('company-a-id');
      expect(resB.body.data.companyId).toBe('company-b-id');
      expect(resA.body.data.companyId).not.toBe(resB.body.data.companyId);
    });
  });

  describe('Role authorization with company context', () => {
    it('should allow Company A admin to access admin endpoints', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        id: TEST_USERS.companyA.admin.id,
        email: TEST_USERS.companyA.admin.email,
        role: TEST_USERS.companyA.admin.role,
        companyId: TEST_USERS.companyA.admin.companyId,
        isActive: true,
        mustChangePassword: false,
      } as any);

      const token = generateTestToken(TEST_USERS.companyA.admin);
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('ADMIN');
    });

    it('should deny Company A HR from admin endpoints', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        id: TEST_USERS.companyA.hr.id,
        email: TEST_USERS.companyA.hr.email,
        role: TEST_USERS.companyA.hr.role,
        companyId: TEST_USERS.companyA.hr.companyId,
        isActive: true,
        mustChangePassword: false,
      } as any);

      const token = generateTestToken(TEST_USERS.companyA.hr);
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should deny Company A employee from admin endpoints', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        id: TEST_USERS.companyA.employee1.id,
        email: TEST_USERS.companyA.employee1.email,
        role: TEST_USERS.companyA.employee1.role,
        companyId: TEST_USERS.companyA.employee1.companyId,
        isActive: true,
        mustChangePassword: false,
      } as any);

      const token = generateTestToken(TEST_USERS.companyA.employee1);
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Unauthenticated access', () => {
    it('should reject request without token', async () => {
      const res = await request(app).get('/api/my-company');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject request with invalid token', async () => {
      const res = await request(app)
        .get('/api/my-company')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
