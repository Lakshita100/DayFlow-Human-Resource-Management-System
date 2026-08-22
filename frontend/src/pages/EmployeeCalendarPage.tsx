import { useState, useCallback, useMemo } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import CalendarToolbar from '@/components/calendar/CalendarToolbar';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import EventDetail from '@/components/calendar/EventDetail';
import { useCalendarEventsMock } from '@/hooks/useCalendar';
import type { CalendarEvent, CalendarViewMode } from '@/types/calendar.types';
import EmptyState from '@/components/ui/EmptyState';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function EmployeeCalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventOpen, setIsEventOpen] = useState(false);

  const events = useCalendarEventsMock(year, month);

  const handlePrev = useCallback(() => {
    setMonth((m) => {
      if (m === 0) { setYear((y) => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const handleNext = useCallback(() => {
    setMonth((m) => {
      if (m === 11) { setYear((y) => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  const handleToday = useCallback(() => {
    const d = new Date();
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }, []);

  const handleDateClick = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventOpen(true);
  }, []);

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter((e) => e.date === selectedDate);
  }, [events, selectedDate]);

  const formatSelectedDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  // List view grouped by date
  const groupedEvents = useMemo(() => {
    const groups: Record<string, CalendarEvent[]> = {};
    events.forEach((e) => {
      if (!groups[e.date]) groups[e.date] = [];
      groups[e.date]?.push(e);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [events]);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-sm text-gray-500">View your work schedule, leave and important dates.</p>
        </div>

        {/* Toolbar */}
        <CalendarToolbar
          year={year}
          month={month}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
        />

        {/* Content */}
        {viewMode === 'month' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <CalendarGrid
                year={year}
                month={month}
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
              />
            </div>

            {/* Sidebar: selected day or event legend */}
            <div className="space-y-4">
              {/* Event Legend */}
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-card">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">Legend</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Leave', color: 'bg-brand-500' },
                    { label: 'Holiday', color: 'bg-amber-500' },
                    { label: 'Attendance', color: 'bg-emerald-500' },
                    { label: 'Weekly Off', color: 'bg-gray-400' },
                    { label: 'Event', color: 'bg-blue-500' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span className="text-xs text-gray-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected day events */}
              {selectedDate && (
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-card">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">{formatSelectedDate(selectedDate)}</h3>
                  {selectedDateEvents.length === 0 ? (
                    <p className="text-xs text-gray-500">No events for this day.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDateEvents.map((evt) => (
                        <button
                          key={evt.id}
                          onClick={() => handleEventClick(evt)}
                          className="w-full rounded-lg border border-gray-100 p-2.5 text-left hover:bg-gray-50 transition-colors"
                        >
                          <p className="text-xs font-medium text-gray-900">{evt.title}</p>
                          {evt.startTime && (
                            <p className="text-[10px] text-gray-500">{evt.startTime}{evt.endTime ? ` - ${evt.endTime}` : ''}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'week' && (
          <div className="rounded-xl border border-gray-100 bg-white shadow-card overflow-hidden">
            <div className="grid grid-cols-7">
              {(() => {
                const startOfWeek = new Date(year, month, 1);
                const dayOfWeek = startOfWeek.getDay();
                startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
                const days = Array.from({ length: 7 }, (_, i) => {
                  const d = new Date(startOfWeek);
                  d.setDate(d.getDate() + i);
                  return d;
                });
                const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

                return days.map((d) => {
                  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                  const dayEvents = events.filter((e) => e.date === dateStr);
                  const isToday = dateStr === todayStr;
                  return (
                    <div key={dateStr} className={`border-r border-gray-50 p-2 min-h-[120px] ${isToday ? 'bg-brand-50/30' : ''}`}>
                      <div className={`mb-2 text-center text-xs font-medium ${isToday ? 'text-brand-600' : 'text-gray-500'}`}>
                        {d.toLocaleDateString('en-GB', { weekday: 'short' })}
                      </div>
                      <div className={`mb-2 text-center text-lg font-semibold ${isToday ? 'text-brand-600' : 'text-gray-900'}`}>
                        {d.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((evt) => (
                          <button
                            key={evt.id}
                            onClick={() => handleEventClick(evt)}
                            className="w-full rounded px-1 py-0.5 text-[10px] font-medium bg-brand-50 text-brand-700 text-left truncate"
                          >
                            {evt.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-4">
            {groupedEvents.length === 0 ? (
              <EmptyState
                icon={<CalendarIcon className="h-12 w-12" />}
                title="No events for this period"
                description="Your leave, attendance and workplace events will appear here."
              />
            ) : (
              groupedEvents.map(([date, evts]) => (
                <div key={date} className="rounded-xl border border-gray-100 bg-white shadow-card overflow-hidden">
                  <div className="border-b border-gray-100 bg-gray-50 px-4 py-2">
                    <h4 className="text-sm font-medium text-gray-700">{formatSelectedDate(date)}</h4>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {evts.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => handleEventClick(evt)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50/50 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">{evt.title}</p>
                          {evt.startTime && (
                            <p className="text-xs text-gray-500">{evt.startTime}{evt.endTime ? ` - ${evt.endTime}` : ''}</p>
                          )}
                        </div>
                        <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-700 capitalize">
                          {evt.type.replace('-', ' ')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Event Detail Drawer */}
      <EventDetail event={selectedEvent} isOpen={isEventOpen} onClose={() => { setIsEventOpen(false); setSelectedEvent(null); }} />
    </PageContainer>
  );
}
