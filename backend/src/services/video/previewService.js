const fs = require('fs').promises;
const path = require('path');
const logger = require('../../utils/logger');
const ffmpegService = require('./ffmpegService');
const outputService = require('../storage/outputService');
const { DIRECTORIES } = require('../../config/constants');

class PreviewService {
  constructor() {
    this.previewDir = DIRECTORIES.PREVIEWS;
    this.tempDir = DIRECTORIES.TEMP;
  }

  /**
   * Generate preview video
   * @param {string} videoPath - Full video path
   * @param {object} options - Preview options
   * @returns {Promise<object>}
   */
  async generatePreview(videoPath, options = {}) {
    try {
      const {
        duration = 15, // seconds
        width = 540,
        height = 960,
        quality = 'low',
        outputName = null,
      } = options;

      // Get video info
      const info = await ffmpegService.getVideoInfo(videoPath);
      const totalDuration = info.duration;

      // If video is shorter than preview duration, use full video
      const previewDuration = Math.min(duration, totalDuration);

      // Generate preview
      const filename = outputName || `preview_${Date.now()}.mp4`;
      const outputPath = path.join(this.previewDir, filename);

      // Build FFmpeg command for preview
      const crf = quality === 'high' ? 23 : quality === 'medium' ? 28 : 32;
      const bitrate = quality === 'high' ? '2M' : quality === 'medium' ? '1M' : '500k';

      const args = [
        '-i', videoPath,
        '-t', String(previewDuration),
        '-vf', `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,fps=24`,
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-crf', String(crf),
        '-b:v', bitrate,
        '-c:a', 'aac',
        '-b:a', '128k',
        '-pix_fmt', 'yuv420p',
        '-y', outputPath,
      ];

      await ffmpegService.execute(args);

      const stats = await fs.stat(outputPath);

      return {
        path: outputPath,
        filename,
        size: stats.size,
        duration: previewDuration,
        width,
        height,
        quality,
        url: `/previews/${filename}`,
      };
    } catch (error) {
      throw new Error(`Preview generation failed: ${error.message}`);
    }
  }

  /**
   * Generate thumbnail preview
   * @param {string} videoPath - Video path
   * @param {number} count - Number of thumbnails
   * @returns {Promise<Array>}
   */
  async generateThumbnails(videoPath, count = 5) {
    try {
      const info = await ffmpegService.getVideoInfo(videoPath);
      const duration = info.duration;
      const interval = duration / (count + 1);
      const thumbnails = [];

      for (let i = 1; i <= count; i++) {
        const timestamp = i * interval;
        const filename = `thumb_${Date.now()}_${i}.jpg`;
        const outputPath = path.join(this.previewDir, filename);

        await ffmpegService.createThumbnail(videoPath, {
          timestamp: this.formatTimestamp(timestamp),
          outputPath,
          width: 320,
          height: 180,
        });

        thumbnails.push({
          filename,
          path: outputPath,
          timestamp,
          url: `/previews/${filename}`,
        });
      }

      return thumbnails;
    } catch (error) {
      throw new Error(`Thumbnail generation failed: ${error.message}`);
    }
  }

  /**
   * Format timestamp for FFmpeg
   */
  formatTimestamp(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
  }

  /**
   * Get preview by ID
   * @param {string} filename - Preview filename
   * @returns {Promise<object>}
   */
  async getPreview(filename) {
    try {
      const filePath = path.join(this.previewDir, filename);
      const stats = await fs.stat(filePath);
      
      return {
        filename,
        path: filePath,
        size: stats.size,
        created: stats.birthtime,
        url: `/previews/${filename}`,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Delete preview
   * @param {string} filename - Preview filename
   * @returns {Promise<boolean>}
   */
  async deletePreview(filename) {
    try {
      const filePath = path.join(this.previewDir, filename);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      logger.error('Failed to delete preview:', error);
      return false;
    }
  }

  /**
   * Cleanup old previews
   * @param {number} maxAge - Max age in days
   * @returns {Promise<number>}
   */
  async cleanup(maxAge = 1) {
    try {
      const files = await fs.readdir(this.previewDir);
      const now = Date.now();
      const maxAgeMs = maxAge * 24 * 60 * 60 * 1000;
      let deleted = 0;

      for (const file of files) {
        const filePath = path.join(this.previewDir, file);
        const stats = await fs.stat(filePath);
        if (now - stats.mtimeMs > maxAgeMs) {
          await fs.unlink(filePath);
          deleted++;
        }
      }

      return deleted;
    } catch (error) {
      logger.error('Failed to cleanup previews:', error);
      return 0;
    }
  }

  /**
   * Generate preview for multiple videos
   * @param {string[]} videoPaths - Array of video paths
   * @param {object} options - Options
   * @returns {Promise<Array>}
   */
  async generateMultiplePreviews(videoPaths, options = {}) {
    const results = [];

    for (const videoPath of videoPaths) {
      try {
        const preview = await this.generatePreview(videoPath, options);
        results.push({
          video: videoPath,
          success: true,
          preview,
        });
      } catch (error) {
        results.push({
          video: videoPath,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  }
}

module.exports = new PreviewService();