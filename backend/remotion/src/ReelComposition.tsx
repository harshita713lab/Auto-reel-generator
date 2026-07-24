import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, Img } from 'remotion';
import type { ReelProps } from './types';

// ============================================================
// 🔥 ALL EFFECTS - VN/CapCut Style
// ============================================================
type EffectFn = (frame: number, duration: number) => React.CSSProperties;

const EFFECT_STYLES: Record<string, EffectFn> = {
  // 🌟 ZOOM EFFECTS
  'zoom-in': (frame, duration) => ({
    transform: `scale(${interpolate(frame, [0, duration], [1.0, 1.25], { extrapolateRight: 'clamp' })})`,
  }),
  'zoom-out': (frame, duration) => ({
    transform: `scale(${interpolate(frame, [0, duration], [1.25, 1.0], { extrapolateRight: 'clamp' })})`,
  }),
  'zoomin': (frame, duration) => ({
    transform: `scale(${interpolate(frame, [0, duration], [1.0, 1.25], { extrapolateRight: 'clamp' })})`,
  }),
  'zoomout': (frame, duration) => ({
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

  // 🌟 SLIDE EFFECTS
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
  'smoothleft': (frame, duration) => ({
    transform: `translateX(${interpolate(frame, [0, Math.min(15, duration)], [-100, 0], { extrapolateRight: 'clamp' })}%)`,
  }),
  'smoothright': (frame, duration) => ({
    transform: `translateX(${interpolate(frame, [0, Math.min(15, duration)], [100, 0], { extrapolateRight: 'clamp' })}%)`,
  }),
  'slideleft': (frame, duration) => ({
    transform: `translateX(${interpolate(frame, [0, Math.min(15, duration)], [-100, 0], { extrapolateRight: 'clamp' })}%)`,
  }),
  'slideright': (frame, duration) => ({
    transform: `translateX(${interpolate(frame, [0, Math.min(15, duration)], [100, 0], { extrapolateRight: 'clamp' })}%)`,
  }),
  'slide': (frame, duration) => ({
    transform: `translateX(${interpolate(frame, [0, duration], [-100, 0], { extrapolateRight: 'clamp' })}%)`,
  }),

  // 🌟 3D EFFECTS
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

  // 🌟 COLOR & FILTERS
  'vintage': () => ({ filter: 'sepia(0.6) contrast(1.1) brightness(1.05) saturate(0.8)' }),
  'sepia': () => ({ filter: 'sepia(0.8) contrast(1.05)' }),
  'bw': () => ({ filter: 'saturate(0)' }),
  'warm': () => ({ filter: 'sepia(0.3) brightness(1.1) saturate(1.2)' }),
  'cinematic': () => ({ filter: 'contrast(1.15) brightness(0.95) saturate(1.1)' }),
  'dreamy': () => ({ filter: 'brightness(1.05) contrast(0.95) blur(0.5px) saturate(0.8)' }),
  'vibrant': () => ({ filter: 'saturate(1.5) contrast(1.1) brightness(1.02)' }),
  'dramatic': () => ({ filter: 'contrast(1.3) brightness(0.95) saturate(1.1)' }),
  'golden': () => ({ filter: 'sepia(0.4) saturate(1.3) brightness(1.05) hue-rotate(-5deg)' }),
  'cool': () => ({ filter: 'saturate(0.8) hue-rotate(10deg) brightness(0.95)' }),
  'neon': () => ({ filter: 'saturate(1.6) contrast(1.2) brightness(1.05) hue-rotate(-20deg)' }),
  'neonglow': () => ({ filter: 'saturate(1.6) contrast(1.2) brightness(1.05) hue-rotate(-20deg)' }),
  'hdr': () => ({ filter: 'contrast(1.2) brightness(1.1) saturate(1.3)' }),
  'film-grain': (frame) => ({
    filter: `contrast(1.1) brightness(0.98) saturate(0.9)`,
    opacity: 0.95 + 0.05 * Math.sin(frame * 0.5),
  }),
  'pastel': () => ({ filter: 'saturate(0.7) brightness(1.1) contrast(0.9)' }),
  'rose': () => ({ filter: 'hue-rotate(-10deg) saturate(1.1) brightness(1.05)' }),
  'softfocus': () => ({ filter: 'blur(0.3px) brightness(1.02) saturate(0.9)' }),
  'pulse': (frame) => ({
    transform: `scale(${1 + 0.03 * Math.sin(frame * 0.2)})`,
  }),
  'glitch': (frame) => ({
    filter: frame % 15 < 3 ? 'hue-rotate(180deg) brightness(1.5) saturate(2)' : 'none',
    transform: frame % 15 < 3 ? `translate(${Math.random() * 8 - 4}px, ${Math.random() * 8 - 4}px)` : 'none',
  }),
  'flash': (frame) => ({
    filter: frame % 20 < 2 ? 'brightness(2) saturate(0)' : 'none',
  }),
  'pixelize': (frame) => ({
    filter: frame % 25 < 3 ? 'scale(0.5)' : 'none',
    transform: frame % 25 < 3 ? 'scale(2)' : 'scale(1)',
  }),
  'none': () => ({}),
};

// ============================================================
// 🔥 REEL IMAGE COMPONENT
// ============================================================
interface ReelImageProps {
  src: string;
  effectName: string;
  durationInFrames: number;
  vignette?: boolean;
}

const ReelImage: React.FC<ReelImageProps> = ({ src, effectName, durationInFrames, vignette }) => {
  const frame = useCurrentFrame();
  const key = (effectName || 'zoom-in').toLowerCase().trim();
  const effectFn: EffectFn = EFFECT_STYLES[key] || EFFECT_STYLES['zoom-in'];
  const style = effectFn(frame, durationInFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {/* 🌌 BACKGROUND: BLURRED */}
      <AbsoluteFill style={{ filter: 'blur(20px) brightness(0.5)', transform: 'scale(1.2)' }}>
        <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* 📸 FOREGROUND: CLEAR IMAGE WITH EFFECTS */}
      <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', height: '100%', ...style }}>
          <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      </AbsoluteFill>

      {/* 🎭 VIGNETTE */}
      {vignette && (
        <AbsoluteFill
          style={{
            background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.85) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ============================================================
// 🔥 MAIN COMPOSITION
// ============================================================
export const ReelComposition: React.FC<ReelProps> = ({ images, template }) => {
  const { effects = [], slideDuration = 3, width = 1080, height = 1920, vignette = false } = template || {};
  const durationInFrames = Math.max(1, Math.round(slideDuration * 30));

  if (!images || images.length === 0) {
    return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', width, height }}>
      {images.map((img: string, index: number) => {
        const startFrame = index * durationInFrames;
        const effectName = effects[index % (effects.length || 1)] || 'zoom-in';

        return (
          <Sequence key={index} from={startFrame} durationInFrames={durationInFrames}>
            <ReelImage
              src={img}
              effectName={effectName}
              durationInFrames={durationInFrames}
              vignette={vignette}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};