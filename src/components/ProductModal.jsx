import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { formatMoney } from '../config/app';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';

const lines = (text) => String(text || '').split('\n').map((l) => l.replace(/^[-•\s]+/, '').trim()).filter(Boolean);

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart();
  const { lang, t } = useI18n();
  const ar = lang === 'ar';
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const name = ar ? (product.name_ar || product.name) : (product.name || product.name_ar);
  const story = ar ? (product.description_ar || product.description) : (product.description || product.description_ar);
  const details = lines(ar ? (product.details_ar || product.details) : (product.details || product.details_ar));
  const world = product.categories ? (ar ? product.categories.name_ar || product.categories.name : product.categories.name) : '';
  const icon = product.categories?.icon || '';
  const outOfStock = Number(product.stock_quantity) <= 0;

  const add = () => { addItem(product); setAdded(true); setTimeout(() => setAdded(false), 1400); };

  return createPortal(
    <div className="pm-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }} dir={ar ? 'rtl' : 'ltr'}>
      <div className="pm-dialog" role="dialog" aria-modal="true" aria-label={name}>
        <button className="pm-close" onClick={onClose} aria-label={ar ? 'إغلاق' : 'Close'}>✕</button>
        <div className="pm-media">
          {product.image_url && !imgError ? <img src={product.image_url} alt={name} onError={() => setImgError(true)} /> : <span>🧸</span>}
        </div>
        <div className="pm-body">
          {world && <div className="pm-world">{icon} {world}</div>}
          <h2 className="pm-title">{name}</h2>
          <div className="pm-price">{formatMoney(product.price)}</div>
          {story && <p className="pm-story">{story}</p>}
          {details.length > 0 && (
            <div className="pm-details">
              <h3>{ar ? 'تفاصيل اللعبة' : 'Toy details'}</h3>
              <ul>{details.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </div>
          )}
          <button className="pm-add" onClick={add} disabled={outOfStock}>
            {outOfStock ? (ar ? 'نفدت الكمية' : 'Out of stock') : added ? (ar ? 'اتضافت للسلة ✓' : 'Added ✓') : `🛒 ${t('add')}`}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
