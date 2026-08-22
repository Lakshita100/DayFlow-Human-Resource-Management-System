import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as leaveApi from '@/services/leave.service';
import {
  mockLeaveBalance,
  getMockLeavePage,
  getMockAllLeaveRequests,
  mockUpcomingLeaves,
} from '@/data/mockLeave';
import type {
  LeaveQueryParams,
  LeavePaginatedResponse,
  LeaveBalanceSummary,
  UpcomingLeave,
  LeaveRequest,
} from '@/types/leave.types';
import type { CreateLeavePayloadJSON } from '@/services/leave.service';

export function useLeaveBalance() {
  return useQuery<LeaveBalanceSummary>({
    queryKey: ['leave', 'balance'],
    queryFn: () => leaveApi.getLeaveBalance(),
  });
}

export function useLeaveBalanceMock(): LeaveBalanceSummary {
  const query = useLeaveBalance();
  return query.data ?? mockLeaveBalance;
}

export function useLeaveRequests(params?: LeaveQueryParams) {
  return useQuery<LeavePaginatedResponse>({
    queryKey: ['leave', 'requests', params],
    queryFn: () => leaveApi.getLeaveRequests(params),
  });
}

export function useLeaveRequestsMock(params: LeaveQueryParams): LeavePaginatedResponse {
  const query = useLeaveRequests(params);
  return query.data ?? getMockLeavePage(params);
}

export function useAllLeaveRequestsMock(): LeaveRequest[] {
  return getMockAllLeaveRequests();
}

export function useUpcomingLeaves() {
  return useQuery<UpcomingLeave[]>({
    queryKey: ['leave', 'upcoming'],
    queryFn: async () => [],
  });
}

export function useUpcomingLeavesMock(): UpcomingLeave[] {
  return mockUpcomingLeaves;
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeavePayloadJSON) => leaveApi.createLeaveRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave'] });
    },
  });
}

export function useApproveLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leaveApi.approveLeaveRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave'] });
    },
  });
}

export function useRejectLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leaveApi.rejectLeaveRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave'] });
    },
  });
}
