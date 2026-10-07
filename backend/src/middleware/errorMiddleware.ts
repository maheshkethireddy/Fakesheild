import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Safe console logging for debugging during development
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error captured:', err?.message || err);
  }

  const statusCode = err.statusCode || (err.status ? Number(err.status) : 500);
  const message = err.message || 'An unexpected internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    message
  });
}
