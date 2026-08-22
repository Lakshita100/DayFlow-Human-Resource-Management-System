import { prisma } from '../config/database.js';

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async findByIdWithEmployee(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { employee: true },
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
};
