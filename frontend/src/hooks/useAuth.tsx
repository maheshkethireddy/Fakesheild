import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import { authService, LoginPayload, RegisterPayload } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('fakeshield_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        localStorage.removeItem('fakeshield_token');
        setUser(null);
      }
    } catch {
      localStorage.removeItem('fakeshield_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: LoginPayload) => {
    const response = await authService.login(credentials);
    if (response.success && response.data) {
      localStorage.setItem('fakeshield_token', response.data.token);
      setUser(response.data.user);
    }
  };

  const register = async (payload: RegisterPayload) => {
    const response = await authService.register(payload);
    if (response.success && response.data) {
      localStorage.setItem('fakeshield_token', response.data.token);
      setUser(response.data.user);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Continue client cleanup even if network fails
    } finally {
      localStorage.removeItem('fakeshield_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
