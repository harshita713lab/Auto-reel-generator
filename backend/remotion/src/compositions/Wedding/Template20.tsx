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

interface Template20Props {
  images?: ImageItem[];

  music?: {
    path: string;
    volume?: number;
  };
}

// ======================================================
// TEMPLATE SETTINGS
// ======================================================

export const IMAGE_COUNT = 14;

export const FPS = 30;

// 340 frames ≈ 11.33 sec
export const DURATION_IN_FRAMES = 340;

// ======================================================
// TEMPLATE 20
// ======================================================

export const Template20 = ({
  images = [],
  music,
}: Template20Props) => {
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
    img8,
    img9,
    img10,
    img11,
    img12,
    img13,
    img14,
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
      `Template20: Expected ${IMAGE_COUNT} images, but received ${images.length}.`
    );
  }

  // ======================================================
  // ALL IMAGES
  // ======================================================

  const sceneImages = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
    img13,
    img14,
  ];

  // ======================================================
  // IMAGE START FRAMES
  //
  // IMG1 = permanent background
  //
  // IMG2 → IMG14 = foreground images
  // ======================================================

  const imageStarts = [
    0,    // IMG1
    77,   // IMG2
    90,   // IMG3
    108,  // IMG4
    120,  // IMG5
    132,  // IMG6
    145,  // IMG7
    160,  // IMG8
    171,  // IMG9
    181,  // IMG10
    195,  // IMG11
    205,  // IMG12
    215,  // IMG13
    230,  // IMG14
  ];

  // ======================================================
  // BACKGROUND IMAGE
  //
  // IMG1 ALWAYS REMAINS VISIBLE
  // ======================================================

  const backgroundImage = img1;

  // ======================================================
  // FOREGROUND OPACITY
  //
  // Reference reel mein foreground image
  // completely opaque nahi hai.
  //
  // IMG1 neeche se continuously visible rehti hai.
  // ======================================================

  const FOREGROUND_OPACITY = 0.55;

  // ======================================================
  // TRANSITION DURATION
  // ======================================================

  const transitionDuration = 10;

  // ======================================================
  // FIND CURRENT FOREGROUND IMAGE
  // ======================================================

  let currentIndex = 1;

  for (
    let i = 1;
    i < imageStarts.length;
    i++
  ) {
    if (frame >= imageStarts[i]) {
      currentIndex = i;
    }
  }

  // ======================================================
  // CURRENT IMAGE START
  // ======================================================

  const currentStart =
    imageStarts[currentIndex];

  // ======================================================
  // PREVIOUS IMAGE
  // ======================================================

  const previousIndex =
    currentIndex - 1;

  const previousStart =
    imageStarts[previousIndex];

  // ======================================================
  // CURRENT IMAGE END
  // ======================================================

  const currentEnd =
    currentIndex <
    imageStarts.length - 1
      ? imageStarts[currentIndex + 1]
      : DURATION_IN_FRAMES;

  // ======================================================
  // CURRENT IMAGE OPACITY
  //
  // Current image slowly appears over IMG1.
  // ======================================================

  const currentImageOpacity =
    interpolate(
      frame,
      [
        currentStart,
        currentStart + transitionDuration,
      ],
      [
        0,
        FOREGROUND_OPACITY,
      ],
      clamp
    );

  // ======================================================
  // PREVIOUS IMAGE OPACITY
  //
  // Previous foreground image disappears
  // when current image comes in.
  //
  // IMPORTANT:
  // It disappears ONLY from foreground.
  //
  // IMG1 remains underneath.
  // ======================================================

  let previousImageOpacity = 0;

  if (currentIndex > 1) {
    previousImageOpacity =
      interpolate(
        frame,
        [
          currentStart,
          currentStart +
            transitionDuration,
        ],
        [
          FOREGROUND_OPACITY,
          0,
        ],
        clamp
      );
  }

  // ======================================================
  // FIRST FOREGROUND IMAGE
  //
  // IMG2 appears at frame 77.
  // ======================================================

  const img2Opacity =
    currentIndex === 1
      ? currentImageOpacity
      : 0;

  // ======================================================
  // PREVIOUS FOREGROUND IMAGE
  // ======================================================

  const previousImage =
    currentIndex > 1
      ? sceneImages[previousIndex]
      : null;

  // ======================================================
  // CURRENT FOREGROUND IMAGE
  // ======================================================

  const currentImage =
    sceneImages[currentIndex];

  // ======================================================
  // BACKGROUND ANIMATION
  //
  // IMG1 stays continuously behind everything.
  // ======================================================

  const backgroundZoom =
    interpolate(
      frame,
      [
        0,
        DURATION_IN_FRAMES,
      ],
      [
        1,
        1.035,
      ],
      clamp
    );

  const backgroundPanX =
    interpolate(
      frame,
      [
        0,
        DURATION_IN_FRAMES,
      ],
      [
        -2,
        2,
      ],
      clamp
    );

  const backgroundPanY =
    interpolate(
      frame,
      [
        0,
        DURATION_IN_FRAMES,
      ],
      [
        1,
        -1,
      ],
      clamp
    );

  // ======================================================
  // CURRENT IMAGE LOCAL FRAME
  // ======================================================

  const currentLocalFrame =
    Math.max(
      0,
      frame - currentStart
    );

  const currentDuration =
    Math.max(
      1,
      currentEnd - currentStart
    );

  // ======================================================
  // CURRENT IMAGE ZOOM
  // ======================================================

  const currentZoom =
    interpolate(
      currentLocalFrame,
      [
        0,
        currentDuration,
      ],
      [
        1.01,
        1.04,
      ],
      clamp
    );

  // ======================================================
  // CURRENT IMAGE PAN X
  // ======================================================

  const currentPanX =
    interpolate(
      currentLocalFrame,
      [
        0,
        currentDuration,
      ],
      [
        -2,
        2,
      ],
      clamp
    );

  // ======================================================
  // CURRENT IMAGE PAN Y
  // ======================================================

  const currentPanY =
    interpolate(
      currentLocalFrame,
      [
        0,
        currentDuration,
      ],
      [
        0.5,
        -0.5,
      ],
      clamp
    );

  // ======================================================
  // PREVIOUS IMAGE ANIMATION
  // ======================================================

  const previousLocalFrame =
    Math.max(
      0,
      frame - previousStart
    );

  const previousDuration =
    Math.max(
      1,
      currentStart - previousStart
    );

  const previousZoom =
    interpolate(
      previousLocalFrame,
      [
        0,
        previousDuration,
      ],
      [
        1.01,
        1.035,
      ],
      clamp
    );

  const previousPanX =
    interpolate(
      previousLocalFrame,
      [
        0,
        previousDuration,
      ],
      [
        -1.5,
        1.5,
      ],
      clamp
    );

  const previousPanY =
    interpolate(
      previousLocalFrame,
      [
        0,
        previousDuration,
      ],
      [
        0.5,
        -0.5,
      ],
      clamp
    );

  // ======================================================
  // FINAL FADE
  // ======================================================

  const finalFade =
    interpolate(
      frame,
      [
        328,
        340,
      ],
      [
        0,
        1,
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
          PERMANENT BACKGROUND

          IMG1 NEVER DISAPPEARS
      ================================================== */}

      {backgroundImage?.path && (
        <Img
          src={backgroundImage.path}
          style={{
            position: "absolute",

            top: 0,
            left: 0,

            width: "100%",
            height: "100%",

            objectFit: "cover",

            opacity: 1,

            transform: `
              scale(${backgroundZoom})
              translate(
                ${backgroundPanX}px,
                ${backgroundPanY}px
              )
            `,

            transformOrigin:
              "center center",

            display: "block",

            zIndex: 1,
          }}
        />
      )}

      {/* ==================================================
          PREVIOUS FOREGROUND IMAGE

          Example:

          IMG2 → IMG3

          During transition:

          IMG1 = background
          IMG2 = fading out
          IMG3 = fading in
      ================================================== */}

      {previousImage?.path &&
        previousImageOpacity > 0 && (
          <Img
            src={previousImage.path}
            style={{
              position: "absolute",

              top: 0,
              left: 0,

              width: "100%",
              height: "100%",

              objectFit: "cover",

              opacity:
                previousImageOpacity,

              transform: `
                scale(${previousZoom})
                translate(
                  ${previousPanX}px,
                  ${previousPanY}px
                )
              `,

              transformOrigin:
                "center center",

              display: "block",

              zIndex: 2,
            }}
          />
        )}

      {/* ==================================================
          CURRENT FOREGROUND IMAGE

          This image appears over IMG1.
      ================================================== */}

      {currentImage?.path && (
        <Img
          src={currentImage.path}
          style={{
            position: "absolute",

            top: 0,
            left: 0,

            width: "100%",
            height: "100%",

            objectFit: "cover",

            opacity:
              currentIndex === 1
                ? img2Opacity
                : currentImageOpacity,

            transform: `
              scale(${currentZoom})
              translate(
                ${currentPanX}px,
                ${currentPanY}px
              )
            `,

            transformOrigin:
              "center center",

            display: "block",

            zIndex: 3,
          }}
        />
      )}

      {/* ==================================================
          CINEMATIC DARK OVERLAY
      ================================================== */}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.04), rgba(0,0,0,0.16))",

          pointerEvents: "none",

          zIndex: 50,
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

          zIndex: 51,
        }}
      />

      {/* ==================================================
          FINAL BLACK FADE
      ================================================== */}

      <AbsoluteFill
        style={{
          backgroundColor: "#000000",

          opacity: finalFade,

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

export default Template20;