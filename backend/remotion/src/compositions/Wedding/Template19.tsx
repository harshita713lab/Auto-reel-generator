import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { MusicPlayer } from "../../components";

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
}

interface Template19Props {
  images?: ImageItem[];

  music?: {
    path: string;
    volume?: number;
  };
}

// ======================================================
// TEMPLATE SETTINGS
// ======================================================

export const IMAGE_COUNT = 7;

export const FPS = 30;

// 295 frames ≈ 9.83 sec
export const DURATION_IN_FRAMES = 295;

// ======================================================
// TEMPLATE 19
// ======================================================

export const Template19 = ({
  images = [],
  music,
}: Template19Props) => {
  const frame = useCurrentFrame();

  // ====================================================
  // IMAGES
  // ====================================================

  const [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
  ] = images;

  // ====================================================
  // CLAMP
  // ====================================================

  const clamp = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
  };

  // ====================================================
  // IMAGE COUNT CHECK
  // ====================================================

  if (images.length < IMAGE_COUNT) {
    console.warn(
      `Template19: Expected ${IMAGE_COUNT} images, but received ${images.length}.`
    );
  }

  // ======================================================
  // IMAGE TIMINGS
  //
  // img1 : 0   → 73
  // img2 : 73  → 114
  // img3 : 114 → 127
  // img4 : 127 → 160
  // img5 : 160 → 213
  // img6 : 213 → 247
  // img7 : 247 → 295
  // ======================================================

  const imageTimings = [
    {
      start: 0,
      end: 60,
    },
    {
      start: 60,
      end: 114,
    },
    {
      start: 114,
      end: 127,
    },
    {
      start: 127,
      end: 160,
    },
    {
      start: 160,
      end: 213,
    },
    {
      start: 213,
      end: 247,
    },
    {
      start: 247,
      end: 295,
    },
  ];

  // ======================================================
  // IMAGES ARRAY
  // ======================================================

  const sceneImages = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
  ];
// ======================================================
// IMAGE WISE TEXT
// Har image ka alag text
// ======================================================

const imageTexts = [
  "main keh du",
  "Sabhi ko",
  "ke tera hi",
  "hai ye asar",
  "puchhe jo koi",
  "toh tera",
  "naam lu",
];


  // ======================================================
  // FIND CURRENT IMAGE
  // ======================================================

  let currentIndex = 0;

  for (let i = 0; i < imageTimings.length; i++) {
    if (
      frame >= imageTimings[i].start &&
      frame < imageTimings[i].end
    ) {
      currentIndex = i;
      break;
    }
  }
  // ======================================================
// CURRENT IMAGE TEXT
// ======================================================

