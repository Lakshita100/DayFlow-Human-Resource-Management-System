interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto max-w-full rounded-lg border border-gray-100 bg-gray-50 p-1 scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
            active === tab.key
              ? 'bg-white text-gray-900 shadow-sm font-semibold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
              active === tab.key ? 'bg-brand-100 text-brand-700' : 'bg-gray-200 text-gray-500'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

interface PageTabsProps {
  tabs: { key: string; label: string }[];
  active: string;
  onChange: (key: string) => void;
}

export function PageTabs({ tabs, active, onChange }: PageTabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-gray-100 overflow-x-auto max-w-full scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative shrink-0 px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
            active === tab.key
              ? 'text-brand-700 font-semibold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
          {active === tab.key && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-brand-600" />
          )}
        </button>
      ))}
    </div>
  );
}
