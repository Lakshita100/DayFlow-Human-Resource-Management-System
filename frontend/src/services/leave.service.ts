import apiClient from '@/api/client';
import type { ApiResponse } from '@/types/common.types';
import type {
  LeaveBalanceSummary,
  LeaveBalance,
  LeaveType,
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
  const res = await apiClient.get<ApiResponse<any>>('/leave/balance');
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch leave balance');

  const raw = res.data.data;
  const rawList: any[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.balances)
    ? raw.balances
    : Array.isArray(raw?.allocations)
    ? raw.allocations
    : [];

  const COLOR_MAP: Record<string, string> = {
    paid: '#7c3aed',
    sick: '#f59e0b',
    unpaid: '#6b7280',
  };

  const balances: LeaveBalance[] = rawList.map((item: any) => {
    const typeLower = (item.type || 'paid').toString().toLowerCase() as LeaveType;
    return {
      type: typeLower,
      label: item.label || `${typeLower.charAt(0).toUpperCase() + typeLower.slice(1)} Leave`,
      total: item.total ?? 0,
      used: item.used ?? 0,
      pending: item.pending ?? 0,
      available: item.available ?? Math.max(0, (item.total ?? 0) - (item.used ?? 0)),
      color: COLOR_MAP[typeLower] || item.color || '#3b82f6',
    };
  });

  const totalAvailable = typeof raw?.totalAvailable === 'number'
    ? raw.totalAvailable
    : balances.reduce((sum, b) => sum + b.available, 0);

  return {
    totalAvailable,
    balances,
  };
}

export async function getLeaveRequests(params?: LeaveQueryParams): Promise<LeavePaginatedResponse> {
  const res = await apiClient.get<ApiResponse<any>>('/leave/requests', { params });
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch leave requests');

  const raw = res.data.data;
  const requestsList = Array.isArray(raw) ? raw : (raw.requests || raw.items || []);

  const requests: LeaveRequest[] = requestsList.map((item: any) => ({
    id: item.id,
    leaveType: (item.type || item.leaveType || 'paid').toString().toLowerCase() as LeaveType,
    leaveTypeLabel: item.leaveTypeLabel || `${(item.type || 'paid').toString().toUpperCase()} Leave`,
    startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '',
    endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
    days: item.days || 1,
    appliedOn: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '',
    status: (item.status || 'pending').toString().toLowerCase() as any,
    remarks: item.reason || item.remarks || '',
    attachmentUrl: item.attachmentUrl || null,
    attachmentName: item.attachmentName || null,
    rejectionReason: item.rejectionReason || null,
    approvedBy: item.approvedBy || null,
    approvedOn: item.approvedOn || null,
  }));

  return {
    requests,
    total: raw.total ?? requests.length,
    page: raw.page ?? 1,
    limit: raw.limit ?? 10,
    totalPages: raw.totalPages ?? 1,
  };
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
