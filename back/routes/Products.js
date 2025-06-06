const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test',
});

router.get('/boots', (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    let query = "SELECT * FROM allproducts WHERE category = 'Chaussures de football'";
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
  router.get('/balls', (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    let query = "SELECT * FROM allproducts WHERE category = 'Balls'";
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
    router.get('/kits', (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    let query = "SELECT * FROM allproducts WHERE category = 'Kits'";
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

  router.get('/carouselimages', (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    let query = "SELECT * FROM carouselimages WHERE category = 'carouselImages'";
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
  router.get('/bottomimages', (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    let query = "SELECT * FROM carouselimages WHERE category = 'bottomImages'";
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
    router.get('/categories', (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    let query = "SELECT * FROM carouselimages WHERE category = 'categories'";
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
      router.get('/jackets', (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    let query = "SELECT * FROM allproducts WHERE category = 'Jacket'";
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
        router.get('/france', (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    let query = "SELECT * FROM allproducts WHERE category = 'france'";
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
          router.get('/germain', (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    let query = "SELECT * FROM allproducts WHERE category = 'germain'";
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
          router.get('/english', (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    let query = "SELECT * FROM allproducts WHERE category = 'england'";
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
          router.get('/spain', (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    let query = "SELECT * FROM allproducts WHERE category = 'spain'";
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
   router.get('/other', (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    let query = "SELECT * FROM allproducts WHERE category = 'other'";
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
    router.get('/italie', (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    let query = "SELECT * FROM allproducts WHERE category = 'italie'";
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
router.get('/all', (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    let query = 'SELECT * FROM allproducts';
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
 // Dans votre fichier de routes (api.js)
router.get('/:id', (req, res) => {
  const productId = req.params.id;
  // Changez "produit_id" pour "id" pour matcher votre frontend
  const sql = "SELECT * FROM allproducts WHERE id = ?"; 
  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result[0]);
  });
});



  
module.exports = router;