import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimplePageHeader from '../components/SimplePageHeader';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { supabase } from '../lib/supabase';
import { formatMoney, statusLabel } from '../config/app';

export default function AccountPage() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const { lang, toggleLang } = useI18n();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [editing, setEditing] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ full_name:'', email:'', phone:'' });
  const [addressForm, setAddressForm] = useState({ label:'Home', full_address:'', city:'', governorate:'', phone:'' });
  const ar = lang === 'ar';

  const loadData = async () => {
    const [{data:orderRows},{data:addressRows}] = await Promise.all([
      supabase.from('orders').select('id,status,payment_status,total,created_at').eq('customer_id',user.id).order('created_at',{ascending:false}),
      supabase.from('addresses').select('*').eq('customer_id',user.id).order('created_at',{ascending:false}),
    ]);
    setOrders(orderRows||[]); setAddresses(addressRows||[]);
  };
  useEffect(()=>{ if(user) loadData(); },[user]);
  useEffect(()=>{ setForm({full_name:profile?.full_name||'',email:profile?.email||'',phone:profile?.phone||''}); },[profile]);

  const logout = async()=>{ await signOut(); navigate('/'); };
  const saveProfile = async(e)=>{ e.preventDefault(); setMessage(''); const {error}=await supabase.from('profiles').update({full_name:form.full_name.trim()||null,email:form.email.trim()||null,phone:form.phone.trim()||null}).eq('id',user.id); if(error){setMessage(error.message);return;} await refreshProfile(); setEditing(false); };
  const addAddress = async(e)=>{ e.preventDefault(); setMessage(''); const {error}=await supabase.from('addresses').insert({...addressForm,customer_id:user.id}); if(error){setMessage(error.message);return;} setAddressForm({label:'Home',full_address:'',city:'',governorate:'',phone:''}); setShowAddress(false); await loadData(); };

  return (
    <main className="simple-page account-width">
      <SimplePageHeader onSignOut={logout} />
      <h1>{ar ? 'حسابي' : 'My Account'}</h1>
      <a className="shop-btn" href="/">{ar ? 'متابعة التسوق ←' : 'Continue Shopping →'}</a>

      <section className="legacy-card">
        <h2>{ar ? 'البيانات الشخصية' : 'Profile'}</h2>
        {!editing ? <div>
          <div className="account-row"><span>{ar?'الاسم':'Name'}</span><span>{profile?.full_name||'—'}</span></div>
          <div className="account-row"><span>Email</span><span>{profile?.email||user?.email||'—'}</span></div>
          <div className="account-row"><span>{ar?'الهاتف':'Phone'}</span><span>{profile?.phone||'—'}</span></div>
          <button className="toggle-form" style={{marginTop:14}} onClick={()=>setEditing(true)}>✎ {ar?'تعديل البيانات الشخصية':'Edit Personal Info'}</button>
        </div> : <form className="legacy-form" onSubmit={saveProfile}>
          <label>{ar?'الاسم':'Name'}</label><input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}/>
          <label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
          <label>{ar?'الهاتف':'Phone'}</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
          <button className="save-addr-btn">{ar?'حفظ':'Save'}</button> <button type="button" className="remove-link" onClick={()=>setEditing(false)}>{ar?'إلغاء':'Cancel'}</button>
        </form>}
      </section>

      <section className="legacy-card">
        <h2>{ar?'طلباتي':'My Orders'}</h2>
        {!orders.length ? <div className="muted">{ar?'لا يوجد طلبات حتى الآن.':'No orders yet.'}</div> : orders.map(o=><div className="account-row" key={o.id}><span>{new Date(o.created_at).toLocaleDateString()} — {statusLabel(o.status,lang)}</span><span>{formatMoney(o.total)} ({o.payment_status})</span></div>)}
      </section>

      <section className="legacy-card">
        <h2>{ar?'عناويني':'My Addresses'}</h2>
        {!addresses.length ? <div className="muted">{ar?'لا توجد عناوين محفوظة.':'No saved addresses yet.'}</div> : addresses.map(a=><div className="account-row" key={a.id}><span>{a.label||'Address'}</span><span>{a.full_address}, {a.city||''} {a.governorate||''}</span></div>)}
        <button className="toggle-form" style={{marginTop:12}} onClick={()=>setShowAddress(v=>!v)}>+ {ar?'إضافة عنوان':'Add Address'}</button>
        {showAddress && <form className="legacy-form" onSubmit={addAddress}>
          <select value={addressForm.label} onChange={e=>setAddressForm({...addressForm,label:e.target.value})}><option value="Home">Home</option><option value="Work">Work</option></select>
          <div className="addr-form-row"><input placeholder={ar?'المحافظة':'Governorate'} value={addressForm.governorate} onChange={e=>setAddressForm({...addressForm,governorate:e.target.value})} required/><input placeholder={ar?'المنطقة':'Area'} value={addressForm.city} onChange={e=>setAddressForm({...addressForm,city:e.target.value})} required/></div>
          <input placeholder={ar?'العنوان الكامل':'Full address'} value={addressForm.full_address} onChange={e=>setAddressForm({...addressForm,full_address:e.target.value})} required/>
          <input placeholder={ar?'الهاتف':'Phone'} value={addressForm.phone} onChange={e=>setAddressForm({...addressForm,phone:e.target.value})}/>
          <button className="save-addr-btn">{ar?'حفظ العنوان':'Save Address'}</button>
        </form>}
      </section>
      {message && <div className="auth-message error">{message}</div>}
      <div className="auth-bottom-lang"><button className="lang-toggle" onClick={toggleLang}>{ar?'English':'العربية'}</button></div>
    </main>
  );
}
