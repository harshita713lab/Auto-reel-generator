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

const glassCardStyle = {
  background: "rgba(255,255,255,.12)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,.18)",
  borderRadius: 22,
  overflow: "hidden" as const,
  boxShadow: "0 12px 40px rgba(0,0,0,.28)",
  position: "relative" as const,
};

export const PremiumGrid: React.FC<PremiumGridProps> = ({
  images = [],
  backgroundColor = "linear-gradient(135deg,#0a0a1a,#1a1a3e)",
  gap = 16,
  title = "PREMIUM REEL",
  beatTimestamps = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beatScale = getBeatScale(frame, fps, beatTimestamps);

  const imageList = images.slice(0, 4);
  
  // Timeline setup for 15 Seconds (450 frames at 30 fps)
  // Phase 1 (0 to 130 frames / ~4.3s): Collage Grid FIRST
  // Phase 2 (130 to 450 frames / ~10.7s): 1-by-1 Full Images AFTER
  const gridEndFrame = 130;
  const isGridPhase = frame < gridEndFrame;

  const spotlightFrame = Math.max(0, frame - gridEndFrame);
  const spotlightDuration = 80; // ~2.67s per photo full showcase
  const currentSpotlightIndex = !isGridPhase && imageList.length > 0
    ? Math.min(imageList.length - 1, Math.floor(spotlightFrame / spotlightDuration))
    : 0;

  const spotlightLocalFrame = spotlightFrame % spotlightDuration;
  const spotlightOpacity = interpolate(
    spotlightLocalFrame,
    [0, 10, spotlightDuration - 10, spotlightDuration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: backgroundColor,
        padding: 30,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Gold Corner Decorations */}
      {[
        { top: 18, left: 18 },
        { top: 18, right: 18 },
        { bottom: 18, left: 18 },
        { bottom: 18, right: 18 },
      ].map((corner, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 42,
            height: 42,
            top: corner.top,
            bottom: corner.bottom,
            left: corner.left,
            right: corner.right,
            borderTop: corner.top !== undefined ? "2px solid rgba(255,215,0,.45)" : undefined,
            borderBottom: corner.bottom !== undefined ? "2px solid rgba(255,215,0,.45)" : undefined,
            borderLeft: corner.left !== undefined ? "2px solid rgba(255,215,0,.45)" : undefined,
            borderRight: corner.right !== undefined ? "2px solid rgba(255,215,0,.45)" : undefined,
            zIndex: 30,
          }}
        />
      ))}

      {/* Clean Title */}
      {title && (
        <div
          style={{
            position: "absolute",
            top: 45,
            width: "100%",
            textAlign: "center",
            color: "#ffffff",
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: 3,
            zIndex: 30,
            textShadow: "0 2px 10px rgba(0,0,0,0.6)",
          }}
        >
          {title}
        </div>
      )}

      {/* PHASE 1: Grand 2x2 Premium Grid Collage FIRST (Frames 0 - 130) */}
      {isGridPhase && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap,
            paddingTop: 80,
            transform: `scale(${beatScale})`,
            opacity: interpolate(frame, [0, 15, 115, 130], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {imageList.map((img, index) => (
            <div
              key={index}
              style={{
                ...glassCardStyle,
              }}
            >
              <AnimatedImage
                src={img.path}
                animation="kenBurns"
                durationInFrames={130}
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
                ...glassCardStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,.25)",
                fontSize: 60,
                fontWeight: 300,
                background: "rgba(255,255,255,.05)",
              }}
            >
              +
            </div>
          ))}
        </div>
      )}

      {/* PHASE 2: 1-by-1 Full-Screen Images Showcase AFTER (Frames 130 - 450) */}
      {!isGridPhase && imageList[currentSpotlightIndex] && (
        <div
          style={{
            width: "90%",
            height: "80%",
            marginTop: 30,
            opacity: spotlightOpacity,
            transform: `scale(${beatScale})`,
            zIndex: 20,
            ...glassCardStyle,
          }}
        >
          <AnimatedImage
            src={imageList[currentSpotlightIndex].path}
            animation="kenBurns"
            durationInFrames={spotlightDuration}
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