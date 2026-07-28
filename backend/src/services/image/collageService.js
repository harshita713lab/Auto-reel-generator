const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const logger = require('../../utils/logger');
const { DIRECTORIES } = require('../../config/constants');

class CollageService {
  constructor() {
    this.tempDir = DIRECTORIES.TEMP;
  }

  /**
   * Create a collage from multiple images
   * @param {string[]} imagePaths - Array of image paths
   * @param {object} options - Collage options
   * @returns {Promise<Buffer>}
   */
  async createCollage(imagePaths, options = {}) {
    try {
      const {
        width = 1080,
        height = 1920,
        layout = 'grid', // 'grid', 'mosaic', 'vertical', 'horizontal'
        gap = 10,
        backgroundColor = '#000000',
        outputPath = null,
      } = options;

      if (imagePaths.length === 0) {
        throw new Error('No images provided for collage');
      }

      // Load all images
      const images = await Promise.all(
        imagePaths.map(async (imgPath) => {
          const buffer = await fs.readFile(imgPath);
          const metadata = await sharp(buffer).metadata();
          return { buffer, metadata };
        })
      );

      let collage;
      switch (layout) {
        case 'grid':
          collage = await this.createGridCollage(images, { width, height, gap, backgroundColor });
          break;
        case 'mosaic':
          collage = await this.createMosaicCollage(images, { width, height, gap, backgroundColor });
          break;
        case 'vertical':
          collage = await this.createVerticalCollage(images, { width, gap, backgroundColor });
          break;
        case 'horizontal':
          collage = await this.createHorizontalCollage(images, { height, gap, backgroundColor });
          break;
        default:
          collage = await this.createGridCollage(images, { width, height, gap, backgroundColor });
      }

      // Resize to final dimensions
      let result = sharp(collage);
      if (width && height) {
        result = result.resize(width, height, {
          fit: 'contain',
          background: backgroundColor,
        });
      }

      let buffer = await result.jpeg({ quality: 85 }).toBuffer();

      if (outputPath) {
        await sharp(buffer).toFile(outputPath);
      }

      return buffer;
    } catch (error) {
      throw new Error(`Failed to create collage: ${error.message}`);
    }
  }

  /**
   * Create grid collage
   */
  async createGridCollage(images, options = {}) {
    const { width = 1080, height = 1920, gap = 10, backgroundColor = '#000000' } = options;

    const count = images.length;
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    const cellWidth = (width - (cols - 1) * gap) / cols;
    const cellHeight = (height - (rows - 1) * gap) / rows;

    const composite = [];

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = col * (cellWidth + gap);
      const y = row * (cellHeight + gap);

      const resized = await sharp(images[i].buffer)
        .resize(cellWidth, cellHeight, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg()
        .toBuffer();

      composite.push({
        input: resized,
        left: Math.round(x),
        top: Math.round(y),
      });
    }

    return sharp({
      create: {
        width,
        height,
        channels: 3,
        background: backgroundColor,
      },
    })
      .composite(composite)
      .jpeg()
      .toBuffer();
  }

