const path = require("path");
const fs = require("fs").promises;
const fsSync = require("fs");
const ffmpegService = require("../services/video/ffmpegService");
const Reel = require("../models/Reel");
const Template = require("../models/Template");
const renderService = require("../services/video/renderService");
const logger = require("../utils/logger");
const { RENDER_CONFIG } = require("../config/constants");
const { getMusicForTemplate } = require("../config/templateMusicMap");
const beatDetector = require("../services/audio/beatDetector");

/**
 * Get Latest Reel
 */
exports.getLatestReel = async (req, res) => {
  try {
    const latestReel = await Reel.findOne().sort({ createdAt: -1 });

    if (!latestReel) {
      return res.status(200).json({
        success: false,
        message: "No reels found",
        reel: null
      });
    }

    return res.status(200).json({
      success: true,
      reel: {
        ...latestReel.toObject(),
        outputUrl: latestReel.outputPath
          ? `/output/renders/${path.basename(latestReel.outputPath)}`
          : null,
        previewUrl: latestReel.previewPath
          ? `/output/previews/${path.basename(latestReel.previewPath)}`
          : null
      },
    });
  } catch (error) {
    logger.error("Error fetching latest reel:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

/**
 * Create a new reel
 */
exports.createReel = async (req, res) => {
  try {
    const { title, templateId, images, musicId, duration, config = {} } = req.body;

    // Validate images array
    if (!images || !Array.isArray(images) || images.length < RENDER_CONFIG.MIN_IMAGES) {
      return res.status(400).json({
        error: `At least ${RENDER_CONFIG.MIN_IMAGES} images are required`,
      });
    }

    if (images.length > RENDER_CONFIG.MAX_IMAGES) {
      return res.status(400).json({
        error: `Maximum ${RENDER_CONFIG.MAX_IMAGES} images allowed`,
      });
    }

    // Strict image count enforcement for template design with auto-fallback
    const { getRequiredImageCount } = require('../config/templateImageCounts');
    const requiredImageCount = getRequiredImageCount(templateId);
    let effectiveTemplateId = templateId || 'simple_1';
    
    if (requiredImageCount !== null && images.length !== requiredImageCount) {
      const fallbackByCount = {
        1: 'Template38', 3: 'Template21', 4: 'premium_grid', 5: 'Template5', 7: 'Template19',
        8: 'white_masonry', 9: 'Template29', 10: 'Template28', 11: 'wedding_split',
        12: 'Template6', 13: 'Template16', 14: 'wedding_seq', 15: 'cinematic_wedding',
        16: 'white_carousel', 17: 'Template18', 18: 'white_polaroid', 19: 'Template34',
        22: 'Template28', 23: 'Template12', 24: 'Template25', 25: 'Template32'
      };
      effectiveTemplateId = fallbackByCount[images.length] || 'simple_1';
      logger.warn(`Template ${templateId} requires ${requiredImageCount} images, but received ${images.length}. Auto-matched to ${effectiveTemplateId}.`);
    }

    let template = null;
    if (templateId) {
      template = await Template.findOne({
        $or: [
          { templateId: templateId },
          { id: templateId },
          { name: templateId },
          ...(templateId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: templateId }] : []),
        ],
      });
    }

    const defaultTemplateConfig = {
      defaultAnimation: "fade",
      defaultTransition: "crossfade",
    };

    const activeTemplate = template || defaultTemplateConfig;

    const totalDuration = duration || RENDER_CONFIG.DEFAULT_SCENE_DURATION * images.length;
    const sceneDuration = totalDuration / images.length;

    const formattedImages = images.map((img, index) => {
      if (typeof img === "object" && img !== null) {
        const imagePath = img.path || img.url || "";
        const fileName = img.filename || imagePath.split("/").pop() || `image_${index}.jpg`;
        return {
          ...img,
          filename: fileName,
          path: imagePath,
          order: index,
          duration: img.duration || sceneDuration,
          animation: img.animation || config.animations?.[index] || activeTemplate.defaultAnimation,
          transition: img.transition || config.transitions?.[index] || activeTemplate.defaultTransition,
        };
      }

      const imagePath = String(img);
      const fileName = imagePath.split("/").pop() || `image_${index}.jpg`;

      return {
        filename: fileName,
        path: imagePath,
        order: index,
        duration: sceneDuration,
        animation: config.animations?.[index] || activeTemplate.defaultAnimation,
        transition: config.transitions?.[index] || activeTemplate.defaultTransition,
      };
    });

    let musicFileName;

    // Check if user selected a custom song or explicitly chose default
    if (typeof musicId === 'string' && musicId.endsWith('.mp3')) {
      musicFileName = musicId;
    } else if (typeof musicId === 'string' && musicId !== 'template_default' && musicId !== 'default' && musicId.trim() !== '') {
      musicFileName = `${musicId}.mp3`;
    } else {
      // Use template's fixed default song (always fixed by effectiveTemplateId)
      musicFileName = getMusicForTemplate(effectiveTemplateId);
    }

    let selectedAudioPath = path.join(__dirname, '../../assets/music', musicFileName);
    if (!fsSync.existsSync(selectedAudioPath)) {
      selectedAudioPath = path.join(__dirname, '../../assets/songs', musicFileName);
    }
    if (!fsSync.existsSync(selectedAudioPath)) {
      const defaultMusicName = getMusicForTemplate(effectiveTemplateId);
      selectedAudioPath = path.join(__dirname, '../../assets/music', defaultMusicName);
    }

    const generateUniqueDefaultTitle = (tId, count) => {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const namesMap = {
        wedding_seq: 'Wedding Memory',
        cinematic_wedding: 'Cinematic Highlights',
        wedding_split: 'Love Story Reel',
        white_carousel: 'Modern Carousel',
        white_masonry: 'Creative Masonry',
        white_polaroid: 'Vintage Polaroid',
        premium_grid: 'Premium Grid',
        memory_blend: 'Memory Blend',

      };
      const themeName = namesMap[tId] || (count === 20 ? 'Wedding Memory' : count === 9 ? 'Cinematic Highlights' : 'Fotographiya Reel');
      return `${themeName} #${randomCode}`;
    };

    const finalTitle = (title && title.trim() !== '' && title !== "Untitled Reel") 
      ? title.trim() 
      : generateUniqueDefaultTitle(effectiveTemplateId, formattedImages.length);

    const musicStartSec = parseFloat(req.body.musicStartTime) || 0;
    let detectedBeats = [];
    try {
      detectedBeats = await beatDetector.detectBeats(
        selectedAudioPath,
        musicStartSec,
        totalDuration,
        formattedImages.length
      );
    } catch (bErr) {
      logger.error("Beat detection error fallback:", bErr.message);
    }

    const reelData = {
      title: finalTitle,
      images: formattedImages,
      music: musicId && musicId.match(/^[0-9a-fA-F]{24}$/) ? musicId : null,
      audioPath: selectedAudioPath,
      musicStartTime: musicStartSec,
      beatTimestamps: detectedBeats,
      usedMusic: musicFileName.replace('.mp3', '').replace(/-\(PaagalWorld\.Com\)/gi, '').replace(/[-_]/g, ' '),
usedTemplate: template ? template.name : (effectiveTemplateId ? `Template ${effectiveTemplateId}` : "Default"),
      duration: totalDuration,
      config: {
        ...config,
        sceneDuration,
        fps: 30,
        width: 1080,
        height: 1920,
      },
      status: "draft",
      templateId: effectiveTemplateId || "1",
    };

    if (template && template._id) {
      reelData.template = template._id;
    }

    const reel = new Reel(reelData);
    reel.status = 'rendering';
    reel.progress = 10;
    await reel.save();

    logger.info(`Reel document created: ${reel.title} (${reel._id}). Starting background render...`);

    // Trigger background rendering non-blocking to prevent HTTP connection resets
    renderService.renderReel(reel, { audioPath: selectedAudioPath })
      .then(async (renderResult) => {
        reel.status = 'rendered';
        reel.progress = 100;
        reel.outputPath = renderResult.outputPath;
        reel.outputUrl = renderResult.outputUrl;
        reel.previewPath = renderResult.previewPath;
        reel.previewUrl = renderResult.previewUrl;
        reel.thumbnailPath = renderResult.thumbnailPath;
        reel.renderedAt = new Date();
        await reel.save();
        logger.info(`Reel background rendering completed: ${reel.title} (${reel._id})`);
      })
      .catch(async (renderError) => {
        logger.error(`❌ REEL RENDERING ERROR FOR REEL ${reel._id}:`, renderError);
        console.error("================ REMOTION / FFMPEG ERROR DETAIL ================");
        console.error(renderError.stack || renderError);
        console.error("================================================================");

        reel.status = 'failed';
        reel.error = renderError.message;
        await reel.save();
      });

    return res.status(201).json({
      success: true,
      data: reel,
      message: "Reel created and rendering started",
    });
  } catch (error) {
    logger.error("Failed to create reel:", error);
    return res.status(500).json({
      error: "Failed to create reel",
      message: error.message,
      details: error.errors || null,
    });
  }
};

/**
 * Get all reels
 */
exports.getAllReels = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reels, total] = await Promise.all([
      Reel.find(query)
        .populate("template", "name category")
        .populate("music", "title artist")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Reel.countDocuments(query),
    ]);

    const formattedReels = reels.map(reel => {
      const reelObj = reel.toObject();
      if (reelObj.outputPath) {
        const filename = path.basename(reelObj.outputPath);
        reelObj.outputUrl = `http://localhost:5000/output/renders/${filename}`;
      }
      return reelObj;
    });

    res.json({
      success: true,
      reels: formattedReels || [], 
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error("Failed to get reels:", error);
    res.status(500).json({
      error: "Failed to get reels",
      message: error.message,
    });
  }
};

