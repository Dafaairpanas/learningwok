import { createClient } from '@supabase/supabase-js';

// Helper to get env vars in both Vite (Astro) and Node (scripts)
const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // Fallback to process.env for Node scripts
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

const supabaseUrl = getEnv('PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnv('PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Key is missing in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
