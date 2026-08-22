import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { MusicPlayer } from "../../components";

// ======================================================
// TYPES
// ======================================================

export type Template46Image = {
  path: string;
  url?: string;
};

export type Template46Props = {
  images?: Template46Image[];
  music?: Music;
};

interface Music {
  path: string;
  volume?: number;
}

// ======================================================
// CONFIGURATION & CONSTANTS (EXACTLY 18.0 SECONDS = 540 FRAMES)
// ======================================================

export const FPS = 30;
export const TOTAL_SCENES = 19;
export const DURATION_IN_FRAMES = 540; // 540 frames @ 30 FPS = EXACTLY 18.0 SECONDS
export const IMAGE_COUNT = 19;

// Exact frame timing per scene to sum up to 540 frames (18.0s)
const getSceneStartFrame = (index: number): number => Math.round((index * DURATION_IN_FRAMES) / TOTAL_SCENES);
const getSceneDuration = (index: number): number =>
  Math.round(((index + 1) * DURATION_IN_FRAMES) / TOTAL_SCENES) - getSceneStartFrame(index);

const DEFAULT_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509924603848-aca550f96323?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
];

export const DEFAULT_PROPS: Template46Props = {
  images: DEFAULT_IMAGE_URLS.map((url) => ({ path: url, url })),
  music: undefined,
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ======================================================
// 🐢 SLOW MOTION VELOCITY HELPER
// ======================================================
const getVelocityProgress = (localFrame: number, duration: number): number => {
  const norm = Math.max(0, Math.min(1, localFrame / duration));
  if (norm < 0.2) {
    return interpolate(norm, [0, 0.2], [0, 0.45], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  } else if (norm < 0.8) {
    return interpolate(norm, [0.2, 0.8], [0.45, 0.85], clamp);
  } else {
    return interpolate(norm, [0.8, 1], [0.85, 1], { ...clamp, easing: Easing.bezier(0.7, 0, 0.84, 0) });
  }
};

// ======================================================
// 🖼️ FULL-BLEED PHOTO COMPONENT WITH CONTINUOUS MOTION
// ======================================================
const FullBleedPhoto = ({
  src,
  frame,
  sceneDuration = 28,
  zoomDirection = "in",
  style,
}: {
  src?: string;
  frame: number;
  sceneDuration?: number;
  zoomDirection?: "in" | "out";
  style?: React.CSSProperties;
}) => {
  if (!src) {
    return <AbsoluteFill style={{ background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)" }} />;
  }

  const zoomScale =
    zoomDirection === "in"
      ? interpolate(frame, [0, sceneDuration], [1.0, 1.15], { ...clamp, easing: Easing.out(Easing.quad) })
      : interpolate(frame, [0, sceneDuration], [1.15, 1.02], { ...clamp, easing: Easing.out(Easing.quad) });

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000", ...style }}>
      <Img
        src={src}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(25px) brightness(0.35)",
          transform: "scale(1.25)",
        }}
      />
      <Img
        src={src}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          transform: `scale(${zoomScale})`,
          transformOrigin: "center center",
          zIndex: 2,
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// ✨ GLITTER & GOLDEN SPARKLES OVERLAY
// ======================================================
const GlitterSparklesOverlay = ({ frame }: { frame: number }) => {
  const sparkles = [
    { id: 1, x: 15, y: 20, size: 14, speed: -0.15 },
    { id: 2, x: 80, y: 40, size: 20, speed: -0.25 },
    { id: 3, x: 35, y: 75, size: 12, speed: -0.18 },
    { id: 4, x: 90, y: 15, size: 18, speed: -0.3 },
    { id: 5, x: 25, y: 60, size: 22, speed: -0.22 },
    { id: 6, x: 70, y: 85, size: 16, speed: -0.35 },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 20, overflow: "hidden" }}>
      {sparkles.map((s) => {
        const currentY = ((s.y + frame * s.speed) % 100 + 100) % 100;
        const opacity = interpolate((frame + s.id * 15) % 40, [0, 20, 40], [0.2, 0.95, 0.2], clamp);
        const scale = interpolate((frame + s.id * 10) % 30, [0, 15, 30], [0.8, 1.25, 0.8], clamp);

        return (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${currentY}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 235, 170, 0.95)",
              boxShadow: "0 0 16px rgba(255, 215, 0, 1), 0 0 30px rgba(255, 255, 255, 0.8)",
              opacity,
              transform: `scale(${scale})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ======================================================
// 💖 FLOATING 3D HEARTS OVERLAY
// ======================================================
const FloatingHeartsOverlay = ({ frame }: { frame: number }) => {
  const hearts = [
    { id: 1, left: 12, startY: 105, speed: 1.0, icon: "💖", scale: 1.2 },
    { id: 2, left: 32, startY: 115, speed: 1.3, icon: "💕", scale: 0.9 },
    { id: 3, left: 55, startY: 110, speed: 1.1, icon: "❤️", scale: 1.4 },
    { id: 4, left: 78, startY: 120, speed: 1.4, icon: "💖", scale: 1.1 },
    { id: 5, left: 88, startY: 108, speed: 1.2, icon: "✨", scale: 1.0 },
    { id: 6, left: 24, startY: 125, speed: 1.3, icon: "💕", scale: 1.3 },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 22, overflow: "hidden" }}>
      {hearts.map((h) => {
        const topPercent = h.startY - ((frame * h.speed + h.id * 30) % 130);
        const swayX = Math.sin((frame + h.id * 10) * 0.06) * 22;
        const opacity = interpolate(topPercent, [0, 20, 85, 105], [0, 0.95, 0.95, 0], clamp);
        const pulse = interpolate((frame + h.id * 8) % 30, [0, 15, 30], [0.85, 1.15, 0.85], clamp);

        return (
          <div
            key={h.id}
            style={{
              position: "absolute",
              left: `calc(${h.left}% + ${swayX}px)`,
              top: `${topPercent}%`,
              fontSize: `${Math.round(36 * h.scale)}px`,
              opacity,
              transform: `scale(${pulse})`,
              filter: "drop-shadow(0 0 12px rgba(255, 50, 100, 0.9))",
            }}
          >
            {h.icon}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ======================================================
// 📜 NEW EXACT KESARIYA LYRICS (UPDATED BY USER)
// POSITIONED AT THE BOTTOM, NO BACKGROUND BOX, WORD-BY-WORD POP ANIMATION
// ======================================================
const NEW_KESARIYA_LYRICS = [
  "MUJHKO ITNA BATAYE KOI ❤️",
  "KAISE TUJHSE DIL NA LAGAYE KOI ✨",
  "RABBA NE TUJHKO BANANE MEIN 🌹",
  "KARDI HAI HUSN KI KHAALI TIJORIYAN 💫",
  "KAJAL KI SIYAHI SE LIKHI ✒️",
  "HAI TUNE JAANE 💖",
  "KITNO KI LOVE STORIYAN 📖✨",
  "KESARIYA TERA ISHQ HAI PIYA ❤️",
  "RANG JAAUN JO MAIN HATH LAGAUN ✨",
  "MUJHKO ITNA BATAYE KOI ❤️",
  "KAISE TUJHSE DIL NA LAGAYE KOI ✨",
  "RABBA NE TUJHKO BANANE MEIN 🌹",
  "KARDI HAI HUSN KI KHAALI TIJORIYAN 💫",
  "KAJAL KI SIYAHI SE LIKHI ✒️",
  "HAI TUNE JAANE 💖",
  "KITNO KI LOVE STORIYAN 📖✨",
  "KESARIYA TERA ISHQ HAI PIYA ❤️",
  "RANG JAAUN JO MAIN HATH LAGAUN ✨",
  "KESARIYA TERA ISHQ HAI PIYA... ✨❤️",
];

const WordByWordPopLyrics = ({
  scene,
  frame,
  sceneDuration,
}: {
  scene: number;
  frame: number;
  sceneDuration: number;
}) => {
  const lyricLine = NEW_KESARIYA_LYRICS[(scene - 1) % NEW_KESARIYA_LYRICS.length];
  const words = lyricLine.split(" ");

  const lineExitDuration = 5;
  const lineOpacity = interpolate(
    frame,
    [sceneDuration - lineExitDuration, sceneDuration],
    [1, 0],
    clamp
  );

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 28,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: 70, // Clean bottom position near video edge
      }}
    >
      <div
        style={{
          opacity: lineOpacity,
          maxWidth: "92%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px 14px",
          textAlign: "center",
        }}
      >
        {words.map((word, wIdx) => {
          const wordStartFrame = (wIdx / words.length) * (sceneDuration * 0.72);
          const wordAge = frame - wordStartFrame;

          if (wordAge < 0) {
            return (
              <span
                key={wIdx}
                style={{
                  opacity: 0,
                  transform: "scale(0)",
                  display: "inline-block",
                }}
              >
                {word}
              </span>
            );
          }

          // Word Pop Animation (0.2 -> 1.45 -> 1.0)
          const scale = interpolate(wordAge, [0, 4, 8], [0.2, 1.45, 1.0], {
            ...clamp,
            easing: Easing.out(Easing.back(2.2)),
          });

          const opacity = interpolate(wordAge, [0, 3], [0, 1], clamp);
          const isActive = wordAge >= 0 && wordAge <= 8;

          return (
            <span
              key={wIdx}
              style={{
                display: "inline-block",
                opacity,
                transform: `scale(${scale})`,
                fontFamily: "'Montserrat', 'Poppins', 'Segoe UI', system-ui, sans-serif",
                fontSize: 52,
                fontWeight: 900,
                letterSpacing: 1.5,
                color: isActive ? "#FFE600" : "#FFFFFF",
                textShadow: isActive
                  ? "0 0 25px rgba(255, 230, 0, 1), 0 0 45px rgba(255, 140, 0, 0.9), 0 6px 20px rgba(0, 0, 0, 1)"
                  : "0 0 20px rgba(255, 215, 0, 0.7), 0 6px 25px rgba(0, 0, 0, 1), 0 2px 4px rgba(0, 0, 0, 1)",
                lineHeight: 1.2,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// 🛡️ SCENE WRAPPER WITH CONTINUOUS MOTION
// ======================================================
const SceneWrapper: React.FC<{
  src: string;
  frame: number;
  sceneDuration: number;
  zoomDirection: "in" | "out";
  children: React.ReactNode;
}> = ({ src, frame, sceneDuration, zoomDirection, children }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ zIndex: 1 }}>
        <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection={zoomDirection} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 2 }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const getImgSrc = (images: Template46Image[] | undefined, index: number): string => {
  if (!images || images.length === 0) return DEFAULT_IMAGE_URLS[0];
  const safeIdx = Math.abs(index) % images.length;
  const img = images[safeIdx];
  return img?.url || img?.path || DEFAULT_IMAGE_URLS[safeIdx % DEFAULT_IMAGE_URLS.length];
};

const FlashOverlay = ({ frame }: { frame: number }) => {
  const opacity = interpolate(frame, [0, 4, 10], [0.65, 0.15, 0], clamp);
  return <AbsoluteFill style={{ background: "#FFFFFF", opacity, pointerEvents: "none", zIndex: 30 }} />;
};

// ======================================================
// 1. DROSTE EFFECT SCENE
// ======================================================
const DrosteEffectScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const scale = interpolate(vProgress, [0, 1], [0.8, 3.2], clamp);
  const overlayOpacity = interpolate(frame, [sceneDuration * 0.35, sceneDuration], [1, 0], clamp);

  return (
    <SceneWrapper src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in">
      {overlayOpacity > 0 && (
        <AbsoluteFill style={{ opacity: overlayOpacity }}>
          {[1, 0.5, 0.25].map((layerScale, i) => {
            const currentScale = scale * layerScale;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${currentScale})`,
                }}
              >
                <div
                  style={{
                    width: "92%",
                    height: "92%",
                    borderRadius: 24,
                    overflow: "hidden",
                    border: `${4 / Math.sqrt(currentScale || 1)}px solid rgba(255,215,0,0.85)`,
                  }}
                >
                  <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}
    </SceneWrapper>
  );
};

