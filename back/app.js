const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path'); 
const kitsRoutes = require('./routes/Kits');
const BootsRoutes = require('./routes/Boots');
const BallsRoutes = require('./routes/Balls');
const ProductsRoutes = require('./routes/Products');
const JacketsRoutes = require('./routes/Jackets');
const LogosRoutes = require('./routes/Logos');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const multer = require('multer');


app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'abdessamadachehrour@gmail.com',
    pass: 'alstaravbrzggtoc',  
  },
});
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email, 
    to: 'abdessamadachehrour@gmail.com', 
    subject: `Message from ${name}`,
    text: `Message: ${message}\n\nFrom: ${name}\nEmail: ${email}`, 
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.toString() });
    }
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  });
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query('SELECT * FROM test WHERE email = ?', [email], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      db.query(
        'INSERT INTO test (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          
          res.status(201).json({
            message: 'Registration successful',
            user: {
              id: result.insertId,
              name,
              email
            }
          });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM test WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = `fake-token-for-user-${user.id}`;
    
    res.json({ 
      message: 'Login successful',
      token,
      user: { 
        id: user.id,
        name: user.name,
        email: user.email 
      } 
    });
  });
});


app.use('/api/kits', kitsRoutes);
app.use('/api/boots', BootsRoutes);
app.use('/api/balls', BallsRoutes);
app.use('/api/jackets', JacketsRoutes);
app.use('/api/products', ProductsRoutes);
app.use('/api/logos', LogosRoutes);
app.use('/assets', express.static(path.join(__dirname, 'assets')));




app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  db.query('SELECT * FROM test WHERE email = ?', [email], (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error querying the database' });
      }

      if (result.length === 0) {
          return res.status(400).json({ message: 'No user found with this email' });
      }

      const user = result[0];
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); 

      db.query('UPDATE test SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?', 
      [resetToken, resetTokenExpiry, email], (err) => {
          if (err) {
              return res.status(500).json({ error: 'Error updating the reset token' });
          }

          const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: 'abdessamadachehrour@gmail.com', 
                  pass: 'alstaravbrzggtoc'   
              }
          });

          const resetLink = `http://localhost:3001/reset-password?token=${resetToken}`;

          const mailOptions = {
              from: 'abdessamadachehrour@gmail.com',
              to: email,
              subject: 'Password Reset',
              text: `Click on this link to reset your password: ${resetLink}`
          };

          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  return res.status(500).json({ error: 'Error sending email' });
              }
              res.status(200).json({ message: 'A reset link has been sent to your email' });
          });
      });
  });
});

app.post('/reset-password', (req, res) => {
  const { token, password } = req.body;
  console.log(token)

  db.query('SELECT * FROM test WHERE resetToken = ?', [token], (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error querying the database' });
      }

      if (result.length === 0) {
          return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      const user = result[0];
      const tokenExpiry = new Date(user.resetTokenExpiry); 

      if (isNaN(tokenExpiry.getTime())) {
          return res.status(400).json({ message: 'Invalid token expiration date' });
      }

      if (new Date() > tokenExpiry) {
          return res.status(400).json({ message: 'The reset token has expired' });
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
              return res.status(500).json({ error: 'Error hashing the password' });
          }

          db.query('UPDATE test SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE resetToken = ?', 
          [hashedPassword, token], (err) => {
              if (err) {
                  return res.status(500).json({ error: 'Error updating the password' });
              }

              res.status(200).json({ message: 'Password successfully reset' });
          });
      });
  });
});

const authenticateToken = (req, res, next) => {
  console.log('>>> authenticateToken - Headers:', req.headers); 
  const userIdFromHeader = req.headers['x-user-id'];

  if (!userIdFromHeader) {
    if (req.path === '/api/orders' && req.method === 'POST') {
      console.log('>>> authenticateToken: Guest checkout detected for /api/orders POST, no user ID.');
      req.user = null;
      return next();
    }
    console.warn('>>> authenticateToken: User ID non fourni dans x-user-id pour la route:', req.method, req.path);
    return res.status(401).json({ error: 'User ID not provided. Authentication required.' });
  }

  const parsedUserId = parseInt(userIdFromHeader, 10);
  if (isNaN(parsedUserId)) {
     console.warn('>>> authenticateToken: x-user-id invalide (pas un nombre):', userIdFromHeader);
     return res.status(401).json({ error: 'Invalid User ID format.'});
  }

  req.user = { id: parsedUserId }; 
  console.log('>>> authenticateToken: User ID from header:', parsedUserId, 'req.user défini.');
  next();
};


app.get('/api/wishlist', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const query = 'SELECT product_id, product_data FROM user_wishlist WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching wishlist:', err);
      return res.status(500).json({ error: 'Error fetching wishlist' });
    }
    const wishlistItems = results.map(item => ({
        id: item.product_id, 
        ...JSON.parse(item.product_data)
    }));
    res.json(wishlistItems);
  });
});


