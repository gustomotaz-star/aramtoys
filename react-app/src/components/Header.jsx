import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const { count } = useCart();
  const { lang, toggleLang, t } = useI18n();

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Logo />
        <nav className="main-nav" aria-label="Primary navigation">
          <NavLink to="/">{t('shop')}</NavLink>
          <a href="/#categories">{t('categories')}</a>
        </nav>
        <div className="nav-actions">
          <button className="nav-text-btn" onClick={toggleLang}>{lang === 'ar' ? 'English' : 'العربية'}</button>
          {user ? (
            <Link className="icon-link" to="/account" title={profile?.full_name || t('account')}>👤</Link>
          ) : (
            <Link className="icon-link" to="/login" title={t('login')}>👤</Link>
          )}
          {profile?.is_admin && <Link className="nav-text-btn" to="/admin">{t('management')}</Link>}
          <Link className="icon-link cart-link" to="/cart" title={t('cart')}>🧺{count > 0 && <span className="cart-count">{count}</span>}</Link>
          {user && <button className="nav-text-btn hide-mobile" onClick={signOut}>{t('logout')}</button>}
        </div>
      </div>
    </header>
  );
}
