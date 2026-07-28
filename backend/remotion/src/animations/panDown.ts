import { Easing } from 'remotion';

interface PanDownParams {
  progress: number;
  distance?: number;
}

export const panDown = ({ progress, distance = 100 }: PanDownParams) => {
  const y = progress * distance;
  return {
    translateY: y,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};

export const panDownIn = ({ progress, distance = 80 }: PanDownParams) => {
  const y = (1 - progress) * distance;
  const opacity = progress;
  return {
    translateY: y,
    opacity,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};

export const panDownOut = ({ progress, distance = 80 }: PanDownParams) => {
  const y = progress * distance;
  const opacity = 1 - progress;
  return {
    translateY: y,
    opacity,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  };
};