import apiClient from '@/api/client';
import type {
  AuthResponse,
  LoginPayload,
  SignupPayload,
  ChangePasswordPayload,
} from '@/types/auth.types';
import type { ApiResponse } from '@/types/common.types';

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload);
  if (!res.data.data) {
    throw new Error(res.data.message || 'Login failed');
  }
  return res.data.data;
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/signup', payload);
  if (!res.data.data) {
    throw new Error(res.data.message || 'Signup failed');
  }
  return res.data.data;
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<{ message: string }> {
  const res = await apiClient.post<ApiResponse<{ message: string }>>(
    '/auth/change-password',
    payload
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Password change failed');
  }
  return { message: res.data.message || 'Password updated successfully' };
}

export async function getProfile(): Promise<AuthResponse['user']> {
  const res = await apiClient.get<ApiResponse<AuthResponse['user']>>('/auth/me');
  if (!res.data.data) {
    throw new Error(res.data.message || 'Failed to fetch profile');
  }
  return res.data.data;
}
