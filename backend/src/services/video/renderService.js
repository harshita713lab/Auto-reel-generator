const fs = require('fs').promises;
const path = require('path');

const logger = require('../../utils/logger');
const remotionConfig = require('../../config/remotion');
const ffmpegService = require('./ffmpegService');
const outputService = require('../storage/outputService');
const previewService = require('./previewService');
const fileService = require('../storage/fileService');
const { DIRECTORIES } = require('../../config/constants');
const Template = require('../../models/Template');

class RenderService {
  constructor() {
    this.renderDir = DIRECTORIES.RENDERS;
    this.tempDir = DIRECTORIES.TEMP;
  }

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
        audioPath = null, // अब इसका उपयोग नहीं होगा (हटा दिया गया)
      } = options;

      const serverBaseUrl = `http://localhost:${process.env.PORT || 5000}`;
      const sharp = require('sharp');

      // ============================================================
      // IMAGE PROCESSING – imageWebUrl हमेशा define रहेगा
      // ============================================================
      const images = await Promise.all(reel.images.map(async (img) => {
        let imageWebUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=';

        if (img.path && typeof img.path === 'string') {
          if (img.path.startsWith('http://') || img.path.startsWith('https://') || img.path.startsWith('data:')) {
            imageWebUrl = img.path;
          } else {
            if (fsSync.existsSync(img.path)) {
              try {
                const resizedBuf = await sharp(img.path)
                  .resize(1080, 1920, { fit: 'cover', position: 'center' })
                  .jpeg({ quality: 80 })
                  .toBuffer();
                imageWebUrl = `data:image/jpeg;base64,${resizedBuf.toString('base64')}`;
              } catch (sharpErr) {
                const fileBuf = fsSync.readFileSync(img.path);
                imageWebUrl = `data:image/jpeg;base64,${fileBuf.toString('base64')}`;
              }
            } else {
              imageWebUrl = `${serverBaseUrl}/uploads/images/${path.basename(img.path)}`;
            }
          }
        }

        return {
          path: imageWebUrl,
          duration: img.duration || 3,
          animation: img.animation || "kenBurns",
          transition: img.transition || "fade"
        };
      }));

      console.log("REEL IMAGES");
      console.log(reel.images);

      const inputProps = {
        images,
        music: null, // Remotion को बिना ऑडियो के रेंडर करना है
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

      // ============================================================
      // DATABASE-DRIVEN TEMPLATE SELECTION (Range + Priority)
      // ============================================================
      const imageCount = reel.images.length;
      console.log("========== AUTO TEMPLATE SELECTION ==========");
      console.log("📸 IMAGE COUNT:", imageCount);

      const matchedTemplate = await Template.findOne({
        isActive: true,
        'config.minImages': { $lte: imageCount },
        'config.maxImages': { $gte: imageCount }
      }).sort({ priority: 1 });

      let compositionId;
      if (matchedTemplate && matchedTemplate.compositionId) {
        compositionId = matchedTemplate.compositionId;
        console.log(`✅ SELECTED FROM DB: ${matchedTemplate.name} (Priority: ${matchedTemplate.priority}) → Composition: ${compositionId}`);
      } else if (reel.templateId) {
        let numMatch = String(reel.templateId).match(/\d+/);
        compositionId = numMatch ? `Template${numMatch[0]}` : "Template1";
        console.log(`✅ FALLBACK TO TEMPLATE ID: ${reel.templateId} → Composition: ${compositionId}`);
      } else {
        compositionId = imageCount < 4 ? "ReelComposition" : "Template1";
        console.log(`⚠️ FALLBACK: ${compositionId}`);
      }
      console.log("==============================================");

      // ============================================================
      // REMOTION RENDER (बिना ऑडियो के)
      // ============================================================
      const result = await remotionConfig.render(compositionId, { inputProps });

      let processedPath = result.outputPath;

      // ============================================================
      // AUDIO RESOLUTION & ATTACHMENT
      // ============================================================
      const { getMusicForTemplate } = require('../../config/templateMusicMap');
      const isCustomSong = reel.music || (audioPath && !audioPath.includes('ReelAudio-'));

      let finalAudioPath = audioPath;
      if (!isCustomSong && compositionId) {
        const themeMusicName = getMusicForTemplate(compositionId);
        let resolvedPath = path.join(__dirname, '../../../assets/music', themeMusicName);
        if (!fsSync.existsSync(resolvedPath)) {
          resolvedPath = path.join(__dirname, '../../../assets/songs', themeMusicName);
        }
        if (fsSync.existsSync(resolvedPath)) {
          finalAudioPath = resolvedPath;
          console.log(`🎵 Matched audio for composition ${compositionId} → ${themeMusicName}`);
        }
      }

      console.log("🔊 Final audioPath to merge:", finalAudioPath);
      if (finalAudioPath) {
        try {
          const audioFile = fsSync.existsSync(finalAudioPath) ? finalAudioPath : null;
          if (audioFile) {
            const withAudioPath = await ffmpegService.addAudio(processedPath, audioFile, {
              volume: 1,
              startTime: reel.musicStartTime || 0,
              outputPath: path.join(this.tempDir, `with_audio_${Date.now()}.${format}`),
            });
            if (withAudioPath) {
              processedPath = withAudioPath;
              console.log("🎵 Music added via FFmpeg:", audioFile);
            }
          } else {
            console.error("⚠️ Audio file does not exist at path:", finalAudioPath);
          }
        } catch (audioError) {
          console.error("⚠️ Failed to add music (continuing without audio):", audioError.message);
        }
      }

   


      // ============================================================
      // FINALIZE
      // ============================================================
      const stats = await fs.stat(processedPath);
      const duration = await this.getVideoDuration(processedPath);

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

      await fileService.cleanupTemp().catch(e => logger.warn("Temp cleanup warning:", e.message));

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

  // ---------- बाकी methods (postProcess, getVideoDuration, cleanupReel, etc.) ----------
  // ... (ये सभी पहले जैसे रहेंगे, बिना किसी बदलाव के)
  async postProcess(inputPath, options = {}) { /* ... */ }
  async getVideoDuration(videoPath) { /* ... */ }
  async cleanupReel(reel) { /* ... */ }
  async getRenderStatus(jobId) { /* ... */ }
  async cancelRender(jobId) { /* ... */ }
}

module.exports = new RenderService();