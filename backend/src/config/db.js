const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      logger.warn('⚠️ MONGODB_URI not set, skipping MongoDB connection');
      return null;
    }

    const options = {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    
    logger.info('✅ MongoDB Connected Successfully');
    
    mongoose.connection.on('connected', () => {
      logger.info('✅ MongoDB connection established');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('🔄 MongoDB connection closed due to app termination');
      process.exit(0);
    });

    return mongoose.connection;

  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error.message);
    
    if (process.env.NODE_ENV === 'production') {
      logger.error('🚨 Production: MongoDB connection failed. Exiting...');
      process.exit(1);
    }
    
    return null;
  }
};

module.exports = connectDB;