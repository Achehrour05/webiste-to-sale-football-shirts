const mongoose = require("mongoose");

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
const User = mongoose.model("User", userSchema); // Utilisez "User" comme nom de modèle
module.exports = User;