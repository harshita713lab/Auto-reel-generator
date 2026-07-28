const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController');

// Music management
router.get('/', musicController.getAllMusic);
router.get('/:id', musicController.getMusicById);
router.post('/upload', musicController.uploadMusic);
router.delete('/:id', musicController.deleteMusic);

// Music analysis
router.get('/:id/analyze', musicController.analyzeMusic);
router.get('/:id/waveform', musicController.getWaveform);

// Music selection
router.post('/recommend', musicController.recommendMusic);
router.post('/sync', musicController.syncMusic);

module.exports = router;