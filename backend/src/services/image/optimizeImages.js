const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const logger = require('../../utils/logger');
const { IMAGE_CONFIG, DIRECTORIES } = require('../../config/constants');

class OptimizeImages {
  constructor() {
    this.maxWidth = IMAGE_CONFIG.MAX_WIDTH;
    this.maxHeight = IMAGE_CONFIG.MAX_HEIGHT;
    this.quality = IMAGE_CONFIG.QUALITY;
    this.format = IMAGE_CONFIG.FORMAT;
  }

  /**
   * Optimize single image
   * @param {string} inputPath - Input image path
   * @param {object} options - Optimization options
   * @returns {Promise<object>} Optimized image data
   */
  async optimizeImage(inputPath, options = {}) {
    try {
      const {
        maxWidth = this.maxWidth,
        maxHeight = this.maxHeight,
        quality = this.quality,
        format = this.format,
        outputPath = null,
      } = options;

      // Read image
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      // Calculate resize dimensions
      let width = metadata.width;
      let height = metadata.height;
      
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxWidth;
          height = Math.round(maxWidth / aspectRatio);
        } else {
          height = maxHeight;
          width = Math.round(maxHeight * aspectRatio);
        }
      }

      // Process image
      let processed = image
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFormat(format, { quality });

      // Save or get buffer
      let buffer;
      if (outputPath) {
        await processed.toFile(outputPath);
        buffer = await fs.readFile(outputPath);
      } else {
        buffer = await processed.toBuffer();
      }

      // Get processed info
      const processedMetadata = await sharp(buffer).metadata();

      return {
        buffer,
        width: processedMetadata.width,
        height: processedMetadata.height,
        format: processedMetadata.format,
        size: buffer.length,
        originalSize: metadata.size,
        compressionRatio: buffer.length / metadata.size,
      };
    } catch (error) {
      throw new Error(`Failed to optimize image: ${error.message}`);
    }
  }

  /**
   * Optimize multiple images
   * @param {string[]} inputPaths - Array of input paths
   * @param {object} options - Optimization options
   * @returns {Promise<Array>} Array of optimized results
   */
  async optimizeMultiple(inputPaths, options = {}) {
    const results = [];
    
    for (const inputPath of inputPaths) {
      try {
        const result = await this.optimizeImage(inputPath, options);
        results.push({
          input: inputPath,
          success: true,
          data: result,
        });
      } catch (error) {
        results.push({
          input: inputPath,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Optimize image for web
   * @param {string} inputPath - Input image path
   * @param {object} options - Options
   * @returns {Promise<Buffer>}
   */
  async optimizeForWeb(inputPath, options = {}) {
    const {
      width = 800,
      quality = 80,
      format = 'webp',
    } = options;

    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      // Resize if needed
      let processed = image;
      if (metadata.width > width) {
        const ratio = width / metadata.width;
        processed = processed.resize(width, Math.round(metadata.height * ratio));
      }

      // Convert to webp
      const buffer = await processed
        .toFormat(format, { quality })
        .toBuffer();

      return buffer;
    } catch (error) {
      throw new Error(`Failed to optimize for web: ${error.message}`);
    }
  }

  /**
   * Compress image
   * @param {string} inputPath - Input image path
   * @param {number} quality - Quality (1-100)
   * @returns {Promise<Buffer>}
   */
  async compressImage(inputPath, quality = 80) {
    try {
      const buffer = await sharp(inputPath)
        .jpeg({ quality })
        .toBuffer();
      
      return buffer;
    } catch (error) {
      throw new Error(`Failed to compress image: ${error.message}`);
    }
  }

  /**
   * Optimize image for Instagram
   * @param {string} inputPath - Input image path
   * @param {object} options - Options
   * @returns {Promise<Buffer>}
   */
  async optimizeForInstagram(inputPath, options = {}) {
    const {
      width = 1080,
      height = 1080,
      quality = 85,
    } = options;

    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      let processed = image;
      
      // Resize to Instagram dimensions
      if (metadata.width !== width || metadata.height !== height) {
        processed = processed.resize(width, height, {
          fit: 'cover',
          position: 'center',
        });
      }

      const buffer = await processed
        .jpeg({ quality, progressive: true })
        .toBuffer();

      return buffer;
    } catch (error) {
      throw new Error(`Failed to optimize for Instagram: ${error.message}`);
    }
  }

  /**
   * Batch process images in directory
   * @param {string} dirPath - Directory path
   * @param {object} options - Processing options
   * @returns {Promise<Array>}
   */
  async batchProcessDirectory(dirPath, options = {}) {
    try {
      const files = await fs.readdir(dirPath);
      const imageFiles = files.filter(file => 
        IMAGE_CONFIG.ALLOWED_EXTENSIONS.includes(
          path.extname(file).toLowerCase().slice(1)
        )
      );

      const results = [];
      for (const file of imageFiles) {
        const inputPath = path.join(dirPath, file);
        const outputPath = path.join(
          dirPath,
          `optimized_${Date.now()}_${file}`
        );

        try {
          const result = await this.optimizeImage(inputPath, {
            ...options,
            outputPath,
          });
          results.push({
            file,
            success: true,
            output: outputPath,
            size: result.size,
          });
        } catch (error) {
          results.push({
            file,
            success: false,
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Failed to process directory: ${error.message}`);
    }
  }
}

module.exports = new OptimizeImages();