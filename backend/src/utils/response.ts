import { Response } from 'express';

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function sendSuccess(res: Response, data: unknown, message?: string): void {
  const response: Record<string, unknown> = { success: true, data };
  if (message) response.message = message;
  res.json(response);
}

export function sendCreated(res: Response, data: unknown, message?: string): void {
  const response: Record<string, unknown> = { success: true, data };
  if (message) response.message = message;
  res.status(201).json(response);
}

export function sendError(res: Response, message: string, statusCode: number): void {
  res.status(statusCode).json({ success: false, message });
}

export function sendPaginated(res: Response, data: unknown[], pagination: Pagination): void {
  res.json({ success: true, data, pagination });
}
