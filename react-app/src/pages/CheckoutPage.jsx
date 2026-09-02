import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimplePageHeader from '../components/SimplePageHeader';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';
import { formatMoney } from '../config/app';
import { supabase } from '../lib/supabase';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, shipping, total, clear } = useCart();
  const { lang, toggleLang } = useI18n();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ label: '', full_address: '', city: '', governorate: '', phone: '' });
  const ar = lang === 'ar';

  const loadAddresses = async () => {
    const { data, error } = await supabase.from('addresses').select('*').eq('customer_id', user.id).order('created_at', { ascending: false });
    if (error) { setMessage(error.message); return; }
    setAddresses(data || []);
    if (!selected && data?.length) setSelected(data[0].id);
    if (!data?.length) setShowForm(true);
  };

  useEffect(() => { if (user) loadAddresses(); }, [user]);
  useEffect(() => { if (!items.length) navigate('/cart', { replace: true }); }, [items.length]);

  const saveAddress = async (event) => {
    event.preventDefault(); setBusy(true); setMessage('');
    const { data, error } = await supabase.from('addresses').insert({ ...form, customer_id: user.id }).select().single();
    setBusy(false);
    if (error) { setMessage(error.message); return; }
    setForm({ label: '', full_address: '', city: '', governorate: '', phone: '' }); setShowForm(false); await loadAddresses(); setSelected(data.id);
  };

  const placeOrder = async () => {
    if (!selected) { setMessage(ar ? 'اختر عنوان التوصيل.' : 'Select a shipping address.'); return; }
    setBusy(true); setMessage('');
    const { data, error } = await supabase.rpc('place_order', { p_items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })), p_address_id: selected, p_payment_method: 'cash' });
    setBusy(false);
    if (error) { setMessage(error.message); return; }
    clear(); navigate(`/order-confirmation/${data}`);
  };

  return (
    <main className="simple-page narrow">
      <SimplePageHeader backTo="/cart" backLabel={ar ? '← العودة للسلة' : '← Back to Cart'} />
      <h1>{ar ? 'إتمام الطلب' : 'Checkout'}</h1>

      <section className="legacy-card">
        <h2>{ar ? 'عنوان التوصيل' : 'Shipping Address'}</h2>
        {addresses.map((address) => <label className={`addr-option ${selected === address.id ? 'selected' : ''}`} key={address.id}><input type="radio" name="address" checked={selected === address.id} onChange={() => setSelected(address.id)} /><div><strong>{address.label || (ar ? 'عنوان' : 'Address')}</strong><div>{address.full_address}, {address.city || ''} {address.governorate || ''}</div><div>{address.phone || ''}</div></div></label>)}
        <button className="toggle-form" onClick={() => setShowForm((v) => !v)}>{ar ? '+ إضافة عنوان جديد' : '+ Add a new address'}</button>
        {showForm && <form className="legacy-form" onSubmit={saveAddress}><input placeholder={ar ? 'الاسم (مثلاً: المنزل)' : 'Label (e.g. Home)'} value={form.label} onChange={(e)=>setForm({...form,label:e.target.value})} required /><input placeholder={ar ? 'العنوان الكامل' : 'Full address (street, building, floor)'} value={form.full_address} onChange={(e)=>setForm({...form,full_address:e.target.value})} required /><input placeholder={ar ? 'المدينة' : 'City'} value={form.city} onChange={(e)=>setForm({...form,city:e.target.value})} required /><input placeholder={ar ? 'المحافظة' : 'Governorate'} value={form.governorate} onChange={(e)=>setForm({...form,governorate:e.target.value})} required /><input placeholder={ar ? 'رقم الهاتف' : 'Phone number'} value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} required /><button className="save-addr-btn" disabled={busy}>{ar ? 'حفظ العنوان' : 'Save Address'}</button></form>}
      </section>

      <section className="legacy-card">
        <h2>{ar ? 'طريقة الدفع' : 'Payment Method'}</h2>
        <label className="pay-option selected"><input type="radio" checked readOnly /><div><div style={{fontWeight:700,fontSize:14}}>{ar ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</div><div className="muted" style={{fontSize:12}}>{ar ? 'ادفع عند وصول الطلب' : 'Pay when your order arrives'}</div></div></label>
        <label className="pay-option disabled"><input type="radio" disabled /><div><div style={{fontWeight:700,fontSize:14}}>{ar ? 'بطاقة ائتمان / خصم (Visa)' : 'Credit / Debit Card (Visa)'}</div><div className="muted" style={{fontSize:12}}>{ar ? 'قريباً' : 'Coming soon'}</div></div></label>
      </section>

      <section className="legacy-card">
        <h2>{ar ? 'ملخص الطلب' : 'Order Summary'}</h2>
        {items.map((item) => <div className="summary-line" key={item.id}><span>{item.name} × {item.quantity}</span><span>{formatMoney(item.price * item.quantity)}</span></div>)}
        <div className="summary-line"><span>{ar ? 'الشحن' : 'Shipping'}</span><span>{shipping === 0 ? (ar ? 'مجاني' : 'Free') : formatMoney(shipping)}</span></div>
        <div className="summary-line total" style={{borderColor:'var(--color-line)',color:'var(--color-ink)'}}><span>{ar ? 'الإجمالي' : 'Total'}</span><span>{formatMoney(total)}</span></div>
        <button className="place-btn" disabled={busy} onClick={placeOrder}>{busy ? '...' : (ar ? 'تأكيد الطلب' : 'Place Order')}</button>
        {message && <p className="auth-message error">{message}</p>}
      </section>
      <div className="auth-bottom-lang"><button className="lang-toggle" onClick={toggleLang}>{ar ? 'English' : 'العربية'}</button></div>
    </main>
  );
}
