import React from 'react';
import { useCurrentFrame, random } from 'remotion';

interface BokehProps {
  count?: number;
  size?: number;
  blur?: number;
  color?: string;
  opacity?: number;
  animated?: boolean;
}

export const Bokeh: React.FC<BokehProps> = ({
  count = 30,
  size = 15,
  blur = 5,
  color = '#FFFFFF',
  opacity = 0.3,
  animated = true,
}) => {
  const frame = useCurrentFrame();

  const bokehCircles = Array.from({ length: count }, (_, i) => {
    const seed = i * 100;
    const x = random(seed) * 100;
    const y = random(seed + 1) * 100;
    const s = size * (0.3 + random(seed + 2) * 0.7);
    const o = opacity * (0.3 + random(seed + 3) * 0.7);
    const delay = random(seed + 4) * 100;
    
    const animOffset = animated 
      ? Math.sin((frame + delay) * 0.02) * 10
      : 0;

    return {
      x,
      y,
      size: s,
      opacity: o,
      delay,
      animOffset,
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
      {bokehCircles.map((circle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${circle.x}%`,
            top: `${circle.y + circle.animOffset}%`,
            width: circle.size,
            height: circle.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            opacity: circle.opacity,
            filter: `blur(${blur * (circle.size / size)}px)`,
            transform: `translate(-50%, -50%) scale(${1 + Math.sin((frame + circle.delay) * 0.03) * 0.2})`,
            transition: animated ? 'all 0.1s ease' : 'none',
          }}
        />
      ))}
    </div>
  );
};