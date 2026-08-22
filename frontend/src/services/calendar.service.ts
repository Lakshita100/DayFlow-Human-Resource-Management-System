import apiClient from '@/api/client';
import type { ApiResponse } from '@/types/common.types';

export interface CalendarEventDTO {
  id: string;
  title: string;
  date: string;
  type: 'attendance' | 'leave' | 'holiday';
  status: string;
  details?: string;
}

export async function getCalendarEvents(year?: number, month?: number): Promise<CalendarEventDTO[]> {
  const res = await apiClient.get<ApiResponse<CalendarEventDTO[]>>('/calendar/events', {
    params: { year, month },
  });
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch calendar events');
  return res.data.data;
}
