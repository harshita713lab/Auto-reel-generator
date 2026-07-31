const fs = require('fs').promises;
const path = require('path');
const logger = require('../../utils/logger');
const remotionConfig = require('../../config/remotion');
const ffmpegService = require('./ffmpegService');
const outputService = require('../storage/outputService');
const previewService = require('./previewService');
const fileService = require('../storage/fileService');
const { DIRECTORIES } = require('../../config/constants');

class RenderService {
  constructor() {
    this.renderDir = DIRECTORIES.RENDERS;
    this.tempDir = DIRECTORIES.TEMP;
  }

  /**
   * Render reel using Remotion
   * @param {object} reel - Reel object
   * @param {object} options - Render options
   * @returns {Promise<object>}
   */
  async renderReel(reel, options = {}) {
    try {
const {
  quality = 'high',
  format = 'mp4',
  width = 1080,
  height = 1920,
  fps = 30,
  onProgress = null,
  audioPath = null,
} = options;

      // Prepare input props for Remotion
      // Convert filesystem paths to absolute web URLs for Chromium/Remotion
      const serverBaseUrl = `http://localhost:${process.env.PORT || 5000}`;
const audioUrl = audioPath
  ? `${serverBaseUrl}/assets/music/${path.basename(audioPath)}`
  : null;

const images = reel.images.map(img => ({
  path: `${serverBaseUrl}/uploads/images/${path.basename(img.path)}`,
  duration: img.duration || 3,
  animation: img.animation || "kenBurns",
  transition: img.transition || "fade"
}));
console.log("REEL IMAGES");
console.log(reel.images);
const inputProps = {

  images,

  music: audioUrl
    ? {
        path: audioUrl,
        volume: 1,
      }
    : null,

  config: {
    width: 1080,
    height: 1920,
    fps: 30,
    backgroundColor:"#000",
    transitionDuration:0.5,
    effects:["vignette","lightLeak"]
  }
};
console.log("INPUT PROPS");
console.log(JSON.stringify(inputProps, null, 2));

      // Render with Remotion
      const compositionName = remotionConfig.validateCompositionName(
        reel.template?.name || 'Memories'
      );

      const result = await remotionConfig.render("ReelComposition", {
        inputProps,
    
      });

      // Post-process with FFmpeg
      const processedPath = await this.postProcess(result.outputPath, {
        quality,
        format,
        width,
        height,
        fps,
      });

      // Get file info
      const stats = await fs.stat(processedPath);
      const duration = await this.getVideoDuration(processedPath);

      // Generate preview
      const preview = await previewService.generatePreview(processedPath, {
        duration: 15,
        quality: 'low',
      });

  const finalPath = await outputService.saveVideo(processedPath, {
  type: "render",
  filename: `reel_${Date.now()}.${format}`,
  metadata: {
    reelId: reel._id,
    quality,
    width,
    height,
    fps,
  },
});

const fsSync = require("fs");

console.log("Processed Exists :", fsSync.existsSync(processedPath));
console.log("Final Exists     :", fsSync.existsSync(finalPath.path));
console.log("Final Path       :", finalPath.path);

      // Clean up temp files
      await fileService.cleanupTemp();

      // Build web-accessible URLs (relative paths for static serving)
      const outputFilename = path.basename(finalPath.path);
      const previewFilename = path.basename(preview.path);
      const outputUrl = `/renders/${path.basename(finalPath.path)}`
      const previewUrl = `/output/previews/${previewFilename}`;

      return {
        path: finalPath.path,
        filename: finalPath.filename,
        size: stats.size,
        duration,
        width,
        height,
        fps,
        quality,
        format,
        outputPath: finalPath.path,
        outputUrl:`/renders/${path.basename(finalPath.path)}` ,
        previewPath: preview.path,
        previewUrl:  `/previews/${path.basename(preview.path)}`
,
        thumbnailPath: preview.path,
        preview: preview,
        url: finalPath.url,
      };
    } catch (error) {
  console.error("========== RENDER SERVICE ERROR ==========");
  console.error(error);
  console.error(error.stack);
  console.error("==========================================");

  throw error;
}
  }

/**
   * Post-process rendered video
   * @param {string} inputPath - Input video path
   * @param {object} options - Options
   * @returns {Promise<string>}
   */
  async postProcess(inputPath, options = {}) {
    try {
      const {
        quality = 'high',
        format = 'mp4',
        width = 1080,
        height = 1920,
        fps = 30,
      } = options;

      const outputPath = path.join(this.tempDir, `processed_${Date.now()}.${format}`);

      // Determine encoding settings based on quality
      const crf = quality === 'high' ? 18 : quality === 'medium' ? 23 : 28;
      const bitrate = quality === 'high' ? '8M' : quality === 'medium' ? '4M' : '2M';
      const preset = quality === 'high' ? 'medium' : 'fast';

      const args = [
        '-i', inputPath,
        '-c:v', 'libx264',
        '-preset', preset,
        '-crf', String(crf),
        '-b:v', bitrate,
        '-vf', `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,fps=${fps}`,
        '-c:a', 'aac',
        '-b:a', '192k',
        '-pix_fmt', 'yuv420p',
        '-y', outputPath,
      ];

      await ffmpegService.execute(args);
      return outputPath;
    } catch (error) {
      throw new Error(`Post-processing failed: ${error.message}`);
    }
  }

  /**
   * Get video duration
   * @param {string} videoPath - Video path
   * @returns {Promise<number>}
   */
  async getVideoDuration(videoPath) {
    try {
      const info = await ffmpegService.getVideoInfo(videoPath);
      return info.duration;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Clean up reel files
   * @param {object} reel - Reel object
   * @returns {Promise<void>}
   */
  async cleanupReel(reel) {
    try {
      // Delete rendered files
      if (reel.outputPath) {
        await fileService.deleteFile(reel.outputPath);
      }
      if (reel.previewPath) {
        await fileService.deleteFile(reel.previewPath);
      }
      if (reel.thumbnailPath) {
        await fileService.deleteFile(reel.thumbnailPath);
      }
    } catch (error) {
      logger.error('Failed to cleanup reel:', error);
    }
  }

  /**
   * Check render status
   * @param {string} jobId - Render job ID
   * @returns {Promise<object>}
   */
  async getRenderStatus(jobId) {
    // This would be implemented with a queue system
    // For now, return a simple status
    return {
      jobId,
      status: 'processing',
      progress: 50,
    };
  }

  /**
   * Cancel render
   * @param {string} jobId - Render job ID
   * @returns {Promise<boolean>}
   */
  async cancelRender(jobId) {
    // This would be implemented with a queue system
    return true;
  }
}

module.exports = new RenderService();