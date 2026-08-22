import type { AdminAttendanceRecord } from '@/types/admin-pages.types';

export function formatHours(hours: number | null): string {
  if (hours === null) return '\u2014';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
}

export function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function isWorking(record: AdminAttendanceRecord): boolean {
  return record.checkIn !== null && record.checkOut === null;
}
