const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { uploadImages, uploadMusic } = require('../utils/fileUtils');

// Upload images
router.post('/images', uploadImages.array('images', 50), uploadController.uploadImages);
router.post('/image', uploadImages.single('image'), uploadController.uploadImage);

// Upload music
router.post('/music', uploadMusic.single('music'), uploadController.uploadMusic);

// Delete uploads
router.delete('/:type/:filename', uploadController.deleteFile);

// Get upload info
router.get('/:type/:filename', uploadController.getFileInfo);

module.exports = router;