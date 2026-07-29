const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const env = require('./env');
const { DIRECTORIES, VIDEO_CONFIG } = require('./constants');

class RemotionConfig {
  constructor() {
    this.remotionRoot = DIRECTORIES.REMOTION;
    this.remotionSrc = path.join(DIRECTORIES.REMOTION, 'src');
    this.outputDir = DIRECTORIES.RENDERS;
    this.concurrency = env.REMOTION_CONCURRENCY || 1;
    this.timeout = 30 * 60 * 1000;
  }

  // ✅ ADDED: Controller standard validation helper
  validateCompositionName(compositionName) {
    const validCompositions = ['ReelComposition', 'Main', 'Default'];
    if (!compositionName || typeof compositionName !== 'string') {
      return 'ReelComposition'; // Fallback default composition
    }
    return validCompositions.includes(compositionName) ? compositionName : 'ReelComposition';
  }

  async render(compositionId, options = {}) {
    // Composition ID ko pehle validate karke safety ensure karein
    const validatedComposition = this.validateCompositionName(compositionId);

    const {
      inputProps = {},
      outputPath = path.join(this.outputDir, `reel_${Date.now()}.mp4`),
    } = options;

    // Direct temp JSON file create karo render.js ke expected structure ke according
    const tempJsonPath = path.join(DIRECTORIES.TEMP, `render_data_${Date.now()}.json`);
    
    // Ensure directories exist
    if (!fs.existsSync(DIRECTORIES.TEMP)) fs.mkdirSync(DIRECTORIES.TEMP, { recursive: true });
    if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir, { recursive: true });

    const payload = {
      compositionId: validatedComposition,
      images: inputProps.images || [],
      template: inputProps.template || { name: 'Default', slideDuration: 3, effects: ['none'], transitions: ['fade'] },
    };

    fs.writeFileSync(tempJsonPath, JSON.stringify(payload, null, 2));

    logger.info(`Starting Remotion render process... Input: ${tempJsonPath}`);

    return new Promise((resolve, reject) => {
      const { spawn } = require('child_process');
      const child = spawn('node', ['render.js', tempJsonPath, outputPath], {
        cwd: this.remotionRoot,
        timeout: this.timeout,
        stdio: 'pipe',
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
        logger.debug(`Remotion: ${data.toString().trim()}`);
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
        logger.debug(`Remotion stderr: ${data.toString().trim()}`);
      });

      child.on('error', (error) => {
        // Cleanup temp file
        if (fs.existsSync(tempJsonPath)) fs.unlinkSync(tempJsonPath);
        reject(new Error(`Remotion process error: ${error.message}`));
      });

      child.on('close', (code) => {
        // Cleanup temp json
        if (fs.existsSync(tempJsonPath)) fs.unlinkSync(tempJsonPath);

        if (code === 0) {
          resolve({ outputPath, stdout, stderr });
        } else {
          reject(new Error(`Remotion render exited with code ${code}: ${stderr}`));
        }
      });
    });
  }
}

module.exports = new RemotionConfig();