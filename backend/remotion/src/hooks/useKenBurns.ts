import { useCurrentFrame, interpolate } from 'remotion';

interface KenBurnsConfig {
  durationInFrames: number;
  scale?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  zoomDirection?: 'in' | 'out' | 'none';
  easing?: (t: number) => number;
}

export const useKenBurns = (config: KenBurnsConfig) => {
  const frame = useCurrentFrame();
  const {
    durationInFrames,
    scale = 1.3,
    startX = 0,
    startY = 0,
    endX = 10,
    endY = 10,
    zoomDirection = 'in',
    easing = (t: number) => t,
  } = config;

  const progress = Math.min(frame / durationInFrames, 1);
  const easedProgress = easing(progress);

  let currentScale: number;
  let translateX: number;
  let translateY: number;

  if (zoomDirection === 'in') {
    currentScale = interpolate(easedProgress, [0, 1], [1, scale]);
    translateX = interpolate(easedProgress, [0, 1], [startX, endX]);
    translateY = interpolate(easedProgress, [0, 1], [startY, endY]);
  } else if (zoomDirection === 'out') {
    currentScale = interpolate(easedProgress, [0, 1], [scale, 1]);
    translateX = interpolate(easedProgress, [0, 1], [endX, startX]);
    translateY = interpolate(easedProgress, [0, 1], [endY, startY]);
  } else {
    currentScale = 1;
    translateX = 0;
    translateY = 0;
  }

  // Add slight rotation for dynamic feel
  const rotation = Math.sin(progress * Math.PI * 2) * 0.5;

  return {
    scale: currentScale,
    translateX,
    translateY,
    rotation,
    progress,
    transform: `scale(${currentScale}) translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`,
    isActive: progress < 1,
    isComplete: progress >= 1,
  };
};

// Simplified Ken Burns for images
export const useKenBurnsImage = (config: KenBurnsConfig & { imageWidth?: number; imageHeight?: number }) => {
  const kenBurns = useKenBurns(config);
  const { imageWidth = 1920, imageHeight = 1080 } = config;

  // Calculate viewport positions
  const viewportWidth = 1080;
  const viewportHeight = 1920;

  // Calculate crop positions
  const cropX = (kenBurns.translateX / 100) * imageWidth;
  const cropY = (kenBurns.translateY / 100) * imageHeight;
  const cropSize = imageWidth / kenBurns.scale;
  const cropHeight = imageHeight / kenBurns.scale;

  return {
    ...kenBurns,
    cropX,
    cropY,
    cropSize,
    cropHeight,
    objectPosition: `${50 + kenBurns.translateX * 0.5}% ${50 + kenBurns.translateY * 0.5}%`,
    transform: `scale(${kenBurns.scale}) translate(${kenBurns.translateX}px, ${kenBurns.translateY}px)`,
  };
};