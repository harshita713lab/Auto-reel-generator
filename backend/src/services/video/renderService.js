const fs = require("fs").promises;
const path = require("path");

const logger = require("../../utils/logger");
const remotionConfig = require("../../config/remotion");
const ffmpegService = require("./ffmpegService");
const outputService = require("../storage/outputService");
const previewService = require("./previewService");
const fileService = require("../storage/fileService");
const { DIRECTORIES } = require("../../config/constants");
const Template = require("../../models/Template");

class RenderService {
  constructor() {
    this.renderDir = DIRECTORIES.RENDERS;
    this.tempDir = DIRECTORIES.TEMP;

    // Same image count ke liye template rotation
    this.lastUsedIndexMap = new Map();
  }

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

      const serverBaseUrl = `http://localhost:${process.env.PORT || 5000}`;

      // ============================================================
      // MEDIA LIST
      // ============================================================

      const mediaList =
        reel.media && reel.media.length > 0
          ? reel.media
          : reel.images || [];

      console.log("==========================================");
      console.log("🎬 RENDER REEL STARTED");
      console.log("📦 MEDIA COUNT:", mediaList.length);
      console.log("📦 REEL TEMPLATE ID:", reel.templateId);
      console.log("==========================================");

      // ============================================================
      // MEDIA PROCESSING
      // Images + Video Clips
      // ============================================================

      const images = await Promise.all(
        mediaList.map(async (img) => {
          let imageWebUrl =
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSop";

          const isVideo =
            img.type === "video" ||
            (img.path &&
              /\.(mp4|mov|webm|avi|mkv)$/i.test(img.path));

          if (img.path && typeof img.path === "string") {
            // --------------------------------------------------------
            // Already URL / DATA URL
            // --------------------------------------------------------

            if (
              img.path.startsWith("http://") ||
              img.path.startsWith("https://") ||
              img.path.startsWith("data:")
            ) {
              imageWebUrl = img.path;
            }

            // --------------------------------------------------------
            // Local file
            // --------------------------------------------------------

            else {
              if (fsSync.existsSync(img.path)) {
                // ----------------------------------------------------
                // VIDEO
                // ----------------------------------------------------

                if (isVideo) {
                  imageWebUrl =
                    `${serverBaseUrl}/uploads/videos/${path.basename(
                      img.path
                    )}`;

                  const videoPath = path.join(
                    __dirname,
                    "../../../uploads/videos",
                    path.basename(img.path)
                  );

                  if (!fsSync.existsSync(videoPath)) {
                    imageWebUrl =
                      `${serverBaseUrl}/uploads/temp/${path.basename(
                        img.path
                      )}`;
                  }
                }

                // ----------------------------------------------------
                // IMAGE
                // ----------------------------------------------------

                else {
                  try {
                    const resizedBuf = await sharp(img.path)
                      .resize(1080, 1920, {
                        fit: "cover",
                        position: "center",
                      })
                      .jpeg({
                        quality: 80,
                      })
                      .toBuffer();

                    imageWebUrl =
                      `data:image/jpeg;base64,${resizedBuf.toString(
                        "base64"
                      )}`;
                  } catch (sharpErr) {
                    console.warn(
                      "⚠️ Sharp processing failed:",
                      sharpErr.message
                    );

                    const fileBuf =
                      fsSync.readFileSync(img.path);

                    imageWebUrl =
                      `data:image/jpeg;base64,${fileBuf.toString(
                        "base64"
                      )}`;
                  }
                }
              }

              // ------------------------------------------------------
              // File does not exist locally
              // ------------------------------------------------------

              else {
                const subFolder = isVideo
                  ? "videos"
                  : "images";

                imageWebUrl =
                  `${serverBaseUrl}/uploads/${subFolder}/${path.basename(
                    img.path
                  )}`;
              }
            }
          }

          return {
            type: isVideo ? "video" : "image",
            path: imageWebUrl,

            duration: img.duration || 3,

            startOffset: img.startOffset || 0,

            muted:
              img.muted !== undefined
                ? img.muted
                : true,

            animation:
              img.animation || "kenBurns",

            transition:
              img.transition || "fade",
          };
        })
      );

      // ============================================================
      // DEBUG MEDIA
      // ============================================================

