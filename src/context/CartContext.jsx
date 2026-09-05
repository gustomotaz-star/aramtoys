import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getShippingFee } from '../config/app';

const STORAGE_KEY = 'aram_cart_v2';
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  const addItem = (product, quantity = 1) => setItems((current) => {
    const existing = current.find((item) => item.id === product.id);
    if (existing) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
    return [...current, { id: product.id, name: product.name, name_ar: product.name_ar || null, price: Number(product.price), image_url: product.image_url || null, quantity }];
  });

  const setQuantity = (id, quantity) => setItems((current) => quantity <= 0
    ? current.filter((item) => item.id !== id)
    : current.map((item) => item.id === id ? { ...item, quantity } : item));

  const removeItem = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const clear = () => setItems([]);

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const shipping = getShippingFee(subtotal);
  const total = subtotal + shipping;
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(() => ({ items, addItem, setQuantity, removeItem, clear, subtotal, shipping, total, count }), [items, subtotal, shipping, total, count]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
