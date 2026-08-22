import { prisma } from '../config/database.js';
import { createError } from '../middleware/error.middleware.js';
import path from 'path';
import fs from 'fs';
import { UPLOADS_DIR } from '../config/upload.js';

function formatPublicProfile(employee: any) {
  return {
    id: employee.id,
    employeeId: employee.employeeId,
    firstName: employee.firstName,
    lastName: employee.lastName,
    name: `${employee.firstName} ${employee.lastName}`,
    email: employee.user?.email,
    phone: employee.phone,
    department: employee.department,
    designation: employee.designation,
    dateOfJoining: employee.dateOfJoining?.toISOString(),
    employmentType: employee.employmentType,
    status: employee.status,
    profilePicture: employee.profilePicture ?? null,
  };
}

function formatPrivateInfo(info: any) {
  if (!info) return null;
  return {
    dateOfBirth: info.dateOfBirth?.toISOString(),
    gender: info.gender,
    address: info.address,
    city: info.city,
    state: info.state,
    zipCode: info.zipCode,
    country: info.country,
    emergencyContactName: info.emergencyContactName,
    emergencyContactPhone: info.emergencyContactPhone,
  };
}

function formatSkills(skills: any[]) {
  return skills.map((es) => ({
    id: es.id,
    skillId: es.skillId,
    skillName: es.skill?.name,
    skillCategory: es.skill?.category,
    proficiency: es.proficiency,
  }));
}

function formatDocuments(docs: any[]) {
  return docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    type: doc.type,
    fileUrl: doc.fileUrl,
    uploadedAt: doc.uploadedAt?.toISOString(),
  }));
}

class ProfileService {
  async getProfile(employeeId: string, companyId: string, includePrivate: boolean) {
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, companyId },
      include: {
        user: { select: { email: true } },
        privateInfo: includePrivate,
        skills: { include: { skill: true } },
        documents: true,
      },
    });

    if (!employee) {
      throw createError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
    }

    return {
      public: formatPublicProfile(employee),
      private: includePrivate ? formatPrivateInfo(employee.privateInfo) : undefined,
      skills: formatSkills(employee.skills),
      documents: formatDocuments(employee.documents),
    };
  }

  async getMyProfile(userId: string) {
    const employee = await prisma.employee.findUnique({
      where: { userId },
      include: {
        user: { select: { email: true } },
        privateInfo: true,
        skills: { include: { skill: true } },
        documents: true,
      },
    });

    if (!employee) {
      throw createError('Employee profile not found', 404, 'EMPLOYEE_NOT_FOUND');
    }

    return {
      public: formatPublicProfile(employee),
      private: formatPrivateInfo(employee.privateInfo),
      skills: formatSkills(employee.skills),
      documents: formatDocuments(employee.documents),
    };
  }

  async updatePublicProfile(employeeId: string, companyId: string, data: any) {
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });

    if (!employee) {
      throw createError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
    }

    const updated = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        department: data.department,
        designation: data.designation,
        dateOfJoining: data.dateOfJoining ? new Date(data.dateOfJoining) : undefined,
        employmentType: data.employmentType,
      },
      include: { user: { select: { email: true } } },
    });

    return formatPublicProfile(updated);
  }

  async updatePrivateProfile(employeeId: string, companyId: string, data: any, isAdmin: boolean) {
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, companyId },
      include: { privateInfo: true },
    });

    if (!employee) {
      throw createError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
    }

    const updateData: any = {};
    if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.gender !== undefined) updateData.gender = data.gender || null;
    if (data.address !== undefined) updateData.address = data.address || null;
    if (data.city !== undefined) updateData.city = data.city || null;
    if (data.state !== undefined) updateData.state = data.state || null;
    if (data.zipCode !== undefined) updateData.zipCode = data.zipCode || null;
    if (data.country !== undefined) updateData.country = data.country || null;

    if (isAdmin) {
      if (data.emergencyContactName !== undefined) updateData.emergencyContactName = data.emergencyContactName || null;
      if (data.emergencyContactPhone !== undefined) updateData.emergencyContactPhone = data.emergencyContactPhone || null;
    }

    const privateInfo = await prisma.employeePrivateInfo.upsert({
      where: { employeeId },
      update: updateData,
      create: {
        employeeId,
        ...updateData,
      },
    });

    return {
      dateOfBirth: privateInfo.dateOfBirth?.toISOString(),
      gender: privateInfo.gender,
      address: privateInfo.address,
      city: privateInfo.city,
      state: privateInfo.state,
      zipCode: privateInfo.zipCode,
      country: privateInfo.country,
      emergencyContactName: isAdmin ? privateInfo.emergencyContactName : undefined,
      emergencyContactPhone: isAdmin ? privateInfo.emergencyContactPhone : undefined,
    };
  }

  async updateMyPrivateProfile(userId: string, data: any) {
    const employee = await prisma.employee.findUnique({
      where: { userId },
      include: { privateInfo: true },
    });

    if (!employee) {
      throw createError('Employee profile not found', 404, 'EMPLOYEE_NOT_FOUND');
    }

    const updateData: any = {};
    if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.gender !== undefined) updateData.gender = data.gender || null;
    if (data.address !== undefined) updateData.address = data.address || null;
    if (data.city !== undefined) updateData.city = data.city || null;
    if (data.state !== undefined) updateData.state = data.state || null;
    if (data.zipCode !== undefined) updateData.zipCode = data.zipCode || null;
    if (data.country !== undefined) updateData.country = data.country || null;
    if (data.emergencyContactName !== undefined) updateData.emergencyContactName = data.emergencyContactName || null;
    if (data.emergencyContactPhone !== undefined) updateData.emergencyContactPhone = data.emergencyContactPhone || null;

    const privateInfo = await prisma.employeePrivateInfo.upsert({
      where: { employeeId: employee.id },
      update: updateData,
      create: {
        employeeId: employee.id,
        ...updateData,
      },
    });

    return {
      dateOfBirth: privateInfo.dateOfBirth?.toISOString(),
      gender: privateInfo.gender,
      address: privateInfo.address,
      city: privateInfo.city,
      state: privateInfo.state,
      zipCode: privateInfo.zipCode,
      country: privateInfo.country,
      emergencyContactName: privateInfo.emergencyContactName,
      emergencyContactPhone: privateInfo.emergencyContactPhone,
    };
  }

  async updateProfilePicture(employeeId: string, companyId: string, filePath: string) {
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });
    if (!employee) {
      throw createError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
    }

    const oldPicture = employee.profilePicture;
    const updated = await prisma.employee.update({
      where: { id: employeeId },
      data: { profilePicture: filePath },
    });

    if (oldPicture) this.unlinkSafely(oldPicture);

    return { profilePicture: updated.profilePicture };
  }

  async deleteProfilePicture(employeeId: string, companyId: string) {
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });
    if (!employee) {
      throw createError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
    }

    const updated = await prisma.employee.update({
      where: { id: employeeId },
      data: { profilePicture: null },
    });

    if (employee.profilePicture) this.unlinkSafely(employee.profilePicture);

    return { profilePicture: updated.profilePicture };
  }

  private unlinkSafely(urlPath: string): void {
    try {
      const safeName = path.basename(urlPath);
      const fullPath = path.join(UPLOADS_DIR, 'logos', safeName);
      if (fullPath.startsWith(path.join(UPLOADS_DIR, 'logos')) && fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch {
      // best-effort cleanup; DB reference already updated
    }
  }
}
export const profileService = new ProfileService();