import { Users, UserCheck, CalendarOff, UserX } from 'lucide-react';
import type { AdminKpiData } from '@/types/admin.types';

interface AdminKpiCardsProps {
  data: AdminKpiData;
}

const cards = [
  {
    key: 'totalEmployees',
    title: 'Total Employees',
    icon: Users,
    iconBg: 'bg-brand-50',
    iconColor: 'text-brand-600',
    valueColor: 'text-gray-900',
    getSub: () => 'Active employees',
  },
  {
    key: 'presentToday',
    title: 'Present Today',
    icon: UserCheck,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    valueColor: 'text-emerald-600',
    getSub: (d: AdminKpiData) =>
      `${((d.presentToday / d.totalEmployees) * 100).toFixed(1)}% of workforce`,
  },
  {
    key: 'onLeave',
    title: 'On Leave',
    icon: CalendarOff,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    valueColor: 'text-blue-600',
    getSub: () => 'Today',
  },
  {
    key: 'absentToday',
    title: 'Absent Today',
    icon: UserX,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    valueColor: 'text-rose-600',
    getSub: () => 'Needs attention',
  },
];

export default function AdminKpiCards({ data }: AdminKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = data[card.key as keyof AdminKpiData];
        return (
          <div
            key={card.key}
            className="group rounded-xl border border-gray-100 bg-white p-5 shadow-card transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className={`mt-2 text-2xl font-bold ${card.valueColor}`}>{value}</p>
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
