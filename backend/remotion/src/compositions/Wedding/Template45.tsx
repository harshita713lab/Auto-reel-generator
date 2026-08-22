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

export type Template45Image = {
  path: string;
  url?: string;
};

export type Template45Props = {
  images?: Template45Image[];
  music?: Music;
};

interface Music {
  path: string;
  volume?: number;
}

// ======================================================
// CONFIGURATION & CONSTANTS (EXACTLY 11.0 SECONDS = 330 FRAMES)
// EXACT 15 IMAGES REQUIRED
// ======================================================

export const FPS = 30;
export const TOTAL_SCENES = 8;
export const DURATION_IN_FRAMES = 330; // 330 frames @ 30 FPS = EXACTLY 11.0 SECONDS
export const IMAGE_COUNT = 15; // EXACTLY 15 IMAGES

// Scene timing boundaries for 330 frames total (11.0 seconds)
const SCENE_BOUNDARIES = [
  { start: 0, duration: 45 },    // Scene 1: Blurred Background + 5-Photo Center Collage (Larger Cards)
  { start: 45, duration: 45 },   // Scene 2: Horizontal 3-Strip Stacked Collage
  { start: 90, duration: 45 },   // Scene 3: 1 Base Image + 5 Overlay Grid Photos (Larger Borderless Cards)
  { start: 135, duration: 30 },  // Scene 4: Solo RGB Glitch Flash Photo
  { start: 165, duration: 36 },  // Scene 5: Diamond 5-Card Array Spin (Larger 480px & 310px Diamond Cards)
  { start: 201, duration: 30 },  // Scene 6: Flash Zoom Solo Photo
  { start: 231, duration: 69 },  // Scene 7: Full Screen Slow Motion Panning Photo
  { start: 300, duration: 30 },  // Scene 8: VN Outro Screen
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
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509924603848-aca550f96323?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
];

