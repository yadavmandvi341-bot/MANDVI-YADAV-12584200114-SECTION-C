let products = [];
let cart = [];
let orders = [];

const PRODUCT_IMAGES = {
  earbuds: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
  watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  laptopStand: 'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcS6Vj7_6O3TSPheDe-4Q5bTku8YpwUOuLX2_q6aHbf0yyvYPH-LCn-xzV2z8J4XklkW459ag3fCHOhB9tE',
  gaming: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
};

function isPlaceholderImage(url) {
  if (!url || typeof url !== 'string') return true;
  const lower = url.toLowerCase();
  return (
    lower.includes('picsum.photos') ||
    lower.includes('source.unsplash.com') ||
    lower.includes('via.placeholder') ||
    lower.includes('loremflickr') ||
    lower.trim() === ''
  );
}

function getProductImage(product) {
  const text = `${product.name || ''} ${product.category || ''}`.toLowerCase();

  // Match real product images by product name/category when backend uses placeholder URLs
  if (isPlaceholderImage(product.image)) {
    if (text.includes('earbud') || text.includes('tws') || text.includes('airpod')) {
      return PRODUCT_IMAGES.earbuds;
    }
    if (text.includes('headphone') || text.includes('headset') || text.includes('audio')) {
      return PRODUCT_IMAGES.headphones;
    }
    if (text.includes('keyboard')) {
      return PRODUCT_IMAGES.keyboard;
    }
    if (text.includes('watch') || text.includes('fitness') || text.includes('wearable') || text.includes('band')) {
      return PRODUCT_IMAGES.watch;
    }
    if (text.includes('stand') || text.includes('laptop')) {
      return PRODUCT_IMAGES.laptopStand;
    }
    if (text.includes('gaming') || text.includes('peripheral') || text.includes('mouse')) {
      return PRODUCT_IMAGES.gaming;
    }
    return PRODUCT_IMAGES.headphones;
  }

  return product.image;
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

async function refreshAll() {
  try {
    const [pRes, cRes, oRes] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/cart'),
      fetch('/api/orders')
    ]);
    if (!pRes.ok || !cRes.ok || !oRes.ok) {
      throw new Error('Failed to load store data');
    }
    products = await pRes.json();
    cart = await cRes.json();
    orders = await oRes.json();
    renderShop();
    renderCart();
    renderOrders();
    renderSeller();
  } catch (err) {
    console.error('Error refreshing data:', err);
  }
}

function renderShop() {
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = '';
  products.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'card';
    const imgUrl = getProductImage(p);
    const outOfStock = Number(p.stock) <= 0;

    card.innerHTML = `
      <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(p.name)}" loading="lazy" />
      <div class="card-body">
        <small class="category">${escapeHtml(p.category)}</small>
        <h3>${escapeHtml(p.name)}</h3>
        <div class="price">₹${Number(p.price)}</div>
        <p class="desc">${escapeHtml(p.description)}</p>
        <button type="button" class="btn-primary" ${outOfStock ? 'disabled' : ''}>
          ${outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    `;

    const img = card.querySelector('img');
    img.addEventListener('error', () => {
      if (img.src !== PRODUCT_IMAGES.headphones) {
        img.src = PRODUCT_IMAGES.headphones;
      }
    });

    if (!outOfStock) {
      card.querySelector('button').addEventListener('click', async () => {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: p.id })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert(err.error || 'Could not add item to cart');
          return;
        }
        refreshAll();
      });
    }

    grid.appendChild(card);
  });
}

function renderCart() {
  document.getElementById('cart-count').textContent = cart.reduce((s, i) => s + i.qty, 0);
  const list = document.getElementById('cart-list');
  list.innerHTML = cart.length ? '' : '<p style="color:#64748b;">Your cart is empty.</p>';
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'row-item';
    row.innerHTML = `
      <div><strong>${escapeHtml(item.name)}</strong> × ${Number(item.qty)}</div>
      <div>₹${item.price * item.qty} <button type="button" class="btn-danger">Remove</button></div>
    `;
    row.querySelector('button').addEventListener('click', async () => {
      await fetch(`/api/cart/${item.productId}`, { method: 'DELETE' });
      refreshAll();
    });
    list.appendChild(row);
  });

  document.getElementById('cart-total').textContent = `Total: ₹${total}`;
}

