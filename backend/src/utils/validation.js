// src/utils/validation.js
const fs = require('fs-extra');
const path = require('path');
const { MAX_IMAGES, MAX_IMAGE_SIZE, MAX_AUDIO_SIZE } = require('../config/env');

const validateImageFile = (file) => {
  const errors = [];
  
  // Check file size
  if (file.size > MAX_IMAGE_SIZE) {
    errors.push(`Image size exceeds maximum of ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`);
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
  if (!allowedTypes.includes(file.mimetype)) {
    errors.push(`Unsupported image format: ${file.mimetype}`);
  }
  
  // Check extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    errors.push(`Unsupported file extension: ${ext}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

const validateAudioFile = (file) => {
  const errors = [];
  
  if (file.size > MAX_AUDIO_SIZE) {
    errors.push(`Audio size exceeds maximum of ${MAX_AUDIO_SIZE / (1024 * 1024)}MB`);
  }
  
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/aac', 'audio/m4a', 'audio/flac'];
  if (!allowedTypes.includes(file.mimetype)) {
    errors.push(`Unsupported audio format: ${file.mimetype}`);
  }
  
  const allowedExtensions = ['.mp3', '.wav', '.aac', '.m4a', '.flac'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    errors.push(`Unsupported file extension: ${ext}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

const validateReelData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Reel name is required');
  }
  
  if (data.name && data.name.length > 100) {
    errors.push('Reel name must be less than 100 characters');
  }
  
  if (!data.template) {
    errors.push('Template selection is required');
  }
  
  if (data.images && data.images.length > MAX_IMAGES) {
    errors.push(`Maximum ${MAX_IMAGES} images allowed`);
  }
  
  if (data.images && data.images.length < 1) {
    errors.push('At least 2 images are required');
  }
  
  if (data.settings) {
    if (data.settings.duration && (data.settings.duration < 5 || data.settings.duration > 60)) {
      errors.push('Duration must be between 5 and 60 seconds');
    }
    
    if (data.settings.audioVolume !== undefined && (data.settings.audioVolume < 0 || data.settings.audioVolume > 1)) {
      errors.push('Audio volume must be between 0 and 1');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateImageFile,
  validateAudioFile,
  validateReelData,
};