// ======================================================
// 2. POLYGON COLLAPSE SCENE
// ======================================================
const PolygonCollapseScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const radius = interpolate(vProgress, [0, 0.45], [0, 180], clamp);
  const isTransiting = frame / sceneDuration < 0.4;
  const octClip = isTransiting
    ? `polygon(
    ${50 - radius * 0.4}% ${50 - radius}% , 
    ${50 + radius * 0.4}% ${50 - radius}% , 
    ${50 + radius}% ${50 - radius * 0.4}% , 
    ${50 + radius}% ${50 + radius * 0.4}% , 
    ${50 + radius * 0.4}% ${50 + radius}% , 
    ${50 - radius * 0.4}% ${50 + radius}% , 
    ${50 - radius}% ${50 + radius * 0.4}% , 
    ${50 - radius}% ${50 - radius * 0.4}%
  )`
    : undefined;

  return (
    <SceneWrapper src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="out">
      <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" style={{ clipPath: octClip }} />
    </SceneWrapper>
  );
};

// ======================================================
// 3. 🖼️ DUAL 3D GLASS COLLAGE SCENE
// ======================================================
const DualGlassCollageScene: React.FC<{ img1: string; img2: string; frame: number; sceneDuration: number }> = ({ img1, img2, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const rotY1 = interpolate(vProgress, [0, 0.5], [-20, -6], clamp);
  const rotY2 = interpolate(vProgress, [0, 0.5], [20, 6], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080D", perspective: "1400px", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "6%",
          width: "48%",
          height: "64%",
          borderRadius: 22,
          overflow: "hidden",
          border: "3px solid rgba(255,255,255,0.85)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
          transform: `rotateY(${rotY1}deg) rotateZ(-3deg)`,
        }}
      >
        <FullBleedPhoto src={img1} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
      </div>
      <div
        style={{
          position: "absolute",
          top: "22%",
          right: "6%",
          width: "48%",
          height: "64%",
          borderRadius: 22,
          overflow: "hidden",
          border: "3px solid rgba(255,215,0,0.9)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
          transform: `rotateY(${rotY2}deg) rotateZ(3deg)`,
          zIndex: 3,
        }}
      >
        <FullBleedPhoto src={img2} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" />
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// 4. 🔄 ROUND 360 PORTAL SPIN REVEAL SCENE
// ======================================================
const RoundPortalSpinScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const rotZ = interpolate(vProgress, [0, 0.45], [-360, 0], clamp);
  const scale = interpolate(vProgress, [0, 0.45], [0.1, 1], clamp);

  return (
    <SceneWrapper src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in">
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `rotate(${rotZ}deg) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
      </div>
    </SceneWrapper>
  );
};

// ======================================================
// 5. PRISM FOLD SCENE
// ======================================================
const PrismFoldScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const foldAngle = interpolate(vProgress, [0, 0.4], [90, 0], clamp);
  const isTransiting = frame / sceneDuration < 0.4;

  return (
    <SceneWrapper src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in">
      {isTransiting && (
        <AbsoluteFill style={{ perspective: "1200px", display: "flex", flexDirection: "row" }}>
          <div style={{ flex: 1, height: "100%", overflow: "hidden", transformOrigin: "left center", transform: `rotateY(${-foldAngle}deg)` }}>
            <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
          </div>
          <div style={{ flex: 1, height: "100%", overflow: "hidden" }}>
            <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
          </div>
          <div style={{ flex: 1, height: "100%", overflow: "hidden", transformOrigin: "right center", transform: `rotateY(${foldAngle}deg)` }}>
            <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
          </div>
        </AbsoluteFill>
      )}
    </SceneWrapper>
  );
};

// ======================================================
// 6. GEOMETRIC BLOOM SCENE
// ======================================================
const GeometricBloomScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const bloomRadius = interpolate(vProgress, [0, 0.4], [0, 200], clamp);
  const isTransiting = frame / sceneDuration < 0.4;

  return (
    <SceneWrapper src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="out">
      {isTransiting && (
        <AbsoluteFill>
          <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" style={{ clipPath: `circle(${bloomRadius}% at 50% 50%)` }} />
        </AbsoluteFill>
      )}
    </SceneWrapper>
  );
};

// ======================================================
// 7. 🎞️ 3-PHOTO FILMSTRIP REEL COLLAGE SCENE
// ======================================================
const FilmstripCollageScene: React.FC<{ img1: string; img2: string; img3: string; frame: number; sceneDuration: number }> = ({ img1, img2, img3, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const trackX = interpolate(vProgress, [0, 1], [300, -250], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070B", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: "18%",
          height: "60%",
          display: "flex",
          flexDirection: "row",
          gap: 20,
          transform: `translateX(${trackX}px) rotate(-3deg)`,
          padding: "15px 30px",
          backgroundColor: "rgba(15, 18, 25, 0.95)",
          borderTop: "5px dashed rgba(255,215,0,0.8)",
          borderBottom: "5px dashed rgba(255,215,0,0.8)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
        }}
      >
        {[img1, img2, img3, img1].map((imgSrc, i) => (
          <div
            key={i}
            style={{
              width: 310,
              height: "100%",
              borderRadius: 16,
              overflow: "hidden",
              border: "3px solid #FFF",
              flexShrink: 0,
            }}
          >
            <FullBleedPhoto src={imgSrc} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// 8. CRYSTAL SHATTER SCENE
// ======================================================
const CrystalShatterScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const shardSpread = interpolate(vProgress, [0, 0.45], [120, 0], clamp);
  const isTransiting = frame / sceneDuration < 0.4;

  const shards = [
    { clip: "polygon(0 0, 50% 0, 25% 50%)", dirX: -1, dirY: -1 },
    { clip: "polygon(50% 0, 100% 0, 75% 50%)", dirX: 1, dirY: -1 },
    { clip: "polygon(25% 50%, 75% 50%, 50% 100%)", dirX: 0, dirY: 1 },
    { clip: "polygon(0 0, 25% 50%, 0 100%)", dirX: -1, dirY: 0 },
    { clip: "polygon(100% 0, 100% 100%, 75% 50%)", dirX: 1, dirY: 0 },
  ];

  return (
    <SceneWrapper src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in">
      {isTransiting && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          {shards.map((s, idx) => (
            <AbsoluteFill key={idx} style={{ clipPath: s.clip, transform: `translate(${s.dirX * shardSpread * 4}px, ${s.dirY * shardSpread * 4}px)` }}>
              <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
            </AbsoluteFill>
          ))}
        </AbsoluteFill>
      )}
    </SceneWrapper>
  );
};

// ======================================================
// 9. 🔄 ROUND HEXAGON PULSE SPIN SCENE
// ======================================================
const RoundHexagonSpinScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const rotZ = interpolate(vProgress, [0, 0.45], [180, 0], clamp);
  const hexScale = interpolate(vProgress, [0, 0.45], [0, 200], clamp);

  return (
    <SceneWrapper src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="out">
      <div style={{ transform: `rotate(${rotZ}deg)`, transformOrigin: "center center", width: "100%", height: "100%" }}>
        <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" style={{ clipPath: `circle(${hexScale}% at 50% 50%)` }} />
      </div>
    </SceneWrapper>
  );
};

// ======================================================
// 10. KITE WIPE SCENE
// ======================================================
const KiteWipeScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const kiteScale = interpolate(vProgress, [0, 0.4], [0, 220], clamp);
  const isTransiting = frame / sceneDuration < 0.4;
  const kiteClip = isTransiting
    ? `polygon(50% ${50 - kiteScale}%, ${50 + kiteScale}% 50%, 50% ${50 + kiteScale}%, ${50 - kiteScale}% 50%)`
    : undefined;

  return (
    <SceneWrapper src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="out">
      <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" style={{ clipPath: kiteClip }} />
    </SceneWrapper>
  );
};

// ======================================================
// 11. ARROW SPLIT SCENE
// ======================================================
const ArrowSplitScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const splitY = interpolate(vProgress, [0, 0.4], [450, 0], clamp);
  const isTransiting = frame / sceneDuration < 0.4;

  return (
    <SceneWrapper src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in">
      {isTransiting && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <AbsoluteFill style={{ transform: `translateY(${-splitY}px)` }}>
            <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
          </AbsoluteFill>
          <AbsoluteFill style={{ transform: `translateY(${splitY}px)` }}>
            <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </SceneWrapper>
  );
};

// ======================================================
// 12. 📐 DIAGONAL SPLIT GLASS COLLAGE SCENE
// ======================================================
const DiagonalGlassCollageScene: React.FC<{ img1: string; img2: string; frame: number; sceneDuration: number }> = ({ img1, img2, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const topY = interpolate(vProgress, [0, 0.45], [-350, 0], clamp);
  const bottomY = interpolate(vProgress, [0, 0.45], [350, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080D" }}>
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "8%",
          width: "84%",
          height: "40%",
          borderRadius: 20,
          overflow: "hidden",
          border: "3px solid rgba(255,255,255,0.85)",
          transform: `translateY(${topY}px) rotate(2deg)`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
        }}
      >
        <FullBleedPhoto src={img1} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "8%",
          width: "84%",
          height: "40%",
          borderRadius: 20,
          overflow: "hidden",
          border: "3px solid rgba(255,215,0,0.85)",
          transform: `translateY(${bottomY}px) rotate(-2deg)`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
        }}
      >
        <FullBleedPhoto src={img2} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" />
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// 13. STARBURST MASK SCENE
// ======================================================
const StarburstMaskScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const starScale = interpolate(vProgress, [0, 0.4], [0, 220], clamp);
  const isTransiting = frame / sceneDuration < 0.4;
  const points = 12;
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? starScale : starScale * 0.45;
    const angle = (i * Math.PI) / points;
    pts.push(`${50 + r * Math.cos(angle)}% ${50 + r * Math.sin(angle)}%`);
  }
  const starClip = isTransiting ? `polygon(${pts.join(", ")})` : undefined;

  return (
    <SceneWrapper src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in">
      <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" style={{ clipPath: starClip }} />
    </SceneWrapper>
  );
};

// ======================================================
// 14. PRISM TUNNEL SCENE
// ======================================================
const PrismTunnelScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const z = interpolate(vProgress, [0, 0.4], [-600, 0], clamp);

  return (
    <SceneWrapper src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in">
      <div style={{ width: "100%", height: "100%", transform: `translateZ(${z}px)`, transformStyle: "preserve-3d" }}>
        <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
      </div>
    </SceneWrapper>
  );
};

// ======================================================
// 15. 💖 HEART-SHAPED COLLAGE SCENE ("heart shap me bhi collage bnao")
// ======================================================
const HeartCollageScene: React.FC<{ img1: string; img2: string; frame: number; sceneDuration: number }> = ({
  img1,
  img2,
  frame,
  sceneDuration,
}) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const scale = interpolate(vProgress, [0, 0.45], [0.3, 1.0], clamp);
  const rotZ = interpolate(vProgress, [0, 1], [-4, 4], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080D", perspective: "1200px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Background photo with continuous zoom out */}
      <FullBleedPhoto src={img1} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" />

      {/* Heart-Shaped Center Photo Collage */}
      <div
        style={{
          width: 580,
          height: 580,
          position: "relative",
          transform: `scale(${scale}) rotate(${rotZ}deg)`,
          transformOrigin: "center center",
          zIndex: 10,
          filter: "drop-shadow(0 20px 45px rgba(255, 50, 100, 0.85)) drop-shadow(0 0 25px rgba(255, 215, 0, 0.9))",
        }}
      >
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <clipPath id="heartClipPath" clipPathUnits="objectBoundingBox">
              <path d="M 0.5,0.25 C 0.5,0.25 0.4,0.08 0.25,0.08 C 0.11,0.08 0,0.20 0,0.38 C 0,0.62 0.35,0.84 0.5,0.96 C 0.65,0.84 1,0.62 1,0.38 C 1,0.20 0.89,0.08 0.75,0.08 C 0.60,0.08 0.5,0.25 0.5,0.25 Z" />
            </clipPath>
          </defs>
        </svg>

        <div
          style={{
            width: "100%",
            height: "100%",
            clipPath: "url(#heartClipPath)",
            backgroundColor: "#FFD700",
            padding: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              clipPath: "url(#heartClipPath)",
              overflow: "hidden",
            }}
          >
            <FullBleedPhoto src={img2} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// 16. DIAMOND CASCADE SCENE
// ======================================================
const DiamondCascadeScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const scale = interpolate(vProgress, [0, 0.4], [0.8, 1], clamp);

  return (
    <SceneWrapper src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="out">
      <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" style={{ transform: `scale(${scale})` }} />
    </SceneWrapper>
  );
};

// ======================================================
// 17. ANGULAR BURST SCENE
// ======================================================
const AngularBurstScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const burstProgress = interpolate(vProgress, [0, 0.4], [0, 200], clamp);
  const isTransiting = frame / sceneDuration < 0.4;
  const burstClip = isTransiting
    ? `polygon(
    50% 50%, 
    ${50 + burstProgress}% 0%, 
    100% ${burstProgress}%, 
    ${100 - burstProgress}% 100%, 
    0% ${100 - burstProgress}%, 
    ${burstProgress}% 0%
  )`
    : undefined;

  return (
    <SceneWrapper src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in">
      <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" style={{ clipPath: burstClip }} />
    </SceneWrapper>
  );
};

// ======================================================
// 18. ORIGAMI FOLD SCENE
// ======================================================
const OrigamiFoldScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const flipAngle = interpolate(vProgress, [0, 0.4], [90, 0], clamp);
  const isTransiting = frame / sceneDuration < 0.4;

  return (
    <SceneWrapper src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in">
      {isTransiting && (
        <AbsoluteFill style={{ perspective: "1200px" }}>
          <AbsoluteFill style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)", transformOrigin: "center top", transform: `rotateX(${flipAngle}deg)` }}>
            <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
          </AbsoluteFill>
          <AbsoluteFill style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)", transformOrigin: "center bottom", transform: `rotateX(${-flipAngle}deg)` }}>
            <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </SceneWrapper>
  );
};

// ======================================================
// 19. 🎆 GRAND HERO FINALE COLLAGE SCENE
// ======================================================
const GrandHeroFinaleCollageScene: React.FC<{ img1: string; img2: string; frame: number; sceneDuration: number }> = ({ img1, img2, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const scale = interpolate(vProgress, [0, 1], [1.1, 1.0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#040508", overflow: "hidden" }}>
      <FullBleedPhoto src={img1} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" style={{ transform: `scale(${scale})` }} />
      <div
        style={{
          position: "absolute",
          inset: "4%",
          border: "3px solid rgba(255,215,0,0.9)",
          borderRadius: 28,
          boxShadow: "0 0 40px rgba(255,215,0,0.4)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE ROUTER FOR 19 IMAGES (EXACT 18 SECONDS)
// ======================================================

const FrameScene = ({ scene, sceneDuration, images }: { scene: number; sceneDuration: number; images?: Template46Image[] }) => {
  const frame = useCurrentFrame();
  const img0 = getImgSrc(images, 0);
  const img1 = getImgSrc(images, 1);
  const img2 = getImgSrc(images, 2);
  const img3 = getImgSrc(images, 3);
  const img4 = getImgSrc(images, 4);
  const img5 = getImgSrc(images, 5);
  const img6 = getImgSrc(images, 6);
  const img7 = getImgSrc(images, 7);
  const img8 = getImgSrc(images, 8);
  const img9 = getImgSrc(images, 9);
  const img10 = getImgSrc(images, 10);
  const img11 = getImgSrc(images, 11);
  const img12 = getImgSrc(images, 12);
  const img13 = getImgSrc(images, 13);
  const img14 = getImgSrc(images, 14);
  const img15 = getImgSrc(images, 15);
  const img16 = getImgSrc(images, 16);
  const img17 = getImgSrc(images, 17);
  const img18 = getImgSrc(images, 18);

  switch (scene) {
    case 1:
      return <DrosteEffectScene src={img0} frame={frame} sceneDuration={sceneDuration} />;
    case 2:
      return <PolygonCollapseScene src={img1} frame={frame} sceneDuration={sceneDuration} />;
    case 3:
      return <DualGlassCollageScene img1={img2} img2={img3} frame={frame} sceneDuration={sceneDuration} />;
    case 4:
      return <RoundPortalSpinScene src={img3} frame={frame} sceneDuration={sceneDuration} />;
    case 5:
      return <PrismFoldScene src={img4} frame={frame} sceneDuration={sceneDuration} />;
    case 6:
      return <GeometricBloomScene src={img5} frame={frame} sceneDuration={sceneDuration} />;
    case 7:
      return <FilmstripCollageScene img1={img6} img2={img7} img3={img8} frame={frame} sceneDuration={sceneDuration} />;
    case 8:
      return <CrystalShatterScene src={img8} frame={frame} sceneDuration={sceneDuration} />;
    case 9:
      return <RoundHexagonSpinScene src={img9} frame={frame} sceneDuration={sceneDuration} />;
    case 10:
      return <KiteWipeScene src={img10} frame={frame} sceneDuration={sceneDuration} />;
    case 11:
      return <ArrowSplitScene src={img11} frame={frame} sceneDuration={sceneDuration} />;
    case 12:
      return <DiagonalGlassCollageScene img1={img12} img2={img13} frame={frame} sceneDuration={sceneDuration} />;
    case 13:
      return <StarburstMaskScene src={img13} frame={frame} sceneDuration={sceneDuration} />;
    case 14:
      return <PrismTunnelScene src={img14} frame={frame} sceneDuration={sceneDuration} />;
    case 15:
      return <HeartCollageScene img1={img15} img2={img16} frame={frame} sceneDuration={sceneDuration} />; // 💖 HEART COLLAGE
    case 16:
      return <DiamondCascadeScene src={img16} frame={frame} sceneDuration={sceneDuration} />;
    case 17:
      return <AngularBurstScene src={img17} frame={frame} sceneDuration={sceneDuration} />;
    case 18:
      return <OrigamiFoldScene src={img18} frame={frame} sceneDuration={sceneDuration} />;
    case 19:
      return <GrandHeroFinaleCollageScene img1={img18} img2={img0} frame={frame} sceneDuration={sceneDuration} />;
    default:
      return null;
  }
};

// ======================================================
// 🎬 MAIN TEMPLATE 46 COMPONENT (EXACT 18.0 SECONDS = 540 FRAMES)
// ======================================================

export const Template46: React.FC<Template46Props> = ({ images = [], music }) => {
  const frame = useCurrentFrame();

  // Find active scene index based on frame timing
  let currentSceneIndex = 0;
  for (let i = 0; i < TOTAL_SCENES; i++) {
    const start = getSceneStartFrame(i);
    const duration = getSceneDuration(i);
    if (frame >= start && frame < start + duration) {
      currentSceneIndex = i;
      break;
    }
  }
  if (frame >= 540) {
    currentSceneIndex = TOTAL_SCENES - 1;
  }

  const currentSceneStart = getSceneStartFrame(currentSceneIndex);
  const currentSceneDur = getSceneDuration(currentSceneIndex);
  const localSceneFrame = frame - currentSceneStart;

  const musicSrc = typeof music === "string" ? music : music?.path;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* 1. Global Shimmering Glitter & Sparkles Overlay */}
      <GlitterSparklesOverlay frame={frame} />

      {/* 2. Global Floating 3D Hearts Overlay */}
      <FloatingHeartsOverlay frame={frame} />

      {/* 3. 19 Dynamic Image Scenes (Exact 18.0 Seconds Total) */}
      {Array.from({ length: TOTAL_SCENES }).map((_, idx) => {
        const start = getSceneStartFrame(idx);
        const dur = getSceneDuration(idx);
        return (
          <Sequence key={idx} from={start} durationInFrames={dur}>
            <FrameScene scene={idx + 1} sceneDuration={dur} images={images} />
            <FlashOverlay frame={useCurrentFrame() - start} />
          </Sequence>
        );
      })}

      {/* 4. Pure Floating Word-by-Word Popping Lyrics at Bottom Edge */}
      <WordByWordPopLyrics
        scene={currentSceneIndex + 1}
        frame={localSceneFrame}
        sceneDuration={currentSceneDur}
      />

      {/* Audio Player */}
      {musicSrc && <MusicPlayer src={musicSrc} volume={music?.volume ?? 1} showVisualizer={true} />}
    </AbsoluteFill>
  );
};

export default Template46;