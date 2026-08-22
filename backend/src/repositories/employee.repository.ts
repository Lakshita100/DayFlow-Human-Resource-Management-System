import { Prisma, EmployeeStatus } from '@prisma/client';
import { prisma } from '../config/database.js';

const employeeInclude = {
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
      logoUrl: true,
    },
  },
};

export interface FindEmployeesParams {
  companyId: string;
  search?: string;
  status?: EmployeeStatus;
  page: number;
  limit: number;
}

export const employeeRepository = {
  async findMany(params: FindEmployeesParams) {
    const { companyId, search, status, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.EmployeeWhereInput = {
      companyId,
      ...(status && { status }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { user: { loginId: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: employeeInclude,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.employee.count({ where }),
    ]);

    return { employees, total };
  },

  async findByIdAndCompany(id: string, companyId: string) {
    return prisma.employee.findFirst({
      where: { id, companyId },
      include: {
        ...employeeInclude,
        privateInfo: true,
        skills: {
          include: { skill: true },
        },
        documents: true,
      },
    });
  },

  async findByUserIdAndCompany(userId: string, companyId: string) {
    return prisma.employee.findFirst({
      where: { userId, companyId },
      include: {
        ...employeeInclude,
        privateInfo: true,
        skills: {
          include: { skill: true },
        },
        documents: true,
      },
    });
  },

  async findByUserId(userId: string) {
    return prisma.employee.findUnique({
      where: { userId },
      include: {
        ...employeeInclude,
        privateInfo: true,
        skills: {
          include: { skill: true },
        },
        documents: true,
      },
    });
  },

  async findByEmployeeIdAndCompany(employeeId: string, companyId: string) {
    return prisma.employee.findFirst({
      where: { employeeId, companyId },
    });
  },

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async getCompanyPrefix(companyId: string) {
    return prisma.company.findUnique({
      where: { id: companyId },
      select: { prefix: true, name: true },
    });
  },

  async create(data: {
    companyId: string;
    userId: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    phone?: string;
    department: string;
    designation: string;
    dateOfJoining: Date;
    employmentType?: string;
  }) {
    return prisma.employee.create({
      data: {
        companyId: data.companyId,
        userId: data.userId,
        employeeId: data.employeeId,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        department: data.department,
        designation: data.designation,
        dateOfJoining: data.dateOfJoining,
        employmentType: data.employmentType || 'FULL_TIME',
        status: 'ACTIVE',
      },
      include: employeeInclude,
    });
  },

  async createUser(data: {
    email: string;
    passwordHash: string;
    loginId: string;
    companyId: string;
    role: 'EMPLOYEE';
    mustChangePassword: boolean;
  }) {
    return prisma.user.create({ data });
  },

  async update(id: string, companyId: string, data: Prisma.EmployeeUpdateInput) {
    return prisma.employee.updateMany({
      where: { id, companyId },
      data,
    });
  },

  async updateStatus(id: string, companyId: string, status: EmployeeStatus) {
    return prisma.employee.updateMany({
      where: { id, companyId },
      data: { status },
    });
  },

  async countByCompany(companyId: string) {
    return prisma.employee.count({ where: { companyId } });
  },

  async countActiveByCompany(companyId: string) {
    return prisma.employee.count({
      where: { companyId, status: 'ACTIVE' },
    });
  },
};