app.post('/api/wishlist', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { productId, productData } = req.body; 

  if (!productId || !productData) {
    return res.status(400).json({ error: 'Product ID and Product Data are required' });
  }
  

  const productDataJson = JSON.stringify(productData);

  const query = 'INSERT INTO user_wishlist (user_id, product_id, product_data) VALUES (?, ?, ?)';
  db.query(query, [userId, productId, productDataJson], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Item already in wishlist' });
      }
      console.error('Error adding to wishlist:', err);
      return res.status(500).json({ error: 'Error adding to wishlist' });
    }

    res.status(201).json({ id: productId, ...productData });
  });
});


app.delete('/api/wishlist/:productId', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const query = 'DELETE FROM user_wishlist WHERE user_id = ? AND product_id = ?';
  db.query(query, [userId, productId], (err, result) => {
    if (err) {
      console.error('Error removing from wishlist:', err);
      return res.status(500).json({ error: 'Error removing from wishlist' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }
    res.status(200).json({ message: 'Item removed from wishlist', productId });
  });
});

app.post('/api/cart', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const {
    productId,
    productName,
    productPrice, 
    productImagePath = null, 
    quantity,
    size
  } = req.body;

  console.log(`[SERVER] POST /api/cart - User ID: ${userId} - Received body:`, req.body);

  if (!productId || !productName || productPrice === undefined || quantity === undefined) {
    console.error("[SERVER] POST /api/cart - Missing required fields:", { productId, productName, productPrice, quantity });
    return res.status(400).json({ error: 'Missing required product information (productId, productName, productPrice, quantity).' });
  }
  
  const numericPrice = parseFloat(String(productPrice)); 
  if (isNaN(numericPrice)) {
      console.error("[SERVER] POST /api/cart - Invalid numericPrice:", productPrice);
      return res.status(400).json({ error: 'Invalid product price format. Must be a number.' });
  }

  const parsedQuantity = parseInt(quantity, 10);
  if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
    console.error("[SERVER] POST /api/cart - Invalid parsedQuantity:", quantity);
    return res.status(400).json({ error: 'Invalid quantity. Must be a positive integer.' });
  }

  const actualSize = (size && size !== "Sélectionner" && size !== "Taille unique") ? size : null;
  console.log(`[SERVER] POST /api/cart - Processed values:`, { userId, productId, productName, numericPrice, productImagePath, parsedQuantity, actualSize });

  const selectQuery = 'SELECT id, quantity FROM user_cart_items WHERE user_id = ? AND product_id = ? AND (size = ? OR (size IS NULL AND ? IS NULL))';
  console.log(`[SERVER] POST /api/cart - SELECT Query: ${selectQuery} with params: [${userId}, ${productId}, ${actualSize}, ${actualSize}]`);

  db.query(selectQuery, [userId, productId, actualSize, actualSize], (err, results) => {
    if (err) {
      console.error('[SERVER] POST /api/cart - Error checking existing cart item (selectQuery):', err);
      return res.status(500).json({ error: 'Database error while checking cart item' });
    }
    console.log('[SERVER] POST /api/cart - selectQuery results:', results);

    if (results.length > 0) {
      const existingItem = results[0];
      const newQuantity = existingItem.quantity + parsedQuantity;
      const updateQuery = 'UPDATE user_cart_items SET quantity = ? WHERE id = ?';
      console.log(`[SERVER] POST /api/cart - Item exists. UPDATE Query: ${updateQuery} with params: [${newQuantity}, ${existingItem.id}]`);
      db.query(updateQuery, [newQuantity, existingItem.id], (errUpdate) => {
        if (errUpdate) {
          console.error('[SERVER] POST /api/cart - Error updating cart item quantity (updateQuery):', errUpdate);
          return res.status(500).json({ error: 'Error updating cart item' });
        }
        console.log('[SERVER] POST /api/cart - Item quantity updated successfully. Fetching updated item...');
        db.query('SELECT id AS cart_item_table_id, product_id, product_name AS text, product_price AS price, product_image_path AS path, quantity, size FROM user_cart_items WHERE id = ?', [existingItem.id], (errFetch, updatedItemResult) => {
            if (errFetch || updatedItemResult.length === 0) {
                console.error('[SERVER] POST /api/cart - Error fetching updated cart item after update:', errFetch);
                return res.status(500).json({ error: 'Error fetching updated cart item' });
            }
            const updatedItem = { ...updatedItemResult[0], price: updatedItemResult[0].price.toString(), cartItemId: updatedItemResult[0].product_id + (updatedItemResult[0].size ? `-${updatedItemResult[0].size}` : '-tailleunique') };
            console.log('[SERVER] POST /api/cart - Responding with updated item:', updatedItem);
            res.status(200).json(updatedItem);
        });
      });
    } else {
      const insertQuery = 'INSERT INTO user_cart_items (user_id, product_id, product_name, product_price, product_image_path, quantity, size) VALUES (?, ?, ?, ?, ?, ?, ?)';
      console.log(`[SERVER] POST /api/cart - Item does not exist. INSERT Query: ${insertQuery} with params: [${userId}, ${productId}, "${productName}", ${numericPrice}, "${productImagePath}", ${parsedQuantity}, ${actualSize === null ? 'NULL' : `"${actualSize}"`}]`);
      db.query(insertQuery, [userId, productId, productName, numericPrice, productImagePath, parsedQuantity, actualSize], (errInsert, insertResult) => {
        if (errInsert) {
          console.error('[SERVER] POST /api/cart - Error adding item to cart (insertQuery):', errInsert);
          return res.status(500).json({ error: 'Error adding item to cart' });
        }
        console.log('[SERVER] POST /api/cart - Item inserted successfully. insertResult:', insertResult, 'Fetching new item...');
         db.query('SELECT id AS cart_item_table_id, product_id, product_name AS text, product_price AS price, product_image_path AS path, quantity, size FROM user_cart_items WHERE id = ?', [insertResult.insertId], (errFetch, newItemResult) => {
            if (errFetch || newItemResult.length === 0) {
                console.error('[SERVER] POST /api/cart - Error fetching new cart item after insert:', errFetch);
                return res.status(500).json({ error: 'Error fetching new cart item' });
            }
            const newItem = { ...newItemResult[0], price: newItemResult[0].price.toString(), cartItemId: newItemResult[0].product_id + (newItemResult[0].size ? `-${newItemResult[0].size}` : '-tailleunique') };
            console.log('[SERVER] POST /api/cart - Responding with new item:', newItem);
            res.status(201).json(newItem);
        });
      });
    }
  });
});
app.post('/api/cart', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { productId, productName, productPrice, productImagePath, quantity, size } = req.body;

  if (!productId || !productName || productPrice === undefined || !quantity) {
    return res.status(400).json({ error: 'Missing required product information for cart.' });
  }
  
  const numericPrice = parseFloat(String(productPrice).replace(/[^0-9.-]+/g,""));
  if (isNaN(numericPrice)) {
      return res.status(400).json({ error: 'Invalid product price format.' });
  }

  const actualSize = (size && size !== "Sélectionner" && size !== "Taille unique") ? size : null;

  const selectQuery = 'SELECT id, quantity FROM user_cart_items WHERE user_id = ? AND product_id = ? AND (size = ? OR (size IS NULL AND ? IS NULL))';
  db.query(selectQuery, [userId, productId, actualSize, actualSize], (err, results) => {
    if (err) {
      console.error('Error checking existing cart item:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      const existingItem = results[0];
      const newQuantity = existingItem.quantity + quantity;
      const updateQuery = 'UPDATE user_cart_items SET quantity = ? WHERE id = ?';
      db.query(updateQuery, [newQuantity, existingItem.id], (errUpdate) => {
        if (errUpdate) {
          console.error('Error updating cart item quantity:', errUpdate);
          return res.status(500).json({ error: 'Error updating cart item' });
        }
        res.status(200).json({ 
            message: 'Item quantity updated', 
            cart_item_table_id: existingItem.id, 
            product_id: productId, 
            text: productName, price: numericPrice, path: productImagePath, 
            quantity: newQuantity, size: actualSize,
            cartItemId: productId + (actualSize ? `-${actualSize}` : '-tailleunique')
        });
      });
    } else {
      const insertQuery = 'INSERT INTO user_cart_items (user_id, product_id, product_name, product_price, product_image_path, quantity, size) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(insertQuery, [userId, productId, productName, numericPrice, productImagePath, quantity, actualSize], (errInsert, insertResult) => {
        if (errInsert) {
          console.error('Error adding item to cart:', errInsert);
          return res.status(500).json({ error: 'Error adding item to cart' });
        }
        res.status(201).json({ 
            message: 'Item added to cart', 
            cart_item_table_id: insertResult.insertId, 
            product_id: productId, 
            text: productName, price: numericPrice, path: productImagePath, 
            quantity: quantity, size: actualSize,
            cartItemId: productId + (actualSize ? `-${actualSize}` : '-tailleunique')
        });
      });
    }
  });
});

