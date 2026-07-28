import { Easing } from 'remotion';

interface BounceParams {
  progress: number;
  amplitude?: number;
}

export const bounce = ({ progress, amplitude = 20 }: BounceParams) => {
  // Bounce effect with decreasing amplitude
  const bounceValue = Math.sin(progress * Math.PI * 4) * amplitude * (1 - progress);
  return {
    translateY: bounceValue,
    easing: Easing.bezier(0.33, 1.68, 0.68, 1),
  };
};

export const bounceIn = ({ progress, amplitude = 30 }: BounceParams) => {
  const scale = 0.5 + 0.5 * progress;
  const bounce = Math.sin(progress * Math.PI * 3) * amplitude * (1 - progress);
  return {
    scale,
    translateY: -bounce,
    easing: Easing.bezier(0.33, 1.68, 0.68, 1),
  };
};

export const bounceOut = ({ progress, amplitude = 30 }: BounceParams) => {
  const scale = 1.2 - 0.2 * progress;
  const bounce = Math.sin(progress * Math.PI * 3) * amplitude * (1 - progress);
  return {
    scale,
    translateY: bounce,
    easing: Easing.bezier(0.33, 1.68, 0.68, 1),
  };
};