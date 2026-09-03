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
  path: string;
  volume?: number;
}

interface SingleImageLyricReelProps {
  images?: ImageItem[];
  music?: Music | string;
}

// ======================================================
// CONFIG
// ======================================================

export const FPS = 30;
export const IMAGE_COUNT = 1;
export const DURATION_IN_FRAMES = 380;

// ======================================================
// LYRIC TIMELINE
// ======================================================

interface LyricSegment {
  text: string[];
  startFrame: number;
  endFrame: number;
}

const LYRIC_TIMELINE: LyricSegment[] = [
  {
    text: ["MY", "LAST", "WISH"],
    startFrame: 0,
    endFrame: 75,
  },
  {
    text: ["HAI", "TAMANNA", "HUME"],
    startFrame: 75,
    endFrame: 150,
  },
  {
    text: ["TUMHE", "DULHAN", "BANAYE"],
    startFrame: 150,
    endFrame: 225,
  },
  {
    text: ["TERE", "HATHO", "PE", "MEHNDI"],
    startFrame: 225,
    endFrame: 300,
  },
  {
    text: ["APNE", "NAAM", "KI", "SAJYE"],
    startFrame: 300,
    endFrame: 380,
  },
];

// ======================================================
// CLAMP
// ======================================================

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// IMAGE HELPER
// ======================================================

