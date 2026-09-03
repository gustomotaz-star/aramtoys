import { supabase } from '../lib/supabase';

export async function uploadProductImage(file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
  const path = `${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from('product-images').upload(path, file);
  if (error) throw error;
  return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
}
