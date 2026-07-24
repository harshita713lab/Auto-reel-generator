import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import type { ReelProps } from './types';
import React from 'react';

// ============================================================
// 🔥 EFFECT & TRANSITION TYPES
// ============================================================
type EffectFn = (frame: number, durationInFrames: number) => React.CSSProperties;

// ============================================================
// 🎬 ALL ANIMATION EFFECTS & COLOR GRADES
// ============================================================
const EFFECT_STYLES: Record<string, EffectFn> = {
  'none': () => ({}),
  
  // 🌟 TUMHARA - Advanced Zoom Effects
  'zoomin': (frame, duration) => {
    const scale = interpolate(frame, [0, duration * 0.1, duration * 0.9, duration], [0.8, 1.15, 1.15, 1.0]);
    return { transform: `scale(${scale})` };
  },
  'zoomout': (frame, duration) => {
    const scale = interpolate(frame, [0, duration * 0.1, duration * 0.9, duration], [1.2, 1.0, 1.0, 1.05]);
    return { transform: `scale(${scale})` };
  },
  
  // 🌟 TANISHA - Basic Zoom Effects (Add karna hai)
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
  'fast_slow': (frame, duration) => ({
    transform: `scale(${interpolate(frame, [0, 10, duration], [1, 1.18, 1.25], { extrapolateRight: 'clamp' })})`,
  }),

  // 🌟 TANISHA - Slide Effects (Add karna hai)
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

  // 🌟 TANISHA - 3D Effects (Add karna hai)
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

  // 🌟 TUMHARA - Color Grades (Superior)
  'vintage': () => ({ filter: 'sepia(0.6) contrast(1.1) brightness(1.05) saturate(0.8)' }),
  'golden': () => ({ filter: 'sepia(0.4) saturate(1.3) brightness(1.05) hue-rotate(-5deg)' }),
  'cinematic': () => ({ filter: 'contrast(1.1) brightness(0.95) saturate(0.9)' }),
  'deepCinematic': () => ({ filter: 'contrast(1.25) brightness(0.9) saturate(0.85)' }),
  'softfocus': () => ({ filter: 'blur(0.5px) brightness(1.05)' }),
  'warm': () => ({ filter: 'sepia(0.3) saturate(1.2)' }),
  'cool': () => ({ filter: 'hue-rotate(180deg) saturate(0.8)' }),
  'hdr': () => ({ filter: 'contrast(1.2) saturate(1.2)' }),
  'hdrGlow': () => ({ filter: 'contrast(1.3) brightness(1.1) saturate(1.3)' }),
  'hdrSurge': () => ({ filter: 'contrast(1.35) brightness(1.05) saturate(1.4)' }),
  'dreamy': () => ({ filter: 'brightness(1.1) blur(0.3px)' }),
  'dreamySoft': () => ({ filter: 'brightness(1.12) blur(0.4px) saturate(0.9)' }),
  'sepia': () => ({ filter: 'sepia(0.9)' }),
  'sepiaVintage': () => ({ filter: 'sepia(0.75) contrast(1.15) brightness(0.95)' }),
  'bw': () => ({ filter: 'grayscale(1)' }),
  'blackAndWhiteDeep': () => ({ filter: 'grayscale(1) contrast(1.4) brightness(0.95)' }),
  'glitch': () => ({ filter: 'contrast(1.4) saturate(1.5)' }),
  'glitchPulse': (frame, duration) => {
    const blurVal = interpolate(frame, [0, 5, 10, duration], [2, 0, 1, 0]);
    return { filter: `contrast(1.5) saturate(1.6) blur(${blurVal}px)` };
  },
  'neonglow': () => ({ filter: 'brightness(1.2) saturate(1.4)' }),
  'cyberNeon': () => ({ filter: 'brightness(1.25) saturate(1.7) hue-rotate(15deg) contrast(1.2)' }),
  'pulse': (frame, duration) => {
    const scale = interpolate(frame, [0, duration * 0.5, duration], [1.0, 1.08, 1.0]);
    return { transform: `scale(${scale})` };
  },
  'pastel': () => ({ filter: 'brightness(1.1) saturate(0.7)' }),
  'pastelSoft': () => ({ filter: 'brightness(1.15) saturate(0.65) contrast(0.95)' }),
  'popup': (frame, duration) => {
    const scale = interpolate(frame, [0, duration * 0.2], [0.9, 1.0], { extrapolateRight: 'clamp' });
    return { transform: `scale(${scale})` };
  },
  'vibrant': () => ({ filter: 'saturate(1.5) contrast(1.1)' }),
  'neon': () => ({ filter: 'brightness(1.25) saturate(1.6) hue-rotate(10deg)' }),
  'dramatic': () => ({ filter: 'contrast(1.3) brightness(0.9)' }),
  'rose': () => ({ filter: 'sepia(0.3) hue-rotate(320deg) saturate(1.2)' }),
  'pastelGlow': () => ({ filter: 'brightness(1.08) saturate(0.8) sepia(0.1)' }),
  'coolBlueGlow': () => ({ filter: 'brightness(1.05) saturate(0.9) hue-rotate(190deg)' }),
  'warmGlow': () => ({ filter: 'brightness(1.08) saturate(1.25) sepia(0.25)' }),
  'sepiaGlow': () => ({ filter: 'sepia(0.85) brightness(1.02)' }),
  
  // 🌟 TANISHA - Missing Effects (Add karna hai)
  'film-grain': (frame) => ({
    filter: `contrast(1.1) brightness(0.98) saturate(0.9)`,
    opacity: 0.95 + 0.05 * Math.sin(frame * 0.5),
  }),
  'flash': (frame) => ({
    filter: frame % 20 < 2 ? 'brightness(2) saturate(0)' : 'none',
  }),
  'pixelize': (frame) => ({
    filter: frame % 25 < 3 ? 'scale(0.5)' : 'none',
    transform: frame % 25 < 3 ? 'scale(2)' : 'scale(1)',
  }),
};

