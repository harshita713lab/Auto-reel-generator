const fs = require('fs').promises;
const path = require('path');
const logger = require('../../utils/logger');
const ffmpegConfig = require('../../config/ffmpeg');
const outputService = require('../storage/outputService');
const { DIRECTORIES } = require('../../config/constants');

class ExportService {
  constructor() {
    this.exportDir = DIRECTORIES.EXPORTS;
  }

  /**
   * Export video with custom settings
   * @param {string} inputPath - Input video path
   * @param {object} options - Export options
   * @returns {Promise<object>}
   */
  async exportVideo(inputPath, options = {}) {
    try {
      const {
        width = 1080,
        height = 1920,
        fps = 30,
        bitrate = '8M',
        codec = 'libx264',
        format = 'mp4',
        quality = 'high',
        outputName = null,
      } = options;

      // Generate output filename
      const filename = outputName || `export_${Date.now()}.${format}`;
      const outputPath = path.join(this.exportDir, filename);

      // Build FFmpeg command
      const args = [
        ffmpegConfig.ffmpegPath,
        '-i', inputPath,
        '-c:v', codec,
        '-preset', 'medium',
        '-crf', quality === 'high' ? '18' : quality === 'medium' ? '23' : '28',
        '-b:v', bitrate,
        '-vf', `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
        '-r', String(fps),
        '-c:a', 'aac',
        '-b:a', '192k',
        '-pix_fmt', 'yuv420p',
        '-y', outputPath,
      ];

      await ffmpegConfig.execute(args);

      const stats = await fs.stat(outputPath);

      return {
        path: outputPath,
        filename,
        size: stats.size,
        width,
        height,
        fps,
        format,
        quality,
        url: `/exports/${filename}`,
      };
    } catch (error) {
      throw new Error(`Export failed: ${error.message}`);
    }
  }

  /**
   * Export for Instagram Reels
   * @param {string} inputPath - Input video path
   * @param {object} options - Options
   * @returns {Promise<object>}
   */
  async exportForInstagram(inputPath, options = {}) {
    return this.exportVideo(inputPath, {
      width: 1080,
      height: 1920,
      fps: 30,
      bitrate: '6M',
      quality: 'high',
      format: 'mp4',
      ...options,
    });
  }

  /**
   * Export for YouTube Shorts
   * @param {string} inputPath - Input video path
   * @param {object} options - Options
   * @returns {Promise<object>}
   */
  async exportForYouTube(inputPath, options = {}) {
    return this.exportVideo(inputPath, {
      width: 1080,
      height: 1920,
      fps: 30,
      bitrate: '10M',
      quality: 'high',
      format: 'mp4',
      ...options,
    });
  }

  /**
   * Export for TikTok
   * @param {string} inputPath - Input video path
   * @param {object} options - Options
   * @returns {Promise<object>}
   */
  async exportForTikTok(inputPath, options = {}) {
    return this.exportVideo(inputPath, {
      width: 1080,
      height: 1920,
      fps: 30,
      bitrate: '5M',
      quality: 'medium',
      format: 'mp4',
      ...options,
    });
  }

  /**
   * Get export history
   * @param {number} limit - Limit
   * @returns {Promise<Array>}
   */
  async getExports(limit = 20) {
    try {
      const files = await fs.readdir(this.exportDir);
      const exports = [];

      for (const file of files) {
        const filePath = path.join(this.exportDir, file);
        const stats = await fs.stat(filePath);
        exports.push({
          filename: file,
          path: filePath,
          size: stats.size,
          created: stats.birthtime,
          url: `/exports/${file}`,
        });
      }

      // Sort by created date descending
      exports.sort((a, b) => b.created - a.created);
      return exports.slice(0, limit);
    } catch (error) {
      logger.error('Failed to get exports:', error);
      return [];
    }
  }

  /**
   * Delete export
   * @param {string} filename - Export filename
   * @returns {Promise<boolean>}
   */
  async deleteExport(filename) {
    try {
      const filePath = path.join(this.exportDir, filename);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      logger.error('Failed to delete export:', error);
      return false;
    }
  }

  /**
   * Cleanup old exports
   * @param {number} maxAge - Max age in days
   * @returns {Promise<number>}
   */
  async cleanup(maxAge = 7) {
    try {
      const files = await fs.readdir(this.exportDir);
      const now = Date.now();
      const maxAgeMs = maxAge * 24 * 60 * 60 * 1000;
      let deleted = 0;

      for (const file of files) {
        const filePath = path.join(this.exportDir, file);
        const stats = await fs.stat(filePath);
        if (now - stats.mtimeMs > maxAgeMs) {
          await fs.unlink(filePath);
          deleted++;
        }
      }

      return deleted;
    } catch (error) {
      logger.error('Failed to cleanup exports:', error);
      return 0;
    }
  }
}

module.exports = new ExportService();