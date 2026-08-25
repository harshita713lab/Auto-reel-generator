const {
  DIRECTORIES,
  VIDEO_CONFIG,
  IMAGE_CONFIG,
  AUDIO_CONFIG,
  RENDER_CONFIG,
  TEMPLATE_CONFIG,
  ANIMATION_CONFIG,
  TRANSITION_CONFIG,
  EFFECT_CONFIG,
  API_CONFIG,
  ROOT_DIR
} = require('../src/config/constants');

const { TEMPLATE_IMAGE_COUNTS, getRequiredImageCount } = require('../src/config/templateImageCounts');
const { TEMPLATE_MUSIC_MAP, getMusicForTemplate } = require('../src/config/templateMusicMap');

describe('Configuration Modules Test Suite', () => {
  describe('Constants Configuration', () => {
    test('Directories config should contain valid absolute paths', () => {
      expect(DIRECTORIES.ROOT).toBeDefined();
      expect(DIRECTORIES.SRC).toContain('src');
      expect(DIRECTORIES.UPLOADS).toContain('uploads');
      expect(DIRECTORIES.OUTPUT).toContain('output');
    });

    test('Video config should define correct vertical reel specs', () => {
      expect(VIDEO_CONFIG.WIDTH).toBe(1080);
      expect(VIDEO_CONFIG.HEIGHT).toBe(1920);
      expect(VIDEO_CONFIG.FPS).toBe(30);
      expect(VIDEO_CONFIG.CODEC).toBe('h264');
    });

    test('Image config should specify allowed extensions and quality', () => {
      expect(IMAGE_CONFIG.QUALITY).toBe(90);
      expect(IMAGE_CONFIG.ALLOWED_EXTENSIONS).toContain('jpg');
      expect(IMAGE_CONFIG.ALLOWED_EXTENSIONS).toContain('png');
      expect(IMAGE_CONFIG.ALLOWED_EXTENSIONS).toContain('webp');
    });

    test('Audio config should define valid BPM and extensions', () => {
      expect(AUDIO_CONFIG.DEFAULT_BPM).toBe(120);
      expect(AUDIO_CONFIG.ALLOWED_EXTENSIONS).toContain('mp3');
    });

    test('Template & Effect configs should expose available items', () => {
      expect(TEMPLATE_CONFIG.AVAILABLE_TEMPLATES.length).toBeGreaterThan(0);
      expect(ANIMATION_CONFIG.AVAILABLE_ANIMATIONS).toContain('kenBurns');
      expect(TRANSITION_CONFIG.AVAILABLE_TRANSITIONS).toContain('fade');
      expect(EFFECT_CONFIG.AVAILABLE_EFFECTS).toContain('vignette');
    });
  });

  describe('Template Image Counts Config', () => {
    test('Should return exact required image count for Template 38', () => {
      expect(getRequiredImageCount('Template38')).toBe(1);
    });

    test('Should return exact required image count for Template 1', () => {
      expect(getRequiredImageCount('Template1')).toBe(14);
    });

    test('Should handle null/empty input safely', () => {
      expect(getRequiredImageCount(null)).toBeNull();
      expect(getRequiredImageCount('')).toBeNull();
    });

    test('Should handle string template names with numbers', () => {
      expect(getRequiredImageCount('template_10')).toBe(16);
      expect(getRequiredImageCount('Template 25')).toBe(24);
    });
  });

  describe('Template Music Map Config', () => {
    test('Should map defined templates to correct audio file', () => {
      const music = getMusicForTemplate('Template35');
      expect(music).toBe('ReelAudio-35.mp3');
    });

    test('Should fallback safely for unknown templates', () => {
      const music = getMusicForTemplate('UnknownTemplate999');
      expect(music).toBeDefined();
      expect(typeof music).toBe('string');
    });
  });
});
