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
}

interface Music {
  path: string;
  volume?: number;
}

interface Template25Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIG
// ======================================================

export const FPS = 30;

// 504 frames = 20.16 seconds
export const DURATION_IN_FRAMES = 504;

// 25 UNIQUE IMAGES
export const IMAGE_COUNT = 24;

// ======================================================
// IMAGE SEQUENCE
// ======================================================
//
// 25 unique images
// 32 total shots
//
// Every image 1-25 appears at least once.
// 7 images are repeated.
//
// Index:
// 0  = Image 1
// 1  = Image 2
// 2  = Image 3
// ...
// 24 = Image 25
//
// ======================================================

const IMAGE_SEQUENCE = [
  // ------------------------------------------
  // 1 - 9
  // ------------------------------------------

  0, // Image 1
  1, // Image 2
  2, // Image 3
  3, // Image 4
  4, // Image 5
  5, // Image 6
  6, // Image 7
  7, // Image 8
  8, // Image 9

  // Repeat Image 5
  4,

  // ------------------------------------------
  // 10 - 13
  // ------------------------------------------

  9,  // Image 10
  10, // Image 11
  11, // Image 12
  12, // Image 13

  // Repeat Image 2
  1,

  // ------------------------------------------
  // 14 - 17
  // ------------------------------------------

  13, // Image 14
  14, // Image 15
  15, // Image 16
  16, // Image 17

  // Repeat Image 8
  7,

  // ------------------------------------------
  // 18 - 21
  // ------------------------------------------

  17, // Image 18
  18, // Image 19
  19, // Image 20
  20, // Image 21

  // Repeat Image 13
  12,

  // ------------------------------------------
  // 22 - 25
  // ------------------------------------------

  21, // Image 22
  22, // Image 23
  23, // Image 24


  // ------------------------------------------
  // FINAL REPEATS
  // ------------------------------------------

  16, // Repeat Image 17
  20, // Repeat Image 21
 
];

// ======================================================
// TOTAL SHOTS
// ======================================================

const SHOT_COUNT = IMAGE_SEQUENCE.length;

// Should always be 32
// 32 shots × average ~15.75 frames
//
// We don't use a fractional duration directly.
// Instead, shot boundaries are calculated using
// exact proportional frame positions.
// ======================================================


// ======================================================
// MAIN COMPONENT
// ======================================================

