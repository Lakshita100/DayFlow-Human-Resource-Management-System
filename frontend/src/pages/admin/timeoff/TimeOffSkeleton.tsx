export function TimeOffBalanceSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gray-200 animate-pulse" />
            <div>
              <div className="mb-1.5 h-3 w-20 rounded bg-gray-200 animate-pulse" />
              <div className="h-6 w-32 rounded bg-gray-200 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex gap-4 border-t border-gray-50 pt-3">
            <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
            <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TimeOffTableSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-xs font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">Start Date</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">End Date</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">Type</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-200" />
                    <div>
                      <div className="mb-1 h-3.5 w-24 rounded bg-gray-200" />
                      <div className="h-3 w-16 rounded bg-gray-100" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><div className="h-3.5 w-20 rounded bg-gray-200" /></td>
                <td className="px-6 py-4"><div className="h-3.5 w-20 rounded bg-gray-200" /></td>
                <td className="px-6 py-4"><div className="h-5 w-20 rounded-full bg-gray-200" /></td>
                <td className="px-6 py-4"><div className="h-5 w-16 rounded-full bg-gray-200" /></td>
                <td className="px-6 py-4"><div className="h-8 w-24 rounded-lg bg-gray-200" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
