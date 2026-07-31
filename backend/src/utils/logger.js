// src/utils/logger.js
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists (use backend directory)
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL] || LOG_LEVELS.info;

const formatTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace('T', ' ').slice(0, 19);
};


const formatMessage = (level, message, meta = {}) => {
  let msg = `${formatTimestamp()} [${level.toUpperCase()}] ${message}`;

  if (meta instanceof Error) {
    msg += `\nMessage: ${meta.message}`;
    msg += `\nStack:\n${meta.stack}`;
  } else if (Object.keys(meta).length > 0) {
    msg += `\n${JSON.stringify(meta, null, 2)}`;
  }

  return msg;
};
const writeToFile = (level, message) => {
  const logFile = level === 'error' ? 'error.log' : 'combined.log';
  const logPath = path.join(logsDir, logFile);
  try {
    fs.appendFileSync(logPath, message + '\n');
  } catch (e) {
    // Silently fail if can't write to log file
  }
};

const logger = {
 error: (message, meta = {}) => {
  if (currentLevel >= LOG_LEVELS.error) {
    const msg = formatMessage("error", message, meta);

    console.error(msg);

    if (meta instanceof Error) {
      console.error(meta.stack);
    }

    writeToFile("error", msg);
  }
},

  warn: (message, meta = {}) => {
    if (currentLevel >= LOG_LEVELS.warn) {
      const msg = formatMessage('warn', message, meta);
      console.warn('\x1b[33m%s\x1b[0m', msg);
      writeToFile('warn', msg);
    }
  },

  info: (message, meta = {}) => {
    if (currentLevel >= LOG_LEVELS.info) {
      const msg = formatMessage('info', message, meta);
      console.log('\x1b[36m%s\x1b[0m', msg);
      writeToFile('info', msg);
    }
  },

  debug: (message, meta = {}) => {
    if (currentLevel >= LOG_LEVELS.debug) {
      const msg = formatMessage('debug', message, meta);
      console.log('\x1b[90m%s\x1b[0m', msg);
      writeToFile('debug', msg);
    }
  },

  // Custom methods
  logWithContext: (level, message, context = {}) => {
    logger[level](message, {
      ...context,
      timestamp: new Date().toISOString(),
    });
  },

  logJob: (jobId, level, message, data = {}) => {
    logger[level](`[Job:${jobId}] ${message}`, {
      jobId,
      ...data,
    });
  },
};

module.exports = logger;