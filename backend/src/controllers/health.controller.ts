import { Request, Response } from 'express';

export function healthCheck(_req: Request, res: Response): void {
  res.json({
    status: 'ok',
    service: 'dayflow-backend',
    timestamp: new Date().toISOString(),
  });
}
