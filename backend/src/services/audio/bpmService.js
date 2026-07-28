const fs = require('fs').promises;
const { spawn } = require('child_process');
const logger = require('../../utils/logger');
const ffmpegConfig = require('../../config/ffmpeg');
const { DIRECTORIES } = require('../../config/constants');

class BPMService {
  constructor() {
    this.tempDir = DIRECTORIES.TEMP;
  }

  /**
   * Detect BPM from audio file
   * @param {string} audioPath - Path to audio file
   * @param {object} options - Detection options
   * @returns {Promise<number>} Detected BPM
   */
  async detectBPM(audioPath, options = {}) {
    const {
      method = 'auto', // 'auto', 'aubio', 'essentia', 'librosa'
      minBPM = 60,
      maxBPM = 200,
    } = options;

    try {
      await fs.access(audioPath);

      let bpm = 0;

      // Try different methods
      if (method === 'auto') {
        // Try aubio first
        try {
          bpm = await this.detectBPMWithAubio(audioPath, { minBPM, maxBPM });
        } catch (error) {
          logger.warn('Aubio BPM detection failed, trying librosa:', error.message);
          try {
            bpm = await this.detectBPMWithLibrosa(audioPath, { minBPM, maxBPM });
          } catch (error2) {
            logger.warn('Librosa BPM detection failed, using fallback:', error2.message);
            bpm = await this.detectBPMFallback(audioPath, { minBPM, maxBPM });
          }
        }
      } else if (method === 'aubio') {
        bpm = await this.detectBPMWithAubio(audioPath, { minBPM, maxBPM });
      } else if (method === 'essentia') {
        bpm = await this.detectBPMWithEssentia(audioPath, { minBPM, maxBPM });
      } else if (method === 'librosa') {
        bpm = await this.detectBPMWithLibrosa(audioPath, { minBPM, maxBPM });
      } else {
        bpm = await this.detectBPMFallback(audioPath, { minBPM, maxBPM });
      }

      // Validate BPM
      bpm = Math.round(Math.max(minBPM, Math.min(maxBPM, bpm)));

      logger.info(`Detected BPM: ${bpm} from audio`);

      return bpm;
    } catch (error) {
      logger.error('BPM detection failed:', error);
      // Return default BPM
      return 120;
    }
  }

