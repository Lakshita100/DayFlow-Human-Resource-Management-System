import { z } from 'zod';

// ============================================
// SHARED VALIDATORS
// ============================================

const phoneRegex = /^\+?[\d\s\-().]{7,20}$/;

export const phoneValidator = z
  .string()
  .trim()
  .min(1, 'Phone number is required')
  .regex(/^\+\d{1,4}\d{10}$/, 'Phone number must be in format +<country code><10 digits>');

export const emailValidator = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .max(255, 'Email must be 255 characters or less');

// ============================================
// PASSWORD VALIDATORS
// ============================================

const passwordRules = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be 128 characters or less')
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine((val) => /[a-z]/.test(val), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine((val) => /\d/.test(val), {
    message: 'Password must contain at least one digit',
  })
  .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(val), {
    message: 'Password must contain at least one special character (!@#$%^&*...)',
  })
  .refine((val) => !/\s/.test(val), {
    message: 'Password must not contain spaces',
  });

const weakPasswords = [
  'password', 'password1', 'password12', 'password123',
  'admin', 'admin1', 'admin12', 'admin123',
  'letmein', 'welcome', 'qwerty', 'abc123',
  '123456', '12345678', '1234567890',
  'dayflow', 'dayflow1', 'dayflow123',
];

export const passwordValidator = passwordRules.refine(
  (val) => !weakPasswords.includes(val.toLowerCase()),
  { message: 'Password is too common. Please choose a stronger password' }
);

// ============================================
// LOGIN SCHEMA
// ============================================

export const loginSchema = z.object({
  loginId: z
    .string()
    .trim()
    .min(1, 'Login ID is required')
    .max(20, 'Login ID must be 20 characters or less')
    .regex(/^[A-Z0-9]+$/, 'Login ID must contain only uppercase letters and numbers'),
  password: z.string().min(1, 'Password is required'),
});

// ============================================
// SIGNUP SCHEMA
// ============================================

export const signupSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(1, 'Company name is required')
      .min(2, 'Company name must be at least 2 characters')
      .max(100, 'Company name must be 100 characters or less')
      .refine((val) => /[a-zA-Z]/.test(val), {
        message: 'Company name must contain at least one letter',
      }),
    adminName: z
      .string()
      .trim()
      .min(1, 'Admin name is required')
      .min(2, 'Admin name must be at least 2 characters')
      .max(100, 'Admin name must be 100 characters or less')
      .refine((val) => /^[a-zA-Z\s.'-]+$/.test(val), {
        message: 'Admin name must contain only letters, spaces, periods, hyphens, or apostrophes',
      }),
    email: emailValidator,
    phone: phoneValidator,
    password: passwordValidator,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      const passwordLower = data.password.toLowerCase();
      const nameLower = data.adminName.toLowerCase();
      const companyLower = data.companyName.toLowerCase();
      const emailLocal = data.email.split('@')[0]?.toLowerCase() || '';

      if (passwordLower === nameLower) return false;
      if (passwordLower === companyLower) return false;
      if (passwordLower === emailLocal) return false;
      return true;
    },
    { message: 'Password must not be the same as your name, company, or email', path: ['password'] }
  );

// ============================================
// CHANGE PASSWORD SCHEMA
// ============================================

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordValidator,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

// ============================================
// TYPES
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
