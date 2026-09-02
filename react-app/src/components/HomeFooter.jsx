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
            <Logo compact />
            <p>{ar ? 'آرام تويز متجر ألعاب من القاهرة، بيوصل لعب آمن ومحفّز للخيال لأطفال مصر.' : 'Aram Toys is a Cairo-based toy shop bringing safe, imagination-first play to kids across Egypt.'}</p>
          </div>
          <div className="foot-col">
            <h4>{ar ? 'المتجر' : 'Shop'}</h4>
            <a href="#categories">{ar ? 'مكعبات البناء' : 'Building Blocks'}</a>
            <a href="#categories">{ar ? 'دمى وشخصيات' : 'Dolls & Figures'}</a>
            <a href="#categories">{ar ? 'ألعاب خارجية' : 'Outdoor Play'}</a>
            <a href="#categories">{ar ? 'ألغاز وألعاب' : 'Puzzles & Games'}</a>
          </div>
          <div className="foot-col">
            <h4>{ar ? 'الدعم' : 'Support'}</h4>
            <a href="#">{ar ? 'معلومات الشحن' : 'Shipping Info'}</a>
            <a href="#">{ar ? 'الإرجاع' : 'Returns'}</a>
            <a href="#">{ar ? 'اتصل بنا' : 'Contact Us'}</a>
            <a href="#">{ar ? 'الأسئلة الشائعة' : 'FAQ'}</a>
          </div>
          <div className="foot-col">
            <h4>{ar ? 'الشركة' : 'Company'}</h4>
            <a href="#why">{ar ? 'من نحن' : 'About'}</a>
            <a href="#">{ar ? 'وظائف' : 'Careers'}</a>
            <a href="#">{ar ? 'بيع بالجملة' : 'Wholesale'}</a>
            <a href="/admin/login">{ar ? 'الإدارة' : 'Management'}</a>
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