/**
 * Get single reel by ID
 */
exports.getReelById = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate("template", "name category config")
      .populate("music", "title artist duration bpm");

    if (!reel) {
      return res.status(404).json({ error: "Reel not found" });
    }

    res.json({ success: true, data: reel });
  } catch (error) {
    logger.error("Failed to get reel:", error);
    res.status(500).json({
      error: "Failed to get reel",
      message: error.message,
    });
  }
};

exports.getReel = exports.getReelById;

/**
 * ✅ FIXED: Update reel (Rename work properly now)
 */
exports.updateReel = async (req, res) => {
  try {
    const updates = req.body;
    const reel = await Reel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({ error: "Reel not found" });
    }

    if (updates.title && typeof updates.title === 'string') {
      reel.title = updates.title.trim();
    }

    await reel.save();

    logger.info(`Reel updated: ${reel.title} (${reel._id})`);

    res.json({
      success: true,
      data: reel,
      message: "Reel updated successfully",
    });
  } catch (error) {
    logger.error("Failed to update reel:", error);
    res.status(500).json({
      error: "Failed to update reel",
      message: error.message,
    });
  }
};

/**
 * ✅ FIXED: Delete reel (Soft Delete to Trash)
 */
exports.deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ error: "Reel not found" });
    }

    reel.isDeleted = true;
    reel.deletedAt = new Date();
    await reel.save();

    logger.info(`Reel moved to Trash: ${reel.title} (${reel._id})`);

    res.json({
      success: true,
      message: "Reel moved to Trash successfully",
    });
  } catch (error) {
    logger.error("Failed to delete reel:", error);
    res.status(500).json({
      error: "Failed to delete reel",
      message: error.message,
    });
  }
};

