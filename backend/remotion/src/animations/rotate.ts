import { Easing } from 'remotion';

interface RotateParams {
  progress: number;
  degrees?: number;
  axis?: 'z' | 'x' | 'y';
}

export const rotate = ({ progress, degrees = 360, axis = 'z' }: RotateParams) => {
  const rotation = progress * degrees;
  
  if (axis === 'x') return { rotateX: rotation, easing: Easing.bezier(0.42, 0, 0.58, 1) };
  if (axis === 'y') return { rotateY: rotation, easing: Easing.bezier(0.42, 0, 0.58, 1) };
  return { rotate: rotation, easing: Easing.bezier(0.42, 0, 0.58, 1) };
};

export const rotateIn = ({ progress, degrees = 360 }: RotateParams) => {
  const rotation = (1 - progress) * degrees;
  const scale = 0.5 + 0.5 * progress;
  const opacity = progress;
  return {
    rotate: rotation,
    scale,
    opacity,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};

export const rotateOut = ({ progress, degrees = 360 }: RotateParams) => {
  const rotation = progress * degrees;
  const scale = 1 - 0.5 * progress;
  const opacity = 1 - progress;
  return {
    rotate: rotation,
    scale,
    opacity,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};