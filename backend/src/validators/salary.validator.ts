import { z } from 'zod';

const numberOrString = z.union([
  z.number(),
  z.string().regex(/^-?\d+(\.\d+)?$/, 'Must be a valid number'),
]);

export const salaryComponentSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, 'Component code is required'),
  name: z.string().min(1, 'Component name is required'),
  calculationType: z.enum(['FIXED_AMOUNT', 'PERCENTAGE']),
  calculationBasis: z.enum(['WAGE', 'BASIC_SALARY', 'GROSS_SALARY']).nullable().optional(),
  value: numberOrString,
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export const pfConfigSchema = z.object({
  employeeRate: numberOrString.optional(),
  employerRate: numberOrString.optional(),
  isActive: z.boolean().optional(),
});

export const taxConfigSchema = z.object({
  professionalTax: numberOrString.optional(),
  isActive: z.boolean().optional(),
});

export const updateSalarySchema = z.object({
  monthlyWage: numberOrString.optional(),
  wageType: z.enum(['FIXED']).optional(),
  workingDaysPerWeek: z.number().int().min(1).max(7).optional(),
  breakTimeHours: numberOrString.optional(),
  components: z.array(salaryComponentSchema).optional(),
  pf: pfConfigSchema.optional(),
  tax: taxConfigSchema.optional(),
});

export const updateComponentsSchema = z.object({
  components: z.array(salaryComponentSchema).min(1, 'At least one component is required'),
});

export const updatePFSchema = pfConfigSchema;

export const updateTaxSchema = taxConfigSchema;
