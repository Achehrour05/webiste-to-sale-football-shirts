const express = require('express');
const router = express.Router();
const User = require('./user');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require('dotenv').config();

// Sign Up Route
router.post('/signup', async (req, res) => {
    try {
        console.log('Signup request received:', req.body);

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            console.log('Missing fields!');
            return res.status(400).json({ error: "Please fill in all fields" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ error: "You are already signed up" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        console.log('User registered successfully!');
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error('Signup route error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate the required fields
        if (!email || !password) {
            return res.status(400).json({ error: "Please enter both email and password" });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate a JWT token
        const accessToken = jwt.sign(
            {
                name: user.name,
                email: user.email,
                id: user._id
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30m" }
        );

        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
