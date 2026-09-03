import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';

export default function Header() {
  const { user, profile } = useAuth();
  const { count } = useCart();
  const { lang, toggleLang } = useI18n();
  const ar = lang === 'ar';

  return (
    <header className="site-header">
      <div className="container legacy-nav">
        <Logo />
        <nav className="legacy-nav-links" aria-label="Primary navigation">
          <a href="/#shop">{ar ? 'المتجر' : 'Shop'}</a>
          <a href="/#categories">{ar ? 'التصنيفات' : 'Categories'}</a>
          <a href="/#why">{ar ? 'ليه آرام' : 'Why Aram'}</a>
          <a href="/#newsletter">{ar ? 'النشرة البريدية' : 'Newsletter'}</a>
        </nav>
        <div className="legacy-nav-actions">
          {user && profile?.full_name && <Link className="user-greeting" to="/account">{ar ? `أهلاً ${profile.full_name}` : `Hi ${profile.full_name}`}</Link>}
          <button className="lang-toggle" onClick={toggleLang}>{ar ? 'English' : 'العربية'}</button>
          <button className="icon-link" type="button" aria-label="Search">🔍</button>
          <Link className="icon-link" to={user ? '/account' : '/login'} aria-label="Account">👤</Link>
          <Link className="icon-link cart-link" to="/cart" aria-label="Cart">🧺{count > 0 && <span className="cart-count">{count}</span>}</Link>
        </div>
      </div>
    </header>
  );
}
