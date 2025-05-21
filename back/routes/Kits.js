const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test',
});

// 🔁 Helper function to avoid repeating code
function getKitsByCategory(category, req, res) {
  const limit = parseInt(req.query.limit) || null;
  let query = 'SELECT * FROM kits WHERE category = ?';
  const params = [category];

  if (limit) {
    query += ' LIMIT ?';
    params.push(limit);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ DB Error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
}

// Category routes with optional limit
router.get('/england', (req, res) => getKitsByCategory('england', req, res));
router.get('/france', (req, res) => getKitsByCategory('france', req, res));
router.get('/germain', (req, res) => getKitsByCategory('germain', req, res));
router.get('/italie', (req, res) => getKitsByCategory('italie', req, res));
router.get('/spain', (req, res) => getKitsByCategory('spain', req, res));
router.get('/other', (req, res) => getKitsByCategory('other', req, res));

// Route to get all kits with optional limit
router.get('/all', (req, res) => {
  const limit = parseInt(req.query.limit) || null;
  let query = 'SELECT * FROM kits';
  const params = [];

  if (limit) {
    query += ' LIMIT ?';
    params.push(limit);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ DB Error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;
