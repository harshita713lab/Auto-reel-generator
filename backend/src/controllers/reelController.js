const path = require('path');
const fs = require('fs').promises;
const Reel = require('../models/Reel');
const Project = require('../models/Project');
const Template = require('../models/Template');
const templateService = require('../services/template/templateService');
const renderService = require('../services/video/renderService');
const logger = require('../utils/logger');
const { RENDER_CONFIG } = require('../config/constants');

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

    // Validate images
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

    // Get template
    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Calculate scene duration
    const totalDuration = duration || RENDER_CONFIG.DEFAULT_SCENE_DURATION * images.length;
    const sceneDuration = totalDuration / images.length;

    // Create reel
    const reel = new Reel({
      title: title || 'Untitled Reel',
      template: templateId,
      images: images.map((img, index) => ({
        ...img,
        order: index,
        duration: sceneDuration,
        animation: config.animations?.[index] || template.defaultAnimation,
        transition: config.transitions?.[index] || template.defaultTransition,
      })),
      music: musicId,
      duration: totalDuration,
      config: {
        ...config,
        sceneDuration,
        fps: 30,
        width: 1080,
        height: 1920,
      },
      status: 'draft',
    });

    await reel.save();

    logger.info(`Reel created: ${reel.title} (${reel._id})`);

    res.status(201).json({
      success: true,
      data: reel,
      message: 'Reel created successfully',
    });
  } catch (error) {
    logger.error('Failed to create reel:', error);
    res.status(500).json({
      error: 'Failed to create reel',
      message: error.message,
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
        .populate('template', 'name category')
        .populate('music', 'title artist')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Reel.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: reels,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error('Failed to get reels:', error);
    res.status(500).json({
      error: 'Failed to get reels',
      message: error.message,
    });
  }
};

/**
 * Get single reel by ID (alias for routes)
 */
exports.getReel = async (req, res) => {
  return exports.getReelById(req, res);
};

/**
 * Get single reel by ID
 */
exports.getReelById = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate('template', 'name category config')
      .populate('music', 'title artist duration bpm');

    if (!reel) {
      return res.status(404).json({ error: 'Reel not found' });
    }

    res.json({ success: true, data: reel });
  } catch (error) {
    logger.error('Failed to get reel:', error);
    res.status(500).json({
      error: 'Failed to get reel',
      message: error.message,
    });
  }
};

/**
 * Update reel
 */
exports.updateReel = async (req, res) => {
  try {
    const updates = req.body;
    const reel = await Reel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({ error: 'Reel not found' });
    }

    // Prevent updates to rendering/rendered reels
    if (reel.status === 'rendering' || reel.status === 'rendered') {
      return res.status(400).json({
        error: 'Cannot update reel while rendering or already rendered',
      });
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        reel[key] = updates[key];
      }
    });

    // Reset status to draft
    reel.status = 'draft';
    await reel.save();

    logger.info(`Reel updated: ${reel.title} (${reel._id})`);

    res.json({
      success: true,
      data: reel,
      message: 'Reel updated successfully',
    });
  } catch (error) {
    logger.error('Failed to update reel:', error);
    res.status(500).json({
      error: 'Failed to update reel',
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
      return res.status(404).json({ error: 'Reel not found' });
    }

    // Delete output files if rendered
    if (reel.outputPath) {
      // Clean up files
      await renderService.cleanupReel(reel);
    }

    await reel.deleteOne();

    logger.info(`Reel deleted: ${reel.title}`);

    res.json({
      success: true,
      message: 'Reel deleted successfully',
    });
  } catch (error) {
    logger.error('Failed to delete reel:', error);
    res.status(500).json({
      error: 'Failed to delete reel',
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
      return res.status(404).json({ error: 'Reel not found' });
    }

    // Generate preview if not exists
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
    logger.error('Failed to get preview:', error);
    res.status(500).json({
      error: 'Failed to get preview',
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
      return res.status(404).json({ error: 'Reel not found' });
    }

    if (reel.status === 'rendering') {
      return res.status(400).json({ error: 'Reel is already being processed' });
    }

    // Update status to queued
    reel.status = 'queued';
    reel.progress = 0;
    await reel.save();

    // Start processing asynchronously
    renderService.renderReel(reel).catch(err => {
      logger.error('Reel processing failed:', err);
      reel.status = 'failed';
      reel.error = err.message;
      reel.save();
    });

    res.json({
      success: true,
      data: reel,
      message: 'Reel processing started',
    });
  } catch (error) {
    logger.error('Failed to process reel:', error);
    res.status(500).json({
      error: 'Failed to process reel',
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
      return res.status(404).json({ error: 'Reel not found' });
    }

    if (reel.status === 'rendering') {
      return res.status(400).json({ error: 'Reel is already being rendered' });
    }

    // Update status
    reel.status = 'rendering';
    reel.progress = 0;
    await reel.save();

    // Start render
    const result = await renderService.renderReel(reel);

    reel.status = 'rendered';
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
      message: 'Reel rendered successfully',
    });
  } catch (error) {
    logger.error('Failed to render reel:', error);
    
    // Update reel status to failed
    try {
      const reel = await Reel.findById(req.params.id);
      if (reel) {
        reel.status = 'failed';
        reel.error = error.message;
        await reel.save();
      }
    } catch (e) {
      logger.error('Failed to update reel status:', e);
    }

    res.status(500).json({
      error: 'Failed to render reel',
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
      return res.status(404).json({ error: 'Reel not found' });
    }

    if (!reel.outputPath) {
      return res.status(400).json({ error: 'Reel has not been rendered yet' });
    }

    // Check if file exists
    try {
      await fs.access(reel.outputPath);
    } catch {
      return res.status(404).json({ error: 'Output file not found' });
    }

    // Increment download count
    reel.downloadCount += 1;
    await reel.save();

    res.download(reel.outputPath, `${reel.title}.mp4`);
  } catch (error) {
    logger.error('Failed to download reel:', error);
    res.status(500).json({
      error: 'Failed to download reel',
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
      return res.status(404).json({ error: 'Reel not found' });
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
    logger.error('Failed to get reel status:', error);
    res.status(500).json({
      error: 'Failed to get reel status',
      message: error.message,
    });
  }
};