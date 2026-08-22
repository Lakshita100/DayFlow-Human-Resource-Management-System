import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

vi.mock('../../src/repositories/user.repository.js', () => ({
  userRepository: {
    findById: vi.fn(),
    findByEmail: vi.fn(),
    findByLoginId: vi.fn(),
  },
}));

vi.mock('../../src/repositories/employee.repository.js', () => ({
  employeeRepository: {
    findMany: vi.fn(),
    findByIdAndCompany: vi.fn(),
    findByUserId: vi.fn(),
    findByUserIdAndCompany: vi.fn(),
    findUserByEmail: vi.fn(),
    getCompanyPrefix: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
    countByCompany: vi.fn(),
    countActiveByCompany: vi.fn(),
  },
}));

vi.mock('../../src/utils/login-id.js', () => ({
  generateLoginId: vi.fn().mockResolvedValue({ loginId: 'DFNEWH20260001', serial: 1 }),
  generateTemporaryPassword: vi.fn().mockReturnValue('Ab3d-Ef5h-Ij7k'),
}));

vi.mock('../../src/config/database.js', () => ({
  prisma: {
    $transaction: vi.fn((fn: any) => fn({
      user: { create: vi.fn().mockResolvedValue({ id: 'u-new', loginId: 'DFNEWH20260001', email: 'n@e.com' }) },
      employee: { create: vi.fn().mockResolvedValue({ id: 'e-new' }) },
    })),
    user: { update: vi.fn() },
  },
}));

import { userRepository } from '../../src/repositories/user.repository.js';
import { employeeRepository } from '../../src/repositories/employee.repository.js';
import employeeRoutes from '../../src/routes/employee.routes.js';
import { errorHandler } from '../../src/middleware/error.middleware';
import { TEST_USERS, generateTestToken, generateExpiredToken } from '../helpers/tokens';

const ALL_USERS: Record<string, any> = {};

function seedUsers() {
  const entries = [
    TEST_USERS.companyA.admin,
    TEST_USERS.companyA.hr,
    TEST_USERS.companyA.employee1,
    TEST_USERS.companyB.admin,
    TEST_USERS.companyB.hr,
    TEST_USERS.companyB.employee1,
  ];
  for (const u of entries) {
    ALL_USERS[u.id] = {
      id: u.id,
      loginId: u.loginId,
      email: u.email,
      role: u.role,
      companyId: u.companyId,
      mustChangePassword: false,
      isActive: true,
    };
  }
}

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/employees', employeeRoutes);
  app.use(errorHandler);
  return app;
}

