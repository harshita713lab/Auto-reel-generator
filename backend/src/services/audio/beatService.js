const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
const logger = require('../../utils/logger');
const ffmpegConfig = require('../../config/ffmpeg');
const { DIRECTORIES } = require('../../config/constants');

class BeatService {
  constructor() {
    this.tempDir = DIRECTORIES.TEMP;
  }

  /**
   * Detect beats in audio file
   * @param {string} audioPath - Path to audio file
   * @param {object} options - Detection options
   * @returns {Promise<Array>} Array of beat objects
   */
  async detectBeats(audioPath, options = {}) {
    const {
      method = 'aubio', // 'aubio' or 'essentia'
      minBPM = 60,
      maxBPM = 200,
      threshold = 0.3,
    } = options;

    try {
      // Check if file exists
      await fs.access(audioPath);

      let beats = [];

      // Use different beat detection methods
      switch (method) {
        case 'aubio':
          beats = await this.detectBeatsAubio(audioPath, { minBPM, maxBPM, threshold });
          break;
        case 'essentia':
          beats = await this.detectBeatsEssentia(audioPath, { minBPM, maxBPM, threshold });
          break;
        default:
          // Try aubio first, fallback to simple detection
          try {
            beats = await this.detectBeatsAubio(audioPath, { minBPM, maxBPM, threshold });
          } catch (error) {
            logger.warn('Aubio beat detection failed, using simple detection:', error.message);
            beats = await this.detectBeatsSimple(audioPath, { minBPM, maxBPM });
          }
      }

      // Filter and process beats
      beats = this.processBeats(beats, { minBPM, maxBPM });

      logger.info(`Detected ${beats.length} beats from audio`);

      return beats;
    } catch (error) {
      logger.error('Beat detection failed:', error);
      throw new Error(`Beat detection failed: ${error.message}`);
    }
  }

