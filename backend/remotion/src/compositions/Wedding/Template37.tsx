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

interface Template37Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIG
// ======================================================

export const FPS = 30;

// Total images:
// 11 collage images
// 7 fullscreen images
// = 18 images
export const IMAGE_COUNT = 18;

// Total duration = 20 seconds
// 20 × 30 = 600 frames
export const DURATION_IN_FRAMES = 600;

// Collage:
// 00:00 → 00:07
const FULLSCREEN_START = 210;

// ======================================================
// FULLSCREEN DURATIONS
// ======================================================

const FULLSCREEN_DURATIONS = [
  60,
  60,
  30,
  60,
  60,
  30,
  90,
];

// Corresponding lyrics for the 7 fullscreen images
const FULLSCREEN_LYRICS = [
  "Tere Bin Kal Hore ...",
  "Theeki Koni Haal Mera...",
  "Haath Jodu Ram Dede",
  "Saansan Te Rihaayi Manne...",
  "Geeta Mein Gaayi Kade...",
  "Chhaati Ke Laga Manne",
  "Jit Bhi Gaya Re Teri Yaad Khadi Paayi Manne....",
];

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// DEFAULT IMAGE DATA
// ======================================================

const DEFAULT_IMAGE_IDS = [
  "1583939003579-730e3918a45a",
  "1519741497674-611481863552",
  "1511285560929-80b456fea0bc",
  "1519225421980-715cb0215aed",
  "1606800052052-a08af7148866",
  "1606216794074-735e91aa2c92",
  "1515934751635-c81c6bc9a2d8",
  "1507504031003-b417219a0fde",
  "1517841905240-472988babdf9",
  "1492562080023-ab3db95bfbce",
  "1523438885200-e635ba2c371e",
  "1520854221256-3f7c0f0b6e5f",
  "1504150558240-0b4fd8946624",
  "1511285560929-80b456fea0bc",
  "1519741497674-611481863552",
  "1519225421980-715cb0215aed",
  "1583939003579-730e3918a45a",
  "1606800052052-a08af7148866",
];

export const DEFAULT_PROPS: Template37Props = {
  images: DEFAULT_IMAGE_IDS.map((id) => ({
    path: `https://images.unsplash.com/photo-${id}?q=80&w=1200&auto=format&fit=crop`,
  })),
};

// ======================================================
// IMAGE HELPER
// ======================================================

const getImgSrc = (
  images: ImageItem[],
  index: number
): string => {
  if (!images || images.length === 0) {
    return DEFAULT_PROPS.images?.[0]?.path || "";
  }

  const actualIndex = index % images.length;

  return (
    images[actualIndex]?.url ||
    images[actualIndex]?.path ||
    DEFAULT_PROPS.images?.[0]?.path ||
    ""
  );
};

// ======================================================
// COLLAGE POSITIONS
// ======================================================

const COLLAGE_POSITIONS = [
  { left: "5%", top: "8%", width: "29%", height: "18%", rotate: -4 },
  { left: "35%", top: "5%", width: "30%", height: "19%", rotate: 2 },
  { left: "66%", top: "9%", width: "29%", height: "18%", rotate: 4 },
  { left: "4%", top: "29%", width: "30%", height: "19%", rotate: 3 },
  { left: "67%", top: "30%", width: "29%", height: "19%", rotate: -3 },
  { left: "5%", top: "51%", width: "29%", height: "18%", rotate: -4 },
  { left: "67%", top: "52%", width: "29%", height: "18%", rotate: 4 },
  { left: "7%", top: "73%", width: "25%", height: "17%", rotate: 3 },
  { left: "37%", top: "75%", width: "27%", height: "16%", rotate: -2 },
  { left: "68%", top: "73%", width: "25%", height: "17%", rotate: -3 },
  { left: "27%", top: "27%", width: "46%", height: "40%", rotate: 0 },
];

// ======================================================
// DECORATIVE HEARTS
// ======================================================

const TopHeartsOverlay: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 25,
        left: 25,
        zIndex: 200,
        display: "flex",
        gap: "8px",
        alignItems: "flex-end",
      }}
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="#ff2a2a"
        style={{ transform: "rotate(-15deg)" }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <svg
        width="45"
        height="45"
        viewBox="0 0 24 24"
        fill="#ff2a2a"
        style={{ transform: "translateY(-8px) rotate(5deg)" }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="#ff2a2a"
        style={{ transform: "rotate(15deg)" }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  );
};

// ======================================================
// BOTTOM HEART
// ======================================================

const BottomHeartOverlay: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 15,
        left: 30,
        zIndex: 200,
      }}
    >
      <svg
        width="110"
        height="110"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ff2a2a"
        strokeWidth="1.5"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  );
};

// ======================================================
// COLLAGE BACKGROUND
// ======================================================

