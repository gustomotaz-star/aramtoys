import { supabase } from '../lib/supabase';

export async function getAdminSnapshot() {
  const [orders, customers, products, categories] = await Promise.all([
    supabase.from('orders').select('*, order_items(product_name, quantity), addresses(full_address, city, governorate, phone), profiles(email, full_name, phone)').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, email, full_name, phone, is_admin, created_at').order('created_at', { ascending: false }),
    supabase.from('products').select('id, name, name_ar, price, stock_quantity, image_url, badge, is_active, category_id, categories(name)').order('name'),
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

export function updateProduct(product) {
  return supabase.from('products').update({
    name: product.name,
    price: Number(product.price),
    stock_quantity: Number(product.stock_quantity),
    is_active: Boolean(product.is_active),
    ...(product.category_id ? { category_id: product.category_id } : {}),
  }).eq('id', product.id);
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
  if (!result.error && result.data?.length && product.image_url?.includes('/storage/v1/object/public/product-images/')) {
    const path = decodeURIComponent(product.image_url.split('/product-images/')[1].split('?')[0]);
    await supabase.storage.from('product-images').remove([path]);
  }
  return result;
}

export function hideProduct(productId) {
  return supabase.from('products').update({ is_active: false }).eq('id', productId);
}
