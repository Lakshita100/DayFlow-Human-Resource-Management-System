import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DocumentRepository {
  async findByEmployee(employeeId: string) {
    return prisma.employeeDocument.findMany({
      where: { employeeId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.employeeDocument.findUnique({
      where: { id },
    });
  }

  async create(employeeId: string, name: string, type: string, fileUrl: string) {
    return prisma.employeeDocument.create({
      data: {
        employeeId,
        name,
        type,
        fileUrl,
      },
    });
  }

  async delete(id: string) {
    return prisma.employeeDocument.delete({
      where: { id },
    });
  }
}

export const documentRepository = new DocumentRepository();