app.put('/api/cart/:cart_item_db_id', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const cartItemTableId = req.params.cart_item_db_id; 
    const { quantity } = req.body;

    if (quantity === undefined || parseInt(quantity, 10) < 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }
    const newQuantity = parseInt(quantity, 10);

    if (newQuantity === 0) {
        const deleteQuery = 'DELETE FROM user_cart_items WHERE id = ? AND user_id = ?';
        db.query(deleteQuery, [cartItemTableId, userId], (err, result) => {
            if (err) {
                console.error('Error deleting item from cart via quantity update:', err);
                return res.status(500).json({ error: 'Error updating cart' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cart item not found or not owned by user' });
            }
            res.status(200).json({ message: 'Item removed from cart due to zero quantity', cartItemTableId });
        });
    } else {
        const updateQuery = 'UPDATE user_cart_items SET quantity = ? WHERE id = ? AND user_id = ?';
        db.query(updateQuery, [newQuantity, cartItemTableId, userId], (err, result) => {
            if (err) {
                console.error('Error updating cart item quantity directly:', err);
                return res.status(500).json({ error: 'Error updating cart item' });
            }
             if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cart item not found or not owned by user' });
            }
            res.status(200).json({ message: 'Item quantity updated', cartItemTableId, newQuantity });
        });
    }
});


