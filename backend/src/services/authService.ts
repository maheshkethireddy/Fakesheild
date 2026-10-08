import jwt from 'jsonwebtoken';
import { supabase } from '../database/db';
import { AuthTokenPayload, UserResponse } from '../types/user';
import { validateEmail, validatePassword } from '../utils/validation';

const JWT_SECRET = process.env.JWT_SECRET || 'fakeshield_super_secret_jwt_key_hackathon_2025_cs6';
const TOKEN_EXPIRY = '7d';

function getFriendlyErrorMessage(errorMsg: string): string {
  const lower = (errorMsg || '').toLowerCase();
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
    return 'Your email address has not been confirmed yet. Please verify your email or disable email confirmation in Supabase.';
  }
  return errorMsg || 'An authentication error occurred.';
}

export class AuthService {
  static async register(
    fullName: string,
    email: string,
    password: string,
    confirmPassword?: string
  ): Promise<{ user: UserResponse; token: string }> {
    if (!fullName || fullName.trim().length < 2) {
      throw new Error('Full name is required (minimum 2 characters).');
    }

    if (!validateEmail(email)) {
      throw new Error('A valid email address is required.');
    }

    const passCheck = validatePassword(password);
    if (!passCheck.isValid) {
      throw new Error(passCheck.error || 'Invalid password.');
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    // Sign up via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
          fullName: cleanName
        }
      }
    });

    if (error) {
      throw new Error(getFriendlyErrorMessage(error.message));
    }

    if (!data.user) {
      throw new Error('Registration failed to create a user account.');
    }

    const userId = data.user.id;

    // Sync to profiles table
    try {
      await supabase.from('profiles').upsert(
        {
          id: userId,
          full_name: cleanName,
          email: cleanEmail,
          created_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      );
    } catch (profileErr) {
      console.warn('Profile sync note:', profileErr);
    }

    const user: UserResponse = {
      id: userId,
      fullName: cleanName,
      email: cleanEmail,
      createdAt: data.user.created_at || new Date().toISOString()
    };

    const token =
      data.session?.access_token ||
      this.generateToken({
        userId: user.id,
        email: user.email,
        fullName: user.fullName
      });

    return { user, token };
  }

  static async login(email: string, password: string): Promise<{ user: UserResponse; token: string }> {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (error) {
      throw new Error(getFriendlyErrorMessage(error.message));
    }

    if (!data.user) {
      throw new Error('Invalid email or password.');
    }

    let fullName =
      data.user.user_metadata?.full_name ||
      data.user.user_metadata?.fullName ||
      '';

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profile?.full_name) {
        fullName = profile.full_name;
      }
    } catch {}

    const user: UserResponse = {
      id: data.user.id,
      fullName: fullName || cleanEmail.split('@')[0],
      email: cleanEmail,
      createdAt: data.user.created_at || new Date().toISOString()
    };

    const token =
      data.session?.access_token ||
      this.generateToken({
        userId: user.id,
        email: user.email,
        fullName: user.fullName
      });

    return { user, token };
  }

  static async getUserById(userId: string): Promise<UserResponse | null> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && profile) {
        return {
          id: profile.id,
          fullName: profile.full_name || '',
          email: profile.email || '',
          createdAt: profile.created_at
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  static generateToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  }

  static async verifyToken(token: string): Promise<AuthTokenPayload | null> {
    if (!token) return null;

    // 1. First attempt to verify with Supabase Auth
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        return {
          userId: user.id,
          email: user.email || '',
          fullName:
            user.user_metadata?.full_name ||
            user.user_metadata?.fullName ||
            user.email?.split('@')[0] ||
            'User'
        };
      }
    } catch {}

    // 2. Fallback to local JWT verification
    try {
      return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    } catch {
      return null;
    }
  }
}
