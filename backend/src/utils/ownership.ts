import { prisma } from '../config/database.js';
import type { AuthRequest } from '../types/index.js';

function getStringParam(value: string | string[] | undefined): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return undefined;
}

export const ownershipHelpers = {
  async getEmployeeOwnerId(req: AuthRequest): Promise<string | null> {
    const id = getStringParam(req.params.id);
    if (!id) return null;
    const employee = await prisma.employee.findUnique({
      where: { id },
      select: { userId: true },
    });
    return employee?.userId ?? null;
  },

  async getPrivateInfoOwnerId(req: AuthRequest): Promise<string | null> {
    const id = getStringParam(req.params.id);
    if (!id) return null;
    const info = await prisma.employeePrivateInfo.findUnique({
      where: { id },
      select: { employeeId: true },
    });
    if (!info) return null;
    const employee = await prisma.employee.findUnique({
      where: { id: info.employeeId },
      select: { userId: true },
    });
    return employee?.userId ?? null;
  },

  async getEmployeeDocumentOwnerId(req: AuthRequest): Promise<string | null> {
    const id = getStringParam(req.params.id);
    if (!id) return null;
    const doc = await prisma.employeeDocument.findUnique({
      where: { id },
      select: { employeeId: true },
    });
    if (!doc) return null;
    const employee = await prisma.employee.findUnique({
      where: { id: doc.employeeId },
      select: { userId: true },
    });
    return employee?.userId ?? null;
  },

  async getAttendanceOwnerId(req: AuthRequest): Promise<string | null> {
    const id = getStringParam(req.params.id);
    if (!id) return null;
    const record = await prisma.attendance.findUnique({
      where: { id },
      select: { employeeId: true },
    });
    if (!record) return null;
    const employee = await prisma.employee.findUnique({
      where: { id: record.employeeId },
      select: { userId: true },
    });
    return employee?.userId ?? null;
  },

  async getTimeOffOwnerId(req: AuthRequest): Promise<string | null> {
    const id = getStringParam(req.params.id);
    if (!id) return null;
    const timeOff = await prisma.timeOff.findUnique({
      where: { id },
      select: { employeeId: true },
    });
    if (!timeOff) return null;
    const employee = await prisma.employee.findUnique({
      where: { id: timeOff.employeeId },
      select: { userId: true },
    });
    return employee?.userId ?? null;
  },

  async getLeaveAllocationOwnerId(req: AuthRequest): Promise<string | null> {
    const id = getStringParam(req.params.id);
    if (!id) return null;
    const allocation = await prisma.leaveAllocation.findUnique({
      where: { id },
      select: { employeeId: true },
    });
    if (!allocation) return null;
    const employee = await prisma.employee.findUnique({
      where: { id: allocation.employeeId },
      select: { userId: true },
    });
    return employee?.userId ?? null;
  },

  async getSalaryStructureOwnerId(req: AuthRequest): Promise<string | null> {
    const id = getStringParam(req.params.id);
    if (!id) return null;
    const structure = await prisma.salaryStructure.findUnique({
      where: { id },
      select: { employeeId: true },
    });
    if (!structure) return null;
    const employee = await prisma.employee.findUnique({
      where: { id: structure.employeeId },
      select: { userId: true },
    });
    return employee?.userId ?? null;
  },

  async getNotificationOwnerId(req: AuthRequest): Promise<string | null> {
    const id = getStringParam(req.params.id);
    if (!id) return null;
    const notification = await prisma.notification.findUnique({
      where: { id },
      select: { userId: true },
    });
    return notification?.userId ?? null;
  },

  async getEmployeeSkillOwnerId(req: AuthRequest): Promise<string | null> {
    const id = getStringParam(req.params.id);
    if (!id) return null;
    const skill = await prisma.employeeSkill.findUnique({
      where: { id },
      select: { employeeId: true },
    });
    if (!skill) return null;
    const employee = await prisma.employee.findUnique({
      where: { id: skill.employeeId },
      select: { userId: true },
    });
    return employee?.userId ?? null;
  },
};
