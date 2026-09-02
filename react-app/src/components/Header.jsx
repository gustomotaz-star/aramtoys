import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';

export default function Header() {
  const { user } = useAuth();
  const { count } = useCart();
  const { lang, toggleLang } = useI18n();

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Logo />

        <nav className="main-nav" aria-label="Primary navigation">
          <a href="/#products">{lang === 'ar' ? 'المتجر' : 'Shop'}</a>
          <a href="/#categories">{lang === 'ar' ? 'التصنيفات' : 'Categories'}</a>
          <a href="/#why-aram">{lang === 'ar' ? 'ليه آرام' : 'Why Aram'}</a>
          <a href="/#newsletter">{lang === 'ar' ? 'النشرة البريدية' : 'Newsletter'}</a>
        </nav>

        <div className="nav-actions">
          <button className="lang-pill" onClick={toggleLang}>{lang === 'ar' ? 'English' : 'العربية'}</button>
          <button className="icon-link" type="button" aria-label={lang === 'ar' ? 'بحث' : 'Search'}>🔍</button>
          <Link className="icon-link" to={user ? '/account' : '/login'} aria-label={lang === 'ar' ? 'الحساب' : 'Account'}>👤</Link>
          <Link className="icon-link cart-link" to="/cart" aria-label={lang === 'ar' ? 'السلة' : 'Cart'}>
            🧺
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
