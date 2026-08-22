const legendItems = [
  { color: 'bg-emerald-500', label: 'Present', description: 'Full working day' },
  { color: 'bg-orange-500', label: 'Half Day', description: 'Worked for less than 4 hours' },
  { color: 'bg-red-500', label: 'Absent', description: 'Did not attend' },
  { color: 'bg-blue-500', label: 'Leave', description: 'On approved leave' },
  { color: 'bg-sky-400', label: 'Weekly Off', description: 'Saturday & Sunday' },
];

export default function StatusLegend() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Status Legend</h3>
      <div className="space-y-3">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-400">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
