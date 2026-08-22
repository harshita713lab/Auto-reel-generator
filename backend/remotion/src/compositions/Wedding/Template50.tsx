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

export type Template44Image = {
  path: string;
  url?: string;
};

export type Template44Props = {
  images?: Template44Image[];
  music?: Music;
};

interface Music {
  path: string;
  volume?: number;
}

// ======================================================
// CONFIGURATION & CONSTANTS (EXACTLY 15.0 SECONDS = 450 FRAMES)
// EXACTLY 10 IMAGES REQUIRED
// ======================================================

export const FPS = 30;
export const TOTAL_SCENES = 5;
export const DURATION_IN_FRAMES = 450; // 450 frames @ 30 FPS = EXACTLY 15.0 SECONDS
export const IMAGE_COUNT = 10; // EXACTLY 10 IMAGES

const SCENE_BOUNDARIES = [
  { start: 0, duration: 90 },    // Scene 1: Blurred Background + Intro Heart Pulse (00:00 - 00:03)
  { start: 90, duration: 90 },   // Scene 2: 3-Horizontal Split Reel Grid + "CHHOO LIYA TUNE" (00:03 - 00:06)
  { start: 180, duration: 90 },  // Scene 3: Layered Corner Photo Collage + "LAB SE AAKHON KO" (00:06 - 00:09)
  { start: 270, duration: 90 },  // Scene 4: Solo Couple Portrait + "MANNETE PURI" (00:09 - 00:12)
  { start: 360, duration: 90 },  // Scene 5: Close-Up Slow Motion + "TUMSE HEE... ❤️✨" (00:12 - 00:15)
];

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
];

