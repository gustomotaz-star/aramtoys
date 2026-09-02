export const APP = {
  name: 'Aram Toys',
  currency: 'EGP',
  freeShippingThreshold: 800,
  shippingFee: 50,
  lowStockThreshold: 10,
  phoneEmailDomain: 'phone.aramtoys.local',
};

export const ORDER_STATUSES = [
  { value: 'pending', labelAr: 'جديد ينتظر القبول', labelEn: 'Pending' },
  { value: 'processing', labelAr: 'جاري التجهيز', labelEn: 'Processing' },
  { value: 'shipped', labelAr: 'خرج للشحن', labelEn: 'Shipped' },
  { value: 'delivered', labelAr: 'تم التسليم', labelEn: 'Delivered' },
  { value: 'cancelled', labelAr: 'مرفوض / ملغي', labelEn: 'Cancelled' },
];

export const getShippingFee = (subtotal) => subtotal >= APP.freeShippingThreshold ? 0 : APP.shippingFee;
export const formatMoney = (value) => `${Number(value || 0).toFixed(0)} ${APP.currency}`;
export const phoneToSyntheticEmail = (phone) => `${String(phone || '').replace(/\D/g, '')}@${APP.phoneEmailDomain}`;
export const statusLabel = (status, lang = 'ar') => {
  const item = ORDER_STATUSES.find((entry) => entry.value === status);
  return item ? (lang === 'ar' ? item.labelAr : item.labelEn) : status;
};
