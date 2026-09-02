import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';
import { formatMoney } from '../config/app';

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotal, shipping, total } = useCart();
  const { lang, t } = useI18n();

  return (
    <>
      <Header />
      <main className="page">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="row between wrap" style={{ marginBottom: 20 }}>
            <h1 className="page-title" style={{ margin: 0 }}>{t('cart')}</h1>
            <Link className="muted" to="/">← {t('continueShopping')}</Link>
          </div>

          {!items.length ? (
            <div className="card empty">{t('emptyCart')} — <Link to="/">{t('browse')}</Link></div>
          ) : (
            <div className="stack">
              <div className="cart-list">
                {items.map((item) => (
                  <div className="card cart-item" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <div className="muted" style={{ fontSize: 12 }}>{formatMoney(item.price)} / {lang === 'ar' ? 'قطعة' : 'item'}</div>
                    </div>
                    <div className="qty">
                      <button onClick={() => setQuantity(item.id, item.quantity - 1)}>−</button>
                      <strong>{item.quantity}</strong>
                      <button onClick={() => setQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <strong>{formatMoney(item.price * item.quantity)}</strong>
                    <button className="btn btn-ghost" onClick={() => removeItem(item.id)}>{lang === 'ar' ? 'حذف' : 'Remove'}</button>
                  </div>
                ))}
              </div>

              <div className="card summary-card">
                <div className="summary-line"><span>{t('subtotal')}</span><span>{formatMoney(subtotal)}</span></div>
                <div className="summary-line"><span>{t('shipping')}</span><span>{shipping === 0 ? t('free') : formatMoney(shipping)}</span></div>
                <div className="summary-line total"><span>{t('total')}</span><span>{formatMoney(total)}</span></div>
              </div>
              <Link to="/checkout" className="btn btn-coral" style={{ textAlign: 'center' }}>{t('checkout')}</Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
