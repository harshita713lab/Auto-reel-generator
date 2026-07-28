const express = require('express');
const router = express.Router();
const reelController = require('../controllers/reelController');

// CRUD operations
router.post('/', reelController.createReel);
router.get('/', reelController.getAllReels);
router.get('/:id', reelController.getReel);
router.put('/:id', reelController.updateReel);
router.delete('/:id', reelController.deleteReel);

// Process reel
router.post('/:id/process', reelController.processReel);
router.post('/:id/render', reelController.renderReel);
router.get('/:id/status', reelController.getReelStatus);
router.get('/:id/download', reelController.downloadReel);

// Preview
router.get('/:id/preview', reelController.getPreview);

module.exports = router;