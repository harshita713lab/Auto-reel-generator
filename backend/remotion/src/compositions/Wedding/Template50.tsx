import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { MusicPlayer } from "../../components";

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
  url?: string;
}

interface Music {
  path: string;
  volume?: number;
}

interface Template50Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIGURATION & CONSTANTS
// ======================================================

export const FPS = 30;

// 18 Seconds total duration (540 frames @ 30 FPS) -> Always > 10 seconds!
export const DURATION_IN_FRAMES = 540;

// Flexible Image Count (Min 1, Max 30, Default 20)
export const IMAGE_COUNT = 20;

// Fallback images for preview
export const DEFAULT_PROPS: Template50Props = {
  images: Array(20)
    .fill(null)
    .map((_, i) => ({
      path: `https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop`,
    })),
  music: undefined,
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// Helper to extract image source safely
const getImgSrc = (images: ImageItem[], index: number): string => {
  if (!images || images.length === 0) return DEFAULT_PROPS.images![0].path;
  const safeIdx = Math.abs(index) % images.length;
  const img = images[safeIdx];
  if (img?.url) return img.url;
  if (img?.path) return img.path;
  return DEFAULT_PROPS.images![safeIdx % DEFAULT_PROPS.images!.length]?.path || "";
};

// Soft Beat Pulse Keyframe
const getKeyframeBeatPulse = (frame: number): number => {
  const beatCycle = frame % 15;
  if (beatCycle < 4) {
    return interpolate(beatCycle, [0, 2, 4], [1, 1.02, 1], clamp);
  }
  return 1;
};

// ======================================================
// 🎬 REFERENCE VIDEO STYLE: MULTI-PHOTO COLLAGE + MAIN SUBJECT CUTOUT
// ======================================================

const CutoutCollageScene: React.FC<{
  images: ImageItem[];
  currentIndex: number;
  localFrame: number;
  globalFrame: number;
  duration: number;
  title?: string;
}> = ({ images, currentIndex, localFrame, globalFrame, duration, title }) => {
  // Main Subject Cutout Photo
  const cutoutImgSrc = getImgSrc(images, currentIndex);

  // 4 Background Collage Photos
  const bgImg1 = getImgSrc(images, currentIndex + 1);
  const bgImg2 = getImgSrc(images, currentIndex + 2);
  const bgImg3 = getImgSrc(images, currentIndex + 3);
  const bgImg4 = getImgSrc(images, currentIndex + 4);

  // Keyframes
  const opacity = interpolate(
    localFrame,
    [0, 4, duration - 4, duration],
    [0, 1, 1, 0],
    clamp
  );

  // Background Grid Scale Motion
  const bgScale = interpolate(localFrame, [0, duration], [0.98, 1.03], clamp);

  // 🔄 Keyframe Rotation Animation after 5 seconds (5 sec @ 30 fps = 150 frames)
  const isAfter5Sec = globalFrame >= 150;
  const cutoutRotate = isAfter5Sec
    ? interpolate(
        localFrame,
        [0, 14, duration],
        [-360, 0, 10],
        { ...clamp, easing: Easing.out(Easing.back(1.4)) }
      )
    : 0;

  const bgRotate = isAfter5Sec
    ? interpolate(
        localFrame,
        [0, 12, duration],
        [180, 0, -5],
        { ...clamp, easing: Easing.out(Easing.quad) }
      )
    : 0;

  // Cutout Subject Pop Keyframe
  const cutoutScale = interpolate(
    localFrame,
    [0, 8, duration],
    [0.9, 1.15, 1.2],
    { ...clamp, easing: Easing.out(Easing.quad) }
  );

  const cutoutTranslateY = interpolate(
    localFrame,
    [0, 8],
    [50, 0],
    { ...clamp, easing: Easing.out(Easing.quad) }
  );

  // 🎭 CENTERED BIG TEXT KEYFRAME ANIMATION ("Bich me bde bde text with animation")
  const textOpacity = interpolate(
    localFrame,
    [0, 5, duration - 6, duration],
    [0, 1, 1, 0],
    clamp
  );

  const textScale = interpolate(
    localFrame,
    [0, 10, duration],
    [0.4, 1.1, 1.15],
    { ...clamp, easing: Easing.out(Easing.back(1.5)) }
  );

  const textY = interpolate(
    localFrame,
    [0, 10],
    [40, 0],
    { ...clamp, easing: Easing.out(Easing.quad) }
  );

  const textRotate = interpolate(
    localFrame,
    [0, 10],
    [-6, 0],
    { ...clamp, easing: Easing.out(Easing.back(1.2)) }
  );

  const textBlur = interpolate(
    localFrame,
    [0, 6],
    [10, 0],
    clamp
  );

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden", backgroundColor: "#0d0d0d" }}>
      
      {/* 1. BACKGROUND MULTI-PHOTO GRID COLLAGE WALL */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "20px",
          right: "20px",
          height: "60%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "10px",
          transform: `scale(${bgScale}) rotate(${bgRotate}deg)`,
          zIndex: 1,
        }}
      >
        {[bgImg1, bgImg2, bgImg3, bgImg4].map((src, i) => (
          <div
            key={i}
            style={{
              borderRadius: "14px",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
              filter: "brightness(0.65) contrast(1.05)",
            }}
          >
            <Img
              src={src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>

      {/* Dark Ambient Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.9) 100%)",
          zIndex: 3,
        }}
      />

      {/* 2. FOREGROUND SUBJECT CUTOUT / CENTER PHOTO */}
      <div
        style={{
          position: "absolute",
          left: "5%",
          right: "5%",
          bottom: "20px",
          height: "80%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          zIndex: 10,
          transform: `translateY(${cutoutTranslateY}px) scale(${cutoutScale}) rotate(${cutoutRotate}deg)`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            filter: "drop-shadow(0 15px 35px rgba(0,0,0,0.95))",
          }}
        >
          {/* CUTOUT SUBJECT */}
          <Img
            src={cutoutImgSrc}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
              maskImage:
                "radial-gradient(ellipse 65% 75% at 50% 45%, #000 45%, rgba(0,0,0,0.7) 70%, transparent 98%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 65% 75% at 50% 45%, #000 45%, rgba(0,0,0,0.7) 70%, transparent 98%)",
            }}
          />
        </div>
      </div>

      {/* 3. 🎭 BIG CENTERED ANIMATED OVERLAY TEXT ("Bich me bde bde text") */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 35,
          opacity: textOpacity,
          transform: `translateY(${textY}px) scale(${textScale}) rotate(${textRotate}deg)`,
          filter: `blur(${textBlur}px)`,
          pointerEvents: "none",
          padding: "0 25px",
        }}
      >
        <span
          style={{
            fontFamily: "'Arial Black', 'Impact', 'Georgia', sans-serif",
            fontSize: "46px",
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "3px",
            textTransform: "uppercase",
            textShadow:
              "0 8px 30px rgba(0,0,0,0.98), 0 0 25px rgba(255, 215, 0, 0.8)",
            background:
              "linear-gradient(180deg, #ffffff 0%, #fff2b2 55%, #ffd700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.9))",
          }}
        >
          {title || "✨ FOREVER & ALWAYS"}
        </span>

        <div
          style={{
            marginTop: "14px",
            padding: "8px 24px",
            borderRadius: "30px",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            border: "2px solid rgba(255, 215, 0, 0.6)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.8), 0 0 15px rgba(255, 215, 0, 0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          <span
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "18px",
              fontWeight: 700,
              fontStyle: "italic",
              color: "#ffeaa7",
              letterSpacing: "1.5px",
              textShadow: "0 2px 8px rgba(0,0,0,0.9)",
            }}
          >
            {currentIndex % 4 === 0
              ? "✨ Our Magical Journey Begins"
              : currentIndex % 4 === 1
              ? "💖 Every Moment With You"
              : currentIndex % 4 === 2
              ? "🌹 Together Is My Favorite Place"
              : "👑 Love You More Each Day"}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ROMANTIC_TITLES = [
  "✨ Forever & Always",
  "💖 Pure Love Story",
  "🌹 Two Hearts, One Soul",
  "🌟 Timeless Memories",
  "👑 The Beginning of Always",
];

// ======================================================
// MAIN TEMPLATE 50 COMPONENT
// ======================================================

export const Template50: React.FC<Template50Props> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();
  const safeImages = images && images.length > 0 ? images : DEFAULT_PROPS.images!;
  const totalImages = safeImages.length;

  const beatPulse = getKeyframeBeatPulse(frame);
  const musicSrc = typeof music === "string" ? music : music?.path;

  // Dynamic slide duration calculated per photo count for 540 total frames (18 seconds)
  const slideDuration = Math.max(15, Math.floor(540 / Math.max(1, totalImages)));
  const currentPhotoIndex = Math.min(totalImages - 1, Math.floor(frame / slideDuration));
  const localFrame = frame % slideDuration;

  const currentTitle = ROMANTIC_TITLES[currentPhotoIndex % ROMANTIC_TITLES.length];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050505",
        overflow: "hidden",
        transform: `scale(${beatPulse})`,
      }}
    >
      {/* Cutout & Multi-Photo Collage Scene */}
      <CutoutCollageScene
        images={safeImages}
        currentIndex={currentPhotoIndex}
        localFrame={localFrame}
        globalFrame={frame}
        duration={slideDuration}
        title={currentTitle}
      />

      {/* Header Progress Bar */}
      <div
        style={{
          position: "absolute",
          top: "22px",
          left: "30px",
          right: "30px",
          display: "flex",
          gap: "4px",
          zIndex: 30,
        }}
      >
        {Array.from({ length: totalImages }).map((_, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              height: "4px",
              backgroundColor:
                idx <= currentPhotoIndex
                  ? "#ffffff"
                  : "rgba(255,255,255,0.25)",
              borderRadius: "2px",
              boxShadow:
                idx === currentPhotoIndex ? "0 0 10px #ffffff" : "none",
            }}
          />
        ))}
      </div>

      {/* Music Player */}
      {musicSrc && <MusicPlayer src={musicSrc} volume={music?.volume ?? 1} />}
    </AbsoluteFill>
  );
};

export default Template50;
