import { z } from 'zod';

export const attendanceQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  month: z.string().optional(),
  year: z.string().optional(),
  date: z.string().optional(),
  status: z.enum(['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE']).optional(),
  employeeId: z.string().optional(),
});

export type AttendanceQueryInput = z.infer<typeof attendanceQuerySchema>;
