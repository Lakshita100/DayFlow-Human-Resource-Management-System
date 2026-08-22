import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as attendanceApi from '@/services/attendance.service';
import { getMockAttendancePage, mockTodayAttendance, mockMonthlyOverview, mockAttendanceTrend } from '@/data/mockAttendance';
import type { AttendanceQueryParams, AttendancePaginatedResponse, TodayAttendance, MonthlyOverview, AttendanceTrend } from '@/types/attendance.types';

const USE_MOCK = true;

export function useTodayAttendance() {
  return useQuery<TodayAttendance>({
    queryKey: ['attendance', 'today'],
    queryFn: () => attendanceApi.getTodayAttendance(),
    enabled: !USE_MOCK,
  });
}

export function useTodayAttendanceMock(): TodayAttendance {
  return mockTodayAttendance;
}

export function useMonthlyOverview(month: number, year: number) {
  return useQuery<MonthlyOverview>({
    queryKey: ['attendance', 'monthly-overview', month, year],
    queryFn: () => attendanceApi.getMonthlyOverview(month, year),
    enabled: !USE_MOCK,
  });
}

export function useMonthlyOverviewMock(): MonthlyOverview {
  return mockMonthlyOverview;
}

export function useAttendanceTrend() {
  return useQuery<AttendanceTrend>({
    queryKey: ['attendance', 'trend'],
    queryFn: () => attendanceApi.getAttendanceTrend(),
    enabled: !USE_MOCK,
  });
}

export function useAttendanceTrendMock(): AttendanceTrend {
  return mockAttendanceTrend;
}

export function useAttendanceRecords(params: AttendanceQueryParams) {
  return useQuery<AttendancePaginatedResponse>({
    queryKey: ['attendance', 'records', params],
    queryFn: () => attendanceApi.getAttendanceRecords(params),
    enabled: !USE_MOCK,
  });
}

export function useAttendanceRecordsMock(params: AttendanceQueryParams) {
  return getMockAttendancePage(params.page, params.limit, params.month, params.year, params.status);
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => attendanceApi.checkIn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', 'today'] });
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => attendanceApi.checkOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', 'today'] });
    },
  });
}
