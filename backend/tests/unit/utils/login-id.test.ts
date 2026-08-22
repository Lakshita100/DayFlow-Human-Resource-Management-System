import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { generateLoginId, generateTemporaryPassword, validateLoginIdFormat } from '../../../src/utils/login-id';
import { prisma } from '../../../src/config/database';

describe('Login ID Generator', () => {
  beforeAll(async () => {
    // Ensure test company exists
    await prisma.company.upsert({
      where: { name: 'TestCompany' },
      update: {},
      create: {
        id: 'test-company-id',
        name: 'TestCompany',
        prefix: 'TC',
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.yearlySerial.deleteMany({ where: { companyId: 'test-company-id' } });
    await prisma.company.delete({ where: { id: 'test-company-id' } });
  });

  it('should generate login ID in correct format', async () => {
    const result = await generateLoginId({
      companyId: 'test-company-id',
      companyPrefix: 'TC',
      firstName: 'John',
      lastName: 'Doe',
      dateOfJoining: new Date('2024-03-15'),
    });

    expect(result.loginId).toMatch(/^TCJODO2024\d{4}$/);
    expect(result.serial).toBeGreaterThan(0);
  });

  it('should normalize company prefix to uppercase', async () => {
    const result = await generateLoginId({
      companyId: 'test-company-id',
      companyPrefix: 'tc',
      firstName: 'John',
      lastName: 'Doe',
      dateOfJoining: new Date('2024-03-15'),
    });

    expect(result.loginId).toMatch(/^TC/);
  });

  it('should normalize employee names to uppercase', async () => {
    const result = await generateLoginId({
      companyId: 'test-company-id',
      companyPrefix: 'TC',
      firstName: 'john',
      lastName: 'doe',
      dateOfJoining: new Date('2024-03-15'),
    });

    expect(result.loginId).toMatch(/^TCJODO/);
  });

  it('should use joining year in login ID', async () => {
    const result = await generateLoginId({
      companyId: 'test-company-id',
      companyPrefix: 'TC',
      firstName: 'John',
      lastName: 'Doe',
      dateOfJoining: new Date('2023-07-20'),
    });

    expect(result.loginId).toMatch(/2023/);
  });

  it('should generate sequential serial numbers', async () => {
    const result1 = await generateLoginId({
      companyId: 'test-company-id',
      companyPrefix: 'TC',
      firstName: 'Alice',
      lastName: 'Smith',
      dateOfJoining: new Date('2024-06-01'),
    });

    const result2 = await generateLoginId({
      companyId: 'test-company-id',
      companyPrefix: 'TC',
      firstName: 'Bob',
      lastName: 'Jones',
      dateOfJoining: new Date('2024-06-01'),
    });

    expect(result2.serial).toBe(result1.serial + 1);
  });

  it('should reset serial for different year', async () => {
    const result1 = await generateLoginId({
      companyId: 'test-company-id',
      companyPrefix: 'TC',
      firstName: 'Charlie',
      lastName: 'Brown',
      dateOfJoining: new Date('2024-12-31'),
    });

    const result2 = await generateLoginId({
      companyId: 'test-company-id',
      companyPrefix: 'TC',
      firstName: 'David',
      lastName: 'Lee',
      dateOfJoining: new Date('2025-01-01'),
    });

    expect(result1.serial).toBeGreaterThan(0);
    expect(result2.serial).toBe(1);
  });
});

describe('Temporary Password Generator', () => {
  it('should generate password with correct format', () => {
    const password = generateTemporaryPassword();
    expect(password).toMatch(/^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/);
  });

  it('should generate different passwords each time', () => {
    const password1 = generateTemporaryPassword();
    const password2 = generateTemporaryPassword();
    expect(password1).not.toBe(password2);
  });

  it('should not contain ambiguous characters', () => {
    const password = generateTemporaryPassword();
    expect(password).not.toMatch(/[lI1O0]/);
  });
});

describe('Login ID Validation', () => {
  it('should validate correct format', () => {
    expect(validateLoginIdFormat('TCJODO20240001')).toBe(true);
  });

  it('should reject incorrect format', () => {
    expect(validateLoginIdFormat('TCJODO2024')).toBe(false);
    expect(validateLoginIdFormat('TCJODO202400011')).toBe(false);
    expect(validateLoginIdFormat('tcjodo20240001')).toBe(false);
  });
});
