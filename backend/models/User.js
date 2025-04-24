const mongoose = require('mongoose');

// User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: [true, "Email address is already taken"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
    }
});

// Create and export User model
const User = mongoose.model('User', userSchema);
module.exports = User;
