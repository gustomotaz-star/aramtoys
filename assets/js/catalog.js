let cachedCategories = [];
let cachedProducts = [];

function localized(item, field) {
  const lang = getLang();
  if (lang === 'ar' && item[field + '_ar']) return item[field + '_ar'];
  return item[field];
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
    <a class="cat-card" href="category.html?slug=${cat.slug}">
      <div class="cat-icon">${cat.icon || '🧸'}</div>
      <h3>${localized(cat, 'name')}</h3>
    </a>
  `).join('');
}

function productCardHtml(p) {
  return `
    <div class="prod-card">
      <div class="prod-thumb">
        ${p.badge ? `<span class="prod-badge">${p.badge}</span>` : ''}
        ${p.image_url ? `<img src="${p.image_url}" alt="${localized(p, 'name')}">` : '🧸'}
      </div>
      <div class="prod-body">
        <span class="prod-cat">${p.categories ? localized(p.categories, 'name') : ''}</span>
        <span class="prod-name">${localized(p, 'name')}</span>
        <div class="prod-row">
          <span class="prod-price">${Number(p.price).toFixed(0)} EGP</span>
          <button class="add-btn" aria-label="Add to cart" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">+</button>
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
