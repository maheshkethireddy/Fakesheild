export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash?: string;
  createdAt: string;
}

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  fullName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
      token?: string;
    }
  }
}
