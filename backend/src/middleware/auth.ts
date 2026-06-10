import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ActivityLog from '../models/ActivityLog';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; fullName: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string; fullName: string };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

export const logActivity = (activity: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user) {
      await ActivityLog.create({
        user: req.user.id,
        staffName: req.user.fullName,
        role: req.user.role,
        activity,
        ipAddress: req.ip,
      }).catch(() => {});
    }
    next();
  };
};
