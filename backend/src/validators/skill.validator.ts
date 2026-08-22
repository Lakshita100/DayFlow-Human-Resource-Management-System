import { z } from 'zod';

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

export const skillUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Skill name is required')
    .max(100, 'Skill name must be 100 characters or less')
    .optional(),
  category: z
    .string()
    .trim()
    .max(50, 'Category must be 50 characters or less')
    .optional(),
});

export const skillIdParamSchema = z.object({
  id: z.string().min(1, 'Skill ID is required'),
});

export const skillQuerySchema = z.object({
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
});

export const skillAssignSchema = z.object({
  skillId: z.string().min(1, 'Skill ID is required'),
  proficiency: z
    .string()
    .trim()
    .max(20, 'Proficiency must be 20 characters or less')
    .optional(),
});

export type SkillCreateInput = z.infer<typeof skillCreateSchema>;
export type SkillUpdateInput = z.infer<typeof skillUpdateSchema>;
export type SkillAssignInput = z.infer<typeof skillAssignSchema>;
export type SkillQueryInput = z.infer<typeof skillQuerySchema>;