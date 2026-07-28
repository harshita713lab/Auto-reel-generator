const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const logger = require('../../utils/logger');
const { IMAGE_CONFIG, DIRECTORIES } = require('../../config/constants');

class ResizeImages {
  constructor() {
    this.defaultWidth = IMAGE_CONFIG.MAX_WIDTH;
    this.defaultHeight = IMAGE_CONFIG.MAX_HEIGHT;
  }

  /**
   * Resize image
   * @param {string} inputPath - Input image path
   * @param {object} options - Resize options
   * @returns {Promise<Buffer>}
   */
  async resize(inputPath, options = {}) {
    try {
      const {
        width = this.defaultWidth,
        height = this.defaultHeight,
        fit = 'cover',
        position = 'center',
        withoutEnlargement = true,
        outputPath = null,
      } = options;

      const image = sharp(inputPath);
      
      let processed = image.resize(width, height, {
        fit,
        position,
        withoutEnlargement,
      });

      let buffer;
      if (outputPath) {
        await processed.toFile(outputPath);
        buffer = await fs.readFile(outputPath);
      } else {
        buffer = await processed.toBuffer();
      }

      const metadata = await sharp(buffer).metadata();

      return {
        buffer,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: buffer.length,
      };
    } catch (error) {
      throw new Error(`Failed to resize image: ${error.message}`);
    }
  }

  /**
   * Resize to exact dimensions (crop if needed)
   * @param {string} inputPath - Input image path
   * @param {object} options - Options
   * @returns {Promise<Buffer>}
   */
  async resizeExact(inputPath, options = {}) {
    const {
      width = 1080,
      height = 1920,
      outputPath = null,
    } = options;

    return this.resize(inputPath, {
      width,
      height,
      fit: 'cover',
      position: 'center',
      outputPath,
    });
  }

  /**
   * Resize to fit within dimensions (maintain aspect ratio)
   * @param {string} inputPath - Input image path
   * @param {object} options - Options
   * @returns {Promise<Buffer>}
   */
  async resizeFit(inputPath, options = {}) {
    const {
      width = 1080,
      height = 1920,
      outputPath = null,
    } = options;

    return this.resize(inputPath, {
      width,
      height,
      fit: 'inside',
      withoutEnlargement: true,
      outputPath,
    });
  }

  /**
   * Resize to fill dimensions (maintain aspect ratio, crop excess)
   * @param {string} inputPath - Input image path
   * @param {object} options - Options
   * @returns {Promise<Buffer>}
   */
  async resizeFill(inputPath, options = {}) {
    const {
      width = 1080,
      height = 1920,
      outputPath = null,
    } = options;

    return this.resize(inputPath, {
      width,
      height,
      fit: 'cover',
      position: 'center',
      outputPath,
    });
  }

  /**
   * Resize with specific aspect ratio
   * @param {string} inputPath - Input image path
   * @param {number} ratio - Aspect ratio (width/height)
   * @param {number} size - Size (width if landscape, height if portrait)
   * @returns {Promise<Buffer>}
   */
  async resizeWithAspectRatio(inputPath, ratio, size = 1080) {
    try {
      const metadata = await sharp(inputPath).metadata();
      const currentRatio = metadata.width / metadata.height;

      let width, height;
      if (currentRatio > ratio) {
        // Image is wider, constrain by height
        height = size;
        width = Math.round(size * ratio);
      } else {
        // Image is taller, constrain by width
        width = size;
        height = Math.round(size / ratio);
      }

      return this.resize(inputPath, {
        width,
        height,
        fit: 'cover',
        position: 'center',
      });
    } catch (error) {
      throw new Error(`Failed to resize with aspect ratio: ${error.message}`);
    }
  }

  /**
   * Resize to Instagram feed size (square)
   * @param {string} inputPath - Input image path
   * @param {number} size - Size (default 1080)
   * @returns {Promise<Buffer>}
   */
  async resizeToSquare(inputPath, size = 1080) {
    return this.resize(inputPath, {
      width: size,
      height: size,
      fit: 'cover',
      position: 'center',
    });
  }

  /**
   * Resize to Instagram reel size (portrait)
   * @param {string} inputPath - Input image path
   * @param {number} width - Width (default 1080)
   * @param {number} height - Height (default 1920)
   * @returns {Promise<Buffer>}
   */
  async resizeToReel(inputPath, width = 1080, height = 1920) {
    return this.resize(inputPath, {
      width,
      height,
      fit: 'cover',
      position: 'center',
    });
  }

  /**
   * Batch resize images
   * @param {string[]} inputPaths - Array of input paths
   * @param {object} options - Resize options
   * @returns {Promise<Array>}
   */
  async batchResize(inputPaths, options = {}) {
    const results = [];

    for (const inputPath of inputPaths) {
      try {
        const result = await this.resize(inputPath, options);
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
   * Resize all images in a directory
   * @param {string} dirPath - Directory path
   * @param {object} options - Resize options
   * @returns {Promise<Array>}
   */
  async resizeDirectory(dirPath, options = {}) {
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
          `resized_${Date.now()}_${file}`
        );

        try {
          const result = await this.resize(inputPath, {
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
      throw new Error(`Failed to resize directory: ${error.message}`);
    }
  }
}

module.exports = new ResizeImages();