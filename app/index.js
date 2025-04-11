const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Secrets
const dbUser = fs.readFileSync('/run/secrets/db_user', 'utf8').trim();
const dbPassword = fs.readFileSync('/run/secrets/db_password', 'utf8').trim();

const pool = new Pool({
  user: dbUser,
  host: 'db',
  database: 'webapp',
  password: dbPassword,
  port: 5432,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    )
  `);
};

initDB();

// Routes
app.post('/add-user', async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query("INSERT INTO users (name) VALUES ($1)", [name]);
    res.send("✅ User added successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving user.");
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load users.");
  }
});

// Start
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
