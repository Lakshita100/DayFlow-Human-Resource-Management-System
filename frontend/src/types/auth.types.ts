export type Role = 'ADMIN' | 'HR' | 'EMPLOYEE';

export interface Company {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface User {
  id: string;
  loginId: string;
  email: string;
  name: string;
  role: Role;
  employeeId: string;
  companyId: string | null;
  company: Company | null;
  mustChangePassword: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  loginId: string;
  password: string;
}

export interface SignupPayload {
  companyName: string;
  adminName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  logoUrl?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ValidationError {
  field: string;
  fieldLabel: string;
  message: string;
  code: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  errors?: ValidationError[];
}
