export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Welcome to Dayflow HRMS
        </h2>
        <p className="text-gray-600">
          Human Resource Management System - Phase 1 Infrastructure Setup Complete
        </p>
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-800 font-medium">
            ✅ Frontend is running successfully
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Architecture</h3>
        <div className="flex items-center space-x-4 text-gray-600">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">React</span>
          <span>→</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded">Express</span>
          <span>→</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded">Prisma</span>
          <span>→</span>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded">PostgreSQL</span>
        </div>
      </div>
    </div>
  );
}
