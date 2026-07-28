const logger = require('../utils/logger');
const env = require('../config/env');

/**
 * Health check
 */
exports.check = async (req, res) => {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'reel-generator-api',
      environment: env.NODE_ENV,
    };

    res.status(200).json(health);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message,
    });
  }
};

/**
 * Health details
 */
exports.details = async (req, res) => {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'reel-generator-api',
      version: '1.0.0',
      environment: env.NODE_ENV,
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
    };

    res.status(200).json(health);
  } catch (error) {
    logger.error('Health details failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health details failed',
      error: error.message,
    });
  }
};

/**
 * Ping
 */
exports.ping = (req, res) => {
  res.status(200).json({ 
    status: 'pong',
    timestamp: new Date().toISOString()
  });
};