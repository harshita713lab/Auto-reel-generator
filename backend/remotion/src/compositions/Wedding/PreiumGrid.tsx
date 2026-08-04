import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { AnimatedImage } from "../../components";
import { getBeatScale } from "../../utils/beatUtils";

interface PremiumGridProps {
  images?: Array<{ path: string }>;
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

export const PremiumGrid: React.FC<PremiumGridProps> = ({
  images = [],
  backgroundColor = "#000000",
  gap = 16,
  beatTimestamps = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const beatScale = getBeatScale(frame, fps, beatTimestamps);

  const imageList = images.slice(0, 4);
  
  // Phase 1 (0 to 120 frames / 0-4s): 2x2 Collage Grid FIRST
  // Phase 2 (120 to 450 frames / 4-15s): 1-by-1 FAST Full Reel Showcase AFTER
  const gridEndFrame = 120;
  const isGridPhase = frame < gridEndFrame;

  const spotlightFrame = Math.max(0, frame - gridEndFrame);
  const spotlightDurationPerImage = 82; // ~2.73s per photo
  const currentSpotlightIndex = !isGridPhase && imageList.length > 0
    ? Math.min(imageList.length - 1, Math.floor(spotlightFrame / spotlightDurationPerImage))
    : 0;

  const spotlightLocalFrame = spotlightFrame % spotlightDurationPerImage;

  // FAST Left / Right Slide Entry (-width if even index, +width if odd index)
  const isEven = currentSpotlightIndex % 2 === 0;
  const startX = isEven ? -width : width;

  const slideX = interpolate(
    spotlightLocalFrame,
    [0, 10], // Fast 10-frame (~0.33s) snappy slide entry
    [startX, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* PHASE 1: 2x2 Collage Grid FIRST (Frames 0 - 120) */}
      {isGridPhase && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap,
            padding: 20,
            transform: `scale(${beatScale})`,
            opacity: interpolate(frame, [0, 10, 110, 120], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {imageList.map((img, index) => (
            <div
              key={index}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <AnimatedImage
                src={img.path}
                animation="kenBurns"
                durationInFrames={120}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}

          {Array.from({ length: Math.max(0, 4 - imageList.length) }).map((_, index) => (
            <div
              key={`empty-${index}`}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                background: "rgba(255,255,255,.08)",
              }}
            />
          ))}
        </div>
      )}

      {/* PHASE 2: 1-by-1 FULL REEL Showcase (No Text, Fast Left/Right Slide) (Frames 120 - 450) */}
      {!isGridPhase && imageList[currentSpotlightIndex] && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            transform: `translateX(${slideX}px) scale(${beatScale})`,
            zIndex: 20,
            overflow: "hidden",
          }}
        >
          <AnimatedImage
            src={imageList[currentSpotlightIndex].path}
            animation="kenBurns"
            durationInFrames={spotlightDurationPerImage}
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