export const DEFAULT_PROPS: Template45Props = {
  images: DEFAULT_IMAGE_URLS.map((url) => ({ path: url, url })),
  music: undefined,
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const getVelocityProgress = (localFrame: number, duration: number): number => {
  const norm = Math.max(0, Math.min(1, localFrame / duration));
  return interpolate(norm, [0, 1], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
};

const getImgSrc = (images: Template45Image[] | undefined, index: number): string => {
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
// 1. BLUR BACKGROUND + 5-PHOTO CENTER COLLAGE SCENE (LARGER CARDS)
// ======================================================
const FivePhotoCenterCollageScene: React.FC<{
  images: Template45Image[];
  frame: number;
  sceneDuration: number;
}> = ({ images, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const scale = interpolate(vProgress, [0, 0.45], [0.3, 1.0], clamp);
  const floatSway = Math.sin(frame * 0.08) * 5;

  const img0 = getImgSrc(images, 0); // Background & Center
  const img1 = getImgSrc(images, 1); // Upper Left
  const img2 = getImgSrc(images, 2); // Upper Right
  const img3 = getImgSrc(images, 3); // Bottom Left
  const img4 = getImgSrc(images, 4); // Bottom Right

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080D", overflow: "hidden" }}>
      {/* Blurred Background Photo */}
      <FullBleedPhoto src={img0} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" />

      {/* 5-Photo Grid Collage with Larger Cards */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          zIndex: 10,
        }}
      >
        {/* 1. Upper Left Card */}
        <div style={cornerCardStyle("4%", "4%", "-4deg", floatSway, "46%", "46%")}>
          <FullBleedPhoto src={img1} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
        </div>

        {/* 2. Upper Right Card */}
        <div style={cornerCardStyle("4%", "50%", "4deg", -floatSway, "46%", "46%")}>
          <FullBleedPhoto src={img2} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" />
        </div>

        {/* 3. Bottom Left Card */}
        <div style={cornerCardStyle("50%", "4%", "3deg", floatSway, "46%", "46%")}>
          <FullBleedPhoto src={img3} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" />
        </div>

        {/* 4. Bottom Right Card */}
        <div style={cornerCardStyle("50%", "50%", "-3deg", -floatSway, "46%", "46%")}>
          <FullBleedPhoto src={img4} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
        </div>

        {/* 5. Center Card (Larger 62% x 62% in middle with solid white border & golden glow) */}
        <div
          style={{
            position: "absolute",
            top: "19%",
            left: "19%",
            width: "62%",
            height: "62%",
            borderRadius: 24,
            overflow: "hidden",
            border: "4px solid #FFFFFF",
            boxShadow: "0 25px 65px rgba(0,0,0,0.95), 0 0 35px rgba(255,215,0,0.7)",
            zIndex: 15,
            transform: `translateY(${floatSway * 0.5}px)`,
          }}
        >
          <FullBleedPhoto src={img0} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const cornerCardStyle = (
  top: string,
  left: string,
  rot: string,
  swayY: number,
  w = "42%",
  h = "42%"
): React.CSSProperties => ({
  position: "absolute",
  top,
  left,
  width: w,
  height: h,
  borderRadius: 20,
  overflow: "hidden",
  border: "3px solid #FFFFFF",
  transform: `rotate(${rot}) translateY(${swayY}px)`,
  boxShadow: "0 15px 35px rgba(0,0,0,0.85)",
});

// ======================================================
// 2. HORIZONTAL COLLAGE SCENE (3-Horizontal Strip Stacked Collage)
// ======================================================
const HorizontalCollageScene: React.FC<{
  img1: string;
  img2: string;
  img3: string;
  frame: number;
  sceneDuration: number;
}> = ({ img1, img2, img3, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const panTop = interpolate(vProgress, [0, 1], [-50, 50], clamp);
  const panMid = interpolate(vProgress, [0, 1], [50, -50], clamp);
  const panBot = interpolate(vProgress, [0, 1], [-50, 50], clamp);

  const exitProgress = interpolate(frame, [sceneDuration - 8, sceneDuration], [0, 1], clamp);
  const slideTopX = exitProgress * 1200;
  const slideMidX = exitProgress * -1200;
  const slideBotX = exitProgress * 1200;

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080D", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Top Horizontal Strip */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          borderBottom: "3px solid #FFFFFF",
          boxShadow: "0 10px 25px rgba(0,0,0,0.8)",
          transform: `translateX(${panTop + slideTopX}px)`,
        }}
      >
        <FullBleedPhoto src={img1} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
      </div>

      {/* Middle Horizontal Strip */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          borderBottom: "3px solid #FFD700",
          boxShadow: "0 10px 25px rgba(0,0,0,0.8)",
          transform: `translateX(${panMid + slideMidX}px)`,
          zIndex: 5,
        }}
      >
        <FullBleedPhoto src={img2} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" />
      </div>

      {/* Bottom Horizontal Strip */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          transform: `translateX(${panBot + slideBotX}px)`,
        }}
      >
        <FullBleedPhoto src={img3} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// 3. 1 BASE IMAGE + 5 OVERLAY GRID PHOTOS (LARGER BORDERLESS CARDS)
// ======================================================
const SequentialNoBorderGridScene: React.FC<{
  images: Template45Image[];
  frame: number;
  sceneDuration: number;
}> = ({ images, frame, sceneDuration }) => {
  const bgImg = getImgSrc(images, 5);
  const img1 = getImgSrc(images, 6);
  const img2 = getImgSrc(images, 7);
  const img3 = getImgSrc(images, 8);
  const img4 = getImgSrc(images, 9);
  const img5 = getImgSrc(images, 10);

  const gridItems = [
    { src: img1, style: { top: "6%", left: "4%", width: "45%", height: "42%" }, delay: 0 },
    { src: img2, style: { top: "6%", right: "4%", width: "45%", height: "42%" }, delay: 6 },
    { src: img3, style: { top: "28%", left: "26%", width: "48%", height: "44%" }, delay: 12, zIndex: 10 },
    { src: img4, style: { bottom: "6%", left: "4%", width: "45%", height: "42%" }, delay: 18 },
    { src: img5, style: { bottom: "6%", right: "4%", width: "45%", height: "42%" }, delay: 24 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080D", overflow: "hidden" }}>
      {/* 1 Base Image in Background */}
      <FullBleedPhoto src={bgImg} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" />

      {/* 5 Overlay Grid Photos Appearing One by One Without Border */}
      {gridItems.map((item, idx) => {
        const itemFrame = Math.max(0, frame - item.delay);

        if (itemFrame <= 0 && frame < item.delay) return null;

        const popScale = interpolate(itemFrame, [0, 5, 9], [0.2, 1.12, 1.0], {
          ...clamp,
          easing: Easing.out(Easing.back(2.2)),
        });
        const opacity = interpolate(itemFrame, [0, 4], [0, 1], clamp);

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              ...item.style,
              borderRadius: 22,
              overflow: "hidden",
              border: "none",
              boxShadow: "0 20px 45px rgba(0,0,0,0.85)",
              opacity,
              transform: `scale(${popScale})`,
              transformOrigin: "center center",
              zIndex: item.zIndex || 5,
            }}
          >
            <FullBleedPhoto src={item.src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ======================================================
// 4. SOLO RGB CHROMATIC GLITCH PHOTO SCENE
// ======================================================
const RGBGlitchSoloScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  const pulse = interpolate(frame % 8, [0, 4, 8], [0, 14, 0], clamp);
  const zoomScale = interpolate(frame, [0, sceneDuration], [1.0, 1.15], clamp);

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      {/* Red Channel Shift */}
      <Img
        src={src}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoomScale}) translate(${pulse}px, 0px)`,
          filter: "drop-shadow(-5px 0 0 rgba(255,0,80,0.85))",
          mixBlendMode: "screen",
          opacity: 0.9,
        }}
      />
      {/* Cyan Channel Shift */}
      <Img
        src={src}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoomScale}) translate(${-pulse}px, 0px)`,
          filter: "drop-shadow(5px 0 0 rgba(0,240,255,0.85))",
          mixBlendMode: "screen",
          opacity: 0.9,
        }}
      />
      {/* Base Photo */}
      <Img
        src={src}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoomScale})`,
          zIndex: 2,
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// 5. DIAMOND 5-CARD ARRAY SPIN SCENE (MUCH LARGER DIAMOND CARDS)
// ======================================================
const diamondStyle = (top: string, left: string, w: number, h: number): React.CSSProperties => ({
  position: "absolute",
  top,
  left,
  width: w,
  height: h,
  borderRadius: 24,
  overflow: "hidden",
  transform: "rotate(45deg)",
  border: "4px solid #FFFFFF",
  boxShadow: "0 20px 45px rgba(0,0,0,0.85)",
});

const DiamondArrayScene: React.FC<{
  images: Template45Image[];
  frame: number;
  sceneDuration: number;
}> = ({ images, frame, sceneDuration }) => {
  const vProgress = getVelocityProgress(frame, sceneDuration);
  const spinRot = interpolate(vProgress, [0, 0.45], [180, 0], clamp);
  const scale = interpolate(vProgress, [0, 0.45], [0.2, 1.0], clamp);

  const img0 = getImgSrc(images, 5);
  const img1 = getImgSrc(images, 6);
  const img2 = getImgSrc(images, 7);
  const img3 = getImgSrc(images, 8);
  const img4 = getImgSrc(images, 9);

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080D", overflow: "hidden" }}>
      <FullBleedPhoto src={img0} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${scale}) rotate(${spinRot}deg)`,
          transformOrigin: "center center",
          zIndex: 10,
        }}
      >
        {/* Top-Left Diamond (Larger 310px) */}
        <div style={diamondStyle("12%", "12%", 310, 310)}>
          <FullBleedPhoto src={img1} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
        </div>
        {/* Top-Right Diamond (Larger 310px) */}
        <div style={diamondStyle("12%", "56%", 310, 310)}>
          <FullBleedPhoto src={img2} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" />
        </div>
        {/* Bottom-Left Diamond (Larger 310px) */}
        <div style={diamondStyle("56%", "12%", 310, 310)}>
          <FullBleedPhoto src={img3} frame={frame} sceneDuration={sceneDuration} zoomDirection="out" />
        </div>
        {/* Bottom-Right Diamond (Larger 310px) */}
        <div style={diamondStyle("56%", "56%", 310, 310)}>
          <FullBleedPhoto src={img4} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
        </div>

        {/* Center Large Diamond (Much Larger 480px x 480px) */}
        <div style={{ ...diamondStyle("24%", "24%", 480, 480), zIndex: 15, border: "5px solid #FFF", boxShadow: "0 25px 65px rgba(0,0,0,0.95)" }}>
          <FullBleedPhoto src={img0} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// 6. FLASH ZOOM SOLO PHOTO SCENE
