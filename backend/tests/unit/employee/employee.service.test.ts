import { describe, it, expect, vi, beforeEach } from 'vitest';
import { employeeRepository } from '../../../src/repositories/employee.repository.js';
import { generateLoginId, generateTemporaryPassword } from '../../../src/utils/login-id.js';

vi.mock('../../../src/repositories/employee.repository.js', () => ({
  employeeRepository: {
    findMany: vi.fn(),
    findByIdAndCompany: vi.fn(),
    findByUserIdAndCompany: vi.fn(),
    findByUserId: vi.fn(),
    findUserByEmail: vi.fn(),
    getCompanyPrefix: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
    countByCompany: vi.fn(),
    countActiveByCompany: vi.fn(),
  },
}));

vi.mock('../../../src/utils/login-id.js', () => ({
  generateLoginId: vi.fn(),
  generateTemporaryPassword: vi.fn(),
}));

vi.mock('../../../src/config/database.js', () => ({
  prisma: {
    $transaction: vi.fn((fn: any) => fn({
      user: {
        create: vi.fn().mockResolvedValue({
          id: 'user-new-001',
          loginId: 'OIJODO20240001',
          email: 'john@example.com',
        }),
      },
      employee: {
        create: vi.fn().mockResolvedValue({ id: 'emp-new-001' }),
      },
    })),
    user: { update: vi.fn() },
  },
}));

const companyId = 'company-a-id';
const mockEmployee = {
  id: 'emp-001',
  employeeId: 'EMP-001',
  userId: 'user-001',
  companyId,
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
    id: 'user-001',
    loginId: 'OIJODO20240001',
    email: 'john@example.com',
    role: 'EMPLOYEE',
    isActive: true,
    mustChangePassword: false,
  },
  company: { id: companyId, name: 'Odoo India', prefix: 'OI', logoUrl: null },
  skills: [],
  documents: [],
  privateInfo: null,
};

