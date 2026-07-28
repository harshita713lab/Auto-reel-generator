import { AnimationType } from './animation';

export type TransitionType = 
  | 'fade'
  | 'crossFade'
  | 'slideLeft'
  | 'slideRight'
  | 'slideUp'
  | 'slideDown'
  | 'zoom'
  | 'blur'
  | 'flash'
  | 'whipPan'
  | 'cameraMove'
  | 'filmBurn'
  | 'lightLeak'
  | 'dissolve'
  | 'morph'
  | 'none';

export type EffectType = 
  | 'lightLeak'
  | 'lensFlare'
  | 'glow'
  | 'bloom'
  | 'filmGrain'
  | 'dustParticles'
  | 'bokeh'
  | 'vignette'
  | 'motionBlur'
  | 'floatingParticles'
  | 'softShadows'
  | 'colorOverlay'
  | 'gradientOverlay'
  | 'noiseTexture';

export type TemplateCategory = 
  | 'wedding'
  | 'birthday'
  | 'travel'
  | 'fashion'
  | 'loveStory'
  | 'baby'
  | 'festival'
  | 'memories'
  | 'corporate'
  | 'productShowcase';

export interface TemplateConfig {
  minImages: number;
  maxImages: number;
  allowedAspectRatios: string[];
  defaultWidth: number;
  defaultHeight: number;
  backgroundColor: string;
  textOverlay?: TextOverlayConfig;
  transitions: TransitionConfig;
  music?: MusicConfig;
}

export interface TextOverlayConfig {
  enabled: boolean;
  font?: string;
  fontSize?: number;
  color?: string;
  position?: 'top' | 'center' | 'bottom';
  animation?: AnimationType;
}

export interface TransitionConfig {
  enabled: boolean;
  duration: number;
  defaultType?: TransitionType;
}

export interface MusicConfig {
  defaultMusic?: string;
  allowCustomMusic: boolean;
  recommendedBPM?: number;
}

export interface TemplateEffect {
  name: string;
  type: EffectType;
  config: Record<string, any>;
  enabled: boolean;
}

export interface TemplateAnimation {
  name: string;
  type: AnimationType;
  config: Record<string, any>;
  enabled: boolean;
}

export interface TemplateTransition {
  name: string;
  type: TransitionType;
  config: Record<string, any>;
  enabled: boolean;
}