export const Template25: React.FC<Template25Props> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();

  // ====================================================
  // IMAGE VALIDATION
  // ====================================================

  if (!images || images.length < IMAGE_COUNT) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          color: "#fff",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 40,
        }}
      >
        Need at least 25 images
      </AbsoluteFill>
    );
  }

  // ====================================================
  // CURRENT SHOT
  // ====================================================
  //
  // Instead of using 15.75 directly,
  // calculate exact shot boundaries.
  //
  // Example:
  // shot 0 → frame 0
  // shot 1 → frame ~15/16
  // shot 2 → frame ~31/32
  //
  // This guarantees the final shot ends exactly
  // at frame 504.
  // ====================================================

  const rawShot =
    (frame * SHOT_COUNT) / DURATION_IN_FRAMES;

  const shotIndex = Math.min(
    Math.floor(rawShot),
    SHOT_COUNT - 1
  );

  // ====================================================
  // CURRENT IMAGE
  // ====================================================

  const currentImageIndex =
    IMAGE_SEQUENCE[shotIndex];

  const currentImage =
    images[currentImageIndex];

  // ====================================================
  // EXACT SHOT START / END
  // ====================================================

  const shotStart =
    (shotIndex * DURATION_IN_FRAMES) /
    SHOT_COUNT;

  const shotEnd =
    ((shotIndex + 1) * DURATION_IN_FRAMES) /
    SHOT_COUNT;

  const shotDuration =
    shotEnd - shotStart;

  // ====================================================
  // LOCAL FRAME
  // ====================================================

  const localFrame =
    frame - shotStart;

  // ====================================================
  // PROGRESS
  // ====================================================

  const progress = interpolate(
    localFrame,
    [0, shotDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // TRANSITION
  // ====================================================

  const transitionFrames = 4;

  const transitionIn = interpolate(
    localFrame,
    [0, transitionFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const transitionOut = interpolate(
    localFrame,
    [
      Math.max(0, shotDuration - transitionFrames),
      shotDuration,
    ],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.quad),
    }
  );

  const opacity = Math.min(
    transitionIn,
    transitionOut
  );

  // ====================================================
  // MOTION TYPE
  // ====================================================

  const motionType = shotIndex % 6;

  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let rotate = 0;

  // ====================================================
  // 1. SLOW ZOOM IN
  // ====================================================

  if (motionType === 0) {
    scale = interpolate(
      progress,
      [0, 1],
      [1.0, 1.10],
      {
        easing: Easing.inOut(Easing.quad),
      }
    );
  }

  // ====================================================
  // 2. ZOOM OUT
  // ====================================================

  if (motionType === 1) {
    scale = interpolate(
      progress,
      [0, 1],
      [1.10, 1.0],
      {
        easing: Easing.inOut(Easing.quad),
      }
    );
  }

  // ====================================================
  // 3. PAN LEFT
  // ====================================================

  if (motionType === 2) {
    scale = 1.08;

    translateX = interpolate(
      progress,
      [0, 1],
      [35, -35],
      {
        easing: Easing.inOut(Easing.quad),
      }
    );
  }

  // ====================================================
  // 4. PAN RIGHT
  // ====================================================

  if (motionType === 3) {
    scale = 1.08;

    translateX = interpolate(
      progress,
      [0, 1],
      [-35, 35],
      {
        easing: Easing.inOut(Easing.quad),
      }
    );
  }

  // ====================================================
  // 5. VERTICAL MOVEMENT
  // ====================================================

  if (motionType === 4) {
    scale = 1.08;

    translateY = interpolate(
      progress,
      [0, 1],
      [25, -25],
      {
        easing: Easing.inOut(Easing.quad),
      }
    );
  }

  // ====================================================
  // 6. CINEMATIC ROTATION + ZOOM
  // ====================================================

  if (motionType === 5) {
    scale = interpolate(
      progress,
      [0, 1],
      [1.04, 1.10],
      {
        easing: Easing.inOut(Easing.quad),
      }
    );

    rotate = interpolate(
      progress,
      [0, 1],
      [-1.2, 1.2],
      {
        easing: Easing.inOut(Easing.quad),
      }
    );
  }

  // ====================================================
  // BLUR DURING TRANSITION
  // ====================================================

  const blurAmount = Math.min(
    transitionIn,
    transitionOut
  );

  const blur = interpolate(
    blurAmount,
    [0, 1],
    [5, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // BRIGHTNESS
  // ====================================================

  const brightness = interpolate(
    progress,
    [0, 0.5, 1],
    [0.92, 1, 0.96]
  );

  // ====================================================
  // CONTRAST
  // ====================================================

  const contrast = 1.05;

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
          IMAGE
      ================================================== */}

      <AbsoluteFill
        style={{
          opacity,
          overflow: "hidden",
        }}
      >

        <Img
          src={currentImage.path}
          style={{
            width: "100%",
            height: "100%",

            objectFit: "cover",

            transform: `
              translate(${translateX}px, ${translateY}px)
              scale(${scale})
              rotate(${rotate}deg)
            `,

            filter: `
              blur(${blur}px)
              brightness(${brightness})
              contrast(${contrast})
            `,

            transformOrigin:
              "center center",
          }}
        />

      </AbsoluteFill>


      {/* ==================================================
          CINEMATIC DARK OVERLAY
      ================================================== */}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.03) 45%, rgba(0,0,0,0.28) 100%)",

          pointerEvents: "none",
        }}
      />


      {/* ==================================================
          SOFT VIGNETTE
      ================================================== */}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.30) 100%)",

          pointerEvents: "none",
        }}
      />


      {/* ==================================================
          MUSIC
      ================================================== */}

      {music?.path && (
        <MusicPlayer
          src={music.path}
          volume={music.volume ?? 1}
        />
      )}

    </AbsoluteFill>
  );
};

export default Template25;