import { supabase } from '../lib/supabase';
import { phoneToSyntheticEmail } from '../config/app';

export function signIn(identifier, password) {
  const email = identifier.includes('@') ? identifier.trim() : phoneToSyntheticEmail(identifier);
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp({ identifier, password, method }) {
  const email = method === 'email' ? identifier.trim() : phoneToSyntheticEmail(identifier);
  const result = await supabase.auth.signUp({ email, password });
  if (!result.error && result.data.user && method === 'phone') {
    await supabase.from('profiles').update({ phone: identifier.trim(), email: null }).eq('id', result.data.user.id);
  }
  return result;
}

export function sendPasswordRecovery(email, redirectTo) {
  return supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
}

export async function signInAdmin(email, password) {
  const authResult = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (authResult.error) return { ...authResult, isAdmin: false };
  const { data: profile, error: profileError } = await supabase.from('profiles').select('is_admin').eq('id', authResult.data.user.id).single();
  if (profileError || !profile?.is_admin) {
    await supabase.auth.signOut();
    return { data: authResult.data, error: profileError || new Error('This account does not have management access.'), isAdmin: false };
  }
  return { data: authResult.data, error: null, isAdmin: true };
}
