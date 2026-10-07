import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Supabase configuration error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY environment variables. ' +
    'Please ensure these values are properly defined in your frontend environment (.env file).'
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

/**
 * Reusable helper to verify Supabase client initialization & connectivity.
 */
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string; error?: any }> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      return { ok: false, message: `Supabase auth connection check failed: ${error.message}`, error };
    }
    return { ok: true, message: 'Supabase client connected and session checked successfully.' };
  } catch (err: any) {
    return { ok: false, message: `Supabase connection unexpected error: ${err?.message || err}`, error: err };
  }
}
