const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI not set, skipping MongoDB connection');
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed (server will continue without DB):', error.message);
    // Don't exit - server can work without MongoDB for testing
  }
};

module.exports = connectDB;
