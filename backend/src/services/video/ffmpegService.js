const fs = require('fs').promises;
const path = require('path');
const logger = require('../../utils/logger');
const ffmpegConfig = require('../../config/ffmpeg');
const { DIRECTORIES } = require('../../config/constants');

class FFmpegService {
  constructor() {
    this.tempDir = DIRECTORIES.TEMP || path.join(process.cwd(), 'uploads/temp');
  }

  /**
   * Safe execute helper
   */
  async execute(args) {
    return await ffmpegConfig.execute(args);
  }

  /**
   * Add Audio / Combine Video & Audio
   */
  async addAudio(videoPath, audioPath, options = {}) {
    try {
      const {
        volume = 1,
        fadeIn = 0,
        fadeOut = 0,
        startTime = 0,
        outputPath = null,
      } = options;

      // Ensure valid string output path
      const targetOutput = (typeof outputPath === 'string' && outputPath.trim().length > 0)
        ? outputPath
        : path.join(this.tempDir, `with_audio_${Date.now()}.mp4`);

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
        '-i', videoPath,
      ];

      if (startTime > 0) {
        args.push('-ss', String(startTime));
      }

      args.push(
        '-i', audioPath,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-shortest'
      );

      if (filters.length > 0) {
        args.push('-af', filters.join(','));
      }

      args.push('-y', targetOutput);

      await ffmpegConfig.execute(args);
      return targetOutput;
    } catch (error) {
      throw new Error(`Add audio failed: ${error.message}`);
    }
  }

  /**
   * Combine Video & Audio (Direct Alias for renderService)
   */
  async combineVideoAudio(videoPath, audioPath, outputPath = null) {
    return await this.addAudio(videoPath, audioPath, { outputPath });
  }

  /**
   * Concatenate videos
   */
  async concatVideos(videos, outputPath = null) {
    try {
      const targetOutput = (typeof outputPath === 'string' && outputPath.trim().length > 0)
        ? outputPath
        : path.join(this.tempDir, `concat_${Date.now()}.mp4`);

      const concatFile = path.join(this.tempDir, `concat_${Date.now()}.txt`);
      const concatContent = videos.map(v => `file '${v}'`).join('\n');
      await fs.writeFile(concatFile, concatContent);

      const args = [
        '-f', 'concat',
        '-safe', '0',
        '-i', concatFile,
        '-c', 'copy',
        '-y', targetOutput,
      ];

      await ffmpegConfig.execute(args);
      await fs.unlink(concatFile).catch(() => {});

      return targetOutput;
    } catch (error) {
      throw new Error(`Concat failed: ${error.message}`);
    }
  }

  /**
   * Extract audio from video
   */
  async extractAudio(videoPath, outputPath = null) {
    try {
      const targetOutput = (typeof outputPath === 'string' && outputPath.trim().length > 0)
        ? outputPath
        : path.join(this.tempDir, `audio_${Date.now()}.mp3`);

      const args = [
        '-i', videoPath,
        '-vn',
        '-acodec', 'libmp3lame',
        '-b:a', '192k',
        '-y', targetOutput,
      ];

      await ffmpegConfig.execute(args);
      return targetOutput;
    } catch (error) {
      throw new Error(`Extract audio failed: ${error.message}`);
    }
  }

  /**
   * Resize video
   */
  async resizeVideo(inputPath, options = {}) {
    try {
      const {
        width = 1080,
        height = 1920,
        fit = 'cover',
        outputPath = null,
      } = options;

      const targetOutput = (typeof outputPath === 'string' && outputPath.trim().length > 0)
        ? outputPath
        : path.join(this.tempDir, `resized_${Date.now()}.mp4`);

      let filter = fit === 'cover'
        ? `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`
        : `scale=${width}:${height}:force_original_aspect_ratio=increase,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`;

      const args = [
        '-i', inputPath,
        '-vf', filter,
        '-c:a', 'copy',
        '-y', targetOutput,
      ];

      await ffmpegConfig.execute(args);
      return targetOutput;
    } catch (error) {
      throw new Error(`Resize failed: ${error.message}`);
    }
  }

  /**
   * Compress video
   */
  async compressVideo(inputPath, options = {}) {
    try {
      const {
        crf = 23,
        preset = 'medium',
        bitrate = '4M',
        outputPath = null,
      } = options;

      const targetOutput = (typeof outputPath === 'string' && outputPath.trim().length > 0)
        ? outputPath
        : path.join(this.tempDir, `compressed_${Date.now()}.mp4`);

      const args = [
        '-i', inputPath,
        '-c:v', 'libx264',
        '-preset', preset,
        '-crf', String(crf),
        '-b:v', bitrate,
        '-c:a', 'aac',
        '-b:a', '128k',
        '-pix_fmt', 'yuv420p',
        '-y', targetOutput,
      ];

      await ffmpegConfig.execute(args);
      return targetOutput;
    } catch (error) {
      throw new Error(`Compress failed: ${error.message}`);
    }
  }

  /**
   * Create thumbnail from video
   */
  async createThumbnail(videoPath, options = {}) {
    try {
      const {
        timestamp = '00:00:01',
        width = 1080,
        height = 1920,
        outputPath = null,
      } = options;

      const targetOutput = (typeof outputPath === 'string' && outputPath.trim().length > 0)
        ? outputPath
        : path.join(this.tempDir, `thumb_${Date.now()}.jpg`);

      const args = [
        '-ss', timestamp,
        '-i', videoPath,
        '-vf', `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
        '-vframes', '1',
        '-y', targetOutput,
      ];

      await ffmpegConfig.execute(args);
      return targetOutput;
    } catch (error) {
      throw new Error(`Thumbnail creation failed: ${error.message}`);
    }
  }

  /**
   * Get video info
   */
  async getVideoInfo(videoPath) {
    try {
      const info = await ffmpegConfig.getMediaInfo(videoPath);
      const videoStream = info.streams?.find(s => s.codec_type === 'video');
      const audioStream = info.streams?.find(s => s.codec_type === 'audio');

      return {
        duration: parseFloat(info.format?.duration || 0),
        size: parseInt(info.format?.size || 0),
        format: info.format?.format_name,
        video: {
          codec: videoStream?.codec_name,
          width: parseInt(videoStream?.width || 1080),
          height: parseInt(videoStream?.height || 1920),
          fps: videoStream?.r_frame_rate ? eval(videoStream.r_frame_rate) : 30,
          bitrate: parseInt(videoStream?.bit_rate || 0),
        },
        audio: {
          codec: audioStream?.codec_name,
          channels: parseInt(audioStream?.channels || 2),
          sampleRate: parseInt(audioStream?.sample_rate || 44100),
          bitrate: parseInt(audioStream?.bit_rate || 0),
        },
      };
    } catch (error) {
      throw new Error(`Get video info failed: ${error.message}`);
    }
  }
}

module.exports = new FFmpegService();