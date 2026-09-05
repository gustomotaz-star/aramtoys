import { useState } from 'react';
import { formatMoney } from '../config/app';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { lang, t } = useI18n();
  const [imgError, setImgError] = useState(false);
  const name = lang === 'ar' ? (product.name_ar || product.name) : product.name;
  const category = product.categories ? (lang === 'ar' ? product.categories.name_ar || product.categories.name : product.categories.name) : '';

  return (
    <article className="product-card">
      <div className="product-thumb">
        {product.image_url && !imgError
          ? <img src={product.image_url} alt={name} loading="lazy" onError={() => setImgError(true)} />
          : <span>🧸</span>}
        {product.badge && <span className="product-badge">{product.badge}</span>}
      </div>
      <div className="product-body">
        {category && <div className="product-category">{category}</div>}
        <h3>{name}</h3>
        <div className="product-footer">
          <strong>{formatMoney(product.price)}</strong>
          <button className="add-product-btn" onClick={() => addItem(product)} aria-label={`${t('add')} ${name}`}>+</button>
        </div>
      </div>
    </article>
  );
}
