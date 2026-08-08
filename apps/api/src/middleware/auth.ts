import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RoleName } from '@afreen-mall/shared-types';

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('FATAL SECURITY ERROR: JWT_SECRET environment variable is missing in production!');
  }
  return secret || 'afreen_mall_dev_secret_key_key_change_in_prod';
};

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    staffId: number;
    username: string;
    fullName: string;
    role: RoleName;
    mustChangePassword: boolean;
  };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(allowedRoles: RoleName[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role === RoleName.SUPER_ADMIN) {
      return next(); // Super Admin has access to all operational routes
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Role ${req.user.role} is not authorized for this resource.`,
      });
    }

    next();
  };
}

export function requireSuperAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== RoleName.SUPER_ADMIN) {
    return res.status(403).json({
      error: 'Access denied. Only Super Admin can perform user and role management.',
    });
  }
  next();
}

export function requireManagerOrAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || (req.user.role !== RoleName.SUPER_ADMIN && req.user.role !== RoleName.STORE_MANAGER)) {
    return res.status(403).json({
      error: 'Access denied. Manager or Super Admin role is required for staff account management.',
    });
  }
  next();
}
