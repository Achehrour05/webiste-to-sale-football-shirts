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

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
// MySQL Connection
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

  // Set up email data
  const mailOptions = {
    from: email, // Sender's email address (user's email)
    to: 'abdessamadachehrour@gmail.com', // Recipient email
    subject: `Message from ${name}`, // Subject
    text: `Message: ${message}\n\nFrom: ${name}\nEmail: ${email}`, // Body of the email
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.toString() });
    }
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  });
});

// Routes
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

    // Pour une vraie implémentation JWT:
    // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Pour votre configuration actuelle:
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

// Static files and routes
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
      const resetTokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour

      // Update reset token and expiry in the database
      db.query('UPDATE test SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?', 
      [resetToken, resetTokenExpiry, email], (err) => {
          if (err) {
              return res.status(500).json({ error: 'Error updating the reset token' });
          }

          // Send reset password email
          const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: 'abdessamadachehrour@gmail.com',  // Utilisez des variables d'environnement
                  pass: 'alstaravbrzggtoc'   // pour la sécurité des identifiants
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

// Reset Password Route
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
      const tokenExpiry = new Date(user.resetTokenExpiry); // Utilisation de la bonne clé

      // Convertir la date d'expiration en objet Date si nécessaire
      if (isNaN(tokenExpiry.getTime())) {
          return res.status(400).json({ message: 'Invalid token expiration date' });
      }

      if (new Date() > tokenExpiry) {
          return res.status(400).json({ message: 'The reset token has expired' });
      }

      // Hash the new password and update in the database
      bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
              return res.status(500).json({ error: 'Error hashing the password' });
          }

          // Update the password and remove the reset token
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

































const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});