// backend/routes/reel.js
const express = require('express');
const router = express.Router();
const reelController = require('../controllers/reelController');

// ✅ Debug - Check controller
console.log('✅ reelController loaded:', Object.keys(reelController));

// ✅ Check if controller functions exist before registering
if (typeof reelController.generateReel === 'function') {
  router.post('/generate', reelController.generateReel);
  console.log('✅ POST /generate registered');
} else {
  console.error('❌ generateReel is not a function!');
}

if (typeof reelController.generateReelWithShotstack === 'function') {
  router.post('/generate-shotstack', reelController.generateReelWithShotstack);
  console.log('✅ POST /generate-shotstack registered');
}

if (typeof reelController.getAllReels === 'function') {
  router.get('/all', reelController.getAllReels);
  console.log('✅ GET /all registered');
}

if (typeof reelController.getLatestReel === 'function') {
  router.get('/latest', reelController.getLatestReel);
  console.log('✅ GET /latest registered');
}

if (typeof reelController.deleteReel === 'function') {
  router.delete('/:id', reelController.deleteReel);
  console.log('✅ DELETE /:id registered');
}

module.exports = router;