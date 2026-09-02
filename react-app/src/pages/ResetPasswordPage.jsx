import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState({ type: '', text: 'جاري التحقق من رابط الاستعادة...' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = hash.get('access_token');
        const refreshToken = hash.get('refresh_token');
        const type = hash.get('type');
        if (accessToken && refreshToken) {
          if (type && type !== 'recovery') throw new Error('هذا الرابط ليس رابط استعادة صالحًا.');
          const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          if (error) throw error;
          history.replaceState(null, document.title, window.location.pathname + window.location.search);
        }
        const { data } = await supabase.auth.getSession();
        if (!data.session) throw new Error('رابط الاستعادة غير صالح أو انتهت صلاحيته.');
        setReady(true); setMessage({ type: '', text: '' });
      } catch (error) { setMessage({ type: 'error', text: error.message }); }
    })();
  }, []);

  const submit = async (event) => {
    event.preventDefault(); setMessage({ type: '', text: '' });
    if (password.length < 6) { setMessage({ type: 'error', text: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.' }); return; }
    if (password !== confirm) { setMessage({ type: 'error', text: 'كلمتا المرور غير متطابقتين.' }); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setBusy(false); setMessage({ type: 'error', text: error.message }); return; }
    await supabase.auth.signOut();
    setMessage({ type: 'success', text: 'تم تحديث كلمة المرور بنجاح.' });
    setTimeout(() => navigate('/login', { replace: true }), 1200);
  };

  return (
    <main className="auth-shell">
      <div className="card auth-card">
        <Logo />
        <h1>إعادة تعيين كلمة المرور</h1>
        <p className="muted" style={{ textAlign: 'center' }}>اختر كلمة مرور جديدة لحسابك.</p>
        {ready && <form className="stack" onSubmit={submit} style={{ marginTop: 18 }}><div className="field"><label className="label">كلمة المرور الجديدة</label><input className="input" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required /></div><div className="field"><label className="label">تأكيد كلمة المرور</label><input className="input" type="password" minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></div><button className="btn btn-primary" disabled={busy}>{busy ? '...' : 'حفظ كلمة المرور'}</button></form>}
        {message.text && <div className={`notice ${message.type}`} style={{ marginTop: 14 }}>{message.text}</div>}
        <Link className="muted" to="/login" style={{ display: 'block', textAlign: 'center', marginTop: 18 }}>العودة إلى تسجيل الدخول</Link>
      </div>
    </main>
  );
}
