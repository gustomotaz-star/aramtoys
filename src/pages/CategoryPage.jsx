import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Logo from '../components/Logo';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';
import { getCategoryBySlug, getProductsByCategory } from '../services/catalogService';

export default function CategoryPage() {
  const { slug } = useParams();
  const { lang, toggleLang } = useI18n();
  const { count } = useCart();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const ar = lang === 'ar';

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: cat, error: catError } = await getCategoryBySlug(slug);
      if (catError || !cat) { setCategory(null); setLoading(false); return; }
      setCategory(cat);
      const { data: prods, error: prodError } = await getProductsByCategory(cat.id);
      if (prodError) console.error(prodError);
      setProducts(prods || []);
      setLoading(false);
    })();
  }, [slug]);

  return (
    <>
      <header className="category-page-header"><div className="container"><Logo /><div className="legacy-nav-actions"><button className="lang-toggle" onClick={toggleLang}>{ar ? 'English' : 'العربية'}</button><Link className="icon-link" to="/login">👤</Link><Link className="icon-link" to="/cart">🧺{count > 0 && <span className="cart-count">{count}</span>}</Link></div></div></header>
      <main>
        <section className="cat-hero container">
          <Link className="cat-back" to="/#categories">← {ar ? 'كل العوالم' : 'All worlds'}</Link>
          {loading ? <div className="empty">{ar ? 'جاري التحميل...' : 'Loading...'}</div> : !category ? <div className="empty">{ar ? 'هذا العالم غير موجود.' : 'World not found.'}</div> : (
            <div className="cat-hero-row"><div className="cat-hero-icon">{category.icon || '🧸'}</div><div><h1>{ar ? (category.name_ar || category.name) : category.name}</h1><span className="cat-count">{products.length} {ar ? 'منتج' : (products.length === 1 ? 'toy' : 'toys')}</span></div></div>
          )}
        </section>
        <section className="category-products container">{!loading && category && (products.length ? <div className="cat-prod-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p className="empty">{ar ? 'لسه ما فيه ألعاب في هذا العالم — قريباً! 🎈' : 'No toys in this world yet — coming soon! 🎈'}</p>)}</section>
      </main>
      <footer className="simple-footer"><div className="container simple-footer-inner"><span>{ar ? '© 2026 عالم آرام للألعاب. جميع الحقوق محفوظة.' : '© 2026 Aram Toy World. All rights reserved.'}</span><button className="lang-toggle" onClick={toggleLang}>{ar ? 'English' : 'العربية'}</button></div></footer>
    </>
  );
}
