import { z } from 'zod';

const nameRegex = /^[a-zA-Z\s.'-]+$/;

export const createEmployeeSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or less')
    .refine((val) => nameRegex.test(val), {
      message: 'First name must contain only letters, spaces, periods, hyphens, or apostrophes',
    }),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be 50 characters or less')
    .refine((val) => nameRegex.test(val), {
      message: 'Last name must contain only letters, spaces, periods, hyphens, or apostrophes',
    }),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be 255 characters or less'),
  phone: z
    .string()
    .trim()
    .regex(/^\+\d{1,4}\d{10}$/, 'Phone number must be in format +<country code><10 digits>')
    .optional()
    .or(z.literal('')),
  department: z
    .string()
    .trim()
    .min(1, 'Department is required')
    .max(100, 'Department must be 100 characters or less'),
  designation: z
    .string()
    .trim()
    .min(1, 'Designation is required')
    .max(100, 'Designation must be 100 characters or less'),
  dateOfJoining: z
    .string()
    .min(1, 'Date of joining is required')
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Please enter a valid date' }),
  employmentType: z
    .enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'], {
      message: 'Employment type must be FULL_TIME, PART_TIME, CONTRACT, or INTERN',
    })
    .optional()
    .default('FULL_TIME'),
});

export const updateEmployeeSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or less')
    .refine((val) => nameRegex.test(val), {
      message: 'First name must contain only letters, spaces, periods, hyphens, or apostrophes',
    })
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be 50 characters or less')
    .refine((val) => nameRegex.test(val), {
      message: 'Last name must contain only letters, spaces, periods, hyphens, or apostrophes',
    })
    .optional(),
  phone: z
    .string()
    .trim()
    .regex(/^\+\d{1,4}\d{10}$/, 'Phone number must be in format +<country code><10 digits>')
    .optional()
    .or(z.literal('')),
  department: z
    .string()
    .trim()
    .min(1, 'Department is required')
    .max(100, 'Department must be 100 characters or less')
    .optional(),
  designation: z
    .string()
    .trim()
    .min(1, 'Designation is required')
    .max(100, 'Designation must be 100 characters or less')
    .optional(),
  employmentType: z
    .enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'], {
      message: 'Employment type must be FULL_TIME, PART_TIME, CONTRACT, or INTERN',
    })
    .optional(),
});

export const employeeStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE'], {
    message: 'Status must be ACTIVE or INACTIVE',
  }),
});

export const employeeQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Page must be a positive number',
    }),
  limit: z
    .string()
    .optional()
    .default('20')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100, {
      message: 'Limit must be between 1 and 100',
    }),
  search: z.string().optional().default(''),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const employeeIdParamSchema = z.object({
  id: z.string().min(1, 'Employee ID is required'),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type EmployeeStatusInput = z.infer<typeof employeeStatusSchema>;
export type EmployeeQueryInput = z.infer<typeof employeeQuerySchema>;
