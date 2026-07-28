const logger = require('../../utils/logger');
const { EFFECT_CONFIG } = require('../../config/constants');

class EffectService {
  constructor() {
    this.effects = {
      lightLeak: this.lightLeak,
      lensFlare: this.lensFlare,
      glow: this.glow,
      bloom: this.bloom,
      filmGrain: this.filmGrain,
      dustParticles: this.dustParticles,
      bokeh: this.bokeh,
      vignette: this.vignette,
      motionBlur: this.motionBlur,
      floatingParticles: this.floatingParticles,
      softShadows: this.softShadows,
      colorOverlay: this.colorOverlay,
      gradientOverlay: this.gradientOverlay,
      noiseTexture: this.noiseTexture,
    };
  }

  /**
   * Get effect by name
   * @param {string} name - Effect name
   * @returns {Function}
   */
  getEffect(name) {
    return this.effects[name] || null;
  }

  /**
   * Get all effect names
   * @returns {Array}
   */
  getAllEffects() {
    return Object.keys(this.effects);
  }

  /**
   * Light leak effect
   */
  lightLeak(params = {}) {
    const { intensity = 0.3, color = '#FFA500' } = params;
    return {
      type: 'lightLeak',
      config: { intensity, color },
      description: 'Adds a warm light leak overlay',
    };
  }

  /**
   * Lens flare effect
   */
  lensFlare(params = {}) {
    const { intensity = 0.4, position = 'topRight' } = params;
    return {
      type: 'lensFlare',
      config: { intensity, position },
      description: 'Adds a lens flare effect',
    };
  }

  /**
   * Glow effect
   */
  glow(params = {}) {
    const { intensity = 0.5, color = '#FFFFFF', radius = 20 } = params;
    return {
      type: 'glow',
      config: { intensity, color, radius },
      description: 'Adds a soft glow around bright areas',
    };
  }

  /**
   * Bloom effect
   */
  bloom(params = {}) {
    const { threshold = 0.7, intensity = 0.5, radius = 30 } = params;
    return {
      type: 'bloom',
      config: { threshold, intensity, radius },
      description: 'Adds a bloom/glow effect to bright areas',
    };
  }

  /**
   * Film grain effect
   */
  filmGrain(params = {}) {
    const { intensity = 0.2, size = 2 } = params;
    return {
      type: 'filmGrain',
      config: { intensity, size },
      description: 'Adds a subtle film grain texture',
    };
  }

  /**
   * Dust particles effect
   */
  dustParticles(params = {}) {
    const { count = 50, size = 3, opacity = 0.3 } = params;
    return {
      type: 'dustParticles',
      config: { count, size, opacity },
      description: 'Adds floating dust particles',
    };
  }

  /**
   * Bokeh effect
   */
  bokeh(params = {}) {
    const { count = 30, size = 15, blur = 5 } = params;
    return {
      type: 'bokeh',
      config: { count, size, blur },
      description: 'Adds bokeh circles to the image',
    };
  }

  /**
   * Vignette effect
   */
  vignette(params = {}) {
    const { intensity = 0.5, radius = 0.8, color = '#000000' } = params;
    return {
      type: 'vignette',
      config: { intensity, radius, color },
      description: 'Adds a dark vignette around the edges',
    };
  }

  /**
   * Motion blur effect
   */
  motionBlur(params = {}) {
    const { intensity = 0.3, angle = 0 } = params;
    return {
      type: 'motionBlur',
      config: { intensity, angle },
      description: 'Adds motion blur in a specific direction',
    };
  }

  /**
   * Floating particles effect
   */
  floatingParticles(params = {}) {
    const { count = 100, size = 5, speed = 0.5, opacity = 0.4 } = params;
    return {
      type: 'floatingParticles',
      config: { count, size, speed, opacity },
      description: 'Adds floating particles with gentle movement',
    };
  }

  /**
   * Soft shadows effect
   */
  softShadows(params = {}) {
    const { intensity = 0.3, radius = 10 } = params;
    return {
      type: 'softShadows',
      config: { intensity, radius },
      description: 'Adds soft shadows to the image',
    };
  }

  /**
   * Color overlay effect
   */
  colorOverlay(params = {}) {
    const { color = '#000000', opacity = 0.2, blendMode = 'overlay' } = params;
    return {
      type: 'colorOverlay',
      config: { color, opacity, blendMode },
      description: 'Adds a color overlay to the image',
    };
  }

  /**
   * Gradient overlay effect
   */
  gradientOverlay(params = {}) {
    const { colors = ['#000000', '#FFFFFF'], direction = 'vertical', opacity = 0.3 } = params;
    return {
      type: 'gradientOverlay',
      config: { colors, direction, opacity },
      description: 'Adds a gradient overlay to the image',
    };
  }

  /**
   * Noise texture effect
   */
  noiseTexture(params = {}) {
    const { intensity = 0.2, size = 1 } = params;
    return {
      type: 'noiseTexture',
      config: { intensity, size },
      description: 'Adds a subtle noise texture',
    };
  }

  /**
   * Apply effects to frame
   * @param {Array} effects - Array of effect names or configs
   * @param {object} params - Parameters
   * @returns {Array}
   */
  applyEffects(effects = [], params = {}) {
    const applied = [];

    for (const effect of effects) {
      let effectConfig;
      if (typeof effect === 'string') {
        effectConfig = this.getEffect(effect);
        if (effectConfig) {
          effectConfig = effectConfig(params);
        }
      } else {
        effectConfig = effect;
      }

      if (effectConfig) {
        applied.push(effectConfig);
      }
    }

    return applied;
  }

  /**
   * Get default config for effect
   * @param {string} name - Effect name
   * @returns {object}
   */
  getDefaultConfig(name) {
    const defaults = {
      lightLeak: { intensity: 0.3, color: '#FFA500' },
      lensFlare: { intensity: 0.4, position: 'topRight' },
      glow: { intensity: 0.5, color: '#FFFFFF', radius: 20 },
      bloom: { threshold: 0.7, intensity: 0.5, radius: 30 },
      filmGrain: { intensity: 0.2, size: 2 },
      dustParticles: { count: 50, size: 3, opacity: 0.3 },
      bokeh: { count: 30, size: 15, blur: 5 },
      vignette: { intensity: 0.5, radius: 0.8, color: '#000000' },
      motionBlur: { intensity: 0.3, angle: 0 },
      floatingParticles: { count: 100, size: 5, speed: 0.5, opacity: 0.4 },
      softShadows: { intensity: 0.3, radius: 10 },
      colorOverlay: { color: '#000000', opacity: 0.2, blendMode: 'overlay' },
      gradientOverlay: { colors: ['#000000', '#FFFFFF'], direction: 'vertical', opacity: 0.3 },
      noiseTexture: { intensity: 0.2, size: 1 },
    };

    return defaults[name] || {};
  }
}

module.exports = new EffectService();