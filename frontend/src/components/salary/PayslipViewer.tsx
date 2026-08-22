import { X, Download, Building2, Calendar, User, Briefcase } from 'lucide-react';
import type { SalaryRecord } from '@/types/salary.types';

interface PayslipViewerProps {
  record: SalaryRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  isDownloading: boolean;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function PayslipViewer({ record, isOpen, onClose, onDownload, isDownloading }: PayslipViewerProps) {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Payslip</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Payslip Content */}
        <div className="p-6">
          {/* Company Header */}
          <div className="mb-6 text-center">
            <div className="mb-2 inline-flex items-center justify-center rounded-xl bg-brand-50 p-3">
              <Building2 className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{record.companyName}</h3>
            <p className="text-sm text-gray-500">Payslip for {record.monthLabel}</p>
          </div>

          {/* Employee Info */}
          <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Employee Name</p>
                <p className="text-sm font-medium text-gray-900">{record.employeeName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Employee ID</p>
                <p className="text-sm font-medium text-gray-900">{record.employeeId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Payroll Month</p>
                <p className="text-sm font-medium text-gray-900">{record.monthLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Payment Date</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(record.paymentDate)}</p>
              </div>
            </div>
          </div>

          {/* Earnings & Deductions */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Earnings */}
            <div className="rounded-xl border border-gray-100 p-4">
              <h4 className="mb-3 border-b border-gray-100 pb-2 text-sm font-semibold text-gray-900">Earnings</h4>
              <div className="space-y-2">
                {record.earnings.components.map((comp) => (
                  <div key={comp.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{comp.name}</span>
                    <span className="font-medium text-gray-900">{formatINR(comp.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-sm font-semibold text-gray-900">Gross Earnings</span>
                <span className="text-sm font-bold text-emerald-600">{formatINR(record.grossSalary)}</span>
              </div>
            </div>

            {/* Deductions */}
            <div className="rounded-xl border border-gray-100 p-4">
              <h4 className="mb-3 border-b border-gray-100 pb-2 text-sm font-semibold text-gray-900">Deductions</h4>
              <div className="space-y-2">
                {record.deductions.components.map((comp) => (
                  <div key={comp.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{comp.name}</span>
                    <span className="font-medium text-red-600">{formatINR(comp.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-sm font-semibold text-gray-900">Total Deductions</span>
                <span className="text-sm font-bold text-red-600">{formatINR(record.totalDeductions)}</span>
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-900">Net Salary</span>
              <span className="text-xl font-bold text-emerald-600">{formatINR(record.netSalary)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
