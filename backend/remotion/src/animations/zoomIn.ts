import { Easing, interpolate } from 'remotion';

interface ZoomInParams {
  progress: number; // 0 to 1
  startScale?: number;
  endScale?: number;
}

const customEasing = Easing.bezier(0.42, 0, 0.58, 1);

export const zoomIn = ({ progress, startScale = 0.5, endScale = 1 }: ZoomInParams) => {
  const smoothedProgress = customEasing(progress);
  const scale = startScale + (endScale - startScale) * smoothedProgress;
  const opacity = smoothedProgress; // Smooth fade-in

  return {
    transform: `scale(${scale})`,
    opacity,
  };
};

export const zoomInSlow = ({ progress, startScale = 1, endScale = 1.3 }: ZoomInParams) => {
  const smoothedProgress = customEasing(progress);
  const scale = startScale + (endScale - startScale) * smoothedProgress;
  const x = Math.sin(smoothedProgress * Math.PI * 0.5) * 5;
  const y = Math.cos(smoothedProgress * Math.PI * 0.5) * 5;

  return {
    transform: `scale(${scale}) translate(${x}px, ${y}px)`,
  };
};

export const zoomInFast = ({ progress, startScale = 0.8, endScale = 1.2 }: ZoomInParams) => {
  const smoothedProgress = customEasing(progress);
  const scale = startScale + (endScale - startScale) * smoothedProgress;
  const blur = (1 - smoothedProgress) * 5;

  return {
    transform: `scale(${scale})`,
    filter: blur > 0.01 ? `blur(${blur}px)` : 'none',
  };
};