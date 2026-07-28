import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface LensFlareProps {
  intensity?: number;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
  color?: string;
  size?: number;
  animated?: boolean;
}

export const LensFlare: React.FC<LensFlareProps> = ({
  intensity = 0.4,
  position = 'topRight',
  color = '#FFA500',
  size = 50,
  animated = true,
}) => {
  const frame = useCurrentFrame();

  const getPosition = () => {
    const positions = {
      topLeft: { left: '10%', top: '10%' },
      topRight: { right: '10%', top: '10%' },
      bottomLeft: { left: '10%', bottom: '10%' },
      bottomRight: { right: '10%', bottom: '10%' },
      center: { left: '50%', top: '50%' },
    };
    return positions[position] || positions.topRight;
  };

  const pulse = animated 
    ? 0.7 + Math.sin(frame * 0.02) * 0.3
    : 1;

  const pos = getPosition();

  return (
    <div
      style={{
        position: 'absolute',
        ...pos,
        transform: 'translate(-50%, -50%)',
        width: size * pulse * 2,
        height: size * pulse * 2,
        pointerEvents: 'none',
        opacity: intensity * pulse,
      }}
    >
      {/* Main flare */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: 'blur(10px)',
          opacity: 0.3,
        }}
      />
      
      {/* Bright center */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20%',
          height: '20%',
          borderRadius: '50%',
          backgroundColor: 'white',
          filter: 'blur(2px)',
          opacity: 0.8,
        }}
      />
      
      {/* Flare streaks */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${angle + frame * 0.1}deg)`,
            width: `${80 + Math.sin(frame * 0.03 + i) * 20}%`,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            opacity: 0.1 * (0.5 + Math.sin(frame * 0.05 + i) * 0.5),
            filter: 'blur(1px)',
          }}
        />
      ))}
      
      {/* Small dots */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${50 + Math.sin(i * 2.5 + frame * 0.02) * 40}%`,
            left: `${50 + Math.cos(i * 2.5 + frame * 0.02) * 40}%`,
            width: `${5 + i * 3}px`,
            height: `${5 + i * 3}px`,
            borderRadius: '50%',
            backgroundColor: 'white',
            filter: 'blur(1px)',
            opacity: 0.3 * (1 - i * 0.2),
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};