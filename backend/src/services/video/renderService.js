
const fs = require("fs").promises;
const path = require("path");
const logger = require("../../utils/logger");
const remotionConfig = require("../../config/remotion");
const ffmpegService = require("./ffmpegService");
const outputService = require("../storage/outputService");
const previewService = require("./previewService");
const fileService = require("../storage/fileService");
const { DIRECTORIES } = require("../../config/constants");

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
      const sharp = require("sharp");

      const {
        quality = "high",
        format = "mp4",
        width = 1080,
        height = 1920,
        fps = 30,
        onProgress = null,
        audioPath = null,
      } = options;

      // =====================================================
      // SERVER URL
      // =====================================================

      const serverBaseUrl = `http://localhost:${process.env.PORT || 5000}`;

      // =====================================================
      // PREPARE IMAGES
      // =====================================================

      const images = await Promise.all(
        reel.images.map(async (img) => {
          let imageWebUrl = img.path;

          if (
            img.path &&
            !img.path.startsWith("http://") &&
            !img.path.startsWith("https://") &&
            !img.path.startsWith("data:")
          ) {
            // =================================================
            // LOCAL FILE EXISTS
            // =================================================

            if (fsSync.existsSync(img.path)) {
              try {
                /*
                 * contain = complete image visible
                 * cover = image crop
                 */

                const resizedBuf = await sharp(img.path)
                  .resize(1080, 1920, {
                    fit: "contain",
                    background: {
                      r: 0,
                      g: 0,
                      b: 0,
                      alpha: 1,
                    },
                  })
                  .jpeg({
                    quality: 90,
                  })
                  .toBuffer();

                imageWebUrl =
                  `data:image/jpeg;base64,${resizedBuf.toString("base64")}`;
              } catch (sharpErr) {
                console.error(
                  "Sharp image processing failed:",
                  sharpErr.message
                );

                const fileBuf = fsSync.readFileSync(img.path);

                imageWebUrl =
                  `data:image/jpeg;base64,${fileBuf.toString("base64")}`;
              }
            } else {
              // =================================================
              // FILE DOES NOT EXIST
              // =================================================

              imageWebUrl =
                `${serverBaseUrl}/uploads/images/${path.basename(img.path)}`;
            }
          }

          return {
            path: imageWebUrl,

            duration:
              typeof img.duration === "number"
                ? img.duration
                : 3,

            animation:
              img.animation || "kenBurns",

            transition:
              img.transition || "fade",
          };
        })
      );

      // =====================================================
      // DEBUG IMAGES
      // =====================================================

      console.log("========================================");
      console.log("REEL IMAGES");
      console.log("Image Count:", images.length);
      console.log("========================================");

      // =====================================================
      // INPUT PROPS
      // =====================================================

      const inputProps = {
        images,

        // Audio is added later using FFmpeg
        music: null,

        beatTimestamps:
          reel.beatTimestamps || [],

        config: {
          width: 1080,
          height: 1920,
          fps: 30,

          backgroundColor: "#000",

          transitionDuration: 0.5,

          effects: [
            "vignette",
            "lightLeak",
          ],
        },
      };

      console.log("========================================");
      console.log("INPUT PROPS");
      console.log("========================================");

      console.log(
        JSON.stringify(
          {
            imageCount: images.length,
            music: null,
            beatTimestamps: inputProps.beatTimestamps,
          },
          null,
          2
        )
      );

      // =====================================================
      // COMPOSITION SELECTION
      // =====================================================

      const imageCount = reel.images.length;

      let compositionId;

      /*
       * Explicit compositionId gets first priority.
       */

      if (reel.compositionId) {
        compositionId = reel.compositionId;
      } else {
        switch (imageCount) {
          // =================================================
          // 23 IMAGES
          // =================================================

          case 23:
            compositionId = "MemoryBlendReel";
            break;

          // =================================================
          // 20 IMAGES
          // =================================================

          case 20:
            compositionId = "WeddingSequenceComposition";
            break;

          // =================================================
          // 18 IMAGES
          // =================================================

          case 18:
            compositionId = "Template26";
            break;

          // =================================================
          // 16 IMAGES
          // =================================================

          //case 16:
            //compositionId = //"RoyalWeddingStory";
            //break;
 case 16:
            compositionId = "WeddingTemplate14";
            break;
          // =================================================
          // 15 IMAGES
          // =================================================

          case 15:
            compositionId = "ScrapbookWedding15";
            break;

          // =================================================
          // 13 IMAGES
          // =================================================

          case 13:
            compositionId = "WeddingCinematic13";
            break;

          // =================================================
          // 11 IMAGES
          // =================================================

          case 11:
            compositionId = "WeddingSplitSlider";
            break;

          // =================================================
          // 10 IMAGES
          // =================================================

          case 10:
            compositionId = "WhiteCardCarousel";
            break;

          // =================================================
          // 9 IMAGES
          // =================================================

          case 9:
            compositionId = "Reel";
            break;

          // =================================================
          // 8 IMAGES
          // =================================================

          case 8:
            compositionId = "WhiteCardMasonry";
            break;

          // =================================================
          // 6 IMAGES
          // =================================================

          case 6:
            compositionId = "WhiteCardPolaroidStack";
            break;

          // =================================================
          // 4 IMAGES
          // =================================================

          case 4:
            compositionId = "PremiumGrid";
            break;

          // =================================================
          // 1-3 IMAGES
          // =================================================

          case 1:
          case 2:
          case 3:
            compositionId = "ReelComposition";
            break;

          // =================================================
          // DEFAULT
          // =================================================

          default:
            compositionId = "MemoryBlendReel";
            break;
        }
      }

      console.log("========================================");
      console.log("COMPOSITION SELECTION");
      console.log("Image Count:", imageCount);
      console.log("Composition ID:", compositionId);
      console.log("========================================");

      // =====================================================
      // RENDER WITH REMOTION
      // =====================================================

      const result = await remotionConfig.render(
        compositionId,
        {
          inputProps,
        }
      );

      if (!result || !result.outputPath) {
        throw new Error(
          `Remotion render failed: No output path returned for ${compositionId}`
        );
      }

      let processedPath = result.outputPath;

      console.log(
        "🎬 Remotion render completed:",
        processedPath
      );

      // =====================================================
      // ADD AUDIO USING FFMPEG
      // =====================================================

      if (audioPath) {
        try {
          const audioFile =
            fsSync.existsSync(audioPath)
              ? audioPath
              : null;

          if (audioFile) {
            const withAudioPath =
              await ffmpegService.addAudio(
                processedPath,
                audioFile,
                {
                  volume: 1,

                  startTime:
                    reel.musicStartTime || 0,

                  outputPath:
                    path.join(
                      this.tempDir,
                      `with_audio_${Date.now()}.${format}`
                    ),
                }
              );

            if (withAudioPath) {
              processedPath = withAudioPath;

              console.log(
                "🎵 Music added:",
                audioFile
              );
            }
          } else {
            console.warn(
              "⚠️ Audio file does not exist:",
              audioPath
            );
          }
        } catch (audioError) {
          console.error(
            "⚠️ Failed to add music:",
            audioError.message
          );

          // Continue without audio
        }
      }

      // =====================================================
      // CHECK RENDERED FILE
      // =====================================================

      if (!fsSync.existsSync(processedPath)) {
        throw new Error(
          `Rendered video does not exist: ${processedPath}`
        );
      }

      // =====================================================
      // FILE INFO
      // =====================================================

      const stats =
        await fs.stat(processedPath);

      const duration =
        await this.getVideoDuration(processedPath);

      console.log(
        "🎞️ Video duration:",
        duration
      );

      // =====================================================
      // GENERATE PREVIEW
      // =====================================================

      const preview =
        await previewService.generatePreview(
          processedPath,
          {
            duration: 15,
            quality: "low",
          }
        );

      // =====================================================
      // SAVE FINAL VIDEO
      // =====================================================

      const finalPath =
        await outputService.saveVideo(
          processedPath,
          {
            type: "render",

            filename:
              `reel_${Date.now()}.${format}`,

            metadata: {
              reelId: reel._id,

              quality,

              width,

              height,

              fps,

              compositionId,

              imageCount,
            },
          }
        );

      // =====================================================
      // DEBUG FINAL FILE
      // =====================================================

      console.log("========================================");
      console.log("FINAL VIDEO");
      console.log("========================================");

      console.log(
        "Processed Exists:",
        fsSync.existsSync(processedPath)
      );

      console.log(
        "Final Exists:",
        fsSync.existsSync(finalPath.path)
      );

      console.log(
        "Final Path:",
        finalPath.path
      );

      // =====================================================
      // CLEAN TEMP FILES
      // =====================================================

      try {
        await fileService.cleanupTemp();
      } catch (cleanupErr) {
        logger.warn(
          "Non-critical temp cleanup warning:",
          cleanupErr.message
        );
      }

      // =====================================================
      // URLS
      // =====================================================

      const outputFilename =
        path.basename(finalPath.path);

      const previewFilename =
        path.basename(preview.path);

      const outputUrl =
        `/output/renders/${outputFilename}`;

      const previewUrl =
        `/output/previews/${previewFilename}`;

      // =====================================================
      // RETURN
      // =====================================================

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

        compositionId,

        imageCount,

        outputPath: finalPath.path,

        outputUrl,

        previewPath: preview.path,

        previewUrl,

        thumbnailPath: preview.path,

        preview,

        url: finalPath.url,
      };
    } catch (error) {
      console.error(
        "========== RENDER SERVICE ERROR =========="
      );

      console.error(error);

      console.error(error.stack);

      console.error(
        "=========================================="
      );

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
        quality = "high",
        format = "mp4",
        width = 1080,
        height = 1920,
        fps = 30,
      } = options;

      const outputPath =
        path.join(
          this.tempDir,
          `processed_${Date.now()}.${format}`
        );

      const crf =
        quality === "high"
          ? 18
          : quality === "medium"
            ? 23
            : 28;

      const bitrate =
        quality === "high"
          ? "8M"
          : quality === "medium"
            ? "4M"
            : "2M";

      const preset =
        quality === "high"
          ? "medium"
          : "fast";

      const args = [
        "-i",
        inputPath,

        "-c:v",
        "libx264",

        "-preset",
        preset,

        "-crf",
        String(crf),

        "-b:v",
        bitrate,

        "-vf",
        `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,fps=${fps}`,

        "-c:a",
        "aac",

        "-b:a",
        "192k",

        "-pix_fmt",
        "yuv420p",

        "-y",
        outputPath,
      ];

      await ffmpegService.execute(args);

      return outputPath;
    } catch (error) {
      throw new Error(
        `Post-processing failed: ${error.message}`
      );
    }
  }

  /**
   * Get video duration
   * @param {string} videoPath - Video path
   * @returns {Promise<number>}
   */
  async getVideoDuration(videoPath) {
    try {
      const info =
        await ffmpegService.getVideoInfo(videoPath);

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
      if (reel.outputPath) {
        await fileService.deleteFile(
          reel.outputPath
        );
      }

      if (reel.previewPath) {
        await fileService.deleteFile(
          reel.previewPath
        );
      }

      if (reel.thumbnailPath) {
        await fileService.deleteFile(
          reel.thumbnailPath
        );
      }
    } catch (error) {
      logger.error(
        "Failed to cleanup reel:",
        error
      );
    }
  }

  /**
   * Check render status
   * @param {string} jobId - Render job ID
   * @returns {Promise<object>}
   */
  async getRenderStatus(jobId) {
    return {
      jobId,
      status: "processing",
      progress: 50,
    };
  }

  /**
   * Cancel render
   * @param {string} jobId - Render job ID
   * @returns {Promise<boolean>}
   */
  async cancelRender(jobId) {
    return true;
  }
}

module.exports = new RenderService();

