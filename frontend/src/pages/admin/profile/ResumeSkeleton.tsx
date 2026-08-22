export default function ResumeSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        {[80, 64, 56].map((h, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-6 shadow-card" style={{ height: h + 48 }}>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded bg-gray-100 animate-pulse" />
              <div className="h-3.5 w-4/5 rounded bg-gray-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2">
            {['w-20', 'w-24', 'w-16', 'w-28', 'w-20'].map((w, i) => (
              <div key={i} className={`h-7 ${w} rounded-full bg-gray-100 animate-pulse`} />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
          </div>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className={`flex items-start gap-3 py-3 ${i === 0 ? 'border-b border-gray-50' : ''}`}>
              <div className="h-8 w-8 rounded-lg bg-gray-100 animate-pulse" />
              <div>
                <div className="h-3.5 w-40 rounded bg-gray-200 animate-pulse" />
                <div className="mt-1.5 h-3 w-32 rounded bg-gray-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