/**
 * Get reel preview
 */
exports.getPreview = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ error: "Reel not found" });
    }

    if (!reel.previewPath) {
      await renderService.generatePreview(reel);
    }

    res.json({
      success: true,
      data: {
        previewUrl: `/output/previews/${path.basename(reel.previewPath || '')}`,
        thumbnailUrl: `/output/thumbnails/${path.basename(reel.thumbnailPath || '')}`,
      },
    });
  } catch (error) {
    logger.error("Failed to get preview:", error);
    res.status(500).json({
      error: "Failed to get preview",
      message: error.message,
    });
  }
};

/**
 * Process reel
 */
exports.processReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ error: "Reel not found" });
    }

    if (reel.status === "rendering") {
      return res.status(400).json({ error: "Reel is already being processed" });
    }

    reel.status = "queued";
    reel.progress = 0;
    await reel.save();

    renderService.renderReel(reel).catch((err) => {
      logger.error("Reel processing failed:", err);
      reel.status = "failed";
      reel.error = err.message;
      reel.save();
    });

    res.json({
      success: true,
      data: reel,
      message: "Reel processing started",
    });
  } catch (error) {
    logger.error("Failed to process reel:", error);
    res.status(500).json({
      error: "Failed to process reel",
      message: error.message,
    });
  }
};

/**
 * Render reel
 */
