import { Response, NextFunction } from 'express';
import { salaryService } from '../services/salary.service.js';
import { salaryRepository } from '../repositories/salary.repository.js';
import { sendSuccess } from '../utils/response.js';
import { createError } from '../middleware/error.middleware.js';
import type { AuthRequest } from '../types/index.js';
import { Role } from '@prisma/client';

function getEmployeeIdParam(req: AuthRequest): string {
  const param = req.params.employeeId;
  if (!param) {
    throw createError('Employee ID is required', 400);
  }
  return Array.isArray(param) ? param[0] : param;
}

export const salaryController = {
  async getSalary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = getEmployeeIdParam(req);

      // 1. Find employee
      const employee = await salaryRepository.findEmployeeByIdOrEmployeeId(employeeId);
      if (!employee) {
        throw createError('Employee not found.', 404, 'EMPLOYEE_NOT_FOUND');
      }

      // 2. Authorization check: Employee can only view their own salary
      if (
        req.user &&
        req.user.role === Role.EMPLOYEE &&
        employee.userId !== req.user.id
      ) {
        throw createError('Insufficient permissions to view this salary', 403);
      }

      // 3. Get salary structure
      const { result } = await salaryService.getEmployeeSalary(employeeId);

      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },

  async updateSalary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = getEmployeeIdParam(req);
      const { result } = await salaryService.updateSalaryStructure(employeeId, req.body);
      sendSuccess(res, result, 'Salary structure updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateComponents(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = getEmployeeIdParam(req);
      const { result } = await salaryService.updateComponents(employeeId, req.body.components);
      sendSuccess(res, result, 'Salary components updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async updatePF(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = getEmployeeIdParam(req);
      const { result } = await salaryService.updatePF(employeeId, req.body);
      sendSuccess(res, result, 'PF configuration updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateTax(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = getEmployeeIdParam(req);
      const { result } = await salaryService.updateTax(employeeId, req.body);
      sendSuccess(res, result, 'Tax configuration updated successfully');
    } catch (error) {
      next(error);
    }
  },
};
