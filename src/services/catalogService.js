import { supabase } from '../lib/supabase';

export async function getCategories() {
  return supabase.from('categories').select('id, name, name_ar, slug, icon').order('name');
}

export async function getFeaturedProducts(limit = 8) {
  return supabase
    .from('products')
    .select('id, name, name_ar, price, image_url, badge, stock_quantity, categories(name, name_ar)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);
}

export async function getCategoryBySlug(slug) {
  return supabase.from('categories').select('*').eq('slug', slug).single();
}

export async function getProductsByCategory(categoryId) {
  return supabase
    .from('products')
    .select('id, name, name_ar, price, image_url, badge, stock_quantity, categories(name, name_ar)')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
}
