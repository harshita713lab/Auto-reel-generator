export interface Template {
  id?: string; // ✅ Template identifier
  name: string;
  minPhotos?: number; // ✅ Minimum photos required
  maxPhotos?: number; // ✅ Maximum photos allowed
  width: number;
  height: number;
  slideDuration: number;
  transitionDuration: number;
  transitions: string[];
  effects: string[];
  colorGrades?: string[];
  blurBackground?: boolean; // ✅ NEW - Enable blur background
  vignette?: boolean;
  collage?: boolean; // ✅ NEW - Enable collage mode
  collageType?: 'three' | 'grid' | 'horizontal' | 'vertical' | 'circle' | 'diamond' | 'spiral'; // ✅ NEW
  imagesPerCollage?: number; // ✅ NEW - Images per collage
  gap?: number; // ✅ NEW - Gap between collage items (in pixels)
  quality?: 'low' | 'medium' | 'high'; // ✅ NEW - Output quality
  music?: string; // ✅ NEW - Music file name
  description?: string; // ✅ NEW - Template description
}

export interface ReelProps {
  images: string[];
  template: Template;
  totalDuration: number;
  numImages: number;
}

// ✅ Optional: Default template values
export const DEFAULT_TEMPLATE: Partial<Template> = {
  width: 1080,
  height: 1920,
  slideDuration: 3,
  transitionDuration: 0.5,
  transitions: ['fade'],
  effects: ['none'],
  colorGrades: [],
  blurBackground: false,
  vignette: false,
  collage: false,
  collageType: 'grid',
  imagesPerCollage: 4,
  gap: 10,
  quality: 'high',
};