export interface TemplateData {
  id?: string;
  name: string;
  displayName: string;
  description?: string;
  category: TemplateCategory;
  thumbnail?: string;
  previewVideo?: string;
  defaultAnimation: AnimationType;
  defaultTransition: TransitionType;
  defaultEffects: EffectType[];
  defaultDuration: number;
  config: TemplateConfig;
  effects: TemplateEffect[];
  animations: TemplateAnimation[];
  transitions: TemplateTransition[];
  music?: {
    defaultMusic?: string;
    allowCustomMusic: boolean;
    recommendedBPM?: number;
  };
  popularity: number;
  usageCount: number;
  rating: {
    average: number;
    count: number;
  };
  isActive: boolean;
  isPremium: boolean;
  price?: number;
  tags: string[];
  metadata?: Record<string, any>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplatePreview {
  template: {
    id: string;
    name: string;
    category: string;
    thumbnail?: string;
  };
  config: {
    duration: number;
    width: number;
    height: number;
    backgroundColor: string;
    defaultAnimation: AnimationType;
    defaultTransition: TransitionType;
    effects: EffectType[];
  };
  images: {
    count: number;
    duration: number;
    animation: AnimationType;
    transition: TransitionType;
  }[];
  animations: AnimationType[];
  transitions: TransitionType[];
  effects: EffectType[];
}

export interface TemplateSearchOptions {
  category?: TemplateCategory;
  searchTerm?: string;
  isPremium?: boolean;
  limit?: number;
  skip?: number;
  sortBy?: 'popularity' | 'usageCount' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Transition effect mapping for Remotion
export interface TransitionMapping {
  [key: string]: {
    component: string;
    defaultDuration: number;
    description: string;
  };
}

export const TransitionDefaults: TransitionMapping = {
  fade: {
    component: 'FadeTransition',
    defaultDuration: 0.5,
    description: 'Simple fade transition',
  },
  crossFade: {
    component: 'FadeTransition',
    defaultDuration: 0.5,
    description: 'Cross fade between images',
  },
  slideLeft: {
    component: 'SlideTransition',
    defaultDuration: 0.5,
    description: 'Slide to the left',
  },
  slideRight: {
    component: 'SlideTransition',
    defaultDuration: 0.5,
    description: 'Slide to the right',
  },
  slideUp: {
    component: 'SlideTransition',
    defaultDuration: 0.5,
    description: 'Slide up',
  },
  slideDown: {
    component: 'SlideTransition',
    defaultDuration: 0.5,
    description: 'Slide down',
  },
  zoom: {
    component: 'ZoomTransition',
    defaultDuration: 0.5,
    description: 'Zoom transition',
  },
  blur: {
    component: 'BlurTransition',
    defaultDuration: 0.5,
    description: 'Blur transition',
  },
  flash: {
    component: 'FlashTransition',
    defaultDuration: 0.3,
    description: 'Flash transition',
  },
  whipPan: {
    component: 'WhipTransition',
    defaultDuration: 0.4,
    description: 'Whip pan transition',
  },
  cameraMove: {
    component: 'CameraMoveTransition',
    defaultDuration: 0.5,
    description: 'Camera move transition',
  },
  filmBurn: {
    component: 'FilmBurnTransition',
    defaultDuration: 0.6,
    description: 'Film burn transition',
  },
  lightLeak: {
    component: 'LightLeakTransition',
    defaultDuration: 0.5,
    description: 'Light leak transition',
  },
  dissolve: {
    component: 'DissolveTransition',
    defaultDuration: 0.6,
    description: 'Dissolve transition',
  },
  morph: {
    component: 'MorphTransition',
    defaultDuration: 0.5,
    description: 'Morph transition',
  },
  none: {
    component: 'None',
    defaultDuration: 0,
    description: 'No transition',
  },
};

// Effect mapping for Remotion
export interface EffectMapping {
  [key: string]: {
    component: string;
    defaultConfig: Record<string, any>;
    description: string;
  };
}

export const EffectDefaults: EffectMapping = {
  lightLeak: {
    component: 'LightLeak',
    defaultConfig: { intensity: 0.3, color: '#FFA500' },
    description: 'Warm light leak overlay',
  },
  lensFlare: {
    component: 'LensFlare',
    defaultConfig: { intensity: 0.4, position: 'topRight' },
    description: 'Lens flare effect',
  },
  glow: {
    component: 'Glow',
    defaultConfig: { intensity: 0.5, color: '#FFFFFF', radius: 20 },
    description: 'Soft glow effect',
  },
  bloom: {
    component: 'Bloom',
    defaultConfig: { threshold: 0.7, intensity: 0.5, radius: 30 },
    description: 'Bloom effect',
  },
  filmGrain: {
    component: 'Grain',
    defaultConfig: { intensity: 0.2, size: 2 },
    description: 'Film grain texture',
  },
  dustParticles: {
    component: 'Dust',
    defaultConfig: { count: 50, size: 3, opacity: 0.3 },
    description: 'Dust particles',
  },
  bokeh: {
    component: 'Bokeh',
    defaultConfig: { count: 30, size: 15, blur: 5 },
    description: 'Bokeh effect',
  },
  vignette: {
    component: 'Vignette',
    defaultConfig: { intensity: 0.5, radius: 0.8, color: '#000000' },
    description: 'Vignette effect',
  },
  motionBlur: {
    component: 'MotionBlur',
    defaultConfig: { intensity: 0.3, angle: 0 },
    description: 'Motion blur effect',
  },
  floatingParticles: {
    component: 'Particles',
    defaultConfig: { count: 100, size: 5, speed: 0.5, opacity: 0.4 },
    description: 'Floating particles',
  },
  softShadows: {
    component: 'SoftShadows',
    defaultConfig: { intensity: 0.3, radius: 10 },
    description: 'Soft shadows',
  },
  colorOverlay: {
    component: 'ColorOverlay',
    defaultConfig: { color: '#000000', opacity: 0.2, blendMode: 'overlay' },
    description: 'Color overlay',
  },
  gradientOverlay: {
    component: 'GradientOverlay',
    defaultConfig: { colors: ['#000000', '#FFFFFF'], direction: 'vertical', opacity: 0.3 },
    description: 'Gradient overlay',
  },
  noiseTexture: {
    component: 'NoiseTexture',
    defaultConfig: { intensity: 0.2, size: 1 },
    description: 'Noise texture',
  },
};