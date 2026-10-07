import { request, ApiResponse } from './api';
import { User } from '../types/user';

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthSuccessData {
  user: User;
  token: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<ApiResponse<AuthSuccessData>> {
    return request<ApiResponse<AuthSuccessData>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async login(payload: LoginPayload): Promise<ApiResponse<AuthSuccessData>> {
    return request<ApiResponse<AuthSuccessData>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async logout(): Promise<ApiResponse<null>> {
    return request<ApiResponse<null>>('/auth/logout', {
      method: 'POST'
    });
  },

  async getMe(): Promise<ApiResponse<User>> {
    return request<ApiResponse<User>>('/auth/me', {
      method: 'GET'
    });
  }
};