export const DEFAULT_PROPS: Template44Props = {
  images: DEFAULT_IMAGE_URLS.map((url) => ({ path: url, url })),
  music: undefined,
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const getVelocityProgress = (localFrame: number, duration: number): number => {
  const norm = Math.max(0, Math.min(1, localFrame / duration));
  return interpolate(norm, [0, 1], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
};

const getImgSrc = (images: Template44Image[] | undefined, index: number): string => {
  if (!images || images.length === 0) return DEFAULT_IMAGE_URLS[0];
  const safeIdx = Math.abs(index) % images.length;
  const img = images[safeIdx];
  return img?.url || img?.path || DEFAULT_IMAGE_URLS[safeIdx % DEFAULT_IMAGE_URLS.length];
};

// ======================================================
// 🖼️ FULL-BLEED PHOTO COMPONENT
// ======================================================
const FullBleedPhoto = ({
  src,
  frame,
  sceneDuration = 30,
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

const FlashOverlay = ({ frame }: { frame: number }) => {
  const opacity = interpolate(frame, [0, 4, 10], [0.8, 0.2, 0], clamp);
  return <AbsoluteFill style={{ background: "#FFFFFF", opacity, pointerEvents: "none", zIndex: 35 }} />;
};

// ======================================================
// 1. INTRO SCENE: BLURRED BACKGROUND + PULSING HEART EMOJI
// ======================================================
const IntroHeartPulseScene: React.FC<{
  src: string;
  frame: number;
  sceneDuration: number;
}> = ({ src, frame, sceneDuration }) => {
  const pulseScale = interpolate((frame % 25), [0, 12, 25], [0.9, 1.25, 0.9], clamp);
  const glowOpacity = interpolate((frame % 25), [0, 12, 25], [0.4, 0.95, 0.4], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080D", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Blurred Background Photo */}
      <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" />

      {/* Center Pulsing Heart Emoji Badge */}
      <div
        style={{
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          transform: `scale(${pulseScale})`,
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            border: "3px solid rgba(255, 255, 255, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 75,
            boxShadow: `0 0 45px rgba(0, 240, 255, ${glowOpacity}), 0 0 25px rgba(255, 255, 255, 0.9)`,
          }}
        >
          🩵
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// 2. 3-HORIZONTAL SPLIT REEL GRID + LYRICS "CHHOO LIYA TUNE"
// ======================================================
const ThreeSplitReelGridScene: React.FC<{
  img1: string;
  img2: string;
  img3: string;
  frame: number;
  sceneDuration: number;
}> = ({ img1, img2, img3, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const panTop = interpolate(vProgress, [0, 1], [-40, 40], clamp);
  const panMid = interpolate(vProgress, [0, 1], [40, -40], clamp);
  const panBot = interpolate(vProgress, [0, 1], [-40, 40], clamp);

  const textScale = interpolate(frame, [0, 15, sceneDuration - 10, sceneDuration], [0.3, 1.05, 1.0, 0.9], {
    ...clamp,
    easing: Easing.out(Easing.back(1.8)),
  });
  const textOpacity = interpolate(frame, [0, 12, sceneDuration - 8, sceneDuration], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080D", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Top Strip */}
      <div style={{ flex: 1, overflow: "hidden", borderBottom: "3px solid #FFF", transform: `translateX(${panTop}px)` }}>
        <FullBleedPhoto src={img1} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
      </div>

      {/* Middle Strip */}
      <div style={{ flex: 1, overflow: "hidden", borderBottom: "3px solid #FFD700", transform: `translateX(${panMid}px)`, zIndex: 5 }}>
        <FullBleedPhoto src={img2} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" />
      </div>

      {/* Bottom Strip */}
      <div style={{ flex: 1, overflow: "hidden", transform: `translateX(${panBot}px)` }}>
        <FullBleedPhoto src={img3} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
      </div>

      {/* Center Lyrics Overlay: "CHHOO LIYA TUNE" */}
      <AbsoluteFill style={{ pointerEvents: "none", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            opacity: textOpacity,
            transform: `scale(${textScale})`,
            fontFamily: "'Montserrat', 'Poppins', sans-serif",
            fontSize: 64,
            fontWeight: 900,
            letterSpacing: 3,
            color: "#FFFFFF",
            textShadow: "0 0 30px rgba(255, 215, 0, 0.95), 0 8px 30px rgba(0, 0, 0, 1)",
            textAlign: "center",
          }}
        >
          CHHOO LIYA TUNE ❤️
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ======================================================
// 3. LAYERED CORNER PHOTO COLLAGE + LYRICS "LAB SE AAKHON KO"
// ======================================================
const LayeredCornerCollageScene: React.FC<{
  images: Template44Image[];
  frame: number;
  sceneDuration: number;
}> = ({ images, frame, sceneDuration }) => {
  const bgImg = getImgSrc(images, 4);
  const corner1 = getImgSrc(images, 5);
  const corner2 = getImgSrc(images, 6);

  const floatSway = Math.sin(frame * 0.08) * 6;

  const textScale = interpolate(frame, [0, 15, sceneDuration - 10, sceneDuration], [0.3, 1.05, 1.0, 0.9], {
    ...clamp,
    easing: Easing.out(Easing.back(1.8)),
  });
  const textOpacity = interpolate(frame, [0, 12, sceneDuration - 8, sceneDuration], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080D", overflow: "hidden" }}>
      {/* Background Photo */}
      <FullBleedPhoto src={bgImg} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" />

      {/* Top-Right Corner Photo Card */}
      <div
        style={{
          position: "absolute",
          top: "6%",
          right: "6%",
          width: "44%",
          height: "38%",
          borderRadius: 20,
          overflow: "hidden",
          border: "4px solid #FFF",
          boxShadow: "0 20px 45px rgba(0,0,0,0.85)",
          transform: `rotate(4deg) translateY(${floatSway}px)`,
          zIndex: 8,
        }}
      >
        <FullBleedPhoto src={corner1} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
      </div>

      {/* Bottom-Left Corner Photo Card */}
      <div
        style={{
          position: "absolute",
          bottom: "6%",
          left: "6%",
          width: "44%",
          height: "38%",
          borderRadius: 20,
          overflow: "hidden",
          border: "4px solid #FFD700",
          boxShadow: "0 20px 45px rgba(0,0,0,0.85)",
          transform: `rotate(-4deg) translateY(${-floatSway}px)`,
          zIndex: 8,
        }}
      >
        <FullBleedPhoto src={corner2} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" />
      </div>

      {/* Center Lyrics Overlay: "LAB SE AAKHON KO" */}
      <AbsoluteFill style={{ pointerEvents: "none", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            opacity: textOpacity,
            transform: `scale(${textScale})`,
            fontFamily: "'Montserrat', 'Poppins', sans-serif",
            fontSize: 58,
            fontWeight: 900,
            letterSpacing: 2,
            color: "#FFE600",
            textShadow: "0 0 35px rgba(255, 230, 0, 0.95), 0 8px 30px rgba(0, 0, 0, 1)",
            textAlign: "center",
          }}
        >
          LAB SE AAKHON KO ✨
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ======================================================
// 4. SOLO COUPLE PORTRAIT + LYRICS "MANNETE PURI"
// ======================================================
const SoloCouplePortraitScene: React.FC<{
  src: string;
  frame: number;
  sceneDuration: number;
}> = ({ src, frame, sceneDuration }) => {
  const textScale = interpolate(frame, [0, 15, sceneDuration - 10, sceneDuration], [0.3, 1.05, 1.0, 0.9], {
    ...clamp,
    easing: Easing.out(Easing.back(1.8)),
  });
  const textOpacity = interpolate(frame, [0, 12, sceneDuration - 8, sceneDuration], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080D", overflow: "hidden" }}>
      <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />

      {/* Center Lyrics Overlay: "MANNETE PURI" */}
      <AbsoluteFill style={{ pointerEvents: "none", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            opacity: textOpacity,
            transform: `scale(${textScale})`,
            fontFamily: "'Montserrat', 'Poppins', sans-serif",
            fontSize: 62,
            fontWeight: 900,
            letterSpacing: 3,
            color: "#FFFFFF",
            textShadow: "0 0 35px rgba(255, 215, 0, 0.95), 0 8px 30px rgba(0, 0, 0, 1)",
            textAlign: "center",
          }}
        >
          MANNETE PURI 🌹
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ======================================================
// 5. ROMANTIC CLOSE-UP + LYRICS "TUMSE HEE... ❤️✨" (FINALE SCENE - NO INSTA LOGO)
// ======================================================
const RomanticCloseUpScene: React.FC<{
  src: string;
  frame: number;
  sceneDuration: number;
}> = ({ src, frame, sceneDuration }) => {
  const textScale = interpolate(frame, [0, 15, sceneDuration - 10, sceneDuration], [0.3, 1.05, 1.0, 0.9], {
    ...clamp,
    easing: Easing.out(Easing.back(1.8)),
  });
  const textOpacity = interpolate(frame, [0, 12, sceneDuration - 5, sceneDuration], [0, 1, 1, 0.9], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080D", overflow: "hidden" }}>
      <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" />

      {/* Center Lyrics Overlay: "TUMSE HEE... ❤️✨" */}
      <AbsoluteFill style={{ pointerEvents: "none", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            opacity: textOpacity,
            transform: `scale(${textScale})`,
            fontFamily: "'Montserrat', 'Poppins', sans-serif",
            fontSize: 66,
            fontWeight: 900,
            letterSpacing: 3,
            color: "#FFE600",
            textShadow: "0 0 40px rgba(255, 230, 0, 1), 0 8px 30px rgba(0, 0, 0, 1)",
            textAlign: "center",
          }}
        >
          TUMSE HEE... ❤️✨
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE ROUTER FOR TEMPLATE 44 (15.0 SECONDS TOTAL, NO INSTA OUTRO)
// ======================================================
const FrameScene = ({ scene, sceneDuration, images }: { scene: number; sceneDuration: number; images?: Template44Image[] }) => {
  const frame = useCurrentFrame();
  const img0 = getImgSrc(images, 0);
  const img1 = getImgSrc(images, 1);
  const img2 = getImgSrc(images, 2);
  const img3 = getImgSrc(images, 3);
  const img7 = getImgSrc(images, 7);
  const img8 = getImgSrc(images, 8);

  switch (scene) {
    case 1:
      return <IntroHeartPulseScene src={img0} frame={frame} sceneDuration={sceneDuration} />;
    case 2:
      return <ThreeSplitReelGridScene img1={img1} img2={img2} img3={img3} frame={frame} sceneDuration={sceneDuration} />;
    case 3:
      return <LayeredCornerCollageScene images={images || []} frame={frame} sceneDuration={sceneDuration} />;
    case 4:
      return <SoloCouplePortraitScene src={img7} frame={frame} sceneDuration={sceneDuration} />;
    case 5:
      return <RomanticCloseUpScene src={img8} frame={frame} sceneDuration={sceneDuration} />;
    default:
      return null;
  }
};

// ======================================================
// 🎬 MAIN TEMPLATE 44 COMPONENT (EXACT 15.0 SECONDS = 450 FRAMES)
// ======================================================
export const Template44: React.FC<Template44Props> = ({ images = [], music }) => {
  const frame = useCurrentFrame();

  let currentSceneIndex = 0;
  for (let i = 0; i < TOTAL_SCENES; i++) {
    const { start, duration } = SCENE_BOUNDARIES[i];
    if (frame >= start && frame < start + duration) {
      currentSceneIndex = i;
      break;
    }
  }
  if (frame >= DURATION_IN_FRAMES) {
    currentSceneIndex = TOTAL_SCENES - 1;
  }

  const musicSrc = typeof music === "string" ? music : music?.path;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {SCENE_BOUNDARIES.map((b, idx) => (
        <Sequence key={idx} from={b.start} durationInFrames={b.duration}>
          <FrameScene scene={idx + 1} sceneDuration={b.duration} images={images} />
          <FlashOverlay frame={useCurrentFrame() - b.start} />
        </Sequence>
      ))}

      {/* Audio Player */}
      {musicSrc && <MusicPlayer src={musicSrc} volume={music?.volume ?? 1} showVisualizer={true} />}
    </AbsoluteFill>
  );
};

export default Template44;