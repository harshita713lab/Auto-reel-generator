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
      const fsSync = require("fs");
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
      let audioUrl = null;
      if (audioPath) {
        const subfolder = audioPath.includes('songs') ? 'songs' : 'music';
        audioUrl = `${serverBaseUrl}/assets/${subfolder}/${path.basename(audioPath)}`;
      }

      const images = reel.images.map(img => {
        let imageWebUrl = img.path;
        if (img.path && !img.path.startsWith('http://') && !img.path.startsWith('https://')) {
          imageWebUrl = `${serverBaseUrl}/uploads/images/${path.basename(img.path)}`;
        }
        return {
          path: imageWebUrl,
          duration: img.duration || 3,
          animation: img.animation || "kenBurns",
          transition: img.transition || "fade"
        };
      });
      console.log("REEL IMAGES");
      console.log(reel.images);
      const inputProps = {
        images,
        music: null, // Set to null to bypass Remotion internal audio compositor & Windows Defender blocks
        beatTimestamps: reel.beatTimestamps || [],
        config: {
          width: 1080,
          height: 1920,
          fps: 30,
          backgroundColor: "#000",
          transitionDuration: 0.5,
          effects: ["vignette", "lightLeak"]
        }
      };
      console.log("INPUT PROPS");
      console.log(JSON.stringify(inputProps, null, 2));

      // Render with Remotion
      const compositionName = remotionConfig.validateCompositionName(
        reel.template?.name || 'Memories'
      );

      // आप चाहें तो यहाँ नाम को Remotion के composition id से मैच करा सकती हैं
      // Decide composition based on image count
      const imageCount = reel.images.length;
let compositionId;

if (imageCount === 20) {
  compositionId = "WeddingSequenceComposition";

} else if (imageCount === 18) {
  compositionId = "MemoryJourneyWeddingReel";

} else if (imageCount === 9) {
  compositionId = "CinematicWeddingReel";

} else if (imageCount === 11) {
  compositionId = "WeddingSplitSlider";
}
   else if (imageCount === 14) {
  compositionId = "RoyalWeddingStory";

} else if (imageCount === 10) {
  compositionId = "WhiteCardCarousel";

} else if (imageCount === 8) {
  compositionId = "WhiteCardMasonry";

} else if (imageCount === 6) {
  compositionId = "WhiteCardPolaroidStack";

} else if (imageCount === 4) {
  compositionId = "PremiumGrid";

} else if (imageCount < 4) {
  compositionId = "ReelComposition";

} else {
  compositionId = "MemoryBlendReel";
}
console.log(
  `Image Count: ${imageCount}, Rendering with Composition ID: ${compositionId}`
);


      const result = await remotionConfig.render(compositionId, {
        inputProps,
      });

      // Use Remotion H.264 rendered output directly (avoids 3+ minutes of redundant re-encoding)
      let processedPath = result.outputPath;

      // Add music/audio to the video via FFmpeg (fast stream copy < 1 second)
      if (audioPath) {
        try {
          const audioFile = fsSync.existsSync(audioPath) ? audioPath : null;
          if (audioFile) {
            const withAudioPath = await ffmpegService.addAudio(processedPath, audioFile, {
              volume: 1,
              startTime: reel.musicStartTime || 0,
              outputPath: path.join(this.tempDir, `with_audio_${Date.now()}.${format}`),
            });
            if (withAudioPath) {
              processedPath = withAudioPath;
              console.log("🎵 Music added to video:", audioFile);
            }
          }
        } catch (audioError) {
          console.error("⚠️ Failed to add music (continuing without audio):", audioError.message);
        }
      }

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

      console.log("Processed Exists :", fsSync.existsSync(processedPath));
      console.log("Final Exists     :", fsSync.existsSync(finalPath.path));
      console.log("Final Path       :", finalPath.path);

      // Clean up temp files safely
      try {
        await fileService.cleanupTemp();
      } catch (cleanupErr) {
        logger.warn("Non-critical temp cleanup warning:", cleanupErr.message);
      }

      // Build web-accessible URLs (relative paths for static serving)
      // FIXED: Videos are served from /output/renders/ and /output/previews/
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
        outputUrl: `/output/renders/${path.basename(finalPath.path)}`,
        previewPath: preview.path,
        previewUrl: `/output/previews/${path.basename(preview.path)}`,
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