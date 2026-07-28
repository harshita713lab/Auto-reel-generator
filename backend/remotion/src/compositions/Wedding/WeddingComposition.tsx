import React from 'react';
import { Sequence, AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { 
  AnimatedImage, 
  AnimatedText, 
  Background, 
  MusicPlayer, 
  Overlay, 
  ProgressBar 
} from '../../components';
import { useImageTiming } from '../../hooks';

interface WeddingCompositionProps {
  images: Array<{
    path: string;
    duration: number;
    animation: string;
    transition: string;
  }>;
  music?: {
    path: string;
    volume?: number;
  };
  config?: {
    backgroundColor?: string;
    transitionDuration?: number;
    effects?: string[];
  };
}

export const WeddingComposition: React.FC<WeddingCompositionProps> = ({
  images = [],
  music,
  config = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const {
    backgroundColor = '#1a0a0a',
    transitionDuration = 0.5,
    effects = ['vignette', 'lightLeak'],
  } = config;

  const totalDuration = images.reduce((sum, img) => sum + img.duration, 0);
  const totalFrames = totalDuration * fps;

  const timing = useImageTiming({
    imageCount: images.length,
    totalDuration,
    transitionDuration,
  });

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Gradient Background */}
      <Background
        gradient={['#1a0a0a', '#2d1b1b', '#1a0a0a']}
        gradientDirection="vertical"
        opacity={1}
      />

      {/* Image Sequence */}
      {images.map((image, index) => {
        const imageTiming = timing.getImageTiming(index);
        const startFrame = imageTiming.start * fps;
        const endFrame = imageTiming.end * fps;
        const durationFrames = endFrame - startFrame;

        return (
          <Sequence key={index} from={startFrame} durationInFrames={durationFrames}>
            <AnimatedImage
              src={image.path}
              durationInFrames={durationFrames}
              animation={image.animation || 'kenBurns'}
              style={{
                opacity: timing.currentIndex === index ? 1 : 0,
              }}
            />
          </Sequence>
        );
      })}

      {/* Vignette Effect */}
      {effects.includes('vignette') && (
        <Overlay
          opacity={0.5}
          color="#000000"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
          }}
        />
      )}

      {/* Light Leak Effect */}
      {effects.includes('lightLeak') && (
        <Overlay
          opacity={0.2}
          color="#FF6B35"
          style={{
            background: 'radial-gradient(ellipse at 70% 30%, rgba(255,107,53,0.3) 0%, transparent 60%)',
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* Title */}
      <Sequence from={0} durationInFrames={fps * 2}>
        <AnimatedText
          text="✨ Our Love Story ✨"
          durationInFrames={fps * 1.5}
          animation="fade"
          fontSize={60}
          color="#FFD700"
          style={{
            position: 'absolute',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            textShadow: '0 0 30px rgba(255,215,0,0.3)',
          }}
        />
      </Sequence>

      {/* Romantic Message */}
      <Sequence from={fps * 3} durationInFrames={fps * 3}>
        <AnimatedText
          text="Every moment with you is a treasure ❤️"
          durationInFrames={fps * 2}
          animation="fade"
          fontSize={36}
          color="#FFB6C1"
          style={{
            position: 'absolute',
            bottom: '25%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            textShadow: '0 0 20px rgba(255,182,193,0.3)',
          }}
        />
      </Sequence>

      {/* Ending Text */}
      <Sequence from={totalFrames - fps * 3} durationInFrames={fps * 3}>
        <AnimatedText
          text="Forever & Always 💕"
          durationInFrames={fps * 2}
          animation="fade"
          fontSize={50}
          color="#FFD700"
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            textShadow: '0 0 30px rgba(255,215,0,0.3)',
          }}
        />
      </Sequence>

      {/* Music Player */}
      {music && (
        <MusicPlayer
          src={music.path}
          volume={music.volume || 1}
          fadeInDuration={2}
          fadeOutDuration={2}
          duration={totalDuration}
          showVisualizer={true}
        />
      )}

      {/* Progress Bar */}
      <ProgressBar
        durationInFrames={totalFrames}
        color="#FFD700"
        backgroundColor="rgba(255,255,255,0.1)"
        height={3}
        width="60%"
        position="bottom"
        showPercentage={false}
        style={{ bottom: 20 }}
      />

      {/* Floating Hearts */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = 10 + (i * 12) + Math.sin(i * 2 + frame * 0.005) * 5;
        const y = 10 + Math.sin(i * 1.5 + frame * 0.008) * 10;
        const size = 15 + Math.sin(i + frame * 0.01) * 8;
        const opacity = 0.1 + Math.sin(i * 0.5 + frame * 0.005) * 0.05 + 0.05;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              fontSize: size,
              opacity,
              color: '#FF6B6B',
              pointerEvents: 'none',
              transform: `rotate(${Math.sin(i + frame * 0.01) * 20}deg)`,
            }}
          >
            ❤️
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default WeddingComposition;