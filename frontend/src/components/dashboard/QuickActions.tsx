import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, CalendarOff, Clock } from 'lucide-react';

const actions = [
  {
    label: 'Check In',
    description: 'Start your day',
    icon: LogIn,
    path: '/employee/attendance',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    label: 'Check Out',
    description: 'End your day',
    icon: LogOut,
    path: '/employee/attendance',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
  {
    label: 'Apply Leave',
    description: 'Request time off',
    icon: CalendarOff,
    path: '/employee/leave',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    label: 'View Attendance',
    description: 'See attendance',
    icon: Clock,
    path: '/employee/attendance',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="group flex flex-col items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-center transition-all hover:border-gray-200 hover:bg-white hover:shadow-sm"
            >
              <div className={`rounded-lg ${action.iconBg} p-2.5 transition-transform group-hover:scale-105`}>
                <Icon size={20} className={action.iconColor} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{action.label}</p>
                <p className="mt-0.5 text-xs text-gray-400">{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
