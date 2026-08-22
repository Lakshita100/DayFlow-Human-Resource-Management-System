import { Request, Response } from 'express';
import { prisma } from '../config/database.js';

export async function healthCheck(_req: Request, res: Response): Promise<void> {
  const checks: Record<string, string> = {};

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'ok';
  } catch {
    checks.database = 'error';
  }

  const status = Object.values(checks).every((v) => v === 'ok') ? 'ok' : 'degraded';

  res.json({
    status,
    service: 'dayflow-backend',
    checks,
    timestamp: new Date().toISOString(),
  });
}
