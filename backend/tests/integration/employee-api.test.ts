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
  generateLoginId: vi.fn().mockResolvedValue({ loginId: 'OIJODO20260001', serial: 1 }),
  generateTemporaryPassword: vi.fn().mockReturnValue('Kx9m-Pq2n-Rv7t'),
}));

vi.mock('../../src/config/database.js', () => ({
  prisma: {
    $transaction: vi.fn((fn: any) => fn({
      user: {
        create: vi.fn().mockResolvedValue({
          id: 'user-new-001',
          loginId: 'OIJODO20260001',
          email: 'new.hire@example.com',
        }),
      },
      employee: { create: vi.fn().mockResolvedValue({ id: 'emp-new-001' }) },
    })),
    user: { update: vi.fn() },
  },
}));

import { userRepository } from '../../src/repositories/user.repository.js';
import { employeeRepository } from '../../src/repositories/employee.repository.js';
import employeeRoutes from '../../src/routes/employee.routes.js';
import { errorHandler } from '../../src/middleware/error.middleware';
import { TEST_USERS, generateTestToken } from '../helpers/tokens';
import type { AuthUser } from '../../src/types/index.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/employees', employeeRoutes);
  app.use(errorHandler);
  return app;
}

function mockAuthUser(user: typeof TEST_USERS.companyA.admin) {
  (userRepository.findById as any).mockResolvedValue({
    id: user.id,
    loginId: user.loginId,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
    mustChangePassword: false,
    isActive: true,
  });
}

const activeEmployeeRow = {
  id: 'emp-001',
  employeeId: 'EMP-001',
  userId: TEST_USERS.companyA.employee1.id,
  companyId: 'company-a-id',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+919876543210',
  department: 'Engineering',
  designation: 'Software Engineer',
  dateOfJoining: new Date('2024-01-15'),
  employmentType: 'FULL_TIME',
  status: 'ACTIVE',
  profilePicture: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: {
    id: TEST_USERS.companyA.employee1.id,
    loginId: TEST_USERS.companyA.employee1.loginId,
    email: TEST_USERS.companyA.employee1.email,
    role: 'EMPLOYEE',
    isActive: true,
    mustChangePassword: false,
  },
  company: { id: 'company-a-id', name: 'Dayflow', prefix: 'DF', logoUrl: null },
  skills: [],
  documents: [],
};

