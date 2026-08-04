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
  const { fps } = useVideoConfig();
  const beatScale = getBeatScale(frame, fps, beatTimestamps);

  const imageList = images.slice(0, 9);
  
  // Phase 1 (0 to 150 frames / 0-5s): 3x3 Collage Grid FIRST
  // Phase 2 (150 to 450 frames / 5-15s): 1-by-1 Full Images AFTER
  const gridEndFrame = 150;
  const isGridPhase = frame < gridEndFrame;

  const spotlightFrame = Math.max(0, frame - gridEndFrame);
  const spotlightDurationPerImage = 33; // ~1.1s per photo
  const currentSpotlightIndex = !isGridPhase && imageList.length > 0
    ? Math.min(imageList.length - 1, Math.floor(spotlightFrame / spotlightDurationPerImage))
    : 0;

  const spotlightLocalFrame = spotlightFrame % spotlightDurationPerImage;
  const spotlightOpacity = interpolate(
    spotlightLocalFrame,
    [0, 8, spotlightDurationPerImage - 8, spotlightDurationPerImage],
    [0, 1, 1, 0],
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
        background: "linear-gradient(135deg,#fafafa,#ececec)",
        overflow: "hidden",
        transform: `scale(${beatScale})`,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 45,
          width: "100%",
          textAlign: "center",
          fontSize: 38,
          fontWeight: 600,
          letterSpacing: 4,
          color: "#333",
          zIndex: 30,
        }}
      >
        GALLERY HIGHLIGHTS
      </div>

      {/* PHASE 1: 3x3 Card Grid Collage FIRST (Frames 0 - 150) */}
      {isGridPhase && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            opacity: interpolate(frame, [0, 15, 135, 150], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {positions.map((pos, index) => {
            const localFrame = Math.max(frame - index * 4, 0);
            const entrance = spring({
              frame: localFrame,
              fps,
              config: { damping: 15, stiffness: 120 },
            });

            const imageScale =
              index === 0
                ? interpolate(frame, [0, 150], [1, 1.08])
                : interpolate(frame, [0, 150], [1, 1.03]);

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
                  borderRadius: 22,
                  border: "8px solid white",
                  overflow: "hidden",
                  opacity: entrance,
                  transform: `translateY(${40 * (1 - entrance) + floatY}px)`,
                  boxShadow: "0 12px 40px rgba(0,0,0,.18)",
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

      {/* PHASE 2: 1-by-1 Full Photos Showcase AFTER (Frames 150 - 450) */}
      {!isGridPhase && imageList[currentSpotlightIndex] && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
            paddingTop: 100,
            opacity: spotlightOpacity,
            zIndex: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "80%",
              borderRadius: 28,
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.22)",
              background: "#fff",
              border: "10px solid white",
              position: "relative",
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
        </div>
      )}
    </AbsoluteFill>
  );
};

export default WhiteCardGrid3x3;