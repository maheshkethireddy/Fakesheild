export interface User {
  id: number;
  fullName: string;
  email: string;
  passwordHash?: string;
  createdAt: string;
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface AuthTokenPayload {
  userId: number;
  email: string;
  fullName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}
