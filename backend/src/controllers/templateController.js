const Template = require('../models/Template');
const templateService = require('../services/template/templateService');
const animationService = require('../services/template/animationService');
const transitionService = require('../services/template/transitionService');
const effectService = require('../services/template/effectService');
const logger = require('../utils/logger');
const { TEMPLATE_CONFIG } = require('../config/constants');

/**
 * Get all templates
 */
exports.getAllTemplates = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [templates, total] = await Promise.all([
      Template.find(query)
        .sort({ popularity: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Template.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: templates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error('Failed to get templates:', error);
    res.status(500).json({
      error: 'Failed to get templates',
      message: error.message,
    });
  }
};

/**
 * Get template by ID
 */
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ success: true, data: template });
  } catch (error) {
    logger.error('Failed to get template:', error);
    res.status(500).json({
      error: 'Failed to get template',
      message: error.message,
    });
  }
};

/**
 * Create template
 */
exports.createTemplate = async (req, res) => {
  try {
    const templateData = req.body;
    
    // Validate template name
    if (!templateData.name) {
      return res.status(400).json({ error: 'Template name is required' });
    }

    // Check if template exists
    const existing = await Template.findOne({ name: templateData.name });
    if (existing) {
      return res.status(400).json({ error: 'Template name already exists' });
    }

    // Set defaults
    templateData.isActive = templateData.isActive !== undefined ? templateData.isActive : true;
    templateData.defaultAnimation = templateData.defaultAnimation || 'kenBurns';
    templateData.defaultTransition = templateData.defaultTransition || 'fade';

    const template = new Template(templateData);
    await template.save();

    logger.info(`Template created: ${template.name} (${template._id})`);

    res.status(201).json({
      success: true,
      data: template,
      message: 'Template created successfully',
    });
  } catch (error) {
    logger.error('Failed to create template:', error);
    res.status(500).json({
      error: 'Failed to create template',
      message: error.message,
    });
  }
};

/**
 * Update template
 */
exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const template = await Template.findById(id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== '__v' && key !== 'createdAt') {
        template[key] = updates[key];
      }
    });

    await template.save();

    logger.info(`Template updated: ${template.name} (${template._id})`);

    res.json({
      success: true,
      data: template,
      message: 'Template updated successfully',
    });
  } catch (error) {
    logger.error('Failed to update template:', error);
    res.status(500).json({
      error: 'Failed to update template',
      message: error.message,
    });
  }
};

/**
 * Delete template
 */
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    await template.deleteOne();

    logger.info(`Template deleted: ${template.name}`);

    res.json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    logger.error('Failed to delete template:', error);
    res.status(500).json({
      error: 'Failed to delete template',
      message: error.message,
    });
  }
};

/**
 * Get template preview
 */
exports.getTemplatePreview = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageCount = 5 } = req.query;

    const template = await Template.findById(id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Generate preview configuration
    const preview = await templateService.generatePreview(template, {
      imageCount: parseInt(imageCount),
    });

    res.json({
      success: true,
      data: preview,
    });
  } catch (error) {
    logger.error('Failed to get template preview:', error);
    res.status(500).json({
      error: 'Failed to get template preview',
      message: error.message,
    });
  }
};

/**
 * Get all animations
 */
exports.getAnimations = async (req, res) => {
  try {
    const animations = await animationService.getAllAnimations();
    res.json({
      success: true,
      data: animations,
    });
  } catch (error) {
    logger.error('Failed to get animations:', error);
    res.status(500).json({
      error: 'Failed to get animations',
      message: error.message,
    });
  }
};

/**
 * Get all transitions
 */
exports.getTransitions = async (req, res) => {
  try {
    const transitions = await transitionService.getAllTransitions();
    res.json({
      success: true,
      data: transitions,
    });
  } catch (error) {
    logger.error('Failed to get transitions:', error);
    res.status(500).json({
      error: 'Failed to get transitions',
      message: error.message,
    });
  }
};

/**
 * Recommend template based on images
 */
exports.recommendTemplate = async (req, res) => {
  try {
    const { images, preferences = {} } = req.body;
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'Images are required for recommendation' });
    }

    // Simple recommendation logic based on image count and preferences
    const templates = await Template.find({ isActive: true }).sort({ popularity: -1 });
    
    let recommended = templates[0] || TEMPLATE_CONFIG.DEFAULT_TEMPLATE;
    
    // If preferences specify a category, filter by it
    if (preferences.category) {
      const filtered = templates.filter(t => t.category === preferences.category);
      if (filtered.length > 0) {
        recommended = filtered[0];
      }
    }

    res.json({
      success: true,
      data: {
        template: recommended,
        reason: 'Recommended based on your images and preferences',
      },
    });
  } catch (error) {
    logger.error('Failed to recommend template:', error);
    res.status(500).json({
      error: 'Failed to recommend template',
      message: error.message,
    });
  }
};

/**
 * Customize template
 */
exports.customizeTemplate = async (req, res) => {
  try {
    const { templateId, customizations = {} } = req.body;
    
    if (!templateId) {
      return res.status(400).json({ error: 'Template ID is required' });
    }

    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Apply customizations
    const customized = {
      ...template.toObject(),
      ...customizations,
      isCustomized: true,
      baseTemplate: templateId,
    };

    res.json({
      success: true,
      data: customized,
      message: 'Template customized successfully',
    });
  } catch (error) {
    logger.error('Failed to customize template:', error);
    res.status(500).json({
      error: 'Failed to customize template',
      message: error.message,
    });
  }
};

/**
 * Get all effects
 */
exports.getEffects = async (req, res) => {
  try {
    const effects = await effectService.getAllEffects();
    res.json({
      success: true,
      data: effects,
    });
  } catch (error) {
    logger.error('Failed to get effects:', error);
    res.status(500).json({
      error: 'Failed to get effects',
      message: error.message,
    });
  }
};