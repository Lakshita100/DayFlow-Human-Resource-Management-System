import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-development-only-12345';

export function generateTestToken(payload: {
  userId: string;
  email: string;
  role: Role;
  loginId?: string;
  companyId?: string | null;
}): string {
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      loginId: payload.loginId || '',
      companyId: payload.companyId || null,
    },
    JWT_SECRET,
    { expiresIn: 86400 }
  );
}

export function generateExpiredToken(payload: {
  userId: string;
  email: string;
  role: Role;
  loginId?: string;
  companyId?: string | null;
}): string {
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      loginId: payload.loginId || '',
      companyId: payload.companyId || null,
    },
    JWT_SECRET,
    { expiresIn: -1 }
  );
}

export const TEST_USERS = {
  companyA: {
    admin: {
      id: 'admin-user-id-001',
      email: 'admin@dayflow.com',
      role: Role.ADMIN,
      loginId: 'DFADUN20240001',
      companyId: 'company-a-id',
    },
    hr: {
      id: 'hr-user-id-001',
      email: 'hr@dayflow.com',
      role: Role.HR,
      loginId: 'DFHRMA20240002',
      companyId: 'company-a-id',
    },
    employee1: {
      id: 'employee-user-id-001',
      email: 'john.doe@dayflow.com',
      role: Role.EMPLOYEE,
      loginId: 'DFJODO20240003',
      companyId: 'company-a-id',
    },
    employee2: {
      id: 'employee-user-id-002',
      email: 'jane.smith@dayflow.com',
      role: Role.EMPLOYEE,
      loginId: 'DFJASM20240004',
      companyId: 'company-a-id',
    },
  },
  companyB: {
    admin: {
      id: 'admin-user-id-002',
      email: 'admin@odooindia.com',
      role: Role.ADMIN,
      loginId: 'OIADUN20240001',
      companyId: 'company-b-id',
    },
    hr: {
      id: 'hr-user-id-002',
      email: 'hr@odooindia.com',
      role: Role.HR,
      loginId: 'OIHRMA20240002',
      companyId: 'company-b-id',
    },
    employee1: {
      id: 'employee-user-id-003',
      email: 'alice.johnson@odooindia.com',
      role: Role.EMPLOYEE,
      loginId: 'OIALJO20240003',
      companyId: 'company-b-id',
    },
  },
  // Backward-compatible aliases (Company A)
  admin: {
    id: 'admin-user-id-001',
    email: 'admin@dayflow.com',
    role: Role.ADMIN,
    loginId: 'DFADUN20240001',
    companyId: 'company-a-id',
  },
  hr: {
    id: 'hr-user-id-001',
    email: 'hr@dayflow.com',
    role: Role.HR,
    loginId: 'DFHRMA20240002',
    companyId: 'company-a-id',
  },
  employee1: {
    id: 'employee-user-id-001',
    email: 'john.doe@dayflow.com',
    role: Role.EMPLOYEE,
    loginId: 'DFJODO20240003',
    companyId: 'company-a-id',
  },
  employee2: {
    id: 'employee-user-id-002',
    email: 'jane.smith@dayflow.com',
    role: Role.EMPLOYEE,
    loginId: 'DFJASM20240004',
    companyId: 'company-a-id',
  },
};
