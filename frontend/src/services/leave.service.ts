import apiClient from '@/api/client';
import type { ApiResponse } from '@/types/common.types';
import type {
  LeaveBalanceSummary,
  LeaveRequest,
  LeavePaginatedResponse,
  LeaveQueryParams,
} from '@/types/leave.types';

export interface CreateLeavePayloadJSON {
  leaveType: 'PAID' | 'SICK' | 'UNPAID';
  startDate: string;
  endDate: string;
  reason?: string;
}

export async function getLeaveBalance(): Promise<LeaveBalanceSummary> {
  const res = await apiClient.get<ApiResponse<LeaveBalanceSummary>>('/leave/balance');
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch leave balance');
  return res.data.data;
}

export async function getLeaveRequests(params?: LeaveQueryParams): Promise<LeavePaginatedResponse> {
  const res = await apiClient.get<ApiResponse<LeavePaginatedResponse>>('/leave/requests', { params });
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch leave requests');
  return res.data.data;
}

export async function createLeaveRequest(payload: CreateLeavePayloadJSON): Promise<LeaveRequest> {
  const res = await apiClient.post<ApiResponse<LeaveRequest>>('/leave/requests', payload);
  if (!res.data.data) throw new Error(res.data.message || 'Failed to create leave request');
  return res.data.data;
}

export async function approveLeaveRequest(id: string): Promise<any> {
  const res = await apiClient.put<ApiResponse<any>>(`/leave/requests/${id}/approve`);
  return res.data;
}

export async function rejectLeaveRequest(id: string): Promise<any> {
  const res = await apiClient.put<ApiResponse<any>>(`/leave/requests/${id}/reject`);
  return res.data;
}
