import { salaryRepository } from '../repositories/salary.repository.js';
import {
  calculateSalary,
  DEFAULT_SALARY_COMPONENTS,
  CalculateSalaryInput,
  CalculatedSalaryResult,
  SalaryComponentInput,
  PFConfigInput,
  TaxConfigInput,
} from './salary-calculation.engine.js';
import { createError } from '../middleware/error.middleware.js';

export interface FullSalaryUpdateInput {
  monthlyWage?: number | string;
  wageType?: 'FIXED';
  workingDaysPerWeek?: number;
  breakTimeHours?: number | string;
  components?: SalaryComponentInput[];
  pf?: PFConfigInput;
  tax?: TaxConfigInput;
}

export const salaryService = {
  async getEmployeeSalary(identifier: string): Promise<{ employee: any; result: CalculatedSalaryResult }> {
    const employee = await salaryRepository.findEmployeeByIdOrEmployeeId(identifier);
    if (!employee) {
      throw createError('Employee not found.', 404, 'EMPLOYEE_NOT_FOUND');
    }

    const structure = await salaryRepository.findByEmployeeId(employee.id);
    if (!structure) {
      throw createError('Salary structure not found for this employee.', 404, 'SALARY_NOT_FOUND');
    }

    // Build calculation input from DB record to derive current dynamic result
    const calculationInput: CalculateSalaryInput = {
      monthlyWage: structure.monthlyWage.toString(),
      wageType: structure.wageType as 'FIXED',
      workingDaysPerWeek: structure.workingDaysPerWeek,
      breakTimeHours: structure.breakTimeHours.toString(),
      components: structure.components.map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        calculationType: c.calculationType as any,
        calculationBasis: c.calculationBasis as any,
        value: c.value.toString(),
        isActive: c.isActive,
        displayOrder: c.displayOrder,
      })),
      pf: structure.pfConfiguration
        ? {
            employeeRate: structure.pfConfiguration.employeeRate.toString(),
            employerRate: structure.pfConfiguration.employerRate.toString(),
            isActive: structure.pfConfiguration.isActive,
          }
        : undefined,
      tax: structure.taxConfiguration
        ? {
            professionalTax: structure.taxConfiguration.professionalTax.toString(),
            isActive: structure.taxConfiguration.isActive,
          }
        : undefined,
    };

    const result = calculateSalary(calculationInput);
    result.components = result.components.map((c, i) => ({
      ...c,
      id: structure.components[i]?.id || c.id,
    }));

    return {
      employee,
      result: {
        ...result,
        employeeId: employee.employeeId,
      },
    };
  },

  async updateSalaryStructure(
    identifier: string,
    input: FullSalaryUpdateInput
  ): Promise<{ employee: any; result: CalculatedSalaryResult }> {
    const employee = await salaryRepository.findEmployeeByIdOrEmployeeId(identifier);
    if (!employee) {
      throw createError('Employee not found.', 404, 'EMPLOYEE_NOT_FOUND');
    }

    const existingStructure = await salaryRepository.findByEmployeeId(employee.id);

    // Prepare components to calculate
    let componentsToUse: SalaryComponentInput[] = input.components || [];

    if (!input.components || input.components.length === 0) {
      if (existingStructure && existingStructure.components.length > 0) {
        componentsToUse = existingStructure.components.map((c) => ({
          id: c.id,
          code: c.code,
          name: c.name,
          calculationType: c.calculationType as any,
          calculationBasis: c.calculationBasis as any,
          value: c.value.toString(),
          isActive: c.isActive,
          displayOrder: c.displayOrder,
        }));
      } else {
        componentsToUse = DEFAULT_SALARY_COMPONENTS;
      }
    }

    const monthlyWageToUse =
      input.monthlyWage !== undefined
        ? input.monthlyWage
        : existingStructure
        ? existingStructure.monthlyWage.toString()
        : '0.00';

    const pfToUse: PFConfigInput = {
      employeeRate:
        input.pf?.employeeRate !== undefined
          ? input.pf.employeeRate
          : existingStructure?.pfConfiguration?.employeeRate.toString() ?? '12.00',
      employerRate:
        input.pf?.employerRate !== undefined
          ? input.pf.employerRate
          : existingStructure?.pfConfiguration?.employerRate.toString() ?? '12.00',
      isActive:
        input.pf?.isActive !== undefined
          ? input.pf.isActive
          : existingStructure?.pfConfiguration?.isActive ?? true,
    };

    const taxToUse: TaxConfigInput = {
      professionalTax:
        input.tax?.professionalTax !== undefined
          ? input.tax.professionalTax
          : existingStructure?.taxConfiguration?.professionalTax.toString() ?? '200.00',
      isActive:
        input.tax?.isActive !== undefined
          ? input.tax.isActive
          : existingStructure?.taxConfiguration?.isActive ?? true,
    };

    const calculationInput: CalculateSalaryInput = {
      monthlyWage: monthlyWageToUse,
      wageType: input.wageType || 'FIXED',
      workingDaysPerWeek:
        input.workingDaysPerWeek ?? existingStructure?.workingDaysPerWeek ?? 5,
      breakTimeHours:
        input.breakTimeHours ?? existingStructure?.breakTimeHours.toString() ?? '1.00',
      components: componentsToUse,
      pf: pfToUse,
      tax: taxToUse,
    };

    // Calculate (will throw validation errors if invalid/exceeds wage)
    const result = calculateSalary(calculationInput);

    // Save transactionally
    await salaryRepository.saveSalaryStructure(employee.id, result);

    return {
      employee,
      result: {
        ...result,
        employeeId: employee.employeeId,
      },
    };
  },

  async updateComponents(
    identifier: string,
    components: SalaryComponentInput[]
  ) {
    return this.updateSalaryStructure(identifier, { components });
  },

  async updatePF(identifier: string, pf: PFConfigInput) {
    return this.updateSalaryStructure(identifier, { pf });
  },

  async updateTax(identifier: string, tax: TaxConfigInput) {
    return this.updateSalaryStructure(identifier, { tax });
  },
};
