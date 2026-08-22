import { Prisma } from '@prisma/client';
import { createError } from '../middleware/error.middleware.js';

export type CalculationType = 'FIXED_AMOUNT' | 'PERCENTAGE';
export type CalculationBasis = 'WAGE' | 'BASIC_SALARY' | 'GROSS_SALARY';
export type WageType = 'FIXED';

export interface SalaryComponentInput {
  id?: string;
  code: string;
  name: string;
  calculationType: CalculationType;
  calculationBasis?: CalculationBasis | null;
  value: number | string | Prisma.Decimal;
  isActive?: boolean;
  displayOrder?: number;
}

export interface PFConfigInput {
  employeeRate?: number | string | Prisma.Decimal;
  employerRate?: number | string | Prisma.Decimal;
  isActive?: boolean;
}

export interface TaxConfigInput {
  professionalTax?: number | string | Prisma.Decimal;
  isActive?: boolean;
}

export interface CalculateSalaryInput {
  monthlyWage: number | string | Prisma.Decimal;
  wageType?: WageType;
  workingDaysPerWeek?: number;
  breakTimeHours?: number | string | Prisma.Decimal;
  components: SalaryComponentInput[];
  pf?: PFConfigInput;
  tax?: TaxConfigInput;
}

export interface CalculatedComponent {
  id?: string;
  code: string;
  name: string;
  calculationType: CalculationType;
  calculationBasis?: CalculationBasis | null;
  value: string;
  amount: string;
  isActive: boolean;
  displayOrder: number;
}

export interface CalculatedSalaryResult {
  employeeId?: string;
  wageType: WageType;
  monthlyWage: string;
  yearlyWage: string;
  workingDaysPerWeek: number;
  breakTimeHours: string;
  components: CalculatedComponent[];
  totalComponents: string;
  remainingAmount: string;
  pf: {
    employeeRate: string;
    employeeAmount: string;
    employerRate: string;
    employerAmount: string;
    isActive: boolean;
  };
  tax: {
    professionalTax: string;
    isActive: boolean;
  };
}

function toDecimal(val: number | string | Prisma.Decimal): Prisma.Decimal {
  try {
    if (val instanceof Prisma.Decimal) return val;
    const dec = new Prisma.Decimal(val);
    if (dec.isNaN()) {
      throw new Error('NaN');
    }
    return dec;
  } catch {
    throw createError('Invalid numeric format', 400, 'VALIDATION_ERROR');
  }
}

