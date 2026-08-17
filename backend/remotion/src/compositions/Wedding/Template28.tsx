import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
}

interface Template28Props {
  images?: ImageItem[];
}

// ======================================================
// CONFIG
// ======================================================

export const FPS = 30;

// Total Duration = 12 seconds
export const DURATION_IN_FRAMES = 360;

// 9 Grid + 6 Slide + 3 Zoom + 5 Normal = 23
export const IMAGE_COUNT = 22;

// ======================================================
// HELPER
// ======================================================

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// TEMPLATE 28
// ======================================================

export const Template28: React.FC<Template28Props> = ({
  images = [],
}) => {
  const frame = useCurrentFrame();

  // ====================================================
  // IMAGE VALIDATION
  // ====================================================

  if (images.length < IMAGE_COUNT) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          color: "#fff",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 38,
          fontFamily: "Arial",
        }}
      >
        Need 23 images
      </AbsoluteFill>
    );
  }

  // ====================================================
  // 9 GRID POSITIONS
  // ====================================================

  const positions = [
    {
      left: "0%",
      top: "0%",
      width: "33.33%",
      height: "33.33%",
    },
    {
      left: "33.33%",
      top: "0%",
      width: "33.33%",
      height: "33.33%",
    },
    {
      left: "66.66%",
      top: "0%",
      width: "33.33%",
      height: "33.33%",
    },

    {
      left: "0%",
      top: "33.33%",
      width: "33.33%",
      height: "33.33%",
    },
    {
      left: "33.33%",
      top: "33.33%",
      width: "33.33%",
      height: "33.33%",
    },
    {
      left: "66.66%",
      top: "33.33%",
      width: "33.33%",
      height: "33.33%",
    },

    {
      left: "0%",
      top: "66.66%",
      width: "33.33%",
      height: "33.33%",
    },
    {
      left: "33.33%",
      top: "66.66%",
      width: "33.33%",
      height: "33.33%",
    },
    {
      left: "66.66%",
      top: "66.66%",
      width: "33.33%",
      height: "33.33%",
    },
  ];

  // ====================================================
  // PHASE 1
  // 0 - 2 SEC
  // FIRST 9 IMAGES
  // B&W GRID
  // ONE-BY-ONE APPEAR
  // ====================================================

  if (frame < 60) {
    const collageScale = interpolate(
      frame,
      [0, 15, 60],
      [1.15, 1.0, 1.05],
      {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      }
    );

    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          overflow: "hidden",
        }}
      >
        {/* Background */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 50% 45%, #292929 0%, #090909 48%, #000 100%)",
          }}
        />

        {/* 9 IMAGE GRID */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${collageScale})`,
            transformOrigin: "center center",
          }}
        >
          {images.slice(0, 9).map((image, index) => {
            const position = positions[index];

            // --------------------------------------------
            // Each image starts 6 frames after previous
            // --------------------------------------------

            const imageStart = index * 6;

            const progress = interpolate(
              frame,
              [imageStart, imageStart + 8],
              [0, 1],
              {
                ...clamp,
                easing: Easing.out(Easing.cubic),
              }
            );

            // Fade in
            const opacity = interpolate(
              frame,
              [imageStart, imageStart + 6],
              [0, 1],
              clamp
            );

            // Small zoom while appearing
            const scale = interpolate(
              progress,
              [0, 1],
              [1.15, 1],
              {
                ...clamp,
                easing: Easing.out(Easing.cubic),
              }
            );

            // Alternate slight slide direction
            const fromLeft = index % 2 === 0;

            const translateX = interpolate(
              progress,
              [0, 1],
              fromLeft
                ? [-25, 0]
                : [25, 0],
              {
                ...clamp,
                easing: Easing.out(Easing.cubic),
              }
            );

            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  ...position,
                  overflow: "hidden",
                  zIndex: 10 + index,
                  border: "2px solid rgba(0,0,0,0.8)",
                  opacity,
                  transform: `translateX(${translateX}%) scale(${scale})`,
                  transformOrigin: "center center",
                }}
              >
                <Img
                  src={image.path}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter:
                      "grayscale(100%) brightness(0.95) contrast(1.15)",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* FLASH AT 2 SEC */}
        <AbsoluteFill
          style={{
            backgroundColor: "#fff",
            opacity: interpolate(
              frame,
              [55, 58, 60],
              [0, 0.5, 0],
              clamp
            ),
            zIndex: 130,
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    );
  }

  // ====================================================
  // PHASE 2
  // 2 - 4 SEC
  // SAME 9 IMAGES
  // B&W → COLOR
  // ====================================================

  if (frame < 120) {
    const scene2Frame = frame - 60;

    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          overflow: "hidden",
        }}
      >
        {/* Background */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 50% 45%, #292929 0%, #090909 48%, #000 100%)",
          }}
        />

        {/* GRID */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "scale(1.05)",
            transformOrigin: "center center",
          }}
        >
          {images.slice(0, 9).map((image, index) => {
            const position = positions[index];

            // Each box gets 6 frames
            const boxStartFrame = index * 6;

            const colorProgress = interpolate(
              scene2Frame,
              [boxStartFrame, boxStartFrame + 6],
              [0, 1],
              clamp
            );

            // Grayscale
            const grayscaleVal = interpolate(
              colorProgress,
              [0, 1],
              [100, 0],
              clamp
            );

            // Brightness
            const brightnessVal = interpolate(
              colorProgress,
              [0, 1],
              [0.95, 1.05],
              clamp
            );

            // Contrast
            const contrastVal = interpolate(
              colorProgress,
              [0, 1],
              [1.15, 1.05],
              clamp
            );

            // Small pop
            const cellScale = interpolate(
              colorProgress,
              [0, 0.5, 1],
              [1, 1.04, 1],
              {
                ...clamp,
                easing: Easing.out(Easing.cubic),
              }
            );

            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  ...position,
                  overflow: "hidden",
                  zIndex: 10 + index,
                  border: "2px solid rgba(0,0,0,0.8)",
                  transform: `scale(${cellScale})`,
                  transformOrigin: "center center",
                }}
              >
                <Img
                  src={image.path}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: `grayscale(${grayscaleVal}%) brightness(${brightnessVal}) contrast(${contrastVal})`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* VIGNETTE */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.6) 100%)",
            opacity: 0.85,
            zIndex: 120,
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    );
  }

  // ====================================================
  // PHASE 3
  // 4 - 10 SEC
  // NEXT 6 IMAGES
  // LEFT / RIGHT SLIDE
  //
  // images[9]  → Left
  // images[10] → Right
  // images[11] → Left
  // images[12] → Right
  // images[13] → Left
  // images[14] → Right
  // ====================================================

  if (frame < 300) {
    const scene3Frame = frame - 120;

    // 6 images / 6 seconds
    // 1 second each
    const imageDuration = 30;

    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          overflow: "hidden",
        }}
      >
        {images.slice(9, 15).map((image, index) => {
          const startFrame = index * imageDuration;
          const endFrame = startFrame + imageDuration;

          const fromLeft = index % 2 === 0;

          // --------------------------------------------
          // SLIDE IN
          // --------------------------------------------

          const slideIn = interpolate(
            scene3Frame,
            [startFrame, startFrame + 10],
            fromLeft
              ? [-100, 0]
              : [100, 0],
            {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            }
          );

          // --------------------------------------------
          // SLIDE OUT
          // --------------------------------------------

          const slideOut = interpolate(
            scene3Frame,
            [endFrame - 10, endFrame],
            [0, fromLeft ? 100 : -100],
            {
              ...clamp,
              easing: Easing.in(Easing.cubic),
            }
          );

          const translateX =
            scene3Frame < endFrame - 10
              ? slideIn
              : slideOut;

          // --------------------------------------------
          // OPACITY
          // --------------------------------------------

          const opacity = interpolate(
            scene3Frame,
            [
              startFrame,
              startFrame + 6,
              endFrame - 6,
              endFrame,
            ],
            [0, 1, 1, 0],
            clamp
          );

          // --------------------------------------------
          // SMALL SCALE
          // --------------------------------------------

          const scale = interpolate(
            scene3Frame,
            [startFrame, startFrame + 10],
            [1.05, 1],
            {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            }
          );

          return (
            <Img
              key={index}
              src={image.path}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity,
                transform: `translateX(${translateX}%) scale(${scale})`,
              }}
            />
          );
        })}

        {/* Cinematic overlay */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.15), transparent 50%, rgba(0,0,0,0.15))",
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    );
  }

  // ====================================================
  // PHASE 4
  // 10 - 11 SEC
  // NEXT 3 IMAGES
  // ZOOM IN
  //
  // images[15]
  // images[16]
  // images[17]
  // ====================================================

  if (frame < 330) {
    const scene4Frame = frame - 300;

    // 30 frames / 3 images
    // 10 frames each
    const imageDuration = 10;

    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          overflow: "hidden",
        }}
      >
        {images.slice(15, 18).map((image, index) => {
          const startFrame = index * imageDuration;
          const endFrame = startFrame + imageDuration;

          // --------------------------------------------
          // PROGRESS
          // --------------------------------------------

          const progress = interpolate(
            scene4Frame,
            [startFrame, endFrame],
            [0, 1],
            {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            }
          );

          // --------------------------------------------
          // OPACITY
          // --------------------------------------------

          const opacity = interpolate(
            scene4Frame,
            [
              startFrame,
              startFrame + 3,
              endFrame - 2,
              endFrame,
            ],
            [0, 1, 1, 0],
            clamp
          );

          // --------------------------------------------
          // ZOOM IN
          // --------------------------------------------

          const scale = interpolate(
            progress,
            [0, 1],
            [1, 1.15],
            {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            }
          );

          return (
            <Img
              key={index}
              src={image.path}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity,
                transform: `scale(${scale})`,
              }}
            />
          );
        })}
      </AbsoluteFill>
    );
  }

  // ====================================================
  // PHASE 5
  // 11 - 12 SEC
  // LAST 5 IMAGES
  // NORMAL SHOW
  //
  // images[18]
  // images[19]
  // images[20]
  // images[21]
  // images[22]
  // ====================================================

  const scene5Frame = frame - 330;

  // 30 frames / 5 images
  // 6 frames each
  const finalImageDuration = 6;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {images.slice(18, 22).map((image, index) => {
        const startFrame = index * finalImageDuration;
        const endFrame = startFrame + finalImageDuration;

        const opacity = interpolate(
          scene5Frame,
          [
            startFrame,
            startFrame + 2,
            endFrame - 2,
            endFrame,
          ],
          [0, 1, 1, 0],
          clamp
        );

        return (
          <Img
            key={index}
            src={image.path}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export default Template28;