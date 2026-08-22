import apiClient from '@/api/client';
import type { ApiResponse } from '@/types/common.types';
import type {
  LeaveBalanceSummary,
  LeaveRequest,
  UpcomingLeave,
  LeavePaginatedResponse,
  LeaveQueryParams,
  CreateLeavePayload,
} from '@/types/leave.types';

export async function getLeaveBalance(): Promise<LeaveBalanceSummary> {
  const res = await apiClient.get<ApiResponse<LeaveBalanceSummary>>('/leave/balance');
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch leave balance');
  return res.data.data;
}

export async function getLeaveRequests(params: LeaveQueryParams): Promise<LeavePaginatedResponse> {
  const res = await apiClient.get<ApiResponse<LeavePaginatedResponse>>('/leave/requests', { params });
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch leave requests');
  return res.data.data;
}

export async function getLeaveRequest(id: string): Promise<LeaveRequest> {
  const res = await apiClient.get<ApiResponse<LeaveRequest>>(`/leave/requests/${id}`);
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch leave request');
  return res.data.data;
}

export async function createLeaveRequest(payload: CreateLeavePayload): Promise<LeaveRequest> {
  const formData = new FormData();
  formData.append('leaveType', payload.leaveType);
  formData.append('startDate', payload.startDate);
  formData.append('endDate', payload.endDate);
  formData.append('remarks', payload.remarks);
  if (payload.attachment) {
    formData.append('attachment', payload.attachment);
  }
  const res = await apiClient.post<ApiResponse<LeaveRequest>>('/leave/requests', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (!res.data.data) throw new Error(res.data.message || 'Failed to create leave request');
  return res.data.data;
}

export async function cancelLeaveRequest(id: string): Promise<LeaveRequest> {
  const res = await apiClient.post<ApiResponse<LeaveRequest>>(`/leave/requests/${id}/cancel`);
  if (!res.data.data) throw new Error(res.data.message || 'Failed to cancel leave request');
  return res.data.data;
}

export async function getUpcomingLeaves(): Promise<UpcomingLeave[]> {
  const res = await apiClient.get<ApiResponse<UpcomingLeave[]>>('/leave/upcoming');
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch upcoming leaves');
  return res.data.data;
}
