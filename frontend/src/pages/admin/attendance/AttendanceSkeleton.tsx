export default function AttendanceSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-xs font-medium text-gray-500">Employee</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">Check In</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">Check Out</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">Work Hours</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">Extra Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-200" />
                    <div>
                      <div className="mb-1.5 h-3.5 w-28 rounded bg-gray-200" />
                      <div className="h-3 w-16 rounded bg-gray-100" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><div className="h-3.5 w-20 rounded bg-gray-200" /></td>
                <td className="px-6 py-4"><div className="h-3.5 w-20 rounded bg-gray-200" /></td>
                <td className="px-6 py-4"><div className="h-3.5 w-16 rounded bg-gray-200" /></td>
                <td className="px-6 py-4"><div className="h-3.5 w-16 rounded bg-gray-200" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
