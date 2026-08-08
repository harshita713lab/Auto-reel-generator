import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

interface ZoomTransitionProps {
  children: React.ReactNode;
  durationInFrames?: number;
  direction?: 'in' | 'out' | 'both';
  scale?: number;
  delay?: number;
}

export const ZoomTransition: React.FC<ZoomTransitionProps> = ({
  children,
  durationInFrames = 30,
  direction = 'both',
  scale = 1.3,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.max(0, Math.min((frame - delay) / durationInFrames, 1));
  const eased = Easing.inOut(Easing.ease)(progress);

  let currentScale = 1;
  let opacity = 1;

  if (direction === 'in') {
    currentScale = interpolate(eased, [0, 1], [1 / scale, 1]);
    opacity = interpolate(eased, [0, 0.3], [0, 1]);
  } else if (direction === 'out') {
    currentScale = interpolate(eased, [0, 1], [1, scale]);
    opacity = interpolate(eased, [0.7, 1], [1, 0]);
  } else {
    // Both - zoom in then out
    if (eased <= 0.5) {
      const p = eased / 0.5;
      currentScale = interpolate(p, [0, 1], [1 / scale, 1]);
      opacity = interpolate(p, [0, 0.4], [0, 1]);
    } else {
      const p = (eased - 0.5) / 0.5;
      currentScale = interpolate(p, [0, 1], [1, scale]);
      opacity = interpolate(p, [0.6, 1], [1, 0]);
    }
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transform: `scale(${currentScale})`,
        opacity,
        transition: 'all 0.05s ease-out',
      }}
    >
      {children}
    </div>
  );
};

// Zoom transition with rotation
export const ZoomRotateTransition: React.FC<ZoomTransitionProps & { rotation?: number }> = ({
  children,
  durationInFrames = 30,
  direction = 'both',
  scale = 1.3,
  rotation = 15,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.max(0, Math.min((frame - delay) / durationInFrames, 1));
  const eased = Easing.inOut(Easing.ease)(progress);

  let currentScale = 1;
  let rotate = 0;
  let opacity = 1;

  if (direction === 'in') {
    currentScale = interpolate(eased, [0, 1], [1 / scale, 1]);
    rotate = interpolate(eased, [0, 1], [rotation, 0]);
    opacity = interpolate(eased, [0, 0.3], [0, 1]);
  } else if (direction === 'out') {
    currentScale = interpolate(eased, [0, 1], [1, scale]);
    rotate = interpolate(eased, [0, 1], [0, -rotation]);
    opacity = interpolate(eased, [0.7, 1], [1, 0]);
  } else {
    if (eased <= 0.5) {
      const p = eased / 0.5;
      currentScale = interpolate(p, [0, 1], [1 / scale, 1]);
      rotate = interpolate(p, [0, 1], [rotation, 0]);
      opacity = interpolate(p, [0, 0.4], [0, 1]);
    } else {
      const p = (eased - 0.5) / 0.5;
      currentScale = interpolate(p, [0, 1], [1, scale]);
      rotate = interpolate(p, [0, 1], [0, -rotation]);
      opacity = interpolate(p, [0.6, 1], [1, 0]);
    }
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transform: `scale(${currentScale}) rotate(${rotate}deg)`,
        opacity,
        transition: 'all 0.05s ease-out',
      }}
    >
      {children}
    </div>
  );
};