exports.renderReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ error: "Reel not found" });
    }

    if (reel.status === "rendering") {
      return res.status(400).json({ error: "Reel is already being rendered" });
    }

    reel.status = "rendering";
    reel.progress = 0;
    await reel.save();

    const result = await renderService.renderReel(reel);

    reel.status = "rendered";
    reel.progress = 100;
    reel.outputPath = result.outputPath;
    reel.renderedAt = new Date();
    await reel.save();

    res.json({
      success: true,
      data: {
        ...reel.toObject(),
        outputUrl: `/output/renders/${path.basename(result.outputPath)}`,
      },
      message: "Reel rendered successfully",
    });
  } catch (error) {
    logger.error("Failed to render reel:", error);

    try {
      const reel = await Reel.findById(req.params.id);
      if (reel) {
        reel.status = "failed";
        reel.error = error.message;
        await reel.save();
      }
    } catch (e) {
      logger.error("Failed to update reel status:", e);
    }

    res.status(500).json({
      error: "Failed to render reel",
      message: error.message,
    });
  }
};

/**
 * ✅ FIXED: Download reel (Redirects directly to static URL)
 */
exports.downloadReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ error: "Reel not found" });
    }

    if (!reel.outputPath) {
      return res.status(400).json({ error: "Reel has not been rendered yet" });
    }

    const filename = path.basename(reel.outputPath);
    const publicUrl = `http://localhost:5000/output/renders/${filename}`;

    reel.downloadCount = (reel.downloadCount || 0) + 1;
    await reel.save();

    return res.redirect(publicUrl);
  } catch (error) {
    logger.error("Failed to download reel:", error);
    res.status(500).json({
      error: "Failed to download reel",
      message: error.message,
    });
  }
};

/**
 * Get reel status
 */
exports.getReelStatus = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ error: "Reel not found" });
    }

    const filename = reel.outputPath ? path.basename(reel.outputPath) : '';
    res.json({
      success: true,
      data: {
        status: reel.status,
        progress: reel.progress || 0,
        outputPath: reel.outputPath,
        outputUrl: filename ? `/output/renders/${filename}` : null,
        usedMusic: reel.usedMusic || 'Upbeat',
        usedTemplate: reel.usedTemplate || 'Auto',
        previewPath: reel.previewPath,
        error: reel.error,
      },
    });
  } catch (error) {
    logger.error("Failed to get reel status:", error);
    res.status(500).json({
      error: "Failed to get reel status",
      message: error.message,
    });
  }
};

/**
 * Duplicate a reel
 */
exports.duplicateReel = async (req, res) => {
  try {
    const originalReel = await Reel.findById(req.params.id);
    if (!originalReel) {
      return res.status(404).json({ error: "Reel not found" });
    }

    const reelData = originalReel.toObject();
    delete reelData._id;
    delete reelData.createdAt;
    delete reelData.updatedAt;

    reelData.title = `${originalReel.title || "Untitled Reel"} (Copy)`;
    reelData.status = originalReel.status || "rendered";

    const duplicatedReel = new Reel(reelData);
    await duplicatedReel.save();

    logger.info(`Reel duplicated: ${duplicatedReel.title} (${duplicatedReel._id})`);

    return res.status(201).json({
      success: true,
      reel: duplicatedReel,
      message: "Reel duplicated successfully",
    });
  } catch (error) {
    logger.error("Failed to duplicate reel:", error);
    return res.status(500).json({
      error: "Failed to duplicate reel",
      message: error.message,
    });
  }
};

/**
 * Get reels in Trash
 */
exports.getTrash = async (req, res) => {
  try {
    const reels = await Reel.find({ isDeleted: true }).sort({ deletedAt: -1 });
    const formattedReels = reels.map(reel => {
      const reelObj = reel.toObject();
      if (reelObj.outputPath) {
        const filename = path.basename(reelObj.outputPath);
        reelObj.outputUrl = `http://localhost:5000/output/renders/${filename}`;
      }
      return reelObj;
    });
    res.json({ success: true, reels: formattedReels || [] });
  } catch (error) {
    logger.error("Failed to get trash reels:", error);
    res.status(500).json({ error: "Failed to load trash" });
  }
};

/**
 * Restore reel from Trash
 */
exports.restoreReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ error: "Reel not found" });

    reel.isDeleted = false;
    reel.deletedAt = null;
    await reel.save();

    logger.info(`Reel restored from Trash: ${reel.title} (${reel._id})`);
    res.json({ success: true, message: "Reel restored successfully" });
  } catch (error) {
    logger.error("Failed to restore reel:", error);
    res.status(500).json({ error: "Failed to restore reel" });
  }
};

