import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
  details?: Record<string, unknown>;
}

export function createError(
  message: string,
  statusCode: number,
  code?: string,
  details?: Record<string, unknown>
): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  if (code) error.code = code;
  if (details) error.details = details;
  return error;
}

function logError(err: AppError, req: Request): void {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const userId = (req as any).user?.id || 'unauthenticated';

  const logEntry = {
    timestamp,
    level: 'ERROR',
    statusCode: err.statusCode || 500,
    message: err.message,
    code: err.code || 'INTERNAL_ERROR',
    method,
    path,
    ip,
    userId,
    ...(err.details && { details: err.details }),
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (err.statusCode && err.statusCode < 500) {
    console.warn(JSON.stringify(logEntry));
  } else {
    console.error(JSON.stringify(logEntry));
  }
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  logError(err, req);

  const response: Record<string, unknown> = {
    success: false,
    message:
      env.NODE_ENV === 'production' && statusCode >= 500
        ? 'Something went wrong'
        : message,
  };

  if (err.code) {
    response.code = err.code;
  }

  if (env.NODE_ENV === 'development' && err.details) {
    response.details = err.details;
  }

  res.status(statusCode).json(response);
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    code: 'NOT_FOUND',
  });
}
