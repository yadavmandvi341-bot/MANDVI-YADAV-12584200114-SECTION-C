const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let nextId = 5;
let products = [
  { id: 1, name: 'Noise Cancelling Headphones', price: 3999, rating: 4.7 },
  { id: 2, name: '27-inch IPS Monitor', price: 14999, rating: 4.6 },
  { id: 3, name: 'Laptop Cooling Stand', price: 899, rating: 4.3 },
  { id: 4, name: 'SSD 1TB NVMe', price: 5799, rating: 4.9 }
];

// GET all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const item = products.find((p) => p.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Product not found' });
  res.json(item);
});

// POST create product
app.post('/api/products', (req, res) => {
  const { name, price, rating } = req.body;
  if (!name || price === undefined || rating === undefined) {
    return res.status(400).json({ error: 'name, price, and rating are required' });
  }
  const newProduct = {
    id: nextId++,
    name: String(name).trim(),
    price: Number(price),
    rating: Math.min(5, Math.max(0, Number(rating)))
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const before = products.length;
  products = products.filter((p) => p.id !== Number(req.params.id));
  if (products.length === before) return res.status(404).json({ error: 'Product not found' });
  res.json({ deleted: true });
});

app.listen(PORT, () => {
  console.log(`Task 10 Product API + CSR server running at http://localhost:${PORT}`);
});
