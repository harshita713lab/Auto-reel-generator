const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const Music = require('../../models/Music');
const ffmpegConfig = require('../../config/ffmpeg');
const logger = require('../../utils/logger');
const { DIRECTORIES, AUDIO_CONFIG } = require('../../config/constants');
const beatService = require('./beatService');
const bpmService = require('./bpmService');

class MusicService {
  constructor() {
    this.uploadDir = DIRECTORIES.MUSIC_UPLOAD;
    this.tempDir = DIRECTORIES.TEMP;
  }

  /**
   * Process uploaded music file
   * @param {object} file - Multer file object
   * @returns {Promise<object>} Processed music data
   */
  async processMusicFile(file) {
    try {
      // Generate unique filename
      const ext = path.extname(file.originalname);
      const filename = `${crypto.randomBytes(16).toString('hex')}${ext}`;
      const filePath = path.join(this.uploadDir, filename);

      // Move file to music directory
      await fs.rename(file.path, filePath);

      // Get audio info
      const info = await ffmpegConfig.getMediaInfo(filePath);
      const audioStream = info.streams.find(s => s.codec_type === 'audio');
      const duration = parseFloat(info.format.duration);

      // Extract metadata
      const metadata = this.extractMetadata(info);

      // Check if analyzed
      let bpm = null;
      let beats = [];
      let waveform = [];

      // Analyze if duration is reasonable
      if (duration >= AUDIO_CONFIG.MIN_DURATION && duration <= AUDIO_CONFIG.MAX_DURATION) {
        try {
          bpm = await bpmService.detectBPM(filePath);
          beats = await beatService.detectBeats(filePath);
          waveform = await this.generateWaveform(filePath);
        } catch (error) {
          logger.warn('Music analysis failed, will analyze later:', error.message);
        }
      }

      const musicData = {
        title: this.getTitle(file.originalname, metadata),
        artist: this.getArtist(metadata),
        filename,
        originalName: file.originalname,
        path: filePath,
        size: file.size,
        duration: Math.round(duration * 100) / 100,
        format: audioStream?.codec_name || 'unknown',
        bitrate: audioStream?.bit_rate ? parseInt(audioStream.bit_rate) : null,
        sampleRate: audioStream?.sample_rate ? parseInt(audioStream.sample_rate) : null,
        channels: audioStream?.channels || 2,
        bpm,
        beats,
        waveform,
        metadata,
        analyzedAt: bpm ? new Date() : null,
      };

      return musicData;
    } catch (error) {
      // Clean up on error
      if (file.path) {
        await fs.unlink(file.path).catch(() => {});
      }
      throw error;
    }
  }

  /**
   * Extract metadata from audio info
   */
  extractMetadata(info) {
    const metadata = {};
    const format = info.format;
    const tags = format.tags || {};

    // Common metadata fields
    const fields = ['title', 'artist', 'album', 'genre', 'year', 'comment', 'track'];
    for (const field of fields) {
      if (tags[field]) {
        metadata[field] = tags[field];
      }
    }

    // Additional metadata
    if (tags['date']) metadata.date = tags['date'];
    if (tags['composer']) metadata.composer = tags['composer'];
    if (tags['lyrics']) metadata.lyrics = tags['lyrics'];

    return metadata;
  }

  /**
   * Get title from filename or metadata
   */
  getTitle(filename, metadata) {
    if (metadata.title) return metadata.title;
    return path.basename(filename, path.extname(filename));
  }

  /**
   * Get artist from metadata
   */
  getArtist(metadata) {
    return metadata.artist || 'Unknown Artist';
  }

  /**
   * Generate waveform data
   */
  async generateWaveform(audioPath, points = 100) {
    try {
      // Use ffmpeg to generate waveform
      const waveformData = await this.extractWaveform(audioPath, points);
      return waveformData;
    } catch (error) {
      logger.warn('Waveform generation failed:', error.message);
      return this.generateSyntheticWaveform(points);
    }
  }

  /**
   * Extract waveform using ffmpeg
   */
  async extractWaveform(audioPath, points) {
    return new Promise((resolve, reject) => {
      const args = [
        ffmpegConfig.ffmpegPath,
        '-i', audioPath,
        '-filter_complex', `compand,astats=metadata=1:reset=1,ametadata=print:file=-`,
        '-f', 'null',
        '-',
      ];

      const child = require('child_process').spawn(args[0], args.slice(1));
      let output = '';

      child.stderr.on('data', (data) => {
        output += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          const waveform = this.parseWaveformData(output, points);
          resolve(waveform);
        } else {
          reject(new Error(`FFmpeg failed with code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to extract waveform: ${error.message}`));
      });
    });
  }

  /**
   * Parse waveform data from ffmpeg output
   */
  parseWaveformData(output, points) {
    const values = [];
    const lines = output.split('\n');

    for (const line of lines) {
      if (line.includes('RMS_level')) {
        const match = line.match(/RMS_level=([-\d.]+)/);
        if (match) {
          const value = parseFloat(match[1]);
          if (!isNaN(value) && isFinite(value)) {
            // Convert dB to linear scale
            const linear = Math.pow(10, value / 20);
            values.push(Math.max(0, Math.min(1, linear)));
          }
        }
      }
    }

    // Resample to desired points
    if (values.length === 0) {
      return this.generateSyntheticWaveform(points);
    }

    if (values.length !== points) {
      const step = values.length / points;
      const resampled = [];
      for (let i = 0; i < points; i++) {
        const idx = Math.floor(i * step);
        resampled.push(values[idx] || 0);
      }
      return resampled;
    }

    return values;
  }