export function calculateSalary(input: CalculateSalaryInput): CalculatedSalaryResult {
  const wageType: WageType = input.wageType || 'FIXED';
  const monthlyWageDecimal = toDecimal(input.monthlyWage);

  if (monthlyWageDecimal.isNegative()) {
    throw createError('Monthly wage cannot be negative.', 400, 'VALIDATION_ERROR');
  }
  if (monthlyWageDecimal.isZero() && input.monthlyWage !== 0 && input.monthlyWage !== '0') {
    throw createError('Monthly wage must be positive.', 400, 'VALIDATION_ERROR');
  }

  const yearlyWageDecimal = monthlyWageDecimal.mul(12).toDecimalPlaces(2);
  const workingDaysPerWeek = input.workingDaysPerWeek ?? 5;
  const breakTimeHoursDecimal = toDecimal(input.breakTimeHours ?? '1.00').toDecimalPlaces(2);

  // Validate duplicate component codes
  const codeSet = new Set<string>();
  for (const comp of input.components) {
    if (!comp.code || comp.code.trim() === '') {
      throw createError('Component code cannot be empty.', 400, 'VALIDATION_ERROR');
    }
    const upperCode = comp.code.trim().toUpperCase();
    if (codeSet.has(upperCode)) {
      throw createError(`Duplicate component code: ${comp.code}`, 400, 'DUPLICATE_COMPONENT');
    }
    codeSet.add(upperCode);
  }

  // Component calculation
  const computedMap = new Map<string, Prisma.Decimal>();
  const calculatedComponents: CalculatedComponent[] = [];

  // Sort components by displayOrder if available
  const sortedComponents = [...input.components].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  // Dependency Resolution / Multi-pass
  // Check for circular dependency: e.g. A depends on B and B depends on A
  // We'll perform up to max passes equal to number of components
  const activeComponents = sortedComponents.filter((c) => c.isActive !== false);
  const uncomputed = [...activeComponents];
  let iterations = 0;
  const maxIterations = activeComponents.length + 2;

  while (uncomputed.length > 0 && iterations < maxIterations) {
    iterations++;
    let progress = false;

    for (let i = uncomputed.length - 1; i >= 0; i--) {
      const comp = uncomputed[i];
      const valDecimal = toDecimal(comp.value);

      if (valDecimal.isNegative()) {
        throw createError(`Component ${comp.code} value cannot be negative.`, 400, 'VALIDATION_ERROR');
      }

      let amountDecimal: Prisma.Decimal | null = null;

      if (comp.calculationType === 'FIXED_AMOUNT') {
        amountDecimal = valDecimal.toDecimalPlaces(2);
      } else if (comp.calculationType === 'PERCENTAGE') {
        const basis = comp.calculationBasis || 'WAGE';

        if (basis === 'WAGE') {
          amountDecimal = monthlyWageDecimal.mul(valDecimal).div(100).toDecimalPlaces(2);
        } else if (basis === 'BASIC_SALARY') {
          const basicAmount = computedMap.get('BASIC_SALARY');
          if (basicAmount !== undefined) {
            amountDecimal = basicAmount.mul(valDecimal).div(100).toDecimalPlaces(2);
          }
          // If basicAmount is not ready yet, keep in uncomputed for next pass
        } else if (basis === 'GROSS_SALARY') {
          // Gross salary calculation basis (monthly wage)
          amountDecimal = monthlyWageDecimal.mul(valDecimal).div(100).toDecimalPlaces(2);
        } else {
          throw createError(`Unsupported calculation basis: ${basis}`, 400, 'INVALID_COMPONENT_DEPENDENCY');
        }
      }

      if (amountDecimal !== null) {
        computedMap.set(comp.code.trim().toUpperCase(), amountDecimal);
        uncomputed.splice(i, 1);
        progress = true;
      }
    }

    if (!progress && uncomputed.length > 0) {
      // Cannot resolve remaining dependencies -> Circular or missing dependency!
      throw createError('Invalid salary component configuration.', 400, 'INVALID_COMPONENT_DEPENDENCY');
    }
  }

  // Format component results
  let totalComponentsDecimal = new Prisma.Decimal(0);

  for (const comp of sortedComponents) {
    const isActive = comp.isActive !== false;
    const valDecimal = toDecimal(comp.value).toDecimalPlaces(2);
    const upperCode = comp.code.trim().toUpperCase();
    const amountDecimal = isActive
      ? computedMap.get(upperCode) || new Prisma.Decimal(0)
      : new Prisma.Decimal(0);

    if (isActive) {
      totalComponentsDecimal = totalComponentsDecimal.add(amountDecimal);
    }

    calculatedComponents.push({
      id: comp.id,
      code: comp.code,
      name: comp.name,
      calculationType: comp.calculationType,
      calculationBasis: comp.calculationBasis || null,
      value: valDecimal.toFixed(2),
      amount: amountDecimal.toFixed(2),
      isActive,
      displayOrder: comp.displayOrder ?? 0,
    });
  }

  // Validate total components against wage
  if (totalComponentsDecimal.greaterThan(monthlyWageDecimal)) {
    throw createError(
      'Total salary components cannot exceed the defined wage.',
      400,
      'SALARY_COMPONENT_TOTAL_EXCEEDS_WAGE'
    );
  }

  const remainingAmountDecimal = monthlyWageDecimal.sub(totalComponentsDecimal).toDecimalPlaces(2);

  // PF Calculation
  const pfIsActive = input.pf?.isActive !== false;
  const pfEmployeeRate = toDecimal(input.pf?.employeeRate ?? 12.00);
  const pfEmployerRate = toDecimal(input.pf?.employerRate ?? 12.00);

  if (pfEmployeeRate.isNegative() || pfEmployeeRate.greaterThan(100)) {
    throw createError('Invalid employee PF rate.', 400, 'VALIDATION_ERROR');
  }
  if (pfEmployerRate.isNegative() || pfEmployerRate.greaterThan(100)) {
    throw createError('Invalid employer PF rate.', 400, 'VALIDATION_ERROR');
  }

  const basicSalaryAmount = computedMap.get('BASIC_SALARY') || new Prisma.Decimal(0);
  const pfEmployeeAmount = pfIsActive
    ? basicSalaryAmount.mul(pfEmployeeRate).div(100).toDecimalPlaces(2)
    : new Prisma.Decimal(0);
  const pfEmployerAmount = pfIsActive
    ? basicSalaryAmount.mul(pfEmployerRate).div(100).toDecimalPlaces(2)
    : new Prisma.Decimal(0);

  // Professional Tax
  const taxIsActive = input.tax?.isActive !== false;
  const professionalTaxVal = toDecimal(input.tax?.professionalTax ?? 200.00);

  if (professionalTaxVal.isNegative()) {
    throw createError('Professional Tax cannot be negative.', 400, 'VALIDATION_ERROR');
  }

  const professionalTaxAmount = taxIsActive
    ? professionalTaxVal.toDecimalPlaces(2)
    : new Prisma.Decimal(0);

  return {
    wageType,
    monthlyWage: monthlyWageDecimal.toFixed(2),
    yearlyWage: yearlyWageDecimal.toFixed(2),
    workingDaysPerWeek,
    breakTimeHours: breakTimeHoursDecimal.toFixed(2),
    components: calculatedComponents,
    totalComponents: totalComponentsDecimal.toFixed(2),
    remainingAmount: remainingAmountDecimal.toFixed(2),
    pf: {
      employeeRate: pfEmployeeRate.toFixed(2),
      employeeAmount: pfEmployeeAmount.toFixed(2),
      employerRate: pfEmployerRate.toFixed(2),
      employerAmount: pfEmployerAmount.toFixed(2),
      isActive: pfIsActive,
    },
    tax: {
      professionalTax: professionalTaxAmount.toFixed(2),
      isActive: taxIsActive,
    },
  };
}

