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

interface Template32Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIG
// ======================================================

export const FPS = 30;

// EXACT 18 SECONDS
export const DURATION_IN_FRAMES = 540;

// ======================================================
// IMAGE COUNT
// ======================================================

export const IMAGE_COUNT = 25;

// ======================================================
// SECTION TIMING
// ======================================================

const FIRST_SECTION_FRAMES = 240; // 0 - 8 sec
const SECOND_SECTION_FRAMES = 300; // 8 - 18 sec

// ======================================================
// IMAGE SEQUENCE
// ======================================================

// 0 - 8 SEC
// 25 original images exactly once

// 8 - 18 SEC
// 15 selected images repeated

const IMAGE_SEQUENCE = [
  // ====================================================
  // FIRST 25 IMAGES
  // ====================================================

  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,

  // ====================================================
  // 15 REPEATED IMAGES
  // ====================================================

  5,
  8,
  11,
  14,
  17,
  20,
  23,
  3,
  7,
  10,
  13,
  16,
  19,
  22,
  24,
];

// ======================================================
// FIRST SECTION DURATIONS
// ======================================================

// 25 images
// TOTAL = 240 FRAMES

const FIRST_SHOT_DURATIONS = [
  10,
  9,
  10,
  9,
  10,
  9,
  10,
  9,
  10,
  9,

  10,
  9,
  10,
  9,
  10,
  9,
  10,
  9,
  10,
  9,

  10,
  9,
  10,
  9,
  10,
];

// ======================================================
// SECOND SECTION DURATIONS
// ======================================================

// 15 images
// TOTAL = 300 FRAMES
// EACH = 20 FRAMES

const SECOND_SHOT_DURATIONS = [
  20,
  20,
  20,
  20,
  20,

  20,
  20,
  20,
  20,
  20,

  20,
  20,
  20,
  20,
  20,
];

// ======================================================
// FINAL SHOT DURATIONS
// ======================================================

const SHOT_DURATIONS = [
  ...FIRST_SHOT_DURATIONS,
  ...SECOND_SHOT_DURATIONS,
];

// ======================================================
// VALIDATION
// ======================================================

const TOTAL_SHOT_FRAMES = SHOT_DURATIONS.reduce(
  (sum, value) => sum + value,
  0
);

console.log(
  "Template32 total frames:",
  TOTAL_SHOT_FRAMES
);

console.log(
  "Template32 first section:",
  FIRST_SHOT_DURATIONS.reduce(
    (sum, value) => sum + value,
    0
  )
);

console.log(
  "Template32 second section:",
  SECOND_SHOT_DURATIONS.reduce(
    (sum, value) => sum + value,
    0
  )
);

// ======================================================
// SAFE CLAMP
// ======================================================

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// DEFAULT PROPS
// ======================================================

