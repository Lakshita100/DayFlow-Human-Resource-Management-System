import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Upload, Eye, EyeOff, AlertCircle, X } from 'lucide-react';
import { signup } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';

const weakPasswords = [
  'password', 'password1', 'password12', 'password123',
  'admin', 'admin1', 'admin12', 'admin123',
  'letmein', 'welcome', 'qwerty', 'abc123',
  '123456', '12345678', '1234567890',
  'dayflow', 'dayflow1', 'dayflow123',
];

interface FormErrors {
  companyName?: string;
  adminName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  logo?: string;
  general?: string;
}

function validatePhone(phone: string): string | undefined {
  if (!phone.trim()) return 'Phone number is required';
  if (!/^\d{10}$/.test(phone)) return 'Phone number must be exactly 10 digits';
  return undefined;
}

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', label: '+91 (India)' },
  { code: '+1', country: 'US', label: '+1 (USA)' },
  { code: '+44', country: 'GB', label: '+44 (UK)' },
  { code: '+61', country: 'AU', label: '+61 (Australia)' },
  { code: '+86', country: 'CN', label: '+86 (China)' },
  { code: '+81', country: 'JP', label: '+81 (Japan)' },
  { code: '+49', country: 'DE', label: '+49 (Germany)' },
  { code: '+33', country: 'FR', label: '+33 (France)' },
  { code: '+971', country: 'AE', label: '+971 (UAE)' },
  { code: '+966', country: 'SA', label: '+966 (Saudi)' },
  { code: '+65', country: 'SG', label: '+65 (Singapore)' },
  { code: '+60', country: 'MY', label: '+60 (Malaysia)' },
  { code: '+62', country: 'ID', label: '+62 (Indonesia)' },
  { code: '+66', country: 'TH', label: '+66 (Thailand)' },
  { code: '+82', country: 'KR', label: '+82 (South Korea)' },
  { code: '+39', country: 'IT', label: '+39 (Italy)' },
  { code: '+34', country: 'ES', label: '+34 (Spain)' },
  { code: '+31', country: 'NL', label: '+31 (Netherlands)' },
  { code: '+55', country: 'BR', label: '+55 (Brazil)' },
  { code: '+27', country: 'ZA', label: '+27 (South Africa)' },
];

function validatePassword(password: string, adminName: string, companyName: string, email: string): string | undefined {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password.length > 128) return 'Password must be 128 characters or less';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/\d/.test(password)) return 'Password must contain at least one digit';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) return 'Password must contain at least one special character';
  if (/\s/.test(password)) return 'Password must not contain spaces';
  if (weakPasswords.includes(password.toLowerCase())) return 'Password is too common. Please choose a stronger password';
  const pwLower = password.toLowerCase();
  if (pwLower === adminName.toLowerCase()) return 'Password must not be the same as your name';
  if (pwLower === companyName.toLowerCase()) return 'Password must not be the same as your company name';
  if (pwLower === email.split('@')[0]?.toLowerCase()) return 'Password must not be the same as your email';
  return undefined;
}

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  if (email.length > 255) return 'Email must be 255 characters or less';
  return undefined;
}

function validateCompanyName(name: string): string | undefined {
  if (!name.trim()) return 'Company name is required';
  if (name.trim().length < 2) return 'Company name must be at least 2 characters';
  if (name.trim().length > 100) return 'Company name must be 100 characters or less';
  if (!/[a-zA-Z]/.test(name)) return 'Company name must contain at least one letter';
  return undefined;
}

