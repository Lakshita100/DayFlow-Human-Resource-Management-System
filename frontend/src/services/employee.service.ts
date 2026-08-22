import apiClient from '@/api/client';
import type { ApiResponse } from '@/types/common.types';

export interface EmployeeRecord {
  id: string;
  employeeId: string;
  userId: string;
  companyId: string | null;
  firstName: string;
  lastName: string;
  phone: string | null;
  department: string;
  designation: string;
  dateOfJoining: string;
  employmentType: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
    role: string;
    loginId: string;
  };
}

export interface EmployeeListPaginatedResponse {
  items: EmployeeRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EmployeeQueryParams {
  page?: number | string;
  limit?: number | string;
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CreateEmployeePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
}

export interface UpdateEmployeePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
  designation?: string;
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
}

export async function getEmployees(params?: EmployeeQueryParams): Promise<EmployeeListPaginatedResponse> {
  const res = await apiClient.get<ApiResponse<EmployeeListPaginatedResponse>>('/employees', {
    params,
  });
  if (!res.data.data) {
    throw new Error(res.data.message || 'Failed to fetch employees');
  }
  return res.data.data;
}

export async function getEmployeeById(id: string): Promise<EmployeeRecord> {
  const res = await apiClient.get<ApiResponse<EmployeeRecord>>(`/employees/${id}`);
  if (!res.data.data) {
    throw new Error(res.data.message || 'Failed to fetch employee');
  }
  return res.data.data;
}

export async function getCurrentEmployee(): Promise<EmployeeRecord> {
  const res = await apiClient.get<ApiResponse<EmployeeRecord>>('/employees/me');
  if (!res.data.data) {
    throw new Error(res.data.message || 'Failed to fetch current employee');
  }
  return res.data.data;
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<EmployeeRecord> {
  const res = await apiClient.post<ApiResponse<EmployeeRecord>>('/employees', payload);
  if (!res.data.data) {
    throw new Error(res.data.message || 'Failed to create employee');
  }
  return res.data.data;
}

export async function updateEmployee(id: string, payload: UpdateEmployeePayload): Promise<EmployeeRecord> {
  const res = await apiClient.patch<ApiResponse<EmployeeRecord>>(`/employees/${id}`, payload);
  if (!res.data.data) {
    throw new Error(res.data.message || 'Failed to update employee');
  }
  return res.data.data;
}

export async function updateEmployeeStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<EmployeeRecord> {
  const res = await apiClient.patch<ApiResponse<EmployeeRecord>>(`/employees/${id}/status`, { status });
  if (!res.data.data) {
    throw new Error(res.data.message || 'Failed to update employee status');
  }
  return res.data.data;
}

export async function getCompanyStats(): Promise<{ totalEmployees: number; activeEmployees: number; inactiveEmployees: number }> {
  const res = await apiClient.get<ApiResponse<{ totalEmployees: number; activeEmployees: number; inactiveEmployees: number }>>('/employees/stats');
  if (!res.data.data) {
    throw new Error(res.data.message || 'Failed to fetch company stats');
  }
  return res.data.data;
}
