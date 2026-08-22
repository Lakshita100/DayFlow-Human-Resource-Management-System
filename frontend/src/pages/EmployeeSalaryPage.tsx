import { useState, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import SalarySummaryCards from '@/components/salary/SalarySummaryCards';
import NetSalaryHighlight from '@/components/salary/NetSalaryHighlight';
import SalaryBreakdown from '@/components/salary/SalaryBreakdown';
import PayslipCard from '@/components/salary/PayslipCard';
import SalaryHistory from '@/components/salary/SalaryHistory';
import PayslipViewer from '@/components/salary/PayslipViewer';
import {
  SalarySummarySkeleton,
  SalaryBreakdownSkeleton,
  SalaryTableSkeleton,
} from '@/components/salary/SalarySkeleton';
import {
  useSalaryRecordMock,
  useSalaryMonths,
  useSalaryHistoryMock,
} from '@/hooks/useSalary';
import type { SalaryRecord } from '@/types/salary.types';

export default function EmployeeSalaryPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>('may');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [viewingPayslip, setViewingPayslip] = useState<SalaryRecord | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const months = useSalaryMonths();
  const record = useSalaryRecordMock(selectedMonth, selectedYear);
  const historyRecords = useSalaryHistoryMock();

  const handleMonthChange = useCallback((month: string, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  }, []);

  const handleViewPayslip = useCallback((record: SalaryRecord) => {
    setViewingPayslip(record);
    setIsViewerOpen(true);
  }, []);

  const handleClosePayslipViewer = useCallback(() => {
    setIsViewerOpen(false);
    setViewingPayslip(null);
  }, []);

  const handleDownloadPayslip = useCallback(async () => {
    if (!viewingPayslip) return;
    // Mock download - in production would call API
    alert(`Downloading payslip for ${viewingPayslip.monthLabel}...`);
  }, [viewingPayslip]);

  const isLoading = !record;

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Salary</h1>
            <p className="text-sm text-gray-500">View your salary details and payslips</p>
          </div>
          <SalarySummarySkeleton />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SalaryBreakdownSkeleton />
            </div>
            <div>
              <SalaryTableSkeleton />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  const summary = record
    ? {
        grossSalary: record.grossSalary,
        totalDeductions: record.totalDeductions,
        netSalary: record.netSalary,
        paymentStatus: record.paymentStatus,
        paymentDate: record.paymentDate,
        monthLabel: record.monthLabel,
      }
    : null;

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Salary</h1>
            <p className="text-sm text-gray-500">View your salary details and payslips</p>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <select
              value={`${selectedMonth}-${selectedYear}`}
              onChange={(e) => {
                const parts = e.target.value.split('-');
                const month = parts[0] ?? '';
                const year = parseInt(parts[1] ?? '0');
                handleMonthChange(month, year);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {months.map((m) => (
                <option key={`${m.month}-${m.year}`} value={`${m.month}-${m.year}`}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && <SalarySummaryCards data={summary} />}

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Breakdown */}
          <div className="space-y-6 lg:col-span-2">
            {record && <SalaryBreakdown record={record} />}
          </div>

          {/* Right Column - Net Salary & Payslip */}
          <div className="space-y-6">
            {record && <NetSalaryHighlight record={record} />}
            {record && (
              <PayslipCard
                record={record}
                onViewPayslip={() => handleViewPayslip(record)}
                onDownload={handleDownloadPayslip}
                isDownloading={false}
              />
            )}
          </div>
        </div>

        {/* Salary History */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Salary History</h2>
          <SalaryHistory records={historyRecords} onViewPayslip={handleViewPayslip} />
        </div>
      </div>

      {/* Payslip Viewer Modal */}
      <PayslipViewer
        record={viewingPayslip}
        isOpen={isViewerOpen}
        onClose={handleClosePayslipViewer}
        onDownload={handleDownloadPayslip}
        isDownloading={false}
      />
    </PageContainer>
  );
}
