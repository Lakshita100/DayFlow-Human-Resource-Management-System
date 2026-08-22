import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, Eye, EyeOff, Upload, AlertCircle, CheckCircle } from 'lucide-react';

const signupSchema = z
  .object({
    companyName: z.string().min(1, 'Company name is required'),
    name: z.string().min(1, 'Your name is required'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupForm) {
    setServerError(null);
    try {
      // TODO: Connect to POST /api/auth/signup once backend implements it
      // await authService.signup({ ...data, logo: logoFile });
      void data;
      setSubmitted(true);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        setServerError(axiosError.response.data.message);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('Unable to connect to Dayflow. Please try again.');
      }
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <CheckCircle size={28} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Request Submitted</h1>
          <p className="mt-2 text-sm text-gray-500">
            Your organization registration request has been received. Our team will review
            it and get back to you shortly.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = (hasError: boolean) =>
    `w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
        : 'border-gray-200 focus:border-brand-300 focus:ring-brand-100'
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600">
              <Zap size={24} className="text-white" />
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Set up your organization on Dayflow</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
          {serverError && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
              <p className="text-sm font-medium text-red-800">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label htmlFor="companyName" className="mb-1.5 block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                placeholder="Acme Corporation"
                className={inputClass(!!errors.companyName)}
                {...register('companyName')}
              />
              {errors.companyName && (
                <p className="mt-1.5 text-xs text-red-600">{errors.companyName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                className={inputClass(!!errors.name)}
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className={inputClass(!!errors.email)}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                className={inputClass(!!errors.phone)}
                {...register('phone')}
              />
              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-600">{errors.phone.message}</p>
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
                  placeholder="Create a strong password"
                  className={inputClass(!!errors.password) + ' pr-10'}
                  {...register('password')}
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
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
              )}
              <p className="mt-1.5 text-xs text-gray-400">
                Min 8 characters, with uppercase, lowercase, and a number
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  className={inputClass(!!errors.confirmPassword) + ' pr-10'}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Company Logo
              </label>
              <label
                htmlFor="logo-upload"
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 transition-colors hover:border-brand-300 hover:bg-brand-50"
              >
                <Upload size={16} />
                {logoFile ? logoFile.name : 'Choose file'}
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