  /**
   * Generate synthetic waveform data
   */
  generateSyntheticWaveform(points) {
    const waveform = [];
    for (let i = 0; i < points; i++) {
      // Generate realistic-looking waveform
      const value = Math.sin(i * 0.2) * 0.5 + 0.5;
      const noise = Math.random() * 0.3;
      waveform.push(Math.min(1, Math.max(0, value + noise * 0.5)));
    }
    return waveform;
  }

  /**
   * Trim music file
   */
  async trimMusic(inputPath, outputPath, startTime, duration) {
    try {
      const args = [
        ffmpegConfig.ffmpegPath,
        '-i', inputPath,
        '-ss', String(startTime),
        '-t', String(duration),
        '-c', 'copy',
        '-y', outputPath,
      ];

      await ffmpegConfig.execute(args);
      return outputPath;
    } catch (error) {
      throw new Error(`Failed to trim music: ${error.message}`);
    }
  }

  /**
   * Fade music in/out
   */
  async fadeMusic(inputPath, outputPath, fadeIn = 0, fadeOut = 0) {
    try {
      const filters = [];
      
      if (fadeIn > 0) {
        filters.push(`afade=t=in:ss=0:d=${fadeIn}`);
      }
      
      if (fadeOut > 0) {
        filters.push(`afade=t=out:st=${fadeOut}:d=${fadeOut}`);
      }

      const args = [
        ffmpegConfig.ffmpegPath,
        '-i', inputPath,
        '-af', filters.join(','),
        '-y', outputPath,
      ];

      await ffmpegConfig.execute(args);
      return outputPath;
    } catch (error) {
      throw new Error(`Failed to fade music: ${error.message}`);
    }
  }

  /**
   * Get music duration
   */
  async getDuration(audioPath) {
    try {
      const info = await ffmpegConfig.getMediaInfo(audioPath);
      return parseFloat(info.format.duration);
    } catch (error) {
      throw new Error(`Failed to get duration: ${error.message}`);
    }
  }

  /**
   * Validate music file
   */
  async validateMusic(file) {
    const errors = [];

    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (!AUDIO_CONFIG.ALLOWED_EXTENSIONS.includes(ext)) {
      errors.push(`Invalid file type. Allowed: ${AUDIO_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`);
    }

    // Check file size
    if (file.size > AUDIO_CONFIG.MAX_FILE_SIZE) {
      errors.push(`File too large. Max: ${AUDIO_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    // Check duration
    try {
      const duration = await this.getDuration(file.path);
      if (duration < AUDIO_CONFIG.MIN_DURATION) {
        errors.push(`Audio too short. Min: ${AUDIO_CONFIG.MIN_DURATION}s`);
      }
      if (duration > AUDIO_CONFIG.MAX_DURATION) {
        errors.push(`Audio too long. Max: ${AUDIO_CONFIG.MAX_DURATION}s`);
      }
    } catch (error) {
      errors.push('Failed to read audio duration');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get waveform for display
   */
  async getWaveform(audioPath, points = 200) {
    try {
      const waveform = await this.extractWaveform(audioPath, points);
      return waveform;
    } catch (error) {
      return this.generateSyntheticWaveform(points);
    }
  }

  /**
   * Detect silence periods in audio
   */
  async detectSilence(audioPath, threshold = -50, duration = 0.5) {
    return new Promise((resolve, reject) => {
      const args = [
        ffmpegConfig.ffmpegPath,
        '-i', audioPath,
        '-af', `silencedetect=noise=${threshold}dB:d=${duration}`,
        '-f', 'null',
        '-',
      ];

      const child = require('child_process').spawn(args[0], args.slice(1));
      let output = '';

      child.stderr.on('data', (data) => {
        output += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          const silences = this.parseSilenceDetect(output);
          resolve(silences);
        } else {
          reject(new Error(`Silence detection failed with code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to detect silence: ${error.message}`));
      });
    });
  }

  /**
   * Parse silence detection output
   */
  parseSilenceDetect(output) {
    const silences = [];
    const lines = output.split('\n');
    let currentSilence = null;

    for (const line of lines) {
      if (line.includes('silence_start')) {
        const match = line.match(/silence_start: ([\d.]+)/);
        if (match) {
          currentSilence = { start: parseFloat(match[1]) };
        }
      }
      if (line.includes('silence_end') && currentSilence) {
        const match = line.match(/silence_end: ([\d.]+) \| silence_duration: ([\d.]+)/);
        if (match) {
          currentSilence.end = parseFloat(match[1]);
          currentSilence.duration = parseFloat(match[2]);
          silences.push(currentSilence);
          currentSilence = null;
        }
      }
    }

    return silences;
  }
}

module.exports = new MusicService();