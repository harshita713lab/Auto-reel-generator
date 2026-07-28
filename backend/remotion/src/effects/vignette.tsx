import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface VignetteProps {
  intensity?: number;
  radius?: number;
  color?: string;
  opacity?: number;
  animated?: boolean;
  children?: React.ReactNode;
}

export const Vignette: React.FC<VignetteProps> = ({
  intensity = 0.5,
  radius = 0.8,
  color = '#000000',
  opacity = 1,
  animated = true,
  children,
}) => {
  const frame = useCurrentFrame();

  const pulse = animated 
    ? 0.9 + Math.sin(frame * 0.01) * 0.1
    : 1;

  const currentIntensity = intensity * pulse;
  const currentRadius = radius * (0.9 + Math.sin(frame * 0.008) * 0.1);

  const gradientStops = [
    `rgba(0,0,0,0) ${currentRadius * 100}%`,
    `${color} ${currentRadius * 100 + 10}%`,
    `${color} 100%`,
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Vignette overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(ellipse at center, ${gradientStops.join(', ')})`,
          opacity: opacity * currentIntensity,
          pointerEvents: 'none',
          transition: animated ? 'all 0.05s ease' : 'none',
          mixBlendMode: 'multiply',
        }}
      />
      
      {/* Subtle inner shadow for depth */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          boxShadow: `inset 0 0 ${100 * currentIntensity}px ${50 * currentIntensity}px rgba(0,0,0,${0.3 * currentIntensity})`,
          pointerEvents: 'none',
        }}
      />
      
      {children}
    </div>
  );
};