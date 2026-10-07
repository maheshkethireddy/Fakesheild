import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types/user';
import { authService, LoginPayload, RegisterPayload } from '../services/auth';

interface AuthContextType {
  user: User | null;
  currentUser: User | null;
  session: Session | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<{ user: User; needsEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const syncUserFromSupabase = useCallback(async (sbUser: SupabaseUser | null): Promise<User | null> => {
    if (!sbUser) return null;

    let fullName = sbUser.user_metadata?.full_name || sbUser.user_metadata?.fullName || '';

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', sbUser.id)
        .maybeSingle();

      if (profile?.full_name) {
        fullName = profile.full_name;
      }
    } catch {
      // Graceful fallback to metadata
    }

    return {
      id: sbUser.id,
      fullName: fullName || (sbUser.email ? sbUser.email.split('@')[0] : 'Analyst'),
      email: sbUser.email || '',
      createdAt: sbUser.created_at
    };
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error || !currentSession?.user) {
        setSession(null);
        setUser(null);
      } else {
        setSession(currentSession);
        const mappedUser = await syncUserFromSupabase(currentSession.user);
        setUser(mappedUser);
      }
    } catch {
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [syncUserFromSupabase]);

  useEffect(() => {
    // Initial session load
    refreshUser();

    // Listen to Supabase auth state transitions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        const mappedUser = await syncUserFromSupabase(newSession.user);
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshUser, syncUserFromSupabase]);

  const login = async (credentials: LoginPayload) => {
    const { user: loggedInUser } = await authService.login(credentials);
    setUser(loggedInUser);
  };

  const register = async (payload: RegisterPayload) => {
    const { user: registeredUser, needsEmailConfirmation } = await authService.register(payload);
    if (!needsEmailConfirmation) {
      setUser(registeredUser);
    }
    return { user: registeredUser, needsEmailConfirmation };
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setSession(null);
    }
  };

  const authenticated = !loading && !!user;
  const unauthenticated = !loading && !user;

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        session,
        loading,
        authenticated,
        unauthenticated,
        login,
        register,
        logout,
        refreshUser
      }}
    >
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
