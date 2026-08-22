import { Link } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types/auth.types';

function getDashboardPath(role: Role): string {
  if (role === 'ADMIN' || role === 'HR') return '/admin/dashboard';
  return '/employee/dashboard';
}

export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <ShieldOff size={32} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="mt-2 text-sm text-gray-500">
          You don&apos;t have permission to view this page. Please contact your
          administrator if you believe this is an error.
        </p>
        <Link
          to={user ? getDashboardPath(user.role) : '/login'}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <ArrowLeft size={16} />
          {user ? 'Back to Dashboard' : 'Go to Login'}
        </Link>
      </div>
    </div>
  );
}
