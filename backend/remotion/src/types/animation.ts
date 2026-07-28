export type AnimationType = 
  | 'zoomIn'
  | 'zoomOut'
  | 'kenBurns'
  | 'panLeft'
  | 'panRight'
  | 'panUp'
  | 'panDown'
  | 'cameraPush'
  | 'cameraPull'
  | 'slowFloat'
  | 'parallax'
  | 'rotate'
  | 'tilt'
  | 'bounce'
  | 'shake'
  | 'reveal'
  | 'fade'
  | 'scale'
  | 'blurIn'
  | 'blurOut';

export type EasingType = 
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'spring'
  | 'bezier';

export interface AnimationConfig {
  type: AnimationType;
  duration?: number;
  delay?: number;
  easing?: EasingType;
  params?: Record<string, any>;
}

export interface AnimationResult {
  scale?: number;
  translateX?: number;
  translateY?: number;
  rotate?: number;
  opacity?: number;
  blur?: number;
  progress: number;
  easing: number;
}

export interface ZoomAnimationParams {
  startScale?: number;
  endScale?: number;
}

export interface KenBurnsParams {
  startScale?: number;
  endScale?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
}

export interface PanParams {
  distance?: number;
}

export interface FloatParams {
  amplitude?: number;
  frequency?: number;
}

export interface ParallaxParams {
  depth?: number;
  initialX?: number;
  initialY?: number;
}

export interface RotateParams {
  degrees?: number;
  axis?: 'x' | 'y' | 'z';
}

export interface BounceParams {
  amplitude?: number;
}

export interface ShakeParams {
  intensity?: number;
  frequency?: number;
}

export interface RevealParams {
  direction?: 'left' | 'right' | 'up' | 'down' | 'center';
}

export interface BlurParams {
  maxBlur?: number;
}

export interface FadeParams {
  startOpacity?: number;
  endOpacity?: number;
}

export interface ScaleParams {
  startScale?: number;
  endScale?: number;
}

export interface AnimationMap {
  [key: string]: {
    defaultDuration: number;
    defaultParams: Record<string, any>;
    description: string;
  };
}

export const AnimationDefaults: AnimationMap = {
  zoomIn: {
    defaultDuration: 1.5,
    defaultParams: { startScale: 0.5, endScale: 1 },
    description: 'Zoom in from center',
  },
  zoomOut: {
    defaultDuration: 1.5,
    defaultParams: { startScale: 1.5, endScale: 1 },
    description: 'Zoom out from center',
  },
  kenBurns: {
    defaultDuration: 3,
    defaultParams: { startScale: 1.1, endScale: 1.4, startX: 0, startY: 0, endX: 10, endY: 10 },
    description: 'Ken Burns pan and zoom effect',
  },
  panLeft: {
    defaultDuration: 2,
    defaultParams: { distance: 100 },
    description: 'Pan left across image',
  },
  panRight: {
    defaultDuration: 2,
    defaultParams: { distance: 100 },
    description: 'Pan right across image',
  },
  panUp: {
    defaultDuration: 2,
    defaultParams: { distance: 100 },
    description: 'Pan up across image',
  },
  panDown: {
    defaultDuration: 2,
    defaultParams: { distance: 100 },
    description: 'Pan down across image',
  },
  cameraPush: {
    defaultDuration: 2,
    defaultParams: {},
    description: 'Camera push in effect',
  },
  cameraPull: {
    defaultDuration: 2,
    defaultParams: {},
    description: 'Camera pull out effect',
  },
  slowFloat: {
    defaultDuration: 3,
    defaultParams: { amplitude: 10, frequency: 0.5 },
    description: 'Slow floating motion',
  },
  parallax: {
    defaultDuration: 3,
    defaultParams: { depth: 0.5 },
    description: 'Parallax depth effect',
  },
  rotate: {
    defaultDuration: 2,
    defaultParams: { degrees: 360 },
    description: 'Rotation effect',
  },
  tilt: {
    defaultDuration: 2,
    defaultParams: {},
    description: 'Tilt effect',
  },
  bounce: {
    defaultDuration: 1.5,
    defaultParams: { amplitude: 20 },
    description: 'Bounce effect',
  },
  shake: {
    defaultDuration: 1,
    defaultParams: { intensity: 5 },
    description: 'Shake effect',
  },
  reveal: {
    defaultDuration: 1.5,
    defaultParams: { direction: 'center' },
    description: 'Reveal from direction',
  },
  fade: {
    defaultDuration: 1,
    defaultParams: { startOpacity: 0, endOpacity: 1 },
    description: 'Fade in/out',
  },
  scale: {
    defaultDuration: 1.5,
    defaultParams: { startScale: 0.3, endScale: 1 },
    description: 'Scale effect',
  },
  blurIn: {
    defaultDuration: 1.5,
    defaultParams: { maxBlur: 10 },
    description: 'Blur in from blurry to clear',
  },
  blurOut: {
    defaultDuration: 1.5,
    defaultParams: { maxBlur: 10 },
    description: 'Blur out from clear to blurry',
  },
};