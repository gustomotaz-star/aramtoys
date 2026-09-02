import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { useI18n } from '../context/I18nContext';
import { getCategoryBySlug, getProductsByCategory } from '../services/catalogService';

export default function CategoryPage() {
  const { slug } = useParams();
  const { lang } = useI18n();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <Header />
      <main className="page">
        <div className="container stack">
          <Link className="muted" to="/">← {lang === 'ar' ? 'العودة للمتجر' : 'Back to shop'}</Link>
          {loading ? <div className="empty">جاري التحميل...</div> : !category ? <div className="empty">التصنيف غير موجود.</div> : (
            <>
              <div className="row wrap">
                <div className="category-card" style={{ minWidth: 86 }}><div className="category-icon">{category.icon || '🧸'}</div></div>
                <div>
                  <h1 className="page-title">{lang === 'ar' ? (category.name_ar || category.name) : category.name}</h1>
                  <div className="muted">{products.length} {lang === 'ar' ? 'منتج' : 'products'}</div>
                </div>
              </div>
              {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty">لا يوجد منتجات في هذا التصنيف حاليًا.</div>}
            </>
          )}
        </div>
      </main>
    </>
  );
}