describe('Employee Security Tests — Tenant Isolation & Injection', () => {
  let app: express.Express;
  let adminAToken: string;
  let adminBToken: string;
  let empAToken: string;

  beforeEach(() => {
    app = createApp();
    vi.clearAllMocks();
    seedUsers();
    (userRepository.findById as any).mockImplementation(async (id: string) => {
      const user = ALL_USERS[id];
      if (!user || !user.isActive) return null;
      return { ...user };
    });
    adminAToken = generateTestToken(TEST_USERS.companyA.admin);
    adminBToken = generateTestToken(TEST_USERS.companyB.admin);
    empAToken = generateTestToken(TEST_USERS.companyA.employee1);
  });

  const validPayload = {
    firstName: 'Isolated',
    lastName: 'Test',
    email: 'isolated@example.com',
    department: 'QA',
    designation: 'Tester',
    dateOfJoining: '2026-08-22',
  };

  describe('Authentication boundaries', () => {
    it('rejects missing JWT', async () => {
      const res = await request(app).get('/api/employees');
      expect(res.status).toBe(401);
    });

    it('rejects invalid JWT', async () => {
      const res = await request(app)
        .get('/api/employees')
        .set('Authorization', 'Bearer not-a-real-token');
      expect(res.status).toBe(401);
    });

    it('rejects expired JWT', async () => {
      const expired = generateExpiredToken(TEST_USERS.companyA.admin);
      const res = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${expired}`);
      expect(res.status).toBe(401);
    });

    it('rejects deactivated employee account', async () => {
      ALL_USERS[TEST_USERS.companyA.employee1.id].isActive = false;

      const res = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${empAToken}`);

      expect(res.status).toBe(401);
    });
  });

  describe('Cross-company isolation', () => {
    it('list is always scoped to JWT companyId (never another company)', async () => {
      (employeeRepository.findMany as any).mockResolvedValue({ employees: [], total: 0 });

      await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${adminAToken}`);

      expect(employeeRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ companyId: 'company-a-id' })
      );
      const call = (employeeRepository.findMany as any).mock.calls[0][0];
      expect(call.companyId).not.toBe('company-b-id');
    });

    it('Company A admin cannot read Company B employee details (404)', async () => {
      (employeeRepository.findByIdAndCompany as any).mockResolvedValue(null);

      const res = await request(app)
        .get('/api/employees/some-company-b-employee')
        .set('Authorization', `Bearer ${adminAToken}`);

      // Scoped query returns null -> 404, data existence not leaked
      expect(res.status).toBe(404);
      expect(employeeRepository.findByIdAndCompany).toHaveBeenCalledWith(
        'some-company-b-employee',
        'company-a-id'
      );
    });

    it('Company A admin cannot update Company B employee (404)', async () => {
      (employeeRepository.findByIdAndCompany as any).mockResolvedValue(null);

      const res = await request(app)
        .patch('/api/employees/company-b-emp')
        .set('Authorization', `Bearer ${adminAToken}`)
        .send({ department: 'Owned' });

      expect(res.status).toBe(404);
      expect(employeeRepository.update).not.toHaveBeenCalled();
    });

    it('Company A admin cannot deactivate Company B employee (404)', async () => {
      (employeeRepository.findByIdAndCompany as any).mockResolvedValue(null);

      const res = await request(app)
        .patch('/api/employees/company-b-emp/status')
        .set('Authorization', `Bearer ${adminAToken}`)
        .send({ status: 'INACTIVE' });

      expect(res.status).toBe(404);
      expect(employeeRepository.updateStatus).not.toHaveBeenCalled();
    });
  });

  describe('Injection attacks', () => {
    it('POST ignores injected companyId and uses JWT companyId', async () => {
      (employeeRepository.findUserByEmail as any).mockResolvedValue(null);
      (employeeRepository.getCompanyPrefix as any).mockResolvedValue({
        prefix: 'DF',
        name: 'Dayflow',
      });
      (employeeRepository.findByIdAndCompany as any).mockResolvedValue({
        id: 'emp-new',
        firstName: 'Isolated',
        lastName: 'Test',
        phone: null,
        department: 'QA',
        designation: 'Tester',
        dateOfJoining: new Date('2026-08-22'),
        employmentType: 'FULL_TIME',
        status: 'ACTIVE',
        profilePicture: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'u-new',
        employeeId: 'EMP-NEW',
        companyId: 'company-a-id',
        user: { id: 'u-new', loginId: 'DFNEWH20260001', email: 'n@e.com', role: 'EMPLOYEE', isActive: true, mustChangePassword: true },
        company: { id: 'company-a-id', name: 'Dayflow', prefix: 'DF', logoUrl: null },
        skills: [],
        documents: [],
      });

      const res = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${adminAToken}`)
        .send({
          ...validPayload,
          companyId: 'company-b-id',
          role: 'ADMIN',
          loginId: 'HACKED0001',
          password: 'InjectedPass123!',
        });

      expect(res.status).toBe(201);
      // Company prefix looked up from JWT company, NOT injected value
      expect(employeeRepository.getCompanyPrefix).toHaveBeenCalledWith('company-a-id');
      expect(employeeRepository.getCompanyPrefix).not.toHaveBeenCalledWith('company-b-id');
      // Generated loginId wins over injected one
      expect(res.body.data.credentials.loginId).toMatch(/^[A-Z]{6}\d{8}$/);
    });

    it('list/detail responses never contain credentials or hashes', async () => {
      (employeeRepository.findMany as any).mockResolvedValue({
        employees: [{
          id: 'emp-001', employeeId: 'EMP-001', firstName: 'John', lastName: 'Doe',
          phone: '+919876543210', department: 'Eng', designation: 'Dev',
          dateOfJoining: new Date('2024-01-15'), employmentType: 'FULL_TIME',
          status: 'ACTIVE', profilePicture: null, createdAt: new Date(), updatedAt: new Date(),
          userId: 'user-x', companyId: 'company-a-id',
          user: { id: 'user-x', loginId: 'DFJODO20240003', email: 'j@d.com', role: 'EMPLOYEE', isActive: true, mustChangePassword: false },
          company: { id: 'company-a-id', name: 'Dayflow', prefix: 'DF', logoUrl: null },
        }],
        total: 1,
      });

      const res = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${adminAToken}`);

      const body = JSON.stringify(res.body);
      expect(body).not.toContain('passwordHash');
      expect(body).not.toContain('temporaryPassword');
      expect(body).not.toContain('mustChangePassword');
    });
  });

  describe('RBAC enforcement (real middleware)', () => {
    it('EMPLOYEE cannot create employees', async () => {
      const res = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${empAToken}`)
        .send(validPayload);

      expect(res.status).toBe(403);
      expect(employeeRepository.findUserByEmail).not.toHaveBeenCalled();
    });

    it('EMPLOYEE cannot update other employees', async () => {
      const res = await request(app)
        .patch('/api/employees/other-emp')
        .set('Authorization', `Bearer ${empAToken}`)
        .send({ department: 'X' });

      expect(res.status).toBe(403);
    });

    it('HR cannot deactivate employees (ADMIN-only)', async () => {
      const hrToken = generateTestToken(TEST_USERS.companyA.hr);

      const res = await request(app)
        .patch('/api/employees/emp-001/status')
        .set('Authorization', `Bearer ${hrToken}`)
        .send({ status: 'INACTIVE' });

      expect(res.status).toBe(403);
    });

    it('EMPLOYEE cannot access company stats', async () => {
      const res = await request(app)
        .get('/api/employees/stats')
        .set('Authorization', `Bearer ${empAToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('Validation hardening', () => {
    it('rejects malformed status values', async () => {
      const res = await request(app)
        .patch('/api/employees/emp-001/status')
        .set('Authorization', `Bearer ${adminAToken}`)
        .send({ status: 'NOT_A_STATUS' });

      expect(res.status).toBe(400);
    });

    it('rejects invalid page/limit params', async () => {
      const res = await request(app)
        .get('/api/employees?page=-5&limit=9999')
        .set('Authorization', `Bearer ${adminAToken}`);

      expect(res.status).toBe(400);
    });
  });
});
