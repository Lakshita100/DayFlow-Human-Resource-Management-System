import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { authService } from '../../../src/services/auth.service';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-development-only-12345';

describe('authService.verifyToken', () => {
  it('should verify a valid token', () => {
    const payload = { userId: 'user-123', email: 'test@dayflow.com', role: Role.EMPLOYEE };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: 86400 });

    const result = authService.verifyToken(token);

    expect(result.id).toBe(payload.userId);
    expect(result.email).toBe(payload.email);
    expect(result.role).toBe(payload.role);
  });

  it('should throw on invalid token', () => {
    expect(() => authService.verifyToken('invalid-token')).toThrow();
  });

  it('should throw on expired token', () => {
    const payload = { userId: 'user-123', email: 'test@dayflow.com', role: Role.EMPLOYEE };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: -1 });

    expect(() => authService.verifyToken(token)).toThrow();
  });

  it('should throw on token signed with wrong secret', () => {
    const payload = { userId: 'user-123', email: 'test@dayflow.com', role: Role.EMPLOYEE };
    const token = jwt.sign(payload, 'wrong-secret', { expiresIn: 86400 });

    expect(() => authService.verifyToken(token)).toThrow();
  });
});
