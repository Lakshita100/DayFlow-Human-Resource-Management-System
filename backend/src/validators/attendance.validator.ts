import { z } from 'zod';

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

const isoTimestamp = z
  .string()
  .refine((v) => !isNaN(Date.parse(v)), { message: 'Must be a valid ISO timestamp' });

export const attendanceListQuerySchema = z.object({
  date: dateOnly.optional(),
  from: dateOnly.optional(),
  to: dateOnly.optional(),
  employeeId: z.string().min(1).optional(),
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

export const myAttendanceQuerySchema = z.object({
  from: dateOnly.optional(),
  to: dateOnly.optional(),
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

export const monthlyQuerySchema = z.object({
  year: z
    .string()
    .optional()
    .refine((v) => /^\d{4}$/.test(v ?? ''), { message: 'Year must be a 4-digit number' }),
  month: z
    .string()
    .optional()
    .refine((v) => {
      const n = Number(v);
      return !isNaN(n) && n >= 1 && n <= 12;
    }, { message: 'Month must be between 1 and 12' }),
});

export const summaryQuerySchema = z.object({
  date: dateOnly.optional(),
});

export const attendanceCorrectionSchema = z
  .object({
    checkIn: isoTimestamp.optional(),
    checkOut: isoTimestamp.nullable().optional(),
    status: z.enum(['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export type AttendanceListQuery = z.infer<typeof attendanceListQuerySchema>;
export type MyAttendanceQuery = z.infer<typeof myAttendanceQuerySchema>;
export type AttendanceCorrectionInput = z.infer<typeof attendanceCorrectionSchema>;
