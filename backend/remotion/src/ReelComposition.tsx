import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import type { ReelProps } from './types';

// ============================================================
// 🔥 EFFECT TYPES
// ============================================================
type EffectFn = (frame: number, durationInFrames: number) => React.CSSProperties;

// ============================================================
// 🎬 ALL ANIMATION EFFECTS
// ============================================================
const EFFECT_STYLES: Record<string, EffectFn> = {
  // ============================================================
  // 🔥 ZOOM EFFECTS
  // ============================================================
  'zoom-in': (frame, duration) => {
    const scale = interpolate(frame, [0, duration * 0.1, duration * 0.9, duration], [0.8, 1.15, 1.15, 1.0]);
    return { transform: `scale(${scale})` };
  },
  'zoom-out': (frame, duration) => {
    const scale = interpolate(frame, [0, duration * 0.1, duration * 0.9, duration], [1.2, 0.85, 0.85, 1.0]);
    return { transform: `scale(${scale})` };
  },
  'zoom-slow': (frame, duration) => {
    const scale = interpolate(frame, [0, duration], [1.0, 1.2]);
    return { transform: `scale(${scale})` };
  },
  'zoom-fast': (frame, duration) => {
    const scale = interpolate(frame, [0, duration * 0.3, duration], [1.0, 1.3, 1.0]);
    return { transform: `scale(${scale})` };
  },
  'zoom-pulse': (frame, duration) => {
    const scale = 1 + 0.08 * Math.sin((frame / duration) * Math.PI * 4);
    return { transform: `scale(${scale})` };
  },

  // ============================================================
  // 🔥 SLIDE EFFECTS
  // ============================================================
  'slide-left': (frame, duration) => {
    const x = interpolate(frame, [0, duration], [-100, 0]);
    return { transform: `translateX(${x}%)` };
  },
  'slide-right': (frame, duration) => {
    const x = interpolate(frame, [0, duration], [100, 0]);
    return { transform: `translateX(${x}%)` };
  },
  'slide-up': (frame, duration) => {
    const y = interpolate(frame, [0, duration], [100, 0]);
    return { transform: `translateY(${y}%)` };
  },
  'slide-down': (frame, duration) => {
    const y = interpolate(frame, [0, duration], [-100, 0]);
    return { transform: `translateY(${y}%)` };
  },

  // ============================================================
  // 🔥 ROTATE EFFECTS
  // ============================================================
  'rotate-in': (frame, duration) => {
    const rotate = interpolate(frame, [0, duration], [-30, 0]);
    const scale = interpolate(frame, [0, duration * 0.3, duration], [0.5, 1.1, 1.0]);
    return { transform: `rotate(${rotate}deg) scale(${scale})` };
  },
  'rotate-out': (frame, duration) => {
    const rotate = interpolate(frame, [0, duration], [0, 30]);
    const scale = interpolate(frame, [0, duration * 0.7, duration], [1.0, 1.1, 0.8]);
    return { transform: `rotate(${rotate}deg) scale(${scale})` };
  },
  'spin': (frame, duration) => {
    const rotate = interpolate(frame, [0, duration], [0, 360]);
    return { transform: `rotate(${rotate}deg)` };
  },
  'swing': (frame, duration) => {
    const rotate = 10 * Math.sin((frame / duration) * Math.PI * 3);
    return { transform: `rotate(${rotate}deg)` };
  },

  // ============================================================
  // 🔥 BOUNCE EFFECTS
  // ============================================================
  'bounce-in': (frame, duration) => {
    const scale = spring({ frame, fps: 30, durationInFrames: duration, config: { damping: 10 } });
    return { transform: `scale(${scale})` };
  },
  'bounce-up': (frame, duration) => {
    const y = spring({ frame, fps: 30, durationInFrames: duration, config: { damping: 8 } });
    return { transform: `translateY(${(1 - y) * 50}%)` };
  },

  // ============================================================
  // 🔥 COLOR EFFECTS
  // ============================================================
  'vintage': () => ({ filter: 'sepia(0.6) contrast(1.1) brightness(1.05) saturate(0.8)' }),
  'warm': () => ({ filter: 'sepia(0.3) brightness(1.1) saturate(1.2)' }),
  'cinematic': () => ({ filter: 'contrast(1.1) brightness(0.95) saturate(0.9)' }),
  'dreamy': () => ({ filter: 'brightness(1.05) contrast(0.95) blur(0.5px) saturate(0.8)' }),
  'soft-focus': () => ({ filter: 'blur(1px) contrast(0.9) brightness(1.02)' }),
  'vibrant': () => ({ filter: 'saturate(1.5) contrast(1.1) brightness(1.02)' }),
  'dramatic': () => ({ filter: 'contrast(1.3) brightness(0.95) saturate(1.1)' }),
  'pastel': () => ({ filter: 'brightness(1.05) saturate(0.85) contrast(0.9)' }),
  'sepia': () => ({ filter: 'sepia(0.8) saturate(0.5) brightness(0.95)' }),
  'bw': () => ({ filter: 'grayscale(1) contrast(1.1) brightness(0.98)' }),
  'golden': () => ({ filter: 'sepia(0.4) saturate(1.3) brightness(1.05) hue-rotate(-5deg)' }),
  'cool': () => ({ filter: 'saturate(0.8) hue-rotate(10deg) brightness(0.95)' }),
  'neon': () => ({ filter: 'saturate(1.6) contrast(1.2) brightness(1.05) hue-rotate(-20deg)' }),
  'rose': () => ({ filter: 'sepia(0.2) saturate(1.2) brightness(1.02) hue-rotate(-10deg)' }),

  // ============================================================
  // 🔥 FILTER EFFECTS
  // ============================================================
  'glitch': (frame) => ({
    filter: frame % 30 < 3 ? 'hue-rotate(180deg) brightness(1.5) saturate(2)' : 'none',
    transform: frame % 30 < 3 ? `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)` : 'none'
  }),
  'blur': () => ({ filter: 'blur(2px)' }),
  'pixelate': (frame) => {
    const size = interpolate(frame % 60, [0, 30, 60], [20, 2, 20]);
    return { imageRendering: 'pixelated', filter: `pixelate(${size}px)` };
  },
  'noise': (frame) => ({
    filter: `contrast(1.2) brightness(${1 + 0.05 * Math.sin(frame * 0.3)})`
  }),

  // ============================================================
  // 🔥 COMPLEX EFFECTS
  // ============================================================
  'ken-burns': (frame, duration) => {
    const scale = interpolate(frame, [0, duration], [1.0, 1.25]);
    const x = interpolate(frame, [0, duration], [0, -5]);
    const y = interpolate(frame, [0, duration], [0, -5]);
    return { transform: `scale(${scale}) translate(${x}%, ${y}%)` };
  },
  'parallax': (frame, duration) => {
    const x = interpolate(frame, [0, duration], [0, 15]);
    const y = interpolate(frame, [0, duration], [0, 10]);
    return { transform: `translate(${x}%, ${y}%) scale(1.08)` };
  },
  'reveal': (frame, duration) => {
    const clip = interpolate(frame, [0, duration * 0.7, duration], [0, 100, 100]);
    return { clipPath: `inset(0 ${100 - clip}% 0 0)` };
  },
  'fade-in': (frame, duration) => {
    const opacity = interpolate(frame, [0, duration * 0.2], [0, 1]);
    return { opacity };
  },
  'fade-out': (frame, duration) => {
    const opacity = interpolate(frame, [0, duration * 0.8, duration], [1, 1, 0]);
    return { opacity };
  },

  // ============================================================
  // 🔥 DEFAULT
  // ============================================================
  'none': () => ({}),
};

