import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

// ======================================================
// CONFIG & TYPES
// ======================================================

export const IMAGE_COUNT = 1;
export const FPS = 30;
export const DURATION_IN_FRAMES = 270; // ~9 seconds

interface ImageItem {
  path: string;
}

interface SceneProps {
  images?: ImageItem[];
}

// ======================================================
// DEFAULT IMAGE
// ======================================================

const DEFAULT_IMAGE: ImageItem = {
  path: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
};

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const smooth = Easing.bezier(0.22, 1, 0.36, 1);

// ======================================================
// MAIN COMPONENT
// 1 IMAGE → SAME IMAGE REPEATED 3 TIMES
// ======================================================

export const ThreeImageStackedReel: React.FC<SceneProps> = ({
  images,
}) => {
  const frame = useCurrentFrame();

  // Only ONE image is required
  const currentImage =
    images && images.length > 0
      ? images[0]
      : DEFAULT_IMAGE;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0d0d",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 15px",
      }}
    >

      {/* ==================================================
          IMAGE 1
      ================================================== */}

      <StackedPhoto
        image={currentImage}
        startFrame={0}
        currentFrame={frame}
        textTop="Humse maayus hoga zamana"
        textDelay={10}
      />

      {/* ==================================================
          IMAGE 2
          SAME IMAGE REPEATED
      ================================================== */}

      <StackedPhoto
        image={currentImage}
        startFrame={120}
        currentFrame={frame}
        textTop="Par"
        textDelay={130}
      />

      {/* ==================================================
          IMAGE 3
          SAME IMAGE REPEATED
      ================================================== */}

      <StackedPhoto
        image={currentImage}
        startFrame={160}
        currentFrame={frame}
        textTop="Zamane ki kisiko padi hai"
        textDelay={170}
      />

    </AbsoluteFill>
  );
};

// ======================================================
// STACKED PHOTO
// ======================================================

interface StackedPhotoProps {
  image: ImageItem;
  startFrame: number;
  currentFrame: number;
  textTop: string;
  textDelay: number;
}

const StackedPhoto: React.FC<StackedPhotoProps> = ({
  image,
  startFrame,
  currentFrame,
  textTop,
  textDelay,
}) => {

  const localFrame = Math.max(
    0,
    currentFrame - startFrame
  );

  // ====================================================
  // PHOTO ENTRANCE
  // ====================================================

  const opacity = interpolate(
    localFrame,
    [0, 12],
    [0, 1],
    CLAMP
  );

  const translateY = interpolate(
    localFrame,
    [0, 20],
    [50, 0],
    {
      ...CLAMP,
      easing: smooth,
    }
  );

  const scale = interpolate(
    localFrame,
    [0, 20],
    [0.9, 1],
    {
      ...CLAMP,
      easing: Easing.out(
        Easing.back(1.2)
      ),
    }
  );

  // ====================================================
  // TEXT ANIMATION
  // ====================================================

  const textLocalFrame = Math.max(
    0,
    currentFrame - textDelay
  );

  const textOpacity = interpolate(
    textLocalFrame,
    [0, 10],
    [0, 1],
    CLAMP
  );

  const textY = interpolate(
    textLocalFrame,
    [0, 12],
    [15, 0],
    {
      ...CLAMP,
      easing: smooth,
    }
  );

  // ====================================================
  // DON'T SHOW BEFORE START
  // ====================================================

  if (currentFrame < startFrame) {
    return (
      <div
        style={{
          width: "100%",
          height: "31%",
        }}
      />
    );
  }

  // ====================================================
  // PHOTO
  // ====================================================

  return (
    <div
      style={{
        width: "100%",
        height: "31%",
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",

        boxShadow:
          "0 10px 25px rgba(0,0,0,0.5)",

        opacity,

        transform: `
          translateY(${translateY}px)
          scale(${scale})
        `,
      }}
    >

      {/* ================================================
          IMAGE
      ================================================ */}

      <Img
        src={image.path}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",

          filter:
            "brightness(0.9) contrast(1.05)",
        }}
      />

      {/* ================================================
          DARK GRADIENT
      ================================================ */}

      <div
        style={{
          position: "absolute",
          inset: 0,

          background:
            "linear-gradient(" +
            "to bottom, " +
            "rgba(0,0,0,0.35) 0%, " +
            "transparent 50%, " +
            "rgba(0,0,0,0.4) 100%" +
            ")",

          pointerEvents: "none",
        }}
      />

      {/* ================================================
          TEXT
      ================================================ */}

      <div
        style={{
          position: "absolute",
          inset: 0,

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          opacity: textOpacity,

          transform:
            `translateY(${textY}px)`,

          zIndex: 10,

          padding: "0 20px",

          textAlign: "center",
        }}
      >

        <span
          style={{
            fontFamily:
              "'Playfair Display', 'Georgia', serif",

            fontStyle: "italic",

            fontSize: "26px",

            color: "#ffffff",

            textShadow:
              "0 3px 10px rgba(0,0,0,0.8), " +
              "0 1px 3px rgba(0,0,0,0.6)",

            letterSpacing: "1px",
          }}
        >
          {textTop}
        </span>

      </div>

    </div>
  );
};

export default ThreeImageStackedReel;