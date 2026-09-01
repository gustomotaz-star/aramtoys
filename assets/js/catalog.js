let cachedCategories = [];
let cachedProducts = [];

function localized(item, field) {
  const lang = getLang();
  if (lang === 'ar' && item[field + '_ar']) return item[field + '_ar'];
  return item[field];
}

function esc(value) {
  return window.aramEscapeHtml ? window.aramEscapeHtml(value) : String(value ?? '');
}

async function loadCategories() {
  const grid = document.querySelector('.cat-grid');
  if (!grid) return;

  const { data, error } = await supabaseClient
    .from('categories')
    .select('*')
    .order('created_at');

  if (error) { console.error('loadCategories', error); return; }
  cachedCategories = data;
  renderCategories();
}

function renderCategories() {
  const grid = document.querySelector('.cat-grid');
  if (!grid) return;

  grid.innerHTML = cachedCategories.map(cat => `
    <a class="cat-card" href="category.html?slug=${encodeURIComponent(cat.slug || '')}">
      <div class="cat-icon">${esc(cat.icon || '🧸')}</div>
      <h3>${esc(localized(cat, 'name'))}</h3>
    </a>
  `).join('');
}

function productCardHtml(p) {
  const name = localized(p, 'name');
  return `
    <div class="prod-card">
      <div class="prod-thumb">
        ${p.badge ? `<span class="prod-badge">${esc(p.badge)}</span>` : ''}
        ${p.image_url ? `<img src="${esc(p.image_url)}" alt="${esc(name)}">` : '🧸'}
      </div>
      <div class="prod-body">
        <span class="prod-cat">${p.categories ? esc(localized(p.categories, 'name')) : ''}</span>
        <span class="prod-name">${esc(name)}</span>
        <div class="prod-row">
          <span class="prod-price">${Number(p.price).toFixed(0)} EGP</span>
          <button class="add-btn" aria-label="Add to cart" data-id="${esc(p.id)}" data-name="${esc(p.name)}" data-price="${Number(p.price)}">+</button>
        </div>
      </div>
    </div>
  `;
}

async function loadProducts() {
  const grid = document.querySelector('.prod-grid');
  if (!grid) return;

  const { data, error } = await supabaseClient
    .from('products')
    .select('*, categories(name, name_ar)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) { console.error('loadProducts', error); return; }
  cachedProducts = data;
  renderProducts();
}

function renderProducts() {
  const grid = document.querySelector('.prod-grid');
  if (!grid) return;

  grid.innerHTML = cachedProducts.map(productCardHtml).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadProducts();
});

document.addEventListener('langchange', () => {
  renderCategories();
  renderProducts();
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-btn');
  if (!btn) return;
  addToCart({ id: btn.dataset.id, name: btn.dataset.name, price: btn.dataset.price });
  btn.textContent = '✓';
  setTimeout(() => { btn.textContent = '+'; }, 800);
});
