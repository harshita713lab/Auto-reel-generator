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

interface Template31Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIG
// ======================================================

export const FPS = 30;

// 15 seconds
// 15 × 30 = 450 frames
export const DURATION_IN_FRAMES = 450;

// ======================================================
// IMAGE CONFIG
// ======================================================

export const IMAGE_COUNT = 8;

// 2 images = 1 pair
//
// image 0 = background
// image 1 = card
//
// image 2 = background
// image 3 = card
//
// image 4 = background
// image 5 = card
//
// image 6 = background
// image 7 = card

const PAIR_COUNT = IMAGE_COUNT / 2;

// ======================================================
// TIMING
// ======================================================

// INTRO
// 0 - 4 sec
const INTRO_DURATION = 120;

// CONTENT
// 4 - 15 sec
const CONTENT_DURATION = 330;

// ======================================================
// EXACT PAIR DURATIONS
// ======================================================
//
// 330 frames total
//
// Pair 1 = 82 frames
// Pair 2 = 82 frames
// Pair 3 = 83 frames
// Pair 4 = 83 frames
//
// Total = 330 frames

const PAIR_DURATIONS = [82, 82, 83, 83];

// Pair starting frames inside content
const PAIR_STARTS = [0, 82, 164, 247];

// ======================================================
// CARD TEXT
// ======================================================

const CARD_TEXTS = [
  {
    first: "Meri",
    second: "Khaamoshi",
  },
  {
    first: "Se Baathen",
    second: "Chun lenaa",
  },
  {
    first: "Unki",
    second: "Dori Se",
  },
  {
    first: "Tarifein",
    second: "Bun lenaa",
  },
];

// ======================================================
// DEFAULT PROPS
// ======================================================

export const DEFAULT_PROPS: Template31Props = {
  images: Array(8).fill({
    path:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop",
  }),

  music: undefined,
};

// ======================================================
// HELPERS
// ======================================================

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// IMAGE SOURCE
// ======================================================

const getImgSrc = (
  img?: ImageItem,
  index: number = 0
): string => {
  if (img?.path) return img.path;

  if (img?.url) return img.url;

  return DEFAULT_PROPS.images?.[index]?.path || "";
};

// ======================================================
// TEMPLATE 31
// ======================================================

export const Template31: React.FC<
  Template31Props
> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();

  // ====================================================
  // SAFE IMAGES
  // ====================================================

  const safeImages =
    images.length >= IMAGE_COUNT
      ? images
      : DEFAULT_PROPS.images!;

  // ====================================================
  // MUSIC
  // ====================================================

  const musicSrc =
    typeof music === "string"
      ? music
      : music?.path;

  // ====================================================
  // GLOBAL FADE IN
  // ====================================================

  const fadeIn = interpolate(
    frame,
    [0, 12],
    [0, 1],
    clamp
  );

  // ====================================================
  // GLOBAL FADE OUT
  // 14.6 sec → 15 sec
  // ====================================================

  const fadeOut = interpolate(
    frame,
    [438, 450],
    [1, 0],
    clamp
  );

  // ====================================================
  // INTRO CHECK
  // ====================================================

  const isIntro =
    frame < INTRO_DURATION;

  // ====================================================
  // INTRO - FLOWER
  // ====================================================

  const flowerProgress = interpolate(
    frame,
    [0, 90],
    [0, 1],
    {
      ...clamp,
      easing: Easing.out(
        Easing.cubic
      ),
    }
  );

  const flowerScale = interpolate(
    flowerProgress,
    [0, 1],
    [0.02, 12],
    clamp
  );

  const flowerOpacity = interpolate(
    frame,
    [0, 10, 85, 110],
    [0, 1, 1, 0],
    clamp
  );

  // ====================================================
  // INTRO HEART
  // ====================================================

  const heartScale = interpolate(
    frame,
    [15, 35, 90, 115],
    [0, 1, 1, 0],
    {
      ...clamp,
      easing: Easing.out(
        Easing.back(1.5)
      ),
    }
  );

  // ====================================================
  // INTRO FADE
  // ====================================================

  const introOpacity = interpolate(
    frame,
    [105, 120],
    [1, 0],
    clamp
  );

  // ====================================================
  // CONTENT FRAME
  // ====================================================

  const contentFrame = Math.max(
    0,
    frame - INTRO_DURATION
  );

  // ====================================================
  // CURRENT PAIR
  // ====================================================

  let pairIndex = 0;

  if (contentFrame >= 82) {
    pairIndex = 1;
  }

  if (contentFrame >= 164) {
    pairIndex = 2;
  }

  if (contentFrame >= 247) {
    pairIndex = 3;
  }

  pairIndex = Math.min(
    PAIR_COUNT - 1,
    pairIndex
  );

  // ====================================================
  // CURRENT PAIR DURATION
  // ====================================================

  const currentPairDuration =
    PAIR_DURATIONS[pairIndex];

  // ====================================================
  // CURRENT PAIR START
  // ====================================================

  const currentPairStart =
    PAIR_STARTS[pairIndex];

  // ====================================================
  // FRAME INSIDE CURRENT PAIR
  // ====================================================

  const imageFrame =
    contentFrame -
    currentPairStart;

  // ====================================================
  // NEXT PAIR
  // ====================================================

  const nextPairIndex = Math.min(
    PAIR_COUNT - 1,
    pairIndex + 1
  );

  // ====================================================
  // IMAGE INDEXES
  // ====================================================

  const backgroundIndex =
    pairIndex * 2;

  const cardIndex =
    pairIndex * 2 + 1;

  const nextBackgroundIndex =
    nextPairIndex * 2;

  // ====================================================
  // IMAGE SOURCES
  // ====================================================

  const backgroundSrc =
    getImgSrc(
      safeImages[backgroundIndex],
      backgroundIndex
    );

  const cardSrc =
    getImgSrc(
      safeImages[cardIndex],
      cardIndex
    );

  const nextBackgroundSrc =
    getImgSrc(
      safeImages[nextBackgroundIndex],
      nextBackgroundIndex
    );

  // ====================================================
  // BACKGROUND ANIMATION
  // TOP → DOWN
  // ====================================================

  const backgroundY =
    interpolate(
      imageFrame,
      [0, 18],
      [-220, 0],
      {
        ...clamp,
        easing: Easing.out(
          Easing.cubic
        ),
      }
    );

  // ====================================================
  // BACKGROUND SCALE
  // ====================================================

  const backgroundScale =
    interpolate(
      imageFrame,
      [0, currentPairDuration],
      [1.08, 1.16],
      clamp
    );

  // ====================================================
  // BACKGROUND BRIGHTNESS
  // ====================================================
  // Increased from 0.42/0.32
  // so background stays visible.

  const backgroundBrightness =
    interpolate(
      imageFrame,
      [0, currentPairDuration],
      [0.58, 0.48],
      clamp
    );

  // ====================================================
  // BACKGROUND OPACITY
  // ====================================================

  const backgroundOpacity =
    interpolate(
      imageFrame,
      [0, 8],
      [0, 1],
      clamp
    );

  // ====================================================
  // CARD ENTER
  // BOTTOM → UP
  // ====================================================

  const cardEnter =
    interpolate(
      imageFrame,
      [0, 18],
      [220, 0],
      {
        ...clamp,
        easing: Easing.out(
          Easing.cubic
        ),
      }
    );

  // ====================================================
  // CARD EXIT
  // ====================================================

  const cardExit =
    interpolate(
      imageFrame,
      [
        currentPairDuration - 15,
        currentPairDuration,
      ],
      [0, -70],
      {
        ...clamp,
        easing: Easing.in(
          Easing.cubic
        ),
      }
    );

  // ====================================================
  // FINAL CARD Y
  // ====================================================

  const cardY =
    cardEnter + cardExit;

  // ====================================================
  // CARD SCALE
  // ====================================================

  const cardScale =
    interpolate(
      imageFrame,
      [0, currentPairDuration],
      [0.94, 1.02],
      {
        ...clamp,
        easing: Easing.inOut(
          Easing.cubic
        ),
      }
    );

  // ====================================================
  // CARD OPACITY
  // ====================================================

  const cardOpacity =
    interpolate(
      imageFrame,
      [
        0,
        8,
        currentPairDuration - 12,
        currentPairDuration,
      ],
      [0, 1, 1, 0],
      clamp
    );

  // ====================================================
  // CARD IMAGE ZOOM
  // ====================================================

  const cardImageScale =
    interpolate(
      imageFrame,
      [0, currentPairDuration],
      [1.02, 1.06],
      clamp
    );

  // ====================================================
  // NEXT BACKGROUND CROSSFADE
  // ====================================================

  const nextBgOpacity =
    interpolate(
      imageFrame,
      [
        currentPairDuration - 18,
        currentPairDuration,
      ],
      [0, 1],
      clamp
    );

  // ====================================================
  // CARD SIZE
  // ====================================================
  // Increased from 850 × 680
  // to 900 × 760

  const CARD_WIDTH = 900;
  const CARD_HEIGHT = 760;

  // ====================================================
  // CARD TEXT
  // ====================================================

  const currentText =
    CARD_TEXTS[pairIndex] ||
    CARD_TEXTS[0];

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050505",
        overflow: "hidden",
        opacity:
          fadeIn * fadeOut,
      }}
    >

      {/* ==================================================
          MUSIC
          ================================================== */}

      {musicSrc && (
        <MusicPlayer
          src={musicSrc}
          volume={
            typeof music === "object"
              ? music?.volume
              : 1
          }
        />
      )}

      {/* ==================================================
          INTRO
          0 - 4 SEC
          ================================================== */}

      {isIntro && (
        <AbsoluteFill
          style={{
            backgroundColor: "#000",
            opacity:
              introOpacity,
            overflow: "hidden",
            zIndex: 50,
          }}
        >

          {/* ==================================================
              PINK FLOWER
              ================================================== */}

          <div
            style={{
              position: "absolute",

              left: "50%",
              top: "50%",

              width: 110,
              height: 110,

              borderRadius: "50%",

              transform: `
                translate(-50%, -50%)
                scale(${flowerScale})
              `,

              opacity:
                flowerOpacity,

              background:
                "radial-gradient(circle, #ff4f9a 0%, #ff2d83 45%, #ff146f 70%, #e9005c 100%)",

              boxShadow:
                "0 0 50px rgba(255,50,140,0.8)",

              zIndex: 2,
            }}
          />

          {/* ==================================================
              HEART
              ================================================== */}

          <div
            style={{
              position: "absolute",

              left: "50%",
              top: "50%",

              transform: `
                translate(-50%, -50%)
                scale(${heartScale})
              `,

              opacity:
                heartScale,

              color: "#fff",

              fontSize: 54,

              zIndex: 5,

              textShadow:
                "0 4px 15px rgba(0,0,0,0.5)",
            }}
          >
            ❤️
          </div>

        </AbsoluteFill>
      )}

      {/* ==================================================
          MAIN CONTENT
          4 - 15 SEC
          ================================================== */}

      {!isIntro && (
        <AbsoluteFill
          style={{
            overflow: "hidden",
            backgroundColor:
              "#050505",
          }}
        >

          {/* ==================================================
              CURRENT SHARP BACKGROUND
              TOP → DOWN
              ================================================== */}

          <AbsoluteFill
            style={{
              overflow: "hidden",
              opacity:
                backgroundOpacity,
            }}
          >
            <Img
              src={backgroundSrc}
              style={{
                width: "100%",
                height: "100%",

                objectFit: "cover",

                transform: `
                  translateY(${backgroundY}px)
                  scale(${backgroundScale})
                `,

                filter: `
  blur(10px)
  brightness(${backgroundBrightness})
  saturate(1.15)
`,

                display: "block",
              }}
            />
          </AbsoluteFill>

          {/* ==================================================
              NEXT SHARP BACKGROUND
              ================================================== */}

          {nextPairIndex !== pairIndex && (
            <AbsoluteFill
              style={{
                opacity:
                  nextBgOpacity,

                overflow: "hidden",
              }}
            >
              <Img
                src={
                  nextBackgroundSrc
                }
                style={{
                  width: "100%",
                  height: "100%",

                  objectFit: "cover",

                  transform:
                    "scale(1.14)",

                  // NO BLUR
                  filter:
                    "brightness(0.48) saturate(1.15)",

                  display: "block",
                }}
              />
            </AbsoluteFill>
          )}

          {/* ==================================================
              DARK OVERLAY
              ================================================== */}

          <AbsoluteFill
            style={{
              background:
                "rgba(0,0,0,0.18)",

              zIndex: 5,
            }}
          />

          {/* ==================================================
              IMAGE CARD
              BOTTOM → UP
              ================================================== */}

          <div
            style={{
              position: "absolute",

              left: "50%",
              top: "48%",

              width:
                CARD_WIDTH,

              height:
                CARD_HEIGHT,

              transform: `
                translate(-50%, -50%)
                translateY(${cardY}px)
                scale(${cardScale})
              `,

              borderRadius: 48,

              overflow: "hidden",

              backgroundColor:
                "#111",

              opacity:
                cardOpacity,

              boxShadow:
                "0 25px 70px rgba(0,0,0,0.65)",

              border:
                "2px solid rgba(255,255,255,0.10)",

              zIndex: 10,
            }}
          >

            {/* ==================================================
                CLEAR CARD IMAGE
                ================================================== */}

            <Img
              src={cardSrc}
              style={{
                width: "100%",
                height: "100%",

                objectFit: "cover",

                display: "block",

                transform: `
                  scale(${cardImageScale})
                `,
              }}
            />

            {/* ==================================================
                CARD GRADIENT
                ================================================== */}

            <div
              style={{
                position:
                  "absolute",

                inset: 0,

                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.02) 20%, rgba(0,0,0,0.08) 48%, rgba(0,0,0,0.48) 100%)",

                pointerEvents:
                  "none",

                zIndex: 2,
              }}
            />

            {/* ==================================================
                TEXT ON CARD
                ================================================== */}

            <div
              style={{
                position:
                  "absolute",

                left: 32,
                bottom: 38,

                zIndex: 5,

                display: "flex",

                flexDirection:
                  "column",

                alignItems:
                  "flex-start",

                opacity:
                  cardOpacity,

                pointerEvents:
                  "none",
              }}
            >

              {/* ==================================================
                  FIRST LINE
                  WHITE SERIF
                  ================================================== */}

              <div
                style={{
                  color: "#ffffff",

                  fontFamily:
                    "Georgia, 'Times New Roman', serif",

                  fontSize: 46,

                  fontWeight: 500,

                  letterSpacing:
                    "5px",

                  lineHeight:
                    0.95,

                  whiteSpace:
                    "nowrap",

                  WebkitTextStroke:
                    "2px rgba(0,0,0,0.95)",

                  paintOrder:
                    "stroke fill",

                  textShadow: `
                    0 2px 2px rgba(0,0,0,0.9),
                    0 3px 6px rgba(0,0,0,0.7)
                  `,
                }}
              >
                {
                  currentText.first
                }
              </div>

              {/* ==================================================
                  SECOND LINE
                  GOLDEN HANDWRITTEN
                  ================================================== */}

              <div
                style={{
                  color: "#f4cf52",

                  fontFamily:
                    "'Segoe Print', 'Comic Sans MS', cursive",

                  fontSize: 42,

                  fontWeight: 500,

                  letterSpacing:
                    "3px",

                  lineHeight: 1,

                  marginTop: 3,

                  marginLeft: 58,

                  whiteSpace:
                    "nowrap",

                  transform:
                    "rotate(-3deg)",

                  WebkitTextStroke:
                    "2px rgba(0,0,0,0.95)",

                  paintOrder:
                    "stroke fill",

                  textShadow: `
                    0 2px 3px rgba(0,0,0,0.9),
                    0 4px 8px rgba(0,0,0,0.7)
                  `,
                }}
              >
                {
                  currentText.second
                }
              </div>

            </div>

          </div>

          {/* ==================================================
              SOFT VIGNETTE
              ================================================== */}

          <AbsoluteFill
            style={{
              pointerEvents:
                "none",

              zIndex: 40,

              background:
                "linear-gradient(180deg, rgba(0,0,0,0.20) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.30) 100%)",
            }}
          />

        </AbsoluteFill>
      )}

    </AbsoluteFill>
  );
};

export default Template31;