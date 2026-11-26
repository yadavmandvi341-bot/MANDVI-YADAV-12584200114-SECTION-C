const grid = document.getElementById('products-grid');
const form = document.getElementById('product-form');

async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  renderProducts(products);
}

function renderProducts(products) {
  grid.innerHTML = '';
  products.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <small style="color:#64748b;">ID: #${p.id}</small>
      <h3>${escapeHtml(p.name)}</h3>
      <div class="meta">
        <span class="price">₹${p.price}</span>
        <span>⭐ ${p.rating} / 5</span>
      </div>
      <button class="del-btn" data-id="${p.id}">Delete</button>
    `;
    card.querySelector('.del-btn').addEventListener('click', async () => {
      await fetch(`/api/products/${p.id}`, { method: 'DELETE' });
      loadProducts();
    });
    grid.appendChild(card);
  });
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    name: document.getElementById('name').value,
    price: Number(document.getElementById('price').value),
    rating: Number(document.getElementById('rating').value)
  };
  await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  form.reset();
  loadProducts();
});

loadProducts();
