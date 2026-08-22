export type Role = 'ADMIN' | 'HR' | 'EMPLOYEE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  employeeId: string;
  mustChangePassword: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  companyName: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
