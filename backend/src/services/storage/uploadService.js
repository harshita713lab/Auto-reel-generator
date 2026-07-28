const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const logger = require('../../utils/logger');
const fileService = require('./fileService');
const { DIRECTORIES, IMAGE_CONFIG, AUDIO_CONFIG } = require('../../config/constants');

class UploadService {
  constructor() {
    this.uploadDirs = {
      images: DIRECTORIES.IMAGES,
      music: DIRECTORIES.MUSIC_UPLOAD,
      temp: DIRECTORIES.TEMP,
      thumbnails: DIRECTORIES.THUMBNAILS,
    };
  }

  /**
   * Configure multer for image uploads
   * @param {object} options - Multer options
   * @returns {multer.Multer}
   */
  setupImageUpload(options = {}) {
    const {
      maxFileSize = IMAGE_CONFIG.MAX_FILE_SIZE,
      allowedExtensions = IMAGE_CONFIG.ALLOWED_EXTENSIONS,
      destination = this.uploadDirs.temp,
    } = options;

    const storage = multer.diskStorage({
      destination: async (req, file, cb) => {
        try {
          await fs.mkdir(destination, { recursive: true });
          cb(null, destination);
        } catch (error) {
          cb(error);
        }
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${crypto.randomBytes(16).toString('hex')}${ext}`;
        cb(null, filename);
      },
    });

    const fileFilter = (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().slice(1);
      if (allowedExtensions.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error(`File type not allowed. Allowed: ${allowedExtensions.join(', ')}`));
      }
    };

    return multer({
      storage,
      limits: { fileSize: maxFileSize },
      fileFilter,
    });
  }

  /**
   * Configure multer for music uploads
   * @param {object} options - Multer options
   * @returns {multer.Multer}
   */
  setupMusicUpload(options = {}) {
    const {
      maxFileSize = AUDIO_CONFIG.MAX_FILE_SIZE,
      allowedExtensions = AUDIO_CONFIG.ALLOWED_EXTENSIONS,
      destination = this.uploadDirs.temp,
    } = options;

    const storage = multer.diskStorage({
      destination: async (req, file, cb) => {
        try {
          await fs.mkdir(destination, { recursive: true });
          cb(null, destination);
        } catch (error) {
          cb(error);
        }
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${crypto.randomBytes(16).toString('hex')}${ext}`;
        cb(null, filename);
      },
    });

    const fileFilter = (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().slice(1);
      if (allowedExtensions.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error(`File type not allowed. Allowed: ${allowedExtensions.join(', ')}`));
      }
    };

    return multer({
      storage,
      limits: { fileSize: maxFileSize },
      fileFilter,
    });
  }

  /**
   * Handle multer error
   * @param {Error} error - Multer error
   * @returns {string}
   */
  handleMulterError(error) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return 'File too large';
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return 'Too many files';
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return 'Unexpected file field';
    }
    return error.message || 'Upload failed';
  }

  /**
   * Save uploaded file to final destination
   * @param {object} file - Multer file object
   * @param {string} type - File type ('image' or 'music')
   * @param {string} customName - Custom filename
   * @returns {Promise<object>}
   */
  async saveUpload(file, type = 'image', customName = null) {
    try {
      const destDir = type === 'image' 
        ? this.uploadDirs.images 
        : this.uploadDirs.music;

      const ext = path.extname(file.originalname);
      const filename = customName || `${crypto.randomBytes(16).toString('hex')}${ext}`;
      const destPath = path.join(destDir, filename);

      // Ensure directory exists
      await fs.mkdir(destDir, { recursive: true });

      // Move file
      await fs.rename(file.path, destPath);

      // Get file info
      const stats = await fs.stat(destPath);

      return {
        filename,
        originalName: file.originalname,
        path: destPath,
        size: stats.size,
        mimetype: file.mimetype,
        type,
      };
    } catch (error) {
      // Clean up temp file
      await fs.unlink(file.path).catch(() => {});
      throw new Error(`Failed to save upload: ${error.message}`);
    }
  }

  /**
   * Upload multiple files
   * @param {Array} files - Array of multer file objects
   * @param {string} type - File type
   * @returns {Promise<Array>}
   */
  async uploadMultiple(files, type = 'image') {
    const results = [];

    for (const file of files) {
      try {
        const saved = await this.saveUpload(file, type);
        results.push({ success: true, data: saved });
      } catch (error) {
        results.push({ 
          success: false, 
          originalName: file.originalname,
          error: error.message,
        });
        // Clean up temp file
        await fs.unlink(file.path).catch(() => {});
      }
    }

    return results;
  }

  /**
   * Clean up temp files
   * @param {number} maxAge - Max age in milliseconds
   * @returns {Promise<number>}
   */
  async cleanupTemp(maxAge = 24 * 60 * 60 * 1000) {
    try {
      const tempDir = this.uploadDirs.temp;
      const files = await fs.readdir(tempDir);
      const now = Date.now();
      let deleted = 0;

      for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtimeMs > maxAge) {
          await fs.unlink(filePath);
          deleted++;
        }
      }

      return deleted;
    } catch (error) {
      logger.error('Failed to cleanup temp files:', error);
      return 0;
    }
  }

  /**
   * Validate uploaded file
   * @param {object} file - Multer file object
   * @param {string} type - File type
   * @returns {object}
   */
  validateFile(file, type = 'image') {
    const errors = [];

    if (!file) {
      errors.push('No file uploaded');
      return { valid: false, errors };
    }

    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    const allowed = type === 'image' 
      ? IMAGE_CONFIG.ALLOWED_EXTENSIONS 
      : AUDIO_CONFIG.ALLOWED_EXTENSIONS;

    if (!allowed.includes(ext)) {
      errors.push(`Invalid file type. Allowed: ${allowed.join(', ')}`);
    }

    const maxSize = type === 'image' 
      ? IMAGE_CONFIG.MAX_FILE_SIZE 
      : AUDIO_CONFIG.MAX_FILE_SIZE;

    if (file.size > maxSize) {
      errors.push(`File too large. Max: ${maxSize / (1024 * 1024)}MB`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get upload directory for type
   * @param {string} type - File type
   * @returns {string}
   */
  getUploadDir(type = 'image') {
    return type === 'image' 
      ? this.uploadDirs.images 
      : this.uploadDirs.music;
  }

  /**
   * Delete uploaded file
   * @param {string} filename - Filename
   * @param {string} type - File type
   * @returns {Promise<boolean>}
   */
  async deleteUpload(filename, type = 'image') {
    const dir = this.getUploadDir(type);
    const filePath = path.join(dir, filename);
    return fileService.deleteFile(filePath);
  }
}

module.exports = new UploadService();