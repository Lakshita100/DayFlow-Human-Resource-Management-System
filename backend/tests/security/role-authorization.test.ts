import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Role } from '@prisma/client';
import { requireRole, requireOwnershipOrRole } from '../../src/middleware/authorization.middleware';
import { TEST_USERS } from '../helpers/tokens';
import type { AuthRequest } from '../../src/types/index';
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

describe('Authorization Middleware - Role-Based Access Control', () => {
  describe('requireRole', () => {
    it('should allow ADMIN to access admin-only resources', () => {
      const req = createMockRequest(TEST_USERS.admin);
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(Role.ADMIN);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should deny HR from admin-only resources', () => {
      const req = createMockRequest(TEST_USERS.hr);
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(Role.ADMIN);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 403 })
      );
    });

    it('should deny EMPLOYEE from admin-only resources', () => {
      const req = createMockRequest(TEST_USERS.employee1);
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(Role.ADMIN);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 403 })
      );
    });

    it('should allow ADMIN and HR to hr-admin resources', () => {
      const adminReq = createMockRequest(TEST_USERS.admin);
      const hrReq = createMockRequest(TEST_USERS.hr);
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(Role.ADMIN, Role.HR);
      
      middleware(adminReq, res, next);
      expect(next).toHaveBeenCalledWith();

      middleware(hrReq, res, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should deny EMPLOYEE from hr-admin resources', () => {
      const req = createMockRequest(TEST_USERS.employee1);
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(Role.ADMIN, Role.HR);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 403 })
      );
    });

    it('should allow all authenticated users to employee resources', () => {
      const adminReq = createMockRequest(TEST_USERS.admin);
      const hrReq = createMockRequest(TEST_USERS.hr);
      const empReq = createMockRequest(TEST_USERS.employee1);
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(Role.ADMIN, Role.HR, Role.EMPLOYEE);
      
      middleware(adminReq, res, next);
      expect(next).toHaveBeenCalledWith();

      middleware(hrReq, res, next);
      expect(next).toHaveBeenCalledWith();

      middleware(empReq, res, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should deny unauthenticated users from any resource', () => {
      const req = createMockRequest(undefined);
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(Role.ADMIN, Role.HR, Role.EMPLOYEE);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 401 })
      );
    });
  });

  describe('requireOwnershipOrRole', () => {
    it('should allow access when user owns the resource', async () => {
      const req = createMockRequest(TEST_USERS.employee1);
      const res = createMockResponse();
      const next = createMockNext();

      const getResourceOwnerId = vi.fn().mockResolvedValue(TEST_USERS.employee1.id);
      const middleware = requireOwnershipOrRole(getResourceOwnerId, Role.ADMIN, Role.HR);

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should deny access when user does not own resource and lacks role', async () => {
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

    it('should allow ADMIN to access any resource regardless of ownership', async () => {
      const req = createMockRequest(TEST_USERS.admin);
      const res = createMockResponse();
      const next = createMockNext();

      const getResourceOwnerId = vi.fn().mockResolvedValue(TEST_USERS.employee1.id);
      const middleware = requireOwnershipOrRole(getResourceOwnerId, Role.ADMIN);

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(getResourceOwnerId).not.toHaveBeenCalled();
    });

    it('should allow HR to access any resource regardless of ownership', async () => {
      const req = createMockRequest(TEST_USERS.hr);
      const res = createMockResponse();
      const next = createMockNext();

      const getResourceOwnerId = vi.fn().mockResolvedValue(TEST_USERS.employee1.id);
      const middleware = requireOwnershipOrRole(getResourceOwnerId, Role.ADMIN, Role.HR);

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(getResourceOwnerId).not.toHaveBeenCalled();
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

  describe('IDOR Prevention', () => {
    it('should prevent Employee A from accessing Employee B resource', async () => {
      const req = createMockRequest(TEST_USERS.employee1);
      const res = createMockResponse();
      const next = createMockNext();

      // Employee A tries to access Employee B's resource
      const getResourceOwnerId = vi.fn().mockResolvedValue(TEST_USERS.employee2.id);
      const middleware = requireOwnershipOrRole(getResourceOwnerId, Role.ADMIN, Role.HR);

      await middleware(req, res, next);

      // Should be denied
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 403 })
      );
    });

    it('should allow Employee to access own resource', async () => {
      const req = createMockRequest(TEST_USERS.employee1);
      const res = createMockResponse();
      const next = createMockNext();

      // Employee A accesses own resource
      const getResourceOwnerId = vi.fn().mockResolvedValue(TEST_USERS.employee1.id);
      const middleware = requireOwnershipOrRole(getResourceOwnerId, Role.ADMIN, Role.HR);

      await middleware(req, res, next);

      // Should be allowed
      expect(next).toHaveBeenCalledWith();
    });
  });
});