export const DEFAULT_SALARY_COMPONENTS: SalaryComponentInput[] = [
  {
    code: 'BASIC_SALARY',
    name: 'Basic Salary',
    calculationType: 'PERCENTAGE',
    calculationBasis: 'WAGE',
    value: '50.00',
    isActive: true,
    displayOrder: 1,
  },
  {
    code: 'HRA',
    name: 'House Rent Allowance',
    calculationType: 'PERCENTAGE',
    calculationBasis: 'BASIC_SALARY',
    value: '50.00',
    isActive: true,
    displayOrder: 2,
  },
  {
    code: 'STANDARD_ALLOWANCE',
    name: 'Standard Allowance',
    calculationType: 'FIXED_AMOUNT',
    calculationBasis: null,
    value: '4167.00',
    isActive: true,
    displayOrder: 3,
  },
  {
    code: 'PERFORMANCE_BONUS',
    name: 'Performance Bonus',
    calculationType: 'PERCENTAGE',
    calculationBasis: 'WAGE',
    value: '4.165',
    isActive: true,
    displayOrder: 4,
  },
  {
    code: 'LTA',
    name: 'Leave Travel Allowance',
    calculationType: 'PERCENTAGE',
    calculationBasis: 'WAGE',
    value: '4.165',
    isActive: true,
    displayOrder: 5,
  },
  {
    code: 'FIXED_ALLOWANCE',
    name: 'Fixed Allowance',
    calculationType: 'FIXED_AMOUNT',
    calculationBasis: null,
    value: '2918.00',
    isActive: true,
    displayOrder: 6,
  },
];