const CollageBackground: React.FC<{
  src: string;
  frame: number;
}> = ({ src, frame }) => {
  const bgScale = interpolate(
    frame,
    [0, FULLSCREEN_START],
    [1.15, 1.02],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }
  );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: "#e8e4dc",
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${bgScale})`,
          filter: "blur(18px) brightness(0.65)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(0,0,0,0.38))",
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// COLLAGE IMAGE
// ======================================================

const CollageImage: React.FC<{
  src: string;
  index: number;
  frame: number;
}> = ({ src, index, frame }) => {
  const entryFrames = [0, 30, 30, 60, 60, 90, 90, 120, 120, 150, 180];
  const startFrame = entryFrames[index] ?? 0;
  const localFrame = frame - startFrame;

  const opacity = interpolate(localFrame, [0, 6], [0, 1], clamp);
  const isCenter = index === 10;
  const scale = interpolate(
    localFrame,
    isCenter ? [0, 16] : [0, 12],
    isCenter ? [0.55, 1] : [0.72, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.back(1.3)),
    }
  );

  const pos = COLLAGE_POSITIONS[index];
  if (!pos) return null;

  return (
    <AbsoluteFill
      style={{
        left: pos.left,
        top: pos.top,
        width: pos.width,
        height: pos.height,
        opacity,
        transform: `scale(${scale}) rotate(${pos.rotate}deg)`,
        transformOrigin: "center center",
        backgroundColor: "#ffffff",
        border: isCenter ? "10px solid #ffffff" : "5px solid #ffffff",
        boxShadow: isCenter
          ? "0 20px 50px rgba(0,0,0,0.45)"
          : "0 8px 22px rgba(0,0,0,0.28)",
        zIndex: isCenter ? 100 : index + 2,
        overflow: "hidden",
        borderRadius: isCenter ? "2px" : "1px",
      }}
    >
      <Img
        src={src}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// FULLSCREEN HELPERS
// ======================================================

const getFullscreenIndex = (frame: number): number => {
  let accumulated = FULLSCREEN_START;
  for (let i = 0; i < FULLSCREEN_DURATIONS.length; i++) {
    accumulated += FULLSCREEN_DURATIONS[i];
    if (frame < accumulated) {
      return i;
    }
  }
  return FULLSCREEN_DURATIONS.length - 1;
};

const getFullscreenStart = (index: number): number => {
  let start = FULLSCREEN_START;
  for (let i = 0; i < index; i++) {
    start += FULLSCREEN_DURATIONS[i];
  }
  return start;
};

// ======================================================
// FULLSCREEN IMAGE WITH LYRICS
// ======================================================

// ======================================================
// FULLSCREEN IMAGE WITH LYRICS
// ======================================================

const FullscreenImage: React.FC<{
  src: string;
  frame: number;
  index: number;
}> = ({ src, frame, index }) => {
  const start = getFullscreenStart(index);
  const localFrame = frame - start;
  const duration = FULLSCREEN_DURATIONS[index] || 30;

  const opacity = interpolate(
    localFrame,
    [0, 6],
    [0, 1],
    clamp
  );

  const progress = interpolate(
    localFrame,
    [0, Math.max(1, duration - 1)],
    [0, 1],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }
  );

  const scale = interpolate(
    progress,
    [0, 1],
    [1.08, 1],
    clamp
  );

  const currentLyric = FULLSCREEN_LYRICS[index] || "";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        opacity,
      }}
    >
      {/* IMAGE CONTAINER */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px 18px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "88%",
            borderRadius: "30px",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            boxShadow: "0 15px 40px rgba(0,0,0,0.28)",
          }}
        >
          {/* MAIN IMAGE */}
          <Img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${scale})`,
            }}
          />

          {/* SOFT WHITE EDGE */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow:
                "inset 0 0 55px 25px rgba(255,255,255,0.45)",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />

          {/* LYRICS */}
          {currentLyric && (
            <div
              style={{
                position: "absolute",
                bottom: "25px",
                left: "5%",
                right: "5%",
                textAlign: "center",
                padding: "0 15px",
                zIndex: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily:
                    "Brush Script MT, cursive, sans-serif",

                  // FONT SIZE
                  fontSize: "50px",

                  color: "#ffffff",

                  fontStyle: "italic",

                  fontWeight: 500,

                  letterSpacing: "1px",

                  lineHeight: 1.15,

                  maxWidth: "95%",

                  textAlign: "center",

                  // Strong shadow so text remains visible
                  textShadow:
                    "2px 2px 8px rgba(0,0,0,0.9), " +
                    "0 0 15px rgba(0,0,0,0.65), " +
                    "0 3px 20px rgba(0,0,0,0.5)",
                }}
              >
                {currentLyric}
              </span>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};``

// ======================================================
// MAIN TEMPLATE 37
// ======================================================

export const Template37: React.FC<Template37Props> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();

  const musicSrc =
    typeof music === "string" ? music : music?.path;

  const safeImages =
    images.length >= IMAGE_COUNT
      ? images.slice(0, IMAGE_COUNT)
      : [
          ...images,
          ...(DEFAULT_PROPS.images || []),
        ].slice(0, IMAGE_COUNT);

  const fullscreenIndex =
    frame >= FULLSCREEN_START
      ? getFullscreenIndex(frame)
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* PART 1 — COLLAGE */}
      {frame < FULLSCREEN_START && (
        <AbsoluteFill>
          <CollageBackground
            src={getImgSrc(safeImages, 0)}
            frame={frame}
          />
          <TopHeartsOverlay />
          <BottomHeartOverlay />

          {Array.from({ length: 11 }, (_, index) => (
            <CollageImage
              key={index}
              src={getImgSrc(safeImages, index)}
              index={index}
              frame={frame}
            />
          ))}
        </AbsoluteFill>
      )}

      {/* PART 2 — FULLSCREEN WITH LYRICS */}
      {frame >= FULLSCREEN_START && (
        <FullscreenImage
          src={getImgSrc(
            safeImages,
            11 + fullscreenIndex
          )}
          frame={frame}
          index={fullscreenIndex}
        />
      )}

      {/* MUSIC */}
      {musicSrc && (
        <MusicPlayer
          src={musicSrc}
          volume={music?.volume ?? 1}
        />
      )}
    </AbsoluteFill>
  );
};

export default Template37;