import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { employeeRepository } from '../repositories/employee.repository.js';
import { generateLoginId, generateTemporaryPassword } from '../utils/login-id.js';
import { createError } from '../middleware/error.middleware.js';
import type { CreateEmployeeInput, UpdateEmployeeInput, EmployeeQueryInput } from '../validators/employee.validator.js';

const BCRYPT_ROUNDS = 10;

function formatEmployeeList(employee: any) {
  const firstName = employee.firstName || '';
  const lastName = employee.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();

  return {
    id: employee.id,
    employeeId: employee.employeeId,
    firstName: employee.firstName,
    lastName: employee.lastName,
    name: fullName || 'Employee',
    phone: employee.phone,
    department: employee.department,
    designation: employee.designation,
    dateOfJoining: employee.dateOfJoining,
    employmentType: employee.employmentType,
    status: employee.status,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,
    user: employee.user
      ? {
          id: employee.user.id,
          loginId: employee.user.loginId,
          email: employee.user.email,
          role: employee.user.role,
          isActive: employee.user.isActive,
        }
      : undefined,
    company: employee.company
      ? {
          id: employee.company.id,
          name: employee.company.name,
          prefix: employee.company.prefix,
        }
      : undefined,
  };
}

function formatEmployeeDetail(employee: any) {
  return {
    ...formatEmployeeList(employee),
    privateInfo: employee.privateInfo || null,
    skills: employee.skills ? employee.skills.map((s: any) => s.skill) : [],
    documents: employee.documents || [],
  };
}

export class EmployeeService {
  async listEmployees(companyId: string, query: EmployeeQueryInput) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));

    const { employees, total } = await employeeRepository.findMany({
      companyId,
      search: query.search,
      status: query.status,
      page,
      limit,
    });

    const items = employees.map(formatEmployeeList);
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      employees: items,
      items,
      total,
      page,
      limit,
      totalPages,
      pagination: { page, limit, total, totalPages },
    };
  }

  async getEmployeeById(id: string, companyId: string) {
    const employee = await employeeRepository.findByIdAndCompany(id, companyId);
    if (!employee) {
      throw createError('Employee not found', 404);
    }
    return formatEmployeeDetail(employee);
  }

  async getCurrentEmployee(userId: string) {
    const employee = await employeeRepository.findByUserId(userId);
    if (!employee) {
      throw createError('Employee record not found for this user', 404);
    }
    return formatEmployeeDetail(employee);
  }

  async createEmployee(companyId: string, input: CreateEmployeeInput) {
    const existingUser = await employeeRepository.findUserByEmail(input.email);
    if (existingUser) {
      throw createError('Email is already registered', 409);
    }

    const companyInfo = await employeeRepository.getCompanyPrefix(companyId);
    if (!companyInfo) {
      throw createError('Company not found', 404);
    }

    const dateOfJoining = new Date(input.dateOfJoining);
    const loginIdResult = await generateLoginId({
      companyId,
      companyPrefix: companyInfo.prefix,
      firstName: input.firstName,
      lastName: input.lastName,
      dateOfJoining,
    });
    const employeeId = typeof loginIdResult === 'string' ? loginIdResult : (loginIdResult as any).loginId;

    const tempPassword = generateTemporaryPassword();
    const passwordHash = await bcrypt.hash(tempPassword, BCRYPT_ROUNDS);

    const { employee } = await prisma.$transaction(async (tx: any) => {
      const u = await tx.user.create({
        data: {
          email: input.email,
          passwordHash,
          loginId: employeeId,
          companyId,
          role: 'EMPLOYEE',
          mustChangePassword: true,
        },
      });

      const e = await tx.employee.create({
        data: {
          companyId,
          userId: u.id,
          employeeId,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          department: input.department,
          designation: input.designation,
          dateOfJoining,
          employmentType: input.employmentType || 'FULL_TIME',
          status: 'ACTIVE',
        },
        include: {
          user: {
            select: {
              id: true,
              loginId: true,
              email: true,
              role: true,
              isActive: true,
              mustChangePassword: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              prefix: true,
            },
          },
        },
      });

      return { user: u, employee: e };
    });

    return {
      employee: formatEmployeeDetail(employee),
      credentials: {
        loginId: employeeId,
        temporaryPassword: tempPassword,
      },
    };
  }

  async updateEmployee(id: string, companyId: string, input: UpdateEmployeeInput) {
    if (!input || Object.keys(input).length === 0) {
      throw createError('At least one field to update is required', 400);
    }

    const existing = await employeeRepository.findByIdAndCompany(id, companyId);
    if (!existing) {
      throw createError('Employee not found', 404);
    }

    await employeeRepository.update(id, companyId, {
      ...(input.firstName && { firstName: input.firstName }),
      ...(input.lastName && { lastName: input.lastName }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.department && { department: input.department }),
      ...(input.designation && { designation: input.designation }),
      ...(input.employmentType && { employmentType: input.employmentType }),
    });

    const updated = await employeeRepository.findByIdAndCompany(id, companyId);
    return updated ? formatEmployeeDetail(updated) : null;
  }

  async updateEmployeeStatus(employeeId: string, companyId: string, status: 'ACTIVE' | 'INACTIVE') {
    const existing = await employeeRepository.findByIdAndCompany(employeeId, companyId);
    if (!existing) {
      throw createError('Employee not found', 404);
    }

    await employeeRepository.updateStatus(employeeId, companyId, status);

    if (status === 'INACTIVE') {
      await prisma.user.update({
        where: { id: existing.userId },
        data: { isActive: false },
      });
    } else {
      await prisma.user.update({
        where: { id: existing.userId },
        data: { isActive: true },
      });
    }

    const updated = await employeeRepository.findByIdAndCompany(employeeId, companyId);
    return updated ? formatEmployeeDetail(updated) : null;
  }

  async getCompanyStats(companyId: string) {
    const [total, active] = await Promise.all([
      employeeRepository.countByCompany(companyId),
      employeeRepository.countActiveByCompany(companyId),
    ]);

    return {
      totalEmployees: total,
      activeEmployees: active,
      inactiveEmployees: total - active,
    };
  }

  async updateEmployeeAvatar(employeeId: string, companyId: string, requestingUser: any, file?: Express.Multer.File) {
    if (!file) {
      throw createError('No avatar file provided', 400);
    }

    const employee = await employeeRepository.findByIdAndCompany(employeeId, companyId);
    if (!employee) {
      throw createError('Employee not found', 404);
    }

    const isSelf = employee.userId === requestingUser.id;
    const isPrivileged = requestingUser.role === 'ADMIN' || requestingUser.role === 'HR';
    if (!isSelf && !isPrivileged) {
      throw createError('Unauthorized to update avatar for this employee', 403);
    }

    const fileUrl = `/uploads/avatars/${file.filename}`;

    await prisma.employeeDocument.create({
      data: {
        employeeId: employee.id,
        name: 'Profile Photo',
        type: 'AVATAR',
        fileUrl,
      },
    });

    return {
      employeeId: employee.id,
      avatarUrl: fileUrl,
    };
  }
}

export const employeeService = new EmployeeService();
