import { prisma } from '../config/database.js';
import { createError } from '../middleware/error.middleware.js';

class SkillService {
  async listSkills(companyId: string, query: { page: string; limit: string; search: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const search = query.search || undefined;
    const skip = (page - 1) * limit;

    const where = {
      OR: search
        ? [
            { name: { contains: search, mode: 'insensitive' as const } },
            { category: { contains: search, mode: 'insensitive' as const } },
          ]
        : undefined,
    };

    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.skill.count({ where }),
    ]);

    return {
      skills,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSkillById(id: string) {
    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill) {
      throw createError('Skill not found', 404, 'SKILL_NOT_FOUND');
    }
    return skill;
  }

  async createSkill(data: { name: string; category?: string }) {
    const existing = await prisma.skill.findUnique({ where: { name: data.name } });
    if (existing) {
      throw createError('A skill with this name already exists', 409, 'SKILL_NAME_EXISTS');
    }
    return prisma.skill.create({ data });
  }

  async updateSkill(id: string, data: { name?: string; category?: string }) {
    const existing = await prisma.skill.findUnique({ where: { id } });
    if (!existing) {
      throw createError('Skill not found', 404, 'SKILL_NOT_FOUND');
    }

    if (data.name && data.name !== existing.name) {
      const duplicate = await prisma.skill.findUnique({ where: { name: data.name } });
      if (duplicate) {
        throw createError('A skill with this name already exists', 409, 'SKILL_NAME_EXISTS');
      }
    }

    return prisma.skill.update({
      where: { id },
      data,
    });
  }

  async deleteSkill(id: string) {
    const existing = await prisma.skill.findUnique({ where: { id } });
    if (!existing) {
      throw createError('Skill not found', 404, 'SKILL_NOT_FOUND');
    }

    const associations = await prisma.employeeSkill.count({ where: { skillId: id } });
    if (associations > 0) {
      throw createError(
        'Cannot delete skill with existing employee associations. Remove associations first.',
        409,
        'SKILL_HAS_ASSOCIATIONS'
      );
    }

    return prisma.skill.delete({ where: { id } });
  }

  async getEmployeeSkills(employeeId: string, companyId: string) {
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, companyId },
      select: { id: true },
    });
    if (!employee) {
      throw createError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
    }

    const skills = await prisma.employeeSkill.findMany({
      where: { employeeId },
      include: { skill: true },
    });

    return skills.map((es) => ({
      id: es.id,
      skillId: es.skillId,
      skillName: es.skill?.name,
      skillCategory: es.skill?.category,
      proficiency: es.proficiency,
    }));
  }

  async assignSkill(employeeId: string, companyId: string, data: { skillId: string; proficiency?: string }) {
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });
    if (!employee) {
      throw createError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
    }

    const skill = await prisma.skill.findUnique({ where: { id: data.skillId } });
    if (!skill) {
      throw createError('Skill not found', 404, 'SKILL_NOT_FOUND');
    }

    const existing = await prisma.employeeSkill.findUnique({
      where: { employeeId_skillId: { employeeId, skillId: data.skillId } },
    });
    if (existing) {
      throw createError('Employee already has this skill', 409, 'SKILL_ALREADY_ASSIGNED');
    }

    return prisma.employeeSkill.create({
      data: {
        employeeId,
        skillId: data.skillId,
        proficiency: data.proficiency || null,
      },
      include: { skill: true },
    });
  }

  async removeSkill(employeeId: string, companyId: string, skillId: string) {
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });
    if (!employee) {
      throw createError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
    }

    const association = await prisma.employeeSkill.findUnique({
      where: { employeeId_skillId: { employeeId, skillId } },
    });
    if (!association) {
      throw createError('Skill not assigned to this employee', 404, 'SKILL_NOT_ASSIGNED');
    }

    return prisma.employeeSkill.delete({
      where: { employeeId_skillId: { employeeId, skillId } },
    });
  }
}

export const skillService = new SkillService();