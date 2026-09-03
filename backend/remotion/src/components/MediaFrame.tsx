import React from 'react';
import { Img, OffthreadVideo } from 'remotion';
import AnimatedImage from './AnimatedImage';

export interface MediaItem {
  path?: string;
  url?: string;
  type?: 'image' | 'video';
  duration?: number;
  startOffset?: number;
  muted?: boolean;
  animation?: string;
  style?: React.CSSProperties;
}

export interface MediaFrameProps {
  item?: MediaItem | string;
  src?: string;
  type?: 'image' | 'video';
  animation?: string;
  startOffset?: number;
  slotDuration?: number;
  muted?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const MediaFrame: React.FC<MediaFrameProps> = ({
  item,
  src: directSrc,
  type: directType,
  animation: directAnimation,
  startOffset: directStartOffset,
  slotDuration,
  muted: directMuted,
  style,
}) => {
  const mediaObj: MediaItem = typeof item === 'object' && item !== null ? item : {};
  const src = directSrc || mediaObj.path || mediaObj.url || (typeof item === 'string' ? item : '');
  
  const isVideo = directType === 'video' || mediaObj.type === 'video' || (src && /\.(mp4|mov|webm|avi|mkv)$/i.test(src));
  const startOffset = directStartOffset ?? mediaObj.startOffset ?? 0;
  const isMuted = directMuted ?? mediaObj.muted ?? true;
  const animation = directAnimation || mediaObj.animation || 'kenBurns';

  const defaultStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    ...style,
  };

  if (!src) {
    return <div style={{ ...defaultStyle, backgroundColor: '#111' }} />;
  }

  if (isVideo) {
    const fps = 30;
    const startFromFrames = Math.max(0, Math.round(startOffset * fps));
    const clipDuration = mediaObj.duration || 5;
    
    // Slow-mo stretching if video clip is shorter than slot duration
    let playbackRate = 1;
    if (slotDuration && clipDuration < slotDuration) {
      playbackRate = Math.max(0.5, Math.min(1, clipDuration / slotDuration));
    }

    return (
      <OffthreadVideo
        src={src}
        startFrom={startFromFrames}
        playbackRate={playbackRate}
        volume={isMuted ? 0 : 1}
        style={defaultStyle}
      />
    );
  }

  if (animation && animation !== 'none') {
    return <AnimatedImage src={src} animation={animation} style={defaultStyle} />;
  }

  return <Img src={src} style={defaultStyle} />;
};

export default MediaFrame;
