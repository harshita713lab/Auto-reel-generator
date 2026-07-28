import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

interface FrameProps {
  children: React.ReactNode;
  durationInFrames?: number;
  animation?: 'fade' | 'slide' | 'zoom' | 'none';
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Frame: React.FC<FrameProps> = ({
  children,
  durationInFrames = 30,
  animation = 'fade',
  delay = 0,
  className = '',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const progress = Math.max(0, Math.min((frame - delay) / durationInFrames, 1));

  const getStyle = (): React.CSSProperties => {
    switch (animation) {
      case 'fade':
        return {
          opacity: interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
        };
      case 'slide':
        return {
          opacity: interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
          transform: `translateY(${interpolate(progress, [0, 1], [50, 0])}px)`,
        };
      case 'zoom':
        return {
          opacity: interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
          transform: `scale(${interpolate(progress, [0, 1], [0.8, 1])})`,
        };
      default:
        return { opacity: 1 };
    }
  };

  return (
    <AbsoluteFill className={className} style={{ ...style, ...getStyle() }}>
      {children}
    </AbsoluteFill>
  );
};