const express = require('express');
const router = express.Router();
const renderController = require('../controllers/renderController');

// Render management
router.post('/:id', renderController.startRender);
router.get('/', renderController.getAllRenders);
router.get('/:id', renderController.getRenderStatus);
router.post('/:id/cancel', renderController.cancelRender);
router.delete('/:id', renderController.deleteRender);

// Rendering queues
router.get('/queue', renderController.getQueueStatus);
router.post('/retry/:id', renderController.retryRender);

module.exports = router;