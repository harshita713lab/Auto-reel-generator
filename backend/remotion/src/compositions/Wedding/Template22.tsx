import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

// ======================================================
// CONFIG
// ======================================================

export const FPS = 30;
export const IMAGE_COUNT = 4;

// EXACTLY 17 SECONDS
export const DURATION_IN_FRAMES = 510;

// ======================================================
// TIMELINE
// ======================================================

// 0 - 3 sec
const IMAGE_APPEAR_END = 90;

// 3 - 5 sec
const COLLAGE_EFFECT_START = 90;
const COLLAGE_EFFECT_END = 150;

// 5 - 6 sec
const FULLSCREEN_TRANSITION_START = 150;
const FULLSCREEN_START = 180;

// 6 - 17 sec
const FULLSCREEN_DURATIONS = [
  83, // Image 1
  82, // Image 2
  83, // Image 3
  82, // Image 4
];

const TRANSITION_FRAMES = 12;

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
  url?: string;
}

interface TemplateProps {
  images?: ImageItem[];
}

// ======================================================
// DEFAULT IMAGES
// ======================================================

const DEFAULT_IMAGES: ImageItem[] = [
  {
    path:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    path:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
  },
  {
    path:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
  },
  {
    path:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop",
  },
];

// ======================================================
// CLAMP
// ======================================================

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// IMAGE SOURCE
// ======================================================

const getImageSrc = (img: ImageItem) =>
  img.url || img.path;

// ======================================================
// GRID COLLAGE
// ======================================================

