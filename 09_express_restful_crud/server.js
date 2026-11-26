const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3009;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

let nextId = 4;
let products = [
  { id: 1, name: 'Mechanical Keyboard', price: 2499, description: 'Compact 75% tactile mechanical keyboard with RGB backlight.' },
  { id: 2, name: 'Wireless Mouse', price: 1299, description: 'Ergonomic silent wireless mouse with 2400 DPI sensor.' },
  { id: 3, name: 'USB-C Hub 6-in-1', price: 1899, description: 'Aluminum USB-C hub with HDMI 4K, USB 3.0, and PD charging.' }
];

// Redirect root to /products
app.get('/', (req, res) => res.redirect('/products'));

// INDEX - List all products
app.get('/products', (req, res) => {
  res.render('index', { products });
});

// NEW - Show form to create a new product
app.get('/products/new', (req, res) => {
  res.render('new');
});

// CREATE - Add new product
app.post('/products', (req, res) => {
  const { name, price, description } = req.body;
  products.push({
    id: nextId++,
    name: String(name || '').trim(),
    price: Number(price) || 0,
    description: String(description || '').trim()
  });
  res.redirect('/products');
});

// SHOW - Show details for one product
app.get('/products/:id', (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).send('Product not found');
  res.render('show', { product });
});

// EDIT - Show edit form
app.get('/products/:id/edit', (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).send('Product not found');
  res.render('edit', { product });
});

// UPDATE - Update a product (PUT / PATCH)
app.put('/products/:id', (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).send('Product not found');
  product.name = String(req.body.name || product.name).trim();
  product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
  product.description = String(req.body.description || product.description).trim();
  res.redirect(`/products/${product.id}`);
});

// DELETE - Remove a product
app.delete('/products/:id', (req, res) => {
  products = products.filter((p) => p.id !== Number(req.params.id));
  res.redirect('/products');
});

// JSON REST API endpoints
app.get('/api/products', (req, res) => res.json(products));
app.post('/api/products', (req, res) => {
  const created = {
    id: nextId++,
    name: String(req.body.name || '').trim(),
    price: Number(req.body.price) || 0,
    description: String(req.body.description || '').trim()
  };
  products.push(created);
  res.status(201).json(created);
});
app.put('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  product.name = req.body.name ?? product.name;
  product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
  product.description = req.body.description ?? product.description;
  res.json(product);
});
app.delete('/api/products/:id', (req, res) => {
  products = products.filter((p) => p.id !== Number(req.params.id));
  res.json({ deleted: true });
});

app.listen(PORT, () => {
  console.log(`Task 9 RESTful Product CRUD server running at http://localhost:${PORT}`);
});
