import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireAuth } from '../../../src/middleware/auth.middleware';
import { TEST_USERS, generateTestToken, generateExpiredToken } from '../../helpers/tokens';
import type { AuthRequest } from '../../../src/types/index';
import { Response, NextFunction } from 'express';

vi.mock('../../../src/repositories/user.repository', () => ({
  userRepository: {
    findById: vi.fn(),
  },
}));

import { userRepository } from '../../../src/repositories/user.repository';

function createMockRequest(headers: Record<string, string> = {}): AuthRequest {
  return {
    headers,
    user: undefined,
  } as unknown as AuthRequest;
}

function createMockResponse(): Response {
  return {} as Response;
}

function createMockNext(): NextFunction {
  return vi.fn() as NextFunction;
}

describe('requireAuth middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should authenticate user with valid token', async () => {
    const token = generateTestToken(TEST_USERS.admin);
    const req = createMockRequest({ authorization: `Bearer ${token}` });
    const res = createMockResponse();
    const next = createMockNext();

    vi.mocked(userRepository.findById).mockResolvedValue({
      id: TEST_USERS.admin.id,
      email: TEST_USERS.admin.email,
      loginId: TEST_USERS.admin.loginId,
      role: TEST_USERS.admin.role,
      companyId: TEST_USERS.admin.companyId,
      isActive: true,
      mustChangePassword: false,
    } as any);

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toBeDefined();
    expect(req.user?.id).toBe(TEST_USERS.admin.id);
    expect(req.user?.role).toBe(TEST_USERS.admin.role);
  });

  it('should reject request without authorization header', async () => {
    const req = createMockRequest({});
    const res = createMockResponse();
    const next = createMockNext();

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it('should reject request with invalid token', async () => {
    const req = createMockRequest({ authorization: 'Bearer invalid-token' });
    const res = createMockResponse();
    const next = createMockNext();

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it('should reject request with expired token', async () => {
    const token = generateExpiredToken(TEST_USERS.admin);
    const req = createMockRequest({ authorization: `Bearer ${token}` });
    const res = createMockResponse();
    const next = createMockNext();

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it('should reject inactive user', async () => {
    const token = generateTestToken(TEST_USERS.admin);
    const req = createMockRequest({ authorization: `Bearer ${token}` });
    const res = createMockResponse();
    const next = createMockNext();

    vi.mocked(userRepository.findById).mockResolvedValue({
      id: TEST_USERS.admin.id,
      email: TEST_USERS.admin.email,
      loginId: TEST_USERS.admin.loginId,
      role: TEST_USERS.admin.role,
      companyId: TEST_USERS.admin.companyId,
      isActive: false,
      mustChangePassword: false,
    } as any);

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it('should reject request with malformed Bearer token', async () => {
    const req = createMockRequest({ authorization: 'Bearer' });
    const res = createMockResponse();
    const next = createMockNext();

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });
});
