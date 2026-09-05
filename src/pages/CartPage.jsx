import { Link } from 'react-router-dom';
import SimplePageHeader from '../components/SimplePageHeader';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';
import { formatMoney } from '../config/app';

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotal, shipping, total } = useCart();
  const { lang } = useI18n();
  const ar = lang === 'ar';

  return (
    <main className="simple-page">
      <SimplePageHeader backTo="/" backLabel={ar ? '← متابعة التسوق' : '← Continue Shopping'} />
      <h1>{ar ? 'سلة التسوق' : 'Your Cart'}</h1>

      {!items.length ? (
        <div className="empty">{ar ? 'سلة التسوق فارغة.' : 'Your cart is empty.'} <Link to="/">{ar ? 'تصفح الألعاب ←' : 'Browse toys →'}</Link></div>
      ) : (
        <>
          {items.map((item) => (
            <div className="cart-item-legacy" key={item.id}>
              <span className="cart-item-name">{ar ? (item.name_ar || item.name) : item.name}</span>
              <div className="qty-control">
                <button onClick={() => setQuantity(item.id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => setQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <span className="cart-item-price">{formatMoney(item.price * item.quantity)}</span>
              <button className="remove-link" onClick={() => removeItem(item.id)}>{ar ? 'حذف' : 'Remove'}</button>
            </div>
          ))}
          <div className="legacy-summary">
            <div className="summary-line"><span>{ar ? 'الإجمالي الفرعي' : 'Subtotal'}</span><span>{formatMoney(subtotal)}</span></div>
            <div className="summary-line"><span>{ar ? 'الشحن' : 'Shipping'}</span><span>{shipping === 0 ? (ar ? 'مجاني' : 'Free') : formatMoney(shipping)}</span></div>
            <div className="summary-line total"><span>{ar ? 'الإجمالي' : 'Total'}</span><span>{formatMoney(total)}</span></div>
          </div>
          <Link to="/checkout" className="checkout-link">{ar ? 'إتمام الطلب' : 'Checkout'}</Link>
        </>
      )}
      <div className="auth-bottom-lang"><SimpleLanguage /></div>
    </main>
  );
}

function SimpleLanguage(){
  const { lang, toggleLang } = useI18n();
  return <button className="lang-toggle" onClick={toggleLang}>{lang === 'ar' ? 'English' : 'العربية'}</button>;
}
