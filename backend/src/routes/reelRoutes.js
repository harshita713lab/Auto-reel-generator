const express = require('express');
const router = express.Router();
const reelController = require('../controllers/reelController');

// ============================================================
// 1. STATIC & GENERAL ROUTES (Must be defined FIRST)
// ============================================================
router.get('/latest', reelController.getLatestReel);
router.get('/all', reelController.getAllReels);

// Static endpoint for templates test
router.get('/templates', (req, res) => res.json({ success: true, templates: [] }));

// Creation Endpoints (Place before dynamic :id routes)
router.post('/generate', reelController.createReel);
router.post('/', reelController.createReel);

// ============================================================
// 2. DYNAMIC ROUTES (:id Parameters)
// ============================================================
// Fetch single reel
router.get('/:id', reelController.getReel);

// Update / Delete reel
router.put('/:id', reelController.updateReel);
router.delete('/:id', reelController.deleteReel);

// Action endpoints on specific reel
router.post('/:id/process', reelController.processReel);
router.post('/:id/render', reelController.renderReel);
router.get('/:id/status', reelController.getReelStatus);
router.get('/:id/download', reelController.downloadReel);
router.get('/:id/preview', reelController.getPreview);

module.exports = router;