import { supabase } from '../lib/supabase';

export function getSiteContent(slug) {
  return supabase
    .from('site_content')
    .select('*')
    .eq('slug', slug)
    .single();
}

export function getAllSiteContent() {
  return supabase
    .from('site_content')
    .select('*')
    .order('slug');
}

export function updateSiteContent(slug, changes) {
  return supabase
    .from('site_content')
    .update({ ...changes, updated_at: new Date().toISOString() })
    .eq('slug', slug)
    .select()
    .single();
}
