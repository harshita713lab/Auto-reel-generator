const logger = require('../../utils/logger');
const { TRANSITION_CONFIG } = require('../../config/constants');

class TransitionService {
  constructor() {
    this.transitions = {
      fade: this.fade,
      crossFade: this.crossFade,
      slideLeft: this.slideLeft,
      slideRight: this.slideRight,
      slideUp: this.slideUp,
      slideDown: this.slideDown,
      zoom: this.zoom,
      blur: this.blur,
      flash: this.flash,
      whipPan: this.whipPan,
      cameraMove: this.cameraMove,
      filmBurn: this.filmBurn,
      lightLeak: this.lightLeak,
      dissolve: this.dissolve,
      morph: this.morph,
    };
  }

  /**
   * Get transition by name
   * @param {string} name - Transition name
   * @returns {Function}
   */
  getTransition(name) {
    return this.transitions[name] || this.transitions.fade;
  }

  /**
   * Get all transition names
   * @returns {Array}
   */
  getAllTransitions() {
    return Object.keys(this.transitions);
  }

  /**
   * Fade transition
   */
  fade(params = {}) {
    const { duration = 0.5 } = params;
    return {
      type: 'fade',
      duration,
      config: { opacity: [1, 0, 1] },
      description: 'Simple fade transition',
    };
  }

  /**
   * Cross fade transition
   */
  crossFade(params = {}) {
    const { duration = 0.5 } = params;
    return {
      type: 'crossFade',
      duration,
      config: { opacity: [1, 0, 1] },
      description: 'Cross fade between images',
    };
  }

  /**
   * Slide left transition
   */
  slideLeft(params = {}) {
    const { duration = 0.5 } = params;
    return {
      type: 'slideLeft',
      duration,
      config: { x: [0, -100, 0] },
      description: 'Slide left transition',
    };
  }

  /**
   * Slide right transition
   */
  slideRight(params = {}) {
    const { duration = 0.5 } = params;
    return {
      type: 'slideRight',
      duration,
      config: { x: [0, 100, 0] },
      description: 'Slide right transition',
    };
  }

  /**
   * Slide up transition
   */
  slideUp(params = {}) {
    const { duration = 0.5 } = params;
    return {
      type: 'slideUp',
      duration,
      config: { y: [0, -100, 0] },
      description: 'Slide up transition',
    };
  }

  /**
   * Slide down transition
   */
  slideDown(params = {}) {
    const { duration = 0.5 } = params;
    return {
      type: 'slideDown',
      duration,
      config: { y: [0, 100, 0] },
      description: 'Slide down transition',
    };
  }

  /**
   * Zoom transition
   */
  zoom(params = {}) {
    const { duration = 0.5, scale = 0.8 } = params;
    return {
      type: 'zoom',
      duration,
      config: { scale: [1, scale, 1] },
      description: 'Zoom transition',
    };
  }

  /**
   * Blur transition
   */
  blur(params = {}) {
    const { duration = 0.5, blurAmount = 10 } = params;
    return {
      type: 'blur',
      duration,
      config: { blur: [0, blurAmount, 0] },
      description: 'Blur transition',
    };
  }

  /**
   * Flash transition
   */
  flash(params = {}) {
    const { duration = 0.3, color = '#FFFFFF' } = params;
    return {
      type: 'flash',
      duration,
      config: { color, opacity: [0, 1, 0] },
      description: 'Flash transition',
    };
  }

  /**
   * Whip pan transition
   */
  whipPan(params = {}) {
    const { duration = 0.4, direction = 'right' } = params;
    const x = direction === 'right' ? [0, 200, 0] : [0, -200, 0];
    return {
      type: 'whipPan',
      duration,
      config: { x, blur: [0, 15, 0] },
      description: 'Whip pan transition',
    };
  }

  /**
   * Camera move transition
   */
  cameraMove(params = {}) {
    const { duration = 0.5, distance = 50, direction = 'right' } = params;
    const x = direction === 'right' ? [0, distance, 0] : [0, -distance, 0];
    return {
      type: 'cameraMove',
      duration,
      config: { x, scale: [1, 1.1, 1] },
      description: 'Camera move transition',
    };
  }

  /**
   * Film burn transition
   */
  filmBurn(params = {}) {
    const { duration = 0.6, intensity = 0.5 } = params;
    return {
      type: 'filmBurn',
      duration,
      config: { intensity, color: '#FF6B35' },
      description: 'Film burn transition',
    };
  }

  /**
   * Light leak transition
   */
  lightLeak(params = {}) {
    const { duration = 0.5, color = '#FFA500' } = params;
    return {
      type: 'lightLeak',
      duration,
      config: { color, opacity: [0, 0.5, 0] },
      description: 'Light leak transition',
    };
  }

  /**
   * Dissolve transition
   */
  dissolve(params = {}) {
    const { duration = 0.6, threshold = 0.5 } = params;
    return {
      type: 'dissolve',
      duration,
      config: { threshold, noise: 0.3 },
      description: 'Dissolve transition with noise',
    };
  }

  /**
   * Morph transition (placeholder)
   */
  morph(params = {}) {
    const { duration = 0.5 } = params;
    return {
      type: 'morph',
      duration,
      config: { morphAmount: 0.5 },
      description: 'Morph transition between images',
    };
  }

  /**
   * Get default config for transition
   * @param {string} name - Transition name
   * @returns {object}
   */
  getDefaultConfig(name) {
    const defaults = {
      fade: { duration: 0.5 },
      crossFade: { duration: 0.5 },
      slideLeft: { duration: 0.5 },
      slideRight: { duration: 0.5 },
      slideUp: { duration: 0.5 },
      slideDown: { duration: 0.5 },
      zoom: { duration: 0.5, scale: 0.8 },
      blur: { duration: 0.5, blurAmount: 10 },
      flash: { duration: 0.3, color: '#FFFFFF' },
      whipPan: { duration: 0.4, direction: 'right' },
      cameraMove: { duration: 0.5, distance: 50, direction: 'right' },
      filmBurn: { duration: 0.6, intensity: 0.5 },
      lightLeak: { duration: 0.5, color: '#FFA500' },
      dissolve: { duration: 0.6, threshold: 0.5 },
      morph: { duration: 0.5 },
    };

    return defaults[name] || {};
  }

  /**
   * Get transition timing
   * @param {string} name - Transition name
   * @param {number} duration - Duration
   * @param {number} progress - Progress (0-1)
   * @returns {object}
   */
  getTransitionTiming(name, duration, progress) {
    const transition = this.getTransition(name);
    const config = transition({ duration });

    // Calculate timing based on progress
    const easedProgress = this.easeInOut(progress);
    
    return {
      progress: easedProgress,
      duration: config.duration,
      config: config.config,
    };
  }

  /**
   * Ease in out function
   */
  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /**
   * Get transition duration based on BPM
   * @param {number} bpm - Beats per minute
   * @param {number} beatCount - Number of beats
   * @returns {number}
   */
  getDurationFromBPM(bpm, beatCount = 1) {
    if (!bpm || bpm <= 0) return 0.5;
    const beatDuration = 60 / bpm;
    return beatDuration * beatCount;
  }
}

module.exports = new TransitionService();