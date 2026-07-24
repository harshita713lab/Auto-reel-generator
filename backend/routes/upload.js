const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// POST /api/upload - Upload multiple images
router.post('/', uploadController.uploadImages);

module.exports = router;