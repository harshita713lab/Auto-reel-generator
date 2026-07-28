import { AnimationType } from './animation';
import { TransitionType } from './template';

export interface ImageData {
  id?: string;
  path: string;
  filename?: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  duration: number;
  order: number;
  animation: AnimationType;
  animationConfig?: Record<string, any>;
  transition: TransitionType;
  transitionConfig?: Record<string, any>;
  effects?: string[];
  effectConfig?: Record<string, any>;
  overlay?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface MusicData {
  id?: string;
  path: string;
  filename?: string;
  title?: string;
  artist?: string;
  duration?: number;
  bpm?: number;
  beats?: Beat[];
  volume?: number;
  startTime?: number;
}

export interface Beat {
  time: number;
  confidence: number;
  type?: 'kick' | 'snare' | 'hat' | 'other';
}

export interface ReelConfig {
  width: number;
  height: number;
  fps: number;
  backgroundColor: string;
  transitionDuration: number;
  defaultAnimation: AnimationType;
  defaultTransition: TransitionType;
  effects: string[];
  audioFadeIn?: number;
  audioFadeOut?: number;
  musicVolume?: number;
}

export interface ReelData {
  id?: string;
  title: string;
  templateId?: string;
  templateName?: string;
  images: ImageData[];
  music?: MusicData;
  duration: number;
  width: number;
  height: number;
  fps: number;
  config: ReelConfig;
  status: ReelStatus;
  progress: number;
  outputPath?: string;
  previewPath?: string;
  thumbnailPath?: string;
  error?: string;
  renderedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ReelStatus = 
  | 'draft'
  | 'queued'
  | 'rendering'
  | 'rendered'
  | 'failed'
  | 'cancelled';

export type ReelQuality = 'low' | 'medium' | 'high' | 'ultra';

export interface RenderOptions {
  quality: ReelQuality;
  format?: string;
  width?: number;
  height?: number;
  fps?: number;
  codec?: string;
  bitrate?: string;
  onProgress?: (progress: number) => void;
}

export interface RenderResult {
  path: string;
  filename: string;
  size: number;
  duration: number;
  width: number;
  height: number;
  fps: number;
  quality: ReelQuality;
  format: string;
  preview?: {
    path: string;
    duration: number;
  };
  url: string;
}

export interface ReelTemplate {
  id: string;
  name: string;
  displayName: string;
  category: string;
  description?: string;
  thumbnail?: string;
  previewVideo?: string;
  defaultAnimation: AnimationType;
  defaultTransition: TransitionType;
  defaultEffects: string[];
  defaultDuration: number;
  config: {
    minImages: number;
    maxImages: number;
    allowedAspectRatios: string[];
    defaultWidth: number;
    defaultHeight: number;
    backgroundColor: string;
    textOverlay?: {
      enabled: boolean;
      font?: string;
      fontSize?: number;
      color?: string;
      position?: string;
    };
    transitions: {
      enabled: boolean;
      duration: number;
    };
  };
  effects: EffectConfig[];
  animations: AnimationConfig[];
  transitions: TransitionConfig[];
  music?: {
    defaultMusic?: string;
    allowCustomMusic?: boolean;
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
  tags: string[];
}

export interface EffectConfig {
  name: string;
  type: string;
  config: Record<string, any>;
  enabled: boolean;
}

export interface TransitionConfig {
  name: string;
  type: TransitionType;
  config: Record<string, any>;
  enabled: boolean;
}

export interface TimelineSegment {
  startFrame: number;
  endFrame: number;
  duration: number;
  type: 'image' | 'transition' | 'effect';
  data: any;
}