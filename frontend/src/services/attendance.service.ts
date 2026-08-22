import apiClient from '@/api/client';
import type { ApiResponse } from '@/types/common.types';
import type {
  AttendanceRecord,
  TodayAttendance,
  MonthlyOverview,
  AttendanceTrend,
  AttendancePaginatedResponse,
  AttendanceQueryParams,
} from '@/types/attendance.types';

export async function getTodayAttendance(): Promise<TodayAttendance> {
  const res = await apiClient.get<ApiResponse<TodayAttendance>>('/attendance/today');
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch today attendance');
  return res.data.data;
}

export async function getMonthlyOverview(month: number, year: number): Promise<MonthlyOverview> {
  const res = await apiClient.get<ApiResponse<MonthlyOverview>>('/attendance/monthly-overview', {
    params: { month, year },
  });
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch monthly overview');
  return res.data.data;
}

export async function getAttendanceTrend(): Promise<AttendanceTrend> {
  const res = await apiClient.get<ApiResponse<AttendanceTrend>>('/attendance/trend');
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch attendance trend');
  return res.data.data;
}

export async function getAttendanceRecords(
  params: AttendanceQueryParams,
): Promise<AttendancePaginatedResponse> {
  const res = await apiClient.get<ApiResponse<AttendancePaginatedResponse>>('/attendance', {
    params,
  });
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch attendance records');
  return res.data.data;
}

export async function getAttendanceRecord(id: string): Promise<AttendanceRecord> {
  const res = await apiClient.get<ApiResponse<AttendanceRecord>>(`/attendance/${id}`);
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch attendance record');
  return res.data.data;
}

export async function checkIn(): Promise<TodayAttendance> {
  const res = await apiClient.post<ApiResponse<TodayAttendance>>('/attendance/check-in');
  if (!res.data.data) throw new Error(res.data.message || 'Failed to check in');
  return res.data.data;
}

export async function checkOut(): Promise<TodayAttendance> {
  const res = await apiClient.post<ApiResponse<TodayAttendance>>('/attendance/check-out');
  if (!res.data.data) throw new Error(res.data.message || 'Failed to check out');
  return res.data.data;
}
