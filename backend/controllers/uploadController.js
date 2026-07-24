// backend/controllers/uploadController.js
const multer = require('multer');
const path = require('path');
const { randomUUID } = require('crypto'); // Native crypto module
const fs = require('fs');

const uploadDir = process.env.UPLOAD_DIR || './uploads/temp';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = randomUUID(); // 👈 Yahan uuidv4() ki jagah randomUUID() kar diya hai!
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});

// Multer limits & filter
const upload = multer({
  storage,
  limits: {
    // ✅ Allow up to 100 images (100 * 10MB = 1GB)
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
    files: 100 // ✅ Maximum 100 files
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG, GIF, WebP, HEIC) are allowed'), false);
    }
  }
});

// Controller function
exports.uploadImages = (req, res) => {
  // ✅ Allow up to 100 images
  const maxImages = parseInt(process.env.MAX_IMAGES) || 100;
  
  upload.array('images', maxImages)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const filePaths = req.files.map(f => f.path);
    res.status(200).json({
      message: `✅ ${filePaths.length} images uploaded successfully`,
      files: filePaths,
      count: filePaths.length
    });
  });
};