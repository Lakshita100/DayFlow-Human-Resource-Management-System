import { describe, it, expect } from 'vitest';
import {
  calculateSalary,
  DEFAULT_SALARY_COMPONENTS,
  SalaryComponentInput,
} from '../../../src/services/salary-calculation.engine.js';

describe('Salary Calculation Engine', () => {
  it('should accept 50,000 wage and calculate components accurately', () => {
    const result = calculateSalary({
      monthlyWage: 50000,
      components: DEFAULT_SALARY_COMPONENTS,
    });

    expect(result.monthlyWage).toBe('50000.00');
    expect(result.yearlyWage).toBe('600000.00');
    expect(result.workingDaysPerWeek).toBe(5);
    expect(result.breakTimeHours).toBe('1.00');

    const basic = result.components.find((c) => c.code === 'BASIC_SALARY');
    expect(basic?.amount).toBe('25000.00');

    const hra = result.components.find((c) => c.code === 'HRA');
    expect(hra?.amount).toBe('12500.00');

    const fixedAllowance = result.components.find((c) => c.code === 'FIXED_ALLOWANCE');
    expect(fixedAllowance?.amount).toBe('2918.00');
  });

  it('should accept 0 wage with no components or reject when components exceed wage', () => {
    const result = calculateSalary({
      monthlyWage: 0,
      components: [],
    });
    expect(result.monthlyWage).toBe('0.00');

    expect(() =>
      calculateSalary({
        monthlyWage: -50000,
        components: [],
      })
    ).toThrow('Monthly wage cannot be negative.');
  });

  it('should calculate Basic Salary as 50% of wage (25,000)', () => {
    const result = calculateSalary({
      monthlyWage: 50000,
      components: [
        {
          code: 'BASIC_SALARY',
          name: 'Basic Salary',
          calculationType: 'PERCENTAGE',
          calculationBasis: 'WAGE',
          value: 50,
        },
      ],
    });

    const basic = result.components.find((c) => c.code === 'BASIC_SALARY');
    expect(basic?.amount).toBe('25000.00');
  });

  it('should calculate HRA as 50% of Basic Salary (12,500)', () => {
    const result = calculateSalary({
      monthlyWage: 50000,
      components: [
        {
          code: 'BASIC_SALARY',
          name: 'Basic Salary',
          calculationType: 'PERCENTAGE',
          calculationBasis: 'WAGE',
          value: 50,
        },
        {
          code: 'HRA',
          name: 'House Rent Allowance',
          calculationType: 'PERCENTAGE',
          calculationBasis: 'BASIC_SALARY',
          value: 50,
        },
      ],
    });

    const hra = result.components.find((c) => c.code === 'HRA');
    expect(hra?.amount).toBe('12500.00');
  });

  it('should keep fixed component amount fixed when wage changes', () => {
    const components: SalaryComponentInput[] = [
      {
        code: 'FIXED_ALLOWANCE',
        name: 'Fixed Allowance',
        calculationType: 'FIXED_AMOUNT',
        calculationBasis: null,
        value: 2918,
      },
    ];

    const result50k = calculateSalary({ monthlyWage: 50000, components });
    expect(result50k.components[0].amount).toBe('2918.00');

    const result60k = calculateSalary({ monthlyWage: 60000, components });
    expect(result60k.components[0].amount).toBe('2918.00');
  });

  it('should recalculate percentage components automatically when wage changes (50,000 -> 60,000)', () => {
    const components: SalaryComponentInput[] = [
      {
        code: 'BASIC_SALARY',
        name: 'Basic Salary',
        calculationType: 'PERCENTAGE',
        calculationBasis: 'WAGE',
        value: 50,
      },
      {
        code: 'HRA',
        name: 'House Rent Allowance',
        calculationType: 'PERCENTAGE',
        calculationBasis: 'BASIC_SALARY',
        value: 50,
      },
    ];

    const result50k = calculateSalary({ monthlyWage: 50000, components });
    expect(result50k.components.find((c) => c.code === 'BASIC_SALARY')?.amount).toBe('25000.00');
    expect(result50k.components.find((c) => c.code === 'HRA')?.amount).toBe('15000.00' ? '12500.00' : '12500.00');

    const result60k = calculateSalary({ monthlyWage: 60000, components });
    expect(result60k.components.find((c) => c.code === 'BASIC_SALARY')?.amount).toBe('30000.00');
    expect(result60k.components.find((c) => c.code === 'HRA')?.amount).toBe('15000.00');
  });

  it('should reject when total components exceed wage', () => {
    const components: SalaryComponentInput[] = [
      {
        code: 'BASIC_SALARY',
        name: 'Basic Salary',
        calculationType: 'PERCENTAGE',
        calculationBasis: 'WAGE',
        value: 70,
      },
      {
        code: 'HRA',
        name: 'House Rent Allowance',
        calculationType: 'PERCENTAGE',
        calculationBasis: 'BASIC_SALARY',
        value: 60, // 60% of 70% = 42%, Total = 112% > 100%
      },
    ];

    expect(() =>
      calculateSalary({
        monthlyWage: 50000,
        components,
      })
    ).toThrow('Total salary components cannot exceed the defined wage.');
  });

  it('should calculate PF employee and employer contributions from basic salary', () => {
    const result = calculateSalary({
      monthlyWage: 50000,
      components: [
        {
          code: 'BASIC_SALARY',
          name: 'Basic Salary',
          calculationType: 'PERCENTAGE',
          calculationBasis: 'WAGE',
          value: 50, // 25,000
        },
      ],
      pf: {
        employeeRate: 12,
        employerRate: 12,
        isActive: true,
      },
    });

    expect(result.pf.employeeAmount).toBe('3000.00');
    expect(result.pf.employerAmount).toBe('3000.00');
  });

  it('should support Professional Tax', () => {
    const result = calculateSalary({
      monthlyWage: 50000,
      components: [],
      tax: {
        professionalTax: 200,
        isActive: true,
      },
    });

    expect(result.tax.professionalTax).toBe('200.00');
  });

  it('should reject circular component dependencies', () => {
    const components: SalaryComponentInput[] = [
      {
        code: 'COMP_A',
        name: 'Component A',
        calculationType: 'PERCENTAGE',
        calculationBasis: 'BASIC_SALARY', // depends on BASIC_SALARY (which is missing)
        value: 10,
      },
    ];

    expect(() =>
      calculateSalary({
        monthlyWage: 50000,
        components,
      })
    ).toThrow('Invalid salary component configuration.');
  });

  it('should reject duplicate component codes', () => {
    const components: SalaryComponentInput[] = [
      {
        code: 'BASIC_SALARY',
        name: 'Basic Salary 1',
        calculationType: 'FIXED_AMOUNT',
        value: 10000,
      },
      {
        code: 'BASIC_SALARY',
        name: 'Basic Salary 2',
        calculationType: 'FIXED_AMOUNT',
        value: 10000,
      },
    ];

    expect(() =>
      calculateSalary({
        monthlyWage: 50000,
        components,
      })
    ).toThrow('Duplicate component code');
  });
});
