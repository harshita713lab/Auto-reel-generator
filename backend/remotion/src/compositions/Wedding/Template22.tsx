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
  "Dil ka shehar tu hai",
  "Achhi khabar tu hai",
  "Fursat ki hasi tu hai",
  "Jo bhi thi kami, tu hai",
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
  // Frames: 0 - 60
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
  // Frames: 60 - 120
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
  // Frames: 120 - 180
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
  // Frames: 180 - 240
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
    // 0 - 2 sec
    currentImage = images[0]?.path || "";
    currentText = TEXTS[0];
    currentZoom = zoom1;
  } else if (frame < 120) {
    // 2 - 4 sec
    currentImage = images[1]?.path || "";
    currentText = TEXTS[1];
    currentZoom = zoom2;
  } else if (frame < 180) {
    // 4 - 6 sec
    currentImage = images[2]?.path || "";
    currentText = TEXTS[2];
    currentZoom = zoom3;
  } else {
    // 6 - 8 sec
    currentImage = images[3]?.path || "";
    currentText = TEXTS[3];
    currentZoom = zoom4;
  }

  // ====================================================
  // TEXT FADE
  // Every image gets its own 2-second animation
  // ====================================================

  const localFrame = frame % 60;

  const textOpacity = interpolate(
    localFrame,
    [0, 5, 52, 60],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // TEXT SLIGHT MOVEMENT
  // ====================================================

  const textY = interpolate(
    localFrame,
    [0, 8, 52, 60],
    [8, 0, 0, -4],
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
        backgroundColor: "black",
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

            transform: `scale(${currentZoom})`,
          }}
        />
      )}

      {/* ==================================================
          WARM CINEMATIC OVERLAY
      ================================================== */}

      <AbsoluteFill
        style={{
          background: "rgba(80, 45, 30, 0.10)",
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

          transform: `translateY(${textY}px)`,

          pointerEvents: "none",
        }}
      >
        <div
          style={{
            color: "#ffffff",

            fontSize: 40,

            fontWeight: 400,

            fontFamily:
              "Georgia, 'Times New Roman', serif",

            fontStyle: "italic",

            textAlign: "center",

            letterSpacing: "0.8px",

            lineHeight: 1.25,

            textShadow:
              "0px 2px 5px rgba(0,0,0,0.55)",

            background: "transparent",

            padding: 0,
          }}
        >
          {currentText}
        </div>
      </AbsoluteFill>

      {/* ==================================================
          VIGNETTE
      ================================================== */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          background:
            "radial-gradient(" +
            "ellipse at center, " +
            "transparent 50%, " +
            "rgba(0,0,0,0.25) 100%" +
            ")",
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