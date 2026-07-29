const express = require('express');
const router = express.Router();
const reelController = require('../controllers/reelController');

// ============================================================
// 1. SPECIFIC ROUTES (Inhe hamesha sabse UPAR rakhein)
// ============================================================
router.get('/latest', reelController.getLatestReel);
router.get('/all', reelController.getAllReels);

// Agar koi static endpoint hai jaise templates ya status:
router.get('/templates', (req, res) => res.json({ success: true, templates: [] }));

// ============================================================
// 2. DYNAMIC ROUTES / DYNAMIC ID (Inhe NICHE rakhein)
// ============================================================
router.get('/:id', reelController.getReel);
router.put('/:id', reelController.updateReel);
router.delete('/:id', reelController.deleteReel);

// Process & Render
router.post('/generate', reelController.createReel);
router.post('/', reelController.createReel);
router.post('/:id/process', reelController.processReel);
router.post('/:id/render', reelController.renderReel);
router.get('/:id/status', reelController.getReelStatus);
router.get('/:id/download', reelController.downloadReel);
router.get('/:id/preview', reelController.getPreview);

module.exports = router;