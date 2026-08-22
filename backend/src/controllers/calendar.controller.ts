import { Response } from 'express';
import { calendarService } from '../services/calendar.service.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/async-handler.js';
import type { AuthRequest } from '../types/index.js';

export const getCalendarEvents = asyncHandler(async (req: AuthRequest, res: Response) => {
  const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
  const month = req.query.month ? parseInt(req.query.month as string, 10) : undefined;

  const events = await calendarService.getCalendarEvents(req.user!.id, year, month);
  sendSuccess(res, events);
});
