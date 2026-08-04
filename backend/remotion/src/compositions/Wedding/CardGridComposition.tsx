import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { AnimatedImage } from "../../components";
import { getBeatScale } from "../../utils/beatUtils";

interface WhiteCardGrid3x3Props {
  images?: Array<{ path: string }>;
  music?: {
    path: string;
    volume?: number;
  };
  beatTimestamps?: number[];
}

export const WhiteCardGrid3x3: React.FC<WhiteCardGrid3x3Props> = ({
  images = [],
  beatTimestamps = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const beatScale = getBeatScale(frame, fps, beatTimestamps);

  const imageList = images.slice(0, 9);
  
  // Phase 1 (0 to 120 frames / 0-4s): 3x3 Collage Grid FIRST
  // Phase 2 (120 to 450 frames / 4-15s): 1-by-1 FAST Full Reel Showcase AFTER
  const gridEndFrame = 120;
  const isGridPhase = frame < gridEndFrame;

  const spotlightFrame = Math.max(0, frame - gridEndFrame);
  const spotlightDurationPerImage = 36; // ~1.2s per photo
  const currentSpotlightIndex = !isGridPhase && imageList.length > 0
    ? Math.min(imageList.length - 1, Math.floor(spotlightFrame / spotlightDurationPerImage))
    : 0;

  const spotlightLocalFrame = spotlightFrame % spotlightDurationPerImage;

  // FAST Left / Right Slide Entry
  const isEven = currentSpotlightIndex % 2 === 0;
  const startX = isEven ? -width : width;

  const slideX = interpolate(
    spotlightLocalFrame,
    [0, 8], // Fast 8-frame snappy slide entry
    [startX, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const positions = [
    // Hero
    { left: 90, top: 60, width: 900, height: 650 },
    // Row 1
    { left: 120, top: 820, width: 400, height: 220 },
    { left: 560, top: 820, width: 400, height: 220 },
    // Row 2
    { left: 120, top: 1070, width: 400, height: 220 },
    { left: 560, top: 1070, width: 400, height: 220 },
    // Row 3
    { left: 120, top: 1320, width: 400, height: 220 },
    { left: 560, top: 1320, width: 400, height: 220 },
    // Row 4
    { left: 120, top: 1570, width: 400, height: 220 },
    { left: 560, top: 1570, width: 400, height: 220 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        overflow: "hidden",
      }}
    >
      {/* PHASE 1: 3x3 Card Grid Collage FIRST (Frames 0 - 120) */}
      {isGridPhase && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            transform: `scale(${beatScale})`,
            opacity: interpolate(frame, [0, 10, 110, 120], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {positions.map((pos, index) => {
            const localFrame = Math.max(frame - index * 3, 0);
            const entrance = spring({
              frame: localFrame,
              fps,
              config: { damping: 15, stiffness: 120 },
            });

            const imageScale =
              index === 0
                ? interpolate(frame, [0, 120], [1, 1.08])
                : interpolate(frame, [0, 120], [1, 1.03]);

            const floatY = Math.sin((frame + index * 10) / 20) * 3;

            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: pos.left,
                  top: pos.top,
                  width: pos.width,
                  height: pos.height,
                  background: "#fff",
                  borderRadius: 18,
                  border: "6px solid white",
                  overflow: "hidden",
                  opacity: entrance,
                  transform: `translateY(${40 * (1 - entrance) + floatY}px)`,
                  boxShadow: "0 12px 40px rgba(0,0,0,.3)",
                }}
              >
                <Img
                  src={imageList[index]?.path}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    transform: `scale(${imageScale})`,
                  }}
                />
              </div>
            );
          })}
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

export default WhiteCardGrid3x3;