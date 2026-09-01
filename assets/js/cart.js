const CART_KEY = 'aram_cart';

(function installCartPageSanitizer() {
  if (window.__aramHtmlSanitizerInstalled) return;
  window.__aramHtmlSanitizerInstalled = true;

  const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  if (!descriptor || !descriptor.get || !descriptor.set) return;

  const blockedTags = new Set([
    'SCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META', 'BASE',
    'FRAME', 'FRAMESET', 'APPLET', 'STYLE', 'SVG', 'MATH'
  ]);
  const urlAttrs = new Set(['href', 'src', 'xlink:href', 'action', 'formaction', 'poster']);

  function unsafeUrl(value, attrName) {
    const valueTrimmed = String(value || '').trim();
    const lower = valueTrimmed.toLowerCase().replace(/\s+/g, '');
    if (lower.startsWith('javascript:') || lower.startsWith('vbscript:')) return true;
    if (lower.startsWith('data:')) {
      return !(attrName === 'src' && /^data:image\/(png|gif|jpeg|jpg|webp|avif);/i.test(valueTrimmed));
    }
    return false;
  }

  function sanitizeHtml(value) {
    const template = document.createElement('template');
    descriptor.set.call(template, String(value ?? ''));

    template.content.querySelectorAll('*').forEach((el) => {
      if (blockedTags.has(el.tagName)) {
        el.remove();
        return;
      }
      [...el.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        const val = attr.value;
        if (name.startsWith('on') || name === 'srcdoc') {
          el.removeAttribute(attr.name);
          return;
        }
        if (urlAttrs.has(name) && unsafeUrl(val, name)) {
          el.removeAttribute(attr.name);
          return;
        }
        if (name === 'style' && /expression\s*\(|url\s*\(\s*['\"]?javascript:/i.test(val)) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return descriptor.get.call(template);
  }

  Object.defineProperty(Element.prototype, 'innerHTML', {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
    get: descriptor.get,
    set(value) {
      descriptor.set.call(this, sanitizeHtml(value));
    }
  });
})();

function getCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(i => i && typeof i.id === 'string' && Number.isFinite(Number(i.price)) && Number.isInteger(Number(i.quantity)) && Number(i.quantity) > 0)
      .map(i => ({
        id: i.id,
        name: String(i.name || ''),
        price: Number(i.price),
        quantity: Math.min(Number(i.quantity), 999)
      }));
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ id: product.id, name: product.name, price: Number(product.price), quantity: 1 });
  saveCart(cart);
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function updateQuantity(id, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  if (quantity <= 0) { removeFromCart(id); return; }
  item.quantity = Math.min(Number(quantity), 999);
  saveCart(cart);
}

function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

function getCartSubtotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function getShippingFee(subtotal) {
  return subtotal >= 800 ? 0 : 50;
}

function clearCart(force = false) {
  const onLoginPage = /(^|\/)login\.html$/i.test(window.location.pathname);
  if (onLoginPage && !force) {
    updateCartBadge();
    return;
  }
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
