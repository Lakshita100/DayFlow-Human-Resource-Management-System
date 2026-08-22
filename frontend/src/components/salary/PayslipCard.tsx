import { FileText, Download, Eye, Loader2 } from "lucide-react";
import type { SalaryRecord } from "@/types/salary.types";

interface PayslipCardProps {
  record: SalaryRecord;
  onViewPayslip: () => void;
  onDownload: () => void;
  isDownloading: boolean;
}

function getStatusStyles(status: string) {
  switch (status) {
    case "paid":
      return "bg-emerald-50 text-emerald-700";
    case "processing":
      return "bg-blue-50 text-blue-700";
    case "pending":
      return "bg-orange-50 text-orange-700";
    case "failed":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function PayslipCard({
  record,
  onViewPayslip,
  onDownload,
  isDownloading,
}: PayslipCardProps) {
  const hasPayslip = !!record.payslipUrl;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Payslip</h3>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 p-2.5 text-brand-600">
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold text-gray-900">
            {record.monthLabel}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyles(record.paymentStatus)}`}
          >
            {capitalize(record.paymentStatus)}
          </span>
        </div>
      </div>

      <div className="mt-5">
        {hasPayslip ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onViewPayslip}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
              View Payslip
            </button>
            <button
              type="button"
              onClick={onDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Download
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            Your payslip is not available yet.
          </p>
        )}
      </div>
    </div>
  );
}
