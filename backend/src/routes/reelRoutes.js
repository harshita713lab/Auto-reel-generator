const express = require('express');
const router = express.Router();
const reelController = require('../controllers/reelController');

// ============================================================
// 1. STATIC & GENERAL ROUTES (Must be defined FIRST)
// ============================================================
router.get('/latest', reelController.getLatestReel);
router.get('/all', reelController.getAllReels);

const { TEMPLATE_MUSIC_MAP, getMusicForTemplate } = require('../config/templateMusicMap');

// Static endpoint for templates with fixed default songs
router.get('/templates', (req, res) => {
  const { getRequiredImageCount } = require('../config/templateImageCounts');

  const rawTemplates = [
    {
      id: 'simple_1',
      name: '🎬 Classic Slideshow (Template 1)',
      slideDuration: 4,
      transition: 'fade',
      effect: 'none',
      colorGrade: null,
      vignette: false,
      quality: 'high',
      minPhotos: 14,
      maxPhotos: 14,
      description: 'Classic slideshow designed for exactly 14 photos'
    },
    {
      id: 'wedding_seq',
      name: '💒 Wedding Sequence (Template 20)',
      slideDuration: 3,
      transition: 'crossfade',
      effect: 'cinematic',
      colorGrade: 'rose',
      vignette: true,
      quality: 'high',
      minPhotos: 14,
      maxPhotos: 14,
      description: 'Romantic wedding sequence designed for exactly 14 photos'
    },
    {
      id: 'cinematic_wedding',
      name: '🎥 Cinematic Wedding Reel (Template 9)',
      slideDuration: 3.5,
      transition: 'blur',
      effect: 'lightLeak',
      colorGrade: 'warm',
      vignette: true,
      quality: 'high',
      minPhotos: 15,
      maxPhotos: 15,
      description: 'Stunning cinematic wedding highlights designed for exactly 15 photos'
    },
    {
      id: 'wedding_split',
      name: '🖼️ Wedding Split Slider (Template 3)',
      slideDuration: 3,
      transition: 'slide',
      effect: 'none',
      colorGrade: 'vibrant',
      vignette: false,
      quality: 'high',
      minPhotos: 11,
      maxPhotos: 11,
      description: 'Split-screen slider layout designed for exactly 11 photos'
    },
    {
      id: 'white_carousel',
      name: '🎠 White Card Carousel (Template 10)',
      slideDuration: 2.5,
      transition: 'fade',
      effect: 'kenBurns',
      colorGrade: null,
      vignette: false,
      quality: 'high',
      minPhotos: 16,
      maxPhotos: 16,
      description: 'Elegant white-bordered carousel designed for exactly 16 photos'
    },
    {
      id: 'white_masonry',
      name: '🧱 White Card Masonry (Template 7)',
      slideDuration: 3,
      transition: 'fade',
      effect: 'montage',
      colorGrade: 'cool',
      vignette: false,
      quality: 'high',
      minPhotos: 8,
      maxPhotos: 8,
      description: 'Creative masonry layout designed for exactly 8 photos'
    },
    {
      id: 'white_polaroid',
      name: '📸 White Card Polaroid Stack (Template 11)',
      slideDuration: 3,
      transition: 'fade',
      effect: 'none',
      colorGrade: 'rose',
      vignette: true,
      quality: 'high',
      minPhotos: 18,
      maxPhotos: 18,
      description: 'Retro polaroid stack feel designed for exactly 18 photos'
    },
    {
      id: 'premium_grid',
      name: '✨ Premium Grid (Template 15)',
      slideDuration: 3,
      transition: 'fade',
      effect: 'cinematic',
      colorGrade: 'hdr',
      vignette: false,
      quality: 'high',
      minPhotos: 4,
      maxPhotos: 4,
      description: 'Modern 4-photo grid layout designed for exactly 4 photos'
    },
    {
      id: 'Template25',
      name: '🌹 Template 25 (Romantic Story)',
      slideDuration: 3,
      transition: 'fade',
      effect: 'cinematic',
      colorGrade: 'rose',
      vignette: true,
      quality: 'high',
      minPhotos: 24,
      maxPhotos: 24,
      description: 'Romantic 3-scene wedding story designed for exactly 24 photos'
    },
    {
      id: 'Template26',
      name: '💖 Template 26 (Love Story)',
      slideDuration: 3,
      transition: 'fade',
      effect: 'cinematic',
      colorGrade: 'warm',
      vignette: true,
      quality: 'high',
      minPhotos: 9,
      maxPhotos: 9,
      description: 'Animated 3-scene wedding & love story designed for exactly 9 photos'
    },
    {
      id: 'Template27',
      name: '🎬 Template 27 (Cinematic Grid Slider)',
      slideDuration: 3,
      transition: 'slide',
      effect: 'cinematic',
      colorGrade: 'hdr',
      vignette: true,
      quality: 'high',
      minPhotos: 9,
      maxPhotos: 9,
      description: 'Multi-scene grid & slider showcase designed for exactly 9 photos'
    },
    {
      id: 'Template28',
      name: '✨ Template 28 (B&W Color Pop & Slide)',
      slideDuration: 3,
      transition: 'slide',
      effect: 'cinematic',
      colorGrade: 'vibrant',
      vignette: true,
      quality: 'high',
      minPhotos: 22,
      maxPhotos: 22,
      description: 'B&W grid to color pop transition designed for exactly 22 photos'
    },
    {
      id: 'Template29',
      name: '💎 Template 29 (Shattered Prism & 3D Cube)',
      slideDuration: 3,
      transition: 'crossfade',
      effect: 'cinematic',
      colorGrade: 'warm',
      vignette: true,
      quality: 'high',
      minPhotos: 9,
      maxPhotos: 9,
      description: 'Shattered prism assemble & 3D cube turn designed for exactly 9 photos'
    },
    {
      id: 'Template30',
      name: '📜 Template 30 (Vertical Card Scroll)',
      slideDuration: 3,
      transition: 'fade',
      effect: 'cinematic',
      colorGrade: 'rose',
      vignette: true,
      quality: 'high',
      minPhotos: 8,
      maxPhotos: 8,
      description: 'Continuous vertical card scrolling designed for exactly 8 photos'
    },
    {
      id: 'Template31',
      name: '🌸 Template 31 (Flower & Bottom-Up Cards)',
      slideDuration: 3.5,
      transition: 'fade',
      effect: 'cinematic',
      colorGrade: 'rose',
      vignette: true,
      quality: 'high',
      minPhotos: 8,
      maxPhotos: 8,
      description: 'Romantic flower intro and bottom-up card animation designed for exactly 8 photos'
    },
    {
      id: 'Template32',
      name: '🎞️ Template 32 (Fast Dynamic Showcase)',
      slideDuration: 2.5,
      transition: 'fast_cut',
      effect: 'cinematic',
      colorGrade: 'vibrant',
      vignette: false,
      quality: 'high',
      minPhotos: 25,
      maxPhotos: 25,
      description: 'Fast energetic multi-shot sequence designed for exactly 25 photos'
    },
    {
      id: 'Template33',
      name: '💗 Template 33 (Grid to Framed Fullscreen)',
      slideDuration: 3,
      transition: 'slide',
      effect: 'cinematic',
      colorGrade: 'warm',
      vignette: true,
      quality: 'high',
      minPhotos: 4,
      maxPhotos: 4,
      description: 'Masonry grid transition into framed fullscreen photos designed for exactly 4 photos'
    },
    {
      id: 'Template34',
      name: '🔥 Template 34 (Neon Chaleya Grand Finale)',
      slideDuration: 3,
      transition: 'whipPan',
      effect: 'cinematic',
      colorGrade: 'vibrant',
      vignette: true,
      quality: 'high',
      minPhotos: 19,
      maxPhotos: 19,
      description: 'High energy neon cuts, 3D cube & grand finale designed for exactly 19 photos'
    },
    {
      id: 'Template35',
      name: '💖 Template 35 (Apna Bana Le Piya - Photo Stack & Glowing Split)',
      slideDuration: 3.5,
      transition: 'crossfade',
      effect: 'cinematic',
      colorGrade: 'rose',
      vignette: true,
      quality: 'high',
      minPhotos: 25,
      maxPhotos: 25,
      description: 'Cursive lyrics, physical photo stacking & glowing split slide reveal designed for exactly 25 photos'
    }
  ];

  // Guarantee minPhotos and maxPhotos are synchronized to exact required count, and music is safely populated
  const templates = rawTemplates.map((t) => {
    const exactCount = getRequiredImageCount(t.id);
    const musicFile = getMusicForTemplate(t.id);
    const musicInfo = TEMPLATE_MUSIC_MAP?.[t.id];
    return {
      ...t,
      minPhotos: exactCount || t.minPhotos,
      maxPhotos: exactCount || t.maxPhotos,
      fixedMusic: musicInfo?.musicId || t.fixedMusic || musicFile,
      fixedMusicTitle: musicInfo?.musicTitle || t.fixedMusicTitle || musicFile.replace('.mp3', ''),
    };
  });

  return res.json({ success: true, templates });
});

// Special list endpoints (Place before dynamic :id routes)
router.get('/trash', reelController.getTrash);
router.get('/downloads/history', reelController.getDownloadHistory);
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
router.post('/:id/duplicate', reelController.duplicateReel);
router.post('/:id/change-music', reelController.changeMusic);
router.post('/:id/restore', reelController.restoreReel);
router.delete('/:id/permanent', reelController.permanentDeleteReel);
router.get('/:id/status', reelController.getReelStatus);
router.get('/:id/download', reelController.downloadReel);
router.get('/:id/preview', reelController.getPreview);

module.exports = router;