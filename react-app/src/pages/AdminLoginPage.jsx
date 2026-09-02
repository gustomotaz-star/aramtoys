import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage(){
  const {user,isAdmin,loading}=useAuth(); const navigate=useNavigate(); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [busy,setBusy]=useState(false); const [message,setMessage]=useState(null);
  useEffect(()=>{if(!loading&&user&&isAdmin)navigate('/admin',{replace:true});},[loading,user,isAdmin]);
  const submit=async(e)=>{e.preventDefault();setBusy(true);setMessage(null);const {data,error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error){setBusy(false);setMessage(error.message);return;}const {data:profile,error:profileError}=await supabase.from('profiles').select('is_admin').eq('id',data.user.id).single();if(profileError||!profile?.is_admin){await supabase.auth.signOut();setBusy(false);setMessage('This account does not have management access.');return;}navigate('/admin',{replace:true});};
  return <main className="auth-shell admin-auth-shell"><div className="auth-wrap admin"><div className="auth-top-logo"><Logo /></div><div className="auth-card admin-login-card"><h1 style={{fontSize:22}}>Management</h1><p className="auth-sub">Owner access only</p><form onSubmit={submit}><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/><button className="auth-submit" disabled={busy}>{busy?'...':'Sign In'}</button>{message&&<p className="auth-message error">{message}</p>}</form><Link className="auth-back" to="/">← Back to shop</Link></div></div></main>;
}
