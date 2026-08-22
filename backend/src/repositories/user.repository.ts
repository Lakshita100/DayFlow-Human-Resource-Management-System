import { prisma } from '../config/database.js';

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findByLoginId(loginId: string) {
    return prisma.user.findUnique({ where: { loginId } });
  },

  async findByEmailWithEmployee(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { employee: true, company: true },
    });
  },

  async findByLoginIdWithEmployee(loginId: string) {
    return prisma.user.findUnique({
      where: { loginId },
      include: { employee: true, company: true },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async findByIdWithEmployee(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { employee: true, company: true },
    });
  },

  async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  },

  async clearMustChangePassword(id: string) {
    return prisma.user.update({
      where: { id },
      data: { mustChangePassword: false },
    });
  },

  async create(data: {
    loginId?: string;
    email: string;
    passwordHash: string;
    role?: 'ADMIN' | 'HR' | 'EMPLOYEE';
    companyId?: string;
    mustChangePassword?: boolean;
  }) {
    return prisma.user.create({ data });
  },

  async findByIdWithCompany(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { company: true },
    });
  },
};
