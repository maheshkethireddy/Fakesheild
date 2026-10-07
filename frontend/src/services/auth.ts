import { supabase } from '../lib/supabase';
import { User } from '../types/user';
import { validateEmailInput, validatePasswordInput } from '../utils/validation';

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
  token?: string;
}

function getFriendlyErrorMessage(errorMsg: string): string {
  const lower = errorMsg.toLowerCase();
  if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
    return 'Invalid email or password. Please verify your credentials and try again.';
  }
  if (lower.includes('user already registered') || lower.includes('already exists')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (lower.includes('password should be at least') || lower.includes('password is too short')) {
    return 'Password must be at least 6 characters long.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Your email address has not been confirmed yet. Please check your inbox for the confirmation email, or disable "Confirm email" in your Supabase Dashboard (Authentication > Providers > Email) for instant password sign-in.';
  }
  if (lower.includes('failed to fetch') || lower.includes('network')) {
    return 'Network connection error. Please ensure you are connected to the internet.';
  }
  return errorMsg || 'An unexpected authentication error occurred.';
}

export const authService = {
  async register(payload: RegisterPayload): Promise<{ user: User; needsEmailConfirmation: boolean }> {
    const fullName = payload.fullName.trim();
    const email = payload.email.trim();
    const password = payload.password;
    const confirmPassword = payload.confirmPassword;

    // Validation
    if (!fullName) {
      throw new Error('Full Name is required.');
    }
    if (!validateEmailInput(email)) {
      throw new Error('Please provide a valid email address.');
    }
    const passCheck = validatePasswordInput(password);
    if (!passCheck.isValid) {
      throw new Error(passCheck.error || 'Password must be at least 6 characters.');
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          fullName
        }
      }
    });

    if (error) {
      throw new Error(getFriendlyErrorMessage(error.message));
    }

    if (!data.user) {
      throw new Error('Registration failed to create a user account.');
    }

    const user: User = {
      id: data.user.id,
      fullName: fullName,
      email: data.user.email || email,
      createdAt: data.user.created_at
    };

    const needsEmailConfirmation = !data.session;

    // If session is active (e.g. email confirmation disabled), sync profile immediately
    if (data.session) {
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(
            {
              id: data.user.id,
              full_name: fullName,
              email: data.user.email || email,
              created_at: new Date().toISOString()
            },
            { onConflict: 'id' }
          );

        if (profileError) {
          console.warn('Profile sync note:', profileError.message);
        }
      } catch (profileErr) {
        console.warn('Profile upsert exception:', profileErr);
      }
    }

    return { user, needsEmailConfirmation };
  },

  async login(payload: LoginPayload): Promise<{ user: User }> {
    const email = payload.email.trim();
    const password = payload.password;

    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(getFriendlyErrorMessage(error.message));
    }

    if (!data.user) {
      throw new Error('Login failed. No user returned.');
    }

    // Attempt to load full name from profiles or metadata
    let fullName = data.user.user_metadata?.full_name || data.user.user_metadata?.fullName || '';

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profile?.full_name) {
        fullName = profile.full_name;
      }
    } catch {
      // Fallback to metadata
    }

    const user: User = {
      id: data.user.id,
      fullName: fullName || email.split('@')[0],
      email: data.user.email || email,
      createdAt: data.user.created_at
    };

    return { user };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(getFriendlyErrorMessage(error.message));
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user) {
      return null;
    }

    const authUser = session.user;
    let fullName = authUser.user_metadata?.full_name || authUser.user_metadata?.fullName || '';

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', authUser.id)
        .maybeSingle();

      if (profile?.full_name) {
        fullName = profile.full_name;
      }
    } catch {
      // Fallback
    }

    return {
      id: authUser.id,
      fullName: fullName || (authUser.email ? authUser.email.split('@')[0] : 'Analyst'),
      email: authUser.email || '',
      createdAt: authUser.created_at
    };
  }
};