// ======================================================
const FlashZoomSoloScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  const scale = interpolate(frame, [0, sceneDuration], [1.0, 1.18], { ...clamp, easing: Easing.out(Easing.quad) });

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" style={{ transform: `scale(${scale})` }} />
    </AbsoluteFill>
  );
};

// ======================================================
// 7. FULL SCREEN SLOW MOTION PANNING SCENE
// ======================================================
const FullScreenSlowMotionScene: React.FC<{ src: string; frame: number; sceneDuration: number }> = ({ src, frame, sceneDuration }) => {
  return <FullBleedPhoto src={src} frame={frame} sceneDuration={sceneDuration} zoomDirection="in" />;
};

// ======================================================
// 8. VN OUTRO SCENE
// ======================================================
const VNOutroScene = ({ frame }: { frame: number }) => {
  const opacity = interpolate(frame, [0, 10], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        zIndex: 40,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 24,
            background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 12px 30px rgba(220, 39, 67, 0.55)",
          }}
        >
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </div>
        <span
          style={{
            fontFamily: "'Montserrat', 'Poppins', sans-serif",
            fontSize: 28,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 2,
          }}
        >
          @VN_CODE_OFFICAL
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE ROUTER FOR TEMPLATE 45 (11.0 SECONDS TOTAL)
// ======================================================
const FrameScene = ({ scene, sceneDuration, images }: { scene: number; sceneDuration: number; images?: Template45Image[] }) => {
  const frame = useCurrentFrame();
  const img1 = getImgSrc(images, 1);
  const img2 = getImgSrc(images, 2);
  const img3 = getImgSrc(images, 3);
  const img10 = getImgSrc(images, 10);
  const img14 = getImgSrc(images, 14);

  switch (scene) {
    case 1:
      return <FivePhotoCenterCollageScene images={images || []} frame={frame} sceneDuration={sceneDuration} />;
    case 2:
      return <HorizontalCollageScene img1={img1} img2={img2} img3={img3} frame={frame} sceneDuration={sceneDuration} />;
    case 3:
      return <SequentialNoBorderGridScene images={images || []} frame={frame} sceneDuration={sceneDuration} />;
    case 4:
      return <RGBGlitchSoloScene src={img10} frame={frame} sceneDuration={sceneDuration} />;
    case 5:
      return <DiamondArrayScene images={images || []} frame={frame} sceneDuration={sceneDuration} />;
    case 6:
      return <FlashZoomSoloScene src={img14} frame={frame} sceneDuration={sceneDuration} />;
    case 7:
      return <FullScreenSlowMotionScene src={img10} frame={frame} sceneDuration={sceneDuration} />;
    case 8:
      return <VNOutroScene frame={frame} />;
    default:
      return null;
  }
};

// ======================================================
// 🎬 MAIN TEMPLATE 45 COMPONENT (EXACT 11.0 SECONDS = 330 FRAMES)
// ======================================================
export const Template45: React.FC<Template45Props> = ({ images = [], music }) => {
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

  const { start: currentSceneStart, duration: currentSceneDur } = SCENE_BOUNDARIES[currentSceneIndex];

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

export default Template45;