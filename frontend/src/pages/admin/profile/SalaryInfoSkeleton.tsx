export default function SalaryInfoSkeleton() {
  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <div className="h-5 w-44 rounded bg-gray-200 animate-pulse" />
        <div className="mt-2 h-3.5 w-72 rounded bg-gray-100 animate-pulse" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-gray-200 animate-pulse" />
              <div className="h-8 w-8 rounded-lg bg-gray-100 animate-pulse" />
            </div>
            <div className="mt-4 h-6 w-24 rounded bg-gray-200 animate-pulse" />
            <div className="mt-1.5 h-3 w-16 rounded bg-gray-100 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rounded-xl border border-gray-100 bg-white shadow-card lg:col-span-3">
          <div className="border-b border-gray-50 px-6 py-5">
            <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
            <div className="mt-2 h-3 w-56 rounded bg-gray-100 animate-pulse" />
          </div>
          <div className="divide-y divide-gray-50 px-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-4">
                <div>
                  <div className="h-3.5 w-32 rounded bg-gray-200 animate-pulse" />
                  <div className="mt-1.5 h-3 w-64 rounded bg-gray-100 animate-pulse" />
                </div>
                <div className="text-right">
                  <div className="ml-auto h-3.5 w-20 rounded bg-gray-200 animate-pulse" />
                  <div className="ml-auto mt-1.5 h-3 w-12 rounded bg-gray-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          {[160, 120].map((h, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white shadow-card">
              <div className="border-b border-gray-50 px-6 py-5">
                <div className="h-4 w-36 rounded bg-gray-200 animate-pulse" />
                <div className="mt-2 h-3 w-48 rounded bg-gray-100 animate-pulse" />
              </div>
              <div className="px-6 py-4" style={{ height: h }}>
                <div className="h-full rounded-lg bg-gray-50 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