  /**
   * Create mosaic collage
   */
  async createMosaicCollage(images, options = {}) {
    const { width = 1080, height = 1920, gap = 5, backgroundColor = '#000000' } = options;

    const count = images.length;
    const sizes = this.calculateMosaicSizes(count, width, height);

    const composite = [];
    let x = 0,
      y = 0;

    for (let i = 0; i < count; i++) {
      const { w, h } = sizes[i] || { w: width / 2, h: height / 2 };

      const resized = await sharp(images[i].buffer)
        .resize(w, h, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg()
        .toBuffer();

      composite.push({
        input: resized,
        left: Math.round(x),
        top: Math.round(y),
      });

      x += w + gap;
      if (x + w > width) {
        x = 0;
        y += h + gap;
      }
    }

    return sharp({
      create: {
        width,
        height,
        channels: 3,
        background: backgroundColor,
      },
    })
      .composite(composite)
      .jpeg()
      .toBuffer();
  }

  /**
   * Create vertical collage (stacked)
   */
  async createVerticalCollage(images, options = {}) {
    const { width = 1080, gap = 10, backgroundColor = '#000000' } = options;

    let totalHeight = 0;
    const resizedImages = [];

    for (const img of images) {
      const metadata = img.metadata;
      const ratio = metadata.width / metadata.height;
      const h = Math.round(width / ratio);
      totalHeight += h + gap;

      const resized = await sharp(img.buffer)
        .resize(width, h, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg()
        .toBuffer();

      resizedImages.push({ buffer: resized, height: h });
    }

    const composite = [];
    let y = 0;

    for (const img of resizedImages) {
      composite.push({
        input: img.buffer,
        left: 0,
        top: Math.round(y),
      });
      y += img.height + gap;
    }

    return sharp({
      create: {
        width,
        height: totalHeight,
        channels: 3,
        background: backgroundColor,
      },
    })
      .composite(composite)
      .jpeg()
      .toBuffer();
  }

  /**
   * Create horizontal collage (side by side)
   */
  async createHorizontalCollage(images, options = {}) {
    const { height = 1920, gap = 10, backgroundColor = '#000000' } = options;

    let totalWidth = 0;
    const resizedImages = [];

    for (const img of images) {
      const metadata = img.metadata;
      const ratio = metadata.width / metadata.height;
      const w = Math.round(height * ratio);
      totalWidth += w + gap;

      const resized = await sharp(img.buffer)
        .resize(w, height, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg()
        .toBuffer();

      resizedImages.push({ buffer: resized, width: w });
    }

    const composite = [];
    let x = 0;

    for (const img of resizedImages) {
      composite.push({
        input: img.buffer,
        left: Math.round(x),
        top: 0,
      });
      x += img.width + gap;
    }

    return sharp({
      create: {
        width: totalWidth,
        height,
        channels: 3,
        background: backgroundColor,
      },
    })
      .composite(composite)
      .jpeg()
      .toBuffer();
  }

  /**
   * Calculate mosaic sizes
   */
  calculateMosaicSizes(count, totalWidth, totalHeight) {
    const sizes = [];
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    const baseW = Math.floor(totalWidth / cols);
    const baseH = Math.floor(totalHeight / rows);

    let remainingW = totalWidth - baseW * cols;
    let remainingH = totalHeight - baseH * rows;

    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      let w = baseW + (col < remainingW ? 1 : 0);
      let h = baseH + (row < remainingH ? 1 : 0);

      // Make some cells bigger for variety
      if (i === 0) {
        w = Math.floor(totalWidth * 0.5);
        h = Math.floor(totalHeight * 0.5);
      } else if (i === 1) {
        w = Math.floor(totalWidth * 0.5);
        h = Math.floor(totalHeight * 0.5);
      }

      sizes.push({ w, h });
    }

    return sizes;
  }

  /**
   * Create collage with custom positions
   * @param {string[]} imagePaths - Image paths
   * @param {Array} positions - Array of {x, y, width, height}
   * @param {object} options - Options
   * @returns {Promise<Buffer>}
   */
  async createCustomCollage(imagePaths, positions, options = {}) {
    try {
      const {
        width = 1080,
        height = 1920,
        backgroundColor = '#000000',
        outputPath = null,
      } = options;

      if (imagePaths.length !== positions.length) {
        throw new Error('Number of images must match number of positions');
      }

      const composite = [];

      for (let i = 0; i < imagePaths.length; i++) {
        const img = await sharp(imagePaths[i]);
        const pos = positions[i];

        const resized = await img
          .resize(pos.width, pos.height, {
            fit: 'cover',
            position: 'center',
          })
          .jpeg()
          .toBuffer();

        composite.push({
          input: resized,
          left: pos.x,
          top: pos.y,
        });
      }

      const buffer = await sharp({
        create: {
          width,
          height,
          channels: 3,
          background: backgroundColor,
        },
      })
        .composite(composite)
        .jpeg({ quality: 85 })
        .toBuffer();

      if (outputPath) {
        await sharp(buffer).toFile(outputPath);
      }

      return buffer;
    } catch (error) {
      throw new Error(`Failed to create custom collage: ${error.message}`);
    }
  }
}

module.exports = new CollageService();