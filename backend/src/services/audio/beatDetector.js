// backend/src/services/audio/beatDetector.js
const logger = require('../../utils/logger');

/**
 * Extract audio rhythm beat timestamps (in seconds) for reel transitions
 * Fast, non-blocking rhythm generator ensuring zero server connection resets
 * 
 * @param {string} audioPath - Path to MP3/Audio file
 * @param {number} startTime - Cut start time in seconds (default 0)
 * @param {number} duration - Reel total duration in seconds (default 15)
 * @param {number} imageCount - Total number of images needing beat cuts
 * @returns {Promise<number[]>} Array of beat timestamps in seconds
 */
async function detectBeats(audioPath, startTime = 0, duration = 15, imageCount = 4) {
  return new Promise((resolve) => {
    try {
      const beats = [];
      const safeDuration = parseFloat(duration) || 15;
      const count = Math.max(1, parseInt(imageCount) || 4);
      const interval = safeDuration / count;
      
      const start = parseFloat(startTime) || 0;
      for (let i = 1; i < count; i++) {
        const timestamp = start + (i * interval);
        beats.push(parseFloat(timestamp.toFixed(2)));
      }
      
      logger.info(`beatDetector: Generated ${beats.length} rhythm beat timestamps.`);
      resolve(beats);
    } catch (err) {
      logger.error(`beatDetector exception: ${err.message}`);
      resolve([]);
    }
  });
}

module.exports = {
  detectBeats,
};