// ============================================================
// 🔥 REEL IMAGE COMPONENT
// ============================================================
interface ReelImageProps {
  src: string;
  effectName: string;
  durationInFrames: number;
}

const ReelImage: React.FC<ReelImageProps> = ({ src, effectName, durationInFrames }) => {
  const frame = useCurrentFrame();
  const effectFn: EffectFn = EFFECT_STYLES[effectName] || EFFECT_STYLES['none'];
  const style = effectFn(frame, durationInFrames);
  
  return (
    <img
      src={src}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'all 0.1s ease',
        ...style,
      }}
      alt="Reel slide"
    />
  );
};

// ============================================================
// 🔥 MAIN COMPOSITION
// ============================================================
export const ReelComposition: React.FC<ReelProps> = ({ images, template }) => {
  const { effects, slideDuration, width, height } = template;
  const durationInFrames = Math.round(slideDuration * 30);

  if (!images || images.length === 0) {
    return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', width, height }}>
      {images.map((img: string, index: number) => {
        const startFrame = index * durationInFrames;
        const effectName = effects[index % effects.length] || 'none';
        
        return (
          <Sequence 
            key={index} 
            from={startFrame} 
            durationInFrames={durationInFrames}
          >
            <ReelImage 
              src={img} 
              effectName={effectName}
              durationInFrames={durationInFrames}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};