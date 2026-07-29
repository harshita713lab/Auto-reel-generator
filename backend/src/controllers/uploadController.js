const path = require('path');
const fs = require('fs').promises;
const imageService = require('../services/image/imageService');
const optimizeImages = require('../services/image/optimizeImages');
const thumbnailService = require('../services/image/thumbnailService');
const fileService = require('../services/storage/fileService');
const logger = require('../utils/logger');
const { IMAGE_CONFIG, DIRECTORIES } = require('../config/constants');

/**
 * Upload images
 */
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const uploadedFiles = [];
    const errors = [];

    for (const file of req.files) {
      try {
        // Validate file
        const ext = file.originalname.split('.').pop().toLowerCase();
        if (!IMAGE_CONFIG.ALLOWED_EXTENSIONS.includes(ext)) {
          errors.push({
            file: file.originalname,
            error: 'Invalid file type',
          });
          continue;
        }

        // Validate size
        if (file.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
          errors.push({
            file: file.originalname,
            error: 'File too large',
          });
          continue;
        }

        // Process image
        const processed = await processUploadedImage(file);
        uploadedFiles.push(processed);

      } catch (error) {
        errors.push({
          file: file.originalname,
          error: error.message,
        });
      }
    }

    // ✅ FIX: Send `files` & `data` directly as array so Frontend extracts it seamlessly
    res.json({
      success: true,
      files: uploadedFiles, // 👈 Frontend uploadData.files ise padhega
      data: uploadedFiles,  // 👈 Fallback support
      uploaded: uploadedFiles,
      errors: errors,
      total: uploadedFiles.length,
      message: `${uploadedFiles.length} images uploaded successfully`,
    });
  } catch (error) {
    logger.error('Image upload failed:', error);
    res.status(500).json({
      error: 'Failed to upload images',
      message: error.message,
    });
  }
};

/**
 * Process uploaded image
 */
async function processUploadedImage(file) {
  const timestamp = Date.now();
  const ext = file.originalname.split('.').pop();
  const filename = `image_${timestamp}.${ext}`;
  const originalPath = file.path;

  try {
    // Generate unique filename
    const imagePath = path.join(DIRECTORIES.IMAGES, filename);
    
    // Optimize image
    const optimized = await optimizeImages.optimizeImage(originalPath, {
      maxWidth: IMAGE_CONFIG.MAX_WIDTH,
      maxHeight: IMAGE_CONFIG.MAX_HEIGHT,
      quality: IMAGE_CONFIG.QUALITY,
      format: IMAGE_CONFIG.FORMAT,
    });

    // Save optimized image
    await fs.writeFile(imagePath, optimized.buffer);

    // Generate thumbnail
    const thumbnail = await thumbnailService.generateThumbnail(optimized.buffer, {
      width: IMAGE_CONFIG.THUMBNAIL_WIDTH,
      height: IMAGE_CONFIG.THUMBNAIL_HEIGHT,
    });

    const thumbnailFilename = `thumb_${timestamp}.jpg`;
    const thumbnailPath = path.join(DIRECTORIES.THUMBNAILS, thumbnailFilename);
    await fs.writeFile(thumbnailPath, thumbnail.buffer);

    // Get image info
    const info = await imageService.getImageInfo(optimized.buffer);

    // Clean up temp file
    await fs.unlink(originalPath).catch(() => {});

    return {
      filename,
      originalName: file.originalname,
      path: imagePath.replace(/\\/g, '/'), // Normalizing slash for cross-platform
      url: `/uploads/images/${filename}`,
      thumbnail: thumbnailFilename,
      thumbnailPath: thumbnailPath.replace(/\\/g, '/'),
      size: optimized.buffer.length,
      width: info.width,
      height: info.height,
      format: info.format,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    // Clean up on error
    await fs.unlink(originalPath).catch(() => {});
    throw error;
  }
}

/**
 * Upload single image (alias for routes)
 */
exports.uploadImage = async (req, res) => {
  return exports.uploadSingleImage(req, res);
};

exports.uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const processed = await processUploadedImage(req.file);

    res.json({
      success: true,
      data: processed,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    logger.error('Single image upload failed:', error);
    res.status(500).json({
      error: 'Failed to upload image',
      message: error.message,
    });
  }
};

/**
 * Upload multiple images with different options
 */
exports.uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const { optimize = 'true', generateThumbnails = 'true' } = req.query;
    const results = [];

    for (const file of req.files) {
      try {
        let processed = {
          originalName: file.originalname,
          size: file.size,
        };

        if (optimize === 'true') {
          const optimized = await optimizeImages.optimizeImage(file.path, {
            maxWidth: IMAGE_CONFIG.MAX_WIDTH,
            maxHeight: IMAGE_CONFIG.MAX_HEIGHT,
            quality: IMAGE_CONFIG.QUALITY,
          });

          const filename = `opt_${Date.now()}_${file.originalname}`;
          const savePath = path.join(DIRECTORIES.IMAGES, filename);
          await fs.writeFile(savePath, optimized.buffer);
          
          processed.filename = filename;
          processed.path = savePath.replace(/\\/g, '/');
          processed.url = `/uploads/images/${filename}`;
          processed.optimizedSize = optimized.buffer.length;
          processed.width = optimized.width;
          processed.height = optimized.height;

          if (generateThumbnails === 'true') {
            const thumbnail = await thumbnailService.generateThumbnail(optimized.buffer);
            const thumbFilename = `thumb_${Date.now()}_${file.originalname}`;
            const thumbPath = path.join(DIRECTORIES.THUMBNAILS, thumbFilename);
            await fs.writeFile(thumbPath, thumbnail.buffer);
            processed.thumbnail = thumbFilename;
            processed.thumbnailPath = thumbPath.replace(/\\/g, '/');
          }
        }

        await fs.unlink(file.path).catch(() => {});
        results.push(processed);
      } catch (error) {
        results.push({
          originalName: file.originalname,
          error: error.message,
        });
        await fs.unlink(file.path).catch(() => {});
      }
    }

    const successful = results.filter(r => !r.error);
    const failed = results.filter(r => r.error);

    res.json({
      success: true,
      files: successful, // 👈 Added direct `files` key
      data: {
        successful,
        failed,
        total: results.length,
        successCount: successful.length,
        failedCount: failed.length,
      },
      message: `${successful.length} images uploaded successfully`,
    });
  } catch (error) {
    logger.error('Multiple image upload failed:', error);
    res.status(500).json({
      error: 'Failed to upload images',
      message: error.message,
    });
  }
};

