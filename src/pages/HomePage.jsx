import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import HomeFooter from '../components/HomeFooter';
import ProductCard from '../components/ProductCard';
import { useI18n } from '../context/I18nContext';
import { getCategories, getFeaturedProducts } from '../services/catalogService';

export default function HomePage() {
  const { lang } = useI18n();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const ar = lang === 'ar';

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
        <section className="legacy-hero container">
          <div className="legacy-hero-copy">
            <span className="eyebrow">{ar ? 'وصل جديد كل جمعة' : 'New arrivals every friday'}</span>
            <h1>{ar ? <>عالم من <span className="accent">الألعاب</span><br />يبدأ هنا.</> : <>A world of <span className="accent">toys</span><br />starts here.</>}</h1>
            <p className="lead">{ar ? 'آرام تويز يختار ألعاب مميزة تنمي الخيال لأعمار من 0 لـ 12 سنة — مجربة من أطفال حقيقيين، ومعتمدة من الأهل.' : 'Aram Toys hand-picks durable, imagination-first toys for ages 0–12 — tested by real kids, approved by tired parents.'}</p>
            <div className="hero-cta">
              <a href="#shop" className="btn legacy-primary">{ar ? 'تسوق المجموعة ←' : 'Shop the collection →'}</a>
              <a href="#categories" className="btn legacy-ghost">{ar ? 'تصفح التصنيفات' : 'Browse categories'}</a>
            </div>
            <div className="trust-row">
              <span>🚚 {ar ? 'شحن مجاني فوق 800 جنيه' : 'Free shipping over 800 EGP'}</span>
              <span>♻️ {ar ? 'خامات آمنة وغير سامة' : 'Safe, non-toxic materials'}</span>
              <span>⭐ {ar ? '4.9/5 من أكثر من 3,200 من الأهل' : '4.9/5 from 3,200+ parents'}</span>
            </div>
          </div>
          <div className="legacy-hero-visual" aria-hidden="true">
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="hero-blocks-wrap">
              <div className="hero-blocks">
                <span className="tile">A</span><span className="tile">R</span><span className="tile">A</span><span className="tile">M</span>
              </div>
              <div className="hero-blocks hero-blocks-sub">
                <span className="tile">T</span><span className="tile">O</span><span className="tile">Y</span><span className="tile">S</span>
              </div>
            </div>
            <div className="shelf" />
          </div>
        </section>

        <section className="legacy-section container" id="categories">
          <div className="legacy-section-head">
            <div><span className="section-tag">{ar ? 'اعثر على لعبته المفضلة' : 'Find their favorite'}</span><h2>{ar ? 'تسوق حسب التصنيف' : 'Shop by category'}</h2></div>
            <p className="section-sub">{ar ? 'من ألعاب الرضع الآمنة إلى الألغاز الطويلة — مرتبة بالطريقة التي يبحث بها الأهل فعلاً.' : 'From nursery-safe rattles to weekend-long puzzles — sorted the way parents actually search.'}</p>
          </div>
          <div className="legacy-cat-grid">
            {categories.map((category) => (
              <Link className="legacy-cat-card" to={`/category/${category.slug}`} key={category.id}>
                <div className="legacy-cat-icon">{category.icon || '🧸'}</div>
                <h3>{ar ? (category.name_ar || category.name) : category.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="legacy-section container" id="shop">
          <div className="legacy-section-head">
            <div><span className="section-tag">{ar ? 'الأكثر مبيعاً' : 'Best sellers'}</span><h2>{ar ? 'محبوبة من الأيدي الصغيرة' : 'Loved by little hands'}</h2></div>
            <p className="section-sub">{ar ? 'الألعاب الأكثر إعادةً للطلب في المتجر هذا الشهر.' : 'The most re-ordered toys in the shop, this month.'}</p>
          </div>
          {loading ? <div className="empty">{ar ? 'جاري تحميل المنتجات...' : 'Loading products...'}</div> : <div className="legacy-prod-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
        </section>

        <section className="legacy-section container" id="why">
          <div className="why-grid">
            {[
              ['01', ar ? 'مجرّبة من الأهل' : 'Parent-tested', ar ? 'كل لعبة تروح لأسرة حقيقية قبل ما تنزل على الرف.' : 'Every toy goes home with a real family before it goes on the shelf.'],
              ['02', ar ? 'السلامة أولاً' : 'Safety-first materials', ar ? 'ألوان غير سامة، حواف مستديرة، وتصنيف عمري واضح.' : 'Non-toxic paints, rounded edges, and age labels you can trust.'],
              ['03', ar ? 'توصيل سريع بالقاهرة' : 'Fast Cairo delivery', ar ? 'تجهيز الطلبات في نفس اليوم للطلبات المبكرة.' : 'Same-day dispatch on orders placed before 3pm.'],
              ['04', ar ? 'إرجاع سهل خلال 14 يوم' : 'Easy 14-day returns', ar ? 'لو اللعبة ما ناسبتش، رجعها بسهولة.' : "Didn't land? Send it back — no questions, no hassle."],
            ].map(([num,title,desc]) => <div className="why-item" key={num}><div className="num">{num}</div><h3>{title}</h3><p>{desc}</p></div>)}
          </div>
        </section>

        <section className="legacy-newsletter container" id="newsletter">
          <h2>{ar ? 'كن أول من يعرف عن الجديد' : 'Get first pick of new arrivals'}</h2>
          <p>{ar ? 'إيميل واحد في الأسبوع. ألعاب جديدة، تجديد مخزون، ونصائح للأهل أحياناً.' : 'One email a week. New toys, restocks, and the odd parenting tip.'}</p>
          <form className="news-form" onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}>
            <input type="email" placeholder={ar ? 'بريدك الإلكتروني' : 'you@example.com'} required aria-label="Email address" />
            <button type="submit" className="btn legacy-primary">{subscribed ? (ar ? 'تم الاشتراك ✓' : 'Subscribed ✓') : (ar ? 'اشترك' : 'Subscribe')}</button>
          </form>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
