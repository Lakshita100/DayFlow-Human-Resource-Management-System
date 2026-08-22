import { Response } from 'express';
import { timeOffService } from '../services/timeoff.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { asyncHandler } from '../utils/async-handler.js';
import type { AuthRequest } from '../types/index.js';
import type { LeaveStatus, LeaveType } from '@prisma/client';

function getString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') return value[0];
  return undefined;
}

export const createRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await timeOffService.createRequest(req.user!.id, req.user!.companyId!, req.body);
  sendCreated(res, result, 'Time-off request submitted');
});

export const getMyRequests = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await timeOffService.getMyRequests(req.user!.id, req.user!.companyId!, {
    page: getString(req.query.page),
    limit: getString(req.query.limit),
  });
  sendSuccess(res, result);
});

export const getMyRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  const result = await timeOffService.getMyRequest(id, req.user!.id, req.user!.companyId!);
  sendSuccess(res, result);
});

export const listCompanyRequests = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await timeOffService.listCompanyRequests(req.user!.companyId!, {
    employeeId: getString(req.query.employeeId),
    type: getString(req.query.type) as LeaveType | undefined,
    status: getString(req.query.status) as LeaveStatus | undefined,
    search: getString(req.query.search),
    page: getString(req.query.page),
    limit: getString(req.query.limit),
  });
  sendSuccess(res, result);
});

export const getRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  const result = await timeOffService.getRequest(id, req.user!.companyId!);
  sendSuccess(res, result);
});

export const approveRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  const result = await timeOffService.approve(id, req.user!.id, req.user!.companyId!);
  sendSuccess(res, result, 'Time-off request approved');
});

export const rejectRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  const result = await timeOffService.reject(id, req.user!.id, req.user!.companyId!);
  sendSuccess(res, result, 'Time-off request rejected');
});

export const cancelRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  const result = await timeOffService.cancel(
    id,
    req.user!.id,
    req.user!.role,
    req.user!.companyId!
  );
  sendSuccess(res, result, 'Time-off request cancelled');
});

export const getMyAllocations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const yearStr = getString(req.query.year);
  const year = yearStr ? Number(yearStr) : undefined;
  const result = await timeOffService.getMyAllocations(req.user!.id, req.user!.companyId!, year);
  sendSuccess(res, result);
});

export const listCompanyAllocations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const year = Number(getString(req.query.year)) || new Date().getUTCFullYear();
  const page = Number(getString(req.query.page)) || 1;
  const limit = Number(getString(req.query.limit)) || 50;
  const result = await timeOffService.listCompanyAllocations(req.user!.companyId!, year, page, limit);
  sendSuccess(res, result);
});

export const adjustAllocation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  const result = await timeOffService.adjustAllocation(id, req.user!.companyId!, req.body.total);
  sendSuccess(res, result, 'Allocation updated');
});
