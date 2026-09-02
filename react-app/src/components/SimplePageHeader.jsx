import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useI18n } from '../context/I18nContext';

export default function SimplePageHeader({ backTo='/', backLabel, showAccount=false, showCart=false, onSignOut=null }) {
  const { lang, toggleLang } = useI18n();
  const ar = lang === 'ar';
  return (
    <header className="simple-page-header">
      <Logo compact />
      <div className="simple-page-actions">
        <button className="lang-toggle" onClick={toggleLang}>{ar ? 'English' : 'العربية'}</button>
        {showAccount && <Link className="icon-link" to="/login" aria-label="Account">👤</Link>}
        {showCart && <Link className="icon-link" to="/cart" aria-label="Cart">🧺</Link>}
        {onSignOut && <button className="legacy-signout" onClick={onSignOut}>{ar ? 'تسجيل الخروج' : 'Sign Out'}</button>}
        {backLabel && <Link className="back-link" to={backTo}>{backLabel}</Link>}
      </div>
    </header>
  );
}
