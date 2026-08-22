import { useQuery } from '@tanstack/react-query';
import * as calendarApi from '@/services/calendar.service';
import { mockCalendarEvents } from '@/data/mockCalendar';
import type { CalendarEvent } from '@/types/calendar.types';

export function useCalendarEvents(year?: number, month?: number) {
  return useQuery<CalendarEvent[]>({
    queryKey: ['calendar', 'events', year, month],
    queryFn: async () => {
      const liveEvents = await calendarApi.getCalendarEvents(year, month);
      return liveEvents.map((evt) => ({
        id: evt.id,
        title: evt.title,
        date: evt.date,
        type: (evt.type === 'attendance' ? 'attendance' : evt.type === 'leave' ? 'leave' : 'event') as any,
        category: evt.type,
        status: (evt.status === 'APPROVED' || evt.status === 'PRESENT' ? 'confirmed' : 'tentative') as any,
        startTime: '09:00',
        endTime: '18:00',
        description: evt.details || '',
      }));
    },
  });
}

export function useCalendarEventsMock(year?: number, month?: number): CalendarEvent[] {
  const query = useCalendarEvents(year, month);
  return query.data ?? mockCalendarEvents.filter((e) => {
    const d = new Date(e.date);
    if (year && d.getFullYear() !== year) return false;
    if (month !== undefined && d.getMonth() !== month) return false;
    return true;
  });
}
