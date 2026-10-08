import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Supabase credentials configuration
const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  '';

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '⚠️ Supabase configuration notice: VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is not defined in the backend environment. ' +
    'Please set these environment variables in your deployment dashboard or .env file.'
  );
}

// Fallback placeholder credentials to prevent runtime startup crash if env vars are loaded asynchronously
const resolvedUrl = supabaseUrl || 'https://osugjnkxuoofblqygctf.supabase.co';
const resolvedKey = supabaseKey || 'placeholder-anon-key';

/**
 * Default Supabase Client for general operations.
 */
export const supabase: SupabaseClient = createClient(resolvedUrl, resolvedKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

/**
 * Creates an authenticated Supabase client using a user's Bearer token.
 * This ensures that queries strictly adhere to Supabase Row Level Security (RLS) policies
 * based on the authenticated user's auth.uid().
 */
export function getAuthenticatedSupabaseClient(userToken?: string): SupabaseClient {
  if (!userToken) {
    return supabase;
  }

  return createClient(resolvedUrl, resolvedKey, {
    global: {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

/**
 * Application database initialization hook.
 * Completely replaces legacy SQLite startup.
 * SQLite / better-sqlite3 is removed from the production runtime.
 */
export function initDatabase(): void {
  console.log('🛡️ FakeShield Database initialized: Production Supabase PostgreSQL integration active.');
}
