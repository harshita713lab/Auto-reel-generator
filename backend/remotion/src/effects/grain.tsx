import React from 'react';
import { useCurrentFrame } from 'remotion';

interface GrainProps {
  intensity?: number;
  size?: number;
  opacity?: number;
  animated?: boolean;
}

export const Grain: React.FC<GrainProps> = ({
  intensity = 0.2,
  size = 2,
  opacity = 1,
  animated = true,
}) => {
  const frame = useCurrentFrame();

  // Generate grain pattern
  const generateGrain = () => {
    if (!animated) {
      return `url("data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" />
            <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${intensity} 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" opacity="${opacity}" />
        </svg>
      `)}")`;
    }

    // Animated grain using CSS
    const seed = frame % 100;
    return `url("data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="${seed}" />
          <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${intensity} 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" opacity="${opacity}" />
      </svg>
    `)}")`;
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: generateGrain(),
        backgroundSize: `${size * 100}px ${size * 100}px`,
        backgroundRepeat: 'repeat',
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        opacity: intensity * 2,
        transition: animated ? 'background-image 0.1s ease' : 'none',
      }}
    />
  );
};