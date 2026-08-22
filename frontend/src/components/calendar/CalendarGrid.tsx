import type { CalendarEvent, CalendarEventType } from '@/types/calendar.types';

interface CalendarGridProps {
  year: number;
  month: number;
  events: CalendarEvent[];
  onDateClick: (dateStr: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const eventTypeColors: Record<CalendarEventType, { bg: string; text: string; dot: string }> = {
  leave: { bg: 'bg-brand-50', text: 'text-brand-700', dot: 'bg-brand-500' },
  holiday: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  attendance: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'weekly-off': { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  event: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
};

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function CalendarGrid({ year, month, events, onDateClick, onEventClick }: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const prevMonthDays = getDaysInMonth(year, month - 1);
  const cells: { date: Date; dateStr: string; isCurrentMonth: boolean; isToday: boolean; events: CalendarEvent[] }[] = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    cells.push({ date: d, dateStr: ds, isCurrentMonth: false, isToday: ds === todayStr, events: events.filter((e) => e.date === ds) });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    cells.push({ date: d, dateStr: ds, isCurrentMonth: true, isToday: ds === todayStr, events: events.filter((e) => e.date === ds) });
  }

  // Next month leading days
  const remaining = 42 - cells.length;
  for (let day = 1; day <= remaining; day++) {
    const d = new Date(year, month + 1, day);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    cells.push({ date: d, dateStr: ds, isCurrentMonth: false, isToday: ds === todayStr, events: events.filter((e) => e.date === ds) });
  }

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-card overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {dayHeaders.map((d) => (
          <div key={d} className="py-2.5 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, idx) => (
          <div
            key={idx}
            onClick={() => onDateClick(cell.dateStr)}
            className={`min-h-[80px] border-b border-r border-gray-50 p-1.5 transition-colors hover:bg-gray-50/50 cursor-pointer ${
              !cell.isCurrentMonth ? 'bg-gray-50/30' : ''
            } ${cell.isToday ? 'bg-brand-50/30' : ''}`}
          >
            <div className={`mb-1 text-xs font-medium ${
              cell.isToday
                ? 'flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white'
                : cell.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
            }`}>
              {cell.date.getDate()}
            </div>
            <div className="space-y-0.5">
              {cell.events.slice(0, 2).map((evt) => {
                const colors = eventTypeColors[evt.type];
                return (
                  <button
                    key={evt.id}
                    onClick={(e) => { e.stopPropagation(); onEventClick(evt); }}
                    className={`flex w-full items-center gap-1 rounded px-1 py-0.5 text-[10px] font-medium leading-tight ${colors.bg} ${colors.text}`}
                  >
                    <span className={`h-1 w-1 flex-shrink-0 rounded-full ${colors.dot}`} />
                    <span className="truncate">{evt.title}</span>
                  </button>
                );
              })}
              {cell.events.length > 2 && (
                <span className="block px-1 text-[10px] text-gray-400">+{cell.events.length - 2} more</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
