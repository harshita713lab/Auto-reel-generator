/**
 * Easing functions for animations
 */
export const easing = {
  /**
   * Linear easing
   */
  linear: (t: number): number => t,

  /**
   * Ease in (accelerate)
   */
  easeIn: (t: number): number => t * t,

  /**
   * Ease out (decelerate)
   */
  easeOut: (t: number): number => 1 - (1 - t) * (1 - t),

  /**
   * Ease in out (smooth)
   */
  easeInOut: (t: number): number => 
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,

  /**
   * Cubic ease in
   */
  easeInCubic: (t: number): number => t * t * t,

  /**
   * Cubic ease out
   */
  easeOutCubic: (t: number): number => 1 - Math.pow(1 - t, 3),

  /**
   * Cubic ease in out
   */
  easeInOutCubic: (t: number): number => 
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,

  /**
   * Quadratic ease in
   */
  easeInQuad: (t: number): number => t * t,

  /**
   * Quadratic ease out
   */
  easeOutQuad: (t: number): number => 1 - (1 - t) * (1 - t),

  /**
   * Quadratic ease in out
   */
  easeInOutQuad: (t: number): number => 
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,

  /**
   * Elastic ease (bouncy)
   */
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  /**
   * Bounce ease
   */
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },

  /**
   * Spring easing (realistic)
   */
  spring: (t: number): number => {
    return 1 - Math.pow(1 - t, 3) * Math.cos(t * Math.PI * 0.5);
  },

  /**
   * Custom bezier easing
   */
  bezier: (t: number, p1: number, p2: number): number => {
    // Simplified bezier approximation
    const c = 1 - t;
    return c * c * c * 0 + 3 * c * c * t * p1 + 3 * c * t * t * p2 + t * t * t * 1;
  },

  /**
   * Get easing function by name
   */
  get: (name: string): ((t: number) => number) => {
    const map: Record<string, (t: number) => number> = {
      linear: easing.linear,
      easeIn: easing.easeIn,
      easeOut: easing.easeOut,
      easeInOut: easing.easeInOut,
      easeInCubic: easing.easeInCubic,
      easeOutCubic: easing.easeOutCubic,
      easeInOutCubic: easing.easeInOutCubic,
      easeInQuad: easing.easeInQuad,
      easeOutQuad: easing.easeOutQuad,
      easeInOutQuad: easing.easeInOutQuad,
      elastic: easing.easeOutElastic,
      bounce: easing.easeOutBounce,
      spring: easing.spring,
    };
    return map[name] || easing.linear;
  },
};

/**
 * Create custom bezier easing
 */
export const createBezier = (p1: number, p2: number) => {
  return (t: number) => easing.bezier(t, p1, p2);
};

/**
 * Easing presets for common animations
 */
export const easingPresets = {
  smooth: easing.easeInOut,
  bouncy: easing.easeOutElastic,
  spring: easing.spring,
  fast: easing.easeOutCubic,
  slow: easing.easeInCubic,
  dramatic: easing.easeOutBounce,
};