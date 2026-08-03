const express = require('express');
const router = express.Router();
const reelController = require('../controllers/reelController');

// ============================================================
// 1. STATIC & GENERAL ROUTES (Must be defined FIRST)
// ============================================================
router.get('/latest', reelController.getLatestReel);
router.get('/all', reelController.getAllReels);

const { TEMPLATE_MUSIC_MAP } = require('../config/templateMusicMap');

// Static endpoint for templates with fixed default songs
router.get('/templates', (req, res) => {
  const templates = [
    {
      id: 'simple_1',
      name: '🎬 Classic Slideshow',
      slideDuration: 4,
      transition: 'fade',
      effect: 'none',
      colorGrade: null,
      vignette: false,
      quality: 'high',
      minPhotos: 2,
      maxPhotos: 30,
      fixedMusic: TEMPLATE_MUSIC_MAP.simple_1.musicId,
      fixedMusicTitle: TEMPLATE_MUSIC_MAP.simple_1.musicTitle,
      description: 'Simple slideshow with fade'
    },
    {
      id: 'wedding_seq',
      name: '💒 Wedding Sequence',
      slideDuration: 3,
      transition: 'crossfade',
      effect: 'cinematic',
      colorGrade: 'rose',
      vignette: true,
      quality: 'high',
      minPhotos: 20,
      maxPhotos: 20,
      fixedMusic: TEMPLATE_MUSIC_MAP.wedding_seq.musicId,
      fixedMusicTitle: TEMPLATE_MUSIC_MAP.wedding_seq.musicTitle,
      description: 'Romantic wedding sequence for 20 photos'
    },
    {
      id: 'cinematic_wedding',
      name: '🎥 Cinematic Wedding Reel',
      slideDuration: 3.5,
      transition: 'blur',
      effect: 'lightLeak',
      colorGrade: 'warm',
      vignette: true,
      quality: 'high',
      minPhotos: 9,
      maxPhotos: 9,
      fixedMusic: TEMPLATE_MUSIC_MAP.cinematic_wedding.musicId,
      fixedMusicTitle: TEMPLATE_MUSIC_MAP.cinematic_wedding.musicTitle,
      description: 'Stunning cinematic wedding highlights for 9 photos'
    },
    {
      id: 'wedding_split',
      name: '🖼️ Wedding Split Slider',
      slideDuration: 3,
      transition: 'slide',
      effect: 'none',
      colorGrade: 'vibrant',
      vignette: false,
      quality: 'high',
      minPhotos: 11,
      maxPhotos: 11,
      fixedMusic: TEMPLATE_MUSIC_MAP.wedding_split.musicId,
      fixedMusicTitle: TEMPLATE_MUSIC_MAP.wedding_split.musicTitle,
      description: 'Split-screen slider layout for 11 photos'
    },
    {
      id: 'white_carousel',
      name: '🎠 White Card Carousel',
      slideDuration: 2.5,
      transition: 'fade',
      effect: 'kenBurns',
      colorGrade: null,
      vignette: false,
      quality: 'high',
      minPhotos: 10,
      maxPhotos: 10,
      fixedMusic: TEMPLATE_MUSIC_MAP.white_carousel.musicId,
      fixedMusicTitle: TEMPLATE_MUSIC_MAP.white_carousel.musicTitle,
      description: 'Elegant white-bordered carousel for 10 photos'
    },
    {
      id: 'white_masonry',
      name: '🧱 White Card Masonry',
      slideDuration: 3,
      transition: 'fade',
      effect: 'montage',
      colorGrade: 'cool',
      vignette: false,
      quality: 'high',
      minPhotos: 8,
      maxPhotos: 8,
      fixedMusic: TEMPLATE_MUSIC_MAP.white_masonry.musicId,
      fixedMusicTitle: TEMPLATE_MUSIC_MAP.white_masonry.musicTitle,
      description: 'Creative masonry layout for 8 photos'
    },
    {
      id: 'white_polaroid',
      name: '📸 White Card Polaroid Stack',
      slideDuration: 3,
      transition: 'fade',
      effect: 'none',
      colorGrade: 'rose',
      vignette: true,
      quality: 'high',
      minPhotos: 6,
      maxPhotos: 6,
      fixedMusic: TEMPLATE_MUSIC_MAP.white_polaroid.musicId,
      fixedMusicTitle: TEMPLATE_MUSIC_MAP.white_polaroid.musicTitle,
      description: 'Retro polaroid stack feel for 6 photos'
    },
    {
      id: 'premium_grid',
      name: '✨ Premium Grid',
      slideDuration: 3,
      transition: 'fade',
      effect: 'cinematic',
      colorGrade: 'hdr',
      vignette: false,
      quality: 'high',
      minPhotos: 4,
      maxPhotos: 4,
      fixedMusic: TEMPLATE_MUSIC_MAP.premium_grid.musicId,
      fixedMusicTitle: TEMPLATE_MUSIC_MAP.premium_grid.musicTitle,
      description: 'Modern 4-photo grid layout'
    },
    {
      id: 'memory_blend',
      name: '🌟 Memory Blend Reel',
      slideDuration: 3,
      transition: 'crossfade',
      effect: 'kenBurns',
      colorGrade: 'vibrant',
      vignette: false,
      quality: 'high',
      minPhotos: 2,
      maxPhotos: 100,
      fixedMusic: TEMPLATE_MUSIC_MAP.memory_blend.musicId,
      fixedMusicTitle: TEMPLATE_MUSIC_MAP.memory_blend.musicTitle,
      description: 'Dynamic blend suited for any photo count'
    }
  ];
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
router.post('/:id/restore', reelController.restoreReel);
router.delete('/:id/permanent', reelController.permanentDeleteReel);
router.get('/:id/status', reelController.getReelStatus);
router.get('/:id/download', reelController.downloadReel);
router.get('/:id/preview', reelController.getPreview);

module.exports = router;