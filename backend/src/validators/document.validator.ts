import { z } from 'zod';

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

export const documentIdParamSchema = z.object({
  id: z.string().min(1, 'Document ID is required'),
});

export const documentQuerySchema = z.object({
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
});

export type DocumentCreateInput = z.infer<typeof documentCreateSchema>;
export type DocumentQueryInput = z.infer<typeof documentQuerySchema>;