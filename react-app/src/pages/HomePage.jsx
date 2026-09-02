import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { useI18n } from '../context/I18nContext';
import { getCategories, getFeaturedProducts } from '../services/catalogService';

export default function HomePage() {
  const { lang, t } = useI18n();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: cats, error: catError }, { data: prods, error: productError }] = await Promise.all([
        getCategories(), getFeaturedProducts(8),
      ]);
      if (catError) console.error(catError);
      if (productError) console.error(productError);
      setCategories(cats || []);
      setProducts(prods || []);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <h1>{t('heroTitle')}</h1>
              <p>{t('heroSub')}</p>
              <div className="hero-actions">
                <a className="btn btn-coral" href="#products">{t('browse')}</a>
                <a className="btn btn-ghost" href="#categories">{t('categories')}</a>
              </div>
            </div>
            <div className="hero-art" aria-hidden="true">🧸🚗🧩</div>
          </div>
        </section>

        <section className="section" id="categories">
          <div className="container">
            <div className="section-head"><h2>{t('categories')}</h2></div>
            <div className="category-grid">
              {categories.map((category) => (
                <Link className="category-card" to={`/category/${category.slug}`} key={category.id}>
                  <div className="category-icon">{category.icon || '🧸'}</div>
                  <strong>{lang === 'ar' ? (category.name_ar || category.name) : category.name}</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="products">
          <div className="container">
            <div className="section-head"><h2>{t('featured')}</h2></div>
            {loading ? <div className="empty">جاري تحميل المنتجات...</div> : (
              <div className="product-grid">
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="site-footer"><div className="container">© 2026 Aram Toys</div></footer>
    </>
  );
}
