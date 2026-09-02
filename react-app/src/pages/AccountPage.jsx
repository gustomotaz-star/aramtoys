import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { formatMoney, statusLabel } from '../config/app';
import { addAddress, getAddresses, updateProfile } from '../services/accountService';
import { getUserOrders } from '../services/orderService';

export default function AccountPage() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const { lang } = useI18n();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' });
  const [addressForm, setAddressForm] = useState({ label: 'Home', full_address: '', city: '', governorate: '', phone: '' });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [message, setMessage] = useState(null);

  const loadData = async () => {
    const [{ data: orderRows }, { data: addressRows }] = await Promise.all([
      getUserOrders(user.id), getAddresses(user.id),
    ]);
    setOrders(orderRows || []);
    setAddresses(addressRows || []);
  };

  useEffect(() => { if (user) loadData(); }, [user]);
  useEffect(() => { setForm({ full_name: profile?.full_name || '', email: profile?.email || '', phone: profile?.phone || '' }); }, [profile]);

  const saveProfile = async (event) => {
    event.preventDefault(); setMessage(null);
    const { error } = await updateProfile(user.id, form);
    if (error) { setMessage({ type: 'error', text: error.message }); return; }
    await refreshProfile(); setEditing(false); setMessage({ type: 'success', text: lang === 'ar' ? 'تم حفظ البيانات.' : 'Profile saved.' });
  };

  const submitAddress = async (event) => {
    event.preventDefault(); setMessage(null);
    const { error } = await addAddress(user.id, addressForm);
    if (error) { setMessage({ type: 'error', text: error.message }); return; }
    setAddressForm({ label: 'Home', full_address: '', city: '', governorate: '', phone: '' });
    setShowAddressForm(false); await loadData();
  };

  const logout = async () => { await signOut(); navigate('/'); };

  return (
    <>
      <Header />
      <main className="page">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="row between wrap" style={{ marginBottom: 20 }}><div><h1 className="page-title" style={{ margin: 0 }}>{lang === 'ar' ? 'حسابي' : 'My account'}</h1><div className="muted">{profile?.full_name || user?.email || ''}</div></div><div className="row"><Link className="btn btn-ghost" to="/">{lang === 'ar' ? 'متابعة التسوق' : 'Continue shopping'}</Link><button className="btn btn-primary" onClick={logout}>{lang === 'ar' ? 'تسجيل الخروج' : 'Sign out'}</button></div></div>
          {message && <div className={`notice ${message.type}`} style={{ marginBottom: 16 }}>{message.text}</div>}
          <div className="stack">
            <section className="card card-pad">
              <div className="row between"><h2>{lang === 'ar' ? 'البيانات الشخصية' : 'Profile'}</h2><button className="btn btn-ghost" onClick={() => setEditing((v) => !v)}>{editing ? (lang === 'ar' ? 'إلغاء' : 'Cancel') : (lang === 'ar' ? 'تعديل' : 'Edit')}</button></div>
              {!editing ? <div className="stack"><div className="summary-line"><span className="muted">{lang === 'ar' ? 'الاسم' : 'Name'}</span><span>{profile?.full_name || '—'}</span></div><div className="summary-line"><span className="muted">Email</span><span>{profile?.email || user?.email || '—'}</span></div><div className="summary-line"><span className="muted">{lang === 'ar' ? 'الجوال' : 'Phone'}</span><span>{profile?.phone || '—'}</span></div></div> : (
                <form className="stack" onSubmit={saveProfile} style={{ marginTop: 14 }}>
                  <div className="form-grid"><div className="field"><label className="label">{lang === 'ar' ? 'الاسم' : 'Name'}</label><input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div><div className="field"><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div></div>
                  <div className="field"><label className="label">{lang === 'ar' ? 'الجوال' : 'Phone'}</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                  <button className="btn btn-primary">{lang === 'ar' ? 'حفظ' : 'Save'}</button>
                </form>
              )}
            </section>

            <section className="card card-pad">
              <h2>{lang === 'ar' ? 'طلباتي' : 'My orders'}</h2>
              {!orders.length ? <div className="empty">{lang === 'ar' ? 'لا يوجد طلبات حتى الآن.' : 'No orders yet.'}</div> : <div className="table-wrap"><table className="table"><thead><tr><th>{lang === 'ar' ? 'الطلب' : 'Order'}</th><th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th><th>{lang === 'ar' ? 'الحالة' : 'Status'}</th><th>{lang === 'ar' ? 'الدفع' : 'Payment'}</th><th>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td>#{order.id.slice(0,8).toUpperCase()}</td><td>{new Date(order.created_at).toLocaleDateString()}</td><td><span className={`badge ${order.status}`}>{statusLabel(order.status, lang)}</span></td><td><span className={`badge ${order.payment_status}`}>{order.payment_status}</span></td><td>{formatMoney(order.total)}</td></tr>)}</tbody></table></div>}
            </section>

            <section className="card card-pad">
              <div className="row between wrap"><h2>{lang === 'ar' ? 'العناوين' : 'Addresses'}</h2><button className="btn btn-ghost" onClick={() => setShowAddressForm((v) => !v)}>{lang === 'ar' ? '+ إضافة عنوان' : '+ Add address'}</button></div>
              <div className="stack" style={{ marginTop: 14 }}>{addresses.map((address) => <div className="address-option" key={address.id}><strong>{address.label || 'Address'}</strong><div>{address.full_address}</div><div className="muted">{address.city || ''} {address.governorate || ''} · {address.phone || ''}</div></div>)}</div>
              {showAddressForm && <form className="stack" onSubmit={submitAddress} style={{ marginTop: 16 }}><div className="form-grid"><div className="field"><label className="label">Label</label><select className="select" value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}><option>Home</option><option>Work</option></select></div><div className="field"><label className="label">{lang === 'ar' ? 'الجوال' : 'Phone'}</label><input className="input" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} /></div><div className="field"><label className="label">{lang === 'ar' ? 'المحافظة' : 'Governorate'}</label><input className="input" value={addressForm.governorate} onChange={(e) => setAddressForm({ ...addressForm, governorate: e.target.value })} required /></div><div className="field"><label className="label">{lang === 'ar' ? 'المنطقة' : 'Area'}</label><input className="input" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} required /></div></div><div className="field"><label className="label">{lang === 'ar' ? 'العنوان الكامل' : 'Full address'}</label><input className="input" value={addressForm.full_address} onChange={(e) => setAddressForm({ ...addressForm, full_address: e.target.value })} required /></div><button className="btn btn-primary">{lang === 'ar' ? 'حفظ العنوان' : 'Save address'}</button></form>}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
