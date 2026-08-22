import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Role } from '@prisma/client';
import { requireRole, requireOwnershipOrRole } from '../../../src/middleware/authorization.middleware';
import { TEST_USERS } from '../../helpers/tokens';
import type { AuthRequest } from '../../../src/types/index';
import { Response, NextFunction } from 'express';

function createMockRequest(user?: AuthRequest['user']): AuthRequest {
  return { user } as AuthRequest;
}

function createMockResponse(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

function createMockNext(): NextFunction {
  return vi.fn() as NextFunction;
}

describe('requireRole middleware', () => {
  it('should allow access when user has required role', () => {
    const req = createMockRequest(TEST_USERS.admin);
    const res = createMockResponse();
    const next = createMockNext();

    const middleware = requireRole(Role.ADMIN);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should allow access when user has one of multiple required roles', () => {
    const req = createMockRequest(TEST_USERS.hr);
    const res = createMockResponse();
    const next = createMockNext();

    const middleware = requireRole(Role.ADMIN, Role.HR);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should deny access when user lacks required role', () => {
    const req = createMockRequest(TEST_USERS.employee1);
    const res = createMockResponse();
    const next = createMockNext();

    const middleware = requireRole(Role.ADMIN, Role.HR);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403 })
    );
  });

  it('should return 401 when user is not authenticated', () => {
    const req = createMockRequest(undefined);
    const res = createMockResponse();
    const next = createMockNext();

    const middleware = requireRole(Role.ADMIN);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });
});

describe('requireOwnershipOrRole middleware', () => {
  it('should allow access when user has required role', async () => {
    const req = createMockRequest(TEST_USERS.admin);
    const res = createMockResponse();
    const next = createMockNext();

    const getResourceOwnerId = vi.fn().mockResolvedValue(null);
    const middleware = requireOwnershipOrRole(getResourceOwnerId, Role.ADMIN, Role.HR);

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(getResourceOwnerId).not.toHaveBeenCalled();
  });

  it('should allow access when user owns the resource', async () => {
    const req = createMockRequest(TEST_USERS.employee1);
    const res = createMockResponse();
    const next = createMockNext();

    const getResourceOwnerId = vi.fn().mockResolvedValue(TEST_USERS.employee1.id);
    const middleware = requireOwnershipOrRole(getResourceOwnerId, Role.ADMIN, Role.HR);

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should deny access when user lacks role and does not own resource', async () => {
    const req = createMockRequest(TEST_USERS.employee1);
    const res = createMockResponse();
    const next = createMockNext();

    const getResourceOwnerId = vi.fn().mockResolvedValue(TEST_USERS.employee2.id);
    const middleware = requireOwnershipOrRole(getResourceOwnerId, Role.ADMIN, Role.HR);

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403 })
    );
  });

  it('should deny access when user is not authenticated', async () => {
    const req = createMockRequest(undefined);
    const res = createMockResponse();
    const next = createMockNext();

    const getResourceOwnerId = vi.fn().mockResolvedValue(null);
    const middleware = requireOwnershipOrRole(getResourceOwnerId, Role.ADMIN);

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it('should deny access when resource does not exist', async () => {
    const req = createMockRequest(TEST_USERS.employee1);
    const res = createMockResponse();
    const next = createMockNext();

    const getResourceOwnerId = vi.fn().mockResolvedValue(null);
    const middleware = requireOwnershipOrRole(getResourceOwnerId, Role.ADMIN);

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403 })
    );
  });
});
