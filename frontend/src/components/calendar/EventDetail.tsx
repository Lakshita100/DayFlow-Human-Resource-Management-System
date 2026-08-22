import { X, Calendar, Clock, FileText } from 'lucide-react';
import type { CalendarEvent, CalendarEventType } from '@/types/calendar.types';

interface EventDetailProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const typeConfig: Record<CalendarEventType, { label: string; bg: string; text: string }> = {
  leave: { label: 'Leave', bg: 'bg-brand-50', text: 'text-brand-700' },
  holiday: { label: 'Holiday', bg: 'bg-amber-50', text: 'text-amber-700' },
  attendance: { label: 'Attendance', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'weekly-off': { label: 'Weekly Off', bg: 'bg-gray-100', text: 'text-gray-600' },
  event: { label: 'Event', bg: 'bg-blue-50', text: 'text-blue-700' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function EventDetail({ event, isOpen, onClose }: EventDetailProps) {
  if (!isOpen || !event) return null;

  const config = typeConfig[event.type] ?? typeConfig.event;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Event Details</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text}`}>
              {config.label}
            </span>
            <h3 className="mt-3 text-lg font-semibold text-gray-900">{event.title}</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(event.date)}</p>
              </div>
            </div>

            {event.startTime && (
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-sm font-medium text-gray-900">
                    {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}
                  </p>
                </div>
              </div>
            )}

            {event.status && (
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{event.status}</p>
                </div>
              </div>
            )}

            {event.description && (
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-sm text-gray-700">{event.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
