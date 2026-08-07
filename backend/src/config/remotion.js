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
    this.timeout = 600 * 1000; // 10 minutes timeout for 11+ image reels
  }
validateCompositionName(compositionName) {
    const validCompositions = [
        "ReelComposition",
        "MemoryBlendReel",
         "WhiteCardGrid3x3",
         "WhiteCardCarousel",
         "WhiteCardPolaroidStack",
         "WhiteCardMasonry",
         "PremiumGrid",
          "WeddingSequenceComposition",
          "WeddingSplitSlider",
          "CinematicWeddingReel",
          "MemoryJourneyWeddingReel",
           "RoyalWeddingStory",
    ];

    if (!compositionName || typeof compositionName !== "string") {
        return "ReelComposition";
    }

    return validCompositions.includes(compositionName)
        ? compositionName
        : "ReelComposition";
}


  async render(compositionId, options = {}) {
    const validatedComposition = this.validateCompositionName(compositionId);

    const {
      inputProps = {},
      outputPath = path.join(this.outputDir, `reel_${Date.now()}.mp4`),
    } = options;

    const tempJsonPath = path.join(DIRECTORIES.TEMP, `render_data_${Date.now()}.json`);
    
    if (!fs.existsSync(DIRECTORIES.TEMP)) fs.mkdirSync(DIRECTORIES.TEMP, { recursive: true });
    if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir, { recursive: true });

    const payload = {
      compositionId: validatedComposition,
      inputProps: {
        ...(inputProps || {}),
        music: null, // Set music to null to bypass Remotion internal audio compositor (prevents Windows Defender exit code 3236495362)
      },
    };
    fs.writeFileSync(tempJsonPath, JSON.stringify(payload, null, 2));

    logger.info(`Starting Remotion render process... Input: ${tempJsonPath}`);

    try {
      const { execSync } = require('child_process');
      const targetFFmpeg = path.join(this.remotionRoot, 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
      if (fs.existsSync(path.dirname(targetFFmpeg))) {
        const targetStats = fs.existsSync(targetFFmpeg) ? fs.statSync(targetFFmpeg) : null;
        if (!targetStats || targetStats.size < 5 * 1024 * 1024) {
          const systemFFmpeg = execSync('where ffmpeg', { encoding: 'utf8' }).trim().split(/[\r\n]+/)[0];
          if (systemFFmpeg && fs.existsSync(systemFFmpeg)) {
            logger.info(`Replacing broken Remotion ffmpeg.exe (${targetStats ? targetStats.size : 0} bytes) with system FFmpeg (${systemFFmpeg})...`);
            fs.copyFileSync(systemFFmpeg, targetFFmpeg);
            logger.info(`✅ Remotion ffmpeg.exe binary updated successfully!`);
          }
        }
      }
    } catch (fixErr) {
      logger.warn(`FFmpeg auto-replace check note: ${fixErr.message}`);
    }

    return new Promise((resolve, reject) => {
      const { spawn } = require('child_process');
      const child = spawn('node', ['render.js', tempJsonPath, outputPath], {
        cwd: this.remotionRoot,
        timeout: this.timeout,
        stdio: 'pipe',
        windowsHide: true,
      });

      let stdout = '';
      let stderr = '';
      let settled = false;

      const cleanup = () => {
        try {
          if (fs.existsSync(tempJsonPath)) fs.unlinkSync(tempJsonPath);
        } catch (e) {
          // ignore clean-up errors
        }
      };

      const killProcessTree = () => {
        try {
          if (process.platform === 'win32') {
            spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' });
          } else {
            child.kill('SIGKILL');
          }
        } catch (e) {
          // ignore kill errors
        }
      };

      const settle = (fn, arg) => {
        if (settled) return;
        settled = true;
        clearTimeout(watchdog);
        cleanup();
        fn(arg);
      };

      // 🛡️ Hard watchdog: prevents reels getting stuck in 'rendering' forever
      const watchdog = setTimeout(() => {
        logger.error(`Remotion render timed out after ${this.timeout}ms, killing process ${child.pid}`);
        killProcessTree();
        settle(reject, new Error(`Remotion render timed out after ${this.timeout / 1000}s`));
      }, this.timeout + 15000);

      child.stdout.on('data', (data) => {
        const msg = data.toString();
        stdout += msg;
        logger.debug(`Remotion: ${msg.trim()}`);
        console.log('🎬 REMOTION STDOUT:', msg);
      });

      child.stderr.on('data', (data) => {
        const msg = data.toString();
        stderr += msg;
        if (msg.trim()) logger.debug(`Remotion stderr: ${msg.trim()}`);
      });

      child.on('error', (error) => {
        settle(reject, new Error(`Remotion process error: ${error.message}`));
      });

      // ⭐ FIX: Use 'exit' instead of relying only on 'close'.
      // 'close' waits for ALL stdio streams to close. On Windows,
      // Chromium sub-processes inherit these pipe handles, so 'close'
      // may never fire even after node render.js has finished — leaving
      // reels stuck in 'rendering' status forever.
      child.on('exit', (code) => {
        if (code === 0) {
          settle(resolve, { outputPath, stdout, stderr });
        } else {
          const errorDetail = (stderr || stdout || 'Unknown error (no output)').trim();
          const truncatedError = errorDetail.length > 2000 
            ? errorDetail.substring(0, 2000) + '...(truncated)' 
            : errorDetail;
          logger.error(`Remotion render failed (code ${code}): ${truncatedError}`);
          settle(reject, new Error(`Remotion render exited with code ${code}: ${truncatedError}`));
        }
      });

      // Safety net: settle on 'close' too in case 'exit' wasn't fired.
      child.on('close', (code) => {
        if (settled) return;
        if (code === 0) {
          settle(resolve, { outputPath, stdout, stderr });
        } else {
          const errorDetail = (stderr || stdout || 'Unknown error (no output)').trim();
          const truncatedError = errorDetail.length > 2000 
            ? errorDetail.substring(0, 2000) + '...(truncated)' 
            : errorDetail;
          settle(reject, new Error(`Remotion render exited with code ${code}: ${truncatedError}`));
        }
      });
    });
  }
}

module.exports = new RemotionConfig();