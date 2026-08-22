import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';
import { CalculatedSalaryResult } from '../services/salary-calculation.engine.js';

export const salaryRepository = {
  async findEmployeeByIdOrEmployeeId(identifier: string) {
    return prisma.employee.findFirst({
      where: {
        OR: [{ id: identifier }, { employeeId: identifier }],
      },
      include: {
        user: true,
      },
    });
  },

  async findByEmployeeId(employeeId: string) {
    return prisma.salaryStructure.findUnique({
      where: { employeeId },
      include: {
        components: {
          orderBy: { displayOrder: 'asc' },
        },
        pfConfiguration: true,
        taxConfiguration: true,
      },
    });
  },

  async saveSalaryStructure(
    employeeId: string,
    result: CalculatedSalaryResult
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Upsert SalaryStructure
      const structure = await tx.salaryStructure.upsert({
        where: { employeeId },
        create: {
          employeeId,
          wageType: result.wageType,
          monthlyWage: new Prisma.Decimal(result.monthlyWage),
          workingDaysPerWeek: result.workingDaysPerWeek,
          breakTimeHours: new Prisma.Decimal(result.breakTimeHours),
        },
        update: {
          wageType: result.wageType,
          monthlyWage: new Prisma.Decimal(result.monthlyWage),
          workingDaysPerWeek: result.workingDaysPerWeek,
          breakTimeHours: new Prisma.Decimal(result.breakTimeHours),
        },
      });

      // 2. Replace SalaryComponents
      await tx.salaryComponent.deleteMany({
        where: { salaryStructureId: structure.id },
      });

      await tx.salaryComponent.createMany({
        data: result.components.map((c) => ({
          salaryStructureId: structure.id,
          code: c.code,
          name: c.name,
          calculationType: c.calculationType,
          calculationBasis: c.calculationBasis || null,
          value: new Prisma.Decimal(c.value),
          amount: new Prisma.Decimal(c.amount),
          isActive: c.isActive,
          displayOrder: c.displayOrder,
        })),
      });

      // 3. Upsert PFConfiguration
      await tx.pFConfiguration.upsert({
        where: { salaryStructureId: structure.id },
        create: {
          salaryStructureId: structure.id,
          employeeRate: new Prisma.Decimal(result.pf.employeeRate),
          employerRate: new Prisma.Decimal(result.pf.employerRate),
          isActive: result.pf.isActive,
        },
        update: {
          employeeRate: new Prisma.Decimal(result.pf.employeeRate),
          employerRate: new Prisma.Decimal(result.pf.employerRate),
          isActive: result.pf.isActive,
        },
      });

      // 4. Upsert TaxConfiguration
      await tx.taxConfiguration.upsert({
        where: { salaryStructureId: structure.id },
        create: {
          salaryStructureId: structure.id,
          professionalTax: new Prisma.Decimal(result.tax.professionalTax),
          isActive: result.tax.isActive,
        },
        update: {
          professionalTax: new Prisma.Decimal(result.tax.professionalTax),
          isActive: result.tax.isActive,
        },
      });

      // Fetch fresh record with relations
      return tx.salaryStructure.findUnique({
        where: { id: structure.id },
        include: {
          components: {
            orderBy: { displayOrder: 'asc' },
          },
          pfConfiguration: true,
          taxConfiguration: true,
        },
      });
    });
  },
};
