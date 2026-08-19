const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');

const DIRECTORIES = {
  ROOT: ROOT_DIR,
  SRC: path.join(ROOT_DIR, 'src'),
  ASSETS: path.join(ROOT_DIR, 'assets'),
  MUSIC: path.join(ROOT_DIR, 'assets', 'music'),
  UPLOADS: path.join(ROOT_DIR, 'uploads'),
  IMAGES: path.join(ROOT_DIR, 'uploads', 'images'),
  MUSIC_UPLOAD: path.join(ROOT_DIR, 'uploads', 'music'),
  TEMP: path.join(ROOT_DIR, 'uploads', 'temp'),
  THUMBNAILS: path.join(ROOT_DIR, 'uploads', 'thumbnails'),
  OUTPUT: path.join(ROOT_DIR, 'output'),
  EXPORTS: path.join(ROOT_DIR, 'output', 'exports'),
  FRAMES: path.join(ROOT_DIR, 'output', 'frames'),
  PREVIEWS: path.join(ROOT_DIR, 'output', 'previews'),
  RENDERS: path.join(ROOT_DIR, 'output', 'renders'),
  CACHE: path.join(ROOT_DIR, 'cache'),
  REMOTION: path.join(ROOT_DIR, 'remotion'),
};

const VIDEO_CONFIG = {
  WIDTH: 1080,
  HEIGHT: 1920,
  FPS: 30,
  DEFAULT_DURATION: 10,
  CODEC: 'h264',
  PIXEL_FORMAT: 'yuv420p',
  PRESET: 'medium',
  CRF: 18,
  AUDIO_BITRATE: '192k',
  VIDEO_BITRATE: '8M',
};

const IMAGE_CONFIG = {
  MAX_WIDTH: 1080,
  MAX_HEIGHT: 1920,
  QUALITY: 90,
  FORMAT: 'jpeg',
  THUMBNAIL_WIDTH: 320,
  THUMBNAIL_HEIGHT: 180,
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp', 'gif','jfif'],
  MAX_FILE_SIZE: 10 * 1024 * 1024,
};

const AUDIO_CONFIG = {
  MAX_DURATION: 60,
  MIN_DURATION: 5,
  ALLOWED_EXTENSIONS: ['mp3', 'wav', 'aac', 'm4a'],
  MAX_FILE_SIZE: 25 * 1024 * 1024,
  DEFAULT_BPM: 120,
};

const RENDER_CONFIG = {
  MAX_IMAGES: 50,
  MIN_IMAGES: 1,
  SCENE_DURATION_MIN: 1.5,
  SCENE_DURATION_MAX: 8,
  DEFAULT_SCENE_DURATION: 3,
  TRANSITION_DURATION: 0.5,
  RENDER_TIMEOUT: 30 * 60 * 1000,
  MAX_CONCURRENT_RENDERS: 3,
};

const TEMPLATE_CONFIG = {
  AVAILABLE_TEMPLATES: [
    'wedding', 'birthday', 'travel', 'fashion', 
    'loveStory', 'baby', 'festival', 'memories',
    'corporate', 'productShowcase'
  ],
  DEFAULT_TEMPLATE: 'memories',
};

const ANIMATION_CONFIG = {
  AVAILABLE_ANIMATIONS: [
    'zoomIn', 'zoomOut', 'kenBurns', 'panLeft', 'panRight',
    'panUp', 'panDown', 'cameraPush', 'cameraPull', 'slowFloat',
    'parallax', 'rotate', 'tilt', 'bounce', 'shake',
    'reveal', 'fade', 'scale', 'blurIn', 'blurOut'
  ],
  DEFAULT_ANIMATION: 'kenBurns',
};

const TRANSITION_CONFIG = {
  AVAILABLE_TRANSITIONS: [
    'fade', 'crossFade', 'slideLeft', 'slideRight', 'slideUp',
    'slideDown', 'zoom', 'blur', 'flash', 'whipPan',
    'cameraMove', 'filmBurn', 'lightLeak', 'dissolve', 'morph'
  ],
  DEFAULT_TRANSITION: 'fade',
};

const EFFECT_CONFIG = {
  AVAILABLE_EFFECTS: [
    'lightLeak', 'lensFlare', 'glow', 'bloom', 'filmGrain',
    'dustParticles', 'bokeh', 'vignette', 'motionBlur',
    'floatingParticles', 'softShadows', 'colorOverlay',
    'gradientOverlay', 'noiseTexture'
  ],
};

const API_CONFIG = {
  VERSION: 'v1',
  BASE_PATH: '/api/v1',
  RATE_LIMIT_WINDOW: 15 * 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: 100,
};

module.exports = {
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
  ROOT_DIR,
};