      console.log("==========================================");
      console.log("🎞️ REEL MEDIA LIST");
      console.log("==========================================");

      images.forEach((item, index) => {
        console.log(
          `${index + 1}. ${item.type} | duration=${item.duration} | startOffset=${item.startOffset}`
        );
      });

      console.log("==========================================");

      // ============================================================
      // INPUT PROPS
      // ============================================================

      const inputProps = {
        images,
        media: images,

        // Remotion ke andar music nahi
        // FFmpeg baad mein music add karega
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

      console.log("==========================================");
      console.log("📦 INPUT PROPS READY");
      console.log("==========================================");

      // ============================================================
      // TEMPLATE MAP
      // ============================================================

const COMPOSITION_MAP = {
  1: ["Template38"],

  3: [
    "VideoTemplate1",
    "VideoTemplate3",
    "Template21",
  ],

  4: [
    "Template15",
    "Template33",
    "Template13",
  ],

  5: [
    "VideoTemplate2",
    "Template5",
  ],

  7: [
    "Template19",
  ],

  8: [
    "Template7",
    "Template30",
    "Template31",
  ],

  9: [
    "Template27",
    "Template26",
    "Template29",
  ],

  11: [
    "Template14",
    "Template3",
  ],

  12: [
    "Template6",
    "Template17",
  ],

  13: [
    "Template16",
    "Template2",
  ],

  14: [
    "Template24",
    "Template23",
    "Template20",
    "Template1",
  ],

  15: [
    "Template9",
  ],

  16: [
    "Template10",
  ],

  17: [
    "Template8",
    "Template18",
  ],

  18: [
    "Template11",
    "Template37",
  ],

  19: [
    "Template34",
  ],

  20: [
    "Template50",
  ],

  23: [
    "Template12",
  ],

  24: [
    "Template25",
    "Template36",
  ],

  25: [
    "Template32",
    "Template35",
  ],
};

   

      // ============================================================
      // ACTUAL MEDIA COUNT
      // ============================================================

      const imageCount = mediaList.length;

      console.log("==========================================");
      console.log("========== AUTO TEMPLATE SELECTION =======");
      console.log("📸 ACTUAL MEDIA COUNT:", imageCount);
      console.log(
        "📦 reel.templateId:",
        reel.templateId
      );
      console.log("==========================================");

      // ============================================================
      // DATABASE TEMPLATE SEARCH
      // ============================================================

      let matchedTemplates = [];

      try {
        matchedTemplates = await Template.find({
          isActive: true,

          "config.minImages": {
            $lte: imageCount,
          },

          "config.maxImages": {
            $gte: imageCount,
          },
        }).sort({
          priority: 1,
        });
      } catch (dbErr) {
        logger.warn(
          "DB template query warning:",
          dbErr.message
        );
      }

      // ============================================================
      // SELECT DB TEMPLATE
      // ============================================================

      let matchedTemplate = null;

      if (
        matchedTemplates &&
        matchedTemplates.length > 0
      ) {
        const lastIdx =
          this.lastUsedIndexMap.has(imageCount)
            ? this.lastUsedIndexMap.get(imageCount)
            : -1;

        const nextIdx =
          (lastIdx + 1) %
          matchedTemplates.length;

        this.lastUsedIndexMap.set(
          imageCount,
          nextIdx
        );

        matchedTemplate =
          matchedTemplates[nextIdx];
      }

      // ============================================================
      // FINAL COMPOSITION SELECTION
      // ============================================================

      let compositionId = null;

      // ============================================================
      // IMPORTANT:
      //
      // 3 MEDIA -> VideoTemplate1
      // 5 MEDIA -> VideoTemplate2
      //
      // These are FORCED and cannot be overwritten by
      // reel.templateId or DB template.
      // ============================================================

      if (imageCount === 5) {
        compositionId = "VideoTemplate1";

        console.log(
          "🎬 3 MEDIA → FORCED TEMPLATE:",
          compositionId
        );
      }

      else if (imageCount === 4) {
        compositionId = "VideoTemplate2";

        console.log(
          "🎬 5 MEDIA → FORCED TEMPLATE:",
          compositionId
        );
      }

      // ============================================================
      // EXPLICIT VIDEO TEMPLATE
      // Only used for counts other than 3 and 5
      // ============================================================

      else if (
        reel.templateId &&
        String(reel.templateId).startsWith(
          "VideoTemplate"
        )
      ) {
        compositionId =
          String(reel.templateId);

        console.log(
          "🎬 DIRECT VIDEO TEMPLATE:",
          compositionId
        );
      }

      // ============================================================
      // DATABASE TEMPLATE
      // ============================================================

      else if (
        matchedTemplate &&
        matchedTemplate.compositionId
      ) {
        compositionId =
          matchedTemplate.compositionId;

        console.log(
          `✅ SELECTED FROM DB: ${matchedTemplate.name}`
        );

        console.log(
          `🎯 DB COMPOSITION: ${compositionId}`
        );

        console.log(
          `⭐ PRIORITY: ${matchedTemplate.priority}`
        );
      }

      // ============================================================
      // COMPOSITION MAP
      // ============================================================

      else {
        const availableComps =
          COMPOSITION_MAP[imageCount];

        if (
          availableComps &&
          availableComps.length > 0
        ) {
          const lastIdx =
            this.lastUsedIndexMap.has(
              imageCount
            )
              ? this.lastUsedIndexMap.get(
                  imageCount
                )
              : -1;

          const nextIdx =
            (lastIdx + 1) %
            availableComps.length;

          this.lastUsedIndexMap.set(
            imageCount,
            nextIdx
          );

          compositionId =
            availableComps[nextIdx];

          console.log(
            `🔄 SELECTED FROM COMPOSITION MAP: ${compositionId}`
          );

          console.log(
            `📊 ROTATION: ${nextIdx + 1}/${availableComps.length}`
          );
        }

        // ==========================================================
        // FALLBACK TEMPLATE ID
        // ==========================================================

        else if (reel.templateId) {
          const numMatch =
            String(reel.templateId).match(
              /\d+/
            );

          compositionId = numMatch
            ? `Template${numMatch[0]}`
            : "Template1";

          console.log(
            "⚠️ FALLBACK TEMPLATE:",
            compositionId
          );
        }

        // ==========================================================
        // FINAL FALLBACK
        // ==========================================================

        else {
          compositionId =
            imageCount < 4
              ? "ReelComposition"
              : "Template1";

          console.log(
            "⚠️ FINAL FALLBACK:",
            compositionId
          );
        }
      }

      // ============================================================
      // FINAL COMPOSITION CHECK
      // ============================================================

      console.log("==========================================");
      console.log(
        "🎯 FINAL COMPOSITION ID:",
        compositionId
      );
      console.log(
        "📸 MEDIA COUNT:",
        imageCount
      );
      console.log(
        "📦 ORIGINAL TEMPLATE ID:",
        reel.templateId
      );
      console.log("==========================================");

      // ============================================================
      // SAFETY CHECK
      // ============================================================

      if (!compositionId) {
        throw new Error(
          "❌ Composition ID was not selected"
        );
      }

      // ============================================================
      // REMOTION RENDER
      // ============================================================

      console.log("==========================================");
      console.log(
        "🚀 SENDING TO REMOTION:",
        compositionId
      );
      console.log("==========================================");

      const result =
        await remotionConfig.render(
          compositionId,
          {
            inputProps,
          }
        );

      let processedPath =
        result.outputPath;

      console.log("==========================================");
      console.log("✅ REMOTION RENDER COMPLETED");
      console.log(
        "📁 OUTPUT:",
        processedPath
      );
      console.log("==========================================");

      // ============================================================
      // AUDIO RESOLUTION
      // ============================================================

      const {
        getMusicForTemplate,
      } = require(
        "../../config/templateMusicMap"
      );

      const isCustomSong =
        reel.music ||
        (audioPath &&
          !audioPath.includes(
            "ReelAudio-"
          ));

      let finalAudioPath =
        audioPath;

      // ============================================================
      // TEMPLATE MUSIC
      // ============================================================

      if (
        !isCustomSong &&
        compositionId
      ) {
        const themeMusicName =
          getMusicForTemplate(
            compositionId
          );

        let resolvedPath =
          path.join(
            __dirname,
            "../../../assets/music",
            themeMusicName
          );

        if (
          !fsSync.existsSync(
            resolvedPath
          )
        ) {
          resolvedPath =
            path.join(
              __dirname,
              "../../../assets/songs",
              themeMusicName
            );
        }

        if (
          fsSync.existsSync(
            resolvedPath
          )
        ) {
          finalAudioPath =
            resolvedPath;

          console.log(
            `🎵 Matched audio for ${compositionId} → ${themeMusicName}`
          );
        } else {
          console.log(
            "⚠️ Music file not found:",
            themeMusicName
          );
        }
      }

      console.log(
        "🔊 Final audioPath to merge:",
        finalAudioPath
      );

      // ============================================================
      // ADD AUDIO WITH FFMPEG
      // ============================================================

      if (finalAudioPath) {
        try {
          const audioFile =
            fsSync.existsSync(
              finalAudioPath
            )
              ? finalAudioPath
              : null;

          if (audioFile) {
            const withAudioPath =
              await ffmpegService.addAudio(
                processedPath,
                audioFile,
                {
                  volume: 1,

                  startTime:
                    reel.musicStartTime ||
                    0,

                  outputPath:
                    path.join(
                      this.tempDir,
                      `with_audio_${Date.now()}.${format}`
                    ),
                }
              );

            if (withAudioPath) {
              processedPath =
                withAudioPath;

              console.log(
                "🎵 Music added via FFmpeg:",
                audioFile
              );
            }
          } else {
            console.error(
              "⚠️ Audio file does not exist:",
              finalAudioPath
            );
          }
        } catch (audioError) {
          console.error(
            "⚠️ Failed to add music:",
            audioError.message
          );
        }
      }

      // ============================================================
      // FINALIZE
      // ============================================================

      const stats =
        await fs.stat(
          processedPath
        );

      const duration =
        await this.getVideoDuration(
          processedPath
        );

      // ============================================================
      // PREVIEW
      // ============================================================

      const preview =
        await previewService.generatePreview(
          processedPath,
          {
            duration: 15,
            quality: "low",
          }
        );

      // ============================================================
      // SAVE FINAL VIDEO
      // ============================================================

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
            },
          }
        );

      // ============================================================
      // FINAL DEBUG
      // ============================================================

      console.log("==========================================");
      console.log(
        "Processed Exists:",
        fsSync.existsSync(
          processedPath
        )
      );

      console.log(
        "Final Exists:",
        fsSync.existsSync(
          finalPath.path
        )
      );

      console.log(
        "Final Path:",
        finalPath.path
      );

      console.log(
        "Final Composition:",
        compositionId
      );

      console.log("==========================================");

      // ============================================================
      // CLEAN TEMP
      // ============================================================

      await fileService
        .cleanupTemp()
        .catch((e) =>
          logger.warn(
            "Temp cleanup warning:",
            e.message
          )
        );

      // ============================================================
      // URLS
      // ============================================================

      const outputFilename =
        path.basename(
          finalPath.path
        );

      const previewFilename =
        path.basename(
          preview.path
        );

      const outputUrl =
        `/output/renders/${outputFilename}`;

      const previewUrl =
        `/output/previews/${previewFilename}`;

      // ============================================================
      // RETURN
      // ============================================================

      return {
        path: finalPath.path,

        filename:
          finalPath.filename,

        size: stats.size,

        duration,

        width,

        height,

        fps,

        quality,

        format,

        outputPath:
          finalPath.path,

        outputUrl,

        previewPath:
          preview.path,

        previewUrl,

        thumbnailPath:
          preview.path,

        preview,

        url:
          finalPath.url,

        compositionId,
      };
    }

    // ============================================================
    // ERROR
    // ============================================================

    catch (error) {
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

  // ============================================================
  // OTHER METHODS
  // ============================================================

  async postProcess(
    inputPath,
    options = {}
  ) {
    /* your existing implementation */
  }

  async getVideoDuration(
    videoPath
  ) {
    /* your existing implementation */
  }

  async cleanupReel(reel) {
    /* your existing implementation */
  }

  async getRenderStatus(jobId) {
    /* your existing implementation */
  }

  async cancelRender(jobId) {
    /* your existing implementation */
  }
}

module.exports =
  new RenderService();