const getImgSrc = (
  images: ImageItem[],
  index: number
): string => {
  if (!images || images.length === 0) {
    return "";
  }

  const actualIndex = index % images.length;

  return (
    images[actualIndex]?.url ||
    images[actualIndex]?.path ||
    ""
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

export const SingleImageLyricReel: React.FC<
  SingleImageLyricReelProps
> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ====================================================
  // IMAGE
  // ====================================================

  const activeImage = getImgSrc(images, 0);

  // ====================================================
  // MUSIC
  // ====================================================

  const musicSrc =
    typeof music === "string"
      ? music
      : music?.path;

  // ====================================================
  // NO IMAGE
  // ====================================================

  if (!activeImage) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#070405",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: 30,
            fontFamily: "Arial, sans-serif",
          }}
        >
          Image not found
        </div>
      </AbsoluteFill>
    );
  }

  // ====================================================
  // CURRENT LYRIC
  // ====================================================

  const currentLyricIndex =
    LYRIC_TIMELINE.findIndex(
      (item) =>
        frame >= item.startFrame &&
        frame < item.endFrame
    );

  const activeSegment =
    currentLyricIndex !== -1
      ? LYRIC_TIMELINE[currentLyricIndex]
      : LYRIC_TIMELINE[
          LYRIC_TIMELINE.length - 1
        ];

  const frameInSegment =
    frame - activeSegment.startFrame;

  // ====================================================
  // TEXT SPRING
  // ====================================================

  const textSpring = spring({
    frame: frameInSegment,
    fps,

    config: {
      damping: 13,
      stiffness: 130,
      mass: 0.8,
    },
  });

  // ====================================================
  // IMAGE ZOOM
  // ====================================================

  const imageScale = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [1.05, 1.14],
    CLAMP
  );

  // ====================================================
  // IMAGE HORIZONTAL MOTION
  // ====================================================

  const imageX = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [-8, 8],
    CLAMP
  );

  // ====================================================
  // IMAGE VERTICAL MOTION
  // ====================================================

  const imageY = interpolate(
    frame,
    [0, 190, 380],
    [4, -3, 4],
    CLAMP
  );

  // ====================================================
  // IMAGE ROTATION
  // ====================================================

  const imageRotation = interpolate(
    frame,
    [0, 95, 190, 285, 380],
    [-0.8, 0.2, 0.6, 0, -0.6],
    CLAMP
  );

  // ====================================================
  // IMAGE BRIGHTNESS
  // ====================================================

  const imageBrightness = interpolate(
    frame,
    [0, 70, 190, 300, 380],
    [0.88, 0.98, 1, 0.94, 0.9],
    CLAMP
  );

  // ====================================================
  // IMAGE CONTRAST
  // ====================================================

  const imageContrast = interpolate(
    frame,
    [0, 190, 380],
    [1.08, 1.12, 1.08],
    CLAMP
  );

  // ====================================================
  // IMAGE SATURATION
  // ====================================================

  const imageSaturation = interpolate(
    frame,
    [0, 190, 380],
    [1.05, 1.15, 1.08],
    CLAMP
  );

  // ====================================================
  // ⭐ BLACK & WHITE OPENING EFFECT
  //
  // 0 - 45 frames  = FULL B&W
  // 45 - 60 frames = B&W -> COLOR
  // 60+             = FULL COLOR
  //
  // 30 FPS:
  // 60 frames = exactly 2 seconds
  // ====================================================

  const grayscaleAmount = interpolate(
    frame,
    [0, 45, 60],
    [1, 1, 0],
    CLAMP
  );

  // ====================================================
  // MOVING LIGHT
  // ====================================================

  const lightX = interpolate(
    frame,
    [0, 190, 380],
    [15, 80, 20],
    CLAMP
  );

  const lightY = interpolate(
    frame,
    [0, 190, 380],
    [20, 60, 35],
    CLAMP
  );

  const lightOpacity = interpolate(
    frame,
    [0, 190, 380],
    [0.08, 0.16, 0.09],
    CLAMP
  );

  // ====================================================
  // TEXT FADE
  // ====================================================

  const textOpacity = interpolate(
    frameInSegment,
    [0, 5, 12],
    [0, 0.7, 1],
    CLAMP
  );

  // ====================================================
  // TEXT MOVEMENT
  // ====================================================

  const textTranslateY = interpolate(
    frameInSegment,
    [0, 12],
    [18, 0],
    CLAMP
  );

  // ====================================================
  // TEXT SCALE
  // ====================================================

  const textScale = interpolate(
    textSpring,
    [0, 1],
    [0.92, 1],
    CLAMP
  );

  // ====================================================
  // FIXED DECORATION ANIMATION
  // ====================================================

  const decorationFloat1 =
    Math.sin(frame * 0.035) * 5;

  const decorationFloat2 =
    Math.sin(frame * 0.04 + 2) * 6;

  const decorationFloat3 =
    Math.sin(frame * 0.03 + 4) * 4;

  const decorationPulse =
    0.62 +
    Math.sin(frame * 0.045) * 0.12;

  // ====================================================
  // DECORATION FADE ONLY ONCE
  // ====================================================

  const decorationOpacity = interpolate(
    frame,
    [0, 15, 35],
    [0, 0.4, 0.82],
    CLAMP
  );

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#110906",
        overflow: "hidden",
        position: "relative",
      }}
    >

      {/* =================================================
          BACKGROUND BLUR
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

            filter:
              "blur(35px) brightness(0.35) saturate(1.25)",

            transform: "scale(1.18)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,

            background:
              "rgba(30,15,8,0.48)",
          }}
        />

      </AbsoluteFill>


      {/* =================================================
          MAIN PHOTO
      ================================================= */}

      <AbsoluteFill
        style={{
          zIndex: 5,
          overflow: "hidden",
        }}
      >

        {/* MAIN IMAGE */}

        <Img
          src={activeImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",

            transform: `
              translate(${imageX}px, ${imageY}px)
              scale(${imageScale})
              rotate(${imageRotation}deg)
            `,

            /*
             * ⭐ IMPORTANT:
             * grayscale is added here.
             *
             * First 1.5 sec = B&W
             * 1.5 - 2 sec = smooth color transition
             * After 2 sec = full color
             */

            filter: `
              grayscale(${grayscaleAmount})
              brightness(${imageBrightness})
              contrast(${imageContrast})
              saturate(${imageSaturation})
            `,
          }}
        />


        {/* =================================================
            MOVING SOFT LIGHT
        ================================================= */}

        <div
          style={{
            position: "absolute",
            inset: 0,

            background: `
              radial-gradient(
                circle at ${lightX}% ${lightY}%,
                rgba(255,255,255,${lightOpacity}) 0%,
                rgba(255,220,190,0.06) 20%,
                transparent 55%
              )
            `,

            mixBlendMode: "screen",

            pointerEvents: "none",

            zIndex: 2,
          }}
        />


        {/* =================================================
            WARM CINEMATIC COLOR
        ================================================= */}

        <div
          style={{
            position: "absolute",
            inset: 0,

            background:
              "linear-gradient(135deg, rgba(90,30,10,0.12), transparent 45%, rgba(20,5,2,0.18))",

            pointerEvents: "none",

            zIndex: 3,
          }}
        />


        {/* =================================================
            CENTER VIGNETTE
        ================================================= */}

        <div
          style={{
            position: "absolute",
            inset: 0,

            background: `
              radial-gradient(
                ellipse at center,
                transparent 42%,
                rgba(0,0,0,0.12) 62%,
                rgba(0,0,0,0.62) 100%
              )
            `,

            pointerEvents: "none",

            zIndex: 4,
          }}
        />


        {/* =================================================
            TOP CINEMATIC BAR
        ================================================= */}

        <div
          style={{
            position: "absolute",

            top: 0,
            left: 0,
            right: 0,

            height: 65,

            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.62), transparent)",

            pointerEvents: "none",
            zIndex: 5,
          }}
        />


        {/* =================================================
            BOTTOM CINEMATIC BAR
        ================================================= */}

        <div
          style={{
            position: "absolute",

            bottom: 0,
            left: 0,
            right: 0,

            height: 90,

            background:
              "linear-gradient(to top, rgba(0,0,0,0.78), transparent)",

            pointerEvents: "none",
            zIndex: 5,
          }}
        />


        {/* =================================================
            SOFT WHITE BORDER
        ================================================= */}

        <div
          style={{
            position: "absolute",
            inset: 18,

            border:
              "1px solid rgba(255,255,255,0.20)",

            pointerEvents: "none",
            zIndex: 6,
          }}
        />


        {/* =================================================
            FINAL CINEMATIC OVERLAY
        ================================================= */}

        <div
          style={{
            position: "absolute",
            inset: 0,

            background:
              "linear-gradient(180deg, rgba(40,15,5,0.42) 0%, rgba(0,0,0,0.02) 32%, rgba(0,0,0,0.08) 65%, rgba(25,10,2,0.55) 100%)",

            pointerEvents: "none",
            zIndex: 7,
          }}
        />

      </AbsoluteFill>


      {/* =================================================
          LEFT DARK GRADIENT
      ================================================= */}

      <AbsoluteFill
        style={{
          zIndex: 6,

          background:
            "linear-gradient(90deg, rgba(0,0,0,0.22) 0%, transparent 55%, rgba(0,0,0,0.10) 100%)",

          pointerEvents: "none",
        }}
      />


      {/* =================================================
          FIXED LEFT SIDE DECORATION
      ================================================= */}

      <div
        style={{
          position: "absolute",

          left: 82,
          top: "25%",

          zIndex: 11,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,

          opacity: decorationOpacity,

          pointerEvents: "none",
        }}
      >

        {/* STAR */}

        <div
          style={{
            color: "#ffffff",
            fontSize: 21,

            transform: `
              translateY(${decorationFloat1}px)
              rotate(${frame * 0.15}deg)
            `,

            textShadow:
              "0 0 8px rgba(255,255,255,0.9), 0 0 18px rgba(255,255,255,0.45)",
          }}
        >
          ✦
        </div>


        {/* HEART */}

        <div
          style={{
            color: "#ffffff",
            fontSize: 25,

            transform: `
              translateY(${decorationFloat2}px)
              scale(${0.96 + Math.sin(frame * 0.045) * 0.04})
            `,

            opacity: decorationPulse,

            fontFamily: "Georgia, serif",

            textShadow:
              "0 0 10px rgba(255,255,255,0.9)",
          }}
        >
          ♡
        </div>


        {/* LINE */}

        <div
          style={{
            width: 1,
            height: 48,

            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.65), transparent)",
          }}
        />


        {/* SMALL STAR */}

        <div
          style={{
            color: "#ffffff",
            fontSize: 13,

            transform: `
              translateY(${decorationFloat3}px)
            `,

            textShadow:
              "0 0 8px rgba(255,255,255,0.9)",
          }}
        >
          ✧
        </div>

      </div>


      {/* =================================================
          FIXED RIGHT SIDE DECORATION
      ================================================= */}

      <div
        style={{
          position: "absolute",

          right: 82,
          top: "25%",

          zIndex: 11,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,

          opacity: decorationOpacity,

          pointerEvents: "none",
        }}
      >

        {/* SMALL STAR */}

        <div
          style={{
            color: "#ffffff",
            fontSize: 13,

            transform: `
              translateY(${-decorationFloat3}px)
            `,

            textShadow:
              "0 0 8px rgba(255,255,255,0.9)",
          }}
        >
          ✧
        </div>


        {/* LINE */}

        <div
          style={{
            width: 1,
            height: 48,

            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.65), transparent)",
          }}
        />


        {/* HEART */}

        <div
          style={{
            color: "#ffffff",
            fontSize: 25,

            transform: `
              translateY(${-decorationFloat2}px)
              scale(${0.96 + Math.sin(frame * 0.045) * 0.04})
            `,

            opacity: decorationPulse,

            fontFamily: "Georgia, serif",

            textShadow:
              "0 0 10px rgba(255,255,255,0.9)",
          }}
        >
          ♡
        </div>


        {/* STAR */}

        <div
          style={{
            color: "#ffffff",
            fontSize: 21,

            transform: `
              translateY(${-decorationFloat1}px)
              rotate(${frame * -0.15}deg)
            `,

            textShadow:
              "0 0 8px rgba(255,255,255,0.9)",
          }}
        >
          ✦
        </div>

      </div>


      {/* =================================================
          FLOATING SMALL STAR - LEFT TOP
      ================================================= */}

      <div
        style={{
          position: "absolute",

          left: "17%",
          top: "17%",

          zIndex: 11,

          color: "#ffffff",
          fontSize: 12,

          opacity:
            0.32 +
            Math.sin(frame * 0.045) * 0.15,

          transform: `
            translateY(${Math.sin(frame * 0.035) * 7}px)
            rotate(${frame * 0.2}deg)
          `,

          textShadow:
            "0 0 10px rgba(255,255,255,0.9)",

          pointerEvents: "none",
        }}
      >
        ✦
      </div>


      {/* =================================================
          FLOATING SMALL STAR - RIGHT
      ================================================= */}

      <div
        style={{
          position: "absolute",

          right: "17%",
          top: "39%",

          zIndex: 11,

          color: "#ffffff",
          fontSize: 10,

          opacity:
            0.28 +
            Math.sin(frame * 0.04 + 2) * 0.16,

          transform: `
            translateY(${Math.sin(frame * 0.04 + 2) * 8}px)
          `,

          textShadow:
            "0 0 10px rgba(255,255,255,0.9)",

          pointerEvents: "none",
        }}
      >
        ✧
      </div>


      {/* =================================================
          FLOATING HEART - LEFT BOTTOM
      ================================================= */}

      <div
        style={{
          position: "absolute",

          left: "20%",
          top: "63%",

          zIndex: 11,

          color: "#ffffff",
          fontSize: 12,

          opacity:
            0.25 +
            Math.sin(frame * 0.035 + 4) * 0.15,

          transform: `
            translateY(${Math.sin(frame * 0.03 + 4) * 6}px)
          `,

          textShadow:
            "0 0 10px rgba(255,255,255,0.9)",

          pointerEvents: "none",
        }}
      >
        ♡
      </div>


      {/* =================================================
          FLOATING STAR - RIGHT BOTTOM
      ================================================= */}

      <div
        style={{
          position: "absolute",

          right: "20%",
          top: "68%",

          zIndex: 11,

          color: "#ffffff",
          fontSize: 14,

          opacity:
            0.25 +
            Math.sin(frame * 0.05 + 1) * 0.15,

          transform: `
            translateY(${Math.sin(frame * 0.035 + 1) * 8}px)
            rotate(${frame * -0.15}deg)
          `,

          textShadow:
            "0 0 10px rgba(255,255,255,0.9)",

          pointerEvents: "none",
        }}
      >
        ✦
      </div>


      {/* =================================================
          LYRIC TEXT
      ================================================= */}

      <div
        style={{
          position: "absolute",

          left: "50%",
          top: "25%",

          width: "72%",

          zIndex: 12,

          display: "flex",
          flexDirection: "column",

          gap: 5,

          opacity: textOpacity,

          transform: `
            translate(
              -50%,
              calc(-50% + ${textTranslateY}px)
            )
            scale(${textScale})
          `,

          transformOrigin: "center center",

          alignItems: "center",
        }}
      >

        {/* WORDS */}

        {activeSegment.text.map(
          (line, index) => (
            <div
              key={`${line}-${index}`}
              style={{
                fontFamily:
                  "'Times New Roman', Georgia, serif",

                fontSize:
                  activeSegment.text.length > 3
                    ? 56
                    : 64,

                fontWeight: 900,

                color: "#ffffff",

                letterSpacing: "4px",

                lineHeight: 1.05,

                textAlign: "center",

                textTransform: "uppercase",

                textShadow:
                  "3px 3px 0 #000000, 0 5px 14px rgba(0,0,0,0.95), 0 0 20px rgba(255,255,255,0.12)",
              }}
            >
              {line}
            </div>
          )
        )}

      </div>


      {/* =================================================
          TOP CENTER LINE
      ================================================= */}

      <div
        style={{
          position: "absolute",

          top: 48,
          left: "50%",

          width: 90,
          height: 1,

          transform:
            "translateX(-50%)",

          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",

          zIndex: 10,

          opacity: 0.7,
        }}
      />


      {/* =================================================
          INSTAGRAM WATERMARK
      ================================================= */}

      <div
        style={{
          position: "absolute",

          left: 40,
          bottom: 40,

          zIndex: 15,

          opacity: 0.65,

          color: "#ffffff",

          fontFamily:
            "Arial, sans-serif",

          textShadow:
            "0 2px 5px rgba(0,0,0,0.9)",
        }}
      >

        <div
          style={{
            fontSize: 11,
            letterSpacing: 2,
            fontWeight: 600,
          }}
        >
          INSTA
        </div>

        <div
          style={{
            fontSize: 13,
            letterSpacing: 1,
            fontWeight: 700,
            marginTop: 2,
          }}
        >
          JUST__RUHHHHYYY
        </div>

      </div>


      {/* =================================================
          MUSIC
      ================================================= */}

      {musicSrc && (
        <MusicPlayer
          src={musicSrc}
          volume={
            typeof music === "object"
              ? music?.volume ?? 1
              : 1
          }
        />
      )}

    </AbsoluteFill>
  );
};

export default SingleImageLyricReel;