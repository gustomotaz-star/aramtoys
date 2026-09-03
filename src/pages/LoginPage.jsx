import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';
import { phoneToSyntheticEmail } from '../config/app';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';

export default function LoginPage() {
  const { user } = useAuth();
  const { lang, toggleLang } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [mode,setMode]=useState('login');
  const [method,setMethod]=useState('email');
  const [identifier,setIdentifier]=useState('');
  const [password,setPassword]=useState('');
  const [confirm,setConfirm]=useState('');
  const [message,setMessage]=useState(null);
  const [busy,setBusy]=useState(false);
  const ar=lang==='ar';

  useEffect(()=>{ if(user) navigate(location.state?.from||'/',{replace:true}); },[user]);

  const submit=async(e)=>{e.preventDefault();setBusy(true);setMessage(null);try{
    if(mode==='login'){
      const email=identifier.includes('@')?identifier.trim():phoneToSyntheticEmail(identifier);
      const {error}=await supabase.auth.signInWithPassword({email,password}); if(error) throw error; navigate('/',{replace:true});
    }else{
      if(password!==confirm) throw new Error(ar?'كلمتا المرور غير متطابقتين.':'Passwords do not match.');
      const email=method==='email'?identifier.trim():phoneToSyntheticEmail(identifier);
      const {data,error}=await supabase.auth.signUp({email,password}); if(error) throw error;
      if(data.user&&method==='phone') await supabase.from('profiles').update({phone:identifier.trim(),email:null}).eq('id',data.user.id);
      if(data.session) navigate('/',{replace:true}); else setMessage({type:'success',text:ar?'تم إنشاء الحساب.':'Account created.'});
    }
  }catch(error){setMessage({type:'error',text:error.message});}finally{setBusy(false);}};

  return <main className="auth-shell"><div className="auth-wrap">
    <div className="auth-top-logo"><Logo /></div>
    <div className="auth-lang"><button className="lang-toggle" onClick={toggleLang}>{ar?'English':'العربية'}</button></div>
    <div className="auth-card">
      <h1>{ar?'مرحباً بك في آرام تويز':'Welcome to Aram Toys'}</h1>
      <p className="auth-sub">{ar?'سجل الدخول لمتابعة الطلبات وحفظ عناوينك':'Sign in to track orders and save your addresses'}</p>
      <div className="auth-tabs"><button className={mode==='login'?'active':''} onClick={()=>{setMode('login');setMessage(null)}}>{ar?'دخول':'Sign In'}</button><button className={mode==='signup'?'active':''} onClick={()=>{setMode('signup');setMessage(null)}}>{ar?'إنشاء حساب':'Create Account'}</button></div>
      <form onSubmit={submit}>
        {mode==='signup'&&<><label>{ar?'إنشاء الحساب باستخدام':'Sign up with'}</label><div className="auth-tabs" style={{marginBottom:0}}><button type="button" className={method==='email'?'active':''} onClick={()=>setMethod('email')}>{ar?'البريد':'Email'}</button><button type="button" className={method==='phone'?'active':''} onClick={()=>setMethod('phone')}>{ar?'الهاتف':'Phone'}</button></div></>}
        <label>{mode==='login'?(ar?'البريد الإلكتروني أو الهاتف':'Email or Phone'):(method==='email'?(ar?'البريد الإلكتروني':'Email'):(ar?'الهاتف':'Phone'))}</label>
        <input type={mode==='signup'&&method==='email'?'email':'text'} value={identifier} onChange={e=>setIdentifier(e.target.value)} required />
        <label>{ar?'كلمة المرور':'Password'}</label><input type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required />
        {mode==='signup'&&<><label>{ar?'تأكيد كلمة المرور':'Confirm Password'}</label><input type="password" minLength={6} value={confirm} onChange={e=>setConfirm(e.target.value)} required /></>}
        <button className="auth-submit" disabled={busy}>{busy?'...':(mode==='login'?(ar?'دخول':'Sign In'):(ar?'إنشاء حساب':'Create Account'))}</button>
        {message&&<p className={`auth-message ${message.type}`}>{message.text}</p>}
      </form>
      <Link className="auth-back" to="/">← {ar?'العودة للمتجر':'Back to shop'}</Link>
    </div>
    <div className="auth-bottom-lang"><button className="lang-toggle" onClick={toggleLang}>{ar?'English':'العربية'}</button></div>
  </div></main>;
}
