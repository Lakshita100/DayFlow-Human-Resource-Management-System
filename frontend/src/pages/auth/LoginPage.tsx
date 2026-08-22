import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Eye, EyeOff, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import * as authService from '@/services/auth.service';
import type { Role } from '@/types/auth.types';

function getDashboardPath(role: Role): string {
  if (role === 'ADMIN' || role === 'HR') return '/admin/dashboard';
  return '/employee/dashboard';
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ loginId?: string; password?: string }>({});
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const validate = (): boolean => {
    const errs: { loginId?: string; password?: string } = {};
    if (!loginId.trim()) errs.loginId = 'Login ID is required';
    if (!password) errs.password = 'Password is required';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setIsLocked(false);

    if (!validate()) return;

    try {
      const response = await authService.login({ loginId: loginId.trim(), password });
      authLogin(response.user, response.token);

      if (response.user.mustChangePassword) {
        navigate('/change-password', { replace: true });
      } else if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(getDashboardPath(response.user.role), { replace: true });
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string; code?: string; details?: { remainingMinutes?: number; attemptsRemaining?: number } } } };
      const code = axiosError.response?.data?.code;
      const message = axiosError.response?.data?.message;

      if (code === 'ACCOUNT_LOCKED') {
        setIsLocked(true);
        const minutes = axiosError.response?.data?.details?.remainingMinutes;
        setServerError(
          message || `Account is temporarily locked. ${minutes ? `Try again in ${minutes} minute(s).` : 'Try again later.'}`
        );
      } else if (code === 'INVALID_CREDENTIALS') {
        const attempts = axiosError.response?.data?.details?.attemptsRemaining;
        setServerError(
          message || (attempts !== undefined ? `Invalid login ID or password. ${attempts} attempt(s) remaining.` : 'Invalid login ID or password')
        );
      } else if (message) {
        setServerError(message);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('Unable to connect to Dayflow. Please try again.');
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600">
              <Zap size={24} className="text-white" />
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your Dayflow account</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
          {serverError && (
            <div className={`mb-6 flex items-start gap-3 rounded-lg border p-4 ${
              isLocked
                ? 'border-amber-200 bg-amber-50'
                : 'border-red-200 bg-red-50'
            }`}>
              {isLocked ? (
                <Clock size={18} className="mt-0.5 shrink-0 text-amber-500" />
              ) : (
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
              )}
              <p className={`text-sm font-medium ${isLocked ? 'text-amber-800' : 'text-red-800'}`}>
                {serverError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="loginId" className="mb-1.5 block text-sm font-medium text-gray-700">
                Login ID
              </label>
              <input
                id="loginId"
                type="text"
                autoComplete="username"
                placeholder="Enter your Login ID"
                value={loginId}
                onChange={(e) => {
                  setLoginId(e.target.value);
                  if (fieldErrors.loginId) setFieldErrors((prev) => ({ ...prev, loginId: undefined }));
                }}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 ${
                  fieldErrors.loginId
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                    : 'border-gray-200 focus:border-brand-300 focus:ring-brand-100'
                }`}
              />
              {fieldErrors.loginId && (
                <p className="mt-1.5 text-xs text-red-600">{fieldErrors.loginId}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 ${
                    fieldErrors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-200 focus:border-brand-300 focus:ring-brand-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLocked}
              className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sign In
            </button>
          </form>

          {/* Dev Login */}
          <div className="mt-6 border-t border-gray-100 pt-5">
            <p className="mb-3 text-center text-xs font-medium text-gray-400">
              Dev Access (No Backend Required)
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  authLogin(
                    {
                      id: 'dev-emp-001',
                      loginId: 'john.doe',
                      email: 'john.doe@dayflow.com',
                      name: 'John Doe',
                      role: 'EMPLOYEE',
                      employeeId: 'EMP-001',
                      companyId: null,
                      company: null,
                      mustChangePassword: false,
                    },
                    'dev-token-employee'
                  );
                  navigate('/employee/dashboard', { replace: true });
                }}
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                Dev Login (Employee)
              </button>
              <button
                type="button"
                onClick={() => {
                  authLogin(
                    {
                      id: 'dev-admin-001',
                      loginId: 'admin',
                      email: 'admin@dayflow.com',
                      name: 'Admin User',
                      role: 'ADMIN',
                      employeeId: 'ADM-001',
                      companyId: null,
                      company: null,
                      mustChangePassword: false,
                    },
                    'dev-token-admin'
                  );
                  navigate('/admin/dashboard', { replace: true });
                }}
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                Dev Login (Admin)
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Employee accounts are created by administrators.
        </p>
      </div>
    </div>
  );
}
