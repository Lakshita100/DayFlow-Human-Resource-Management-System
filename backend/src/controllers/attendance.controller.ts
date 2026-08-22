import { Response } from 'express';
import { attendanceService } from '../services/attendance.service.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/async-handler.js';
import type { AuthRequest } from '../types/index.js';

export const checkIn = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await attendanceService.checkIn(req.user!.id);
  sendSuccess(res, result, 'Check-in successful');
});

export const checkOut = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await attendanceService.checkOut(req.user!.id);
  sendSuccess(res, result, 'Check-out successful');
});

export const getTodayAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await attendanceService.getTodayAttendance(req.user!.id);
  sendSuccess(res, result);
});

export const getAttendanceRecords = asyncHandler(async (req: AuthRequest, res: Response) => {
  const companyId = req.user!.companyId!;
  const result = await attendanceService.getAttendanceRecords(companyId, req.query as any);
  sendSuccess(res, result);
});

export const getMonthlyOverview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const companyId = req.user!.companyId!;
  const month = parseInt(req.query.month as string || String(new Date().getMonth() + 1), 10);
  const year = parseInt(req.query.year as string || String(new Date().getFullYear()), 10);
  const result = await attendanceService.getMonthlyOverview(companyId, month, year);
  sendSuccess(res, result);
});
