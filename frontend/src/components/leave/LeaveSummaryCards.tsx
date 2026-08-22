import { Calendar, Briefcase, Heart, Wallet } from "lucide-react";
import { LeaveBalanceSummary } from "@/types/leave.types";

interface LeaveSummaryCardsProps {
  data: LeaveBalanceSummary;
}

const cards = [
  {
    label: "Available Leave",
    icon: Calendar,
    getValue: (data: LeaveBalanceSummary) => data.totalAvailable,
    colorClass: "bg-brand-50 text-brand-600",
  },
  {
    label: "Paid Leave",
    icon: Briefcase,
    getValue: (data: LeaveBalanceSummary) => data.balances.find((b) => b.type === 'paid')?.available ?? 0,
    colorClass: "bg-violet-50 text-violet-600",
  },
  {
    label: "Sick Leave",
    icon: Heart,
    getValue: (data: LeaveBalanceSummary) => data.balances.find((b) => b.type === 'sick')?.available ?? 0,
    colorClass: "bg-amber-50 text-amber-600",
  },
  {
    label: "Unpaid Leave",
    icon: Wallet,
    getValue: (data: LeaveBalanceSummary) => data.balances.find((b) => b.type === 'unpaid')?.available ?? 0,
    colorClass: "bg-gray-100 text-gray-600",
  },
];

export default function LeaveSummaryCards({ data }: LeaveSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = card.getValue(data);

        return (
          <div
            key={card.label}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-card hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex rounded-lg p-2.5 ${card.colorClass}`}>
              <Icon className="h-5 w-5" />
            </div>

            <p className="mt-3 text-sm text-gray-500">{card.label}</p>

            <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>

            <p className="mt-1 text-xs text-gray-400">{value} days available</p>
          </div>
        );
      })}
    </div>
  );
}
