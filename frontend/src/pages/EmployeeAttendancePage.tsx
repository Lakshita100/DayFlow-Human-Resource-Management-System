import { useState, useCallback } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import AttendanceTabs from '@/components/attendance/AttendanceTabs';
import AttendanceSummary from '@/components/attendance/AttendanceSummary';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import AttendanceFilters from '@/components/attendance/AttendanceFilters';
import AttendanceDetails from '@/components/attendance/AttendanceDetails';
import MonthSelector from '@/components/attendance/MonthSelector';
import MonthlyOverview from '@/components/attendance/MonthlyOverview';
import AttendanceTrendChart from '@/components/attendance/AttendanceTrendChart';
import StatusLegend from '@/components/attendance/StatusLegend';
import { AttendanceSummarySkeleton, AttendanceTableSkeleton } from '@/components/attendance/AttendanceSkeleton';
import {
  useTodayAttendance,
  useMonthlyOverview,
  useAttendanceTrend,
  useAttendanceRecords,
  useCheckIn,
  useCheckOut,
} from '@/hooks/useAttendance';
import type { AttendanceRecord, AttendanceFilters as FiltersType } from '@/types/attendance.types';

const now = new Date();

export default function EmployeeAttendancePage() {
  const [activeTab, setActiveTab] = useState('my-attendance');
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FiltersType>({ status: 'all', dateFrom: null, dateTo: null });
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  const todayQuery = useTodayAttendance();
  const overviewQuery = useMonthlyOverview(month, year);
  const trendQuery = useAttendanceTrend();
  const recordsQuery = useAttendanceRecords({
    page,
    limit: 10,
    month,
    year,
    status: filters.status,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });

  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  const handleCheckIn = useCallback(() => {
    checkInMutation.mutate();
  }, [checkInMutation]);

  const handleCheckOut = useCallback(() => {
    checkOutMutation.mutate();
  }, [checkOutMutation]);

  const handleMonthChange = useCallback((m: number, y: number) => {
    setMonth(m);
    setYear(y);
    setPage(1);
  }, []);

  const handleFilterApply = useCallback((f: FiltersType) => {
    setFilters(f);
    setPage(1);
  }, []);

  const handleFilterClear = useCallback(() => {
    setFilters({ status: 'all', dateFrom: null, dateTo: null });
    setPage(1);
  }, []);

  const handleViewDetails = useCallback((record: AttendanceRecord) => {
    setSelectedRecord(record);
  }, []);

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="mt-1 text-sm text-gray-500">View your attendance history and daily records.</p>
      </div>

      <AttendanceTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'my-attendance' && (
          <div className="space-y-6">
            {todayQuery.isLoading ? (
              <AttendanceSummarySkeleton />
            ) : todayQuery.data ? (
              <AttendanceSummary
                today={todayQuery.data}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                isCheckingIn={checkInMutation.isPending}
                isCheckingOut={checkOutMutation.isPending}
              />
            ) : null}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-base font-semibold text-gray-900">Attendance Record</h2>
                  <div className="flex items-center gap-3">
                    <MonthSelector month={month} year={year} onChange={handleMonthChange} />
                    <AttendanceFilters
                      filters={filters}
                      onApply={handleFilterApply}
                      onClear={handleFilterClear}
                    />
                  </div>
                </div>
                {recordsQuery.isLoading || !recordsQuery.data ? (
                  <AttendanceTableSkeleton />
                ) : (
                  <AttendanceTable
                    records={recordsQuery.data.records}
                    total={recordsQuery.data.total}
                    page={recordsQuery.data.page}
                    totalPages={recordsQuery.data.totalPages}
                    onPageChange={setPage}
                    onViewDetails={handleViewDetails}
                  />
                )}
              </div>

              <div className="space-y-6">
                {overviewQuery.data && <MonthlyOverview data={overviewQuery.data} />}
                {trendQuery.data && <AttendanceTrendChart data={trendQuery.data} />}
                <StatusLegend />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monthly-overview' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 text-5xl">📅</div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Monthly Overview</h2>
            <p className="max-w-md text-center text-sm text-gray-500">
              Monthly calendar view will be available soon.
            </p>
            <div className="mt-6 rounded-full bg-brand-50 px-4 py-2 text-xs font-medium text-brand-700">
              Coming Soon
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 text-5xl">📊</div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Attendance Statistics</h2>
            <p className="max-w-md text-center text-sm text-gray-500">
              Detailed attendance statistics and analytics will be available soon.
            </p>
            <div className="mt-6 rounded-full bg-brand-50 px-4 py-2 text-xs font-medium text-brand-700">
              Coming Soon
            </div>
          </div>
        )}
      </div>

      <AttendanceDetails record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </PageContainer>
  );
}