const GridCollage: React.FC<{
  images: ImageItem[];
  frame: number;
}> = ({ images, frame }) => {
  // ====================================================
  // 1. WHOLE GRID ENTRANCE
  // ====================================================

  const gridOpacity = interpolate(
    frame,
    [0, 10],
    [0, 1],
    clamp
  );

  const gridEntranceScale = interpolate(
    frame,
    [0, 25],
    [0.92, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ====================================================
  // 2. COLLAGE EFFECT — 3 TO 5 SEC
  // ====================================================

  const effectProgress = interpolate(
    frame,
    [COLLAGE_EFFECT_START, COLLAGE_EFFECT_END],
    [0, 1],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // Slight zoom OUT
  const effectScale = interpolate(
    effectProgress,
    [0, 0.5, 1],
    [1, 0.96, 0.91],
    clamp
  );

  // Slight rotation
  const effectRotation = interpolate(
    effectProgress,
    [0, 0.5, 1],
    [0, -1.5, 0],
    clamp
  );

  // ====================================================
  // 3. COLLAGE → FULLSCREEN
  // ====================================================

  const transitionProgress = interpolate(
    frame,
    [
      FULLSCREEN_TRANSITION_START,
      FULLSCREEN_START,
    ],
    [0, 1],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // Whole collage moves outward
  const gridTransitionScale = interpolate(
    transitionProgress,
    [0, 1],
    [1, 1.22],
    clamp
  );

  const gridTransitionOpacity = interpolate(
    transitionProgress,
    [0, 0.65, 1],
    [1, 1, 0],
    clamp
  );

  // ====================================================
  // GRID DIRECTIONS
  // ====================================================

  const directions = [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,

          display: "grid",

          gridTemplateColumns:
            "repeat(2, 1fr)",

          gridTemplateRows:
            "repeat(2, 1fr)",

          gap: "5px",

          padding: "5px",

          opacity:
            gridOpacity *
            gridTransitionOpacity,

          transform: `
            scale(
              ${
                gridEntranceScale *
                effectScale *
                gridTransitionScale
              }
            )
            rotate(${effectRotation}deg)
          `,
        }}
      >
        {images.map((img, index) => {
          // =================================================
          // INDIVIDUAL IMAGE APPEAR TIMING
          // =================================================

          const appearStart =
            index * 20;

          const appearEnd =
            appearStart + 22;

          const localAppearFrame =
            frame - appearStart;

          const opacity = interpolate(
            localAppearFrame,
            [0, 8, 22],
            [0, 1, 1],
            clamp
          );

          const scale = interpolate(
            localAppearFrame,
            [0, 22],
            [0.72, 1],
            {
              ...clamp,
              easing: Easing.out(
                Easing.back(1.25)
              ),
            }
          );

          // =================================================
          // DIFFERENT ENTRY DIRECTION
          // =================================================

          const direction =
            directions[index];

          const entryX = interpolate(
            localAppearFrame,
            [0, 22],
            [direction.x * 70, 0],
            {
              ...clamp,
              easing: Easing.out(
                Easing.cubic
              ),
            }
          );

          const entryY = interpolate(
            localAppearFrame,
            [0, 22],
            [direction.y * 70, 0],
            {
              ...clamp,
              easing: Easing.out(
                Easing.cubic
              ),
            }
          );

          // =================================================
          // COLLAGE EFFECT MOVEMENT
          // =================================================

          const tileMoveX = interpolate(
            effectProgress,
            [0, 0.5, 1],
            [0, direction.x * 8, 0],
            clamp
          );

          const tileMoveY = interpolate(
            effectProgress,
            [0, 0.5, 1],
            [0, direction.y * 8, 0],
            clamp
          );

          // =================================================
          // EXIT MOVEMENT
          // =================================================

          const exitX = interpolate(
            transitionProgress,
            [0, 1],
            [0, direction.x * 110],
            clamp
          );

          const exitY = interpolate(
            transitionProgress,
            [0, 1],
            [0, direction.y * 110],
            clamp
          );

          const exitRotate = interpolate(
            transitionProgress,
            [0, 1],
            [0, direction.x * 5],
            clamp
          );

          const exitScale = interpolate(
            transitionProgress,
            [0, 1],
            [1, 1.12],
            clamp
          );

          // =================================================
          // FINAL TILE TRANSFORM
          // =================================================

          const finalX =
            entryX +
            tileMoveX +
            exitX;

          const finalY =
            entryY +
            tileMoveY +
            exitY;

          const finalScale =
            scale *
            exitScale;

          return (
            <div
              key={index}
              style={{
                overflow: "hidden",

                borderRadius: "10px",

                backgroundColor: "#111",

                opacity,

                transform: `
                  translate(
                    ${finalX}px,
                    ${finalY}px
                  )
                  scale(${finalScale})
                  rotate(${exitRotate}deg)
                `,

                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.5)",
              }}
            >
              <Img
                src={getImageSrc(img)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ==================================================
          CENTER HEART
          ================================================== */}

      <div
        style={{
          position: "absolute",

          left: "50%",
          top: "50%",

          transform:
            "translate(-50%, -50%)",

          zIndex: 20,

          display: "flex",

          gap: "3px",

          opacity: interpolate(
            frame,
            [0, 15, 70, 90],
            [0, 1, 1, 0],
            clamp
          ),
        }}
      >
        <span
          style={{
            fontSize: "30px",

            filter:
              "drop-shadow(0 4px 10px rgba(0,0,0,0.8))",

            transform: `
              scale(
                ${interpolate(
                  frame,
                  [0, 20, 40],
                  [0.5, 1.1, 1],
                  clamp
                )}
              )
            `,
          }}
        >
          🤍
        </span>

        <span
          style={{
            fontSize: "42px",

            filter:
              "drop-shadow(0 4px 10px rgba(0,0,0,0.8))",
          }}
        >
          🤍
        </span>
      </div>

      {/* ==================================================
          COLLAGE LIGHT FLASH
          ================================================== */}

      <AbsoluteFill
        style={{
          backgroundColor: "#fff",

          pointerEvents: "none",

          zIndex: 40,

          opacity: interpolate(
            frame,
            [147, 150, 153, 158],
            [0, 0.28, 0.12, 0],
            clamp
          ),
        }}
      />

      {/* ==================================================
          BLUR DURING COLLAGE EXIT
          ================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,

          pointerEvents: "none",

          zIndex: 30,

          backdropFilter:
            `blur(${
              interpolate(
                transitionProgress,
                [0, 1],
                [0, 4],
                clamp
              )
            }px)`,

          opacity: transitionProgress,
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// FULLSCREEN INDEX
// ======================================================

const getFullscreenIndex = (
  frame: number
) => {
  let start =
    FULLSCREEN_START;

  for (
    let i = 0;
    i < FULLSCREEN_DURATIONS.length;
    i++
  ) {
    const end =
      start +
      FULLSCREEN_DURATIONS[i];

    if (frame < end) {
      return {
        index: i,
        start,
        end,
      };
    }

    start = end;
  }

  const last =
    FULLSCREEN_DURATIONS.length - 1;

  return {
    index: last,

    start:
      FULLSCREEN_START +
      FULLSCREEN_DURATIONS
        .slice(0, last)
        .reduce(
          (a, b) => a + b,
          0
        ),

    end:
      DURATION_IN_FRAMES,
  };
};

// ======================================================
// FULLSCREEN SLIDE
// ======================================================

// ======================================================
// FULLSCREEN SLIDE — LIGHT STREAK / LIQUID ZOOM EFFECT
// ======================================================

const FullscreenSlide: React.FC<{
  images: ImageItem[];
  index: number;
  start: number;
  end: number;
  frame: number;
}> = ({
  images,
  index,
  start,
  end,
  frame,
}) => {
  const localFrame = frame - start;
  const duration = end - start;

  // ====================================================
  // TRANSITION LENGTH
  // ====================================================

  const EFFECT_FRAMES = 18;

  // ====================================================
  // ENTER PROGRESS
  // ====================================================

  const enterProgress = interpolate(
    localFrame,
    [0, 5, 12, EFFECT_FRAMES],
    [0, 0.25, 0.75, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ====================================================
  // IMAGE OPACITY
  // ====================================================

  const imageOpacity = interpolate(
    localFrame,
    [0, 5, 12, EFFECT_FRAMES],
    [0, 0.35, 0.8, 1],
    clamp
  );

  // ====================================================
  // STRONG ZOOM DURING TRANSITION
  // Reference mein image ekdum close/soft zoom hoti hai
  // ====================================================

  const transitionZoom = interpolate(
    localFrame,
    [0, 6, 18, duration],
    [1.32, 1.18, 1.04, 1.09],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ====================================================
  // NORMAL KEN BURNS
  // ====================================================

  const kenBurns = interpolate(
    localFrame,
    [18, duration],
    [1.04, 1.09],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }
  );

  const scale =
    localFrame < EFFECT_FRAMES
      ? transitionZoom
      : kenBurns;

  // ====================================================
  // VERTICAL LIQUID MOVEMENT
  // ====================================================

  const verticalStretch = interpolate(
    localFrame,
    [0, 7, 18],
    [1.12, 1.05, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ====================================================
  // HORIZONTAL MOVEMENT
  // ====================================================

  const direction =
    index % 2 === 0 ? 1 : -1;

  const translateX = interpolate(
    localFrame,
    [0, 7, 18],
    [direction * 45, direction * 8, 0],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ====================================================
  // VERTICAL MOVEMENT
  // ====================================================

  const translateY = interpolate(
    localFrame,
    [0, 7, 18],
    [index % 2 === 0 ? -30 : 30, 5, 0],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ====================================================
  // HEAVY BLUR
  // This is the main reference-like effect
  // ====================================================

  const blur = interpolate(
    localFrame,
    [0, 3, 7, 12, 18],
    [18, 13, 8, 3, 0],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ====================================================
  // VERTICAL MOTION BLUR
  // ====================================================

  const blurY = interpolate(
    localFrame,
    [0, 6, 18],
    [14, 6, 0],
    clamp
  );

  // ====================================================
  // SLIGHT ROTATION
  // ====================================================

  const rotate = interpolate(
    localFrame,
    [0, 8, 18],
    [
      index % 2 === 0 ? -2 : 2,
      index % 2 === 0 ? -0.6 : 0.6,
      0,
    ],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ====================================================
  // LIGHT STREAK PROGRESS
  // ====================================================

  const lightProgress = interpolate(
    localFrame,
    [0, 4, 12, 22],
    [-1.4, -0.4, 0.35, 1.3],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // ====================================================
  // LIGHT STREAK OPACITY
  // ====================================================

  const lightOpacity = interpolate(
    localFrame,
    [0, 3, 8, 15, 22],
    [0, 0.9, 0.75, 0.3, 0],
    clamp
  );

  // ====================================================
  // WHITE FLASH
  // ====================================================

  const flashOpacity = interpolate(
    localFrame,
    [0, 2, 5, 10, 16],
    [0.45, 0.6, 0.35, 0.08, 0],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ====================================================
  // SOFT GLOW
  // ====================================================

  const glowOpacity = interpolate(
    localFrame,
    [0, 4, 10, 20],
    [0.7, 0.55, 0.2, 0],
    clamp
  );

  // ====================================================
  // IMAGE
  // ====================================================

  const src = getImageSrc(
    images[index]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >

      {/* =================================================
          MAIN IMAGE
          ================================================= */}

      <AbsoluteFill
        style={{
          overflow: "hidden",

          opacity: imageOpacity,

          transform: `
            translate(
              ${translateX}px,
              ${translateY}px
            )
            scale(${scale})
            rotate(${rotate}deg)
          `,

          filter: `
            blur(${blur}px)
          `,
        }}
      >
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",

            objectFit: "cover",

            transform: `
              scaleX(${verticalStretch})
            `,
          }}
        />
      </AbsoluteFill>

      {/* =================================================
          VERTICAL MOTION BLUR LAYERS
          ================================================= */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          opacity: interpolate(
            localFrame,
            [0, 4, 10, 18],
            [0.5, 0.35, 0.12, 0],
            clamp
          ),

          background:
            "linear-gradient(" +
            "90deg," +
            "transparent 0%," +
            "rgba(255,255,255,0.12) 25%," +
            "rgba(255,220,210,0.2) 50%," +
            "rgba(255,255,255,0.12) 75%," +
            "transparent 100%" +
            ")",

          filter:
            `blur(${blurY}px)`,

          transform: `
            translateX(
              ${translateX * -0.5}px
            )
          `,
        }}
      />

      {/* =================================================
          MOVING LIGHT STREAK
          ================================================= */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          overflow: "hidden",

          opacity: lightOpacity,
        }}
      >
        <div
          style={{
            position: "absolute",

            top: "-20%",

            left: "-45%",

            width: "55%",

            height: "140%",

            transform: `
              translateX(
                ${lightProgress * 260}%
              )
              rotate(18deg)
            `,

            background:
              "linear-gradient(" +
              "90deg," +
              "transparent 0%," +
              "rgba(255,190,170,0.05) 20%," +
              "rgba(255,245,225,0.45) 45%," +
              "rgba(255,255,255,0.8) 50%," +
              "rgba(255,210,190,0.35) 58%," +
              "transparent 100%" +
              ")",

            filter:
              "blur(18px)",
          }}
        />
      </AbsoluteFill>

      {/* =================================================
          SECOND LIGHT STREAK
          ================================================= */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          opacity:
            lightOpacity * 0.55,

          background:
            "linear-gradient(" +
            "110deg," +
            "transparent 20%," +
            "rgba(190,150,255,0.18) 42%," +
            "rgba(255,190,170,0.28) 50%," +
            "transparent 70%" +
            ")",

          backgroundSize:
            "180% 100%",

          backgroundPosition:
            `${lightProgress * 100}% 0`,

          filter:
            "blur(12px)",
        }}
      />

      {/* =================================================
          RADIAL LIGHT GLOW
          ================================================= */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          opacity: glowOpacity,

          background:
            "radial-gradient(" +
            "ellipse at 50% 48%," +
            "rgba(255,240,220,0.35) 0%," +
            "rgba(255,190,170,0.14) 28%," +
            "transparent 65%" +
            ")",

          filter:
            "blur(10px)",
        }}
      />

      {/* =================================================
          WHITE LIGHT FLASH
          ================================================= */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          backgroundColor:
            "#fff",

          opacity:
            flashOpacity,
        }}
      />

      {/* =================================================
          WARM COLOR WASH
          ================================================= */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          opacity:
            interpolate(
              localFrame,
              [0, 5, 15, 22],
              [0.35, 0.25, 0.08, 0],
              clamp
            ),

          background:
            "linear-gradient(" +
            "120deg," +
            "rgba(120,80,160,0.25)," +
            "rgba(255,180,150,0.28)," +
            "rgba(255,240,210,0.15)" +
            ")",

          mixBlendMode:
            "screen",
        }}
      />

      {/* =================================================
          CINEMATIC DARK GRADIENT
          ================================================= */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          background:
            "linear-gradient(" +
            "180deg," +
            "rgba(0,0,0,0.03) 0%," +
            "rgba(0,0,0,0.04) 55%," +
            "rgba(0,0,0,0.3) 100%" +
            ")",
        }}
      />

      {/* =================================================
          VIGNETTE
          ================================================= */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          background:
            "radial-gradient(" +
            "ellipse at center," +
            "transparent 55%," +
            "rgba(0,0,0,0.2) 100%" +
            ")",
        }}
      />
    </AbsoluteFill>
  );
};
// ======================================================
// MAIN COMPONENT
// ======================================================

export const Template4Images: React.FC<
  TemplateProps
> = ({ images }) => {
  const frame =
    useCurrentFrame();

  // ====================================================
  // SAFE IMAGES
  // ====================================================

  const safeImages =
    images &&
    images.length >= 4
      ? images.slice(0, 4)
      : DEFAULT_IMAGES;

  // ====================================================
  // 0 - 5 SEC
  // COLLAGE + EFFECT
  // ====================================================

  if (
    frame <
    FULLSCREEN_START
  ) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          overflow: "hidden",
        }}
      >
        <GridCollage
          images={safeImages}
          frame={frame}
        />
      </AbsoluteFill>
    );
  }

  // ====================================================
  // 6 - 17 SEC
  // FULLSCREEN
  // ====================================================

  const {
    index,
    start,
    end,
  } =
    getFullscreenIndex(
      frame
    );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      <FullscreenSlide
        images={safeImages}
        index={index}
        start={start}
        end={end}
        frame={frame}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// EXPORT
// ======================================================

export default Template4Images;