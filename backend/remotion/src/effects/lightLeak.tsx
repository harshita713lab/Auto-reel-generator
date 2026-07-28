import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface LightLeakProps {
  intensity?: number;
  color?: string;
  direction?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  animated?: boolean;
}

export const LightLeak: React.FC<LightLeakProps> = ({
  intensity = 0.3,
  color = '#FF6B35',
  direction = 'topLeft',
  animated = true,
}) => {
  const frame = useCurrentFrame();

  const getDirection = () => {
    const directions = {
      topLeft: { from: 'top left', to: 'bottom right' },
      topRight: { from: 'top right', to: 'bottom left' },
      bottomLeft: { from: 'bottom left', to: 'top right' },
      bottomRight: { from: 'bottom right', to: 'top left' },
    };
    return directions[direction] || directions.topLeft;
  };

  const dir = getDirection();
  const pulse = animated 
    ? 0.7 + Math.sin(frame * 0.015) * 0.3
    : 1;

  // Animate position
  const offsetX = animated ? Math.sin(frame * 0.01) * 10 : 0;
  const offsetY = animated ? Math.cos(frame * 0.01) * 10 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: intensity * pulse,
        mixBlendMode: 'screen',
        overflow: 'hidden',
      }}
    >
      {/* Main light leak */}
      <div
        style={{
          position: 'absolute',
          top: `-20${offsetY}%`,
          left: `-20${offsetX}%`,
          width: '140%',
          height: '140%',
          background: `radial-gradient(ellipse at ${dir.from}, ${color} 0%, transparent 70%)`,
          transform: `rotate(${interpolate(Math.sin(frame * 0.01), [-1, 1], [-10, 10])}deg)`,
          transition: animated ? 'all 0.1s ease' : 'none',
        }}
      />
      
      {/* Secondary leak */}
      <div
        style={{
          position: 'absolute',
          bottom: `-30${offsetY}%`,
          right: `-30${offsetX}%`,
          width: '130%',
          height: '130%',
          background: `radial-gradient(ellipse at ${dir.to}, ${color} 0%, transparent 60%)`,
          opacity: 0.5,
          transform: `rotate(${interpolate(Math.sin(frame * 0.015 + 1), [-1, 1], [-15, 15])}deg)`,
          transition: animated ? 'all 0.1s ease' : 'none',
        }}
      />
    </div>
  );
};