  /**
   * Detect beats using Aubio
   */
  async detectBeatsAubio(audioPath, options = {}) {
    const { minBPM = 60, maxBPM = 200, threshold = 0.3 } = options;

    return new Promise((resolve, reject) => {
      const args = [
        'aubio',
        'beat',
        '-i', audioPath,
        '-b', String(minBPM),
        '-m', String(maxBPM),
        '-t', String(threshold),
        '-j', // JSON output
      ];

      const child = spawn('python', ['-c', `
import sys
import json
import aubio
import numpy as np

def detect_beats(audio_path, min_bpm, max_bpm, threshold):
    try:
        # Load audio
        win_s = 512
        hop_s = win_s // 2
        samplerate = 0
        
        # Detect beats
        source = aubio.source(audio_path, samplerate, hop_s)
        samplerate = source.samplerate
        
        tempo = aubio.tempo("default", win_s, hop_s, samplerate)
        tempo.set_min_bpm(min_bpm)
        tempo.set_max_bpm(max_bpm)
        tempo.set_threshold(threshold)
        
        beats = []
        total_frames = 0
        
        while True:
            samples, read = source()
            if tempo(samples):
                beats.append({
                    'time': total_frames / float(samplerate),
                    'confidence': tempo.get_confidence()
                })
            total_frames += read
            if read < hop_s:
                break
        
        return beats
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    audio_path = sys.argv[1]
    min_bpm = float(sys.argv[2])
    max_bpm = float(sys.argv[3])
    threshold = float(sys.argv[4])
    
    beats = detect_beats(audio_path, min_bpm, max_bpm, threshold)
    print(json.dumps(beats))
      `, ...args.slice(1)]);

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          try {
            const beats = JSON.parse(stdout);
            resolve(beats);
          } catch (error) {
            reject(new Error(`Failed to parse beat data: ${error.message}`));
          }
        } else {
          reject(new Error(`Aubio failed: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to run aubio: ${error.message}`));
      });
    });
  }

  /**
   * Detect beats using Essentia
   */
  async detectBeatsEssentia(audioPath, options = {}) {
    const { minBPM = 60, maxBPM = 200, threshold = 0.3 } = options;

    return new Promise((resolve, reject) => {
      const args = [
        'python', '-c', `
import sys
import json
import essentia.standard as es

def detect_beats_essentia(audio_path, min_bpm, max_bpm, threshold):
    try:
        # Load audio
        loader = es.MonoLoader(filename=audio_path)
        audio = loader()
        
        # Detect beats
        beat_tracker = es.BeatTrackerMultiFeature()
        beats, bpm = beat_tracker(audio)
        
        # Filter beats
        filtered_beats = []
        for i, beat in enumerate(beats):
            if 0 < beat < len(audio) / 44100:
                filtered_beats.append({
                    'time': float(beat),
                    'confidence': 1.0
                })
        
        return filtered_beats
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    audio_path = sys.argv[1]
    min_bpm = float(sys.argv[2])
    max_bpm = float(sys.argv[3])
    threshold = float(sys.argv[4])
    
    beats = detect_beats_essentia(audio_path, min_bpm, max_bpm, threshold)
    print(json.dumps(beats))
        `
      ];

      const child = spawn(args[0], args.slice(1));

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          try {
            const beats = JSON.parse(stdout);
            resolve(beats);
          } catch (error) {
            reject(new Error(`Failed to parse beat data: ${error.message}`));
          }
        } else {
          reject(new Error(`Essentia failed: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to run essentia: ${error.message}`));
      });
    });
  }

  /**
   * Simple beat detection using amplitude peaks
   */
  async detectBeatsSimple(audioPath, options = {}) {
    const { minBPM = 60, maxBPM = 200 } = options;

    try {
      // Get audio info
      const info = await ffmpegConfig.getMediaInfo(audioPath);
      const audioStream = info.streams.find(s => s.codec_type === 'audio');
      const duration = parseFloat(info.format.duration);
      const sampleRate = parseInt(audioStream.sample_rate);

      // Generate peaks using ffmpeg
      const peaks = await this.extractPeaks(audioPath, {
        sampleRate,
        duration,
        numPeaks: Math.floor(duration * 10), // 10 peaks per second
      });

      // Detect beats from peaks
      const beats = this.detectBeatsFromPeaks(peaks, { minBPM, maxBPM });

      return beats;
    } catch (error) {
      throw new Error(`Simple beat detection failed: ${error.message}`);
    }
  }

  /**
   * Extract audio peaks
   */
  async extractPeaks(audioPath, options = {}) {
    const { duration, numPeaks = 1000 } = options;

    return new Promise((resolve, reject) => {
      const args = [
        ffmpegConfig.ffmpegPath,
        '-i', audioPath,
        '-af', `compand,astats=metadata=1:reset=1,ametadata=print:file=-`,
        '-f', 'null',
        '-',
      ];

      const child = spawn(args[0], args.slice(1));

      let output = '';

      child.stderr.on('data', (data) => {
        output += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          // Parse peaks from output
          const peaks = this.parsePeaks(output, numPeaks);
          resolve(peaks);
        } else {
          reject(new Error(`FFmpeg peak extraction failed with code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to extract peaks: ${error.message}`));
      });
    });
  }

  /**
   * Parse peaks from ffmpeg output
   */
  parsePeaks(output, numPeaks) {
    const peaks = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('RMS')) {
        const match = line.match(/RMS_level=([-\d.]+)/);
        if (match) {
          const value = parseFloat(match[1]);
          if (!isNaN(value) && isFinite(value)) {
            peaks.push(value);
          }
        }
      }
    }

    // Resample to desired number of peaks
    if (peaks.length > numPeaks) {
      const step = peaks.length / numPeaks;
      const sampled = [];
      for (let i = 0; i < numPeaks; i++) {
        const idx = Math.floor(i * step);
        sampled.push(peaks[idx] || 0);
      }
      return sampled;
    }

    return peaks;
  }

  /**
   * Detect beats from peaks
   */
  detectBeatsFromPeaks(peaks, options = {}) {
    const { minBPM = 60, maxBPM = 200 } = options;

    if (peaks.length === 0) return [];

    // Normalize peaks
    const maxPeak = Math.max(...peaks.map(Math.abs));
    const normalized = peaks.map(p => p / maxPeak);

    // Find peaks (local maxima)
    const beatCandidates = [];
    const threshold = 0.3;

    for (let i = 1; i < normalized.length - 1; i++) {
      if (normalized[i] > threshold &&
          normalized[i] > normalized[i - 1] &&
          normalized[i] > normalized[i + 1]) {
        beatCandidates.push({
          index: i,
          amplitude: normalized[i],
        });
      }
    }

    // Convert to time
    const timePerPeak = 1 / 10; // 10 peaks per second
    const beats = beatCandidates.map(candidate => ({
      time: candidate.index * timePerPeak,
      confidence: candidate.amplitude,
      type: 'other',
    }));

    return beats;
  }

  /**
   * Process and filter beats
   */
  processBeats(beats, options = {}) {
    const { minBPM = 60, maxBPM = 200 } = options;

    if (!beats || beats.length === 0) return [];

    // Sort by time
    beats.sort((a, b) => a.time - b.time);

    // Remove duplicates (beats within 50ms)
    const filtered = [];
    let lastTime = -1;

    for (const beat of beats) {
      if (beat.time - lastTime > 0.05) {
        filtered.push(beat);
        lastTime = beat.time;
      }
    }

    // Calculate BPM from beats
    if (filtered.length > 2) {
      const intervals = [];
      for (let i = 1; i < filtered.length; i++) {
        intervals.push(filtered[i].time - filtered[i - 1].time);
      }
      
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = 60 / avgInterval;

      // Filter beats based on BPM range
      if (bpm >= minBPM && bpm <= maxBPM) {
        return filtered;
      }
    }

    return filtered;
  }

  /**
   * Sync beats to timeline
   */
  syncBeatsToTimeline(beats, duration, targetCount = null) {
    if (!beats || beats.length === 0) {
      return this.generateEvenBeats(duration, targetCount || Math.floor(duration / 2));
    }

    if (targetCount && beats.length > targetCount) {
      // Select evenly spaced beats
      const step = beats.length / targetCount;
      const selected = [];
      for (let i = 0; i < targetCount; i++) {
        const idx = Math.floor(i * step);
        selected.push(beats[idx]);
      }
      return selected;
    }

    return beats;
  }

  /**
   * Generate evenly spaced beats
   */
  generateEvenBeats(duration, count) {
    const beats = [];
    const interval = duration / count;
    
    for (let i = 0; i < count; i++) {
      beats.push({
        time: i * interval,
        confidence: 1.0,
        type: 'other',
      });
    }

    return beats;
  }

  /**
   * Get beat timing for transitions
   */
  getTransitionTimings(beats, imageCount) {
    if (!beats || beats.length === 0) {
      // If no beats, distribute evenly
      const timings = [];
      const totalDuration = beats.length > 0 ? beats[beats.length - 1].time : 30;
      const interval = totalDuration / imageCount;
      
      for (let i = 0; i < imageCount; i++) {
        timings.push(i * interval);
      }
      return timings;
    }

    // Select beats for transitions
    const selected = this.syncBeatsToTimeline(beats, null, imageCount);
    return selected.map(b => b.time);
  }
}

module.exports = new BeatService();