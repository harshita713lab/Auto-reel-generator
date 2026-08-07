const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  HOST: process.env.HOST || '0.0.0.0',
  API_URL: process.env.API_URL || 'http://localhost:5000',

  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/reel-generator',

  // FFmpeg
  FFMPEG_PATH: process.env.FFMPEG_PATH || null,
  FFPROBE_PATH: process.env.FFPROBE_PATH || null,
  FFMPEG_USE_GPU: process.env.FFMPEG_USE_GPU === 'true',

  // Remotion
  REMOTION_CONCURRENCY: parseInt(process.env.REMOTION_CONCURRENCY, 10) || 1,

  // Upload
  UPLOAD_LIMIT: parseInt(process.env.UPLOAD_LIMIT, 10) || 100,
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads'),

  // Video
  VIDEO_MAX_DURATION: parseInt(process.env.VIDEO_MAX_DURATION, 10) || 60,
  VIDEO_DEFAULT_WIDTH: parseInt(process.env.VIDEO_DEFAULT_WIDTH, 10) || 1080,
  VIDEO_DEFAULT_HEIGHT: parseInt(process.env.VIDEO_DEFAULT_HEIGHT, 10) || 1920,
  VIDEO_FPS: parseInt(process.env.VIDEO_FPS, 10) || 30,

  // Rate Limiting
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15 * 60,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,

  // Queue
  QUEUE_CONCURRENCY: parseInt(process.env.QUEUE_CONCURRENCY, 10) || 3,
  QUEUE_RETRY_ATTEMPTS: parseInt(process.env.QUEUE_RETRY_ATTEMPTS, 10) || 3,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
};

// Validate required env vars in production
if (env.NODE_ENV === 'production') {
  const required = ['MONGODB_URI'];
  const missing = required.filter(key => !env[key]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}

module.exports = env;