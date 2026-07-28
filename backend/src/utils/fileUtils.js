const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { IMAGE_CONFIG, AUDIO_CONFIG, DIRECTORIES } = require('../config/constants');

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(DIRECTORIES.IMAGES);
ensureDir(DIRECTORIES.MUSIC_UPLOAD);
ensureDir(DIRECTORIES.TEMP);

// Image storage configuration
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIRECTORIES.TEMP);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

// Music storage configuration
const musicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIRECTORIES.MUSIC_UPLOAD);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

// File filter for images
const imageFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  if (IMAGE_CONFIG.ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid image type: ${ext}. Allowed: ${IMAGE_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`), false);
  }
};

// File filter for music
const musicFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  if (AUDIO_CONFIG.ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid music type: ${ext}. Allowed: ${AUDIO_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`), false);
  }
};

// Upload middleware for images
const uploadImages = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: IMAGE_CONFIG.MAX_FILE_SIZE,
    files: 50,
  },
});

// Upload middleware for music
const uploadMusic = multer({
  storage: musicStorage,
  fileFilter: musicFilter,
  limits: {
    fileSize: AUDIO_CONFIG.MAX_FILE_SIZE,
    files: 1,
  },
});

module.exports = {
  uploadImages,
  uploadMusic,
  ensureDir,
};