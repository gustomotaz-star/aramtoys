import { supabase } from '../lib/supabase';

export async function getAdminSnapshot() {
  const [orders, customers, products, categories] = await Promise.all([
    supabase.from('orders').select('*, order_items(product_name, quantity), addresses(full_address, city, governorate, phone), profiles(email, full_name, phone)').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, email, full_name, phone, is_admin, created_at').order('created_at', { ascending: false }),
    supabase.from('products').select('id, name, name_ar, price, stock_quantity, image_url, badge, is_active, categories(name)').order('name'),
    supabase.from('categories').select('id, name').order('name'),
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
  }).eq('id', product.id);
}

export function createProduct(payload) {
  return supabase.from('products').insert(payload);
}
