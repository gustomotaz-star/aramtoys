import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabase';
import { useI18n } from '../context/I18nContext';

export default function CategoryPage() {
  const { slug } = useParams();
  const { lang } = useI18n();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: cat, error: catError } = await supabase.from('categories').select('*').eq('slug', slug).single();
      if (catError || !cat) { setCategory(null); setLoading(false); return; }
      setCategory(cat);
      const { data: prods, error: prodError } = await supabase
        .from('products')
        .select('id, name, name_ar, price, image_url, badge, stock_quantity, categories(name, name_ar)')
        .eq('category_id', cat.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
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
