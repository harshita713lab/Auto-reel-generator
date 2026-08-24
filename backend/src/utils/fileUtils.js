const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { IMAGE_CONFIG, MEDIA_VIDEO_CONFIG, AUDIO_CONFIG, DIRECTORIES } = require('../config/constants');

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(DIRECTORIES.IMAGES);
ensureDir(DIRECTORIES.VIDEOS);
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
  if (IMAGE_CONFIG.ALLOWED_EXTENSIONS.includes(ext) || (MEDIA_VIDEO_CONFIG && MEDIA_VIDEO_CONFIG.ALLOWED_EXTENSIONS.includes(ext))) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${ext}`), false);
  }
};

// Unified File Filter for Media (Images + Videos)
const mediaFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const isImage = IMAGE_CONFIG.ALLOWED_EXTENSIONS.includes(ext);
  const isVideo = MEDIA_VIDEO_CONFIG ? MEDIA_VIDEO_CONFIG.ALLOWED_EXTENSIONS.includes(ext) : ['mp4', 'mov', 'webm', 'avi', 'mkv'].includes(ext);
  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid media type: ${ext}. Allowed images: ${IMAGE_CONFIG.ALLOWED_EXTENSIONS.join(', ')} | Allowed videos: mp4, mov, webm, avi, mkv`), false);
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
    fileSize: MEDIA_VIDEO_CONFIG ? MEDIA_VIDEO_CONFIG.MAX_FILE_SIZE : 50 * 1024 * 1024,
    files: 50,
  },
});

// Upload middleware for media (Images + Videos)
const uploadMedia = multer({
  storage: imageStorage,
  fileFilter: mediaFilter,
  limits: {
    fileSize: MEDIA_VIDEO_CONFIG ? MEDIA_VIDEO_CONFIG.MAX_FILE_SIZE : 50 * 1024 * 1024,
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
  uploadMedia,
  uploadMusic,
  ensureDir,
};