function validateAdminName(name: string): string | undefined {
  if (!name.trim()) return 'Admin name is required';
  if (name.trim().length < 2) return 'Admin name must be at least 2 characters';
  if (name.trim().length > 100) return 'Admin name must be 100 characters or less';
  if (!/^[a-zA-Z\s.'-]+$/.test(name)) return 'Admin name must contain only letters, spaces, periods, hyphens, or apostrophes';
  return undefined;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_SIZE = 5 * 1024 * 1024;

function validateLogoFile(file: File | null): string | undefined {
  if (!file) return undefined;
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Invalid file type. Accepted: .jpg, .png, .gif, .webp, .svg';
  }
  if (file.size > MAX_SIZE) {
    return 'File must be 5MB or smaller';
  }
  return undefined;
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    companyName: '',
    adminName: '',
    email: '',
    countryCode: '+91',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'companyName': return validateCompanyName(value);
      case 'adminName': return validateAdminName(value);
      case 'email': return validateEmail(value);
      case 'phone': return validatePhone(value);
      case 'password': return validatePassword(value, form.adminName, form.companyName, form.email);
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== form.password) return 'Passwords do not match';
        return undefined;
      default: return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      setForm((prev) => ({ ...prev, phone: digits }));
      if (touched.phone) {
        setErrors((prev) => ({ ...prev, phone: validatePhone(digits) }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      if (touched[name]) {
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
      }
    }
    if (name === 'password' && touched.confirmPassword) {
      const pw = name === 'password' ? value : form.password;
      setErrors((prev) => ({
        ...prev,
        confirmPassword: form.confirmPassword !== pw ? 'Passwords do not match' : undefined,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, logo: validateLogoFile(file) }));
    } else {
      setLogoPreview(null);
      setErrors((prev) => ({ ...prev, logo: undefined }));
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setErrors((prev) => ({ ...prev, logo: undefined }));
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    newErrors.companyName = validateCompanyName(form.companyName);
    newErrors.adminName = validateAdminName(form.adminName);
    newErrors.email = validateEmail(form.email);
    newErrors.phone = validatePhone(form.phone);
    newErrors.password = validatePassword(form.password, form.adminName, form.companyName, form.email);
    newErrors.confirmPassword = form.confirmPassword !== form.password ? 'Passwords do not match' : undefined;
    newErrors.logo = validateLogoFile(logoFile);
    setErrors(newErrors);
    setTouched({
      companyName: true, adminName: true, email: true,
      phone: true, password: true, confirmPassword: true,
    });
    return !Object.values(newErrors).some((e) => e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, general: undefined }));

    if (!validateAll()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('companyName', form.companyName);
      formData.append('adminName', form.adminName);
      formData.append('email', form.email);
      formData.append('phone', `${form.countryCode}${form.phone}`);
      formData.append('password', form.password);
      formData.append('confirmPassword', form.confirmPassword);
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const result = await signup(formData);
      authLogin(result.user, result.token);
      navigate('/admin');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string; code?: string; errors?: Array<{ field: string; message: string }> } } };
      if (axiosError.response?.data?.errors) {
        const fieldErrors: FormErrors = {};
        for (const e of axiosError.response.data.errors) {
          fieldErrors[e.field as keyof FormErrors] = e.message;
        }
        setErrors(fieldErrors);
      } else if (axiosError.response?.data?.message) {
        setErrors({ general: axiosError.response.data.message });
      } else if (err instanceof Error) {
        setErrors({ general: err.message });
      } else {
        setErrors({ general: 'Unable to connect to Dayflow. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Register Your Company</h1>
          <p className="mt-1 text-sm text-gray-500">Create your organization on DayFlow</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {errors.general && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
                <p className="text-sm font-medium text-red-800">{errors.general}</p>
              </div>
            )}

            <div>
              <label htmlFor="companyName" className="mb-1.5 block text-sm font-medium text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={form.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass(!!errors.companyName)}
                placeholder="Odoo India"
              />
              {errors.companyName && <p className="mt-1.5 text-xs text-red-600">{errors.companyName}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Company Logo <span className="text-gray-400">(optional)</span>
              </label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="logo-upload"
                  className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="h-full w-full rounded-lg object-cover" />
                  ) : (
                    <>
                      <Upload size={20} className="mb-1 text-gray-400" />
                      <span className="text-[10px] text-gray-400">Upload</span>
                    </>
                  )}
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {logoPreview && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 truncate max-w-[180px]">{logoFile?.name}</span>
                    <span className="text-xs text-gray-400">{logoFile ? `${(logoFile.size / 1024).toFixed(1)} KB` : ''}</span>
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                    >
                      <X size={12} /> Remove
                    </button>
                  </div>
                )}
              </div>
              {errors.logo && <p className="mt-1.5 text-xs text-red-600">{errors.logo}</p>}
              <p className="mt-1.5 text-xs text-gray-400">
                JPG, PNG, GIF, WebP, or SVG. Max 5MB.
              </p>
            </div>

            <div>
              <label htmlFor="adminName" className="mb-1.5 block text-sm font-medium text-gray-700">
                Admin Name <span className="text-red-500">*</span>
              </label>
              <input
                id="adminName"
                name="adminName"
                type="text"
                value={form.adminName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass(!!errors.adminName)}
                placeholder="John Doe"
              />
              {errors.adminName && <p className="mt-1.5 text-xs text-red-600">{errors.adminName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Admin Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass(!!errors.email)}
                placeholder="admin@odooindia.com"
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="countryCode"
                  value={form.countryCode}
                  onChange={handleChange}
                  className="w-32 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass(!!errors.phone) + ' flex-1'}
                  placeholder="1234567890"
                />
              </div>
              {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
              <p className="mt-1.5 text-xs text-gray-400">
                Exactly 10 digits, no spaces or special characters
              </p>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass(!!errors.password) + ' pr-10'}
                  placeholder="Create a strong password"
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
              {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
              <p className="mt-1.5 text-xs text-gray-400">
                Min 8 chars, uppercase, lowercase, digit, and special character
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass(!!errors.confirmPassword) + ' pr-10'}
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating Company...
                </span>
              ) : (
                'Register Company'
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
