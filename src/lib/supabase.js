import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://vwlbidzccpxccowkhchy.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_jOnyXV1B8YkNTcg1X9GBnQ_0TdXoACG';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
