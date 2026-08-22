import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export default function HealthPage() {
  const { data, isLoading, error } = useQuery<HealthResponse>({
    queryKey: ['health'],
    queryFn: () => apiClient.get('/health').then((res) => res.data),
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          System Health Check
        </h2>

        {isLoading && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800">Checking backend status...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-800 font-medium">❌ Backend connection failed</p>
            <p className="text-red-600 text-sm mt-2">
              Make sure the backend server is running on port 5000
            </p>
          </div>
        )}

        {data && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">✅ Backend is healthy</p>
            <div className="mt-3 space-y-1 text-sm text-green-700">
              <p><span className="font-medium">Service:</span> {data.service}</p>
              <p><span className="font-medium">Status:</span> {data.status}</p>
              <p><span className="font-medium">Timestamp:</span> {data.timestamp}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
