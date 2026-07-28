const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

router.get('/', healthController.check);
router.get('/details', healthController.details);
router.get('/ping', healthController.ping);

module.exports = router;