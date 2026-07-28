import React from 'react';

interface OverlayProps {
  children?: React.ReactNode;
  opacity?: number;
  color?: string;
  pattern?: 'none' | 'dots' | 'grid' | 'lines';
  patternColor?: string;
  patternOpacity?: number;
  blur?: number;
  gradient?: string[];
  gradientDirection?: 'horizontal' | 'vertical' | 'diagonal' | 'radial';
  style?: React.CSSProperties;
}

export const Overlay: React.FC<OverlayProps> = ({
  children,
  opacity = 0.3,
  color = '#000000',
  pattern = 'none',
  patternColor = '#FFFFFF',
  patternOpacity = 0.1,
  blur = 0,
  gradient,
  gradientDirection = 'vertical',
  style: additionalStyle = {},
}) => {
  const getPattern = (): React.CSSProperties => {
    if (pattern === 'none') return {};

    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(circle, ${patternColor} 2px, transparent 2px)`,
          backgroundSize: '20px 20px',
        };
      case 'grid':
        return {
          backgroundImage: `
            linear-gradient(${patternColor} 1px, transparent 1px),
            linear-gradient(90deg, ${patternColor} 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        };
      case 'lines':
        return {
          backgroundImage: `repeating-linear-gradient(
            45deg,
            ${patternColor} 0px,
            ${patternColor} 2px,
            transparent 2px,
            transparent 10px
          )`,
        };
      default:
        return {};
    }
  };

  const getGradient = (): React.CSSProperties => {
    if (!gradient || gradient.length === 0) return {};

    let direction = 'to bottom';
    switch (gradientDirection) {
      case 'horizontal':
        direction = 'to right';
        break;
      case 'vertical':
        direction = 'to bottom';
        break;
      case 'diagonal':
        direction = 'to bottom right';
        break;
      case 'radial':
        return { background: `radial-gradient(circle, ${gradient.join(', ')})` };
    }

    return { background: `linear-gradient(${direction}, ${gradient.join(', ')})` };
  };

  const style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: gradient ? 'transparent' : color,
    opacity: gradient ? 1 : opacity,
    filter: `blur(${blur}px)`,
    pointerEvents: 'none',
    ...getGradient(),
    ...getPattern(),
    ...(pattern !== 'none' ? { opacity: patternOpacity } : {}),
  };

  return <div style={{ ...style, ...additionalStyle }}>{children}</div>;
};