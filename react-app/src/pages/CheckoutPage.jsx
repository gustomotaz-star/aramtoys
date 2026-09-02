import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';
import { formatMoney } from '../config/app';
import { supabase } from '../lib/supabase';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal, shipping, total, clear } = useCart();
  const { lang, t } = useI18n();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({ label: 'Home', full_address: '', city: '', governorate: '', phone: '' });

  const loadAddresses = async () => {
    const { data, error } = await supabase.from('addresses').select('*').eq('customer_id', user.id).order('created_at', { ascending: false });
    if (error) { setMessage({ type: 'error', text: error.message }); return; }
    setAddresses(data || []);
    if (!selected && data?.length) setSelected(data[0].id);
    if (!data?.length) setShowForm(true);
  };

  useEffect(() => { if (user) loadAddresses(); }, [user]);
  useEffect(() => { if (!items.length) navigate('/cart', { replace: true }); }, [items.length]);

  const saveAddress = async (event) => {
    event.preventDefault(); setBusy(true); setMessage(null);
    const { data, error } = await supabase.from('addresses').insert({ ...form, customer_id: user.id }).select().single();
    setBusy(false);
    if (error) { setMessage({ type: 'error', text: error.message }); return; }
    setForm({ label: 'Home', full_address: '', city: '', governorate: '', phone: '' });
    setShowForm(false);
    await loadAddresses();
    setSelected(data.id);
  };

  const placeOrder = async () => {
    if (!selected) { setMessage({ type: 'error', text: lang === 'ar' ? 'اختر عنوان التوصيل.' : 'Select a shipping address.' }); return; }
    setBusy(true); setMessage(null);
    const { data, error } = await supabase.rpc('place_order', {
      p_items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })),
      p_address_id: selected,
      p_payment_method: 'cash',
    });
    setBusy(false);
    if (error) { setMessage({ type: 'error', text: error.message }); return; }
    clear();
    navigate(`/order-confirmation/${data}`);
  };

  return (
    <>
      <Header />
      <main className="page">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="row between wrap" style={{ marginBottom: 20 }}><h1 className="page-title" style={{ margin: 0 }}>{t('checkout')}</h1><Link className="muted" to="/cart">← {t('cart')}</Link></div>
          <div className="stack">
            <section className="card card-pad">
              <h2>{lang === 'ar' ? 'عنوان التوصيل' : 'Shipping address'}</h2>
              <div style={{ marginTop: 14 }}>
                {addresses.map((address) => (
                  <label className={`address-option ${selected === address.id ? 'selected' : ''}`} key={address.id}>
                    <div className="row">
                      <input type="radio" name="address" checked={selected === address.id} onChange={() => setSelected(address.id)} />
                      <div><strong>{address.label || 'Address'}</strong><div className="muted">{address.full_address}, {address.city || ''}, {address.governorate || ''}</div><div className="muted">{address.phone || ''}</div></div>
                    </div>
                  </label>
                ))}
              </div>
              <button className="btn btn-ghost" onClick={() => setShowForm((v) => !v)}>{lang === 'ar' ? '+ إضافة عنوان' : '+ Add address'}</button>
              {showForm && (
                <form className="stack" onSubmit={saveAddress} style={{ marginTop: 16 }}>
                  <div className="form-grid">
                    <div className="field"><label className="label">{lang === 'ar' ? 'النوع' : 'Label'}</label><select className="select" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}><option value="Home">Home</option><option value="Work">Work</option></select></div>
                    <div className="field"><label className="label">{t('phone')}</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
                    <div className="field"><label className="label">{lang === 'ar' ? 'المحافظة' : 'Governorate'}</label><input className="input" value={form.governorate} onChange={(e) => setForm({ ...form, governorate: e.target.value })} required /></div>
                    <div className="field"><label className="label">{lang === 'ar' ? 'المنطقة' : 'Area'}</label><input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
                  </div>
                  <div className="field"><label className="label">{lang === 'ar' ? 'العنوان الكامل' : 'Full address'}</label><input className="input" value={form.full_address} onChange={(e) => setForm({ ...form, full_address: e.target.value })} required /></div>
                  <button className="btn btn-primary" disabled={busy}>{lang === 'ar' ? 'حفظ العنوان' : 'Save address'}</button>
                </form>
              )}
            </section>

            <section className="card card-pad"><h2>{lang === 'ar' ? 'طريقة الدفع' : 'Payment method'}</h2><div className="address-option selected" style={{ marginTop: 14 }}><strong>{lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on delivery'}</strong><div className="muted">{lang === 'ar' ? 'الدفع عند وصول الطلب' : 'Pay when your order arrives'}</div></div></section>

            <section className="card summary-card">
              {items.map((item) => <div className="summary-line" key={item.id}><span>{item.name} × {item.quantity}</span><span>{formatMoney(item.price * item.quantity)}</span></div>)}
              <div className="summary-line"><span>{t('subtotal')}</span><span>{formatMoney(subtotal)}</span></div>
              <div className="summary-line"><span>{t('shipping')}</span><span>{shipping === 0 ? t('free') : formatMoney(shipping)}</span></div>
              <div className="summary-line total"><span>{t('total')}</span><span>{formatMoney(total)}</span></div>
            </section>
            {message && <div className={`notice ${message.type}`}>{message.text}</div>}
            <button className="btn btn-coral" disabled={busy} onClick={placeOrder}>{busy ? '...' : (lang === 'ar' ? 'تأكيد الطلب' : 'Place order')}</button>
          </div>
        </div>
      </main>
    </>
  );
}
