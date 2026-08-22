import { useState, useMemo, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import DatePicker from '@/components/ui/DatePicker';
import { mockAttendanceRecords } from '@/data/adminAttendanceMock';
import AttendanceRow from './AttendanceRow';
import AttendanceCard from './AttendanceCard';
import AttendanceSkeleton from './AttendanceSkeleton';
import AttendanceEmpty from './AttendanceEmpty';
import AttendanceError from './AttendanceError';

function getDayName(date: Date): string {
  return date.toLocaleDateString('en-IN', { weekday: 'long' });
}

function getFullDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AdminAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const filtered = useMemo(() => {
    return mockAttendanceRecords.filter((r) => {
      return (
        !search ||
        r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        r.department.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search]);

  const recordCount = filtered.length;

  const handlePrev = useCallback(() => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
    setLoading(true);
    setTimeout(() => setLoading(false), 400);
  }, []);

  const handleNext = useCallback(() => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
    setLoading(true);
    setTimeout(() => setLoading(false), 400);
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
    setLoading(true);
    setTimeout(() => setLoading(false), 400);
  }, []);

  const handleRetry = useCallback(() => {
    setError(false);
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  }, []);

  return (
    <PageContainer>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
            <p className="mt-0.5 text-sm text-gray-500">View daily attendance and working hours for all employees.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous day"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next day"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <ChevronRight size={16} />
            </button>

            <DatePicker value={selectedDate} onChange={handleDateChange} />

            <div className="hidden items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 sm:flex">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">{getDayName(selectedDate)}</span>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{getFullDate(selectedDate)}</h2>
            <p className="text-xs text-gray-500">{getDayName(selectedDate)}</p>
          </div>
          {!loading && !error && (
            <span className="text-xs text-gray-400">{recordCount} employee records</span>
          )}
        </div>

        {error && <AttendanceError onRetry={handleRetry} />}

        {loading && !error && <AttendanceSkeleton />}

        {!loading && !error && (
          <>
            <div className="hidden rounded-xl border border-gray-100 bg-white shadow-card md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-3 text-xs font-medium text-gray-500">Employee</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500">Check In</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500">Check Out</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500">Work Hours</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500">Extra Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((record) => (
                      <AttendanceRow key={record.id} record={record} />
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <AttendanceEmpty hasSearch={!!search} />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3 md:hidden">
              {filtered.map((record) => (
                <AttendanceCard key={record.id} record={record} />
              ))}
              {filtered.length === 0 && <AttendanceEmpty hasSearch={!!search} />}
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
