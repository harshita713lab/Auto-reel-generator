import React from 'react';
import { useCurrentFrame, random } from 'remotion';

interface DustProps {
  count?: number;
  size?: number;
  color?: string;
  opacity?: number;
  speed?: number;
}

export const Dust: React.FC<DustProps> = ({
  count = 50,
  size = 3,
  color = '#FFFFFF',
  opacity = 0.3,
  speed = 0.5,
}) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: count }, (_, i) => {
    const seed = i * 200;
    const x = random(seed) * 100;
    const y = random(seed + 1) * 100;
    const s = size * (0.5 + random(seed + 2) * 0.5);
    const delay = random(seed + 3) * 100;
    const driftX = (random(seed + 4) - 0.5) * 30;
    const driftY = (random(seed + 5) - 0.5) * 30;
    
    const progress = (frame + delay) * 0.01 * speed;
    const xOffset = Math.sin(progress + i) * driftX;
    const yOffset = Math.cos(progress * 0.7 + i) * driftY;

    return {
      x: (x + xOffset) % 100,
      y: (y + yOffset) % 100,
      size: s,
      opacity: opacity * (0.5 + Math.sin(progress + i) * 0.3 + 0.3),
    };
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {particles.map((particle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            backgroundColor: color,
            opacity: particle.opacity,
            filter: 'blur(1px)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};