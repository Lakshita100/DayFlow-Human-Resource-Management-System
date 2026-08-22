import { z } from 'zod';

export const createLeaveSchema = z.object({
  leaveType: z.enum(['PAID', 'SICK', 'UNPAID'], {
    message: 'Leave type must be PAID, SICK, or UNPAID',
  }),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().optional(),
});

export const leaveQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  type: z.enum(['PAID', 'SICK', 'UNPAID']).optional(),
});

export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;
export type LeaveQueryInput = z.infer<typeof leaveQuerySchema>;