describe('Employee API Integration Tests', () => {
  let app: express.Express;
  let adminToken: string;
  let hrToken: string;
  let employeeToken: string;

  beforeEach(() => {
    app = createApp();
    vi.clearAllMocks();
    adminToken = generateTestToken(TEST_USERS.companyA.admin);
    hrToken = generateTestToken(TEST_USERS.companyA.hr);
    employeeToken = generateTestToken(TEST_USERS.companyA.employee1);
  });

  describe('GET /api/employees', () => {
    it('should return company employees for ADMIN', async () => {
      mockAuthUser(TEST_USERS.companyA.admin);
      (employeeRepository.findMany as any).mockResolvedValue({
        employees: [activeEmployeeRow],
        total: 1,
      });

      const res = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.employees).toHaveLength(1);
      expect(employeeRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ companyId: 'company-a-id' })
      );
    });

    it('should return company employees for HR', async () => {
      mockAuthUser(TEST_USERS.companyA.hr);
      (employeeRepository.findMany as any).mockResolvedValue({
        employees: [],
        total: 0,
      });

      const res = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${hrToken}`);

      expect(res.status).toBe(200);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/employees');
      expect(res.status).toBe(401);
    });

    it('should search server-side via query params', async () => {
      mockAuthUser(TEST_USERS.companyA.admin);
      (employeeRepository.findMany as any).mockResolvedValue({ employees: [], total: 0 });

      const res = await request(app)
        .get('/api/employees?search=john&page=2&limit=10')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(employeeRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ companyId: 'company-a-id', search: 'john', page: 2, limit: 10 })
      );
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should return employee details for same company', async () => {
      mockAuthUser(TEST_USERS.companyA.admin);
      (employeeRepository.findByIdAndCompany as any).mockResolvedValue(activeEmployeeRow);

      const res = await request(app)
        .get('/api/employees/emp-001')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('John Doe');
      // Company isolation: scoped by authenticated companyId
      expect(employeeRepository.findByIdAndCompany).toHaveBeenCalledWith(
        'emp-001',
        'company-a-id'
      );
    });

    it('should return 404 for cross-company employee', async () => {
      mockAuthUser(TEST_USERS.companyA.admin);
      // Company B employee never matches WHERE companyId = company-a-id
      (employeeRepository.findByIdAndCompany as any).mockResolvedValue(null);

      const res = await request(app)
        .get('/api/employees/company-b-emp-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });

    it('should not leak passwordHash in response', async () => {
      mockAuthUser(TEST_USERS.companyA.admin);
      (employeeRepository.findByIdAndCompany as any).mockResolvedValue(activeEmployeeRow);

      const res = await request(app)
        .get('/api/employees/emp-001')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(JSON.stringify(res.body)).not.toContain('passwordHash');
    });
  });

  describe('POST /api/employees', () => {
    const validPayload = {
      firstName: 'New',
      lastName: 'Hire',
      email: 'new.hire@example.com',
      department: 'Engineering',
      designation: 'Developer',
      dateOfJoining: '2026-08-22',
    };

    it('should create employee with ADMIN and return credentials once', async () => {
      mockAuthUser(TEST_USERS.companyA.admin);
      (employeeRepository.findUserByEmail as any).mockResolvedValue(null);
      (employeeRepository.getCompanyPrefix as any).mockResolvedValue({
        prefix: 'DF',
        name: 'Dayflow',
      });
      (employeeRepository.findByIdAndCompany as any).mockResolvedValue(activeEmployeeRow);

      const res = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validPayload);

      expect(res.status).toBe(201);
      expect(res.body.data.credentials.temporaryPassword).toBe('Kx9m-Pq2n-Rv7t');
      // Backend derives login ID — format CCFFLLYYYYNNNN
      expect(res.body.data.credentials.loginId).toMatch(/^[A-Z]{6}\d{8}$/);
      // Credentials must NEVER appear in list/detail responses
      expect(JSON.stringify(res.body.data.employee)).not.toContain('temporaryPassword');
    });

    it('should ignore companyId injection and use JWT companyId', async () => {
      mockAuthUser(TEST_USERS.companyA.admin);
      (employeeRepository.findUserByEmail as any).mockResolvedValue(null);
      (employeeRepository.getCompanyPrefix as any).mockResolvedValue({
        prefix: 'DF',
        name: 'Dayflow',
      });
      (employeeRepository.findByIdAndCompany as any).mockResolvedValue(activeEmployeeRow);

      await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...validPayload, companyId: 'company-b-id', role: 'ADMIN' });

      // getCompanyPrefix called with JWT companyId, NOT injected value
      expect(employeeRepository.getCompanyPrefix).toHaveBeenCalledWith('company-a-id');
    });

    it('should return 409 on duplicate email', async () => {
      mockAuthUser(TEST_USERS.companyA.admin);
      (employeeRepository.findUserByEmail as any).mockResolvedValue({
        id: 'existing-user',
        email: validPayload.email,
      });

      const res = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validPayload);

      expect(res.status).toBe(409);
    });

    it('should reject EMPLOYEE role with real RBAC middleware', async () => {
      mockAuthUser(TEST_USERS.companyA.employee1);

      const res = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send(validPayload);

      expect(res.status).toBe(403);
      expect(employeeRepository.findUserByEmail).not.toHaveBeenCalled();
    });

    it('should return 400 on invalid input', async () => {
      mockAuthUser(TEST_USERS.companyA.admin);

      const res = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ firstName: '', email: 'not-an-email' });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('PATCH /api/employees/:id', () => {
    it('should update employee for HR', async () => {
      mockAuthUser(TEST_USERS.companyA.hr);
      (employeeRepository.findByIdAndCompany as any)
        .mockResolvedValueOnce(activeEmployeeRow)
        .mockResolvedValueOnce({ ...activeEmployeeRow, department: 'Product' });
      (employeeRepository.update as any).mockResolvedValue({ count: 1 });

      const res = await request(app)
        .patch('/api/employees/emp-001')
        .set('Authorization', `Bearer ${hrToken}`)
        .send({ department: 'Product' });

      expect(res.status).toBe(200);
      expect(res.body.data.department).toBe('Product');
    });

    it('should block EMPLOYEE from updating others', async () => {
      mockAuthUser(TEST_USERS.companyA.employee1);

      const res = await request(app)
        .patch('/api/employees/emp-002')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ department: 'Hacked' });

      expect(res.status).toBe(403);
    });

    it('should return 404 when updating cross-company employee', async () => {
      mockAuthUser(TEST_USERS.companyA.hr);
      (employeeRepository.findByIdAndCompany as any).mockResolvedValue(null);

      const res = await request(app)
        .patch('/api/employees/company-b-emp')
        .set('Authorization', `Bearer ${hrToken}`)
        .send({ department: 'X' });

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/employees/:id/status', () => {
    it('should deactivate employee for ADMIN', async () => {
      mockAuthUser(TEST_USERS.companyA.admin);
      (employeeRepository.findByIdAndCompany as any)
        .mockResolvedValueOnce(activeEmployeeRow)
        .mockResolvedValueOnce({ ...activeEmployeeRow, status: 'INACTIVE' });
      (employeeRepository.updateStatus as any).mockResolvedValue({ count: 1 });

      const res = await request(app)
        .patch('/api/employees/emp-001/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'INACTIVE' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('INACTIVE');
    });

    it('should block HR from status change (ADMIN only)', async () => {
      mockAuthUser(TEST_USERS.companyA.hr);

      const res = await request(app)
        .patch('/api/employees/emp-001/status')
        .set('Authorization', `Bearer ${hrToken}`)
        .send({ status: 'INACTIVE' });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/employees/stats', () => {
    it('should return stats for ADMIN', async () => {
      mockAuthUser(TEST_USERS.companyA.admin);
      (employeeRepository.countByCompany as any).mockResolvedValue(10);
      (employeeRepository.countActiveByCompany as any).mockResolvedValue(8);

      const res = await request(app)
        .get('/api/employees/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.totalEmployees).toBe(10);
    });

    it('should block EMPLOYEE from stats', async () => {
      mockAuthUser(TEST_USERS.companyA.employee1);

      const res = await request(app)
        .get('/api/employees/stats')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(403);
    });
  });
});
