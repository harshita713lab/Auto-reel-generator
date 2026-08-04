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
  backgroundColor = "#f5f5f5",
  title = "MASONRY GALLERY",
  beatTimestamps = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const beatScale = getBeatScale(frame, fps, beatTimestamps);

  const imageList = images.slice(0, 8);
  
  // Phase 1 (0 to 150 frames / 0-5s): Collage FIRST
  // Phase 2 (150 to 450 frames / 5-15s): 1-by-1 Full Images AFTER
  const gridEndFrame = 150;
  const isGridPhase = frame < gridEndFrame;

  const spotlightFrame = Math.max(0, frame - gridEndFrame);
  const spotlightDurationPerImage = 37; // ~1.23s per photo
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

  const page1 = imageList.slice(0, 6);
  const page2 = imageList.slice(2, 8);

  const slideStart = 60; // relative to frame

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
    const delay = index * 3;
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
          borderRadius: 24,
          background: "#fff",
          boxShadow: "0 20px 50px rgba(0,0,0,.18)",
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg,transparent,rgba(0,0,0,.2))",
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
          gap: 20,
          padding: 30,
          paddingTop: 100,
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          {left.map((img, i) => renderCard(img, i * 2))}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
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
        transform: `scale(${beatScale})`,
      }}
    >
      {/* Title */}
      {title && (
        <div
          style={{
            position: "absolute",
            top: 45,
            width: "100%",
            textAlign: "center",
            fontSize: 38,
            fontWeight: 600,
            letterSpacing: 4,
            color: "#222",
            zIndex: 30,
          }}
        >
          {title}
        </div>
      )}

      {/* PHASE 1: Masonry Wall Collage FIRST (Frames 0 - 150) */}
      {isGridPhase && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: interpolate(frame, [0, 15, 135, 150], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
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
              boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
              background: "#fff",
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

export default WhiteCardMasonry;