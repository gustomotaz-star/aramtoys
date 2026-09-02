import { supabase } from '../lib/supabase';

export function getUserAddresses(userId) {
  return supabase.from('addresses').select('*').eq('customer_id', userId).order('created_at', { ascending: false });
}

export function addUserAddress(userId, payload) {
  return supabase.from('addresses').insert({ ...payload, customer_id: userId }).select().single();
}

export function placeOrder({ items, addressId, paymentMethod = 'cash' }) {
  return supabase.rpc('place_order', {
    p_items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })),
    p_address_id: addressId,
    p_payment_method: paymentMethod,
  });
}

export function getOrder(orderId) {
  return supabase
    .from('orders')
    .select('id, total, shipping_fee, payment_method, status, created_at, order_items(product_name, quantity, line_total), addresses(full_address, city, governorate)')
    .eq('id', orderId)
    .single();
}

export function getUserOrders(userId) {
  return supabase.from('orders').select('id, status, payment_status, total, created_at').eq('customer_id', userId).order('created_at', { ascending: false });
}
