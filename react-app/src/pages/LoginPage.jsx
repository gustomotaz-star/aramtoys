import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { sendPasswordRecovery, signIn, signUp } from '../services/authService';

export default function LoginPage() {
  const { user } = useAuth();
  const { lang, toggleLang, t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [method, setMethod] = useState('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  useEffect(() => { if (user) navigate(location.state?.from || '/account', { replace: true }); }, [user, navigate, location.state]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true); setMessage(null);
    try {
      if (mode === 'login') {
        const { error } = await signIn(identifier, password);
        if (error) throw error;
        navigate(location.state?.from || '/account', { replace: true });
      } else {
        if (password !== confirm) throw new Error(lang === 'ar' ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
        const { data, error } = await signUp({ identifier, password, method });
        if (error) throw error;
        setMessage({ type: 'success', text: lang === 'ar' ? 'تم إنشاء الحساب.' : 'Account created.' });
        if (data.session) navigate('/account', { replace: true });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally { setBusy(false); }
  };

  const sendRecovery = async (event) => {
    event.preventDefault();
    setBusy(true); setMessage(null);
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await sendPasswordRecovery(recoveryEmail, redirectTo);
    setBusy(false);
    setMessage(error
      ? { type: 'error', text: error.message }
      : { type: 'success', text: lang === 'ar' ? 'تم إرسال رابط الاستعادة إذا كان البريد مسجلًا.' : 'Recovery link sent if the email is registered.' });
  };

  return (
    <main className="auth-shell">
      <div className="card auth-card">
        <Logo />
        <div className="row between"><span></span><button className="nav-text-btn" onClick={toggleLang}>{lang === 'ar' ? 'English' : 'العربية'}</button></div>
        <h1>{showRecovery ? (lang === 'ar' ? 'استعادة كلمة المرور' : 'Reset password') : (mode === 'login' ? t('signIn') : t('createAccount'))}</h1>

        {showRecovery ? (
          <form className="stack" onSubmit={sendRecovery}>
            <div className="field"><label className="label">{t('email')}</label><input className="input" type="email" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} required /></div>
            <button className="btn btn-primary" disabled={busy}>{lang === 'ar' ? 'إرسال رابط الاستعادة' : 'Send recovery link'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => { setShowRecovery(false); setMessage(null); }}>{lang === 'ar' ? 'العودة للدخول' : 'Back to sign in'}</button>
          </form>
        ) : (
          <>
            <div className="auth-tabs"><button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>{t('signIn')}</button><button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>{t('createAccount')}</button></div>
            {mode === 'signup' && <div className="auth-tabs"><button type="button" className={method === 'email' ? 'active' : ''} onClick={() => setMethod('email')}>{t('email')}</button><button type="button" className={method === 'phone' ? 'active' : ''} onClick={() => setMethod('phone')}>{t('phone')}</button></div>}
            <form className="stack" onSubmit={submit}>
              <div className="field"><label className="label">{mode === 'login' ? t('emailOrPhone') : (method === 'email' ? t('email') : t('phone'))}</label><input className="input" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required /></div>
              <div className="field"><label className="label">{t('password')}</label><input className="input" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
              {mode === 'signup' && <div className="field"><label className="label">{lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm password'}</label><input className="input" type="password" minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></div>}
              <button className="btn btn-primary" disabled={busy}>{busy ? '...' : (mode === 'login' ? t('signIn') : t('createAccount'))}</button>
              {mode === 'login' && <button type="button" className="btn btn-ghost" onClick={() => { setShowRecovery(true); setMessage(null); }}>{lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}</button>}
            </form>
          </>
        )}
        {message && <div className={`notice ${message.type}`} style={{ marginTop: 14 }}>{message.text}</div>}
        <Link className="muted" style={{ display: 'block', textAlign: 'center', marginTop: 18 }} to="/">← {lang === 'ar' ? 'العودة للمتجر' : 'Back to shop'}</Link>
      </div>
    </main>
  );
}
