const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const logger = require('../../utils/logger');
const { DIRECTORIES } = require('../../config/constants');

class FileService {
  constructor() {
    this.directories = DIRECTORIES;
    this.ensureDirectories();
  }

  /**
   * Ensure all required directories exist
   */
  async ensureDirectories() {
    const dirs = Object.values(this.directories);
    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        logger.error(`Failed to create directory ${dir}:`, error);
      }
    }
  }

  /**
   * Generate unique filename
   * @param {string} originalName - Original filename
   * @param {string} prefix - Optional prefix
   * @returns {string}
   */
  generateFilename(originalName, prefix = '') {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `${prefix}${timestamp}_${random}${ext}`;
  }

  /**
   * Save file to disk
   * @param {Buffer|string} data - File data or path
   * @param {string} destination - Destination path
   * @param {object} options - Options
   * @returns {Promise<string>}
   */
  async saveFile(data, destination, options = {}) {
    try {
      const { overwrite = false, createDir = true } = options;

      // Check if file exists
      if (!overwrite) {
        try {
          await fs.access(destination);
          throw new Error(`File already exists: ${destination}`);
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
        }
      }

      // Create directory if needed
      if (createDir) {
        const dir = path.dirname(destination);
        await fs.mkdir(dir, { recursive: true });
      }

      // Write file
      if (typeof data === 'string') {
        // Data is a path, copy file
        await fs.copyFile(data, destination);
      } else {
        // Data is buffer
        await fs.writeFile(destination, data);
      }

      logger.debug(`File saved: ${destination}`);
      return destination;
    } catch (error) {
      throw new Error(`Failed to save file: ${error.message}`);
    }
  }

  /**
   * Delete file
   * @param {string} filePath - Path to file
   * @returns {Promise<boolean>}
   */
  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
      logger.debug(`File deleted: ${filePath}`);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        logger.warn(`File not found: ${filePath}`);
        return false;
      }
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Delete directory and contents
   * @param {string} dirPath - Directory path
   * @param {boolean} recursive - Delete recursively
   * @returns {Promise<boolean>}
   */
  async deleteDirectory(dirPath, recursive = true) {
    try {
      await fs.rm(dirPath, { recursive, force: true });
      logger.debug(`Directory deleted: ${dirPath}`);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return false;
      }
      throw new Error(`Failed to delete directory: ${error.message}`);
    }
  }

  /**
   * Get file stats
   * @param {string} filePath - Path to file
   * @returns {Promise<object>}
   */
  async getFileStats(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
      };
    } catch (error) {
      throw new Error(`Failed to get file stats: ${error.message}`);
    }
  }

  /**
   * Check if file exists
   * @param {string} filePath - Path to file
   * @returns {Promise<boolean>}
   */
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get files in directory
   * @param {string} dirPath - Directory path
   * @param {object} options - Options
   * @returns {Promise<Array>}
   */
  async getFiles(dirPath, options = {}) {
    const { extensions = [], recursive = false } = options;

    try {
      const files = await fs.readdir(dirPath);
      let result = [];

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);

        if (stats.isDirectory() && recursive) {
          const subFiles = await this.getFiles(filePath, options);
          result = result.concat(subFiles);
        } else if (stats.isFile()) {
          if (extensions.length > 0) {
            const ext = path.extname(file).toLowerCase().slice(1);
            if (extensions.includes(ext)) {
              result.push(filePath);
            }
          } else {
            result.push(filePath);
          }
        }
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to get files: ${error.message}`);
    }
  }

  /**
   * Copy file
   * @param {string} source - Source path
   * @param {string} destination - Destination path
   * @returns {Promise<string>}
   */
  async copyFile(source, destination) {
    try {
      const dir = path.dirname(destination);
      await fs.mkdir(dir, { recursive: true });
      await fs.copyFile(source, destination);
      return destination;
    } catch (error) {
      throw new Error(`Failed to copy file: ${error.message}`);
    }
  }

  /**
   * Move file
   * @param {string} source - Source path
   * @param {string} destination - Destination path
   * @returns {Promise<string>}
   */
  async moveFile(source, destination) {
    try {
      const dir = path.dirname(destination);
      await fs.mkdir(dir, { recursive: true });
      await fs.rename(source, destination);
      return destination;
    } catch (error) {
      throw new Error(`Failed to move file: ${error.message}`);
    }
  }

  /**
   * Get file size in bytes
   * @param {string} filePath - Path to file
   * @returns {Promise<number>}
   */
  async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (error) {
      throw new Error(`Failed to get file size: ${error.message}`);
    }
  }

  /**
   * Read file as buffer
   * @param {string} filePath - Path to file
   * @returns {Promise<Buffer>}
   */
  async readFile(filePath) {
    try {
      return await fs.readFile(filePath);
    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  /**
   * Write buffer to file
   * @param {string} filePath - Path to file
   * @param {Buffer} data - Data to write
   * @returns {Promise<string>}
   */
  async writeFile(filePath, data) {
    try {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, data);
      return filePath;
    } catch (error) {
      throw new Error(`Failed to write file: ${error.message}`);
    }
  }

  /**
   * Get file extension
   * @param {string} filename - Filename
   * @returns {string}
   */
  getFileExtension(filename) {
    return path.extname(filename).toLowerCase().slice(1);
  }

  /**
   * Get filename without extension
   * @param {string} filename - Filename
   * @returns {string}
   */
  getBaseName(filename) {
    return path.basename(filename, path.extname(filename));
  }

  /**
   * Get image path
   * @param {string} filename - Image filename
   * @returns {string}
   */
  getImagePath(filename) {
    return path.join(this.directories.IMAGES, filename);
  }

  /**
   * Get music path
   * @param {string} filename - Music filename
   * @returns {string}
   */
  getMusicPath(filename) {
    return path.join(this.directories.MUSIC_UPLOAD, filename);
  }

  /**
   * Get thumbnail path
   * @param {string} filename - Thumbnail filename
   * @returns {string}
   */
  getThumbnailPath(filename) {
    return path.join(this.directories.THUMBNAILS, filename);
  }

  /**
   * Get output path
   * @param {string} filename - Output filename
   * @returns {string}
   */
  getOutputPath(filename) {
    return path.join(this.directories.OUTPUT, filename);
  }

  /**
   * Get temp path
   * @param {string} filename - Temp filename
   * @returns {string}
   */
  getTempPath(filename) {
    return path.join(this.directories.TEMP, filename);
  }

  /**
   * Clean up temp directory files (files older than 1 hour)
   * @returns {Promise<number>}
   */
  async cleanupTemp() {
    try {
      const files = await fs.readdir(this.directories.TEMP);
      const now = Date.now();
      const maxAge = 60 * 60 * 1000; // 1 hour
      let deleted = 0;

      for (const file of files) {
        const filePath = path.join(this.directories.TEMP, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtimeMs > maxAge) {
          await fs.unlink(filePath);
          deleted++;
        }
      }

      return deleted;
    } catch (error) {
      logger.error('Failed to cleanup temp directory:', error);
      return 0;
    }
  }

  /**
   * Clean up old files
   * @param {string} dirPath - Directory path
   * @param {number} maxAge - Max age in milliseconds
   * @returns {Promise<number>}
   */
  async cleanupOldFiles(dirPath, maxAge = 7 * 24 * 60 * 60 * 1000) {
    try {
      const files = await fs.readdir(dirPath);
      const now = Date.now();
      let deleted = 0;

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtimeMs > maxAge) {
          await fs.unlink(filePath);
          deleted++;
        }
      }

      return deleted;
    } catch (error) {
      logger.error(`Failed to cleanup ${dirPath}:`, error);
      return 0;
    }
  }
}

module.exports = new FileService();