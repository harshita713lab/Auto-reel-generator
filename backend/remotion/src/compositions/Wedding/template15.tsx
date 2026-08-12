import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { AnimatedImage } from "../../components";
import { getBeatScale } from "../../utils/beatUtils";

// ======================================================
// TEMPLATE SETTINGS
// ======================================================

export const IMAGE_COUNT = 4;
export const FPS = 30;
export const DURATION_IN_FRAMES = 450; // 15 sec

// ======================================================
// INTERFACE
// ======================================================

interface PremiumGridProps {
  images?: Array<{
    path: string;
  }>;

  music?: {
    path: string;
    volume?: number;
  };

  slideDuration?: number;

  backgroundColor?: string;

  title?: string;

  overlayText?: string;

  gap?: number;

  transition?: "fade" | "glide" | "slide" | "zoom";

  effect?: "none" | "cinematic" | "warm" | "cool" | "golden";

  showCounter?: boolean;

  beatTimestamps?: number[];
}

// ======================================================
// PREMIUM GRID
// ======================================================

export const PremiumGrid: React.FC<PremiumGridProps> = ({
  images = [],

  music,

  backgroundColor = "#000000",

  gap = 16,

  beatTimestamps = [],
}) => {
  const frame = useCurrentFrame();

  const { fps, width } = useVideoConfig();

  const beatScale = getBeatScale(
    frame,
    fps,
    beatTimestamps
  );

  // ======================================================
  // ONLY 4 IMAGES
  // ======================================================

  const imageList = images.slice(0, IMAGE_COUNT);

  // ======================================================
  // PHASE 1
  // 0 - 4 SEC
  // 2x2 COLLAGE
  // ======================================================

  const gridEndFrame = 120;

  const isGridPhase =
    frame < gridEndFrame;

  // ======================================================
  // PHASE 2
  // 4 - 15 SEC
  // FULL SCREEN SHOWCASE
  // ======================================================

  const spotlightFrame = Math.max(
    0,
    frame - gridEndFrame
  );

  const spotlightDurationPerImage = 82;

  const currentSpotlightIndex =
    !isGridPhase && imageList.length > 0
      ? Math.min(
          imageList.length - 1,
          Math.floor(
            spotlightFrame /
              spotlightDurationPerImage
          )
        )
      : 0;

  const spotlightLocalFrame =
    spotlightFrame %
    spotlightDurationPerImage;

  // ======================================================
  // LEFT / RIGHT SLIDE
  // ======================================================

  const isEven =
    currentSpotlightIndex % 2 === 0;

  const startX = isEven
    ? -width
    : width;

  const slideX = interpolate(
    spotlightLocalFrame,
    [0, 10],
    [startX, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <AbsoluteFill
      style={{
        background: backgroundColor,

        justifyContent: "center",

        alignItems: "center",

        overflow: "hidden",
      }}
    >
      {/* ==================================================
          MUSIC
      ================================================== */}

      {music?.path && (
        <Audio
          src={music.path}
          volume={music.volume ?? 1}
        />
      )}

      {/* ==================================================
          PHASE 1
          0 - 4 SEC
          2x2 COLLAGE
      ================================================== */}

      {isGridPhase && (
        <div
          style={{
            width: "100%",

            height: "100%",

            display: "grid",

            gridTemplateColumns:
              "1fr 1fr",

            gridTemplateRows:
              "1fr 1fr",

            gap,

            padding: 20,

            transform:
              `scale(${beatScale})`,

            opacity: interpolate(
              frame,
              [0, 10, 110, 120],
              [0, 1, 1, 0],
              {
                extrapolateLeft:
                  "clamp",

                extrapolateRight:
                  "clamp",
              }
            ),
          }}
        >
          {imageList.map(
            (img, index) => (
              <div
                key={index}
                style={{
                  borderRadius: 16,

                  overflow: "hidden",

                  position: "relative",

                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.5)",
                }}
              >
                <AnimatedImage
                  src={img.path}

                  animation="kenBurns"

                  durationInFrames={
                    gridEndFrame
                  }

                  style={{
                    width: "100%",

                    height: "100%",

                    objectFit: "cover",
                  }}
                />
              </div>
            )
          )}

          {/* Empty boxes if fewer than 4 images */}

          {Array.from({
            length: Math.max(
              0,
              IMAGE_COUNT -
                imageList.length
            ),
          }).map(
            (_, index) => (
              <div
                key={`empty-${index}`}
                style={{
                  borderRadius: 16,

                  overflow: "hidden",

                  background:
                    "rgba(255,255,255,.08)",
                }}
              />
            )
          )}
        </div>
      )}

      {/* ==================================================
          PHASE 2
          4 - 15 SEC
          FULL SCREEN SHOWCASE
      ================================================== */}

      {!isGridPhase &&
        imageList[
          currentSpotlightIndex
        ] && (
          <div
            style={{
              position: "absolute",

              inset: 0,

              width: "100%",

              height: "100%",

              transform:
                `translateX(${slideX}px) scale(${beatScale})`,

              zIndex: 20,

              overflow: "hidden",
            }}
          >
            <AnimatedImage
              src={
                imageList[
                  currentSpotlightIndex
                ].path
              }

              animation="kenBurns"

              durationInFrames={
                spotlightDurationPerImage
              }

              style={{
                width: "100%",

                height: "100%",

                objectFit: "cover",
              }}
            />
          </div>
        )}
    </AbsoluteFill>
  );
};

export default PremiumGrid;