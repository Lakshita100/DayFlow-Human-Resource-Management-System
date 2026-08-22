import { CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import type { DocumentStats } from '@/types/document.types';

interface DocumentStatsCardsProps {
  stats: DocumentStats;
}

function formatNumber(n: number): string {
  return n.toString();
}

export default function DocumentStatsCards({ stats }: DocumentStatsCardsProps) {
  const cards = [
    {
      label: 'Total Documents',
      value: formatNumber(stats.total),
      icon: FileText,
      iconBg: 'bg-brand-50',
      iconColor: 'text-brand-600',
      valueColor: 'text-gray-900',
      sub: 'All uploaded',
    },
    {
      label: 'Verified',
      value: formatNumber(stats.verified),
      icon: CheckCircle,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-600',
      sub: 'Approved',
    },
    {
      label: 'Pending Review',
      value: formatNumber(stats.pending),
      icon: Clock,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      valueColor: 'text-orange-600',
      sub: 'Awaiting review',
    },
    {
      label: 'Expiring Soon',
      value: formatNumber(stats.expiringSoon),
      icon: AlertTriangle,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      valueColor: 'text-amber-600',
      sub: 'Within 90 days',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
          <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBg}`}>
            <card.icon className={`h-5 w-5 ${card.iconColor}`} />
          </div>
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className={`mt-1 text-2xl font-bold ${card.valueColor}`}>{card.value}</p>
          <p className="mt-0.5 text-xs text-gray-400">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
