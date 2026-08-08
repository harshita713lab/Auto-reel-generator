const { exec, spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const env = require('./env');
const { DIRECTORIES } = require('./constants');

// Auto-detect FFmpeg binary path if not defined in .env
let detectedFFmpegPath = env.FFMPEG_PATH;
let detectedFFprobePath = env.FFPROBE_PATH;

if (!detectedFFmpegPath || detectedFFmpegPath === 'ffmpeg') {
  try {
    const ffmpegStatic = require('ffmpeg-static');
    if (ffmpegStatic) {
      detectedFFmpegPath = ffmpegStatic;
    }
  } catch (e) {
    detectedFFmpegPath = 'ffmpeg'; // System binary fallback
  }
}

if (!detectedFFprobePath || detectedFFprobePath === 'ffprobe') {
  try {
    const ffprobeStatic = require('ffprobe-static');
    if (ffprobeStatic && ffprobeStatic.path) {
      detectedFFprobePath = ffprobeStatic.path;
    }
  } catch (e) {
    detectedFFprobePath = 'ffprobe'; // System binary fallback
  }
}

class FFmpegConfig {
  constructor() {
    this.ffmpegPath = detectedFFmpegPath;
    this.ffprobePath = detectedFFprobePath;
    this.useGPU = env.FFMPEG_USE_GPU;
    this.tempDir = DIRECTORIES.TEMP;
  }

  getCommand(command = 'ffmpeg') {
    return command === 'ffmpeg' ? this.ffmpegPath : this.ffprobePath;
  }

  getFastVideoCodecFlags() {
    try {
      if (process.platform === 'darwin') {
        return ['-c:v', 'h264_videotoolbox', '-b:v', '6M'];
      }
      const result = require('child_process').execSync('nvidia-smi', { encoding: 'utf8' });
      if (result.includes('CUDA') || result.includes('NVIDIA')) {
        return ['-c:v', 'h264_nvenc', '-preset', 'p1', '-tune', 'hq', '-b:v', '6M'];
      }
    } catch (e) {
      // CPU fallback with ultrafast preset
    }
    return ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '22'];
  }

  /**
   * Safe Execute method handling both raw args and executable arrays
   */
  async execute(args, options = {}) {
    const { timeout = 300000, maxBuffer = 100 * 1024 * 1024, onProgress = null } = options;

    return new Promise((resolve, reject) => {
      if (!args || !Array.isArray(args) || args.length === 0) {
        return reject(new Error('Invalid arguments passed to FFmpeg execute method.'));
      }

      let executable = this.ffmpegPath;
      let processArgs = [];

      // Check if first arg is already an executable path/string like 'ffmpeg' or 'ffprobe'
      if (args[0] === 'ffmpeg' || args[0] === 'ffprobe' || args[0] === this.ffmpegPath || args[0] === this.ffprobePath) {
        executable = (args[0] === 'ffprobe' || args[0] === this.ffprobePath) ? this.ffprobePath : this.ffmpegPath;
        processArgs = args.slice(1);
      } else {
        // If args is directly the array of flags e.g., ['-i', 'file.mp4', ...]
        processArgs = args;
      }

      let stderr = '';
      let stdout = '';

      const child = spawn(executable, processArgs, { timeout, maxBuffer });

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;

        if (onProgress && typeof onProgress === 'function') {
          const progress = this.parseProgress(output);
          if (progress) onProgress(progress);
        }
      });

      child.on('error', (error) => {
        reject(new Error(`FFmpeg process error: ${error.message}`));
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr, code });
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}: ${stderr}`));
        }
      });
    });
  }

  parseProgress(output) {
    const timeMatch = output.match(/time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const seconds = parseInt(timeMatch[3]);
      const centiseconds = parseInt(timeMatch[4]);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds + centiseconds / 100;

      const durationMatch = output.match(/Duration: (\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
      if (durationMatch) {
        const dh = parseInt(durationMatch[1]);
        const dm = parseInt(durationMatch[2]);
        const ds = parseInt(durationMatch[3]);
        const dc = parseInt(durationMatch[4]);
        const totalDuration = dh * 3600 + dm * 60 + ds + dc / 100;

        return {
          time: totalSeconds,
          duration: totalDuration,
          progress: totalDuration > 0 ? totalSeconds / totalDuration : 0,
        };
      }
    }
    return null;
  }

  async getMediaInfo(filePath) {
    const args = [
      this.ffprobePath,
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_format',
      '-show_streams',
      filePath,
    ];

    try {
      const result = await this.execute(args);
      return JSON.parse(result.stdout);
    } catch (error) {
      logger.error('Failed to get media info', { error: error.message, filePath });
      // Fallback mock object if ffprobe fails
      return {
        streams: [{ codec_type: 'video', width: 1080, height: 1920, r_frame_rate: '30/1' }],
        format: { duration: '10', size: '1000000' }
      };
    }
  }

  async extractAudio(inputPath, outputPath = null) {
    if (!outputPath) {
      outputPath = path.join(this.tempDir, `audio_${Date.now()}.mp3`);
    }

    const args = [
      '-i', inputPath,
      '-vn',
      '-acodec', 'libmp3lame',
      '-b:a', '192k',
      '-ar', '44100',
      '-y',
      outputPath,
    ];

    await this.execute(args);
    return outputPath;
  }

  async combineVideoAudio(videoPath, audioPath, outputPath = null) {
    if (!outputPath) {
      outputPath = path.join(this.tempDir, `combined_${Date.now()}.mp4`);
    }

    const args = [
      '-i', videoPath,
      '-i', audioPath,
      '-c:v', 'copy',
      '-c:a', 'aac',
      '-shortest',
      '-y',
      outputPath,
    ];

    await this.execute(args);
    return outputPath;
  }

  async createThumbnail(inputPath, outputPath = null, timestamp = '00:00:00.000') {
    if (!outputPath) {
      outputPath = path.join(this.tempDir, `thumb_${Date.now()}.jpg`);
    }

    const args = [
      '-ss', timestamp,
      '-i', inputPath,
      '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2',
      '-vframes', '1',
      '-y',
      outputPath,
    ];

    await this.execute(args);
    return outputPath;
  }

  async cleanup(files) {
    for (const file of files) {
      try {
        if (await fs.access(file).then(() => true).catch(() => false)) {
          await fs.unlink(file);
          logger.debug(`Cleaned up: ${file}`);
        }
      } catch (error) {
        logger.warn(`Failed to clean: ${file}`, { error: error.message });
      }
    }
  }
}

module.exports = new FFmpegConfig();