import { Easing } from 'remotion';

interface ParallaxParams {
  progress: number;
  depth?: number;
  initialX?: number;
  initialY?: number;
}

export const parallax = ({ progress, depth = 0.5, initialX = 0, initialY = 0 }: ParallaxParams) => {
  const x = initialX + progress * depth * 20;
  const y = initialY + progress * depth * 20;
  const scale = 1 + progress * depth * 0.05;
  
  return {
    translateX: x,
    translateY: y,
    scale,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};

export const parallaxLeft = ({ progress, depth = 0.5, initialX = 0 }: ParallaxParams) => {
  const x = initialX - progress * depth * 30;
  const scale = 1 + progress * depth * 0.05;
  
  return {
    translateX: x,
    scale,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};

export const parallaxRight = ({ progress, depth = 0.5, initialX = 0 }: ParallaxParams) => {
  const x = initialX + progress * depth * 30;
  const scale = 1 + progress * depth * 0.05;
  
  return {
    translateX: x,
    scale,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};