app.delete('/api/cart/:cart_item_db_id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const cartItemTableId = req.params.cart_item_db_id;

  const query = 'DELETE FROM user_cart_items WHERE id = ? AND user_id = ?';
  db.query(query, [cartItemTableId, userId], (err, result) => {
    if (err) {
      console.error('Error removing item from cart:', err);
      return res.status(500).json({ error: 'Error removing item from cart' });
    }
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Cart item not found or not owned by user' });
    }
    res.status(200).json({ message: 'Item removed from cart', cartItemTableId });
  });
});

app.delete('/api/cart', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const query = 'DELETE FROM user_cart_items WHERE user_id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error clearing cart:', err);
      return res.status(500).json({ error: 'Error clearing cart' });
    }
    res.status(200).json({ message: 'Cart cleared successfully' });
  });
});

app.get('/api/cart', authenticateToken, (req, res) => {
  const userId = req.user.id;
  console.log(`[SERVER] GET /api/cart - User ID: ${userId}`);
  const query = `
    SELECT 
      id AS cart_item_table_id, -- ID de la ligne dans la table user_cart_items
      product_id, 
      product_name AS text,     -- Alias pour correspondre au frontend
      product_price AS price,   -- Assurez-vous que c'est bien 'price' et non 'product_price' ici si CartContext attend 'price'
      product_image_path AS path, 
      quantity, 
      size 
    FROM user_cart_items 
    WHERE user_id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('[SERVER] GET /api/cart - Error fetching cart items:', err);
      return res.status(500).json({ error: 'Error fetching cart items' });
    }
    const cartItems = results.map(item => ({
        ...item,
        price: item.price.toString(), 
        cartItemId: item.product_id + (item.size ? `-${item.size.replace(/\s+/g, '_')}` : '-tailleunique') // Assurer un id valide pour HTML
    }));
    console.log(`[SERVER] GET /api/cart - Returning ${cartItems.length} items for user ${userId}:`, cartItems);
    res.json(cartItems);
  });
});

const authenticateAdmin = (req, res, next) => {
  console.log('>>> authenticateAdmin - Vérification des droits admin pour user ID:', req.user?.id);

  if (!req.user || !req.user.id) { 
    console.warn('>>> authenticateAdmin - Accès refusé. Aucun utilisateur identifié par authenticateToken.');
    return res.status(401).json({ error: 'Authentification requise pour l_accès admin.' });
  }

  const userId = req.user.id;

  db.query('SELECT email FROM test WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('>>> authenticateAdmin - Erreur DB en récupérant l_email utilisateur:', err);
      return res.status(500).json({ error: 'Erreur serveur lors de la vérification des droits admin.' });
    }

    if (results.length === 0) {
      console.warn(`>>> authenticateAdmin - Utilisateur avec ID ${userId} non trouvé en BDD.`);
      return res.status(403).json({ error: 'Utilisateur non trouvé. Accès refusé.' });
    }

    const userEmailFromDB = results[0].email;
    const isAdmin = userEmailFromDB.toLowerCase() === 'abdessamadachehrour@gmail.com';

    console.log(`>>> authenticateAdmin - Email de l_utilisateur (BDD): "${userEmailFromDB}", isAdmin: ${isAdmin}`);

    if (!isAdmin) {
      console.warn('>>> authenticateAdmin - Accès refusé. L_utilisateur n_est pas l_admin configuré.');
      return res.status(403).json({ error: 'Accès refusé. Privilèges administrateur requis.' });
    }

    req.user.isAdmin = true; 
    console.log('>>> authenticateAdmin - Accès admin autorisé pour:', userEmailFromDB);
    next();
  });
};

app.get('/api/orders', (req, res) => {
  const query = `
    SELECT 
      id,
      user_id,
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_phone,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_postal_code,
      shipping_country,
      order_total,
      order_status,
      payment_method,
      payment_status,
      transaction_id,
      order_date
    FROM orders
    ORDER BY order_date DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ 
        error: 'Failed to fetch orders',
        details: err.message 
      });
    }

    const formattedOrders = results.map(order => ({
      ...order,
      order_total: parseFloat(order.order_total),
      order_date: order.order_date.toISOString() 
    }));

    res.json(formattedOrders);
  });
});


