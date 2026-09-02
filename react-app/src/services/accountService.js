import { supabase } from '../lib/supabase';

export function updateProfile(userId, payload) {
  return supabase.from('profiles').update({
    full_name: payload.full_name?.trim() || null,
    email: payload.email?.trim() || null,
    phone: payload.phone?.trim() || null,
  }).eq('id', userId);
}

export function getAddresses(userId) {
  return supabase.from('addresses').select('*').eq('customer_id', userId).order('created_at', { ascending: false });
}

export function addAddress(userId, payload) {
  return supabase.from('addresses').insert({ ...payload, customer_id: userId });
}