// ============================================================
// 🚀 TRANSITION STYLE HELPER (TUMHARA - Advanced)
// ============================================================
const getTransitionStyle = (transitionName: string, frame: number): React.CSSProperties => {
  if (!transitionName || transitionName === 'none') return {};

  // Basic Fades
  if (transitionName === 'fade' || transitionName === 'dissolve' || transitionName === 'dreamyFade') {
    const opacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
    return { opacity };
  }

  // Slides
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

  // 🌟 TUMHARA - Advanced Transitions
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
  if (transitionName === 'pixelize') {
    const blur = interpolate(frame, [0, 15], [12, 0], { extrapolateRight: 'clamp' });
    return { filter: `blur(${blur}px)` };
  }
  if (transitionName === 'fastWipe') {
    const progress = interpolate(frame, [0, 10], [1080, 0], { extrapolateRight: 'clamp' });
    return { transform: `translateX(${progress}px)` };
  }
  if (transitionName.includes('wipe')) {
    const progress = interpolate(frame, [0, 20], [1080, 0], { extrapolateRight: 'clamp' });
    return { transform: `translateX(${progress}px)` };
  }

  return {};
};

// ============================================================
// 🔥 COLLAGE COMPONENTS (TUMHARA - Keep as is)
// ============================================================
interface ThreePhotoCollageSlideProps {
  images: string[];
  vignette?: boolean;
}

