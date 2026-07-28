const path = require('path');
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

  getRenderCommand(compositionId, options = {}) {
    const {
      inputProps = {},
      outputPath = path.join(this.outputDir, `render_${Date.now()}.mp4`),
      width = VIDEO_CONFIG.WIDTH,
      height = VIDEO_CONFIG.HEIGHT,
      fps = VIDEO_CONFIG.FPS,
      codec = 'h264',
      audioCodec = 'aac',
      pixelFormat = 'yuv420p',
      concurrency = this.concurrency,
    } = options;

    const props = { ...inputProps, width, height, fps };

    return {
      command: 'node',
      args: [
        path.join(this.remotionRoot, 'render.js'),
        '--composition', compositionId,
        '--output', outputPath,
        '--width', String(width),
        '--height', String(height),
        '--fps', String(fps),
        '--codec', codec,
        '--audio-codec', audioCodec,
        '--pixel-format', pixelFormat,
        '--concurrency', String(concurrency),
        '--props', JSON.stringify(props),
      ],
      outputPath,
    };
  }

  async render(compositionId, options = {}) {
    const { command, args, outputPath } = this.getRenderCommand(compositionId, options);
    
    logger.info(`Starting Remotion render for composition: ${compositionId}`);
    
    return new Promise((resolve, reject) => {
      const child = require('child_process').spawn(command, args, {
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
        reject(new Error(`Remotion process error: ${error.message}`));
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ outputPath, stdout, stderr });
        } else {
          reject(new Error(`Remotion exited with code ${code}: ${stderr}`));
        }
      });
    });
  }

  getCompositionPath(compositionName) {
    return path.join(this.remotionSrc, 'compositions', compositionName, 'index.tsx');
  }

  validateCompositionName(name) {
    const validNames = ['Wedding', 'Birthday', 'Travel', 'Fashion', 'LoveStory', 'Memories'];
    return validNames.includes(name) ? name : 'Memories';
  }
}

module.exports = new RemotionConfig();