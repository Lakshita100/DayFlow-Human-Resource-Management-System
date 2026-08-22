import { useQuery } from '@tanstack/react-query';
import * as calendarApi from '@/services/calendar.service';
import { getMockEventsForMonth } from '@/data/mockCalendar';
import type { CalendarEvent } from '@/types/calendar.types';

const USE_MOCK = true;

export function useCalendarEvents(year: number, month: number) {
  return useQuery<CalendarEvent[]>({
    queryKey: ['calendar', 'events', year, month],
    queryFn: () => calendarApi.getCalendarEvents(year, month),
    enabled: !USE_MOCK,
  });
}

export function useCalendarEventsMock(year: number, month: number): CalendarEvent[] {
  return getMockEventsForMonth(year, month);
}
