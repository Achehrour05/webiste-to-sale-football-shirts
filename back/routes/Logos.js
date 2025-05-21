const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test',
});

router.get('/all', (req, res) => {
  const query = "SELECT * FROM logoleagues";
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ DB Error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});
module.exports = router;