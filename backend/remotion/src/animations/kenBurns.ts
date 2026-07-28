import { Easing } from 'remotion';

interface KenBurnsParams {
  progress: number;
  startScale?: number;
  endScale?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
}

export const kenBurns = ({ 
  progress, 
  startScale = 1.1, 
  endScale = 1.4,
  startX = 0,
  startY = 0,
  endX = 10,
  endY = 10
}: KenBurnsParams) => {
  const scale = startScale + (endScale - startScale) * progress;
  const x = startX + (endX - startX) * progress;
  const y = startY + (endY - startY) * progress;
  
  return {
    scale,
    translateX: x,
    translateY: y,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};

export const kenBurnsZoomIn = ({ progress, scale = 1.3 }: KenBurnsParams) => {
  return {
    scale: 1 + (scale - 1) * progress,
    translateX: Math.sin(progress * Math.PI * 2) * 5,
    translateY: Math.cos(progress * Math.PI * 2) * 5,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};

export const kenBurnsZoomOut = ({ progress, scale = 1.3 }: KenBurnsParams) => {
  return {
    scale: scale - (scale - 1) * progress,
    translateX: Math.sin((1 - progress) * Math.PI * 2) * 5,
    translateY: Math.cos((1 - progress) * Math.PI * 2) * 5,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};