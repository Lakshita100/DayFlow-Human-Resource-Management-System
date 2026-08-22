import apiClient from '@/api/client';
import type { ApiResponse } from '@/types/common.types';

export interface BackendEmployee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  department: string;
  designation: string;
  dateOfJoining: string;
  employmentType: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    loginId: string;
    email: string;
    role: string;
    isActive: boolean;
  };
  company?: {
    id: string;
    name: string;
    prefix: string;
  };
  avatarUrl?: string | null;
}

export interface EmployeePaginatedResponse {
  items: BackendEmployee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EmployeeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CreateEmployeePayload {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  phone?: string;
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
}

export interface UpdateEmployeePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
  designation?: string;
  employmentType?: string;
}

export async function getEmployees(params?: EmployeeQueryParams): Promise<EmployeePaginatedResponse> {
  const res = await apiClient.get<ApiResponse<EmployeePaginatedResponse>>('/employees', {
    params,
  });
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch employees');
  return res.data.data;
}

export async function getEmployeeById(id: string): Promise<BackendEmployee> {
  const res = await apiClient.get<ApiResponse<BackendEmployee>>(`/employees/${id}`);
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch employee');
  return res.data.data;
}

export async function getCurrentEmployee(): Promise<BackendEmployee> {
  const res = await apiClient.get<ApiResponse<BackendEmployee>>('/employees/me');
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch current employee');
  return res.data.data;
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<BackendEmployee> {
  const res = await apiClient.post<ApiResponse<BackendEmployee>>('/employees', payload);
  if (!res.data.data) throw new Error(res.data.message || 'Failed to create employee');
  return res.data.data;
}

export async function updateEmployee(id: string, payload: UpdateEmployeePayload): Promise<BackendEmployee> {
  const res = await apiClient.patch<ApiResponse<BackendEmployee>>(`/employees/${id}`, payload);
  if (!res.data.data) throw new Error(res.data.message || 'Failed to update employee');
  return res.data.data;
}

export async function updateEmployeeStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<BackendEmployee> {
  const res = await apiClient.patch<ApiResponse<BackendEmployee>>(`/employees/${id}/status`, { status });
  if (!res.data.data) throw new Error(res.data.message || 'Failed to update employee status');
  return res.data.data;
}

export async function getCompanyStats(): Promise<{ totalEmployees: number; activeEmployees: number; inactiveEmployees: number }> {
  const res = await apiClient.get<ApiResponse<{ totalEmployees: number; activeEmployees: number; inactiveEmployees: number }>>('/employees/stats');
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch company stats');
  return res.data.data;
}

export async function uploadEmployeeAvatar(id: string, file: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append('avatar', file);
  const res = await apiClient.post<ApiResponse<{ avatarUrl: string }>>(`/employees/${id}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (!res.data.data) throw new Error(res.data.message || 'Failed to upload avatar');
  return res.data.data;
}
