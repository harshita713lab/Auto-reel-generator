import { Easing } from 'remotion';

interface PanUpParams {
  progress: number;
  distance?: number;
}

export const panUp = ({ progress, distance = 100 }: PanUpParams) => {
  const y = -progress * distance;
  return {
    translateY: y,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};

export const panUpIn = ({ progress, distance = 80 }: PanUpParams) => {
  const y = (1 - progress) * distance;
  const opacity = progress;
  return {
    translateY: y,
    opacity,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};

export const panUpOut = ({ progress, distance = 80 }: PanUpParams) => {
  const y = -progress * distance;
  const opacity = 1 - progress;
  return {
    translateY: y,
    opacity,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};