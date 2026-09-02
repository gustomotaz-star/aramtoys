import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useI18n } from '../context/I18nContext';

export default function HomeFooter() {
  const { lang, toggleLang } = useI18n();
  const ar = lang === 'ar';
  return (
    <footer className="legacy-footer">
      <div className="container">
        <div className="foot-grid">
          <div className="foot-about">
            <Logo />
            <p>{ar ? 'آرام تويز متجر ألعاب من القاهرة، بيوصل لعب آمن ومحفّز للخيال لأطفال مصر.' : 'Aram Toys is a Cairo-based toy shop bringing safe, imagination-first play to kids across Egypt.'}</p>
          </div>
          <div className="foot-col">
            <h4>{ar ? 'المتجر' : 'Shop'}</h4>
            <Link to="/category/building-blocks">{ar ? 'مكعبات البناء' : 'Building Blocks'}</Link>
            <Link to="/category/dolls-figures">{ar ? 'دمى وشخصيات' : 'Dolls & Figures'}</Link>
            <Link to="/category/outdoor-play">{ar ? 'ألعاب خارجية' : 'Outdoor Play'}</Link>
            <Link to="/category/puzzles-games">{ar ? 'ألغاز وألعاب' : 'Puzzles & Games'}</Link>
          </div>
          <div className="foot-col">
            <h4>{ar ? 'الدعم' : 'Support'}</h4>
            <Link to="/info/shipping">{ar ? 'معلومات الشحن' : 'Shipping Info'}</Link>
            <Link to="/info/returns">{ar ? 'الإرجاع' : 'Returns'}</Link>
            <Link to="/info/contact">{ar ? 'اتصل بنا' : 'Contact Us'}</Link>
            <Link to="/info/faq">{ar ? 'الأسئلة الشائعة' : 'FAQ'}</Link>
          </div>
          <div className="foot-col">
            <h4>{ar ? 'الشركة' : 'Company'}</h4>
            <Link to="/info/about">{ar ? 'من نحن' : 'About'}</Link>
            <Link to="/info/careers">{ar ? 'وظائف' : 'Careers'}</Link>
            <Link to="/info/wholesale">{ar ? 'بيع بالجملة' : 'Wholesale'}</Link>
            <Link to="/admin/content">{ar ? 'الإدارة' : 'Management'}</Link>
          </div>
        </div>
        <div className="foot-bottom">
          <span>{ar ? '© 2026 آرام تويز. جميع الحقوق محفوظة.' : '© 2026 Aram Toys. All rights reserved.'}</span>
          <button className="lang-toggle" onClick={toggleLang}>{ar ? 'English' : 'العربية'}</button>
          <span className="mono">{ar ? 'صُنع بحب 🧡 في القاهرة' : 'Made with 🧡 in Cairo'}</span>
        </div>
      </div>
    </footer>
  );
}
