const path = require("path");
const fs = require("fs").promises;
const Reel = require("../models/Reel");
const Template = require("../models/Template");
const templateService = require("../services/template/templateService");
const renderService = require("../services/video/renderService");
const logger = require("../utils/logger");
const { RENDER_CONFIG } = require("../config/constants");

/**
 * Get Latest Reel (For Frontend LatestReel Component)
 */
exports.getLatestReel = async (req, res) => {
  try {
    const latestReel = await Reel.findOne().sort({ createdAt: -1 });

    if (!latestReel) {
      return res
        .status(200)
        .json({ success: false, message: "No reels found" });
    }

    return res.status(200).json({
      success: true,
      reel: latestReel,
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
/**
 * Create a new reel
 */
exports.createReel = async (req, res) => {
  try {
    const {
      title,
      templateId,
      images,
      musicId,
      duration,
      config = {},
    } = req.body;

    // 1. Validate images array
    if (
      !images ||
      !Array.isArray(images) ||
      images.length < RENDER_CONFIG.MIN_IMAGES
    ) {
      return res.status(400).json({
        error: `At least ${RENDER_CONFIG.MIN_IMAGES} images are required`,
      });
    }

    if (images.length > RENDER_CONFIG.MAX_IMAGES) {
      return res.status(400).json({
        error: `Maximum ${RENDER_CONFIG.MAX_IMAGES} images allowed`,
      });
    }

    // 2. Lookup template if provided
    let template = null;
    if (templateId) {
      template = await Template.findOne({
        $or: [
          { templateId: templateId },
          { id: templateId },
          { name: templateId },
          ...(templateId.match(/^[0-9a-fA-F]{24}$/)
            ? [{ _id: templateId }]
            : []),
        ],
      });
    }

    const defaultTemplateConfig = {
      defaultAnimation: "fade",
      defaultTransition: "crossfade",
    };

    const activeTemplate = template || defaultTemplateConfig;

    // 3. Calculate scene duration
    const totalDuration =
      duration || RENDER_CONFIG.DEFAULT_SCENE_DURATION * images.length;
    const sceneDuration = totalDuration / images.length;

    // 4. Safely format images array to match ImageSchema (filename, path, order required)
    const formattedImages = images.map((img, index) => {
      // Agar img object hai jisme path/filename hai:
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

      // Agar img direct String (URL/Path) hai:
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

    // 5. Build Reel Document Data
    const reelData = {
      title: title || "Untitled Reel",
      images: formattedImages,
      music: musicId && musicId.match(/^[0-9a-fA-F]{24}$/) ? musicId : null,
      duration: totalDuration,
      config: {
        ...config,
        sceneDuration,
        fps: 30,
        width: 1080,
        height: 1920,
      },
      status: "draft",
      templateId: templateId || "simple_1",
    };

    // Attach ObjectId template reference only if valid MongoDB document was found
    if (template && template._id) {
      reelData.template = template._id;
    }

    const reel = new Reel(reelData);
    await reel.save();

    logger.info(`Reel created: ${reel.title} (${reel._id})`);

    return res.status(201).json({
      success: true,
      data: reel,
      message: "Reel created successfully",
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

    res.json({
      success: true,
      reels: reels || [],
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
 * Update reel
 */
exports.updateReel = async (req, res) => {
  try {
    const updates = req.body;
    const reel = await Reel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({ error: "Reel not found" });
    }

    if (reel.status === "rendering" || reel.status === "rendered") {
      return res.status(400).json({
        error: "Cannot update reel while rendering or already rendered",
      });
    }

    Object.keys(updates).forEach((key) => {
      if (key !== "_id" && key !== "__v") {
        reel[key] = updates[key];
      }
    });

    reel.status = "draft";
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
 * Delete reel
 */
exports.deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ error: "Reel not found" });
    }

    if (reel.outputPath) {
      await renderService.cleanupReel(reel);
    }

    await reel.deleteOne();

    logger.info(`Reel deleted: ${reel.title}`);

    res.json({
      success: true,
      message: "Reel deleted successfully",
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
        previewUrl: `/previews/${reel.previewPath}`,
        thumbnailUrl: `/thumbnails/${reel.thumbnailPath}`,
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
        outputUrl: `/generated/${path.basename(result.outputPath)}`,
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
 * Download reel
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

    try {
      await fs.access(reel.outputPath);
    } catch {
      return res.status(404).json({ error: "Output file not found" });
    }

    reel.downloadCount = (reel.downloadCount || 0) + 1;
    await reel.save();

    res.download(reel.outputPath, `${reel.title}.mp4`);
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

    res.json({
      success: true,
      data: {
        status: reel.status,
        progress: reel.progress || 0,
        outputPath: reel.outputPath,
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
