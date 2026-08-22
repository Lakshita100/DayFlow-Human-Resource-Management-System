import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

interface ValidationSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

const fieldLabels: Record<string, string> = {
  loginId: 'Login ID',
  password: 'Password',
  confirmPassword: 'Confirm password',
  companyName: 'Company name',
  adminName: 'Admin name',
  email: 'Email',
  phone: 'Phone number',
  logoUrl: 'Logo URL',
  currentPassword: 'Current password',
  newPassword: 'New password',
};

function formatFieldName(path: (string | number)[]): string {
  if (path.length === 0) return 'Field';
  const key = String(path[0]);
  return fieldLabels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as typeof req.params;
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as typeof req.query;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join('.'),
          fieldLabel: formatFieldName(e.path),
          message: e.message,
          code: e.code,
        }));

        const primaryMessage = errors.length === 1
          ? `${errors[0].fieldLabel}: ${errors[0].message}`
          : `Validation failed: ${errors.length} error(s)`;

        res.status(400).json({
          success: false,
          message: primaryMessage,
          code: 'VALIDATION_ERROR',
          errors,
        });
        return;
      }
      next(error);
    }
  };
}
