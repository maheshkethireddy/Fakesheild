import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const isProduction = process.env.NODE_ENV === 'production';

function setAuthCookie(res: Response, token: string): void {
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { fullName, email, password, confirmPassword } = req.body;
      const { user, token } = AuthService.register(fullName, email, password, confirmPassword);

      setAuthCookie(res, token);

      res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        data: {
          user,
          token
        }
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || 'Registration failed.'
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = AuthService.login(email, password);

      setAuthCookie(res, token);

      res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        data: {
          user,
          token
        }
      });
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: err.message || 'Login failed.'
      });
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax'
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  }

  static async me(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated.'
        });
        return;
      }

      const user = AuthService.getUserById(req.user.userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User account not found.'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Failed to retrieve user profile.'
      });
    }
  }
}
