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
      } = options;

      // Prepare input props for Remotion
      // Convert filesystem paths to absolute web URLs for Chromium/Remotion
      const serverBaseUrl = `http://localhost:${process.env.PORT || 5000}`;
      const inputProps = {
        images: reel.images.map(img => {
          // Use url property if available, otherwise convert filesystem path to web URL
          let imagePath = img.url || img.path || '';

          // If path is already an absolute URL (starts with http), use as-is
          if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return {
              path: imagePath,
              duration: img.duration || 3,
              animation: img.animation || 'kenBurns',
              transition: img.transition || 'fade',
            };
          }

          // If path is a local filesystem path (starts with drive letter or backslash), convert to web URL
          if (imagePath.match(/^[a-zA-Z]:\\/) || imagePath.startsWith('\\') || imagePath.match(/^[a-zA-Z]:\//)) {
            // Extract the part after 'uploads/' to create a proper web path
            const normalized = imagePath.replace(/\\/g, '/');
            const uploadsIndex = normalized.indexOf('uploads/');
            if (uploadsIndex !== -1) {
              imagePath = '/' + normalized.substring(uploadsIndex);
            } else {
              // Fallback: just use the filename
              imagePath = '/uploads/images/' + normalized.split('/').pop();
            }
          }

          // If path is relative (starts with /), make it absolute with the server URL
          if (imagePath.startsWith('/')) {
            imagePath = `${serverBaseUrl}${imagePath}`;
          }

          return {
            path: imagePath,
            duration: img.duration || 3,
            animation: img.animation || 'kenBurns',
            transition: img.transition || 'fade',
          };
        }),
        config: {
          width,
          height,
          fps,
          backgroundColor: reel.config?.backgroundColor || '#000000',
          transitionDuration: reel.config?.transitionDuration || 0.5,
          effects: reel.config?.effects || [],
        },
        music: reel.music ? {
          path: reel.musicPath,
          volume: reel.musicVolume || 1,
        } : null,
      };

      // Render with Remotion
      const compositionName = remotionConfig.validateCompositionName(
        reel.template?.name || 'Memories'
      );

      const result = await remotionConfig.render(compositionName, {
        inputProps,
        width,
        height,
        fps,
        codec: 'h264',
        audioCodec: 'aac',
        pixelFormat: 'yuv420p',
        concurrency: 1,
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

      // Save final output
      const finalPath = await outputService.saveVideo(processedPath, {
        type: 'render',
        filename: `reel_${Date.now()}.${format}`,
        metadata: {
          reelId: reel._id,
          quality,
          width,
          height,
          fps,
        },
      });

      // Clean up temp files
      await fileService.cleanupTemp();

      // Build web-accessible URLs (relative paths for static serving)
      const outputFilename = path.basename(finalPath.path);
      const previewFilename = path.basename(preview.path);
      const outputUrl = `/output/renders/${outputFilename}`;
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
        outputUrl: outputUrl,
        previewPath: preview.path,
        previewUrl: previewUrl,
        thumbnailPath: preview.path,
        preview: preview,
        url: finalPath.url,
      };
    } catch (error) {
      logger.error('Render failed:', error);
      throw new Error(`Render failed: ${error.message}`);
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