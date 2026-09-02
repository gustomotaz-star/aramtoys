import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { useI18n } from '../context/I18nContext';
import { getCategories, getFeaturedProducts } from '../services/catalogService';

export default function HomePage() {
  const { lang } = useI18n();
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

  const ar = lang === 'ar';

  return (
    <>
      <Header />
      <main>
        <section className="home-hero container">
          <div className="hero-copy-original">
            <div className="eyebrow">{ar ? 'وصل جديد كل جمعة' : 'NEW DROPS EVERY FRIDAY'}</div>
            <h1>
              {ar ? <><span>ألعاب يلعب بيها </span><span className="accent">فعلاً</span><br />أكثر من مرة.</> : <>Toys they actually <span className="accent">play with</span><br />again and again.</>}
            </h1>
            <p className="lead">
              {ar
                ? 'آرام تويز يختار ألعاب متينة تنمي الخيال لأعمار من 0 لـ 12 سنة — مجربة من أطفال حقيقيين، ومعتمدة من الأهل.'
                : 'Aram Toys picks durable, imagination-building toys for ages 0–12 — tested by real kids and approved by parents.'}
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#products">{ar ? 'تسوق المجموعة ←' : 'Shop the collection →'}</a>
              <a className="btn btn-ghost" href="#categories">{ar ? 'تصفح التصنيفات' : 'Browse categories'}</a>
            </div>
            <div className="trust-row">
              <span>🚚 {ar ? 'شحن مجاني فوق 800 جنيه' : 'Free shipping over EGP 800'}</span>
              <span>♻️ {ar ? 'خامات آمنة وغير سامة' : 'Safe, non-toxic materials'}</span>
              <span>⭐ {ar ? '4.9/5 من أكثر من 3,200 من الأهل' : '4.9/5 from 3,200+ parents'}</span>
            </div>
          </div>

          <div className="hero-visual-original" aria-hidden="true">
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="hero-blocks">
              <span className="tile">A</span>
              <span className="tile">R</span>
              <span className="tile">A</span>
              <span className="tile">M</span>
            </div>
            <div className="shelf" />
          </div>
        </section>

        <section className="section" id="categories">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-tag">{ar ? 'اختار حسب النوع' : 'SHOP BY TYPE'}</span>
                <h2>{ar ? 'التصنيفات' : 'Categories'}</h2>
              </div>
            </div>
            <div className="category-grid original-categories">
              {categories.map((category) => (
                <Link className="category-card" to={`/category/${category.slug}`} key={category.id}>
                  <div className="category-icon">{category.icon || '🧸'}</div>
                  <strong>{ar ? (category.name_ar || category.name) : category.name}</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="products">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-tag">{ar ? 'الأكثر طلباً' : 'POPULAR PICKS'}</span>
                <h2>{ar ? 'ألعاب مختارة' : 'Featured toys'}</h2>
              </div>
            </div>
            {loading ? <div className="empty">{ar ? 'جاري تحميل المنتجات...' : 'Loading products...'}</div> : (
              <div className="product-grid">
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </div>
        </section>

        <section className="section" id="why-aram">
          <div className="container"><div className="card card-pad"><h2>{ar ? 'ليه آرام؟' : 'Why Aram?'}</h2><p className="muted">{ar ? 'اختيارات عملية، متينة، ممتعة ومناسبة لعمر الطفل.' : 'Practical, durable and fun toys chosen for each age.'}</p></div></div>
        </section>
        <section className="section" id="newsletter">
          <div className="container"><div className="card card-pad"><h2>{ar ? 'النشرة البريدية' : 'Newsletter'}</h2><p className="muted">{ar ? 'تابع أحدث الألعاب والعروض.' : 'Get new toys and offers in your inbox.'}</p></div></div>
        </section>
      </main>
      <footer className="site-footer"><div className="container">© 2026 Aram Toys</div></footer>
    </>
  );
}
