import { CalendarCheck, Clock, CalendarDays, Umbrella } from 'lucide-react';
import type { DashboardSummary } from '@/types/dashboard.types';

interface SummaryCardsProps {
  data: DashboardSummary;
}

const cardConfig = [
  {
    key: 'todayStatus' as const,
    title: "Today's Status",
    icon: CalendarCheck,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    getValue: (d: DashboardSummary) =>
      d.todayStatus.status === 'present' ? 'Present' :
      d.todayStatus.status === 'half_day' ? 'Half Day' : 'Absent',
    getSub: (d: DashboardSummary) =>
      d.todayStatus.checkedInAt ? `Checked in at ${d.todayStatus.checkedInAt}` : 'Not checked in',
    valueColor: 'text-emerald-600',
  },
  {
    key: 'workingHours' as const,
    title: 'Working Hours',
    icon: Clock,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    getValue: (d: DashboardSummary) => d.workingHours.total,
    getSub: (d: DashboardSummary) => d.workingHours.description,
    valueColor: 'text-blue-600',
  },
  {
    key: 'monthlyAttendance' as const,
    title: 'This Month',
    icon: CalendarDays,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    getValue: (d: DashboardSummary) =>
      `${d.monthlyAttendance.present} / ${d.monthlyAttendance.totalWorking}`,
    getSub: (d: DashboardSummary) => d.monthlyAttendance.description,
    valueColor: 'text-violet-600',
  },
  {
    key: 'leaveBalance' as const,
    title: 'Leave Balance',
    icon: Umbrella,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    getValue: (d: DashboardSummary) => String(d.leaveBalance.total),
    getSub: (d: DashboardSummary) => d.leaveBalance.description,
    valueColor: 'text-amber-600',
  },
];

export default function SummaryCards({ data }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cardConfig.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="group rounded-xl border border-gray-100 bg-white p-5 shadow-card transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className={`mt-2 text-2xl font-bold ${card.valueColor}`}>
                  {card.getValue(data)}
                </p>
                <p className="mt-1 text-xs text-gray-400">{card.getSub(data)}</p>
              </div>
              <div className={`rounded-lg ${card.iconBg} p-2.5`}>
                <Icon size={20} className={card.iconColor} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
