import { useState } from 'react';
import { formatMoney } from '../config/app';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';
import ProductModal from './ProductModal';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { lang, t } = useI18n();
  const [imgError, setImgError] = useState(false);
  const [open, setOpen] = useState(false);
  const name = lang === 'ar' ? (product.name_ar || product.name) : product.name;
  const category = product.categories ? (lang === 'ar' ? product.categories.name_ar || product.categories.name : product.categories.name) : '';
  const outOfStock = Number(product.stock_quantity) <= 0;

  return (
    <>
      <article className="product-card">
        <button type="button" className="product-open" onClick={() => setOpen(true)} aria-label={name}>
          <div className="product-thumb">
            {product.image_url && !imgError
              ? <img src={product.image_url} alt={name} loading="lazy" onError={() => setImgError(true)} />
              : <span>🧸</span>}
            {product.badge && <span className="product-badge">{product.badge}</span>}
          </div>
        </button>
        <div className="product-body">
          {category && <div className="product-category">{category}</div>}
          <h3><button type="button" className="product-title-btn" onClick={() => setOpen(true)}>{name}</button></h3>
          <div className="product-footer">
            <strong>{formatMoney(product.price)}</strong>
            <button className="add-product-btn" onClick={() => addItem(product)} disabled={outOfStock} title={outOfStock ? (lang === 'ar' ? 'نفدت الكمية' : 'Out of stock') : undefined} aria-label={`${t('add')} ${name}`}>+</button>
          </div>
        </div>
      </article>
      {open && <ProductModal product={product} onClose={() => setOpen(false)} />}
    </>
  );
}
