import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

import { MusicPlayer } from "../../components";

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path?: string;
  url?: string;
}

interface Music {
  path?: string;
  volume?: number;
}

interface GoralKunalReelProps {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIG
// ======================================================

export const FPS = 30;
export const IMAGE_COUNT = 1;
export const DURATION_IN_FRAMES = 380;

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// IMAGE HELPER
// ======================================================

const getImgSrc = (images: ImageItem[]): string => {
  if (!images || images.length === 0) {
    return "";
  }

  return images[0]?.url || images[0]?.path || "";
};

// ======================================================
// MAIN COMPONENT
// ======================================================

export const GoralKunalReel: React.FC<GoralKunalReelProps> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeImage = getImgSrc(images);

  // ======================================================
  // MUSIC
  // ======================================================

  const musicSrc = music?.path || "";

  // ======================================================
  // IMAGE NOT FOUND
  // ======================================================

  if (!activeImage) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#fff5f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "#8b4513",
            fontSize: 28,
            fontFamily: "Georgia, serif",
          }}
        >
          Wedding Image Not Found
        </div>
      </AbsoluteFill>
    );
  }

  // ======================================================
  // IMAGE KEN BURNS
  // ======================================================

  const imageScale = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [1.0, 1.12],
    CLAMP
  );

  const imageX = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [0, 15],
    CLAMP
  );

  // ======================================================
  // TITLE ANIMATION
  // ======================================================

  const titleSpring = spring({
    frame,
    fps,
    config: {
      damping: 16,
      stiffness: 90,
      mass: 0.7,
    },
  });

  // Smooth fade in
  const titleOpacity = interpolate(
    frame,
    [0, 8, 24, 55],
    [0, 0.2, 0.85, 1],
    CLAMP
  );

  // Upward movement
  const titleY = interpolate(
    frame,
    [0, 30],
    [45, 0],
    CLAMP
  );

  // Elegant scale entrance
  const titleScale = interpolate(
    titleSpring,
    [0, 1],
    [0.94, 1],
    CLAMP
  );

  // Slight letter-spacing animation
  const letterSpacing = interpolate(
    frame,
    [0, 35],
    [8, 4],
    CLAMP
  );

  // Subtle glow
  const glowOpacity = interpolate(
    frame,
    [0, 25, 55],
    [0, 0.35, 0.15],
    CLAMP
  );

  // ======================================================
  // DECORATIVE HEARTS + STARS ANIMATION
  // ======================================================

  const decorFloat1 = Math.sin(frame * 0.055) * 5;
  const decorFloat2 = Math.sin(frame * 0.045 + 1.5) * 6;
  const decorFloat3 = Math.sin(frame * 0.065 + 3) * 4;

  const decorPulse = 0.85 + Math.sin(frame * 0.08) * 0.15;

  const decorOpacity = interpolate(
    frame,
    [10, 30, 60],
    [0, 0.7, 0.9],
    CLAMP
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#fdfbf7",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* =================================================
          BACKGROUND BLUR / GLOW
      ================================================= */}

      <AbsoluteFill
        style={{
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <Img
          src={activeImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(40px) brightness(0.6) saturate(1.2)",
            transform: "scale(1.2)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255, 245, 235, 0.25)",
          }}
        />
      </AbsoluteFill>

      {/* =================================================
          MAIN IMAGE
      ================================================= */}

      <AbsoluteFill
        style={{
          zIndex: 5,
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Img
          src={activeImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",

            transform: `
              translateX(${imageX}px)
              scale(${imageScale})
            `,

            filter:
              "brightness(1.02) contrast(1.05) saturate(1.08)",
          }}
        />

        {/* Cinematic Overlay */}

        <div
          style={{
            position: "absolute",
            inset: 0,

            background:
              "linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.12) 32%, rgba(0,0,0,0.05) 65%, rgba(0,0,0,0.58) 100%)",

            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>

      {/* =================================================
          MAIN TITLE
      ================================================= */}

      <div
        style={{
          position: "absolute",

          // Moved slightly upward
          top: "9%",

          left: "40%",

          width: "96%",

          zIndex: 20,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",

          opacity: titleOpacity,

          transform: `
            translate(-50%, ${titleY}px)
            scale(${titleScale})
          `,

          transformOrigin: "center center",
        }}
      >
        {/* =================================================
            LEFT DECORATION
        ================================================= */}

        <div
          style={{
            position: "absolute",
            left: "20%",
            top: "42%",

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 5,

            color: "#ffffff",

            opacity: decorOpacity,

            transform: `
              translateY(${decorFloat1}px)
              scale(${decorPulse})
            `,

            textShadow:
              "0 2px 8px rgba(0,0,0,0.7)",
          }}
        >
          <div
            style={{
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ✦
          </div>

          <div
            style={{
              fontSize: 20,
              lineHeight: 1,
              transform: `translateY(${decorFloat2}px)`,
            }}
          >
            ♡
          </div>

          <div
            style={{
              fontSize: 13,
              lineHeight: 1,
            }}
          >
            ✧
          </div>
        </div>

        {/* =================================================
            RIGHT DECORATION
        ================================================= */}

        

        {/* =================================================
            SMALL DECORATIVE LINE
        ================================================= */}

        <div
          style={{
            width: 55,
            height: 1,

            marginBottom: 18,

            background:
              "rgba(255,255,255,0.85)",

            opacity: titleOpacity,
          }}
        />

        {/* =================================================
            TITLE LINE 1
        ================================================= */}

        <div
          style={{
            fontFamily:
              "'Times New Roman', Georgia, serif",

            fontSize: 45,

            fontWeight: 500,

            color: "#ffffff",

            letterSpacing: `${letterSpacing}px`,

            lineHeight: 1.15,

            textAlign: "center",

            textTransform: "uppercase",

            textShadow:
              "0 2px 5px rgba(0,0,0,0.8), 0 5px 18px rgba(0,0,0,0.65)",

            whiteSpace: "nowrap",
          }}
        >
          WHEN THE LYRICS
        </div>

        {/* =================================================
            TITLE LINE 2
        ================================================= */}

        <div
          style={{
            fontFamily:
              "'Times New Roman', Georgia, serif",

            fontSize: 45,

            fontWeight: 700,

            color: "#ffffff",

            letterSpacing: `${letterSpacing}px`,

            lineHeight: 1.15,

            textAlign: "center",

            textTransform: "uppercase",

            textShadow:
              "0 2px 5px rgba(0,0,0,0.8), 0 5px 18px rgba(0,0,0,0.65)",

            whiteSpace: "nowrap",
          }}
        >
          TURN INTO REALITY
        </div>

        {/* =================================================
            SOFT GLOW BEHIND TITLE
        ================================================= */}

        <div
          style={{
            position: "absolute",

            width: 380,
            height: 120,

            top: 20,

            borderRadius: "50%",

            background:
              "rgba(255,220,180,0.18)",

            filter: "blur(35px)",

            opacity: glowOpacity,

            zIndex: -1,
          }}
        />
      </div>

      {/* =================================================
          BOTTOM NAME
      ================================================= */}

      <div
        style={{
          position: "absolute",

          left: "50%",
          bottom: 48,

          transform: "translateX(-50%)",

          zIndex: 20,

          textAlign: "center",

          opacity: interpolate(
            frame,
            [20, 45, 75],
            [0, 0.5, 0.9],
            CLAMP
          ),
        }}
      >
        <div
          style={{
            fontFamily:
              "'Times New Roman', Georgia, serif",

            fontSize: 13,

            color: "#ffffff",

            letterSpacing: 4,

            fontWeight: 600,

            textTransform: "uppercase",

            textShadow:
              "0 2px 8px rgba(0,0,0,0.9)",
          }}
        >
          GORAL & KUNAL
        </div>

        <div
          style={{
            width: 35,
            height: 1,

            background:
              "rgba(255,255,255,0.8)",

            margin: "10px auto 0",
          }}
        />
      </div>

      {/* =================================================
          MUSIC
      ================================================= */}

      {musicSrc && (
        <MusicPlayer
          src={musicSrc}
          volume={music?.volume ?? 1}
        />
      )}
    </AbsoluteFill>
  );
};

export default GoralKunalReel;