export const DEFAULT_PROPS: Template32Props = {
  images: [
    {
      path:
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  music: undefined,
};

// ======================================================
// IMAGE SOURCE
// ======================================================
//
// IMPORTANT:
// URL ko priority di gayi hai.
// Agar frontend `url` me original image bhej raha hai,
// wahi use hogi.
//
// ======================================================

const getImgSrc = (
  images: ImageItem[],
  index: number
): string => {
  if (!images || images.length === 0) {
    return DEFAULT_PROPS.images?.[0]?.path || "";
  }

  const actualIndex =
    index % images.length;

  const image =
    images[actualIndex];

  // ORIGINAL URL FIRST
  if (image?.url) {
    return image.url;
  }

  // FALLBACK
  if (image?.path) {
    return image.path;
  }

  return DEFAULT_PROPS.images?.[0]?.path || "";
};

// ======================================================
// FIND CURRENT SHOT
// ======================================================

const getShotIndex = (
  frame: number
): number => {
  let accumulated = 0;

  for (
    let i = 0;
    i < SHOT_DURATIONS.length;
    i++
  ) {
    accumulated +=
      SHOT_DURATIONS[i];

    if (
      frame < accumulated
    ) {
      return i;
    }
  }

  return (
    SHOT_DURATIONS.length - 1
  );
};

// ======================================================
// GET SHOT START
// ======================================================

const getShotStart = (
  shotIndex: number
): number => {
  let start = 0;

  for (
    let i = 0;
    i < shotIndex;
    i++
  ) {
    start +=
      SHOT_DURATIONS[i];
  }

  return start;
};

// ======================================================
// TEMPLATE 32
// ======================================================

export const Template32: React.FC<
  Template32Props
> = ({
  images = [],
  music,
}) => {
  const frame =
    useCurrentFrame();

  // ====================================================
  // SAFE IMAGES
  // ====================================================

  const safeImages =
    images.length > 0
      ? images
      : DEFAULT_PROPS.images!;

  // ====================================================
  // MUSIC
  // ====================================================

  const musicSrc =
    music?.path;

  // ====================================================
  // CURRENT SHOT
  // ====================================================

  const shotIndex =
    getShotIndex(frame);

  // ====================================================
  // SHOT START
  // ====================================================

  const shotStart =
    getShotStart(
      shotIndex
    );

  // ====================================================
  // SHOT DURATION
  // ====================================================

  const shotDuration =
    SHOT_DURATIONS[
      shotIndex
    ];

  // ====================================================
  // LOCAL FRAME
  // ====================================================

  const localFrame =
    frame - shotStart;

  // ====================================================
  // CURRENT IMAGE INDEX
  // ====================================================

  const sequenceImageIndex =
    IMAGE_SEQUENCE[
      shotIndex
    ];

  // ====================================================
  // CURRENT IMAGE
  // ====================================================

  const imageSrc =
    getImgSrc(
      safeImages,
      sequenceImageIndex
    );

  // ====================================================
  // SHOT PROGRESS
  // ====================================================

  const shotProgress =
    interpolate(
      localFrame,
      [
        0,
        Math.max(
          1,
          shotDuration - 1
        ),
      ],
      [0, 1],
      clamp
    );

  // ====================================================
  // SUBTLE ZOOM
  // ====================================================

  const zoom =
    interpolate(
      shotProgress,
      [0, 1],
      [1.01, 1.015],
      {
        ...clamp,
        easing:
          Easing.inOut(
            Easing.cubic
          ),
      }
    );

  // ====================================================
  // GLOBAL FADE OUT
  // ====================================================

  // Last 0.5 sec only

  const globalFadeOut =
    interpolate(
      frame,
      [525, 540],
      [1, 0],
      clamp
    );

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor:
          "#000",

        overflow:
          "hidden",

        opacity:
          globalFadeOut,
      }}
    >

      {/* ==================================================
          MUSIC
          ================================================== */}

      {musicSrc && (
        <MusicPlayer
          src={musicSrc}
          volume={
            music?.volume ?? 1
          }
        />
      )}

      {/* ==================================================
          CURRENT IMAGE
          ================================================== */}

      <AbsoluteFill
        style={{
          overflow:
            "hidden",

          // NO FADE
          // IMAGE ALWAYS FULLY VISIBLE
          opacity: 1,
        }}
      >

        <Img
          src={imageSrc}
          style={{
            position:
              "absolute",

            width:
              "100%",

            height:
              "100%",

            objectFit:
              "cover",

            display:
              "block",

            // =================================================
            // ORIGINAL IMAGE COLORS
            // =================================================

            filter:
              "none",

            WebkitFilter:
              "none",

            // =================================================
            // NO BLENDING
            // =================================================

            mixBlendMode:
              "normal",

            // =================================================
            // SUBTLE ZOOM ONLY
            // =================================================

            transform:
              `scale(${zoom})`,

            transformOrigin:
              "center center",
          }}
        />

      </AbsoluteFill>

    </AbsoluteFill>
  );
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default Template32;