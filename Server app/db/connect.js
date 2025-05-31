const mongoose = require('mongoose');
require('dotenv').config(); // 👈 ADDED: Load environment variables

const connectDB = () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("❌ MONGO_URI is not defined in .env");
  }

  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
console.log("🔍 Loaded MONGO_URI:", process.env.MONGO_URI);
