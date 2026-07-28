import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

interface CameraMoveTransitionProps {
  children: React.ReactNode;
  durationInFrames?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
  delay?: number;
}

export const CameraMoveTransition: React.FC<CameraMoveTransitionProps> = ({
  children,
  durationInFrames = 30,
  direction = 'right',
  distance = 50,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.max(0, Math.min((frame - delay) / durationInFrames, 1));
  const eased = Easing.easeInOut(progress);

  let x = 0;
  let y = 0;
  let scale = 1;

  // Camera moves in, zooms slightly
  if (eased < 0.5) {
    const p = eased * 2;
    x = interpolate(p, [0, 1], [0, direction === 'left' ? -distance : direction === 'right' ? distance : 0]);
    y = interpolate(p, [0, 1], [0, direction === 'up' ? -distance : direction === 'down' ? distance : 0]);
    scale = interpolate(p, [0, 1], [1.2, 1]);
  } else {
    const p = (eased - 0.5) * 2;
    x = interpolate(p, [0, 1], [direction === 'left' ? -distance : direction === 'right' ? distance : 0, 0]);
    y = interpolate(p, [0, 1], [direction === 'up' ? -distance : direction === 'down' ? distance : 0, 0]);
    scale = interpolate(p, [0, 1], [1, 1.1]);
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        opacity: interpolate(eased, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
        transition: 'all 0.05s ease-out',
      }}
    >
      {children}
    </div>
  );
};