/**
 * Delete file by type and filename
 */
exports.deleteFile = async (req, res) => {
  const { type, filename } = req.params;
  
  if (type === 'images') {
    return exports.deleteImage(req, res);
  } else if (type === 'music') {
    return exports.deleteMusic(req, res);
  }
  
  return res.status(400).json({ error: 'Invalid file type' });
};

/**
 * Get file info
 */
exports.getFileInfo = async (req, res) => {
  const { type, filename } = req.params;
  
  if (type === 'images') {
    const filePath = path.join(DIRECTORIES.IMAGES, filename);
    try {
      await fs.access(filePath);
      const stats = await fs.stat(filePath);
      return res.json({
        success: true,
        data: {
          filename,
          path: filePath,
          size: stats.size,
          modifiedAt: stats.mtime,
        },
      });
    } catch {
      return res.status(404).json({ error: 'File not found' });
    }
  }
  
  return res.status(400).json({ error: 'Invalid file type' });
};

/**
 * Upload music
 */
exports.uploadMusic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No music file uploaded' });
    }

    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        uploadedAt: new Date().toISOString(),
      },
      message: 'Music uploaded successfully',
    });
  } catch (error) {
    logger.error('Music upload failed:', error);
    res.status(500).json({
      error: 'Failed to upload music',
      message: error.message,
    });
  }
};

/**
 * Delete uploaded image
 */
exports.deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    
    const imagePath = path.join(DIRECTORIES.IMAGES, filename);
    await fileService.deleteFile(imagePath);

    const thumbPath = path.join(DIRECTORIES.THUMBNAILS, `thumb_${filename}`);
    await fileService.deleteFile(thumbPath).catch(() => {});

    logger.info(`Image deleted: ${filename}`);

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    logger.error('Failed to delete image:', error);
    res.status(500).json({
      error: 'Failed to delete image',
      message: error.message,
    });
  }
};

/**
 * Delete uploaded music
 */
exports.deleteMusic = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(DIRECTORIES.MUSIC_UPLOAD, filename);
    await fileService.deleteFile(filePath);
    
    logger.info(`Music deleted: ${filename}`);
    
    res.json({
      success: true,
      message: 'Music deleted successfully',
    });
  } catch (error) {
    logger.error('Failed to delete music:', error);
    res.status(500).json({
      error: 'Failed to delete music',
      message: error.message,
    });
  }
};

/**
 * Get upload history
 */
exports.getUploadHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const files = await fs.readdir(DIRECTORIES.IMAGES);
    const imageFiles = files.filter(f => 
      IMAGE_CONFIG.ALLOWED_EXTENSIONS.includes(f.split('.').pop().toLowerCase())
    );

    const fileData = await Promise.all(
      imageFiles.map(async (filename) => {
        const filePath = path.join(DIRECTORIES.IMAGES, filename);
        const stats = await fs.stat(filePath);
        return {
          filename,
          path: filePath,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime,
          hasThumbnail: await fs.access(
            path.join(DIRECTORIES.THUMBNAILS, `thumb_${filename}`)
          ).then(() => true).catch(() => false),
        };
      })
    );

    fileData.sort((a, b) => b.modifiedAt - a.modifiedAt);

    const start = (parseInt(page) - 1) * parseInt(limit);
    const end = start + parseInt(limit);
    const paginated = fileData.slice(start, end);

    res.json({
      success: true,
      data: paginated,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: fileData.length,
        pages: Math.ceil(fileData.length / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error('Failed to get upload history:', error);
    res.status(500).json({
      error: 'Failed to get upload history',
      message: error.message,
    });
  }
};