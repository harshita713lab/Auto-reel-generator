const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

// Get templates
router.get('/', templateController.getAllTemplates);
router.get('/:id', templateController.getTemplateById);
router.get('/:id/preview', templateController.getTemplatePreview);

// Template utilities
router.post('/recommend', templateController.recommendTemplate);
router.post('/customize', templateController.customizeTemplate);

module.exports = router;