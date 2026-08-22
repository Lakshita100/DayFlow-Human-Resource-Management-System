import apiClient from '@/api/client';
import type { ApiResponse } from '@/types/common.types';
import type { CalendarEvent } from '@/types/calendar.types';

export async function getCalendarEvents(year: number, month: number): Promise<CalendarEvent[]> {
  const res = await apiClient.get<ApiResponse<CalendarEvent[]>>('/calendar/events', { params: { year, month } });
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch calendar events');
  return res.data.data;
}
