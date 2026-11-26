const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3011;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mandvi_fsd_lab11';
const FALLBACK_FILE = path.join(__dirname, 'products_fallback.json');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

let useMongo = false;

function readFallback() {
  if (!fs.existsSync(FALLBACK_FILE)) {
    const seed = [
      { _id: '1', name: 'MongoDB Atlas Guide', price: 499, category: 'Books', description: 'Complete reference for NoSQL schema design.' },
      { _id: '2', name: 'Developer Backpack', price: 1799, category: 'Accessories', description: 'Water-resistant 15.6-inch laptop backpack.' }
    ];
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(seed, null, 2));
  }
  return JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8'));
}

function writeFallback(data) {
  fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2));
}

async function getAllProducts() {
  if (useMongo) return Product.find().sort({ createdAt: -1 }).lean();
  return readFallback();
}

async function getProductById(id) {
  if (useMongo) return Product.findById(id).lean();
  return readFallback().find((p) => p._id === id) || null;
}

async function createProduct(payload) {
  if (useMongo) return Product.create(payload);
  const list = readFallback();
  const item = { _id: String(Date.now()), ...payload };
  list.unshift(item);
  writeFallback(list);
  return item;
}

async function updateProduct(id, payload) {
  if (useMongo) return Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
  const list = readFallback();
  const idx = list.findIndex((p) => p._id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...payload };
  writeFallback(list);
  return list[idx];
}

async function deleteProduct(id) {
  if (useMongo) return Product.findByIdAndDelete(id);
  const list = readFallback().filter((p) => p._id !== id);
  writeFallback(list);
  return true;
}

app.get('/', (req, res) => res.redirect('/products'));

app.get('/products', async (req, res) => {
  const products = await getAllProducts();
  res.render('index', { products, dbMode: useMongo ? 'MongoDB (Mongoose)' : 'Local JSON Fallback (MongoDB offline)' });
});

app.get('/products/new', (req, res) => res.render('new'));

app.post('/products', async (req, res) => {
  await createProduct({
    name: String(req.body.name || '').trim(),
    price: Number(req.body.price) || 0,
    category: String(req.body.category || 'General').trim(),
    description: String(req.body.description || '').trim()
  });
  res.redirect('/products');
});

app.get('/products/:id', async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).send('Product not found');
  res.render('show', { product });
});

app.get('/products/:id/edit', async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).send('Product not found');
  res.render('edit', { product });
});

app.put('/products/:id', async (req, res) => {
  const updated = await updateProduct(req.params.id, {
    name: String(req.body.name || '').trim(),
    price: Number(req.body.price) || 0,
    category: String(req.body.category || 'General').trim(),
    description: String(req.body.description || '').trim()
  });
  if (!updated) return res.status(404).send('Product not found');
  res.redirect(`/products/${req.params.id}`);
});

app.delete('/products/:id', async (req, res) => {
  await deleteProduct(req.params.id);
  res.redirect('/products');
});

// JSON API
app.get('/api/products', async (req, res) => res.json(await getAllProducts()));
app.post('/api/products', async (req, res) => res.status(201).json(await createProduct(req.body)));
app.put('/api/products/:id', async (req, res) => res.json(await updateProduct(req.params.id, req.body)));
app.delete('/api/products/:id', async (req, res) => {
  await deleteProduct(req.params.id);
  res.json({ deleted: true });
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2500 });
    useMongo = true;
    console.log('Connected to MongoDB:', MONGO_URI);
  } catch (err) {
    useMongo = false;
    console.warn('MongoDB not reachable, using local JSON fallback:', err.message);
  }
  app.listen(PORT, () => console.log(`Task 11 server running at http://localhost:${PORT}`));
}

start();
