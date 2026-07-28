const fs = require('fs').promises;
const path = require('path');
const logger = require('../../utils/logger');
const ffmpegService = require('./ffmpegService');
const fileService = require('../storage/fileService');
const { DIRECTORIES, VIDEO_CONFIG } = require('../../config/constants');

class VideoService {
  constructor() {
    this.tempDir = DIRECTORIES.TEMP;
  }

  /**
   * Validate video file
   * @param {object} file - Multer file object
   * @returns {Promise<object>}
   */
  async validateVideo(file) {
    const errors = [];

    // Check extension
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
    if (!allowed.includes(ext)) {
      errors.push(`Invalid format. Allowed: ${allowed.join(', ')}`);
    }

    // Check size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push(`File too large. Max: ${maxSize / (1024 * 1024)}MB`);
    }

    // Check if valid video
    try {
      await ffmpegService.getVideoInfo(file.path);
    } catch (error) {
      errors.push('Invalid or corrupted video file');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get video info
   * @param {string} videoPath - Video path
   * @returns {Promise<object>}
   */
  async getVideoInfo(videoPath) {
    try {
      const info = await ffmpegService.getVideoInfo(videoPath);
      
      return {
        duration: info.duration,
        size: info.size,
        format: info.format,
        width: info.video?.width,
        height: info.video?.height,
        fps: info.video?.fps,
        codec: info.video?.codec,
        audioCodec: info.audio?.codec,
        channels: info.audio?.channels,
        sampleRate: info.audio?.sampleRate,
        bitrate: info.video?.bitrate || info.audio?.bitrate,
      };
    } catch (error) {
      throw new Error(`Failed to get video info: ${error.message}`);
    }
  }

  /**
   * Trim video
   * @param {string} inputPath - Input video path
   * @param {number} startTime - Start time in seconds
   * @param {number} duration - Duration in seconds
   * @param {string} outputPath - Output path
   * @returns {Promise<string>}
   */
  async trimVideo(inputPath, startTime, duration, outputPath = null) {
    try {
      if (!outputPath) {
        outputPath = path.join(this.tempDir, `trimmed_${Date.now()}.mp4`);
      }

      const args = [
        ffmpegService.ffmpegPath,
        '-ss', String(startTime),
        '-i', inputPath,
        '-t', String(duration),
        '-c', 'copy',
        '-y', outputPath,
      ];

      await ffmpegService.execute(args);
      return outputPath;
    } catch (error) {
      throw new Error(`Trim failed: ${error.message}`);
    }
  }

  /**
   * Change video speed
   * @param {string} inputPath - Input video path
   * @param {number} speed - Speed multiplier (0.5 - 2.0)
   * @param {string} outputPath - Output path
   * @returns {Promise<string>}
   */
  async changeSpeed(inputPath, speed, outputPath = null) {
    try {
      if (!outputPath) {
        outputPath = path.join(this.tempDir, `sped_${Date.now()}.mp4`);
      }

      const speedFactor = Math.max(0.25, Math.min(4, speed));

      const args = [
        ffmpegService.ffmpegPath,
        '-i', inputPath,
        '-filter_complex', `[0:v]setpts=${1/speedFactor}*PTS[v];[0:a]atempo=${speedFactor}[a]`,
        '-map', '[v]',
        '-map', '[a]',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-y', outputPath,
      ];

      await ffmpegService.execute(args);
      return outputPath;
    } catch (error) {
      throw new Error(`Speed change failed: ${error.message}`);
    }
  }

  /**
   * Reverse video
   * @param {string} inputPath - Input video path
   * @param {string} outputPath - Output path
   * @returns {Promise<string>}
   */
  async reverseVideo(inputPath, outputPath = null) {
    try {
      if (!outputPath) {
        outputPath = path.join(this.tempDir, `reversed_${Date.now()}.mp4`);
      }

      const args = [
        ffmpegService.ffmpegPath,
        '-i', inputPath,
        '-vf', 'reverse',
        '-af', 'areverse',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-y', outputPath,
      ];

      await ffmpegService.execute(args);
      return outputPath;
    } catch (error) {
      throw new Error(`Reverse failed: ${error.message}`);
    }
  }

  /**
   * Merge multiple videos
   * @param {string[]} videoPaths - Array of video paths
   * @param {string} outputPath - Output path
   * @returns {Promise<string>}
   */
  async mergeVideos(videoPaths, outputPath = null) {
    try {
      if (!outputPath) {
        outputPath = path.join(this.tempDir, `merged_${Date.now()}.mp4`);
      }

      // Create concat file
      const concatFile = path.join(this.tempDir, `concat_${Date.now()}.txt`);
      const concatContent = videoPaths.map(v => `file '${v}'`).join('\n');
      await fs.writeFile(concatFile, concatContent);

      const args = [
        ffmpegService.ffmpegPath,
        '-f', 'concat',
        '-safe', '0',
        '-i', concatFile,
        '-c', 'copy',
        '-y', outputPath,
      ];

      await ffmpegService.execute(args);
      await fs.unlink(concatFile);

      return outputPath;
    } catch (error) {
      throw new Error(`Merge failed: ${error.message}`);
    }
  }

  /**
   * Add watermark to video
   * @param {string} inputPath - Input video path
   * @param {string} watermarkPath - Watermark image path
   * @param {object} options - Options
   * @returns {Promise<string>}
   */
  async addWatermark(inputPath, watermarkPath, options = {}) {
    try {
      const {
        position = 'bottom-right',
        margin = 20,
        size = 100,
        outputPath = null,
      } = options;

      if (!outputPath) {
        outputPath = path.join(this.tempDir, `watermarked_${Date.now()}.mp4`);
      }

      // Position mapping
      const positions = {
        'top-left': `overlay=${margin}:${margin}`,
        'top-right': `overlay=W-w-${margin}:${margin}`,
        'bottom-left': `overlay=${margin}:H-h-${margin}`,
        'bottom-right': `overlay=W-w-${margin}:H-h-${margin}`,
        center: `overlay=(W-w)/2:(H-h)/2`,
      };

      const filter = positions[position] || positions['bottom-right'];

      const args = [
        ffmpegService.ffmpegPath,
        '-i', inputPath,
        '-i', watermarkPath,
        '-filter_complex', `[1:v]scale=${size}:-1[wm];[0:v][wm]${filter}`,
        '-c:a', 'copy',
        '-y', outputPath,
      ];

      await ffmpegService.execute(args);
      return outputPath;
    } catch (error) {
      throw new Error(`Add watermark failed: ${error.message}`);
    }
  }

  /**
   * Extract frames from video
   * @param {string} videoPath - Video path
   * @param {object} options - Options
   * @returns {Promise<Array>}
   */
  async extractFrames(videoPath, options = {}) {
    try {
      const {
        count = 10,
        outputDir = this.tempDir,
        prefix = 'frame',
      } = options;

      const info = await ffmpegService.getVideoInfo(videoPath);
      const duration = info.duration;
      const interval = duration / count;

      const frames = [];

      for (let i = 0; i < count; i++) {
        const timestamp = i * interval;
        const filename = `${prefix}_${String(i + 1).padStart(3, '0')}.jpg`;
        const outputPath = path.join(outputDir, filename);

        await ffmpegService.createThumbnail(videoPath, {
          timestamp: this.formatTimestamp(timestamp),
          outputPath,
          width: 320,
          height: 180,
        });

        frames.push({
          filename,
          path: outputPath,
          timestamp,
          index: i + 1,
        });
      }

      return frames;
    } catch (error) {
      throw new Error(`Extract frames failed: ${error.message}`);
    }
  }

  /**
   * Format timestamp
   */
  formatTimestamp(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * Get video duration
   * @param {string} videoPath - Video path
   * @returns {Promise<number>}
   */
  async getDuration(videoPath) {
    try {
      const info = await ffmpegService.getVideoInfo(videoPath);
      return info.duration;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Check if video is valid
   * @param {string} videoPath - Video path
   * @returns {Promise<boolean>}
   */
  async isValidVideo(videoPath) {
    try {
      await ffmpegService.getVideoInfo(videoPath);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = new VideoService();