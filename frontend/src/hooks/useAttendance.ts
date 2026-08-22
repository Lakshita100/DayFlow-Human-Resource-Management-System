import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as attendanceApi from '@/services/attendance.service';
import { getMockAttendancePage, mockTodayAttendance, mockMonthlyOverview, mockAttendanceTrend } from '@/data/mockAttendance';
import type { AttendanceQueryParams, AttendancePaginatedResponse, TodayAttendance, MonthlyOverview, AttendanceTrend } from '@/types/attendance.types';

export function useTodayAttendance() {
  return useQuery<TodayAttendance>({
    queryKey: ['attendance', 'today'],
    queryFn: () => attendanceApi.getTodayAttendance(),
  });
}

export function useTodayAttendanceMock(): TodayAttendance {
  const query = useTodayAttendance();
  return query.data ?? mockTodayAttendance;
}

export function useMonthlyOverview(month: number, year: number) {
  return useQuery<MonthlyOverview>({
    queryKey: ['attendance', 'monthly-overview', month, year],
    queryFn: () => attendanceApi.getMonthlyOverview(month, year),
  });
}

export function useMonthlyOverviewMock(): MonthlyOverview {
  return mockMonthlyOverview;
}

export function useAttendanceTrend() {
  return useQuery<AttendanceTrend>({
    queryKey: ['attendance', 'trend'],
    queryFn: () => attendanceApi.getAttendanceTrend(),
  });
}

export function useAttendanceTrendMock(): AttendanceTrend {
  return mockAttendanceTrend;
}

export function useAttendanceRecords(params: AttendanceQueryParams) {
  return useQuery<AttendancePaginatedResponse>({
    queryKey: ['attendance', 'records', params],
    queryFn: () => attendanceApi.getAttendanceRecords(params),
  });
}

export function useAttendanceRecordsMock(params: AttendanceQueryParams): AttendancePaginatedResponse {
  const query = useAttendanceRecords(params);
  return query.data ?? getMockAttendancePage(params.page, params.limit, params.month, params.year, params.status);
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => attendanceApi.checkIn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['attendance', 'records'] });
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => attendanceApi.checkOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['attendance', 'records'] });
    },
  });
}
