import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

interface WhipTransitionProps {
  children: React.ReactNode;
  durationInFrames?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  intensity?: number;
  delay?: number;
}

export const WhipTransition: React.FC<WhipTransitionProps> = ({
  children,
  durationInFrames = 20,
  direction = 'right',
  intensity = 1,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.max(0, Math.min((frame - delay) / durationInFrames, 1));
  const eased = Easing.easeInOut(progress);

  // Whip pan - fast movement with overshoot
  let x = 0;
  let y = 0;
  let blur = 0;
  let scale = 1;

  const distance = 200 * intensity;
  const overshoot = 0.3;

  // Overshoot effect
  const whipProgress = eased * (1 + overshoot) - overshoot * 0.5;
  const clampedWhip = Math.max(0, Math.min(1, whipProgress));

  switch (direction) {
    case 'left':
      x = interpolate(clampedWhip, [0, 0.3, 0.7, 1], [distance, distance * 0.5, -distance * 0.2, 0]);
      break;
    case 'right':
      x = interpolate(clampedWhip, [0, 0.3, 0.7, 1], [-distance, -distance * 0.5, distance * 0.2, 0]);
      break;
    case 'up':
      y = interpolate(clampedWhip, [0, 0.3, 0.7, 1], [distance, distance * 0.5, -distance * 0.2, 0]);
      break;
    case 'down':
      y = interpolate(clampedWhip, [0, 0.3, 0.7, 1], [-distance, -distance * 0.5, distance * 0.2, 0]);
      break;
  }

  // Blur during movement
  blur = interpolate(clampedWhip, [0, 0.3, 0.8, 1], [20, 20, 10, 0]) * intensity;
  scale = interpolate(clampedWhip, [0, 0.3, 1], [0.8, 0.9, 1]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity: interpolate(eased, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
        transition: 'all 0.02s ease-out',
      }}
    >
      {children}
    </div>
  );
};

// Whip pan with streak effect
export const WhipStreakTransition: React.FC<WhipTransitionProps> = (props) => {
  const frame = useCurrentFrame();
  const progress = Math.max(0, Math.min((frame - (props.delay || 0)) / (props.durationInFrames || 20), 1));
  const eased = Easing.easeInOut(progress);

  const distance = 300 * (props.intensity || 1);
  let x = 0;
  let y = 0;

  switch (props.direction || 'right') {
    case 'left':
      x = interpolate(eased, [0, 0.2, 0.8, 1], [distance, distance * 0.3, -distance * 0.1, 0]);
      break;
    case 'right':
      x = interpolate(eased, [0, 0.2, 0.8, 1], [-distance, -distance * 0.3, distance * 0.1, 0]);
      break;
    case 'up':
      y = interpolate(eased, [0, 0.2, 0.8, 1], [distance, distance * 0.3, -distance * 0.1, 0]);
      break;
    case 'down':
      y = interpolate(eased, [0, 0.2, 0.8, 1], [-distance, -distance * 0.3, distance * 0.1, 0]);
      break;
  }

  // Motion blur streak effect
  const streakX = x * 0.5;
  const streakY = y * 0.5;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Content */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${x}px, ${y}px)`,
          opacity: interpolate(eased, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
          transition: 'all 0.02s ease-out',
        }}
      >
        {props.children}
      </div>

      {/* Streak overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(${props.direction === 'right' ? '90deg' : props.direction === 'left' ? '-90deg' : '0deg'}, 
            transparent 0%, 
            rgba(255,255,255,0.1) ${40 + Math.abs(streakX) * 0.1}%, 
            transparent 100%
          )`,
          transform: `translate(${streakX}px, ${streakY}px) scale(${1 + Math.abs(eased - 0.5) * 0.1})`,
          opacity: (1 - Math.abs(eased - 0.5) * 2) * 0.3,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};