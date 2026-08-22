import { prisma } from '../config/database.js';
import { timeOffRepository } from '../repositories/timeoff.repository.js';
import { employeeRepository } from '../repositories/employee.repository.js';
import { createError } from '../middleware/error.middleware.js';
import type { LeaveType, TimeOff } from '@prisma/client';

function dayDiffInclusive(from: Date, to: Date): number {
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.floor(ms / 86400000) + 1;
}

function startOfDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function formatRequest(r: TimeOff & { employee?: unknown }) {
  return {
    id: r.id,
    employeeId: r.employeeId,
    type: r.type,
    startDate: r.startDate.toISOString().split('T')[0],
    endDate: r.endDate.toISOString().split('T')[0],
    durationDays: dayDiffInclusive(r.startDate, r.endDate),
    reason: r.reason,
    status: r.status,
    approvedBy: r.approvedBy,
    createdAt: r.createdAt.toISOString(),
  };
}

async function resolveActiveEmployee(userId: string, companyId: string) {
  const employee = await employeeRepository.findByUserIdAndCompany(userId, companyId);
  if (!employee) {
    throw createError('Employee profile not found', 404, 'EMPLOYEE_NOT_FOUND');
  }
  if (employee.status !== 'ACTIVE') {
    throw createError('Employee account is inactive', 403, 'EMPLOYEE_INACTIVE');
  }
  return employee;
}

class TimeOffService {
  async createRequest(
    userId: string,
    companyId: string,
    input: { type: LeaveType; startDate: string; endDate: string; reason?: string }
  ) {
    const employee = await resolveActiveEmployee(userId, companyId);

    const startDate = new Date(input.startDate + 'T00:00:00Z');
    const endDate = new Date(input.endDate + 'T00:00:00Z');

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw createError('Invalid dates', 400, 'INVALID_DATE');
    }
    if (startDate > endDate) {
      throw createError('Start date must be on or before end date', 400, 'INVALID_DATE_RANGE');
    }

    const days = dayDiffInclusive(startDate, endDate);

    const conflicts = await timeOffRepository.findConflicts(employee.id, startDate, endDate);
    if (conflicts.length > 0) {
      throw createError(
        'You already have a pending or approved request overlapping these dates',
        409,
        'OVERLAPPING_LEAVE'
      );
    }

    if (input.type !== 'UNPAID') {
      const year = startDate.getUTCFullYear();
      await timeOffRepository.upsertAllocation(employee.id, input.type, year, input.type === 'PAID' ? 20 : 10);
      const allocation = await timeOffRepository.getAllocation(employee.id, input.type, year);
      if (!allocation) {
        throw createError('Leave allocation not configured', 400, 'ALLOCATION_MISSING');
      }
      if (allocation.total - allocation.used < days) {
        throw createError(
          `Insufficient ${input.type.toLowerCase()} leave balance. Available: ${allocation.total - allocation.used} day(s), requested: ${days}`,
          400,
          'INSUFFICIENT_ALLOCATION'
        );
      }
    }

    const request = await timeOffRepository.create({
      employeeId: employee.id,
      type: input.type,
      startDate,
      endDate,
      reason: input.reason,
      status: 'PENDING',
    });

    console.log(JSON.stringify({
      level: 'INFO',
      event: 'LEAVE_REQUESTED',
      requestId: request.id,
      employeeId: employee.id,
      type: input.type,
      days,
    }));

