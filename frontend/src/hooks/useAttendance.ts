import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as attendanceApi from '@/services/attendance.service';
import {
  getMockAttendancePage,
  mockTodayAttendance,
  mockMonthlyOverview,
  mockAttendanceTrend,
  simulateMockCheckIn,
  simulateMockCheckOut,
} from '@/data/mockAttendance';
import type {
  AttendanceQueryParams,
  AttendancePaginatedResponse,
  TodayAttendance,
  MonthlyOverview,
  AttendanceTrend,
} from '@/types/attendance.types';

// Flip to false once the backend attendance endpoints are available.
const USE_MOCK = true;

const TODAY_KEY = ['attendance', 'today'] as const;
const RELATED_KEYS = [
  ['attendance', 'records'],
  ['attendance', 'monthly-overview'],
  ['attendance', 'trend'],
] as const;

export function useTodayAttendance() {
  return useQuery<TodayAttendance>({
    queryKey: TODAY_KEY,
    queryFn: async () => {
      if (USE_MOCK) return mockTodayAttendance;
      return attendanceApi.getTodayAttendance();
    },
  });
}

export function useMonthlyOverview(month: number, year: number) {
  return useQuery<MonthlyOverview>({
    queryKey: [...RELATED_KEYS[1], month, year],
    queryFn: async () => {
      if (USE_MOCK) return mockMonthlyOverview;
      return attendanceApi.getMonthlyOverview(month, year);
    },
  });
}

export function useAttendanceTrend() {
  return useQuery<AttendanceTrend>({
    queryKey: RELATED_KEYS[2],
    queryFn: async () => {
      if (USE_MOCK) return mockAttendanceTrend;
      return attendanceApi.getAttendanceTrend();
    },
  });
}

export function useAttendanceRecords(params: AttendanceQueryParams) {
  return useQuery<AttendancePaginatedResponse>({
    queryKey: [...RELATED_KEYS[0], params],
    queryFn: async () => {
      if (USE_MOCK) {
        return getMockAttendancePage(
          params.page,
          params.limit,
          params.month,
          params.year,
          params.status
        );
      }
      return attendanceApi.getAttendanceRecords(params);
    },
    placeholderData: (previous) => previous,
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<TodayAttendance> => {
      if (USE_MOCK) {
        const current = queryClient.getQueryData<TodayAttendance>(TODAY_KEY);
        return simulateMockCheckIn(current);
      }
      return attendanceApi.checkIn();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(TODAY_KEY, data);
      RELATED_KEYS.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<TodayAttendance> => {
      if (USE_MOCK) {
        const current = queryClient.getQueryData<TodayAttendance>(TODAY_KEY);
        return simulateMockCheckOut(current);
      }
      return attendanceApi.checkOut();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(TODAY_KEY, data);
      RELATED_KEYS.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    },
  });
}
