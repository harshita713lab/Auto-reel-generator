import React from "react";
import {
  AbsoluteFill,
  Img,
  Audio,
  useCurrentFrame,
  interpolate,
} from "remotion";

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
}

interface Music {
  path: string;
  volume?: number;
}

interface Template22Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// SETTINGS
// ======================================================

export const IMAGE_COUNT = 4;

export const FPS = 30;

// 8 seconds = 240 frames
export const DURATION_IN_FRAMES = 240;

// ======================================================
// TEXT
// ======================================================

const TEXTS = [
  "दिल ka shehar tu hai❤️",
  "Achhi ख़बर tu hai🥰",
  "फ़ुर्सत ki hasi tu hai🤗",
  "Jo bhi thi कमी, tu hai❤️",
];

// ======================================================
// MAIN COMPOSITION
// ======================================================

export const Template22: React.FC<Template22Props> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();

  // ====================================================
  // IMAGE 1
  // 0 - 2 SEC
  // ====================================================

  const image1Progress = interpolate(
    frame,
    [0, 60],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const zoom1 = interpolate(
    image1Progress,
    [0, 1],
    [1, 1.10]
  );

  // ====================================================
  // IMAGE 2
  // 2 - 4 SEC
  // ====================================================

  const image2Progress = interpolate(
    frame,
    [60, 120],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const zoom2 = interpolate(
    image2Progress,
    [0, 1],
    [1, 1.10]
  );

  // ====================================================
  // IMAGE 3
  // 4 - 6 SEC
  // ====================================================

  const image3Progress = interpolate(
    frame,
    [120, 180],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const zoom3 = interpolate(
    image3Progress,
    [0, 1],
    [1, 1.10]
  );

  // ====================================================
  // IMAGE 4
  // 6 - 8 SEC
  // ====================================================

  const image4Progress = interpolate(
    frame,
    [180, 240],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const zoom4 = interpolate(
    image4Progress,
    [0, 1],
    [1, 1.10]
  );

  // ====================================================
  // CURRENT IMAGE / TEXT / ZOOM
  // ====================================================

  let currentImage = "";
  let currentText = "";
  let currentZoom = 1;

  if (frame < 60) {
    currentImage = images[0]?.path || "";
    currentText = TEXTS[0];
    currentZoom = zoom1;
  } else if (frame < 120) {
    currentImage = images[1]?.path || "";
    currentText = TEXTS[1];
    currentZoom = zoom2;
  } else if (frame < 180) {
    currentImage = images[2]?.path || "";
    currentText = TEXTS[2];
    currentZoom = zoom3;
  } else {
    currentImage = images[3]?.path || "";
    currentText = TEXTS[3];
    currentZoom = zoom4;
  }

  // ====================================================
  // LOCAL FRAME
  // Every image = 60 frames
  // ====================================================

  const localFrame = frame % 60;

  // ====================================================
  // TEXT FADE
  // ====================================================

  const textOpacity = interpolate(
    localFrame,
    [0, 5, 48, 60],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // TEXT MOVEMENT
  // ====================================================

  const textY = interpolate(
    localFrame,
    [0, 8, 48, 60],
    [12, 0, 0, -8],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // TEXT SCALE
  // Small cinematic appearance
  // ====================================================

  const textScale = interpolate(
    localFrame,
    [0, 10, 48, 60],
    [0.92, 1, 1, 0.97],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // FLASH EFFECT
  //
  // Flash happens around every image change.
  // Very soft so it doesn't look like a harsh transition.
  // ====================================================

  const flashIn = interpolate(
    localFrame,
    [0, 2, 7],
    [0.38, 0.16, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // LIGHT LEAK
  // ====================================================

  const lightLeakOpacity = interpolate(
    localFrame,
    [0, 12, 35, 60],
    [0.18, 0.08, 0.05, 0.12],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const lightLeakX = interpolate(
    localFrame,
    [0, 60],
    [-25, 25],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // SOFT IMAGE FADE
  // ====================================================

  const imageOpacity = interpolate(
    localFrame,
    [0, 5, 60],
    [0, 1, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // IMAGE SLIGHT MOTION
  // Keeps zoom but adds tiny cinematic movement
  // ====================================================

  const imageMoveX = interpolate(
    localFrame,
    [0, 60],
    [-5, 5],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // WARMTH
  // ====================================================

  const warmOpacity = interpolate(
    localFrame,
    [0, 30, 60],
    [0.08, 0.12, 0.10],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >

      {/* ==================================================
          CURRENT IMAGE
      ================================================== */}

      {currentImage && (
        <Img
          src={currentImage}
          style={{
            position: "absolute",
            inset: 0,

            width: "100%",
            height: "100%",

            objectFit: "cover",

            opacity: imageOpacity,

            transform: `
              translateX(${imageMoveX}px)
              scale(${currentZoom})
            `,

            transformOrigin: "center center",

            display: "block",
          }}
        />
      )}

      {/* ==================================================
          WARM CINEMATIC COLOR
      ================================================== */}

      <AbsoluteFill
        style={{
          background:
            `rgba(80, 45, 30, ${warmOpacity})`,

          pointerEvents: "none",
        }}
      />

      {/* ==================================================
          SOFT PINK GLOW
      ================================================== */}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(" +
            "circle at 50% 45%, " +
            "rgba(255,220,230,0.16), " +
            "transparent 60%" +
            ")",

          pointerEvents: "none",
        }}
      />

      {/* ==================================================
          LIGHT LEAK
      ================================================== */}

      <div
        style={{
          position: "absolute",

          top: "-20%",
          left: `${lightLeakX}%`,

          width: "75%",
          height: "140%",

          background:
            "linear-gradient(" +
            "115deg, " +
            "transparent 20%, " +
            "rgba(255,190,205,0.13) 45%, " +
            "rgba(255,245,240,0.10) 52%, " +
            "transparent 75%" +
            ")",

          filter: "blur(35px)",

          opacity: lightLeakOpacity,

          transform: "rotate(8deg)",

          pointerEvents: "none",
        }}
      />

      {/* ==================================================
          TEXT
      ================================================== */}

      <AbsoluteFill
        style={{
          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          opacity: textOpacity,

          transform:
            `translateY(${textY}px) scale(${textScale})`,

          pointerEvents: "none",

          padding: "0 70px",

          zIndex: 10,
        }}
      >
        <div
          style={{
            color: "#fffafc",

            fontSize: 52,

            fontWeight: 400,

            fontFamily:
              "'Brush Script MT', 'Segoe Script', 'Lucida Handwriting', cursive",

            fontStyle: "normal",

            textAlign: "center",

            letterSpacing: "1px",

            lineHeight: 1.3,

            textShadow:
              "0px 3px 8px rgba(0,0,0,0.55), " +
              "0px 0px 18px rgba(255,220,230,0.25)",

            background: "transparent",

            padding: 0,

            maxWidth: 900,
          }}
        >
          {currentText}
        </div>
      </AbsoluteFill>

      {/* ==================================================
          HEART DECORATION
          Small subtle hearts around text
      ================================================== */}

      <div
        style={{
          position: "absolute",

          left: "50%",
          top: "58%",

          transform: "translateX(-50%)",

          color: "rgba(255,225,235,0.75)",

          fontSize: 22,

          opacity: textOpacity * 0.8,

          zIndex: 11,

          pointerEvents: "none",

          textShadow:
            "0 2px 6px rgba(0,0,0,0.4)",
        }}
      >
        ♡
      </div>

      {/* ==================================================
          FLASH
      ================================================== */}

      <AbsoluteFill
        style={{
          backgroundColor: "#fff",

          opacity: flashIn,

          pointerEvents: "none",

          zIndex: 20,
        }}
      />

      {/* ==================================================
          SOFT VIGNETTE
      ================================================== */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          background:
            "radial-gradient(" +
            "ellipse at center, " +
            "transparent 45%, " +
            "rgba(0,0,0,0.30) 100%" +
            ")",

          zIndex: 30,
        }}
      />

      {/* ==================================================
          FILM GRAIN
          Very subtle
      ================================================== */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          opacity: 0.055,

          zIndex: 40,

          backgroundImage:
            "url(\"data:image/svg+xml," +
            "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>" +
            "<filter id='n'>" +
            "<feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/>" +
            "</filter>" +
            "<rect width='100%' height='100%' filter='url(%23n)' opacity='.35'/>" +
            "</svg>\")",

          mixBlendMode: "soft-light",
        }}
      />

      {/* ==================================================
          MUSIC
      ================================================== */}

      {music?.path && (
        <Audio
          src={music.path}
          volume={music.volume ?? 1}
        />
      )}

    </AbsoluteFill>
  );
};

export default Template22;