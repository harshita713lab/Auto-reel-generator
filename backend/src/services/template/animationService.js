const logger = require('../../utils/logger');
const { ANIMATION_CONFIG } = require('../../config/constants');

class AnimationService {
  constructor() {
    this.animations = {
      zoomIn: this.zoomIn,
      zoomOut: this.zoomOut,
      kenBurns: this.kenBurns,
      panLeft: this.panLeft,
      panRight: this.panRight,
      panUp: this.panUp,
      panDown: this.panDown,
      cameraPush: this.cameraPush,
      cameraPull: this.cameraPull,
      slowFloat: this.slowFloat,
      parallax: this.parallax,
      rotate: this.rotate,
      tilt: this.tilt,
      bounce: this.bounce,
      shake: this.shake,
      reveal: this.reveal,
      fade: this.fade,
      scale: this.scale,
      blurIn: this.blurIn,
      blurOut: this.blurOut,
    };
  }

  /**
   * Get animation by name
   * @param {string} name - Animation name
   * @returns {Function}
   */
  getAnimation(name) {
    return this.animations[name] || this.animations.kenBurns;
  }

  /**
   * Get all animation names
   * @returns {Array}
   */
  getAllAnimations() {
    return Object.keys(this.animations);
  }

  /**
   * Zoom in animation
   */
  zoomIn(params) {
    const { progress, startScale = 1, endScale = 1.3 } = params;
    const scale = startScale + (endScale - startScale) * progress;
    return { scale, easing: 'easeInOut' };
  }

  /**
   * Zoom out animation
   */
  zoomOut(params) {
    const { progress, startScale = 1.3, endScale = 1 } = params;
    const scale = startScale + (endScale - startScale) * progress;
    return { scale, easing: 'easeInOut' };
  }

  /**
   * Ken Burns effect
   */
  kenBurns(params) {
    const { progress, startScale = 1.1, endScale = 1.4, startX = 0, startY = 0, endX = 10, endY = 10 } = params;
    const scale = startScale + (endScale - startScale) * progress;
    const x = startX + (endX - startX) * progress;
    const y = startY + (endY - startY) * progress;
    return { scale, x, y, easing: 'easeInOut' };
  }

  /**
   * Pan left
   */
  panLeft(params) {
    const { progress, x = 0 } = params;
    return { x: x - progress * 100, easing: 'easeOut' };
  }

  /**
   * Pan right
   */
  panRight(params) {
    const { progress, x = 0 } = params;
    return { x: x + progress * 100, easing: 'easeOut' };
  }

  /**
   * Pan up
   */
  panUp(params) {
    const { progress, y = 0 } = params;
    return { y: y - progress * 100, easing: 'easeOut' };
  }

  /**
   * Pan down
   */
  panDown(params) {
    const { progress, y = 0 } = params;
    return { y: y + progress * 100, easing: 'easeOut' };
  }

  /**
   * Camera push
   */
  cameraPush(params) {
    const { progress } = params;
    const scale = 1 + progress * 0.2;
    return { scale, easing: 'easeIn' };
  }

  /**
   * Camera pull
   */
  cameraPull(params) {
    const { progress } = params;
    const scale = 1.2 - progress * 0.2;
    return { scale, easing: 'easeOut' };
  }

  /**
   * Slow float
   */
  slowFloat(params) {
    const { progress, amplitude = 10, frequency = 1 } = params;
    const y = Math.sin(progress * Math.PI * 2 * frequency) * amplitude;
    return { y, easing: 'easeInOut' };
  }

  /**
   * Parallax effect
   */
  parallax(params) {
    const { progress, x = 0, y = 0, depth = 0.5 } = params;
    return {
      x: x + progress * depth * 20,
      y: y + progress * depth * 20,
      easing: 'easeInOut',
    };
  }

  /**
   * Rotate
   */
  rotate(params) {
    const { progress, degrees = 360 } = params;
    const rotation = progress * degrees;
    return { rotation, easing: 'easeInOut' };
  }

  /**
   * Tilt
   */
  tilt(params) {
    const { progress, maxTilt = 15 } = params;
    const tilt = Math.sin(progress * Math.PI) * maxTilt;
    return { rotation: tilt, easing: 'easeInOut' };
  }

  /**
   * Bounce
   */
  bounce(params) {
    const { progress, amplitude = 20 } = params;
    const bounce = Math.sin(progress * Math.PI * 4) * amplitude * (1 - progress);
    return { y: bounce, easing: 'easeOut' };
  }

  /**
   * Shake
   */
  shake(params) {
    const { progress, amplitude = 5 } = params;
    const shakeX = (Math.random() - 0.5) * amplitude * (1 - progress);
    const shakeY = (Math.random() - 0.5) * amplitude * (1 - progress);
    return { x: shakeX, y: shakeY, easing: 'linear' };
  }

  /**
   * Reveal
   */
  reveal(params) {
    const { progress } = params;
    const opacity = progress;
    const scale = 0.8 + progress * 0.2;
    return { opacity, scale, easing: 'easeOut' };
  }

  /**
   * Fade
   */
  fade(params) {
    const { progress, startOpacity = 0, endOpacity = 1 } = params;
    const opacity = startOpacity + (endOpacity - startOpacity) * progress;
    return { opacity, easing: 'easeInOut' };
  }

  /**
   * Scale
   */
  scale(params) {
    const { progress, startScale = 0.5, endScale = 1 } = params;
    const scale = startScale + (endScale - startScale) * progress;
    return { scale, easing: 'easeOut' };
  }

  /**
   * Blur in
   */
  blurIn(params) {
    const { progress, maxBlur = 10 } = params;
    const blur = maxBlur * (1 - progress);
    return { blur, opacity: progress, easing: 'easeOut' };
  }

  /**
   * Blur out
   */
  blurOut(params) {
    const { progress, maxBlur = 10 } = params;
    const blur = maxBlur * progress;
    const opacity = 1 - progress;
    return { blur, opacity, easing: 'easeIn' };
  }

  /**
   * Get default config for animation
   * @param {string} name - Animation name
   * @returns {object}
   */
  getDefaultConfig(name) {
    const defaults = {
      zoomIn: { startScale: 1, endScale: 1.3 },
      zoomOut: { startScale: 1.3, endScale: 1 },
      kenBurns: { startScale: 1.1, endScale: 1.4, startX: 0, startY: 0, endX: 10, endY: 10 },
      panLeft: { x: 0 },
      panRight: { x: 0 },
      panUp: { y: 0 },
      panDown: { y: 0 },
      cameraPush: {},
      cameraPull: {},
      slowFloat: { amplitude: 10, frequency: 1 },
      parallax: { depth: 0.5 },
      rotate: { degrees: 360 },
      tilt: { maxTilt: 15 },
      bounce: { amplitude: 20 },
      shake: { amplitude: 5 },
      reveal: {},
      fade: { startOpacity: 0, endOpacity: 1 },
      scale: { startScale: 0.5, endScale: 1 },
      blurIn: { maxBlur: 10 },
      blurOut: { maxBlur: 10 },
    };

    return defaults[name] || {};
  }
}

module.exports = new AnimationService();