const currentText = imageTexts[currentIndex] ?? "";

  // ======================================================
  // CURRENT IMAGE
  // ======================================================

  const currentImage = sceneImages[currentIndex];

  // ======================================================
  // CURRENT IMAGE TIMING
  // ======================================================

  const currentTiming =
    imageTimings[currentIndex];

  const imageStart =
    currentTiming.start;

  const imageEnd =
    currentTiming.end;

  const imageDuration =
    imageEnd - imageStart;

  const imageLocalFrame =
    frame - imageStart;

  // ======================================================
  // TRANSITION SETTINGS
  // ======================================================

  /*
   * Small overlap around every image change.
   *
   * This keeps the transition smooth instead
   * of making it look like a hard cut.
   */

  const transitionDuration = 10;

  // ======================================================
  // FADE IN
  // ======================================================

  const fadeIn = interpolate(
    imageLocalFrame,
    [
      0,
      transitionDuration,
    ],
    [
      0,
      1,
    ],
    clamp
  );

  // ======================================================
  // FADE OUT
  // ======================================================

  const fadeOut = interpolate(
    imageLocalFrame,
    [
      imageDuration - transitionDuration,
      imageDuration,
    ],
    [
      1,
      0,
    ],
    clamp
  );

  // ======================================================
  // IMAGE OPACITY
  // ======================================================

  let imageOpacity = Math.min(
    fadeIn,
    fadeOut
  );

  // First image should start visible
  if (currentIndex === 0) {
    imageOpacity = interpolate(
      imageLocalFrame,
      [0, transitionDuration],
      [1, 1],
      clamp
    );

    if (
      imageLocalFrame >=
      imageDuration - transitionDuration
    ) {
      imageOpacity = fadeOut;
    }
  }

  // Last image should remain visible
  if (
    currentIndex ===
    sceneImages.length - 1
  ) {
    imageOpacity = fadeIn;
  }

  // ======================================================
  // ZOOM EFFECT
  // ======================================================

  /*
   * Alternate:
   *
   * img1 → zoom IN
   * img2 → zoom OUT
   * img3 → zoom IN
   * img4 → zoom OUT
   * img5 → zoom IN
   * img6 → zoom OUT
   * img7 → zoom IN
   */

  const isZoomIn =
    currentIndex % 2 === 0;

  const zoom = isZoomIn
    ? interpolate(
        imageLocalFrame,
        [
          0,
          imageDuration,
        ],
        [
          1,
          1.08,
        ],
        clamp
      )
    : interpolate(
        imageLocalFrame,
        [
          0,
          imageDuration,
        ],
        [
          1.08,
          1,
        ],
        clamp
      );

  // ======================================================
  // PAN X
  // ======================================================

  const panX = isZoomIn
    ? interpolate(
        imageLocalFrame,
        [
          0,
          imageDuration,
        ],
        [
          -8,
          8,
        ],
        clamp
      )
    : interpolate(
        imageLocalFrame,
        [
          0,
          imageDuration,
        ],
        [
          8,
          -8,
        ],
        clamp
      );

  // ======================================================
  // PAN Y
  // ======================================================

  const panY = interpolate(
    imageLocalFrame,
    [
      0,
      imageDuration,
    ],
    [
      3,
      -3,
    ],
    clamp
  );

  // ======================================================
  // SLIGHT ROTATION
  // ======================================================

  const rotation =
    currentIndex % 2 === 0
      ? interpolate(
          imageLocalFrame,
          [
            0,
            imageDuration,
          ],
          [
            -0.2,
            0.2,
          ],
          clamp
        )
      : interpolate(
          imageLocalFrame,
          [
            0,
            imageDuration,
          ],
          [
            0.2,
            -0.2,
          ],
          clamp
        );

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >

      {/* ==================================================
          FULL SCREEN IMAGE
      ================================================== */}

      {currentImage?.path && (
        <Img
          src={currentImage.path}
          style={{
            position: "absolute",

            width: "100%",
            height: "100%",

            objectFit: "cover",

            opacity: imageOpacity,

            transform: `
              scale(${zoom})
              translate(${panX}px, ${panY}px)
              rotate(${rotation}deg)
            `,

            transformOrigin:
              "center center",

            display: "block",
          }}
        />
      )}
      {/* ==================================================
    IMAGE WISE TEXT
    Har image par alag text
================================================== */}
{/* ==================================================
    IMAGE WISE TEXT
    CENTER OF SCREEN
================================================== */}

<div
  style={{
    position: "absolute",

    inset: 0,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    opacity: imageOpacity,

    zIndex: 15,

    pointerEvents: "none",

    padding: "0 45px",
    boxSizing: "border-box",
  }}
>
  <div
    style={{
      fontSize: 68,

      fontFamily:
        "'Brush Script MT', 'Segoe Script', cursive",

      fontWeight: 400,

      color: "#ffffff",

      letterSpacing: 2,

      textAlign: "center",

      lineHeight: 1.15,

      textShadow:
        "0 3px 12px rgba(0,0,0,0.65)",

      whiteSpace: "nowrap",
    }}
  >
    {currentText}
  </div>
</div>


      {/* ==================================================
          CINEMATIC DARK OVERLAY
      ================================================== */}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.04), rgba(0,0,0,0.16))",

          pointerEvents: "none",

          zIndex: 10,
        }}
      />

      {/* ==================================================
          SUBTLE VIGNETTE
      ================================================== */}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle, transparent 55%, rgba(0,0,0,0.20) 100%)",

          pointerEvents: "none",

          zIndex: 11,
        }}
      />

      {/* ==================================================
          SMALL HEART
      ================================================== */}

      <div
        style={{
          position: "absolute",

          right: 45,
          bottom: 55,

          fontSize: 46,

          lineHeight: 1,

          opacity: 0.9,

          zIndex: 20,

          filter:
            "drop-shadow(0 4px 8px rgba(0,0,0,0.35))",
        }}
      >
        ♡
      </div>

      {/* ==================================================
          FINAL FADE
          9.43 → 9.83 SEC
      ================================================== */}

      <AbsoluteFill
        style={{
          backgroundColor: "#000000",

          opacity: interpolate(
            frame,
            [
              283,
              295,
            ],
            [
              0,
              1,
            ],
            clamp
          ),

          pointerEvents: "none",

          zIndex: 100,
        }}
      />

      {/* ==================================================
          MUSIC
      ================================================== */}

      {music?.path && (
        <MusicPlayer
          src={music.path}
          volume={
            music.volume ?? 1
          }
        />
      )}

    </AbsoluteFill>
  );
};

export default Template19;