    return formatRequest(request);
  }

  async getMyRequests(
    userId: string,
    companyId: string,
    query: { page?: string; limit?: string }
  ) {
    const employee = await resolveActiveEmployee(userId, companyId);
    const requests = await timeOffRepository.findManyByEmployee(employee.id);

    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);
    const startIdx = (page - 1) * limit;

    return {
      requests: requests.slice(startIdx, startIdx + limit).map(formatRequest),
      pagination: {
        page,
        limit,
        total: requests.length,
        totalPages: Math.ceil(requests.length / limit),
      },
    };
  }

  async getMyRequest(requestId: string, userId: string, companyId: string) {
    const employee = await resolveActiveEmployee(userId, companyId);
    const request = await prisma.timeOff.findFirst({
      where: { id: requestId, employeeId: employee.id },
    });
    if (!request) {
      throw createError('Time-off request not found', 404, 'REQUEST_NOT_FOUND');
    }
    return formatRequest(request);
  }

  async listCompanyRequests(
    companyId: string,
    query: {
      employeeId?: string;
      type?: LeaveType;
      status?: import('@prisma/client').LeaveStatus;
      search?: string;
      page?: string;
      limit?: string;
    }
  ) {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);

    const { requests, total } = await timeOffRepository.findCompanyRequests({
      companyId,
      employeeId: query.employeeId,
      type: query.type,
      status: query.status,
      search: query.search || undefined,
      page,
      limit,
    });

    return {
      requests: requests.map((r) => ({
        ...formatRequest(r),
        employeeName: `${(r as any).employee.firstName} ${(r as any).employee.lastName}`,
        loginId: (r as any).employee.user?.loginId ?? null,
        department: (r as any).employee.department ?? null,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getRequest(requestId: string, companyId: string) {
    const request = await timeOffRepository.findByIdWithEmployee(requestId);
    if (!request || (request.employee as any)?.companyId !== companyId) {
      throw createError('Request not found', 404, 'REQUEST_NOT_FOUND');
    }
    return formatRequest(request);
  }

  async approve(requestId: string, approverUserId: string, companyId: string) {
    const result = await prisma.$transaction(async (tx) => {
      const request = await tx.timeOff.findUnique({ where: { id: requestId } });
      if (!request) throw createError('Request not found', 404, 'REQUEST_NOT_FOUND');

      const employee = await tx.employee.findUnique({
        where: { id: request.employeeId },
        select: { companyId: true },
      });
      if (employee?.companyId !== companyId) {
        throw createError('Request not found', 404, 'REQUEST_NOT_FOUND');
      }

      if (request.status !== 'PENDING') {
        throw createError(
          `Cannot approve a request with status ${request.status}`,
          409,
          'INVALID_STATUS_TRANSITION'
        );
      }

      if (request.type !== 'UNPAID') {
        const year = request.startDate.getUTCFullYear();
        const allocation = await tx.leaveAllocation.findUnique({
          where: {
            employeeId_type_year: {
              employeeId: request.employeeId,
              type: request.type,
              year,
            },
          },
        });
        if (!allocation) throw createError('Leave allocation not configured', 400, 'ALLOCATION_MISSING');
        const days = dayDiffInclusive(request.startDate, request.endDate);
        if (allocation.total - allocation.used < days) {
          throw createError('Insufficient leave balance at approval time', 409, 'INSUFFICIENT_ALLOCATION');
        }
        await tx.leaveAllocation.update({
          where: { id: allocation.id },
          data: { used: allocation.used + days },
        });
      }

      return tx.timeOff.update({
        where: { id: requestId },
        data: { status: 'APPROVED', approvedBy: approverUserId },
      });
    });

    console.log(JSON.stringify({
      level: 'INFO',
      event: 'LEAVE_APPROVED',
      requestId,
      approvedBy: approverUserId,
    }));

    return formatRequest(result);
  }

  async reject(requestId: string, approverUserId: string, companyId: string) {
    const result = await prisma.$transaction(async (tx) => {
      const request = await tx.timeOff.findUnique({ where: { id: requestId } });
      if (!request) throw createError('Request not found', 404, 'REQUEST_NOT_FOUND');

      const employee = await tx.employee.findUnique({
        where: { id: request.employeeId },
        select: { companyId: true },
      });
      if (employee?.companyId !== companyId) {
        throw createError('Request not found', 404, 'REQUEST_NOT_FOUND');
      }

      if (request.status !== 'PENDING') {
        throw createError(
          `Cannot reject a request with status ${request.status}`,
          409,
          'INVALID_STATUS_TRANSITION'
        );
      }

      return tx.timeOff.update({
        where: { id: requestId },
        data: { status: 'REJECTED', approvedBy: approverUserId },
      });
    });

    console.log(JSON.stringify({
      level: 'INFO',
      event: 'LEAVE_REJECTED',
      requestId,
      rejectedBy: approverUserId,
    }));

    return formatRequest(result);
  }

  async cancel(requestId: string, requesterUserId: string, requesterRole: string, companyId: string) {
    const result = await prisma.$transaction(async (tx) => {
      const request = await tx.timeOff.findUnique({ where: { id: requestId } });
      if (!request) throw createError('Request not found', 404, 'REQUEST_NOT_FOUND');

      const employee = await tx.employee.findUnique({
        where: { id: request.employeeId },
        select: { companyId: true, userId: true },
      });
      if (employee?.companyId !== companyId) {
        throw createError('Request not found', 404, 'REQUEST_NOT_FOUND');
      }

      const isOwner = employee.userId === requesterUserId;
      const isManager = requesterRole === 'ADMIN' || requesterRole === 'HR';
      if (!isOwner && !isManager) {
        throw createError('Insufficient permissions', 403);
      }

      if (request.status === 'APPROVED' && !isManager) {
        throw createError('Only ADMIN/HR can cancel an approved request', 403);
      }
      if (request.status !== 'PENDING' && request.status !== 'APPROVED') {
        throw createError(
          `Cannot cancel a request with status ${request.status}`,
          409,
          'INVALID_STATUS_TRANSITION'
        );
      }

      if (request.status === 'APPROVED' && request.type !== 'UNPAID') {
        const year = request.startDate.getUTCFullYear();
        const allocation = await tx.leaveAllocation.findUnique({
          where: {
            employeeId_type_year: {
              employeeId: request.employeeId,
              type: request.type,
              year,
            },
          },
        });
        if (allocation) {
          const days = dayDiffInclusive(request.startDate, request.endDate);
          await tx.leaveAllocation.update({
            where: { id: allocation.id },
            data: { used: Math.max(0, allocation.used - days) },
          });
        }
      }

      return tx.timeOff.update({
        where: { id: requestId },
        data: { status: 'CANCELLED' },
      });
    });

    console.log(JSON.stringify({
      level: 'INFO',
      event: 'LEAVE_CANCELLED',
      requestId,
      cancelledBy: requesterUserId,
    }));

    return formatRequest(result);
  }

  async getMyAllocations(userId: string, companyId: string, year?: number) {
    const employee = await resolveActiveEmployee(userId, companyId);
    const y = year || new Date().getUTCFullYear();
    return timeOffRepository.ensureAllocationsForYear(employee.id, y);
  }

  async listCompanyAllocations(companyId: string, year: number, page: number, limit: number) {
    const { allocations, total } = await timeOffRepository.listAllocations({
      companyId,
      year,
      page,
      limit,
    });

    return {
      allocations: allocations.map((a) => ({
        id: a.id,
        employeeId: a.employeeId,
        employeeName: `${a.employee.firstName} ${a.employee.lastName}`,
        department: a.employee.department,
        loginId: a.employee.user?.loginId ?? null,
        type: a.type,
        year: a.year,
        total: a.total,
        used: a.used,
        remaining: a.total - a.used,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async adjustAllocation(allocationId: string, companyId: string, total: number) {
    const alloc = await timeOffRepository.findAllocationById(allocationId);
    if (!alloc || alloc.employee.companyId !== companyId) {
      throw createError('Allocation not found', 404, 'ALLOCATION_NOT_FOUND');
    }
    if (total < alloc.used) {
      throw createError(
        `Total cannot be less than already used (${alloc.used})`,
        400,
        'INVALID_ALLOCATION_TOTAL'
      );
    }

    const updated = await prisma.leaveAllocation.update({
      where: { id: allocationId },
      data: { total },
    });

    return {
      id: updated.id,
      type: updated.type,
      year: updated.year,
      total: updated.total,
      used: updated.used,
      remaining: updated.total - updated.used,
    };
  }
}

export const timeOffService = new TimeOffService();
