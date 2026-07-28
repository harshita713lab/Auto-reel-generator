import { Easing } from 'remotion';

interface PanLeftParams {
  progress: number;
  distance?: number;
}

export const panLeft = ({ progress, distance = 100 }: PanLeftParams) => {
  const x = -progress * distance;
  return {
    translateX: x,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};

export const panLeftIn = ({ progress, distance = 80 }: PanLeftParams) => {
  const x = -(1 - progress) * distance;
  const opacity = progress;
  return {
    translateX: x,
    opacity,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};

export const panLeftOut = ({ progress, distance = 80 }: PanLeftParams) => {
  const x = -progress * distance;
  const opacity = 1 - progress;
  return {
    translateX: x,
    opacity,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};