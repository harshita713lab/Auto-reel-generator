import React from 'react';
import { useCurrentFrame, random } from 'remotion';

interface ParticlesProps {
  count?: number;
  size?: number;
  color?: string;
  opacity?: number;
  speed?: number;
  spread?: number;
}

export const Particles: React.FC<ParticlesProps> = ({
  count = 100,
  size = 3,
  color = '#FFFFFF',
  opacity = 0.4,
  speed = 0.3,
  spread = 50,
}) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: count }, (_, i) => {
    const seed = i * 300;
    const x = random(seed) * 100;
    const y = random(seed + 1) * 100;
    const s = size * (0.3 + random(seed + 2) * 0.7);
    const delay = random(seed + 3) * 100;
    const angle = random(seed + 4) * Math.PI * 2;
    const radius = random(seed + 5) * spread;
    
    const progress = (frame + delay) * 0.005 * speed;
    const xOffset = Math.cos(angle + progress) * radius * (0.5 + Math.sin(progress * 0.5) * 0.3);
    const yOffset = Math.sin(angle + progress) * radius * (0.5 + Math.cos(progress * 0.5) * 0.3);

    return {
      x: (x + xOffset) % 100,
      y: (y + yOffset) % 100,
      size: s,
      opacity: opacity * (0.3 + Math.sin(progress + i) * 0.3 + 0.3),
      glow: random(seed + 6) * 10,
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
            boxShadow: `0 0 ${particle.glow}px ${particle.glow * 0.5}px ${color}`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.1s ease',
          }}
        />
      ))}
    </div>
  );
};