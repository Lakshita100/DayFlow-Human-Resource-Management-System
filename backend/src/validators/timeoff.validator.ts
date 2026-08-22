import { z } from 'zod';

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export const createTimeOffSchema = z.object({
  type: z.enum(['PAID', 'SICK', 'UNPAID'], {
    message: 'Type must be PAID, SICK, or UNPAID',
  }),
  startDate: dateOnly,
  endDate: dateOnly,
  reason: z.string().trim().max(500, 'Reason must be 500 characters or less').optional(),
});

export const timeOffListQuerySchema = z.object({
  employeeId: z.string().min(1).optional(),
  type: z.enum(['PAID', 'SICK', 'UNPAID']).optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']).optional(),
  search: z.string().optional().default(''),
  page: z
    .string()
    .optional()
    .default('1')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, { message: 'Page must be positive' }),
  limit: z
    .string()
    .optional()
    .default('20')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0 && Number(v) <= 100, {
      message: 'Limit must be between 1 and 100',
    }),
});

export const myTimeOffQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, { message: 'Page must be positive' }),
  limit: z
    .string()
    .optional()
    .default('20')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0 && Number(v) <= 100, {
      message: 'Limit must be between 1 and 100',
    }),
});

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const allocationsQuerySchema = z.object({
  year: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{4}$/.test(v), { message: 'Year must be a 4-digit number' }),
  page: z
    .string()
    .optional()
    .default('1')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, { message: 'Page must be positive' }),
  limit: z
    .string()
    .optional()
    .default('50')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0 && Number(v) <= 100, {
      message: 'Limit must be between 1 and 100',
    }),
});

export const adjustAllocationSchema = z.object({
  total: z
    .number({ message: 'Total must be a number' })
    .int('Total must be an integer')
    .min(0, 'Total cannot be negative'),
});

export type CreateTimeOffInput = z.infer<typeof createTimeOffSchema>;
