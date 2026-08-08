import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

interface SlideTransitionProps {
  children: React.ReactNode;
  durationInFrames?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
  delay?: number;
}

export const SlideTransition: React.FC<SlideTransitionProps> = ({
  children,
  durationInFrames = 30,
  direction = 'left',
  distance = 100,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.max(0, Math.min((frame - delay) / durationInFrames, 1));
  const eased = Easing.inOut(Easing.ease)(progress);

  let x = 0;
  let y = 0;

  switch (direction) {
    case 'left':
      x = interpolate(eased, [0, 1], [distance, 0]);
      break;
    case 'right':
      x = interpolate(eased, [0, 1], [-distance, 0]);
      break;
    case 'up':
      y = interpolate(eased, [0, 1], [distance, 0]);
      break;
    case 'down':
      y = interpolate(eased, [0, 1], [-distance, 0]);
      break;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transform: `translate(${x}px, ${y}px)`,
        opacity: interpolate(eased, [0, 0.2], [0, 1]),
        transition: 'all 0.05s ease-out',
      }}
    >
      {children}
    </div>
  );
};

// Slide transition with both in and out
export const SlideTransitionInOut: React.FC<SlideTransitionProps & { outDirection?: string }> = ({
  children,
  durationInFrames = 30,
  direction = 'left',
  outDirection,
  distance = 100,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.max(0, Math.min((frame - delay) / durationInFrames, 1));
  const eased = Easing.inOut(Easing.ease)(progress);

  const outDir = outDirection || direction;

  let x = 0;
  let y = 0;
  let opacity = 1;

  // Slide in
  if (eased <= 0.5) {
    const p = eased / 0.5;
    switch (direction) {
      case 'left': x = interpolate(p, [0, 1], [distance, 0]); break;
      case 'right': x = interpolate(p, [0, 1], [-distance, 0]); break;
      case 'up': y = interpolate(p, [0, 1], [distance, 0]); break;
      case 'down': y = interpolate(p, [0, 1], [-distance, 0]); break;
    }
    opacity = interpolate(p, [0, 0.3], [0, 1]);
  } else {
    // Slide out
    const p = (eased - 0.5) / 0.5;
    switch (outDir) {
      case 'left': x = interpolate(p, [0, 1], [0, -distance]); break;
      case 'right': x = interpolate(p, [0, 1], [0, distance]); break;
      case 'up': y = interpolate(p, [0, 1], [0, -distance]); break;
      case 'down': y = interpolate(p, [0, 1], [0, distance]); break;
    }
    opacity = interpolate(p, [0.7, 1], [1, 0]);
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transform: `translate(${x}px, ${y}px)`,
        opacity,
        transition: 'all 0.05s ease-out',
      }}
    >
      {children}
    </div>
  );
};