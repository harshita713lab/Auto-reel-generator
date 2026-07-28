const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const env = require('./config/env');
const logger = require('./utils/logger');

// Import routes
const healthRoutes = require('./routes/healthRoutes');
const musicRoutes = require('./routes/musicRoutes');
const reelRoutes = require('./routes/reelRoutes');
const renderRoutes = require('./routes/renderRoutes');
const templateRoutes = require('./routes/templateRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Initialize express app
const app = express();

// ==================== Middleware ====================

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: env.CORS_ORIGIN || '*',
  credentials: env.CORS_CREDENTIALS || true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
}));

// Logging middleware
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }));
}

// Body parsing middleware
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/output', express.static(path.join(__dirname, '../output')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// ==================== Routes ====================

// Health check routes
app.use('/api/health', healthRoutes);

// Music routes
app.use('/api/music', musicRoutes);

// Reel routes
app.use('/api/reel', reelRoutes);

// Render routes
app.use('/api/render', renderRoutes);

// Template routes
app.use('/api/templates', templateRoutes);

// Upload routes
app.use('/api/upload', uploadRoutes);

// ==================== Error Handling ====================

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ==================== Database Connection ====================

// Connect to MongoDB
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start server
    const PORT = env.PORT || 5000;
    const HOST = env.HOST || '0.0.0.0';
    
    app.listen(PORT, HOST, () => {
      logger.info(`🚀 Server running on http://${HOST}:${PORT}`);
      logger.info(`📁 Environment: ${env.NODE_ENV}`);
      logger.info(`🗄️  MongoDB: ${env.MONGODB_URI ? 'Connected' : 'Skipped'}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

// ==================== Export ====================

// Start server only if not in test environment
if (env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;