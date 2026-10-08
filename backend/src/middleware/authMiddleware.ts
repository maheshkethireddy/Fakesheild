import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export function extractToken(req: Request): string | null {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // Check cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in to access this feature.'
    });
    return;
  }

  const payload = await AuthService.verifyToken(token);
  if (!payload) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.'
    });
    return;
  }

  req.user = payload;
  req.token = token;
  next();
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = extractToken(req);

  if (token) {
    const payload = await AuthService.verifyToken(token);
    if (payload) {
      req.user = payload;
      req.token = token;
    }
  }

  next();
}
