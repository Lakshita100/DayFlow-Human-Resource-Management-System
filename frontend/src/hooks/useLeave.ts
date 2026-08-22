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
  CreateLeavePayload,
} from '@/types/leave.types';

const USE_MOCK = true;

export function useLeaveBalance() {
  return useQuery<LeaveBalanceSummary>({
    queryKey: ['leave', 'balance'],
    queryFn: () => leaveApi.getLeaveBalance(),
    enabled: !USE_MOCK,
  });
}

export function useLeaveBalanceMock(): LeaveBalanceSummary {
  return mockLeaveBalance;
}

export function useLeaveRequests(params: LeaveQueryParams) {
  return useQuery<LeavePaginatedResponse>({
    queryKey: ['leave', 'requests', params],
    queryFn: () => leaveApi.getLeaveRequests(params),
    enabled: !USE_MOCK,
  });
}

export function useLeaveRequestsMock(params: LeaveQueryParams): LeavePaginatedResponse {
  return getMockLeavePage(params);
}

export function useAllLeaveRequestsMock(): LeaveRequest[] {
  return getMockAllLeaveRequests();
}

export function useUpcomingLeaves() {
  return useQuery<UpcomingLeave[]>({
    queryKey: ['leave', 'upcoming'],
    queryFn: () => leaveApi.getUpcomingLeaves(),
    enabled: !USE_MOCK,
  });
}

export function useUpcomingLeavesMock(): UpcomingLeave[] {
  return mockUpcomingLeaves;
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeavePayload) => leaveApi.createLeaveRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave'] });
    },
  });
}

export function useCancelLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leaveApi.cancelLeaveRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave'] });
    },
  });
}
