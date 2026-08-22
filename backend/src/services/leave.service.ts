import { leaveRepository } from '../repositories/leave.repository.js';
import { employeeRepository } from '../repositories/employee.repository.js';
import { LeaveStatus, LeaveType } from '@prisma/client';

export class LeaveService {
  async getLeaveBalance(userId: string) {
    const employee = await employeeRepository.findByUserId(userId);
    if (!employee) {
      throw new Error('Employee record not found');
    }

    const currentYear = new Date().getFullYear();
    let allocations = await leaveRepository.getLeaveAllocations(employee.id, currentYear);

    if (allocations.length === 0) {
      await leaveRepository.createDefaultAllocation(employee.id, currentYear);
      allocations = await leaveRepository.getLeaveAllocations(employee.id, currentYear);
    }

    return allocations.map((a) => ({
      type: a.type,
      label: `${a.type.charAt(0) + a.type.slice(1).toLowerCase()} Leave`,
      total: a.total,
      used: a.used,
      available: Math.max(0, a.total - a.used),
    }));
  }

  async createLeaveRequest(userId: string, payload: { leaveType: LeaveType; startDate: string; endDate: string; reason?: string }) {
    const employee = await employeeRepository.findByUserId(userId);
    if (!employee) {
      throw new Error('Employee record not found');
    }

    const start = new Date(payload.startDate);
    const end = new Date(payload.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid start or end date');
    }

    if (start > end) {
      throw new Error('Start date cannot be after end date');
    }

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const request = await leaveRepository.createLeaveRequest(
      employee.id,
      payload.leaveType,
      start,
      end,
      payload.reason
    );

    return {
      id: request.id,
      type: request.type,
      startDate: request.startDate.toISOString().split('T')[0],
      endDate: request.endDate.toISOString().split('T')[0],
      days,
      reason: request.reason,
      status: request.status,
      appliedOn: request.createdAt.toISOString().split('T')[0],
    };
  }

  async getLeaveRequests(companyId: string, options: { page?: string; limit?: string; status?: LeaveStatus; type?: LeaveType; employeeId?: string }) {
    const page = Math.max(1, parseInt(options.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(options.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const where: any = {
      employee: { companyId },
    };

    if (options.employeeId) where.employeeId = options.employeeId;
    if (options.status) where.status = options.status;
    if (options.type) where.type = options.type;

    const { items, total } = await leaveRepository.findLeaveRequests(where, skip, limit);

    const formatted = items.map((r) => {
      const days = Math.ceil((new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return {
        id: r.id,
        employeeId: r.employee.employeeId,
        employeeName: `${r.employee.firstName} ${r.employee.lastName}`,
        department: r.employee.department,
        designation: r.employee.designation,
        type: r.type,
        startDate: new Date(r.startDate).toISOString().split('T')[0],
        endDate: new Date(r.endDate).toISOString().split('T')[0],
        days,
        reason: r.reason || '',
        status: r.status,
        appliedOn: new Date(r.createdAt).toISOString().split('T')[0],
      };
    });

    return {
      items: formatted,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async updateLeaveStatus(requestId: string, status: LeaveStatus, approverUserId: string) {
    const request = await leaveRepository.findById(requestId);
    if (!request) {
      throw new Error('Leave request not found');
    }

    if (request.status !== LeaveStatus.PENDING) {
      throw new Error(`Leave request is already ${request.status.toLowerCase()}`);
    }

    if (status === LeaveStatus.APPROVED) {
      const days = Math.ceil((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const year = new Date(request.startDate).getFullYear();
      await leaveRepository.incrementUsedDays(request.employeeId, request.type, days, year);
    }

    return leaveRepository.updateLeaveStatus(requestId, status, approverUserId);
  }
}

export const leaveService = new LeaveService();