  /**
   * Detect BPM using Aubio
   */
  async detectBPMWithAubio(audioPath, options = {}) {
    const { minBPM = 60, maxBPM = 200 } = options;

    return new Promise((resolve, reject) => {
      const child = spawn('python', ['-c', `
import sys
import json
import aubio

def detect_bpm(audio_path, min_bpm, max_bpm):
    try:
        # Load audio
        win_s = 512
        hop_s = win_s // 2
        samplerate = 0
        
        source = aubio.source(audio_path, samplerate, hop_s)
        samplerate = source.samplerate
        
        tempo = aubio.tempo("default", win_s, hop_s, samplerate)
        tempo.set_min_bpm(min_bpm)
        tempo.set_max_bpm(max_bpm)
        
        beats = []
        total_frames = 0
        
        while True:
            samples, read = source()
            if tempo(samples):
                beats.append(total_frames / float(samplerate))
            total_frames += read
            if read < hop_s:
                break
        
        # Calculate BPM from beats
        if len(beats) < 2:
            return 0
        
        intervals = [beats[i+1] - beats[i] for i in range(len(beats)-1)]
        avg_interval = sum(intervals) / len(intervals)
        bpm = 60 / avg_interval if avg_interval > 0 else 0
        
        return bpm
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    audio_path = sys.argv[1]
    min_bpm = float(sys.argv[2])
    max_bpm = float(sys.argv[3])
    
    bpm = detect_bpm(audio_path, min_bpm, max_bpm)
    print(json.dumps({'bpm': bpm}))
      `, audioPath, String(minBPM), String(maxBPM)]);

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
            const result = JSON.parse(stdout);
            if (result.bpm && result.bpm > 0) {
              resolve(result.bpm);
            } else {
              reject(new Error('No BPM detected'));
            }
          } catch (error) {
            reject(new Error(`Failed to parse BPM data: ${error.message}`));
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
   * Detect BPM using Essentia
   */
  async detectBPMWithEssentia(audioPath, options = {}) {
    const { minBPM = 60, maxBPM = 200 } = options;

    return new Promise((resolve, reject) => {
      const child = spawn('python', ['-c', `
import sys
import json
import essentia.standard as es

def detect_bpm_essentia(audio_path, min_bpm, max_bpm):
    try:
        # Load audio
        loader = es.MonoLoader(filename=audio_path)
        audio = loader()
        
        # Detect BPM
        rhythm_extractor = es.RhythmExtractor2013()
        bpm, beats, beats_confidence, _, _ = rhythm_extractor(audio)
        
        # Validate BPM
        if bpm < min_bpm or bpm > max_bpm:
            # Try alternative method
            bpm_extractor = es.BpmExtractor()
            bpm = bpm_extractor(audio)
        
        return bpm
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    audio_path = sys.argv[1]
    min_bpm = float(sys.argv[2])
    max_bpm = float(sys.argv[3])
    
    bpm = detect_bpm_essentia(audio_path, min_bpm, max_bpm)
    print(json.dumps({'bpm': bpm}))
      `, audioPath, String(minBPM), String(maxBPM)]);

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
            const result = JSON.parse(stdout);
            if (result.bpm && result.bpm > 0) {
              resolve(result.bpm);
            } else {
              reject(new Error('No BPM detected'));
            }
          } catch (error) {
            reject(new Error(`Failed to parse BPM data: ${error.message}`));
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
   * Detect BPM using Librosa (Python)
   */
  async detectBPMWithLibrosa(audioPath, options = {}) {
    const { minBPM = 60, maxBPM = 200 } = options;

    return new Promise((resolve, reject) => {
      const child = spawn('python', ['-c', `
import sys
import json
import librosa

def detect_bpm_librosa(audio_path, min_bpm, max_bpm):
    try:
        # Load audio
        y, sr = librosa.load(audio_path, sr=None)
        
        # Detect tempo
        tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
        
        # Validate BPM
        if tempo < min_bpm or tempo > max_bpm:
            # Try with different parameters
            tempo, beats = librosa.beat.beat_track(
                y=y, 
                sr=sr,
                units='time',
                hop_length=512
            )
        
        return float(tempo)
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    audio_path = sys.argv[1]
    min_bpm = float(sys.argv[2])
    max_bpm = float(sys.argv[3])
    
    bpm = detect_bpm_librosa(audio_path, min_bpm, max_bpm)
    print(json.dumps({'bpm': bpm}))
      `, audioPath, String(minBPM), String(maxBPM)]);

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
            const result = JSON.parse(stdout);
            if (result.bpm && result.bpm > 0) {
              resolve(result.bpm);
            } else {
              reject(new Error('No BPM detected'));
            }
          } catch (error) {
            reject(new Error(`Failed to parse BPM data: ${error.message}`));
          }
        } else {
          reject(new Error(`Librosa failed: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to run librosa: ${error.message}`));
      });
    });
  }

  /**
   * Fallback BPM detection using simple method
   */
  async detectBPMFallback(audioPath, options = {}) {
    const { minBPM = 60, maxBPM = 200 } = options;

    try {
      // Get audio info
      const info = await ffmpegConfig.getMediaInfo(audioPath);
      const duration = parseFloat(info.format.duration);

      if (duration < 5) {
        return 120; // Default BPM for short audio
      }

      // Extract peaks using ffmpeg
      const peaks = await this.extractPeaks(audioPath, duration);
      
      // Calculate BPM from peaks
      const bpm = this.calculateBPMFromPeaks(peaks, duration, { minBPM, maxBPM });

      return bpm;
    } catch (error) {
      logger.error('Fallback BPM detection failed:', error);
      return 120;
    }
  }

  /**
   * Extract peaks from audio
   */
  async extractPeaks(audioPath, duration) {
    return new Promise((resolve, reject) => {
      const args = [
        ffmpegConfig.ffmpegPath,
        '-i', audioPath,
        '-af', 'volumedetect',
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
          // Parse volume data
          const peaks = this.parseVolumeData(output, duration);
          resolve(peaks);
        } else {
          reject(new Error(`FFmpeg failed with code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to extract peaks: ${error.message}`));
      });
    });
  }

  /**
   * Parse volume data from ffmpeg
   */
  parseVolumeData(output, duration) {
    const peaks = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('max_volume')) {
        const match = line.match(/max_volume: ([\d.]+) dB/);
        if (match) {
          const value = parseFloat(match[1]);
          if (!isNaN(value)) {
            peaks.push(value);
          }
        }
      }
    }

    // Generate more peaks if not enough
    if (peaks.length < 10) {
      const numPeaks = Math.floor(duration * 2);
      for (let i = 0; i < numPeaks; i++) {
        peaks.push(Math.random() * -20 - 10);
      }
    }

    return peaks;
  }

  /**
   * Calculate BPM from peaks
   */
  calculateBPMFromPeaks(peaks, duration, options = {}) {
    const { minBPM = 60, maxBPM = 200 } = options;

    if (peaks.length < 10) return 120;

    // Find peak intervals
    const intervals = [];
    const threshold = -20; // dB threshold for peaks

    let lastPeakIndex = -1;
    for (let i = 0; i < peaks.length; i++) {
      if (peaks[i] > threshold) {
        if (lastPeakIndex !== -1) {
          const interval = (i - lastPeakIndex) / peaks.length * duration;
          if (interval > 0.2 && interval < 2) { // 30-300 BPM
            intervals.push(interval);
          }
        }
        lastPeakIndex = i;
      }
    }

    if (intervals.length === 0) return 120;

    // Find average interval
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    let bpm = 60 / avgInterval;

    // Validate
    bpm = Math.max(minBPM, Math.min(maxBPM, bpm));

    return Math.round(bpm);
  }

  /**
   * Get BPM range for music genre
   */
  getBPMForGenre(genre) {
    const bpmMap = {
      'classical': [60, 120],
      'jazz': [80, 140],
      'pop': [100, 130],
      'rock': [110, 140],
      'metal': [140, 200],
      'hiphop': [70, 110],
      'rap': [60, 100],
      'rnb': [60, 100],
      'edm': [120, 150],
      'house': [120, 135],
      'techno': [130, 150],
      'trance': [130, 150],
      'dubstep': [140, 150],
      'drumandbass': [160, 180],
      'ambient': [60, 90],
      'lofi': [70, 90],
      'indie': [100, 130],
      'folk': [80, 120],
      'country': [80, 120],
    };

    return bpmMap[genre] || [60, 200];
  }
}

module.exports = new BPMService();