const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const logger = require('../../utils/logger');
const { IMAGE_CONFIG, DIRECTORIES } = require('../../config/constants');

class ImageService {
  constructor() {
    this.supportedFormats = IMAGE_CONFIG.ALLOWED_EXTENSIONS;
    this.maxSize = IMAGE_CONFIG.MAX_FILE_SIZE;
  }

  /**
   * Get image information
   * @param {string|Buffer} image - Image path or buffer
   * @returns {Promise<object>} Image info
   */
  async getImageInfo(image) {
    try {
      const sharpInstance = typeof image === 'string' 
        ? sharp(image) 
        : sharp(image);
      
      const metadata = await sharpInstance.metadata();
      
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size,
        channels: metadata.channels,
        space: metadata.space,
        hasAlpha: metadata.hasAlpha,
        aspectRatio: metadata.width / metadata.height,
      };
    } catch (error) {
      throw new Error(`Failed to get image info: ${error.message}`);
    }
  }

  /**
   * Validate image
   * @param {object} file - Multer file object
   * @returns {object} Validation result
   */
  async validateImage(file) {
    const errors = [];
    
    // Check extension
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (!this.supportedFormats.includes(ext)) {
      errors.push(`Invalid format. Supported: ${this.supportedFormats.join(', ')}`);
    }

    // Check size
    if (file.size > this.maxSize) {
      errors.push(`File too large. Max: ${this.maxSize / (1024 * 1024)}MB`);
    }

    // Check if valid image
    try {
      await this.getImageInfo(file.path);
    } catch (error) {
      errors.push('Invalid or corrupted image file');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get image dimensions
   * @param {string} imagePath - Path to image
   * @returns {Promise<object>} Dimensions
   */
  async getDimensions(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      return {
        width: metadata.width,
        height: metadata.height,
      };
    } catch (error) {
      throw new Error(`Failed to get dimensions: ${error.message}`);
    }
  }

  /**
   * Get dominant color from image
   * @param {string} imagePath - Path to image
   * @returns {Promise<string>} Hex color
   */
  async getDominantColor(imagePath) {
    try {
      const { dominant } = await sharp(imagePath)
        .resize(100, 100)
        .stats();
      
      const { r, g, b } = dominant;
      return `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`;
    } catch (error) {
      return '#000000';
    }
  }

  /**
   * Check if image is portrait
   * @param {string} imagePath - Path to image
   * @returns {Promise<boolean>}
   */
  async isPortrait(imagePath) {
    const dims = await this.getDimensions(imagePath);
    return dims.height > dims.width;
  }

  /**
   * Check if image is landscape
   * @param {string} imagePath - Path to image
   * @returns {Promise<boolean>}
   */
  async isLandscape(imagePath) {
    const dims = await this.getDimensions(imagePath);
    return dims.width > dims.height;
  }

  /**
   * Get aspect ratio
   * @param {string} imagePath - Path to image
   * @returns {Promise<number>}
   */
  async getAspectRatio(imagePath) {
    const dims = await this.getDimensions(imagePath);
    return dims.width / dims.height;
  }

  /**
   * Convert image format
   * @param {string} inputPath - Input image path
   * @param {string} outputPath - Output image path
   * @param {string} format - Target format
   * @returns {Promise<string>}
   */
  async convertFormat(inputPath, outputPath, format = 'jpeg') {
    try {
      await sharp(inputPath)
        .toFormat(format)
        .toFile(outputPath);
      
      return outputPath;
    } catch (error) {
      throw new Error(`Failed to convert format: ${error.message}`);
    }
  }
}

module.exports = new ImageService();