import { Request } from 'express';
import { Role } from '@prisma/client';

export interface AuthUser {
  id: string;
  loginId: string;
  email: string;
  role: Role;
  companyId: string | null;
  mustChangePassword: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