/**
 * Permanent Delete reel
 */
exports.permanentDeleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ error: "Reel not found" });

    if (reel.outputPath) {
      try {
        let filePath = reel.outputPath;
        if (!path.isAbsolute(filePath)) {
          filePath = path.join(__dirname, '../../', filePath);
        }
        await fs.unlink(filePath);
      } catch (err) {}
    }

    await reel.deleteOne();
    logger.info(`Reel permanently deleted: ${reel.title}`);
    res.json({ success: true, message: "Reel permanently deleted" });
  } catch (error) {
    logger.error("Failed to delete reel permanently:", error);
    res.status(500).json({ error: "Failed to delete reel permanently" });
  }
};

/**
 * Get Download History
 */
exports.getDownloadHistory = async (req, res) => {
  try {
    const reels = await Reel.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
    const formattedReels = reels.map(reel => {
      const reelObj = reel.toObject();
      if (reelObj.outputPath) {
        const filename = path.basename(reelObj.outputPath);
        reelObj.outputUrl = `http://localhost:5000/output/renders/${filename}`;
      }
      return reelObj;
    });
    res.json({ success: true, reels: formattedReels || [] });
  } catch (error) {
    logger.error("Failed to get download history:", error);
    res.status(500).json({ error: "Failed to load download history" });
  }
};

/**
 * Change / Edit Music for existing rendered reel
 */
exports.changeMusic = async (req, res) => {
  try {
    const { musicId, musicStartTime = 0 } = req.body;
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ error: "Reel not found" });
    }

    let musicFileName;
    if (typeof musicId === 'string' && musicId.endsWith('.mp3')) {
      musicFileName = musicId;
    } else if (typeof musicId === 'string' && musicId !== 'template_default' && musicId.trim() !== '') {
      musicFileName = `${musicId}.mp3`;
    } else {
      musicFileName = getMusicForTemplate(reel.templateId);
    }

    let audioPath = path.join(__dirname, '../../assets/music', musicFileName);
    if (!fsSync.existsSync(audioPath)) {
      audioPath = path.join(__dirname, '../../assets/songs', musicFileName);
    }
    if (!fsSync.existsSync(audioPath)) {
      const fallbackMusic = getMusicForTemplate(reel.templateId);
      audioPath = path.join(__dirname, '../../assets/music', fallbackMusic);
    }

    const videoPath = reel.outputPath;
    if (!videoPath || !fsSync.existsSync(videoPath)) {
      return res.status(400).json({ error: "Original video file not found for music update" });
    }

    const tempDir = path.join(__dirname, '../../uploads/temp');
    if (!fsSync.existsSync(tempDir)) {
      fsSync.mkdirSync(tempDir, { recursive: true });
    }

    const tempAudioSwapped = path.join(tempDir, `music_edited_${Date.now()}.mp4`);
    
    // Replace audio stream using FFmpeg
    await ffmpegService.addAudio(videoPath, audioPath, {
      volume: 1,
      startTime: parseFloat(musicStartTime) || 0,
      outputPath: tempAudioSwapped,
    });

    if (fsSync.existsSync(tempAudioSwapped)) {
      await fs.copyFile(tempAudioSwapped, videoPath);
      await fs.unlink(tempAudioSwapped).catch(() => {});
    }

    const cleanMusicName = musicFileName.replace('.mp3', '').replace(/-\(PaagalWorld\.Com\)/gi, '').replace(/[-_]/g, ' ');
    let newBeats = [];
    try {
      newBeats = await beatDetector.detectBeats(
        audioPath,
        parseFloat(musicStartTime) || 0,
        reel.duration || 15,
        reel.images ? reel.images.length : 4
      );
    } catch (bErr) {
      logger.error("Beat detection error fallback in changeMusic:", bErr.message);
    }

    reel.usedMusic = cleanMusicName;
    reel.musicStartTime = parseFloat(musicStartTime) || 0;
    reel.beatTimestamps = newBeats;
    await reel.save();

    logger.info(`Reel music updated for reel ${reel._id}: ${cleanMusicName}`);

    return res.json({
      success: true,
      data: reel,
      usedMusic: cleanMusicName,
      outputUrl: `/output/renders/${path.basename(reel.outputPath)}?t=${Date.now()}`,
      message: "Music updated successfully!",
    });
  } catch (error) {
    logger.error("Failed to change reel music:", error);
    res.status(500).json({ error: "Failed to update music", message: error.message });
  }
};