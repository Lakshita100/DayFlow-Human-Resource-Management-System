import { TrendingUp, TrendingDown, Wallet, CheckCircle } from "lucide-react";
import type { SalarySummary } from "@/types/salary.types";

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

interface SalarySummaryCardsProps {
  data: SalarySummary;
}

function getStatusStyles(status: string) {
  switch (status) {
    case "paid":
      return {
        container: "bg-emerald-50 text-emerald-600",
        value: "text-emerald-600",
      };
    case "processing":
      return {
        container: "bg-blue-50 text-blue-600",
        value: "text-blue-600",
      };
    case "pending":
      return {
        container: "bg-orange-50 text-orange-600",
        value: "text-orange-600",
      };
    case "failed":
      return {
        container: "bg-red-50 text-red-600",
        value: "text-red-600",
      };
    default:
      return {
        container: "bg-gray-50 text-gray-600",
        value: "text-gray-600",
      };
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function SalarySummaryCards({ data }: SalarySummaryCardsProps) {
  const statusStyles = getStatusStyles(data.paymentStatus);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <TrendingUp className="h-5 w-5" />
        </div>
        <p className="text-sm text-gray-500">Gross Salary</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">
          {formatINR(data.grossSalary)}
        </p>
        <p className="mt-1 text-xs text-gray-400">Before deductions</p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <TrendingDown className="h-5 w-5" />
        </div>
        <p className="text-sm text-gray-500">Deductions</p>
        <p className="mt-1 text-2xl font-bold text-red-600">
          {formatINR(data.totalDeductions)}
        </p>
        <p className="mt-1 text-xs text-gray-400">Total deductions</p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <Wallet className="h-5 w-5" />
        </div>
        <p className="text-sm text-gray-500">Net Salary</p>
        <p className="mt-1 text-2xl font-bold text-emerald-600">
          {formatINR(data.netSalary)}
        </p>
        <p className="mt-1 text-xs text-gray-400">After deductions</p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
        <div
          className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${statusStyles.container}`}
        >
          <CheckCircle className="h-5 w-5" />
        </div>
        <p className="text-sm text-gray-500">Payment Status</p>
        <p className={`mt-1 text-2xl font-bold ${statusStyles.value}`}>
          {capitalize(data.paymentStatus)}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {data.paymentDate
            ? `Paid on ${new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(data.paymentDate))}`
            : "No payment date"}
        </p>
      </div>
    </div>
  );
}
