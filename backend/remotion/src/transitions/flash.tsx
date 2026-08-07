import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

interface FlashTransitionProps {
  children: React.ReactNode;
  durationInFrames?: number;
  color?: string;
  intensity?: number;
  delay?: number;
}

export const FlashTransition: React.FC<FlashTransitionProps> = ({
  children,
  durationInFrames = 20,
  color = '#FFFFFF',
  intensity = 1,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.max(0, Math.min((frame - delay) / durationInFrames, 1));
  const eased = Easing.inOut(Easing.ease)(progress);

  // Flash effect - quick bright flash
  const flashIntensity = Math.sin(eased * Math.PI) * intensity;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Content */}
      <div
        style={{
          width: '100%',
          height: '100%',
          opacity: interpolate(eased, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
        }}
      >
        {children}
      </div>

      {/* Flash overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: color,
          opacity: flashIntensity * 0.8,
          pointerEvents: 'none',
          transition: 'opacity 0.02s ease-out',
        }}
      />

      {/* Flash streaks */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${10 + i * 20 + Math.sin(i * 1.5) * 10}%`,
            left: `${10 + Math.sin(i * 2) * 15}%`,
            width: `${60 + Math.sin(i * 1.3) * 20}%`,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            opacity: flashIntensity * 0.3 * (1 - i * 0.15),
            transform: `rotate(${i * 20 + frame * 0.01}deg)`,
            pointerEvents: 'none',
            filter: 'blur(2px)',
          }}
        />
      ))}
    </div>
  );
};