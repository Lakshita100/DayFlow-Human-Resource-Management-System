import { Response } from 'express';
import { profileService } from '../services/profile.service.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/async-handler.js';
import type { AuthRequest } from '../types/index.js';

function getString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') return value[0];
  return undefined;
}

export const getMyProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const profile = await profileService.getMyProfile(req.user!.id);
  sendSuccess(res, profile);
});

export const getEmployeeProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  const companyId = req.user!.companyId!;
  const isAdminOrHr = req.user!.role === 'ADMIN' || req.user!.role === 'HR';
  const profile = await profileService.getProfile(id, companyId, isAdminOrHr);
  sendSuccess(res, profile);
});

export const updateMyProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const profile = await profileService.updateMyPrivateProfile(req.user!.id, req.body);
  sendSuccess(res, profile);
});

export const updateEmployeeProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  const companyId = req.user!.companyId!;
  const isAdminOrHr = true;
  const profile = await profileService.updatePrivateProfile(id, companyId, req.body, isAdminOrHr);
  sendSuccess(res, profile);
});

export const updatePublicProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  const companyId = req.user!.companyId!;
  const profile = await profileService.updatePublicProfile(id, companyId, req.body);
  sendSuccess(res, profile);
});

export const updateMyPublicProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const employee = await profileService.getMyProfile(req.user!.id);
  const updated = await profileService.updatePublicProfile(
    employee.public.id,
    req.user!.companyId!,
    req.body
  );
  sendSuccess(res, updated);
});

export const uploadProfilePicture = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded', code: 'NO_FILE' });
    return;
  }
  const filePath = `/uploads/logos/${req.file.filename}`;
  const result = await profileService.updateProfilePicture(id, req.user!.companyId!, filePath);
  sendSuccess(res, result, 'Profile picture updated');
});

export const removeProfilePicture = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = getString(req.params.id)!;
  const result = await profileService.deleteProfilePicture(id, req.user!.companyId!);
  sendSuccess(res, result, 'Profile picture removed');
});
