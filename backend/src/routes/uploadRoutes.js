const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { uploadImages, uploadMusic } = require('../utils/fileUtils');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Upload images
router.post('/images', uploadImages.array('images', 50), uploadController.uploadImages);
router.post('/image', uploadImages.single('image'), uploadController.uploadImage);

// Upload music
router.post('/music', uploadMusic.single('music'), uploadController.uploadMusic);

// ============================================================
// ✂️ NEW: Background Removal Route for Cutout Stickers
// ============================================================
router.post('/remove-bg', uploadImages.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded' });
    }

    // uploadImages middleware se jo file save hui hai uska path
    const filePath = req.file.path;
    const formData = new FormData();
    formData.append('image_file', fs.createReadStream(filePath));
    formData.append('size', 'auto');

    // remove.bg API call
    const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': process.env.REMOVE_BG_API_KEY,
      },
      responseType: 'arraybuffer',
    });

    // Output transparent PNG save karne ke liye folder
    const outputDir = path.join(__dirname, '../../uploads/cutouts');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirNamesync ? fs.mkdirSync(outputDir, { recursive: true }) : fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFileName = `cutout-${Date.now()}.png`;
    const outputPath = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputPath, response.data);

    // Temporary original uploaded file ko clean up/delete kar sakte hain
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Frontend ya Remotion ke liye URL return karein
    res.json({
      success: true,
      cutoutUrl: `/uploads/cutouts/${outputFileName}`,
    });

  } catch (error) {
    console.error('Background removal error:', error.response?.data?.toString() || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete uploads
router.delete('/:type/:filename', uploadController.deleteFile);

// Get upload info
router.get('/:type/:filename', uploadController.getFileInfo);

module.exports = router;