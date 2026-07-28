import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface GlowProps {
  intensity?: number;
  color?: string;
  radius?: number;
  opacity?: number;
  animated?: boolean;
  children?: React.ReactNode;
}

export const Glow: React.FC<GlowProps> = ({
  intensity = 0.5,
  color = '#FFFFFF',
  radius = 20,
  opacity = 1,
  animated = true,
  children,
}) => {
  const frame = useCurrentFrame();

  const pulse = animated 
    ? 0.8 + Math.sin(frame * 0.02) * 0.2
    : 1;

  const glowIntensity = intensity * pulse;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Glow overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at center, ${color} 0%, transparent ${radius * glowIntensity}%)`,
          opacity: opacity * glowIntensity * 0.5,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          transition: animated ? 'all 0.1s ease' : 'none',
        }}
      />
      
      {/* Inner glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${radius * glowIntensity * 2}%`,
          height: `${radius * glowIntensity * 2}%`,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity: opacity * glowIntensity * 0.3,
          pointerEvents: 'none',
          filter: `blur(${radius * 0.5}px)`,
          transition: animated ? 'all 0.1s ease' : 'none',
        }}
      />
      
      {children}
    </div>
  );
};