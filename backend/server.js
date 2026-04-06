const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

// 🔍 Health Check
app.get('/health', (req, res) => {
  res.send('Backend is running ✅');
});

// 📦 Create Tables (auto setup)
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT,
      price INT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      product_id INT,
      quantity INT
    );
  `);
}
initDB();

// 🛒 Get Products
app.get('/products', async (req, res) => {
  const result = await pool.query('SELECT * FROM products');
  res.json(result.rows);
});

// ➕ Add Product
app.post('/products', async (req, res) => {
  const { name, price } = req.body;
  const result = await pool.query(
    'INSERT INTO products(name, price) VALUES($1, $2) RETURNING *',
    [name, price]
  );
  res.json(result.rows[0]);
});

// 📦 Create Order
app.post('/orders', async (req, res) => {
  const { product_id, quantity } = req.body;
  const result = await pool.query(
    'INSERT INTO orders(product_id, quantity) VALUES($1, $2) RETURNING *',
    [product_id, quantity]
  );
  res.json(result.rows[0]);
});

// 📋 Get Orders
app.get('/orders', async (req, res) => {
  const result = await pool.query('SELECT * FROM orders');
  res.json(result.rows);
});

// ▶ Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