app.get('/api/orders/:id', (req, res) => {
  const orderId = req.params.id;
  
  const query = `
    SELECT 
      id,
      user_id,
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_phone,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_postal_code,
      shipping_country,
      order_total,
      order_status,
      payment_method,
      payment_status,
      transaction_id,
      order_date
    FROM orders
    WHERE id = ?
  `;

  db.query(query, [orderId], (err, results) => {
    if (err) {
      console.error('Error fetching order:', err);
      return res.status(500).json({ 
        error: 'Failed to fetch order',
        details: err.message 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = {
      ...results[0],
      order_total: parseFloat(results[0].order_total),
      order_date: results[0].order_date.toISOString()
    };

    res.json(order);
  });
});


app.put('/api/orders/:id/status', (req, res) => {
  const orderId = req.params.id;
  const { order_status, payment_status } = req.body;

  if (!order_status && !payment_status) {
    return res.status(400).json({ error: 'Either order_status or payment_status is required' });
  }

  let query = 'UPDATE orders SET ';
  let params = [];
  let updates = [];

  if (order_status) {
    updates.push('order_status = ?');
    params.push(order_status);
  }

  if (payment_status) {
    updates.push('payment_status = ?');
    params.push(payment_status);
  }

  query += updates.join(', ') + ' WHERE id = ?';
  params.push(orderId);

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error updating order:', err);
      return res.status(500).json({ 
        error: 'Failed to update order',
        details: err.message 
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ 
      message: 'Order updated successfully',
      orderId: orderId,
      updatedFields: { order_status, payment_status }
    });
  });
});

app.get('/api/orders/stats', (req, res) => {
  const statsQuery = `
    SELECT 
      COUNT(*) as total_orders,
      SUM(order_total) as total_revenue,
      SUM(CASE WHEN order_status = 'Pending' THEN 1 ELSE 0 END) as pending_orders,
      SUM(CASE WHEN order_status = 'Processing' THEN 1 ELSE 0 END) as processing_orders,
      SUM(CASE WHEN order_status = 'Shipped' THEN 1 ELSE 0 END) as shipped_orders,
      SUM(CASE WHEN order_status = 'Delivered' THEN 1 ELSE 0 END) as delivered_orders,
      SUM(CASE WHEN order_status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled_orders
    FROM orders
  `;

  db.query(statsQuery, (err, results) => {
    if (err) {
      console.error('Error fetching order statistics:', err);
      return res.status(500).json({ 
        error: 'Failed to fetch statistics',
        details: err.message 
      });
    }

    const stats = {
      ...results[0],
      total_revenue: parseFloat(results[0].total_revenue) || 0
    };

    res.json(stats);
  });
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  console.log('>>> POST /api/orders - DÉBUT DE LA REQUÊTE <<<');
  console.log('>>> REQ.USER (depuis authenticateToken):', req.user);
  console.log('>>> REQ.BODY COMPLET (données brutes reçues):', JSON.stringify(req.body, null, 2));

  const userId = req.user?.id;
  const { customerDetails, items, orderTotal } = req.body;

  if (!customerDetails || typeof customerDetails !== 'object') {
    console.error('>>> ERREUR VALIDATION: customerDetails manquant ou invalide.');
    return res.status(400).json({ error: 'Customer details are required and must be an object.' });
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    console.error('>>> ERREUR VALIDATION: items manquants, pas un tableau, ou vide.');
    return res.status(400).json({ error: 'Order items are required and must be a non-empty array.' });
  }
  if (orderTotal === undefined || isNaN(parseFloat(orderTotal))) {
    console.error('>>> ERREUR VALIDATION: orderTotal manquant ou invalide.');
    return res.status(400).json({ error: 'Order total is required and must be a valid number.' });
  }

  const requiredCustomerFields = ['firstName', 'lastName', 'email', 'addressLine1', 'city', 'postalCode', 'country'];
  for (const field of requiredCustomerFields) {
    if (!customerDetails[field] || String(customerDetails[field]).trim() === '') {
      console.error(`>>> ERREUR VALIDATION: Champ client requis '${field}' manquant ou vide.`);
      return res.status(400).json({ error: `Customer detail '${field}' is required.` });
    }
  }

  console.log('>>> Données extraites pour traitement:');
  console.log('   UserId:', userId);
  console.log('   CustomerDetails:', customerDetails);
  console.log('   OrderTotal:', orderTotal);
  console.log(`   Nombre d_items: ${items.length}`);

  db.beginTransaction(async (transactionErr) => {
    if (transactionErr) {
      console.error('>>> ERREUR SQL: Échec du démarrage de la transaction:', transactionErr);
      return res.status(500).json({ error: 'Database transaction error.' });
    }
    console.log('>>> SQL: Transaction démarrée.');

    const orderQuery = `
      INSERT INTO orders (
        user_id, customer_first_name, customer_last_name, customer_email, customer_phone,
        shipping_address_line1, shipping_address_line2, shipping_city, shipping_postal_code, shipping_country,
        order_total, order_status, payment_status 
        -- Ne pas inclure transaction_id et payment_method ici s'ils ne sont pas encore connus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const orderValues = [
      userId,
      customerDetails.firstName,
      customerDetails.lastName,
      customerDetails.email,
      customerDetails.phone || null,
      customerDetails.addressLine1,
      customerDetails.addressLine2 || null, 
      customerDetails.city,
      customerDetails.postalCode,
      customerDetails.country,
      parseFloat(orderTotal), 
      'Pending', 
      'Pending' 
    ];

    console.log('>>> SQL: Préparation de l_insertion dans ORDERS avec les valeurs:', orderValues);

    db.query(orderQuery, orderValues, (errOrder, orderResult) => {
      if (errOrder) {
        console.error('>>> ERREUR SQL: Échec de l_insertion dans ORDERS:', errOrder);
        return db.rollback(() => {
          console.log('>>> SQL: Rollback effectué suite à l_erreur d_insertion dans ORDERS.');
          res.status(500).json({ error: 'Failed to create order (step 1).' });
        });
      }

      const orderId = orderResult.insertId;
      console.log(`>>> SQL: Commande insérée dans ORDERS avec ID: ${orderId}`);

      console.log(`>>> SQL: Préparation de l_insertion de ${items.length} item(s) dans ORDER_ITEMS.`);
      const orderItemQueries = items.map(item => {
        if (!item.productId || !item.productName || item.quantity === undefined || item.priceAtPurchase === undefined) {
            console.error('>>> ERREUR VALIDATION ITEM: Données manquantes pour l_item:', item);
            return Promise.reject(new Error(`Invalid data for product: ${item.productName || 'Unknown'}. Missing critical fields.`));
        }
        
        const price = parseFloat(item.priceAtPurchase);
        if (isNaN(price)) {
            console.error(`>>> ERREUR VALIDATION ITEM: Prix invalide pour product_id ${item.productId} dans la commande ${orderId}. Reçu:`, item.priceAtPurchase);
            return Promise.reject(new Error(`Invalid price for product: ${item.productName}.`));
        }
        const actualSize = (item.size && item.size !== "Taille unique" && item.size !== "Sélectionner") ? item.size : null;

        const itemQuery = `
          INSERT INTO order_items (
            order_id, product_id, product_name, quantity, price_at_purchase, size
          ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        const itemValues = [orderId, item.productId, item.productName, parseInt(item.quantity), price, actualSize];
        
        console.log(`   SQL: Insertion dans ORDER_ITEMS pour order_id ${orderId} avec valeurs:`, itemValues);

        return new Promise((resolve, reject) => {
            db.query(itemQuery, itemValues, (errItem, itemResult) => { 
                if (errItem) {
                    console.error(`>>> ERREUR SQL: Échec de l_insertion dans ORDER_ITEMS pour product_id ${item.productId}:`, errItem);
                    reject(errItem);
                } else {
                    console.log(`   SQL: Item (product_id: ${item.productId}) inséré dans ORDER_ITEMS avec ID: ${itemResult.insertId}`);
                    resolve(itemResult);
                }
            });
        });
      });

      Promise.all(orderItemQueries)
        .then(async (itemResults) => { 
          console.log(`>>> SQL: Tous les ${itemResults.length} items ont été (tentés d_être) insérés dans ORDER_ITEMS.`);

          if (userId) {
            console.log(`>>> SQL: Tentative de vidage du panier pour user_id: ${userId}`);
            const clearCartQuery = 'DELETE FROM user_cart_items WHERE user_id = ?';
            db.query(clearCartQuery, [userId], (errClearCart) => {
              if (errClearCart) {
                console.error(`>>> ERREUR SQL: Échec du vidage du panier pour user_id: ${userId}`, errClearCart);
              } else {
                console.log(`>>> SQL: Panier vidé avec succès pour user_id: ${userId}`);
              }
            });
          }

          db.commit((errCommit) => {
            if (errCommit) {
              console.error('>>> ERREUR SQL: Échec du COMMIT de la transaction:', errCommit);
              return db.rollback(() => { 
                console.log('>>> SQL: Rollback tenté suite à une erreur de commit.');
                res.status(500).json({ error: 'Failed to finalize order (commit error).' });
              });
            }
            console.log('>>> SQL: Transaction COMMITTED avec succès.');
            console.log('>>> POST /api/orders - Commande créée avec succès avec order_id:', orderId);
            res.status(201).json({ 
                message: 'Order created successfully', 
                orderId: orderId, 
                customerEmail: customerDetails.email 
            });
          });
        })
        .catch(itemProcessingErr => { 
          console.error('>>> ERREUR PROMISE.ALL: Échec lors de l_insertion des items de la commande:', itemProcessingErr);
          return db.rollback(() => {
            console.log('>>> SQL: Rollback effectué suite à une erreur d_insertion d_item.');
            res.status(500).json({ error: 'Failed to add items to order.' });
          });
        });
    });
  });
});

