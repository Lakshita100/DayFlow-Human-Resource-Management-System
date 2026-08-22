import { Sun, CloudRain } from 'lucide-react';
import type { AdminLeaveBalance } from '@/types/admin-pages.types';

const iconMap = {
  PAID: Sun,
  SICK: CloudRain,
};

const colorMap = {
  PAID: { icon: 'text-brand-600', bg: 'bg-brand-50', accent: 'text-brand-700' },
  SICK: { icon: 'text-amber-600', bg: 'bg-amber-50', accent: 'text-amber-700' },
};

export default function LeaveBalanceCards({ balances }: { balances: AdminLeaveBalance[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {balances.map((b) => {
        const Icon = iconMap[b.type];
        const colors = colorMap[b.type];
        return (
          <div key={b.type} className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg ${colors.bg} p-2.5`}>
                <Icon size={18} className={colors.icon} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">{b.label}</p>
                <p className={`text-2xl font-bold ${colors.accent}`}>
                  {b.available}
                  <span className="ml-1 text-sm font-medium text-gray-400">Days Available</span>
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4 border-t border-gray-50 pt-3">
              <p className="text-xs text-gray-400">
                Used: <span className="font-medium text-gray-600">{b.used}</span>
              </p>
              {b.pending > 0 && (
                <p className="text-xs text-gray-400">
                  Pending: <span className="font-medium text-gray-600">{b.pending}</span>
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
