import { Response } from 'express';
import { attendanceService } from '../services/attendance.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { asyncHandler } from '../utils/async-handler.js';
import type { AuthRequest } from '../types/index.js';

function getString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') return value[0];
  return undefined;
}

export const checkIn = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await attendanceService.checkIn(req.user!.id, req.user!.companyId!);
  sendCreated(res, result, 'Checked in successfully');
});

export const checkOut = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await attendanceService.checkOut(req.user!.id, req.user!.companyId!);
  sendSuccess(res, result, 'Checked out successfully');
});

export const getMyAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await attendanceService.getMyRecords(req.user!.id, req.user!.companyId!, {
    from: getString(req.query.from),
    to: getString(req.query.to),
    page: getString(req.query.page),
    limit: getString(req.query.limit),
  });
  sendSuccess(res, result);
});

export const getMyMonthlySummary = asyncHandler(async (req: AuthRequest, res: Response) => {
  const now = new Date();
  const year = Number(getString(req.query.year)) || now.getUTCFullYear();
  const month = Number(getString(req.query.month)) || now.getUTCMonth() + 1;
  const result = await attendanceService.getMyMonthlySummary(
    req.user!.id,
    req.user!.companyId!,
    year,
    month
  );
  sendSuccess(res, result);
});

export const listCompanyAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await attendanceService.adminList(req.user!.companyId!, {
    date: getString(req.query.date),
    from: getString(req.query.from),
    to: getString(req.query.to),
    employeeId: getString(req.query.employeeId),
    search: getString(req.query.search),
    page: getString(req.query.page),
    limit: getString(req.query.limit),
  });
  sendSuccess(res, result);
});

export const getAttendanceSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await attendanceService.companySummary(
    req.user!.companyId!,
    getString(req.query.date)
  );
  sendSuccess(res, result);
});

export const correctAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  const result = await attendanceService.correctAttendance(id, req.user!.companyId!, req.body);
  sendSuccess(res, result, 'Attendance corrected');
});
