import { Response } from 'express';
import { employeeService } from '../services/employee.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { asyncHandler } from '../utils/async-handler.js';
import type { AuthRequest } from '../types/index.js';

function getString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') return value[0];
  return undefined;
}

export const listEmployees = asyncHandler(async (req: AuthRequest, res: Response) => {
  const companyId = req.user!.companyId!;
  const result = await employeeService.listEmployees(companyId, {
    page: getString(req.query.page) || '1',
    limit: getString(req.query.limit) || '20',
    search: getString(req.query.search) || '',
    status: getString(req.query.status) as 'ACTIVE' | 'INACTIVE' | undefined,
  });
  sendSuccess(res, result);
});

export const getEmployeeById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const companyId = req.user!.companyId!;
  const id = getString(req.params.id);
  if (!id) {
    res.status(400).json({ success: false, message: 'Employee ID is required' });
    return;
  }
  const employee = await employeeService.getEmployeeById(id, companyId);
  sendSuccess(res, employee);
});

export const getCurrentEmployee = asyncHandler(async (req: AuthRequest, res: Response) => {
  const employee = await employeeService.getCurrentEmployee(req.user!.id);
  sendSuccess(res, employee);
});

export const createEmployee = asyncHandler(async (req: AuthRequest, res: Response) => {
  const companyId = req.user!.companyId!;
  const result = await employeeService.createEmployee(companyId, req.body);
  sendCreated(res, result);
});

export const updateEmployee = asyncHandler(async (req: AuthRequest, res: Response) => {
  const companyId = req.user!.companyId!;
  const id = getString(req.params.id);
  if (!id) {
    res.status(400).json({ success: false, message: 'Employee ID is required' });
    return;
  }
  const employee = await employeeService.updateEmployee(id, companyId, req.body);
  sendSuccess(res, employee);
});

export const updateEmployeeStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const companyId = req.user!.companyId!;
  const id = getString(req.params.id);
  if (!id) {
    res.status(400).json({ success: false, message: 'Employee ID is required' });
    return;
  }
  const { status } = req.body;
  const employee = await employeeService.updateEmployeeStatus(id, companyId, status);
  sendSuccess(res, employee);
});

export const getCompanyStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const companyId = req.user!.companyId!;
  const stats = await employeeService.getCompanyStats(companyId);
  sendSuccess(res, stats);
});
