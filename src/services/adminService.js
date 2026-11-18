import { supabase } from '../lib/supabase';

const ADMIN_PRODUCT_FIELDS = 'id, name, name_ar, price, stock_quantity, image_url, badge, is_active, category_id, description, description_ar, categories(name)';

async function getAdminProducts() {
  const withDetails = await supabase.from('products').select(`${ADMIN_PRODUCT_FIELDS}, details, details_ar`).order('name');
  if (withDetails.error && /details/.test(withDetails.error.message || '')) return supabase.from('products').select(ADMIN_PRODUCT_FIELDS).order('name');
  return withDetails;
}

export async function getAdminSnapshot() {
  const [orders, customers, products, categories] = await Promise.all([
    supabase.from('orders').select('*, order_items(product_name, quantity), addresses(full_address, city, governorate, phone), profiles(email, full_name, phone)').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, email, full_name, phone, is_admin, created_at').order('created_at', { ascending: false }),
    getAdminProducts(),
    supabase.from('categories').select('id, name, name_ar, slug, icon, created_at').order('created_at').order('slug'),
  ]);
  return { orders, customers, products, categories };
}

export function updateOrderStatus(orderId, status) {
  return supabase.from('orders').update({ status }).eq('id', orderId);
}

export function markOrderPaid(orderId) {
  return supabase.from('orders').update({ payment_status: 'paid' }).eq('id', orderId);
}

function storagePath(url) {
  if (!url?.includes('/storage/v1/object/public/product-images/')) return null;
  return decodeURIComponent(url.split('/product-images/')[1].split('?')[0]);
}

export async function updateProduct(product, previous) {
  const result = await supabase.from('products').update({
    name: product.name.trim(),
    name_ar: product.name_ar?.trim() || null,
    image_url: product.image_url || null,
    description: product.description?.trim() || null,
    description_ar: product.description_ar?.trim() || null,
    ...('details' in product ? { details: product.details?.trim() || null, details_ar: product.details_ar?.trim() || null } : {}),
    price: Number(product.price),
    stock_quantity: Number(product.stock_quantity),
    is_active: Boolean(product.is_active),
    ...(product.category_id ? { category_id: product.category_id } : {}),
  }).eq('id', product.id);
  const oldPath = previous && previous.image_url !== product.image_url ? storagePath(previous.image_url) : null;
  if (!result.error && oldPath) await supabase.storage.from('product-images').remove([oldPath]);
  return result;
}

export function createProduct(payload) {
  return supabase.from('products').insert(payload);
}

export function createCategory(payload) {
  return supabase.from('categories').insert(payload).select().single();
}

export function updateCategory(id, changes) {
  return supabase.from('categories').update(changes).eq('id', id).select().single();
}

export function deleteCategory(id) {
  return supabase.from('categories').delete().eq('id', id).select();
}

export async function deleteProduct(product) {
  const result = await supabase.from('products').delete().eq('id', product.id).select('id');
  const path = storagePath(product.image_url);
  if (!result.error && result.data?.length && path) await supabase.storage.from('product-images').remove([path]);
  return result;
}

export function hideProduct(productId) {
  return supabase.from('products').update({ is_active: false }).eq('id', productId);
}
