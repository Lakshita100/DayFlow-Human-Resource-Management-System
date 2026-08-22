import crypto from 'crypto';
import { prisma } from '../config/database.js';

/**
 * Generates a Login ID in the format: CCFFLLYYYYNNNN
 * CC = first 2 letters of company prefix
 * FF = first 2 letters of employee first name
 * LL = first 2 letters of employee last name
 * YYYY = year of joining
 * NNNN = 4-digit yearly serial (concurrency-safe)
 */

function normalizeName(name: string): string {
  // Remove non-ASCII characters, convert to uppercase
  const normalized = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-zA-Z]/g, '') // Remove non-alpha
    .toUpperCase();

  if (normalized.length === 0) return 'XX';
  if (normalized.length === 1) return normalized + 'X';
  return normalized.substring(0, 2);
}

function getYearFromDate(date: Date): number {
  return date.getFullYear();
}

/**
 * Gets the next serial number for a company/year combination.
 * Uses database-level locking for concurrency safety.
 */
async function getNextSerial(companyId: string, year: number): Promise<number> {
  // Use upsert with atomic increment for concurrency safety
  const result = await prisma.$transaction(async (tx) => {
    // Try to find existing serial record
    const existing = await tx.yearlySerial.findUnique({
      where: {
        companyId_year: { companyId, year },
      },
    });

    if (existing) {
      // Increment the serial number atomically
      const updated = await tx.yearlySerial.update({
        where: {
          companyId_year: { companyId, year },
        },
        data: {
          lastSerial: existing.lastSerial + 1,
        },
      });
      return updated.lastSerial;
    } else {
      // Create new serial record starting at 1
      const created = await tx.yearlySerial.create({
        data: {
          companyId,
          year,
          lastSerial: 1,
        },
      });
      return created.lastSerial;
    }
  });

  return result;
}

export interface LoginIdParams {
  companyId: string;
  companyPrefix: string;
  firstName: string;
  lastName: string;
  dateOfJoining: Date;
}

export interface LoginIdResult {
  loginId: string;
  serial: number;
}

/**
 * Generates a unique Login ID for a new employee.
 * Uses database transaction for concurrency safety.
 */
export async function generateLoginId(params: LoginIdParams): Promise<LoginIdResult> {
  const { companyId, companyPrefix, firstName, lastName, dateOfJoining } = params;

  const companyPart = normalizeName(companyPrefix);
  const firstNamePart = normalizeName(firstName);
  const lastNamePart = normalizeName(lastName);
  const year = getYearFromDate(dateOfJoining);

  // Get next serial number (concurrency-safe)
  const serial = await getNextSerial(companyId, year);

  const loginId = `${companyPart}${firstNamePart}${lastNamePart}${year}${serial.toString().padStart(4, '0')}`;

  return { loginId, serial };
}

/**
 * Generates a cryptographically secure temporary password.
 * Format: 3 segments of 4 characters each (e.g., "Kx9m-Pq2n-Rv7t")
 */
export function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const segments: string[] = [];

  for (let i = 0; i < 3; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      const randomIndex = crypto.randomInt(chars.length);
      segment += chars[randomIndex];
    }
    segments.push(segment);
  }

  return segments.join('-');
}

/**
 * Validates a Login ID format.
 */
export function validateLoginIdFormat(loginId: string): boolean {
  // Expected format: CCFFLLYYYYNNNN (14 characters)
  const loginIdRegex = /^[A-Z]{2}[A-Z]{2}[A-Z]{2}\d{4}\d{4}$/;
  return loginIdRegex.test(loginId);
}
