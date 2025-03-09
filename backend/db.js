const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/User"; // URL de la base de données

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI); // Suppression des options obsolètes
        console.log("✅ MongoDB connected successfully!");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;