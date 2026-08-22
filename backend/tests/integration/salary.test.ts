import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/config/database.js';
import { generateTestToken } from '../helpers/tokens.js';
import { Role } from '@prisma/client';

describe('Salary Information API Integration Tests', () => {
  let adminToken: string;
  let employee1Token: string;
  let employee2Token: string;

  const emp1Id = 'DFEMP003';
  const emp2Id = 'DFEMP004';

  beforeAll(async () => {
    // 1. Create or get test company
    const company = await prisma.company.upsert({
      where: { name: 'Dayflow Test' },
      update: {},
      create: {
        id: 'company-test-salary-id',
        name: 'Dayflow Test',
        prefix: 'DFT',
      },
    });

    // 2. Create or get admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin.salary@dayflow.com' },
      update: { role: Role.ADMIN },
      create: {
        id: 'admin-salary-user-id',
        loginId: 'DFSTAD20240001',
        email: 'admin.salary@dayflow.com',
        passwordHash: 'hashedpassword',
        role: Role.ADMIN,
        companyId: company.id,
        isActive: true,
      },
    });

    // 3. Create or get employee 1 (User + Employee)
    const emp1User = await prisma.user.upsert({
      where: { email: 'john.salary@dayflow.com' },
      update: { role: Role.EMPLOYEE },
      create: {
        id: 'emp1-salary-user-id',
        loginId: 'DFSTEM20240003',
        email: 'john.salary@dayflow.com',
        passwordHash: 'hashedpassword',
        role: Role.EMPLOYEE,
        companyId: company.id,
        isActive: true,
      },
    });

    const emp1Record = await prisma.employee.upsert({
      where: { userId: emp1User.id },
      update: { employeeId: emp1Id },
      create: {
        employeeId: emp1Id,
        userId: emp1User.id,
        companyId: company.id,
        firstName: 'John',
        lastName: 'Doe',
        department: 'Engineering',
        designation: 'Developer',
        dateOfJoining: new Date(),
      },
    });

    // 4. Create or get employee 2 (User + Employee)
    const emp2User = await prisma.user.upsert({
      where: { email: 'jane.salary@dayflow.com' },
      update: { role: Role.EMPLOYEE },
      create: {
        id: 'emp2-salary-user-id',
        loginId: 'DFSTEM20240004',
        email: 'jane.salary@dayflow.com',
        passwordHash: 'hashedpassword',
        role: Role.EMPLOYEE,
        companyId: company.id,
        isActive: true,
      },
    });

    await prisma.employee.upsert({
      where: { userId: emp2User.id },
      update: { employeeId: emp2Id },
      create: {
        employeeId: emp2Id,
        userId: emp2User.id,
        companyId: company.id,
        firstName: 'Jane',
        lastName: 'Smith',
        department: 'Engineering',
        designation: 'Senior Developer',
        dateOfJoining: new Date(),
      },
    });

    adminToken = generateTestToken({
      userId: adminUser.id,
      email: adminUser.email,
      role: Role.ADMIN,
      companyId: company.id,
    });

    employee1Token = generateTestToken({
      userId: emp1User.id,
      email: emp1User.email,
      role: Role.EMPLOYEE,
      companyId: company.id,
    });

    employee2Token = generateTestToken({
      userId: emp2User.id,
      email: emp2User.email,
      role: Role.EMPLOYEE,
      companyId: company.id,
    });
  });

  describe('Authorization & Security', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get(`/api/employees/${emp1Id}/salary`);
      expect(res.status).toBe(401);
    });

    it('should deny employee from accessing another employee salary with 403', async () => {
      const res = await request(app)
        .get(`/api/employees/${emp1Id}/salary`)
        .set('Authorization', `Bearer ${employee2Token}`);

      expect(res.status).toBe(403);
    });

    it('should allow employee to access their own salary once created', async () => {
      // First ensure salary structure is created by Admin
      await request(app)
        .put(`/api/employees/${emp1Id}/salary`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          monthlyWage: 50000,
        });

      const res = await request(app)
        .get(`/api/employees/${emp1Id}/salary`)
        .set('Authorization', `Bearer ${employee1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.monthlyWage).toBe('50000.00');
    });

    it('should deny employee from updating salary with 403 Forbidden', async () => {
      const res = await request(app)
        .put(`/api/employees/${emp1Id}/salary`)
        .set('Authorization', `Bearer ${employee1Token}`)
        .send({
          monthlyWage: 60000,
        });

      expect(res.status).toBe(403);
    });
  });

  describe('Salary Structure & Calculation Engine Flow', () => {
    it('should create and update salary structure for employee as Admin', async () => {
      const updatePayload = {
        monthlyWage: 50000,
        workingDaysPerWeek: 5,
        breakTimeHours: 1,
        components: [
          {
            code: 'BASIC_SALARY',
            name: 'Basic Salary',
            calculationType: 'PERCENTAGE',
            calculationBasis: 'WAGE',
            value: 50,
          },
          {
            code: 'HRA',
            name: 'House Rent Allowance',
            calculationType: 'PERCENTAGE',
            calculationBasis: 'BASIC_SALARY',
            value: 50,
          },
          {
            code: 'FIXED_ALLOWANCE',
            name: 'Fixed Allowance',
            calculationType: 'FIXED_AMOUNT',
            value: 2918,
          },
        ],
        pf: {
          employeeRate: 12,
          employerRate: 12,
        },
        tax: {
          professionalTax: 200,
        },
      };

      const res = await request(app)
        .put(`/api/employees/${emp1Id}/salary`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatePayload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const data = res.body.data;
      expect(data.monthlyWage).toBe('50000.00');
      expect(data.yearlyWage).toBe('600000.00');
      expect(data.components).toHaveLength(3);

      const basic = data.components.find((c: any) => c.code === 'BASIC_SALARY');
      expect(basic.amount).toBe('25000.00');

      const hra = data.components.find((c: any) => c.code === 'HRA');
      expect(hra.amount).toBe('12500.00');

      expect(data.pf.employeeAmount).toBe('3000.00');
      expect(data.pf.employerAmount).toBe('3000.00');
      expect(data.tax.professionalTax).toBe('200.00');
    });

    it('should automatically recalculate percentage components when wage changes (50,000 -> 60,000)', async () => {
      const res = await request(app)
        .put(`/api/employees/${emp1Id}/salary`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          monthlyWage: 60000,
        });

      expect(res.status).toBe(200);
      const data = res.body.data;
      expect(data.monthlyWage).toBe('60000.00');
      expect(data.yearlyWage).toBe('720000.00');

      const basic = data.components.find((c: any) => c.code === 'BASIC_SALARY');
      expect(basic.amount).toBe('30000.00');

      const hra = data.components.find((c: any) => c.code === 'HRA');
      expect(hra.amount).toBe('15000.00');

      const fixed = data.components.find((c: any) => c.code === 'FIXED_ALLOWANCE');
      expect(fixed.amount).toBe('2918.00'); // Fixed component remains unchanged

      // PF updated from new basic salary (30,000 * 12% = 3,600)
      expect(data.pf.employeeAmount).toBe('3600.00');
    });

    it('should reject payload when total components exceed wage', async () => {
      const res = await request(app)
        .put(`/api/employees/${emp1Id}/salary`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          monthlyWage: 50000,
          components: [
            {
              code: 'BASIC_SALARY',
              name: 'Basic Salary',
              calculationType: 'PERCENTAGE',
              calculationBasis: 'WAGE',
              value: 80, // 40,000
            },
            {
              code: 'HRA',
              name: 'HRA',
              calculationType: 'PERCENTAGE',
              calculationBasis: 'BASIC_SALARY',
              value: 50, // 20,000 -> Total = 60,000 > 50,000
            },
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('SALARY_COMPONENT_TOTAL_EXCEEDS_WAGE');
    });

    it('should update PF configuration via /pf endpoint', async () => {
      const res = await request(app)
        .put(`/api/employees/${emp1Id}/salary/pf`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          employeeRate: 10,
          employerRate: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.pf.employeeRate).toBe('10.00');
    });

    it('should update Professional Tax via /tax endpoint', async () => {
      const res = await request(app)
        .put(`/api/employees/${emp1Id}/salary/tax`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          professionalTax: 300,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.tax.professionalTax).toBe('300.00');
    });

    it('should return 404 for non-existent employee', async () => {
      const res = await request(app)
        .get('/api/employees/non-existent-emp-id/salary')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.code).toBe('EMPLOYEE_NOT_FOUND');
    });
  });
});
