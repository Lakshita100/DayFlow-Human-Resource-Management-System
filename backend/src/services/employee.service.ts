import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { employeeRepository } from '../repositories/employee.repository.js';
import { generateLoginId, generateTemporaryPassword } from '../utils/login-id.js';
import { createError } from '../middleware/error.middleware.js';
import type { CreateEmployeeInput, UpdateEmployeeInput, EmployeeQueryInput } from '../validators/employee.validator.js';

const BCRYPT_ROUNDS = 10;

function formatEmployeeList(employee: any) {
  const user = employee.user;
  return {
    id: employee.id,
    employeeId: employee.employeeId,
    userId: employee.userId,
    loginId: user?.loginId || null,
    firstName: employee.firstName,
    lastName: employee.lastName,
    name: `${employee.firstName} ${employee.lastName}`,
    email: user?.email || null,
    phone: employee.phone,
    department: employee.department,
    designation: employee.designation,
    dateOfJoining: employee.dateOfJoining.toISOString(),
    employmentType: employee.employmentType,
    status: employee.status,
    profilePicture: employee.profilePicture || null,
    isActive: user?.isActive ?? true,
    createdAt: employee.createdAt.toISOString(),
  };
}

function formatEmployeeDetail(employee: any) {
  const user = employee.user;
  const company = employee.company;
  return {
    id: employee.id,
    employeeId: employee.employeeId,
    userId: employee.userId,
    loginId: user?.loginId || null,
    firstName: employee.firstName,
    lastName: employee.lastName,
    name: `${employee.firstName} ${employee.lastName}`,
    email: user?.email || null,
    phone: employee.phone,
    department: employee.department,
    designation: employee.designation,
    dateOfJoining: employee.dateOfJoining.toISOString(),
    employmentType: employee.employmentType,
    status: employee.status,
    profilePicture: employee.profilePicture || null,
    isActive: user?.isActive ?? true,
    company: company
      ? {
          id: company.id,
          name: company.name,
          logoUrl: company.logoUrl,
        }
      : null,
    skills: employee.skills?.map((es: any) => ({
      id: es.skill.id,
      name: es.skill.name,
      category: es.skill.category,
      proficiency: es.proficiency,
    })) || [],
    documents: employee.documents?.map((doc: any) => ({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      fileUrl: doc.fileUrl,
      uploadedAt: doc.uploadedAt.toISOString(),
    })) || [],
    createdAt: employee.createdAt.toISOString(),
  };
}

class EmployeeService {
  async listEmployees(companyId: string, query: EmployeeQueryInput) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const search = query.search || undefined;
    const status = query.status || undefined;

    const { employees, total } = await employeeRepository.findMany({
      companyId,
      search,
      status,
      page,
      limit,
    });

    return {
      employees: employees.map(formatEmployeeList),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEmployeeById(employeeId: string, companyId: string) {
    const employee = await employeeRepository.findByIdAndCompany(employeeId, companyId);
    if (!employee) {
      throw createError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
    }
    return formatEmployeeDetail(employee);
  }

  async getEmployeeByUserId(userId: string, companyId: string) {
    const employee = await employeeRepository.findByUserIdAndCompany(userId, companyId);
    if (!employee) {
      throw createError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
    }
    return formatEmployeeDetail(employee);
  }

  async getCurrentEmployee(userId: string) {
    const employee = await employeeRepository.findByUserId(userId);
    if (!employee) {
      throw createError('Employee profile not found', 404, 'EMPLOYEE_NOT_FOUND');
    }
    return formatEmployeeDetail(employee);
  }

  async createEmployee(companyId: string, input: CreateEmployeeInput) {
    const existingEmail = await employeeRepository.findUserByEmail(input.email);
    if (existingEmail) {
      throw createError('An account with this email already exists', 409, 'EMAIL_EXISTS');
    }

    const companyInfo = await employeeRepository.getCompanyPrefix(companyId);
    if (!companyInfo) {
      throw createError('Company not found', 404, 'COMPANY_NOT_FOUND');
    }

    const joiningDate = new Date(input.dateOfJoining);

    const { loginId } = await generateLoginId({
      companyId,
      companyPrefix: companyInfo.prefix,
      firstName: input.firstName,
      lastName: input.lastName,
      dateOfJoining: joiningDate,
    });

    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await bcrypt.hash(temporaryPassword, BCRYPT_ROUNDS);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email,
          passwordHash,
          loginId,
          role: 'EMPLOYEE',
          companyId,
          mustChangePassword: true,
          isActive: true,
        },
      });

      const employee = await tx.employee.create({
        data: {
          companyId,
          userId: user.id,
          employeeId: `EMP-${user.id.substring(0, 8).toUpperCase()}`,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone || null,
          department: input.department,
          designation: input.designation,
          dateOfJoining: joiningDate,
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
        },
      });

      return { user, employee };
    });

    const employee = await employeeRepository.findByIdAndCompany(
      result.employee.id,
      companyId
    );

    return {
      employee: employee ? formatEmployeeDetail(employee) : formatEmployeeList(result.employee),
      credentials: {
        loginId: result.user.loginId,
        temporaryPassword,
        email: result.user.email,
      },
    };
  }

  async updateEmployee(employeeId: string, companyId: string, input: UpdateEmployeeInput) {
    const existing = await employeeRepository.findByIdAndCompany(employeeId, companyId);
    if (!existing) {
      throw createError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
    }

    const updateData: any = {};
    if (input.firstName) updateData.firstName = input.firstName;
    if (input.lastName) updateData.lastName = input.lastName;
    if (input.phone !== undefined) updateData.phone = input.phone || null;
    if (input.department) updateData.department = input.department;
    if (input.designation) updateData.designation = input.designation;
    if (input.employmentType) updateData.employmentType = input.employmentType;

    if (Object.keys(updateData).length === 0) {
      throw createError('No fields to update', 400, 'NO_FIELDS_TO_UPDATE');
    }

    await employeeRepository.update(employeeId, companyId, updateData);

    const updated = await employeeRepository.findByIdAndCompany(employeeId, companyId);
    return updated ? formatEmployeeDetail(updated) : null;
  }

  async updateEmployeeStatus(employeeId: string, companyId: string, status: 'ACTIVE' | 'INACTIVE') {
    const existing = await employeeRepository.findByIdAndCompany(employeeId, companyId);
    if (!existing) {
      throw createError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
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
}

export const employeeService = new EmployeeService();
