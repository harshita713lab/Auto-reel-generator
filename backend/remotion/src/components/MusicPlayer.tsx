import React from 'react';
import { Audio, useCurrentFrame, useVideoConfig } from 'remotion';

interface MusicPlayerProps {
  src: string;
  volume?: number;
  startFrom?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  duration?: number;
  loop?: boolean;
  showVisualizer?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  src,
  volume = 1,
  startFrom = 0,
  fadeInDuration = 1,
  fadeOutDuration = 1,
  duration,
  loop = false,
  showVisualizer = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalDuration = duration || 30;

  const getVolume = () => {
    const startFadeFrames = fadeInDuration * fps;
    const endFadeFrames = (totalDuration - fadeOutDuration) * fps;
    const totalFrames = totalDuration * fps;

    let vol = volume;

    if (frame < startFadeFrames) {
      vol = volume * (frame / startFadeFrames);
    }

    if (frame > endFadeFrames && totalFrames > endFadeFrames) {
      vol = volume * (1 - (frame - endFadeFrames) / (totalFrames - endFadeFrames));
    }

    return Math.max(0, Math.min(1, vol));
  };

  // Generate waveform bars
  const bars = 40;
  const waveform = Array.from({ length: bars }, (_, i) => {
    return 10 + Math.sin(i * 0.5 + frame * 0.02) * 20 + Math.random() * 10;
  });

  return (
    <>
      <Audio
        src={src}
        volume={getVolume()}
        startFrom={startFrom}
        loop={loop}
      />
      
      {showVisualizer && (
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            height: 60,
            opacity: 0.6,
          }}
        >
          {waveform.map((height, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: height * 0.6,
                backgroundColor: '#FFFFFF',
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};