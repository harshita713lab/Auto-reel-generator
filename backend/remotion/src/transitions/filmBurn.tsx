import React from 'react';
import { useCurrentFrame, interpolate, Easing, random } from 'remotion';

interface FilmBurnTransitionProps {
  children: React.ReactNode;
  durationInFrames?: number;
  intensity?: number;
  color?: string;
  delay?: number;
}

export const FilmBurnTransition: React.FC<FilmBurnTransitionProps> = ({
  children,
  durationInFrames = 30,
  intensity = 0.5,
  color = '#FF6B35',
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.max(0, Math.min((frame - delay) / durationInFrames, 1));
  const eased = Easing.inOut(Easing.ease)(progress);

  // Burn effect intensity
  const burnIntensity = intensity * Math.sin(eased * Math.PI) * 2;

  // Random grain for film feel
  const grain = random(frame) * 0.1;

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
          opacity: interpolate(eased, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
          filter: `contrast(${1 + burnIntensity * 0.2}) brightness(${1 - burnIntensity * 0.1})`,
        }}
      >
        {children}
      </div>

      {/* Film burn overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(
              ellipse at ${30 + Math.sin(frame * 0.02) * 20}% ${20 + Math.cos(frame * 0.015) * 20}%,
              ${color} 0%,
              transparent 60%
            )
          `,
          opacity: burnIntensity * 0.5,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      {/* Film grain */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
              <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="${Math.floor(frame * 0.5) % 100}" />
                <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.3 0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#noise)" opacity="${0.1 + burnIntensity * 0.1}" />
            </svg>
          `)}")`,
          backgroundSize: '100px 100px',
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          opacity: 0.3 + burnIntensity * 0.2,
        }}
      />
    </div>
  );
};