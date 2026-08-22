interface AttendanceTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'my-attendance', label: 'My Attendance' },
  { id: 'monthly-overview', label: 'Monthly Overview' },
  { id: 'statistics', label: 'Attendance Statistics' },
];

export default function AttendanceTabs({ activeTab, onTabChange }: AttendanceTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex gap-6" aria-label="Attendance tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
