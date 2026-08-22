import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, FileText, ArrowRight } from 'lucide-react';
import type { ActionRequired } from '@/types/admin.types';

interface AdminActionRequiredProps {
  data: ActionRequired[];
}

const typeConfig = {
  critical: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
  },
};

const iconMap = {
  critical: AlertTriangle,
  warning: Clock,
  info: FileText,
};

export default function AdminActionRequired({ data }: AdminActionRequiredProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Action Required</h3>

      {data.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="mb-3 rounded-full bg-emerald-50 p-3">
            <AlertTriangle size={20} className="text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-gray-900">All clear!</p>
          <p className="mt-1 text-xs text-gray-500">No actions require your attention.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => {
            const config = typeConfig[item.type];
            const Icon = iconMap[item.type];
            return (
              <div
                key={item.id}
                className={`rounded-lg border ${config.border} ${config.bg} p-4 transition-colors hover:shadow-sm`}
              >
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 rounded-lg ${config.iconBg} p-2`}>
                    <Icon size={16} className={config.iconColor} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${config.badge}`}>
                        {item.count}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-600">{item.description}</p>
                    <button
                      onClick={() => navigate(item.actionPath)}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                    >
                      {item.actionLabel}
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
