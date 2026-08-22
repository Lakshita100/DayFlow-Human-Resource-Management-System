import { documentRepository } from '../repositories/document.repository.js';
import { employeeRepository } from '../repositories/employee.repository.js';

export class DocumentService {
  async getDocuments(userId: string) {
    const employee = await employeeRepository.findByUserId(userId);
    if (!employee) {
      throw new Error('Employee record not found');
    }

    const docs = await documentRepository.findByEmployee(employee.id);
    return docs.map((d) => ({
      id: d.id,
      name: d.name,
      category: d.type || 'other',
      uploadedAt: d.uploadedAt.toISOString().split('T')[0],
      fileUrl: d.fileUrl,
      size: '1.2 MB',
      status: 'verified',
    }));
  }

  async uploadDocument(userId: string, payload: { name: string; type?: string; fileUrl?: string }) {
    const employee = await employeeRepository.findByUserId(userId);
    if (!employee) {
      throw new Error('Employee record not found');
    }

    const doc = await documentRepository.create(
      employee.id,
      payload.name,
      payload.type || 'other',
      payload.fileUrl || '/uploads/documents/sample.pdf'
    );

    return {
      id: doc.id,
      name: doc.name,
      category: doc.type,
      uploadedAt: doc.uploadedAt.toISOString().split('T')[0],
      fileUrl: doc.fileUrl,
      size: '1.2 MB',
      status: 'verified',
    };
  }

  async deleteDocument(id: string, userId: string) {
    const doc = await documentRepository.findById(id);
    if (!doc) {
      throw new Error('Document not found');
    }

    const employee = await employeeRepository.findByUserId(userId);
    if (!employee || doc.employeeId !== employee.id) {
      throw new Error('Unauthorized to delete this document');
    }

    return documentRepository.delete(id);
  }
}

export const documentService = new DocumentService();
