import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';
import { formatMoney } from '../config/app';
import { useI18n } from '../context/I18nContext';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { lang, t } = useI18n();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const { data, error: queryError } = await supabase
        .from('orders')
        .select('id, total, shipping_fee, payment_method, status, created_at, order_items(product_name, quantity, line_total), addresses(full_address, city, governorate)')
        .eq('id', orderId)
        .single();
      if (queryError) setError(queryError.message); else setOrder(data);
    })();
  }, [orderId]);

  return (
    <main className="auth-shell">
      <div className="card auth-card" style={{ maxWidth: 560 }}>
        <Logo />
        <div style={{ fontSize: 54, textAlign: 'center' }}>🎉</div>
        <h1>{t('orderConfirmed')}</h1>
        {error ? <div className="notice error">{error}</div> : !order ? <div className="empty">جاري التحميل...</div> : (
          <div className="stack">
            <div className="muted" style={{ textAlign: 'center' }}>#{order.id.slice(0, 8).toUpperCase()}</div>
            <div className="card card-pad">
              {order.order_items?.map((item, index) => <div className="summary-line" key={`${item.product_name}-${index}`}><span>{item.product_name} × {item.quantity}</span><span>{formatMoney(item.line_total)}</span></div>)}
              <div className="summary-line"><span>{t('shipping')}</span><span>{Number(order.shipping_fee) === 0 ? t('free') : formatMoney(order.shipping_fee)}</span></div>
              <div className="summary-line total"><span>{t('total')}</span><span>{formatMoney(order.total)}</span></div>
              <div className="summary-line"><span>{lang === 'ar' ? 'الدفع' : 'Payment'}</span><span>{order.payment_method === 'cash' ? (lang === 'ar' ? 'عند الاستلام' : 'Cash on delivery') : order.payment_method}</span></div>
              <div className="summary-line"><span>{lang === 'ar' ? 'التوصيل' : 'Deliver to'}</span><span>{order.addresses ? `${order.addresses.full_address}, ${order.addresses.city || ''}` : '—'}</span></div>
            </div>
          </div>
        )}
        <Link className="btn btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: 18 }} to="/">{t('continueShopping')}</Link>
      </div>
    </main>
  );
}