function renderOrders() {
  document.getElementById('orders-count').textContent = orders.length;
  const list = document.getElementById('orders-list');
  list.innerHTML = orders.length ? '' : '<p style="color:#64748b;">No orders placed yet.</p>';

  orders.forEach((o) => {
    const div = document.createElement('div');
    div.className = 'order-card';
    const itemsText = o.items.map((i) => `${escapeHtml(i.name)} (×${Number(i.qty)})`).join(', ');
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between;">
        <strong>${escapeHtml(o.orderId)} — ${escapeHtml(o.status)}</strong>
        <strong style="color:#059669;">₹${Number(o.total)}</strong>
      </div>
      <p style="font-size:0.9rem; margin:6px 0;">Customer: ${escapeHtml(o.customerName)} | Payment: ${escapeHtml(o.paymentMethod)} (${escapeHtml(o.paymentRef)})</p>
      <small style="color:#64748b;">Items: ${itemsText} • ${escapeHtml(o.placedAt)}</small>
    `;
    list.appendChild(div);
  });
}

function renderSeller() {
  const list = document.getElementById('seller-list');
  list.innerHTML = '';

  products.forEach((p) => {
    const row = document.createElement('div');
    row.className = 'row-item';
    row.innerHTML = `
      <div><strong>${escapeHtml(p.name)}</strong> (₹${Number(p.price)} • Stock: ${Number(p.stock)})</div>
      <button type="button" class="btn-secondary">Edit</button>
    `;
    row.querySelector('button').addEventListener('click', () => {
      document.getElementById('seller-form-title').textContent = `Edit Product #${p.id}`;
      document.getElementById('edit-id').value = p.id;
      document.getElementById('s-name').value = p.name;
      document.getElementById('s-category').value = p.category;
      document.getElementById('s-price').value = p.price;
      document.getElementById('s-stock').value = p.stock;
      document.getElementById('s-image').value = getProductImage(p);
      document.getElementById('s-desc').value = p.description;
      document.getElementById('seller-cancel-btn').style.display = 'inline-block';
    });
    list.appendChild(row);
  });
}

document.getElementById('checkout-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: document.getElementById('cust-name').value.trim(),
      paymentMethod: document.getElementById('pay-method').value,
      cardLast4: document.getElementById('pay-ref').value.trim()
    })
  });
  if (res.ok) {
    alert('Payment successful! Order placed.');
    document.getElementById('pay-ref').value = '';
    document.querySelector('[data-tab="orders"]').click();
    refreshAll();
  } else {
    const err = await res.json().catch(() => ({}));
    alert(err.error || 'Checkout failed');
  }
});

document.getElementById('seller-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const editId = document.getElementById('edit-id').value;
  const name = document.getElementById('s-name').value.trim();
  const category = document.getElementById('s-category').value.trim();
  const customImage = document.getElementById('s-image').value.trim();

  const payload = {
    name,
    category,
    price: Number(document.getElementById('s-price').value),
    stock: Number(document.getElementById('s-stock').value),
    image: customImage || getProductImage({ name, category }),
    description: document.getElementById('s-desc').value.trim()
  };

  const res = await fetch(editId ? `/api/products/${editId}` : '/api/products', {
    method: editId ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    alert(err.error || 'Failed to save product');
    return;
  }

  resetSellerForm();
  refreshAll();
});

document.getElementById('seller-cancel-btn').addEventListener('click', resetSellerForm);

function resetSellerForm() {
  document.getElementById('seller-form').reset();
  document.getElementById('edit-id').value = '';
  document.getElementById('seller-form-title').textContent = 'Add New Product';
  document.getElementById('seller-cancel-btn').style.display = 'none';
}

refreshAll();
