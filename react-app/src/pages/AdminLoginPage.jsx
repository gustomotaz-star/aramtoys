import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { signInAdmin } from '../services/authService';

export default function AdminLoginPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { if (!loading && user && isAdmin) navigate('/admin', { replace: true }); }, [loading, user, isAdmin, navigate]);

  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setMessage(null);
    const result = await signInAdmin(email, password);
    setBusy(false);
    if (result.error || !result.isAdmin) { setMessage(result.error?.message || 'This account does not have management access.'); return; }
    navigate('/admin', { replace: true });
  };

  return (
    <main className="auth-shell" style={{ background: 'var(--color-ink)' }}>
      <div className="card auth-card">
        <Logo />
        <h1>Management</h1>
        <div className="muted" style={{ textAlign: 'center', marginBottom: 20 }}>Owner access only</div>
        <form className="stack" onSubmit={submit}>
          <div className="field"><label className="label">Email</label><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="field"><label className="label">Password</label><input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          <button className="btn btn-primary" disabled={busy}>{busy ? '...' : 'Sign In'}</button>
        </form>
        {message && <div className="notice error" style={{ marginTop: 14 }}>{message}</div>}
        <Link className="muted" to="/" style={{ display: 'block', textAlign: 'center', marginTop: 18 }}>← Back to shop</Link>
      </div>
    </main>
  );
}
