const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');
const logger = require('../../utils/logger');
const { IMAGE_CONFIG, DIRECTORIES } = require('../../config/constants');

class ThumbnailService {
  constructor() {
    this.thumbWidth = IMAGE_CONFIG.THUMBNAIL_WIDTH;
    this.thumbHeight = IMAGE_CONFIG.THUMBNAIL_HEIGHT;
    this.thumbnailDir = DIRECTORIES.THUMBNAILS;
  }

  /**
   * Generate thumbnail from image
   * @param {string|Buffer} image - Image path or buffer
   * @param {object} options - Thumbnail options
   * @returns {Promise<object>} Thumbnail data
   */
  async generateThumbnail(image, options = {}) {
    try {
      const {
        width = this.thumbWidth,
        height = this.thumbHeight,
        fit = 'cover',
        quality = 80,
        format = 'jpeg',
        outputPath = null,
      } = options;

      const sharpInstance = typeof image === 'string' 
        ? sharp(image) 
        : sharp(image);

      const metadata = await sharpInstance.metadata();

      // Generate thumbnail
      let processed = sharpInstance
        .resize(width, height, {
          fit,
          position: 'center',
        })
        .toFormat(format, { quality });

      let buffer;
      if (outputPath) {
        await processed.toFile(outputPath);
        buffer = await fs.readFile(outputPath);
      } else {
        buffer = await processed.toBuffer();
      }

      const thumbMetadata = await sharp(buffer).metadata();

      return {
        buffer,
        width: thumbMetadata.width,
        height: thumbMetadata.height,
        format: thumbMetadata.format,
        size: buffer.length,
        originalWidth: metadata.width,
        originalHeight: metadata.height,
      };
    } catch (error) {
      throw new Error(`Failed to generate thumbnail: ${error.message}`);
    }
  }

  /**
   * Generate multiple thumbnails from image
   * @param {string} imagePath - Image path
   * @param {Array} sizes - Array of size objects [{width, height}]
   * @returns {Promise<Array>}
   */
  async generateMultipleThumbnails(imagePath, sizes = []) {
    const defaultSizes = [
      { width: 150, height: 150, name: 'small' },
      { width: 320, height: 180, name: 'medium' },
      { width: 640, height: 360, name: 'large' },
    ];

    const sizesToGenerate = sizes.length > 0 ? sizes : defaultSizes;
    const results = [];

    for (const size of sizesToGenerate) {
      try {
        const filename = `${crypto.randomBytes(8).toString('hex')}_${size.name}.jpg`;
        const outputPath = path.join(this.thumbnailDir, filename);

        const result = await this.generateThumbnail(imagePath, {
          width: size.width,
          height: size.height,
          outputPath,
          format: 'jpeg',
          quality: 80,
        });

        results.push({
          ...size,
          filename,
          path: outputPath,
          size: result.size,
        });
      } catch (error) {
        logger.error(`Failed to generate thumbnail ${size.name}:`, error);
        results.push({
          ...size,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Generate thumbnail with custom crop
   * @param {string} imagePath - Image path
   * @param {object} options - Options
   * @returns {Promise<Buffer>}
   */
  async generateCroppedThumbnail(imagePath, options = {}) {
    const {
      width = 320,
      height = 180,
      left = 0,
      top = 0,
      cropWidth = null,
      cropHeight = null,
    } = options;

    try {
      const image = sharp(imagePath);
      const metadata = await image.metadata();

      // If crop dimensions not specified, use entire image
      const cw = cropWidth || metadata.width;
      const ch = cropHeight || metadata.height;

      const buffer = await image
        .extract({ left, top, width: cw, height: ch })
        .resize(width, height, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      return buffer;
    } catch (error) {
      throw new Error(`Failed to generate cropped thumbnail: ${error.message}`);
    }
  }

  /**
   * Generate thumbnail with blur effect
   * @param {string} imagePath - Image path
   * @param {object} options - Options
   * @returns {Promise<Buffer>}
   */
  async generateBlurThumbnail(imagePath, options = {}) {
    const {
      width = 320,
      height = 180,
      blur = 5,
    } = options;

    try {
      const buffer = await sharp(imagePath)
        .resize(width, height, {
          fit: 'cover',
          position: 'center',
        })
        .blur(blur)
        .jpeg({ quality: 60 })
        .toBuffer();

      return buffer;
    } catch (error) {
      throw new Error(`Failed to generate blur thumbnail: ${error.message}`);
    }
  }

  /**
   * Generate thumbnail for video
   * @param {string} videoPath - Video path
   * @param {object} options - Options
   * @returns {Promise<Buffer>}
   */
  async generateVideoThumbnail(videoPath, options = {}) {
    const {
      width = 320,
      height = 180,
      timestamp = '00:00:01',
    } = options;

    try {
      const outputPath = path.join(this.thumbnailDir, `video_thumb_${Date.now()}.jpg`);
      
      const args = [
        'ffmpeg',
        '-ss', timestamp,
        '-i', videoPath,
        '-vf', `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
        '-vframes', '1',
        '-y', outputPath,
      ];

      await new Promise((resolve, reject) => {
        const child = require('child_process').spawn(args[0], args.slice(1));
        child.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`FFmpeg failed with code ${code}`));
        });
        child.on('error', reject);
      });

      const buffer = await fs.readFile(outputPath);
      await fs.unlink(outputPath).catch(() => {});

      return buffer;
    } catch (error) {
      throw new Error(`Failed to generate video thumbnail: ${error.message}`);
    }
  }

  /**
   * Get thumbnail URL
   * @param {string} filename - Thumbnail filename
   * @returns {string}
   */
  getThumbnailUrl(filename) {
    return `/thumbnails/${filename}`;
  }

  /**
   * Delete thumbnail
   * @param {string} filename - Thumbnail filename
   * @returns {Promise<boolean>}
   */
  async deleteThumbnail(filename) {
    try {
      const filePath = path.join(this.thumbnailDir, filename);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      logger.warn(`Failed to delete thumbnail: ${filename}`, error);
      return false;
    }
  }

  /**
   * Delete all thumbnails for an image
   * @param {string} imageName - Image name/ID
   * @returns {Promise<number>}
   */
  async deleteThumbnailsForImage(imageName) {
    try {
      const files = await fs.readdir(this.thumbnailDir);
      const thumbFiles = files.filter(file => file.includes(imageName));
      
      for (const file of thumbFiles) {
        await fs.unlink(path.join(this.thumbnailDir, file));
      }
      
      return thumbFiles.length;
    } catch (error) {
      logger.error(`Failed to delete thumbnails for ${imageName}:`, error);
      return 0;
    }
  }

  /**
   * Get thumbnail stats
   * @param {string} filename - Thumbnail filename
   * @returns {Promise<object>}
   */
  async getThumbnailStats(filename) {
    try {
      const filePath = path.join(this.thumbnailDir, filename);
      const stats = await fs.stat(filePath);
      const buffer = await fs.readFile(filePath);
      const metadata = await sharp(buffer).metadata();

      return {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
      };
    } catch (error) {
      throw new Error(`Failed to get thumbnail stats: ${error.message}`);
    }
  }
}

module.exports = new ThumbnailService();