describe('EmployeeService', () => {
  let employeeService: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import('../../../src/services/employee.service.js');
    employeeService = mod.employeeService;
  });

  describe('listEmployees', () => {
    it('should return paginated employee list', async () => {
      (employeeRepository.findMany as any).mockResolvedValue({
        employees: [mockEmployee],
        total: 1,
      });

      const result = await employeeService.listEmployees(companyId, {
        page: '1',
        limit: '20',
        search: '',
      });

      expect(result.employees).toHaveLength(1);
      expect(result.pagination).toEqual({ page: 1, limit: 20, total: 1, totalPages: 1 });
    });

    it('should handle search parameter', async () => {
      (employeeRepository.findMany as any).mockResolvedValue({ employees: [], total: 0 });

      await employeeService.listEmployees(companyId, { page: '1', limit: '20', search: 'john' });

      expect(employeeRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'john', companyId })
      );
    });

    it('should handle status filter', async () => {
      (employeeRepository.findMany as any).mockResolvedValue({ employees: [], total: 0 });

      await employeeService.listEmployees(companyId, {
        page: '1',
        limit: '20',
        search: '',
        status: 'ACTIVE',
      });

      expect(employeeRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'ACTIVE', companyId })
      );
    });
  });

  describe('getEmployeeById', () => {
    it('should return employee details', async () => {
      (employeeRepository.findByIdAndCompany as any).mockResolvedValue(mockEmployee);

      const result = await employeeService.getEmployeeById('emp-001', companyId);

      expect(result.id).toBe('emp-001');
      expect(result.name).toBe('John Doe');
      expect(result.company.id).toBe(companyId);
    });

    it('should throw 404 if employee not found', async () => {
      (employeeRepository.findByIdAndCompany as any).mockResolvedValue(null);

      await expect(
        employeeService.getEmployeeById('nonexistent', companyId)
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('getCurrentEmployee', () => {
    it('should return current employee profile', async () => {
      (employeeRepository.findByUserId as any).mockResolvedValue(mockEmployee);

      const result = await employeeService.getCurrentEmployee('user-001');

      expect(result.id).toBe('emp-001');
    });

    it('should throw 404 if not found', async () => {
      (employeeRepository.findByUserId as any).mockResolvedValue(null);

      await expect(employeeService.getCurrentEmployee('nonexistent')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('createEmployee', () => {
    const validInput = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      department: 'Engineering',
      designation: 'Software Engineer',
      dateOfJoining: '2024-01-15',
    };

    it('should create employee with generated Login ID and temp password', async () => {
      (employeeRepository.findUserByEmail as any).mockResolvedValue(null);
      (employeeRepository.getCompanyPrefix as any).mockResolvedValue({
        prefix: 'OI',
        name: 'Odoo India',
      });
      (generateLoginId as any).mockResolvedValue({ loginId: 'OIJODO20240001', serial: 1 });
      (generateTemporaryPassword as any).mockReturnValue('Kx9m-Pq2n-Rv7t');
      (employeeRepository.findByIdAndCompany as any).mockResolvedValue(mockEmployee);

      const result = await employeeService.createEmployee(companyId, validInput);

      expect(result.credentials.loginId).toBe('OIJODO20240001');
      expect(result.credentials.temporaryPassword).toBe('Kx9m-Pq2n-Rv7t');
      expect(generateLoginId).toHaveBeenCalledWith(
        expect.objectContaining({ companyId, companyPrefix: 'OI' })
      );
    });

    it('should throw 409 if email already exists', async () => {
      (employeeRepository.findUserByEmail as any).mockResolvedValue({
        id: 'existing-user',
        email: validInput.email,
      });

      await expect(
        employeeService.createEmployee(companyId, validInput)
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it('should throw 404 if company not found', async () => {
      (employeeRepository.findUserByEmail as any).mockResolvedValue(null);
      (employeeRepository.getCompanyPrefix as any).mockResolvedValue(null);

      await expect(
        employeeService.createEmployee(companyId, validInput)
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('updateEmployee', () => {
    it('should update employee fields', async () => {
      (employeeRepository.findByIdAndCompany as any)
        .mockResolvedValueOnce(mockEmployee)
        .mockResolvedValueOnce({ ...mockEmployee, department: 'Product' });
      (employeeRepository.update as any).mockResolvedValue({ count: 1 });

      const result = await employeeService.updateEmployee('emp-001', companyId, {
        department: 'Product',
      });

      expect(result.department).toBe('Product');
      expect(employeeRepository.update).toHaveBeenCalledWith(
        'emp-001',
        companyId,
        expect.objectContaining({ department: 'Product' })
      );
    });

    it('should throw 404 if not found', async () => {
      (employeeRepository.findByIdAndCompany as any).mockResolvedValue(null);

      await expect(
        employeeService.updateEmployee('nonexistent', companyId, { department: 'X' })
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should throw 400 if no fields to update', async () => {
      (employeeRepository.findByIdAndCompany as any).mockResolvedValue(mockEmployee);

      await expect(
        employeeService.updateEmployee('emp-001', companyId, {})
      ).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe('updateEmployeeStatus', () => {
    it('should deactivate employee and deactivate user account', async () => {
      const { prisma } = await import('../../../src/config/database.js');
      (employeeRepository.findByIdAndCompany as any)
        .mockResolvedValueOnce(mockEmployee)
        .mockResolvedValueOnce({ ...mockEmployee, status: 'INACTIVE' });
      (employeeRepository.updateStatus as any).mockResolvedValue({ count: 1 });
      (prisma.user.update as any).mockResolvedValue({});

      const result = await employeeService.updateEmployeeStatus('emp-001', companyId, 'INACTIVE');

      expect(result.status).toBe('INACTIVE');
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockEmployee.userId },
          data: { isActive: false },
        })
      );
    });

    it('should throw 404 if not found', async () => {
      (employeeRepository.findByIdAndCompany as any).mockResolvedValue(null);

      await expect(
        employeeService.updateEmployeeStatus('nonexistent', companyId, 'INACTIVE')
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('getCompanyStats', () => {
    it('should return company employee statistics', async () => {
      (employeeRepository.countByCompany as any).mockResolvedValue(10);
      (employeeRepository.countActiveByCompany as any).mockResolvedValue(8);

      const result = await employeeService.getCompanyStats(companyId);

      expect(result).toEqual({
        totalEmployees: 10,
        activeEmployees: 8,
        inactiveEmployees: 2,
      });
    });
  });
});
