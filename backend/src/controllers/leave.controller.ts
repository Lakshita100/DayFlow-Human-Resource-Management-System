import { Response } from 'express';
import { leaveService } from '../services/leave.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { asyncHandler } from '../utils/async-handler.js';
import type { AuthRequest } from '../types/index.js';
import { LeaveStatus } from '@prisma/client';

export const getLeaveBalance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await leaveService.getLeaveBalance(req.user!.id);
  sendSuccess(res, result);
});

export const createLeaveRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await leaveService.createLeaveRequest(req.user!.id, req.body);
  sendCreated(res, result, 'Leave request submitted successfully');
});

export const getLeaveRequests = asyncHandler(async (req: AuthRequest, res: Response) => {
  const companyId = req.user!.companyId!;
  const result = await leaveService.getLeaveRequests(companyId, req.query as any);
  sendSuccess(res, result);
});

export const approveLeaveRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const rawId = req.params.id;
  const id = typeof rawId === 'string' ? rawId : (Array.isArray(rawId) ? rawId[0] : '');
  if (!id) {
    res.status(400).json({ success: false, message: 'Request ID is required' });
    return;
  }
  const result = await leaveService.updateLeaveStatus(id, LeaveStatus.APPROVED, req.user!.id);
  sendSuccess(res, result, 'Leave request approved');
});

export const rejectLeaveRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const rawId = req.params.id;
  const id = typeof rawId === 'string' ? rawId : (Array.isArray(rawId) ? rawId[0] : '');
  if (!id) {
    res.status(400).json({ success: false, message: 'Request ID is required' });
    return;
  }
  const result = await leaveService.updateLeaveStatus(id, LeaveStatus.REJECTED, req.user!.id);
  sendSuccess(res, result, 'Leave request rejected');
});
