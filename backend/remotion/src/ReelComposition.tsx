import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import type { ReelProps } from './types';
import React from 'react';

// ============================================================
// 🔥 EFFECT & TRANSITION TYPES
// ============================================================
type EffectFn = (frame: number, durationInFrames: number) => React.CSSProperties;

// ============================================================
// 🎬 WORKING EFFECTS (NO COLOR GRADES)
// ============================================================
const EFFECT_STYLES: Record<string, EffectFn> = {
  'none': () => ({}),
  
  // ============================================================
  // ZOOM EFFECTS
  // ============================================================
  'zoomin': (frame, duration) => {
    const scale = interpolate(frame, [0, duration * 0.1, duration * 0.9, duration], [0.8, 1.15, 1.15, 1.0]);
    return { transform: `scale(${scale})` };
  },
  'zoomout': (frame, duration) => {
    const scale = interpolate(frame, [0, duration * 0.1, duration * 0.9, duration], [1.2, 1.0, 1.0, 1.05]);
    return { transform: `scale(${scale})` };
  },
  'zoom-in': (frame, duration) => ({
    transform: `scale(${interpolate(frame, [0, duration], [1.0, 1.25], { extrapolateRight: 'clamp' })})`,
  }),
  'zoom-out': (frame, duration) => ({
    transform: `scale(${interpolate(frame, [0, duration], [1.25, 1.0], { extrapolateRight: 'clamp' })})`,
  }),
  'zoom-slow': (frame, duration) => ({
    transform: `scale(${interpolate(frame, [0, duration], [1.0, 1.15], { extrapolateRight: 'clamp' })})`,
  }),
  'zoom-fast': (frame, duration) => ({
    transform: `scale(${interpolate(frame, [0, duration * 0.3, duration], [1.0, 1.3, 1.0], { extrapolateRight: 'clamp' })})`,
  }),
  'zoom-pulse': (frame, duration) => ({
    transform: `scale(${1 + 0.08 * Math.sin((frame / duration) * Math.PI * 4)})`,
  }),
  'zoomInOut': (frame, duration) => {
    const half = duration / 2;
    const scale = frame < half
      ? interpolate(frame, [0, half], [1, 1.18])
      : interpolate(frame, [half, duration], [1.18, 1.05]);
    const rotate = Math.sin(frame * 0.03) * 0.6;
    return { transform: `scale(${scale}) rotate(${rotate}deg)` };
  },
  'fast_slow': (frame, duration) => ({
    transform: `scale(${interpolate(frame, [0, 10, duration], [1, 1.18, 1.25], { extrapolateRight: 'clamp' })})`,
  }),

  // ============================================================
  // SLIDE EFFECTS
  // ============================================================
  'slide-left': (frame, duration) => ({
    transform: `translateX(${interpolate(frame, [0, Math.min(15, duration)], [-100, 0], { extrapolateRight: 'clamp' })}%)`,
  }),
  'slide-right': (frame, duration) => ({
    transform: `translateX(${interpolate(frame, [0, Math.min(15, duration)], [100, 0], { extrapolateRight: 'clamp' })}%)`,
  }),
  'slide-up': (frame, duration) => ({
    transform: `translateY(${interpolate(frame, [0, Math.min(15, duration)], [100, 0], { extrapolateRight: 'clamp' })}%)`,
  }),
  'slide-down': (frame, duration) => ({
    transform: `translateY(${interpolate(frame, [0, Math.min(15, duration)], [-100, 0], { extrapolateRight: 'clamp' })}%)`,
  }),
  'slide': (frame, duration) => ({
    transform: `translateX(${interpolate(frame, [0, duration], [-100, 0], { extrapolateRight: 'clamp' })}%)`,
  }),
  'smoothleft': (frame, duration) => ({
    transform: `translateX(${interpolate(frame, [0, Math.min(20, duration)], [100, 0], { extrapolateRight: 'clamp' })}%)`,
  }),
  'smoothright': (frame, duration) => ({
    transform: `translateX(${interpolate(frame, [0, Math.min(20, duration)], [-100, 0], { extrapolateRight: 'clamp' })}%)`,
  }),
  'smoothup': (frame, duration) => ({
    transform: `translateY(${interpolate(frame, [0, Math.min(20, duration)], [100, 0], { extrapolateRight: 'clamp' })}%)`,
  }),
  'smoothdown': (frame, duration) => ({
    transform: `translateY(${interpolate(frame, [0, Math.min(20, duration)], [-100, 0], { extrapolateRight: 'clamp' })}%)`,
  }),

  // ============================================================
  // HERO SLIDE EFFECTS
  // ============================================================
  'heroSlideLeft': (frame, duration) => {
    const progress = frame / duration;
    const x = interpolate(frame, [0, duration], [160, 0], { extrapolateRight: 'clamp' });
    const scale = progress < 0.6
      ? interpolate(frame, [0, duration * 0.6], [1.0, 1.18])
      : interpolate(frame, [duration * 0.6, duration], [1.18, 1.05]);
    const blur = interpolate(frame, [0, duration * 0.25], [25, 0], { extrapolateRight: 'clamp' });
    const opacity = interpolate(frame, [0, duration * 0.15], [0, 1], { extrapolateRight: 'clamp' });
    const circle = interpolate(frame, [0, duration * 0.35], [0, 150], { extrapolateRight: 'clamp' });
    return {
      opacity,
      transform: `translateX(${x}px) scale(${scale})`,
      filter: `blur(${blur}px)`,
      clipPath: `circle(${circle}% at 50% 50%)`,
    };
  },
  'heroSlideRight': (frame, duration) => {
    const progress = frame / duration;
    const x = interpolate(frame, [0, duration], [-160, 0], { extrapolateRight: 'clamp' });
    const scale = progress < 0.6
      ? interpolate(frame, [0, duration * 0.6], [1.0, 1.18])
      : interpolate(frame, [duration * 0.6, duration], [1.18, 1.05]);
    const blur = interpolate(frame, [0, duration * 0.25], [25, 0], { extrapolateRight: 'clamp' });
    const opacity = interpolate(frame, [0, duration * 0.15], [0, 1], { extrapolateRight: 'clamp' });
    const circle = interpolate(frame, [0, duration * 0.35], [0, 150], { extrapolateRight: 'clamp' });
    return {
      opacity,
      transform: `translateX(${x}px) scale(${scale})`,
      filter: `blur(${blur}px)`,
      clipPath: `circle(${circle}% at 50% 50%)`,
    };
  },

  // ============================================================
  // 3D EFFECTS
  // ============================================================
  'cube': (frame, duration) => ({
    transform: `perspective(1000px) rotateY(${interpolate(frame, [0, Math.min(15, duration)], [90, 0], { extrapolateRight: 'clamp' })}deg) scale(0.9)`,
  }),
  'flip': (frame, duration) => ({
    transform: `perspective(1000px) rotateX(${interpolate(frame, [0, Math.min(15, duration)], [180, 0], { extrapolateRight: 'clamp' })}deg) scale(0.9)`,
  }),
  'rotate-in': (frame, duration) => ({
    transform: `rotate(${interpolate(frame, [0, duration], [-30, 0])}deg) scale(${interpolate(frame, [0, duration * 0.3, duration], [0.5, 1.1, 1.0])})`,
  }),
  '3d': (frame, duration) => ({
    transform: `perspective(800px) rotateY(${30 * Math.sin((frame / duration) * Math.PI * 2)})`,
  }),

  // ============================================================
  // GLOW & SHINE EFFECTS (No color change)
  // ============================================================
  'glow': (frame) => ({
    filter: `brightness(${1 + 0.2 * Math.sin(frame * 0.05)})`,
    boxShadow: `0 0 ${30 + 20 * Math.sin(frame * 0.03)}px rgba(255,255,255,${0.3 + 0.2 * Math.sin(frame * 0.04)})`,
  }),
  'shine': (frame) => ({
    filter: `brightness(${1 + 0.15 * Math.sin(frame * 0.08)})`,
  }),
  'glamour': (frame) => ({
    filter: `brightness(1.1) blur(${0.5 * Math.sin(frame * 0.02)}px)`,
  }),

  // ============================================================
  // WIPE EFFECTS
  // ============================================================
  'wipeleft': (frame, duration) => ({
    clipPath: `inset(0 ${100 - interpolate(frame, [0, Math.min(15, duration)], [0, 100], { extrapolateRight: 'clamp' })}% 0 0)`,
  }),
  'wiperight': (frame, duration) => ({
    clipPath: `inset(0 0 0 ${interpolate(frame, [0, Math.min(15, duration)], [100, 0], { extrapolateRight: 'clamp' })}%)`,
  }),
  'wipeup': (frame, duration) => ({
    clipPath: `inset(${100 - interpolate(frame, [0, Math.min(15, duration)], [0, 100], { extrapolateRight: 'clamp' })}% 0 0 0)`,
  }),
  'wipedown': (frame, duration) => ({
    clipPath: `inset(0 0 ${100 - interpolate(frame, [0, Math.min(15, duration)], [0, 100], { extrapolateRight: 'clamp' })}% 0)`,
  }),

  // ============================================================
  // SPECIAL EFFECTS
  // ============================================================
  'blur': (frame, duration) => ({
    filter: `blur(${interpolate(frame, [0, Math.min(10, duration)], [15, 0], { extrapolateRight: 'clamp' })}px)`,
  }),
  'blurreveal': (frame, duration) => ({
    filter: `blur(${interpolate(frame, [0, Math.min(15, duration)], [20, 0], { extrapolateRight: 'clamp' })})`,
    opacity: interpolate(frame, [0, Math.min(10, duration)], [0.3, 1], { extrapolateRight: 'clamp' }),
  }),
  'sparkle': (frame) => ({
    filter: `brightness(${1 + 0.1 * Math.sin(frame * 0.1)})`,
  }),
  'pop': (frame, duration) => ({
    transform: `scale(${interpolate(frame, [0, Math.min(8, duration), duration], [1.3, 1.0, 1.0], { extrapolateRight: 'clamp' })})`,
    opacity: interpolate(frame, [0, Math.min(5, duration)], [0, 1], { extrapolateRight: 'clamp' }),
  }),
  'popup': (frame, duration) => {
    const scale = interpolate(frame, [0, duration * 0.2], [0.9, 1.0], { extrapolateRight: 'clamp' });
    return { transform: `scale(${scale})` };
  },
  'pulse': (frame, duration) => {
    const scale = interpolate(frame, [0, duration * 0.5, duration], [1.0, 1.08, 1.0]);
    return { transform: `scale(${scale})` };
  },

  // ============================================================
  // FILM EFFECTS
  // ============================================================
  'film-grain': (frame) => ({
    opacity: 0.95 + 0.05 * Math.sin(frame * 0.5),
  }),
  'flash': (frame) => ({
    filter: frame % 20 < 2 ? 'brightness(2)' : 'none',
  }),
  'pixelize': (frame) => ({
    transform: frame % 25 < 3 ? 'scale(2)' : 'scale(1)',
  }),
};

