import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const LOGOS_DIR = path.join(UPLOADS_DIR, 'logos');

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const logoStorage = multer.diskStorage({
  destination: (_req: any, _file: any, cb: any) => {
    cb(null, LOGOS_DIR);
  },
  filename: (_req: any, file: any, cb: any) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `logo-${uniqueSuffix}${ext}`);
  },
});

function logoFileFilter(
  _req: Request,
  file: any,
  cb: any
): void {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.map(t => t.replace('image/', '.')).join(', ')}`));
  }
}

export const uploadLogo = multer({
  storage: logoStorage,
  fileFilter: logoFileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).single('logo');

export function handleUploadError(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB',
        code: 'FILE_TOO_LARGE',
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
      code: 'UPLOAD_ERROR',
    });
    return;
  }

  if (err.message?.includes('Invalid file type')) {
    res.status(400).json({
      success: false,
      message: err.message,
      code: 'INVALID_FILE_TYPE',
    });
    return;
  }

  next(err);
}

export { UPLOADS_DIR, LOGOS_DIR };
