import { z } from 'zod';

const nameRegex = /^[a-zA-Z\s.'-]+$/;
const phoneRegex = /^\+?[\d\s\-().]{7,20}$/;

export const profilePublicSchema = z.object({
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
    .regex(phoneRegex, 'Phone number format is invalid')
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
  dateOfJoining: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Please enter a valid date' })
    .optional(),
  employmentType: z
    .enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'], {
      message: 'Employment type must be FULL_TIME, PART_TIME, CONTRACT, or INTERN',
    })
    .optional(),
});

export const profilePrivateSchema = z.object({
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Please enter a valid date' })
    .optional(),
  gender: z
    .string()
    .trim()
    .max(20, 'Gender must be 20 characters or less')
    .optional(),
  address: z
    .string()
    .trim()
    .max(200, 'Address must be 200 characters or less')
    .optional(),
  city: z
    .string()
    .trim()
    .max(100, 'City must be 100 characters or less')
    .optional(),
  state: z
    .string()
    .trim()
    .max(100, 'State must be 100 characters or less')
    .optional(),
  zipCode: z
    .string()
    .trim()
    .max(20, 'Zip code must be 20 characters or less')
    .optional(),
  country: z
    .string()
    .trim()
    .max(100, 'Country must be 100 characters or less')
    .optional(),
});

export const profilePrivateAdminSchema = profilePrivateSchema.extend({
  emergencyContactName: z
    .string()
    .trim()
    .max(100, 'Emergency contact name must be 100 characters or less')
    .optional(),
  emergencyContactPhone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Phone number format is invalid')
    .optional()
    .or(z.literal('')),
});

export const profilePrivateEmployeeSchema = profilePrivateSchema.extend({
  emergencyContactName: z
    .string()
    .trim()
    .max(100, 'Emergency contact name must be 100 characters or less')
    .optional(),
  emergencyContactPhone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Phone number format is invalid')
    .optional()
    .or(z.literal('')),
});

export const employeeIdParamSchema = z.object({
  id: z.string().min(1, 'Employee ID is required'),
});

export const skillIdParamSchema = z.object({
  id: z.string().min(1, 'Skill ID is required'),
});

export const skillCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Skill name is required')
    .max(100, 'Skill name must be 100 characters or less'),
  category: z
    .string()
    .trim()
    .max(50, 'Category must be 50 characters or less')
    .optional(),
});

export const skillAssignSchema = z.object({
  skillId: z.string().min(1, 'Skill ID is required'),
  proficiency: z
    .string()
    .trim()
    .max(20, 'Proficiency must be 20 characters or less')
    .optional(),
});

export const documentIdParamSchema = z.object({
  id: z.string().min(1, 'Document ID is required'),
});

export const documentCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Document name is required')
    .max(200, 'Document name must be 200 characters or less'),
  type: z
    .string()
    .trim()
    .min(1, 'Document type is required')
    .max(50, 'Document type must be 50 characters or less'),
});

export type ProfilePublicInput = z.infer<typeof profilePublicSchema>;
export type ProfilePrivateInput = z.infer<typeof profilePrivateSchema>;
export type ProfilePrivateAdminInput = z.infer<typeof profilePrivateAdminSchema>;
export type ProfilePrivateEmployeeInput = z.infer<typeof profilePrivateEmployeeSchema>;
export type SkillCreateInput = z.infer<typeof skillCreateSchema>;
export type SkillAssignInput = z.infer<typeof skillAssignSchema>;
export type DocumentCreateInput = z.infer<typeof documentCreateSchema>;