// ============================================================
// 🚀 WORKING TRANSITION STYLES
// ============================================================
const getTransitionStyle = (transitionName: string, frame: number): React.CSSProperties => {
  if (!transitionName || transitionName === 'none') return {};

  // FADE TRANSITIONS
  if (transitionName === 'fade' || transitionName === 'dissolve' || transitionName === 'dreamyFade') {
    const opacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
    return { opacity };
  }

  // SLIDE TRANSITIONS
  if (transitionName === 'smoothleft' || transitionName === 'slideleft') {
    const x = interpolate(frame, [0, 20], [1080, 0], { extrapolateRight: 'clamp' });
    return { transform: `translateX(${x}px)` };
  }
  if (transitionName === 'smoothright' || transitionName === 'slideright') {
    const x = interpolate(frame, [0, 20], [-1080, 0], { extrapolateRight: 'clamp' });
    return { transform: `translateX(${x}px)` };
  }
  if (transitionName === 'slideup' || transitionName === 'wipeup') {
    const y = interpolate(frame, [0, 20], [1920, 0], { extrapolateRight: 'clamp' });
    return { transform: `translateY(${y}px)` };
  }
  if (transitionName === 'slidedown' || transitionName === 'wipedown') {
    const y = interpolate(frame, [0, 20], [-1920, 0], { extrapolateRight: 'clamp' });
    return { transform: `translateY(${y}px)` };
  }

  // CARD FLIP TRANSITIONS
  if (transitionName === 'cardFlipHorizontal') {
    const rotateY = interpolate(frame, [0, 20], [180, 0], { extrapolateRight: 'clamp' });
    const opacity = interpolate(frame, [0, 10, 20], [0, 1, 1], { extrapolateRight: 'clamp' });
    return { 
      transform: `perspective(1200px) rotateY(${rotateY}deg) scale(0.9)`,
      opacity,
      backfaceVisibility: 'hidden',
    };
  }
  if (transitionName === 'cardFlipVertical') {
    const rotateX = interpolate(frame, [0, 20], [180, 0], { extrapolateRight: 'clamp' });
    const opacity = interpolate(frame, [0, 10, 20], [0, 1, 1], { extrapolateRight: 'clamp' });
    return { 
      transform: `perspective(1200px) rotateX(${rotateX}deg) scale(0.9)`,
      opacity,
      backfaceVisibility: 'hidden',
    };
  }

  // 3D PAGE FLIP
  if (transitionName === '3DPageFlip') {
    const rotateY = interpolate(frame, [0, 25], [-180, 0], { extrapolateRight: 'clamp' });
    const scale = interpolate(frame, [0, 25], [0.8, 1], { extrapolateRight: 'clamp' });
    return { 
      transform: `perspective(1500px) rotateY(${rotateY}deg) scale(${scale})`,
      backfaceVisibility: 'hidden',
    };
  }
  if (transitionName === 'flipRotate') {
    const rotate = interpolate(frame, [0, 25], [360, 0], { extrapolateRight: 'clamp' });
    const scale = interpolate(frame, [0, 12, 25], [0.5, 1.1, 1], { extrapolateRight: 'clamp' });
    return { 
      transform: `perspective(1000px) rotateY(${rotate}deg) scale(${scale})`,
    };
  }

  // CUBE ROTATIONS
  if (transitionName === 'cubeRotateLeft') {
    const rotateY = interpolate(frame, [0, 25], [90, 0], { extrapolateRight: 'clamp' });
    const scale = interpolate(frame, [0, 25], [0.8, 1], { extrapolateRight: 'clamp' });
    return { 
      transform: `perspective(1200px) rotateY(${rotateY}deg) scale(${scale})`,
    };
  }
  if (transitionName === 'cubeRotateRight') {
    const rotateY = interpolate(frame, [0, 25], [-90, 0], { extrapolateRight: 'clamp' });
    const scale = interpolate(frame, [0, 25], [0.8, 1], { extrapolateRight: 'clamp' });
    return { 
      transform: `perspective(1200px) rotateY(${rotateY}deg) scale(${scale})`,
    };
  }
  if (transitionName === 'cubeRotateUp') {
    const rotateX = interpolate(frame, [0, 25], [90, 0], { extrapolateRight: 'clamp' });
    const scale = interpolate(frame, [0, 25], [0.8, 1], { extrapolateRight: 'clamp' });
    return { 
      transform: `perspective(1200px) rotateX(${rotateX}deg) scale(${scale})`,
    };
  }
  if (transitionName === 'cubeRotateDown') {
    const rotateX = interpolate(frame, [0, 25], [-90, 0], { extrapolateRight: 'clamp' });
    const scale = interpolate(frame, [0, 25], [0.8, 1], { extrapolateRight: 'clamp' });
    return { 
      transform: `perspective(1200px) rotateX(${rotateX}deg) scale(${scale})`,
    };
  }

  // SPEED BLUR
  if (transitionName === 'speedBlurOut') {
    const blur = interpolate(frame, [0, 10, 20], [0, 15, 0], { extrapolateRight: 'clamp' });
    const scale = interpolate(frame, [0, 10, 20], [1, 1.15, 1], { extrapolateRight: 'clamp' });
    const opacity = interpolate(frame, [0, 5, 15, 20], [1, 0.5, 0.5, 1], { extrapolateRight: 'clamp' });
    return { 
      filter: `blur(${blur}px)`,
      transform: `scale(${scale})`,
      opacity,
    };
  }

  // ADVANCED TRANSITIONS
  if (transitionName === 'cinematicZoom') {
    const scale = interpolate(frame, [0, 25], [1.15, 1], { extrapolateRight: 'clamp' });
    const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
    return { transform: `scale(${scale})`, opacity };
  }
  if (transitionName === 'smoothRotate') {
    const rotate = interpolate(frame, [0, 25], [6, 0], { extrapolateRight: 'clamp' });
    const scale = interpolate(frame, [0, 25], [0.95, 1], { extrapolateRight: 'clamp' });
    return { transform: `scale(${scale}) rotate(${rotate}deg)` };
  }
  if (transitionName === 'parallaxSlide') {
    const x = interpolate(frame, [0, 25], [300, 0], { extrapolateRight: 'clamp' });
    return { transform: `translateX(${x}px)` };
  }
  if (transitionName === 'smoothBounce') {
    const y = interpolate(frame, [0, 12, 22, 30], [150, -20, 10, 0], { extrapolateRight: 'clamp' });
    const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
    return { transform: `translateY(${y}px)`, opacity };
  }
  if (transitionName === 'glitchFlash') {
    const opacity = interpolate(frame, [0, 5, 10, 20], [0.2, 1, 0.6, 1], { extrapolateRight: 'clamp' });
    const skew = interpolate(frame, [0, 8, 15], [10, -5, 0], { extrapolateRight: 'clamp' });
    return { opacity, transform: `skewX(${skew}deg)` };
  }
  if (transitionName === 'fastWipe') {
    const progress = interpolate(frame, [0, 10], [1080, 0], { extrapolateRight: 'clamp' });
    return { transform: `translateX(${progress}px)` };
  }
  if (transitionName.includes('wipe')) {
    const progress = interpolate(frame, [0, 20], [1080, 0], { extrapolateRight: 'clamp' });
    return { transform: `translateX(${progress}px)` };
  }

  // BLUR REVEAL
  if (transitionName === 'blurreveal') {
    const blur = interpolate(frame, [0, 18], [25, 0], { extrapolateRight: 'clamp' });
    const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
    return { filter: `blur(${blur}px)`, opacity };
  }

  // GLOW EFFECT
  if (transitionName === 'glow') {
    const brightness = 1 + 0.3 * Math.sin(frame * 0.05);
    return { 
      filter: `brightness(${brightness})`,
      boxShadow: `0 0 ${30 + 20 * Math.sin(frame * 0.04)}px rgba(255,255,255,${0.2 + 0.2 * Math.sin(frame * 0.03)})`,
    };
  }

  // SPARKLE
  if (transitionName === 'sparkle') {
    return {
      filter: `brightness(${1 + 0.15 * Math.sin(frame * 0.12)})`,
    };
  }

  // POP
  if (transitionName === 'pop') {
    const scale = interpolate(frame, [0, 10, 20], [1.3, 0.95, 1.0], { extrapolateRight: 'clamp' });
    const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
    return { transform: `scale(${scale})`, opacity };
  }

  // WAVE TRANSITIONS
  if (transitionName.includes('wave')) {
    const progress = interpolate(frame, [0, 25], [0, 100], { extrapolateRight: 'clamp' });
    if (transitionName === 'waveleft') {
      return { clipPath: `inset(0 ${100 - progress}% 0 0)` };
    }
    if (transitionName === 'waveright') {
      return { clipPath: `inset(0 0 0 ${100 - progress}%)` };
    }
    if (transitionName === 'waveup') {
      return { clipPath: `inset(${100 - progress}% 0 0 0)` };
    }
    if (transitionName === 'wavedown') {
      return { clipPath: `inset(0 0 ${100 - progress}% 0)` };
    }
  }

  // BLUR
  if (transitionName === 'blur') {
    const blur = interpolate(frame, [0, 15], [20, 0], { extrapolateRight: 'clamp' });
    return { filter: `blur(${blur}px)` };
  }

  return {};
};

