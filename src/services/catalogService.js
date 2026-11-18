import { supabase } from '../lib/supabase';

const BASE_FIELDS = 'id, name, name_ar, price, image_url, badge, stock_quantity, description, description_ar, categories(name, name_ar, icon)';
const PRODUCT_FIELDS = `${BASE_FIELDS}, details, details_ar`;

// Falls back to the base fields if the details columns are not in the database yet.
async function withFallback(build) {
  const result = await build(PRODUCT_FIELDS);
  if (result.error && /details/.test(result.error.message || '')) return build(BASE_FIELDS);
  return result;
}

export async function getCategories() {
  return supabase.from('categories').select('id, name, name_ar, slug, icon').order('name');
}

export async function getFeaturedProducts(limit = 8) {
  return withFallback((fields) => supabase
    .from('products')
    .select(fields)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit));
}

export async function getCategoryBySlug(slug) {
  return supabase.from('categories').select('*').eq('slug', slug).single();
}

export async function getProductsByCategory(categoryId) {
  return withFallback((fields) => supabase
    .from('products')
    .select(fields)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('created_at', { ascending: false }));
}
