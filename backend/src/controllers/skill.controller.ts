import { Response } from 'express';
import { skillService } from '../services/skill.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { asyncHandler } from '../utils/async-handler.js';
import type { AuthRequest } from '../types/index.js';

function getString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') return value[0];
  return undefined;
}

export const listSkills = asyncHandler(async (req: AuthRequest, res: Response) => {
  const companyId = req.user!.companyId!;
  const result = await skillService.listSkills(companyId, {
    page: getString(req.query.page) || '1',
    limit: getString(req.query.limit) || '20',
    search: getString(req.query.search) || '',
  });
  sendSuccess(res, result);
});

export const getSkill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const skill = await skillService.getSkillById(getString(req.params.id)!);
  sendSuccess(res, skill);
});

export const createSkill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const skill = await skillService.createSkill(req.body);
  sendCreated(res, skill);
});

export const updateSkill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const skill = await skillService.updateSkill(getString(req.params.id)!, req.body);
  sendSuccess(res, skill);
});

export const deleteSkill = asyncHandler(async (req: AuthRequest, res: Response) => {
  await skillService.deleteSkill(getString(req.params.id)!);
  sendSuccess(res, null, 'Skill deleted successfully');
});

export const getEmployeeSkills = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  const companyId = req.user!.companyId!;
  const skills = await skillService.getEmployeeSkills(id, companyId);
  sendSuccess(res, skills);
});

export const assignSkill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  const companyId = req.user!.companyId!;
  const result = await skillService.assignSkill(id, companyId, req.body);
  sendCreated(res, result);
});

export const removeSkill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  const skillId = getString(req.params.skillId)!;
  const companyId = req.user!.companyId!;
  await skillService.removeSkill(id, companyId, skillId);
  sendSuccess(res, null, 'Skill removed successfully');
});
