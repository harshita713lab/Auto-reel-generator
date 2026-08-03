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
    this.timeout = 300 * 1000; // 5 minutes
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
    inputProps,
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

child.stdout.on('data', (data) => {
  const msg = data.toString();

  stdout += msg;

  console.log("🎬 REMOTION STDOUT:", msg);
});

      child.on('error', (error) => {
        if (fs.existsSync(tempJsonPath)) fs.unlinkSync(tempJsonPath);
        reject(new Error(`Remotion process error: ${error.message}`));
      });

      child.on('close', (code) => {
       // if (fs.existsSync(tempJsonPath)) fs.unlinkSync(tempJsonPath);

        if (code === 0) {
          resolve({ outputPath, stdout, stderr });
        } else {
          // Remotion's console.error() goes to stderr, console.log() goes to stdout
          // Combine both to get the full picture of what happened
          const errorDetail = (stderr || stdout || 'Unknown error (no output)').trim();
          // Truncate very long errors to avoid huge error messages
          const truncatedError = errorDetail.length > 2000 
            ? errorDetail.substring(0, 2000) + '...(truncated)' 
            : errorDetail;
          logger.error(`Remotion render failed (code ${code}): ${truncatedError}`);
          reject(new Error(`Remotion render exited with code ${code}: ${truncatedError}`));
        }
      });
    });
  }
}

module.exports = new RemotionConfig();