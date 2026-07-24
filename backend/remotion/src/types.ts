export interface Template {
  name: string;
  width: number;
  height: number;
  slideDuration: number;
  transitionDuration: number;
  transitions: string[];
  effects: string[];
  colorGrades?: string[];
  vignette?: boolean;
}

export interface ReelProps {
  images: string[];
  template: Template;
  totalDuration: number;
  numImages: number;
}