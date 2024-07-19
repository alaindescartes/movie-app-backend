require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Configuration options for Mongoose
    const options = {
      useNewUrlParser: true,
    };

    // Database URI (Replace 'your_db' with your actual database name)
    const uri = process.env.DB_URI;

    // Connecting to MongoDB
    await mongoose.connect(uri, options);
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Database connection error:", err.message);
    throw err;
  }
};

module.exports = connectDB;
