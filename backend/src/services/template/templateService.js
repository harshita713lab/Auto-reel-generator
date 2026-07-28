const Template = require('../../models/Template');
const animationService = require('./animationService');
const transitionService = require('./transitionService');
const effectService = require('./effectService');
const logger = require('../../utils/logger');
const { TEMPLATE_CONFIG } = require('../../config/constants');

class TemplateService {
  constructor() {
    this.defaultTemplate = TEMPLATE_CONFIG.DEFAULT_TEMPLATE;
  }

  /**
   * Get template by ID
   * @param {string} id - Template ID
   * @returns {Promise<object>}
   */
  async getTemplate(id) {
    try {
      const template = await Template.findById(id);
      if (!template) {
        throw new Error('Template not found');
      }
      return template;
    } catch (error) {
      throw new Error(`Failed to get template: ${error.message}`);
    }
  }

  /**
   * Get template by name
   * @param {string} name - Template name
   * @returns {Promise<object>}
   */
  async getTemplateByName(name) {
    try {
      const template = await Template.findOne({ name });
      if (!template) {
        throw new Error('Template not found');
      }
      return template;
    } catch (error) {
      throw new Error(`Failed to get template: ${error.message}`);
    }
  }

  /**
   * Get all templates
   * @param {object} options - Query options
   * @returns {Promise<Array>}
   */
  async getTemplates(options = {}) {
    const { category, limit = 20, skip = 0, isActive = true } = options;
    
    const query = { isActive };
    if (category) query.category = category;

    try {
      const templates = await Template.find(query)
        .sort({ popularity: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      return templates;
    } catch (error) {
      throw new Error(`Failed to get templates: ${error.message}`);
    }
  }

  /**
   * Get popular templates
   * @param {number} limit - Limit
   * @returns {Promise<Array>}
   */
  async getPopularTemplates(limit = 10) {
    try {
      return await Template.getPopular(limit);
    } catch (error) {
      throw new Error(`Failed to get popular templates: ${error.message}`);
    }
  }

  /**
   * Get recommended templates
   * @param {string} userId - User ID
   * @param {number} limit - Limit
   * @returns {Promise<Array>}
   */
  async getRecommendedTemplates(userId, limit = 6) {
    try {
      return await Template.getRecommended(userId, limit);
    } catch (error) {
      throw new Error(`Failed to get recommended templates: ${error.message}`);
    }
  }

  /**
   * Search templates
   * @param {string} searchTerm - Search term
   * @param {object} options - Options
   * @returns {Promise<Array>}
   */
  async searchTemplates(searchTerm, options = {}) {
    try {
      return await Template.search(searchTerm, options);
    } catch (error) {
      throw new Error(`Failed to search templates: ${error.message}`);
    }
  }

  /**
   * Generate template config
   * @param {object} template - Template object
   * @param {object} options - Options
   * @returns {object}
   */
  generateTemplateConfig(template, options = {}) {
    const {
      imageCount = 5,
      duration = 3,
      animation = null,
      transition = null,
      effects = null,
    } = options;

    const config = {
      name: template.name,
      category: template.category,
      duration,
      width: template.config?.defaultWidth || 1080,
      height: template.config?.defaultHeight || 1920,
      backgroundColor: template.config?.backgroundColor || '#000000',
    };

    // Add animations
    const animations = template.getEnabledAnimations();
    config.animations = animation ? [animation] : animations.map(a => a.type);
    config.defaultAnimation = template.defaultAnimation;

    // Add transitions
    const transitions = template.getEnabledTransitions();
    config.transitions = transition ? [transition] : transitions.map(t => t.type);
    config.defaultTransition = template.defaultTransition;

    // Add effects
    const effectList = effects || template.getEnabledEffects().map(e => e.type);
    config.effects = effectList;

    // Add images config
    config.images = Array.from({ length: Math.min(imageCount, template.config?.maxImages || 30) }, (_, i) => ({
      order: i,
      duration,
      animation: config.defaultAnimation,
      transition: config.defaultTransition,
    }));

    return config;
  }

  /**
   * Get template preview data
   * @param {object} template - Template object
   * @param {object} options - Options
   * @returns {object}
   */
  async generatePreview(template, options = {}) {
    const config = this.generateTemplateConfig(template, options);
    
    return {
      template: {
        id: template._id,
        name: template.name,
        category: template.category,
        thumbnail: template.thumbnail,
      },
      config,
      animations: animationService.getAllAnimations(),
      transitions: transitionService.getAllTransitions(),
      effects: effectService.getAllEffects(),
    };
  }

  /**
   * Apply template to reel
   * @param {object} reel - Reel object
   * @param {object} template - Template object
   * @param {object} options - Options
   * @returns {object}
   */
  applyTemplate(reel, template, options = {}) {
    const config = this.generateTemplateConfig(template, options);

    // Update reel with template config
    reel.template = template._id;
    reel.width = config.width;
    reel.height = config.height;
    reel.fps = 30;
    reel.config = {
      ...reel.config,
      defaultAnimation: config.defaultAnimation,
      defaultTransition: config.defaultTransition,
      effects: config.effects,
      backgroundColor: config.backgroundColor,
    };

    // Apply to each image
    reel.images = reel.images.map((image, index) => {
      const imgConfig = config.images[index % config.images.length] || config.images[0];
      return {
        ...image,
        duration: imgConfig.duration,
        animation: imgConfig.animation,
        transition: imgConfig.transition,
      };
    });

    // Calculate total duration
    reel.duration = reel.images.reduce((sum, img) => sum + img.duration, 0);

    return reel;
  }

  /**
   * Create template from config
   * @param {object} config - Template config
   * @returns {Promise<object>}
   */
  async createTemplateFromConfig(config) {
    try {
      const template = new Template({
        name: config.name,
        displayName: config.displayName || config.name,
        description: config.description || '',
        category: config.category,
        thumbnail: config.thumbnail || '',
        defaultAnimation: config.defaultAnimation || 'kenBurns',
        defaultTransition: config.defaultTransition || 'fade',
        defaultEffects: config.defaultEffects || [],
        config: config.config || {},
        effects: config.effects || [],
        animations: config.animations || [],
        transitions: config.transitions || [],
        isActive: true,
        tags: config.tags || [],
      });

      await template.save();
      return template;
    } catch (error) {
      throw new Error(`Failed to create template: ${error.message}`);
    }
  }

  /**
   * Validate template config
   * @param {object} config - Template config
   * @returns {object}
   */
  validateTemplateConfig(config) {
    const errors = [];

    if (!config.name) {
      errors.push('Template name is required');
    }

    if (!config.category) {
      errors.push('Template category is required');
    }

    if (config.minImages && config.minImages < 2) {
      errors.push('Minimum images must be at least 2');
    }

    if (config.maxImages && config.maxImages > 50) {
      errors.push('Maximum images cannot exceed 50');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

module.exports = new TemplateService();