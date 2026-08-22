import { prisma } from '../config/database.js';
import { createError } from '../middleware/error.middleware.js';

const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

class DocumentService {
  async listDocuments(employeeId: string, companyId: string, query: { page: string; limit: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });
    if (!employee) {
      throw createError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
    }

    const [documents, total] = await Promise.all([
      prisma.employeeDocument.findMany({
        where: { employeeId },
        skip,
        take: limit,
        orderBy: { uploadedAt: 'desc' },
      }),
      prisma.employeeDocument.count({ where: { employeeId } }),
    ]);

    return {
      documents: documents.map((doc) => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        fileUrl: doc.fileUrl,
        uploadedAt: doc.uploadedAt?.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDocument(documentId: string, companyId: string) {
    const document = await prisma.employeeDocument.findUnique({
      where: { id: documentId },
      include: { employee: true },
    });

    if (!document) {
      throw createError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
    }

    if (document.employee.companyId !== companyId) {
      throw createError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
    }

    return {
      id: document.id,
      name: document.name,
      type: document.type,
      fileUrl: document.fileUrl,
      uploadedAt: document.uploadedAt?.toISOString(),
    };
  }

  async createDocument(employeeId: string, companyId: string, file: Express.Multer.File, data: { name: string; type: string }) {
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });
    if (!employee) {
      throw createError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
    }

    if (!ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
      throw createError('File type not allowed', 400, 'INVALID_FILE_TYPE');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw createError('File size exceeds 10MB limit', 400, 'FILE_TOO_LARGE');
    }

    const fileUrl = `/uploads/documents/${file.filename}`;

    const document = await prisma.employeeDocument.create({
      data: {
        employeeId,
        name: data.name,
        type: data.type,
        fileUrl,
      },
    });

    return {
      id: document.id,
      name: document.name,
      type: document.type,
      fileUrl: document.fileUrl,
      uploadedAt: document.uploadedAt?.toISOString(),
    };
  }

  async deleteDocument(documentId: string, companyId: string) {
    const document = await prisma.employeeDocument.findUnique({
      where: { id: documentId },
      include: { employee: true },
    });

    if (!document) {
      throw createError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
    }

    if (document.employee.companyId !== companyId) {
      throw createError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
    }

    await prisma.employeeDocument.delete({ where: { id: documentId } });
    return { success: true };
  }
}

export const documentService = new DocumentService();