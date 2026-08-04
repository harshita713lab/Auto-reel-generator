/**
 * Mapping of Template IDs, Composition IDs, and Photo Counts to their fixed default background audio files
 */
const TEMPLATE_MUSIC_MAP = {
  // Classic Slideshow / Default (< 4 photos)
  simple_1: { musicId: 'ReelAudio-1.mp3', musicTitle: 'Upbeat Melody (Track 1)' },
  ReelComposition: { musicId: 'ReelAudio-1.mp3', musicTitle: 'Upbeat Melody (Track 1)' },

  // Wedding Sequence (20 photos)
  wedding_seq: { musicId: 'ReelAudio-3.mp3', musicTitle: 'Romantic Wedding Theme (Track 3)' },
  WeddingSequenceComposition: { musicId: 'ReelAudio-3.mp3', musicTitle: 'Romantic Wedding Theme (Track 3)' },

  // Cinematic Wedding Reel (9 photos)
  cinematic_wedding: { musicId: 'ReelAudio-4.mp3', musicTitle: 'Cinematic Strings (Track 4)' },
  CinematicWeddingReel: { musicId: 'ReelAudio-4.mp3', musicTitle: 'Cinematic Strings (Track 4)' },

  // Wedding Split Slider (11 photos)
  wedding_split: { musicId: 'ReelAudio-5.mp3', musicTitle: 'Acoustic Love (Track 5)' },
  WeddingSplitSlider: { musicId: 'ReelAudio-5.mp3', musicTitle: 'Acoustic Love (Track 5)' },

  // White Card Carousel (10 photos)
  white_carousel: { musicId: 'ReelAudio-6.mp3', musicTitle: 'Modern Pop Beats (Track 6)' },
  WhiteCardCarousel: { musicId: 'ReelAudio-6.mp3', musicTitle: 'Modern Pop Beats (Track 6)' },

  // White Card Masonry (8 photos)
  white_masonry: { musicId: 'ReelAudio-8.mp3', musicTitle: 'Chill Vibes (Track 8)' },
  WhiteCardMasonry: { musicId: 'ReelAudio-8.mp3', musicTitle: 'Chill Vibes (Track 8)' },

  // White Card Polaroid Stack (6 photos)
  white_polaroid: { musicId: 'ReelAudio-9.mp3', musicTitle: 'Vintage Piano (Track 9)' },
  WhiteCardPolaroidStack: { musicId: 'ReelAudio-9.mp3', musicTitle: 'Vintage Piano (Track 9)' },

  // Premium Grid (4 photos)
  premium_grid: { musicId: 'ReelAudio-10.mp3', musicTitle: 'Luxury Ambient (Track 10)' },
  PremiumGrid: { musicId: 'ReelAudio-10.mp3', musicTitle: 'Luxury Ambient (Track 10)' },

  // Memory Blend Reel (Other photo counts)
  memory_blend: { musicId: 'ReelAudio-12.mp3', musicTitle: 'Nostalgic Harmony (Track 12)' },
  MemoryBlendReel: { musicId: 'ReelAudio-12.mp3', musicTitle: 'Nostalgic Harmony (Track 12)' },
};
// templte 15


/**
 * Get fixed default music filename based on templateId OR image count
 * @param {string} templateId - Template or composition ID
 * @param {number} [imageCount] - Number of images in the reel
 * @returns {string} Audio filename (e.g. 'ReelAudio-4.mp3')
 */
function getMusicForTemplate(templateId, imageCount) {
  // 1. Direct match by specific template ID / Composition name if not generic simple_1
  if (templateId && templateId !== 'simple_1' && TEMPLATE_MUSIC_MAP[templateId]) {
    return TEMPLATE_MUSIC_MAP[templateId].musicId;
  }

  // 2. Resolve by image count (matching renderService composition logic)
  if (typeof imageCount === 'number') {
    if (imageCount === 23) return TEMPLATE_MUSIC_MAP.wedding_seq.musicId;      // ReelAudio-3.mp3
    if (imageCount === 9) return TEMPLATE_MUSIC_MAP.cinematic_wedding.musicId;  // ReelAudio-4.mp3
    if (imageCount === 11) return TEMPLATE_MUSIC_MAP.wedding_split.musicId;    // ReelAudio-5.mp3
    if (imageCount === 10) return TEMPLATE_MUSIC_MAP.white_carousel.musicId;   // ReelAudio-6.mp3
    if (imageCount === 8) return TEMPLATE_MUSIC_MAP.white_masonry.musicId;     // ReelAudio-8.mp3
    if (imageCount === 6) return TEMPLATE_MUSIC_MAP.white_polaroid.musicId;    // ReelAudio-9.mp3
    if (imageCount === 4) return TEMPLATE_MUSIC_MAP.premium_grid.musicId;      // ReelAudio-10.mp3
    if (imageCount < 4) return TEMPLATE_MUSIC_MAP.simple_1.musicId;            // ReelAudio-1.mp3
    return TEMPLATE_MUSIC_MAP.memory_blend.musicId;                            // ReelAudio-12.mp3
  }

  if (templateId && TEMPLATE_MUSIC_MAP[templateId]) {
    return TEMPLATE_MUSIC_MAP[templateId].musicId;
  }

  return 'ReelAudio-1.mp3';
}

module.exports = {
  TEMPLATE_MUSIC_MAP,
  getMusicForTemplate,
};
