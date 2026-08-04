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

interface ImageItem {
  path: string;
}

interface WhiteCardMasonryProps {
  images?: ImageItem[];
  music?: {
    path: string;
    volume?: number;
  };
  backgroundColor?: string;
  title?: string;
  beatTimestamps?: number[];
}

export const WhiteCardMasonry: React.FC<WhiteCardMasonryProps> = ({
  images = [],
  backgroundColor = "#000000",
  beatTimestamps = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const beatScale = getBeatScale(frame, fps, beatTimestamps);

  const imageList = images.slice(0, 8);
  
  // Phase 1 (0 to 120 frames / 0-4s): Masonry Collage FIRST
  // Phase 2 (120 to 450 frames / 4-15s): 1-by-1 FAST Full Reel Showcase AFTER
  const gridEndFrame = 120;
  const isGridPhase = frame < gridEndFrame;

  const spotlightFrame = Math.max(0, frame - gridEndFrame);
  const spotlightDurationPerImage = 41; // ~1.37s per photo
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

  const page1 = imageList.slice(0, 6);
  const page2 = imageList.slice(2, 8);

  const slideStart = 50;

  const page1X = interpolate(
    frame,
    [slideStart, slideStart + 25],
    [0, -width],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const page2X = interpolate(
    frame,
    [slideStart, slideStart + 25],
    [width, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const renderCard = (img: ImageItem, index: number) => {
    const delay = index * 2;
    const enter = spring({
      fps,
      frame: frame - delay,
      config: { damping: 15, stiffness: 80 },
    });

    const y = interpolate(enter, [0, 1], [100, 0]);
    const scale = interpolate(enter, [0, 1], [0.85, 1]);

    return (
      <div
        key={index}
        style={{
          flex: 1,
          overflow: "hidden",
          borderRadius: 16,
          background: "#111",
          boxShadow: "0 10px 30px rgba(0,0,0,.5)",
          transform: `translateY(${y}px) scale(${scale})`,
        }}
      >
        <Img
          src={img.path}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    );
  };

  const renderPage = (page: ImageItem[]) => {
    const left = page.filter((_, i) => i % 2 === 0);
    const right = page.filter((_, i) => i % 2 === 1);

    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          gap: 16,
          padding: 20,
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {left.map((img, i) => renderCard(img, i * 2))}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {right.map((img, i) => renderCard(img, i * 2 + 1))}
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{
        background: backgroundColor,
        overflow: "hidden",
      }}
    >
      {/* PHASE 1: Masonry Wall Collage FIRST (Frames 0 - 120) */}
      {isGridPhase && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${beatScale})`,
            opacity: interpolate(frame, [0, 10, 110, 120], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateX(${page1X}px)`,
            }}
          >
            {renderPage(page1)}
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateX(${page2X}px)`,
            }}
          >
            {renderPage(page2)}
          </div>
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

export default WhiteCardMasonry;