// ============================================================
// 🔥 IMAGE WITH EFFECTS COMPONENT
// ============================================================
interface ReelImageProps {
  src: string;
  effectName: string;
  transitionName?: string;
  durationInFrames: number;
  vignette?: boolean;
  effectsList?: string[];
  blurBackground?: boolean;
}

const ReelImage: React.FC<ReelImageProps> = ({ 
  src, 
  effectName, 
  transitionName = 'none',
  durationInFrames,
  vignette = false,
  effectsList = [],
  blurBackground = false,
}) => {
  const frame = useCurrentFrame();
  
  const hasGlassBlurBg = blurBackground || effectsList.includes('glassBlurBg');

  const effectFn: EffectFn = EFFECT_STYLES[effectName] || EFFECT_STYLES['none'];
  const effectStyle = effectFn(frame, durationInFrames);
  
  const transitionStyle = getTransitionStyle(transitionName, frame);
  
  const combinedStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    position: 'relative',
    zIndex: 2,
    ...effectStyle,
    ...transitionStyle,
  };
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#0a0a0a' }}>
      {hasGlassBlurBg && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, overflow: 'hidden' }}>
          <img
            src={src}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(25px) brightness(0.55) saturate(1.2)',
              transform: 'scale(1.25)',
            }}
            alt="Blur Background"
          />
        </div>
      )}

      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img
          src={src}
          style={hasGlassBlurBg ? { ...combinedStyle, width: '90%', height: '82%', objectFit: 'contain', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' } : combinedStyle}
          alt="Reel slide"
        />
      </div>

      {vignette && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none',
          zIndex: 3,
        }} />
      )}
    </div>
  );
};

// ============================================================
// 🔥 MAIN COMPOSITION
// ============================================================
export const ReelComposition: React.FC<ReelProps> = ({ images, template }) => {
  const { 
    effects = ['none'], 
    slideDuration = 3, 
    width = 1080, 
    height = 1920,
    transitions = [], 
    vignette = false, 
    blurBackground = false,
  } = template || {};
  
  const durationInFrames = Math.round(slideDuration * 30);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', width, height }}>
      {images.map((img: string, index: number) => {
        const startFrame = index * durationInFrames;
        const effectName = effects[index % effects.length] || 'none';
        const transitionName = transitions.length > 0 ? transitions[index % transitions.length] : 'none';
        
        return (
          <Sequence 
            key={index} 
            from={startFrame} 
            durationInFrames={durationInFrames}
          >
            <ReelImage 
              src={img} 
              effectName={effectName}
              transitionName={transitionName}
              durationInFrames={durationInFrames}
              vignette={vignette}
              effectsList={effects}
              blurBackground={blurBackground}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};