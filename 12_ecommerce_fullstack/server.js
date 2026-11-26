const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3012;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let nextProductId = 5;
let products = [
  { id: 1, name: 'Pro Wireless Earbuds', price: 2499, stock: 25, category: 'Audio', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', description: 'Active noise cancellation with 30-hour battery life.' },
  { id: 2, name: 'Mechanical Gaming Keyboard', price: 3299, stock: 15, category: 'Peripherals', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', description: 'Hot-swappable tactile switches and aluminum frame.' },
  { id: 3, name: 'Smart Fitness Watch', price: 4999, stock: 18, category: 'Wearables', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', description: 'AMOLED display, SpO2 monitor, and 10-day battery.' },
  { id: 4, name: 'Ergonomic Laptop Stand', price: 1199, stock: 40, category: 'Accessories', image: 'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcS6Vj7_6O3TSPheDe-4Q5bTku8YpwUOuLX2_q6aHbf0yyvYPH-LCn-xzV2z8J4XklkW459ag3fCHOhB9tE', description: 'Foldable aluminum stand with 6 height angles.' }
];

let cart = [];
let orders = [];

// Products API
app.get('/api/products', (req, res) => res.json(products));

app.post('/api/products', (req, res) => {
  const { name, price, stock, category, image, description } = req.body;
  if (!name || price === undefined) return res.status(400).json({ error: 'Name and price are required' });
  const created = {
    id: nextProductId++,
    name: String(name).trim(),
    price: Number(price),
    stock: Number(stock) || 10,
    category: String(category || 'General').trim(),
    image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    description: String(description || '').trim()
  };
  products.push(created);
  res.status(201).json(created);
});

app.put('/api/products/:id', (req, res) => {
  const prod = products.find((p) => p.id === Number(req.params.id));
  if (!prod) return res.status(404).json({ error: 'Product not found' });
  prod.name = req.body.name !== undefined ? String(req.body.name).trim() : prod.name;
  prod.price = req.body.price !== undefined ? Number(req.body.price) : prod.price;
  prod.stock = req.body.stock !== undefined ? Number(req.body.stock) : prod.stock;
  prod.category = req.body.category !== undefined ? String(req.body.category).trim() : prod.category;
  prod.description = req.body.description !== undefined ? String(req.body.description).trim() : prod.description;
  res.json(prod);
});

// Cart API
app.get('/api/cart', (req, res) => res.json(cart));

app.post('/api/cart', (req, res) => {
  const product = products.find((p) => p.id === Number(req.body.productId));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const existing = cart.find((c) => c.productId === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ productId: product.id, name: product.name, price: product.price, qty: 1 });
  }
  res.json(cart);
});

app.delete('/api/cart/:productId', (req, res) => {
  cart = cart.filter((c) => c.productId !== Number(req.params.productId));
  res.json(cart);
});

// Checkout & Payment System API
app.post('/api/checkout', (req, res) => {
  if (!cart.length) return res.status(400).json({ error: 'Cart is empty' });
  const { customerName, paymentMethod, cardLast4 } = req.body;
  if (!customerName || !paymentMethod) {
    return res.status(400).json({ error: 'Customer name and payment method are required' });
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const order = {
    orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    customerName: String(customerName).trim(),
    paymentMethod,
    paymentRef: cardLast4 ? `**** ${cardLast4}` : 'UPI / Instant Pay',
    items: [...cart],
    total,
    status: 'Paid & Confirmed',
    placedAt: new Date().toLocaleString()
  };
  orders.unshift(order);
  cart = [];
  res.status(201).json(order);
});

// Orders API
app.get('/api/orders', (req, res) => res.json(orders));

app.listen(PORT, () => {
  console.log(`Task 12 E-Commerce server running at http://localhost:${PORT}`);
});
