import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-development-only-12345';

export function generateTestToken(payload: {
  userId: string;
  email: string;
  role: Role;
}): string {
  return jwt.sign(
    { userId: payload.userId, email: payload.email, role: payload.role },
    JWT_SECRET,
    { expiresIn: 86400 }
  );
}

export function generateExpiredToken(payload: {
  userId: string;
  email: string;
  role: Role;
}): string {
  return jwt.sign(
    { userId: payload.userId, email: payload.email, role: payload.role },
    JWT_SECRET,
    { expiresIn: -1 }
  );
}

export const TEST_USERS = {
  admin: {
    id: 'admin-user-id-001',
    email: 'admin@dayflow.com',
    role: Role.ADMIN,
  },
  hr: {
    id: 'hr-user-id-001',
    email: 'hr@dayflow.com',
    role: Role.HR,
  },
  employee1: {
    id: 'employee-user-id-001',
    email: 'john.doe@dayflow.com',
    role: Role.EMPLOYEE,
  },
  employee2: {
    id: 'employee-user-id-002',
    email: 'jane.smith@dayflow.com',
    role: Role.EMPLOYEE,
  },
};
