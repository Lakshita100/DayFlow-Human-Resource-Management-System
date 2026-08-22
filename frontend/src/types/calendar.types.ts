export type CalendarEventType = 'leave' | 'holiday' | 'attendance' | 'weekly-off' | 'event';

export type CalendarViewMode = 'month' | 'week' | 'list';

export type CalendarFilter = 'all' | CalendarEventType;

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  description?: string;
  relatedId?: string;
  relatedRoute?: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}