app.post('/api/products/add', (req, res) => { 
  console.log('>>> REQUÊTE POST /api/products/add REÇUE <<<');
  console.log('>>> REQ.BODY:', req.body);

  const {
    name,      
    price,       
    category,   
    description,
    imagePath,   
    sizes,       
  } = req.body;

  if (!name || !price || !category || !imagePath) {
    return res.status(400).json({ error: 'Name, price, category, and imagePath are required.' });
  }

  const numericPrice = parseFloat(String(price).replace(/[^0-9.]+/g, '')); 
  if (isNaN(numericPrice)) {
    return res.status(400).json({ error: 'Invalid price format.' });
  }

  const availableSizes = sizes ? sizes.split(',').map(s => s.trim()).filter(s => s) : []; 



  const query = `
    INSERT INTO products 
      (name, price, category, description, image_path, available_sizes, stock) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    name,
    numericPrice,
    category,
    description || null,
    imagePath,
    JSON.stringify(availableSizes), 
    stock ? parseInt(stock, 10) : 0
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('>>> ERREUR SQL lors de l_ajout du produit:', err);
      return res.status(500).json({ error: 'Failed to add product to database.', details: err.message });
    }
    console.log('>>> Produit ajouté avec succès, ID:', result.insertId);
    res.status(201).json({ message: 'Product added successfully!', productId: result.insertId, name });
  });
});

app.get('/api/products/all', async (req, res) => { 
  console.log('>>> REQUÊTE GET /api/products/all REÇUE <<<');
  const query = 'SELECT id, name, price, category, image_path, available_sizes, stock FROM products ORDER BY id DESC'; 
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('>>> ERREUR SQL lors de la récupération de tous les produits:', err);
      return res.status(500).json({ error: 'Failed to fetch products.', details: err.message });
    }
    console.log(`>>> ${results.length} produits récupérés avec succès.`);

    const products = results.map(product => {
        try {
            const sizes = (product.available_sizes && typeof product.available_sizes === 'string')
                            ? JSON.parse(product.available_sizes)
                            : product.available_sizes || []; 
            return { ...product, available_sizes: Array.isArray(sizes) ? sizes : [] };
        } catch (e) {
            console.warn(`Avertissement: Impossible de parser available_sizes pour le produit ID ${product.id}:`, product.available_sizes, e);
            return { ...product, available_sizes: [] }; 
        }
    });

    res.status(200).json(products);
  });
});

app.delete('/api/products/:productId', (req, res) => { 
    const { productId } = req.params;
    console.log(`>>> REQUÊTE DELETE /api/products/${productId} REÇUE <<<`);

    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [productId], (err, result) => {
        if (err) {
            console.error(`>>> ERREUR SQL lors de la suppression du produit ID ${productId}:`, err);
            return res.status(500).json({ error: 'Failed to delete product.', details: err.message });
        }
        if (result.affectedRows === 0) {
            console.log(`>>> Produit ID ${productId} non trouvé pour suppression.`);
            return res.status(404).json({ error: 'Product not found.' });
        }
        console.log(`>>> Produit ID ${productId} supprimé avec succès.`);
        res.status(200).json({ message: 'Product deleted successfully', productId });
    });
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'assets', 'products'); 
    const fs = require('fs');
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp' || file.mimetype === 'image/gif') {
    cb(null, true); 
  } else {
    cb(new Error('Type de fichier non supporté. Uniquement JPEG, PNG, WEBP, GIF sont autorisés.'), false); // Rejeter le fichier
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 
  },
  fileFilter: fileFilter 
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));
console.log(`Serving static files from: ${path.join(__dirname, 'assets')}`);

app.post('/api/products/add', upload.single('productImage'), (req, res) => {
  console.log('>>> REQUÊTE POST /api/products/add (avec image) REÇUE <<<');
  console.log('>>> REQ.BODY (champs texte):', req.body);
  console.log('>>> REQ.FILE (info image uploadée):', req.file); 

  const {
    name,
    price,
    category,
    description,
    sizes,
    stock,
  } = req.body; 

  if (!req.file) {
    console.error('>>> ERREUR VALIDATION: Aucune image produit fournie.');
    return res.status(400).json({ error: 'Product image is required.' });
  }
  const imagePathForDb = `/products/${req.file.filename}`; 

  console.log('>>> Chemin image pour la BDD:', imagePathForDb);

  if (!name || !price || !category) { 
    return res.status(400).json({ error: 'Name, price, and category are required.' });
  }

  const numericPrice = parseFloat(String(price).replace(/[^0-9.]+/g, ''));
  if (isNaN(numericPrice)) {
    return res.status(400).json({ error: 'Invalid price format.' });
  }
  
  const availableSizes = sizes ? sizes.split(',').map(s => s.trim()).filter(s => s) : [];

  const query = `
    INSERT INTO products 
      (name, price, category, description, image_path, available_sizes, stock) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    name, numericPrice, category,
    description || null,
    imagePathForDb, 
    JSON.stringify(availableSizes),
    stock ? parseInt(stock, 10) : 0
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('>>> ERREUR SQL lors de l_ajout du produit:', err);
      return res.status(500).json({ error: 'Failed to add product to database.', details: err.message });
    }
    console.log('>>> Produit ajouté avec succès, ID:', result.insertId);
    res.status(201).json({ 
        message: 'Product added successfully!', 
        productId: result.insertId, 
        name,
        imagePath: imagePathForDb 
    });
  });
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error("Erreur Multer:", err);
        return res.status(400).json({ error: `Upload Error: ${err.message}` });
    } else if (err) {
        console.error("Erreur inconnue pendant le traitement de la requête:", err);
        if (err.message && err.message.includes('Type de fichier non supporté')) {
             return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: "An unexpected error occurred." });
    }
    next();
});

