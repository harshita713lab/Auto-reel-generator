import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

interface BlurTransitionProps {
  children: React.ReactNode;
  durationInFrames?: number;
  direction?: 'in' | 'out' | 'both';
  blurAmount?: number;
  delay?: number;
}

export const BlurTransition: React.FC<BlurTransitionProps> = ({
  children,
  durationInFrames = 30,
  direction = 'both',
  blurAmount = 10,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.max(0, Math.min((frame - delay) / durationInFrames, 1));
  const eased = Easing.easeInOut(progress);

  let blur = 0;
  let opacity = 1;

  if (direction === 'in') {
    blur = interpolate(eased, [0, 1], [blurAmount, 0]);
    opacity = interpolate(eased, [0, 0.3], [0, 1]);
  } else if (direction === 'out') {
    blur = interpolate(eased, [0, 1], [0, blurAmount]);
    opacity = interpolate(eased, [0.7, 1], [1, 0]);
  } else {
    // Both - blur in then out
    const midpoint = 0.5;
    if (eased <= midpoint) {
      const p = eased / midpoint;
      blur = interpolate(p, [0, 1], [blurAmount, 0]);
      opacity = interpolate(p, [0, 0.5], [0, 1]);
    } else {
      const p = (eased - midpoint) / midpoint;
      blur = interpolate(p, [0, 1], [0, blurAmount]);
      opacity = interpolate(p, [0.5, 1], [1, 0]);
    }
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        filter: `blur(${blur}px)`,
        opacity,
        transition: 'all 0.05s ease-out',
      }}
    >
      {children}
    </div>
  );
};