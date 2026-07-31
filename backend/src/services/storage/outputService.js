const fs = require('fs').promises;
const path = require('path');
const logger = require('../../utils/logger');
const fileService = require('./fileService');
const { DIRECTORIES } = require('../../config/constants');

class OutputService {
  constructor() {
    this.outputDirs = {
      exports: DIRECTORIES.EXPORTS,
      frames: DIRECTORIES.FRAMES,
      previews: DIRECTORIES.PREVIEWS,
      renders: DIRECTORIES.RENDERS,
    };
  }

  /**
   * Save rendered video
   * @param {Buffer|string} data - Video data or path
   * @param {object} options - Options
   * @returns {Promise<object>}
   */
  async saveVideo(data, options = {}) {
    const {
      filename = `video_${Date.now()}.mp4`,
      type = 'render', // 'render', 'preview', 'export'
      metadata = {},
    } = options;

    let outputDir;
    switch (type) {
      case 'preview':
        outputDir = this.outputDirs.previews;
        break;
      case 'export':
        outputDir = this.outputDirs.exports;
        break;
      default:
        outputDir = this.outputDirs.renders;
    }
const outputPath = path.join(outputDir, filename);

console.log("=================================");
console.log("SOURCE FILE :", data);
console.log("DEST FILE   :", outputPath);

await fileService.saveFile(data, outputPath);

const fsSync = require("fs");

console.log("Copied Successfully :", fsSync.existsSync(outputPath));
console.log("=================================");

const stats = await fileService.getFileStats(outputPath);
 

    return {
      path: outputPath,
      filename,
      size: stats.size,
      type,
      metadata,
      url: `/output/${type}s/${filename}`,
    };
  }

  /**
   * Save preview video
   * @param {Buffer|string} data - Video data or path
   * @param {string} filename - Filename
   * @returns {Promise<object>}
   */
  async savePreview(data, filename = null) {
    if (!filename) {
      filename = `preview_${Date.now()}.mp4`;
    }
    return this.saveVideo(data, { filename, type: 'preview' });
  }

  /**
   * Save final export
   * @param {Buffer|string} data - Video data or path
   * @param {string} filename - Filename
   * @returns {Promise<object>}
   */
  async saveExport(data, filename = null) {
    if (!filename) {
      filename = `export_${Date.now()}.mp4`;
    }
    return this.saveVideo(data, { filename, type: 'export' });
  }

  /**
   * Save frames for rendering
   * @param {Array<Buffer>} frames - Array of frame buffers
   * @param {object} options - Options
   * @returns {Promise<Array>}
   */
  async saveFrames(frames, options = {}) {
    const {
      prefix = 'frame',
      extension = 'png',
    } = options;

    const saved = [];

    for (let i = 0; i < frames.length; i++) {
      const filename = `${prefix}_${String(i).padStart(6, '0')}.${extension}`;
      const filePath = path.join(this.outputDirs.frames, filename);
      
      await fileService.saveFile(frames[i], filePath);
      
      saved.push({
        path: filePath,
        filename,
        index: i,
      });
    }

    return saved;
  }

  /**
   * Get video output path
   * @param {string} filename - Filename
   * @param {string} type - Output type
   * @returns {string}
   */
  getOutputPath(filename, type = 'render') {
    let outputDir;
    switch (type) {
      case 'preview':
        outputDir = this.outputDirs.previews;
        break;
      case 'export':
        outputDir = this.outputDirs.exports;
        break;
      default:
        outputDir = this.outputDirs.renders;
    }
    return path.join(outputDir, filename);
  }

  /**
   * Delete output files
   * @param {string} filename - Filename
   * @param {string} type - Output type
   * @returns {Promise<boolean>}
   */
  async deleteOutput(filename, type = 'render') {
    const filePath = this.getOutputPath(filename, type);
    return fileService.deleteFile(filePath);
  }

  /**
   * Clean up old outputs
   * @param {number} maxAge - Max age in milliseconds
   * @returns {Promise<object>}
   */
  async cleanup(maxAge = 7 * 24 * 60 * 60 * 1000) {
    const results = {};

    for (const [type, dir] of Object.entries(this.outputDirs)) {
      try {
        const deleted = await fileService.cleanupOldFiles(dir, maxAge);
        results[type] = deleted;
        logger.info(`Cleaned up ${deleted} old ${type} files`);
      } catch (error) {
        logger.error(`Failed to cleanup ${type}:`, error);
        results[type] = 0;
      }
    }

    return results;
  }

  /**
   * Get output file info
   * @param {string} filename - Filename
   * @param {string} type - Output type
   * @returns {Promise<object>}
   */
  async getOutputInfo(filename, type = 'render') {
    const filePath = this.getOutputPath(filename, type);
    
    if (!await fileService.fileExists(filePath)) {
      return null;
    }

    const stats = await fileService.getFileStats(filePath);
    
    return {
      path: filePath,
      filename,
      size: stats.size,
      created: stats.created,
      modified: stats.modified,
      type,
      url: `/output/${type}s/${filename}`,
    };
  }

  /**
   * List outputs
   * @param {string} type - Output type
   * @param {object} options - Options
   * @returns {Promise<Array>}
   */
  async listOutputs(type = 'render', options = {}) {
    const { limit = 50, offset = 0, sort = 'desc' } = options;

    let outputDir;
    switch (type) {
      case 'preview':
        outputDir = this.outputDirs.previews;
        break;
      case 'export':
        outputDir = this.outputDirs.exports;
        break;
      default:
        outputDir = this.outputDirs.renders;
    }

    try {
      const files = await fs.readdir(outputDir);
      const results = [];

      for (const file of files) {
        const filePath = path.join(outputDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isFile()) {
          results.push({
            filename: file,
            path: filePath,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            type,
            url: `/output/${type}s/${file}`,
          });
        }
      }

      // Sort by modified time
      results.sort((a, b) => {
        const timeA = a.modified.getTime();
        const timeB = b.modified.getTime();
        return sort === 'desc' ? timeB - timeA : timeA - timeB;
      });

      // Paginate
      return results.slice(offset, offset + limit);
    } catch (error) {
      logger.error(`Failed to list ${type} outputs:`, error);
      return [];
    }
  }

  /**
   * Get total output size
   * @returns {Promise<object>}
   */
  async getTotalSize() {
    const total = {};

    for (const [type, dir] of Object.entries(this.outputDirs)) {
      try {
        const files = await fs.readdir(dir);
        let size = 0;
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stats = await fs.stat(filePath);
          if (stats.isFile()) {
            size += stats.size;
          }
        }
        
        total[type] = size;
      } catch (error) {
        total[type] = 0;
      }
    }

    return total;
  }
}

module.exports = new OutputService();