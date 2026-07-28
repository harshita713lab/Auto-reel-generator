import { Easing } from 'remotion';

interface PanRightParams {
  progress: number;
  distance?: number;
}

export const panRight = ({ progress, distance = 100 }: PanRightParams) => {
  const x = progress * distance;
  return {
    translateX: x,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};

export const panRightIn = ({ progress, distance = 80 }: PanRightParams) => {
  const x = (1 - progress) * distance;
  const opacity = progress;
  return {
    translateX: x,
    opacity,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};

export const panRightOut = ({ progress, distance = 80 }: PanRightParams) => {
  const x = progress * distance;
  const opacity = 1 - progress;
  return {
    translateX: x,
    opacity,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};