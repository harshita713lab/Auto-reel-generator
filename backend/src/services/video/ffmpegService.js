const fs = require('fs').promises;
const path = require('path');
const logger = require('../../utils/logger');
const ffmpegConfig = require('../../config/ffmpeg');
const { DIRECTORIES } = require('../../config/constants');

class FFmpegService {
  constructor() {
    this.tempDir = DIRECTORIES.TEMP;
  }

  /**
   * Concatenate videos
   * @param {string[]} videos - Array of video paths
   * @param {string} outputPath - Output path
   * @returns {Promise<string>}
   */
  async concatVideos(videos, outputPath = null) {
    try {
      if (!outputPath) {
        outputPath = path.join(this.tempDir, `concat_${Date.now()}.mp4`);
      }

      // Create concat file
      const concatFile = path.join(this.tempDir, `concat_${Date.now()}.txt`);
      const concatContent = videos.map(v => `file '${v}'`).join('\n');
      await fs.writeFile(concatFile, concatContent);

      const args = [
        ffmpegConfig.ffmpegPath,
        '-f', 'concat',
        '-safe', '0',
        '-i', concatFile,
        '-c', 'copy',
        '-y', outputPath,
      ];

      await ffmpegConfig.execute(args);
      await fs.unlink(concatFile);

      return outputPath;
    } catch (error) {
      throw new Error(`Concat failed: ${error.message}`);
    }
  }

  /**
   * Add audio to video
   * @param {string} videoPath - Video path
   * @param {string} audioPath - Audio path
   * @param {object} options - Options
   * @returns {Promise<string>}
   */
  async addAudio(videoPath, audioPath, options = {}) {
    try {
      const {
        volume = 1,
        fadeIn = 0,
        fadeOut = 0,
        outputPath = null,
      } = options;

      if (!outputPath) {
        outputPath = path.join(this.tempDir, `with_audio_${Date.now()}.mp4`);
      }

      const filters = [];
      if (volume !== 1) {
        filters.push(`volume=${volume}`);
      }
      if (fadeIn > 0) {
        filters.push(`afade=t=in:ss=0:d=${fadeIn}`);
      }
      if (fadeOut > 0) {
        filters.push(`afade=t=out:st=${fadeOut}:d=${fadeOut}`);
      }

      const args = [
        ffmpegConfig.ffmpegPath,
        '-i', videoPath,
        '-i', audioPath,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-shortest',
      ];

      if (filters.length > 0) {
        args.push('-af', filters.join(','));
      }

      args.push('-y', outputPath);

      await ffmpegConfig.execute(args);
      return outputPath;
    } catch (error) {
      throw new Error(`Add audio failed: ${error.message}`);
    }
  }

  /**
   * Extract audio from video
   * @param {string} videoPath - Video path
   * @param {string} outputPath - Output path
   * @returns {Promise<string>}
   */
  async extractAudio(videoPath, outputPath = null) {
    try {
      if (!outputPath) {
        outputPath = path.join(this.tempDir, `audio_${Date.now()}.mp3`);
      }

      const args = [
        ffmpegConfig.ffmpegPath,
        '-i', videoPath,
        '-vn',
        '-acodec', 'libmp3lame',
        '-b:a', '192k',
        '-y', outputPath,
      ];

      await ffmpegConfig.execute(args);
      return outputPath;
    } catch (error) {
      throw new Error(`Extract audio failed: ${error.message}`);
    }
  }

  /**
   * Resize video
   * @param {string} inputPath - Input video path
   * @param {object} options - Resize options
   * @returns {Promise<string>}
   */
  async resizeVideo(inputPath, options = {}) {
    try {
      const {
        width = 1080,
        height = 1920,
        fit = 'cover',
        outputPath = null,
      } = options;

      if (!outputPath) {
        outputPath = path.join(this.tempDir, `resized_${Date.now()}.mp4`);
      }

      let filter;
      if (fit === 'cover') {
        filter = `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`;
      } else {
        filter = `scale=${width}:${height}:force_original_aspect_ratio=increase,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`;
      }

      const args = [
        ffmpegConfig.ffmpegPath,
        '-i', inputPath,
        '-vf', filter,
        '-c:a', 'copy',
        '-y', outputPath,
      ];

      await ffmpegConfig.execute(args);
      return outputPath;
    } catch (error) {
      throw new Error(`Resize failed: ${error.message}`);
    }
  }

  /**
   * Compress video
   * @param {string} inputPath - Input video path
   * @param {object} options - Compression options
   * @returns {Promise<string>}
   */
  async compressVideo(inputPath, options = {}) {
    try {
      const {
        crf = 23,
        preset = 'medium',
        bitrate = '4M',
        outputPath = null,
      } = options;

      if (!outputPath) {
        outputPath = path.join(this.tempDir, `compressed_${Date.now()}.mp4`);
      }

      const args = [
        ffmpegConfig.ffmpegPath,
        '-i', inputPath,
        '-c:v', 'libx264',
        '-preset', preset,
        '-crf', String(crf),
        '-b:v', bitrate,
        '-c:a', 'aac',
        '-b:a', '128k',
        '-pix_fmt', 'yuv420p',
        '-y', outputPath,
      ];

      await ffmpegConfig.execute(args);
      return outputPath;
    } catch (error) {
      throw new Error(`Compress failed: ${error.message}`);
    }
  }

  /**
   * Create thumbnail from video
   * @param {string} videoPath - Video path
   * @param {object} options - Options
   * @returns {Promise<string>}
   */
  async createThumbnail(videoPath, options = {}) {
    try {
      const {
        timestamp = '00:00:01',
        width = 1080,
        height = 1920,
        outputPath = null,
      } = options;

      if (!outputPath) {
        outputPath = path.join(this.tempDir, `thumb_${Date.now()}.jpg`);
      }

      const args = [
        ffmpegConfig.ffmpegPath,
        '-ss', timestamp,
        '-i', videoPath,
        '-vf', `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
        '-vframes', '1',
        '-y', outputPath,
      ];

      await ffmpegConfig.execute(args);
      return outputPath;
    } catch (error) {
      throw new Error(`Thumbnail creation failed: ${error.message}`);
    }
  }

  /**
   * Get video info
   * @param {string} videoPath - Video path
   * @returns {Promise<object>}
   */
  async getVideoInfo(videoPath) {
    try {
      const info = await ffmpegConfig.getMediaInfo(videoPath);
      const videoStream = info.streams.find(s => s.codec_type === 'video');
      const audioStream = info.streams.find(s => s.codec_type === 'audio');

      return {
        duration: parseFloat(info.format.duration),
        size: parseInt(info.format.size),
        format: info.format.format_name,
        video: {
          codec: videoStream?.codec_name,
          width: parseInt(videoStream?.width),
          height: parseInt(videoStream?.height),
          fps: eval(videoStream?.r_frame_rate),
          bitrate: parseInt(videoStream?.bit_rate),
        },
        audio: {
          codec: audioStream?.codec_name,
          channels: parseInt(audioStream?.channels),
          sampleRate: parseInt(audioStream?.sample_rate),
          bitrate: parseInt(audioStream?.bit_rate),
        },
      };
    } catch (error) {
      throw new Error(`Get video info failed: ${error.message}`);
    }
  }
}

module.exports = new FFmpegService();