const ThreePhotoCollageSlide: React.FC<ThreePhotoCollageSlideProps> = ({ images, vignette }) => {
  const frame = useCurrentFrame();

  const p1 = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const p2 = interpolate(frame, [5, 23], [0, 1], { extrapolateRight: 'clamp' });
  const p3 = interpolate(frame, [10, 28], [0, 1], { extrapolateRight: 'clamp' });

  const x1 = interpolate(p1, [0, 1], [-1080, 0]);
  const x2 = interpolate(p2, [0, 1], [1080, 0]);
  const x3 = interpolate(p3, [0, 1], [-1080, 0]);

  return (
    <div style={{ position: 'relative', width: '1080px', height: '1920px', overflow: 'hidden', backgroundColor: '#111' }}>
      <div style={{ transform: `translateX(${x1}px)`, position: 'absolute', top: '0px', width: '1080px', height: '600px' }}>
        <img src={images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Collage 1" />
      </div>
      <div style={{ transform: `translateX(${x2}px)`, position: 'absolute', top: '630px', width: '1080px', height: '600px' }}>
        <img src={images[1]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Collage 2" />
      </div>
      <div style={{ transform: `translateX(${x3}px)`, position: 'absolute', top: '1260px', width: '1080px', height: '600px' }}>
        <img src={images[2]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Collage 3" />
      </div>
      {vignette && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
};

// ============================================================
// 🔥 GRID COLLAGE COMPONENT (TUMHARA)
// ============================================================
interface GridCollageSlideProps {
  images: string[];
  vignette?: boolean;
}

const GridCollageSlide: React.FC<GridCollageSlideProps> = ({ images, vignette }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 30], [0.92, 1], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{ 
      position: 'relative', width: '1080px', height: '1920px', overflow: 'hidden', backgroundColor: '#0a0a0a',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '12px', padding: '12px',
      transform: `scale(${scale})`, opacity 
    }}>
      {images.slice(0, 4).map((img, idx) => (
        <div key={idx} style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '16px' }}>
          <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Grid ${idx}`} />
        </div>
      ))}
      {vignette && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
};

// ============================================================
// 🔥 HORIZONTAL COLLAGE COMPONENT (TUMHARA)
// ============================================================
interface HorizontalCollageSlideProps {
  images: string[];
  vignette?: boolean;
}

const HorizontalCollageSlide: React.FC<HorizontalCollageSlideProps> = ({ images, vignette }) => {
  const frame = useCurrentFrame();
  const y1 = interpolate(frame, [0, 20], [-960, 0], { extrapolateRight: 'clamp' });
  const y2 = interpolate(frame, [0, 20], [960, 0], { extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'relative', width: '1080px', height: '1920px', overflow: 'hidden', backgroundColor: '#111' }}>
      <div style={{ transform: `translateY(${y1}px)`, position: 'absolute', top: '0px', width: '1080px', height: '955px' }}>
        <img src={images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Split Top" />
      </div>
      <div style={{ transform: `translateY(${y2}px)`, position: 'absolute', top: '965px', width: '1080px', height: '955px' }}>
        <img src={images[1]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Split Bottom" />
      </div>
      {vignette && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
};

// ============================================================
// 🔥 IMAGE WITH EFFECTS COMPONENT (TUMHARA - Superior)
// ============================================================
interface ReelImageProps {
  src: string;
  effectName: string;
  colorGrade?: string;
  transitionName?: string;
  durationInFrames: number;
  vignette?: boolean;
  effectsList?: string[];
}

const ReelImage: React.FC<ReelImageProps> = ({ 
  src, 
  effectName, 
  colorGrade, 
  transitionName = 'none',
  durationInFrames,
  vignette = false,
  effectsList = []
}) => {
  const frame = useCurrentFrame();
  
  const hasGlassBlurBg = effectsList.includes('glassBlurBg');

  const effectFn: EffectFn = EFFECT_STYLES[effectName] || EFFECT_STYLES['none'];
  const effectStyle = effectFn(frame, durationInFrames);
  
  const colorGradeFn: EffectFn = colorGrade && EFFECT_STYLES[colorGrade] 
    ? EFFECT_STYLES[colorGrade] 
    : EFFECT_STYLES['none'];
  const colorGradeStyle = colorGradeFn(frame, durationInFrames);

  const transitionStyle = getTransitionStyle(transitionName, frame);
  
  const combinedStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    position: 'relative',
    zIndex: 2,
    ...effectStyle,
    ...colorGradeStyle,
    ...transitionStyle,
  };
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#0a0a0a' }}>
      {/* 🌟 Glassmorphism / Frosted Background Blur Aura */}
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

      {/* Main Foreground Image */}
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
// 🔥 MAIN COMPOSITION (TUMHARA - Keep as is)
// ============================================================
export const ReelComposition: React.FC<ReelProps> = ({ images, template }) => {
  const { 
    effects = ['none'], 
    slideDuration = 3, 
    width = 1080, 
    height = 1920,
    colorGrades = [], 
    transitions = [], 
    vignette = false, 
    collageType,
    collage = false,
  } = template || {};
  
  const durationInFrames = Math.round(slideDuration * 30);

  if (!images || images.length === 0) {
    return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  }

  // ✅ Special Collage Layout Handlers
  if (collage) {
    if (collageType === 'three' && images.length >= 3) {
      return (
        <AbsoluteFill style={{ backgroundColor: 'black', width, height }}>
          <Sequence from={0} durationInFrames={durationInFrames}>
            <ThreePhotoCollageSlide images={images} vignette={vignette} />
          </Sequence>
        </AbsoluteFill>
      );
    }
    if (collageType === 'grid' && images.length >= 4) {
      return (
        <AbsoluteFill style={{ backgroundColor: 'black', width, height }}>
          <Sequence from={0} durationInFrames={durationInFrames}>
            <GridCollageSlide images={images} vignette={vignette} />
          </Sequence>
        </AbsoluteFill>
      );
    }
    if (collageType === 'horizontal' && images.length >= 2) {
      return (
        <AbsoluteFill style={{ backgroundColor: 'black', width, height }}>
          <Sequence from={0} durationInFrames={durationInFrames}>
            <HorizontalCollageSlide images={images} vignette={vignette} />
          </Sequence>
        </AbsoluteFill>
      );
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', width, height }}>
      {images.map((img: string, index: number) => {
        const startFrame = index * durationInFrames;
        const effectName = effects[index % effects.length] || 'none';
        const colorGrade = colorGrades.length > 0 ? colorGrades[index % colorGrades.length] : undefined;
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
              colorGrade={colorGrade}
              transitionName={transitionName}
              durationInFrames={durationInFrames}
              vignette={vignette}
              effectsList={effects}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};