app.get('/api/products/:productId', async (req, res) => {
  const { productId } = req.params;
  console.log(`>>> GET /api/products/${productId} REÇUE <<<`);
  
  const query = 'SELECT id, text, price, path, category FROM products WHERE id = ?';
  
  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error(`>>> ERREUR SQL [GET /api/products/${productId}]:`, err);
      return res.status(500).json({ error: 'Failed to fetch product.', details: err.message });
    }
    if (results.length === 0) {
      console.warn(`>>> [GET /api/products/${productId}] Produit non trouvé.`);
      return res.status(404).json({ error: 'Product not found.' });
    }
    
    const product = results[0];
    
    console.log(`>>> [GET /api/products/${productId}] Produit récupéré:`, product);
    res.status(200).json(product); 
  });
});

app.put('/api/products/:productId', authenticateToken, authenticateAdmin, upload.single('productImage'), async (req, res) => {
  const { productId } = req.params;
  console.log(`>>> PUT /api/products/${productId} REÇUE <<<`);
  console.log('>>> REQ.USER (si applicable):', req.user);
  console.log('>>> REQ.BODY (champs texte reçus):', JSON.stringify(req.body, null, 2));
  if (req.file) {
    console.log('>>> REQ.FILE (nouvelle image uploadée reçue):', req.file);
  } else {
    console.log('>>> REQ.FILE: Aucune nouvelle image fournie.');
  }

  const { 
    name, 
    price, 
    category, 
    currentImagePath 
  } = req.body; 

  if (!name || !price || !category) {
    console.error('>>> ERREUR VALIDATION (PUT): Nom (text), Prix, ou Catégorie manquant(e).');
    return res.status(400).json({ error: 'Name (text), price, and category are required.' });
  }
  const numericPrice = parseFloat(String(price).replace(/[^0-9.]+/g, ''));
  if (isNaN(numericPrice)) {
    console.error('>>> ERREUR VALIDATION (PUT): Format de prix invalide.');
    return res.status(400).json({ error: 'Invalid price format.' });
  }
  
  let imagePathToUpdate = currentImagePath; 
  if (req.file && req.file.filename) {
    imagePathToUpdate = `/assets/products/${req.file.filename}`; 
    console.log('>>> Nouvelle image détectée. Nouveau chemin pour BDD:', imagePathToUpdate);
  } else {
    console.log('>>> Aucune nouvelle image fournie. Utilisation de currentImagePath:', currentImagePath);
    if (typeof imagePathToUpdate !== 'string') {
        imagePathToUpdate = null; 
    }
  }

  const query = `
    UPDATE products SET 
      text = ?,      
      price = ?, 
      path = ?,      
      category = ?
    WHERE id = ?
  `;
  const values = [
    name,        
    numericPrice,
    imagePathToUpdate,
    category,
    productId
  ];

  console.log(">>> SQL UPDATE Query:", query);
  console.log(">>> SQL UPDATE Values:", values);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(`>>> ERREUR SQL [PUT /api/products/${productId}]:`, err);
      return res.status(500).json({ error: 'Failed to update product in database.', details: err.message });
    }
    if (result.affectedRows === 0) {
      console.warn(`>>> [PUT /api/products/${productId}] Produit non trouvé pour mise à jour. ID:`, productId);
      return res.status(404).json({ error: 'Product not found to update.' });
    }
    console.log(`>>> [PUT /api/products/${productId}] Produit mis à jour avec succès.`);
    res.status(200).json({ 
        message: 'Product updated successfully!', 
        productId: productId, 
        text: name, 
        imagePath: imagePathToUpdate 
    });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});