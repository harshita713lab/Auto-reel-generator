import React from 'react';
import { Img, useCurrentFrame, interpolate } from 'remotion';

interface AnimatedImageProps {
  src: string;
  durationInFrames: number;
  animation: string;
  animationConfig?: Record<string, any>;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  durationInFrames,
  animation = 'kenBurns',
  animationConfig = {},
  className = '',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(frame / durationInFrames, 1);

  const getAnimationStyle = () => {
    const anims: Record<string, any> = {
      zoomIn: () => ({
        scale: interpolate(progress, [0, 1], [0.5, 1]),
        opacity: interpolate(progress, [0, 0.3], [0, 1]),
      }),
      zoomOut: () => ({
        scale: interpolate(progress, [0, 1], [1.5, 1]),
        opacity: interpolate(progress, [0, 0.3], [1, 0.8]),
      }),
      kenBurns: () => ({
        scale: interpolate(progress, [0, 1], [1.1, 1.4]),
        translateX: interpolate(progress, [0, 1], [0, 10]),
        translateY: interpolate(progress, [0, 1], [0, 10]),
      }),
      panLeft: () => ({
        translateX: interpolate(progress, [0, 1], [0, -100]),
      }),
      panRight: () => ({
        translateX: interpolate(progress, [0, 1], [0, 100]),
      }),
      panUp: () => ({
        translateY: interpolate(progress, [0, 1], [0, -100]),
      }),
      panDown: () => ({
        translateY: interpolate(progress, [0, 1], [0, 100]),
      }),
      bounce: () => ({
        translateY: Math.sin(progress * Math.PI * 4) * 20 * (1 - progress),
      }),
      shake: () => ({
        translateX: (Math.random() - 0.5) * 10 * (1 - progress),
        translateY: (Math.random() - 0.5) * 10 * (1 - progress),
      }),
      float: () => ({
        translateY: Math.sin(progress * Math.PI * 2) * 10,
      }),
      rotate: () => ({
        rotate: interpolate(progress, [0, 1], [0, 360]),
      }),
      fade: () => ({
        opacity: interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
      }),
      scale: () => ({
        scale: interpolate(progress, [0, 1], [0.3, 1]),
      }),
      blurIn: () => ({
        blur: interpolate(progress, [0, 1], [10, 0]),
        opacity: interpolate(progress, [0, 0.3], [0, 1]),
      }),
      blurOut: () => ({
        blur: interpolate(progress, [0, 1], [0, 10]),
        opacity: interpolate(progress, [0.7, 1], [1, 0]),
      }),
      reveal: () => ({
        scale: interpolate(progress, [0, 1], [0.8, 1]),
        opacity: progress,
      }),
      tilt: () => ({
        rotate: Math.sin(progress * Math.PI) * 15,
      }),
      parallax: () => ({
        translateX: interpolate(progress, [0, 1], [0, 20]),
        translateY: interpolate(progress, [0, 1], [0, 20]),
        scale: 1 + progress * 0.05,
      }),
      cameraPush: () => ({
        scale: 1 + progress * 0.2,
      }),
      cameraPull: () => ({
        scale: 1.2 - progress * 0.2,
      }),
      slowFloat: () => ({
        translateY: Math.sin(progress * Math.PI * 0.5) * 15,
        scale: 1 + Math.sin(progress * Math.PI * 0.5) * 0.02,
      }),
    };

    return anims[animation] || anims.kenBurns;
  };

  const animStyle = getAnimationStyle();

  const transformParts = [];
  if (animStyle.scale !== undefined) transformParts.push(`scale(${animStyle.scale})`);
  if (animStyle.translateX !== undefined) transformParts.push(`translateX(${animStyle.translateX}px)`);
  if (animStyle.translateY !== undefined) transformParts.push(`translateY(${animStyle.translateY}px)`);
  if (animStyle.rotate !== undefined) transformParts.push(`rotate(${animStyle.rotate}deg)`);

  const finalStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: transformParts.length > 0 ? transformParts.join(' ') : 'none',
    opacity: animStyle.opacity ?? 1,
    filter: animStyle.blur !== undefined ? `blur(${animStyle.blur}px)` : 'none',
    ...style,
  };

  return <Img src={src} className={className} style={finalStyle} />;
};