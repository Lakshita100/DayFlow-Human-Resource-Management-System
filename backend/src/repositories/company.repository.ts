import { prisma } from '../config/database.js';

export const companyRepository = {
  async findById(id: string) {
    return prisma.company.findUnique({ where: { id } });
  },

  async findByName(name: string) {
    return prisma.company.findUnique({ where: { name } });
  },

  async create(data: { name: string; prefix: string; logoUrl?: string }) {
    return prisma.company.create({ data });
  },

  async update(id: string, data: { name?: string; logoUrl?: string }) {
    return prisma.company.update({ where: { id }, data });
  },

  async findFirst() {
    return prisma.company.findFirst();
  },
};
