const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const connectDB = require('./db/db');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Use cookie-parser middleware
app.use(cookieParser());

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key",  // Secret key for signing session ID cookie
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to `true` for HTTPS in production
}));


app.get('/', (req, res) => {
  if (req.session.user) {
    res.send(`Hello, ${req.session.user.name}`);
  } else {
    res.send('No user logged in');
  }
});

// Example route for setting cookies
app.get('/set-cookie', (req, res) => {
  res.cookie('userToken', 'some-token-value', { maxAge: 3600000, httpOnly: true });
  res.send('Cookie set');
});

// Example route for reading cookies
app.get('/get-cookie', (req, res) => {
  const userToken = req.cookies.userToken;
  res.send(`User token: ${userToken}`);
});

// Routes
app.use('/registration', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
