import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

import { MusicPlayer } from "../../components";

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
  url?: string;
}

interface Music {
  path: string;
  volume?: number;
}

interface GridSplitReelProps {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIG
// ======================================================

export const FPS = 30;
export const DURATION_IN_FRAMES = 300; // 10 seconds total
export const IMAGE_COUNT = 1;

const LYRICS = "Chuliya tune";

// Fallback images agar images array empty ho
export const DEFAULT_IMAGES: ImageItem[] = [
  { path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" },
];

export const DEFAULT_PROPS: GridSplitReelProps = {
  images: DEFAULT_IMAGES,
  music: undefined,
};

// ======================================================
// MAIN COMPONENT
// ======================================================

export const GridSplitReel: React.FC<GridSplitReelProps> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const musicSrc = typeof music === "string" ? music : music?.path;

  const safeImages = images.length > 0 ? images : DEFAULT_IMAGES;
  const currentImg = safeImages[0]?.url || safeImages[0]?.path;

  // Animation logic for split screen boxes (zoom & subtle movement)
  const scale = interpolate(
    frame % 60,
    [0, 30, 60],
    [1, 1.05, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      
      {/* ==================================================
          TOP BOX (1st Split)
          ================================================== */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", borderBottom: "4px solid #000" }}>
        <Img
          src={currentImg}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(2px) brightness(0.8)",
            transform: `scale(${scale})`,
          }}
        />
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.3)" }} />
      </div>

      {/* ==================================================
          MIDDLE BOX (Main Focus Split with Border/Shadow)
          ================================================== */}
      <div style={{ flex: 1.5, position: "relative", overflow: "hidden", borderBottom: "4px solid #000", borderTop: "4px solid #000" }}>
        <Img
          src={currentImg}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
          }}
        />
      </div>

      {/* ==================================================
          BOTTOM BOX (3rd Split)
          ================================================== */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", borderTop: "4px solid #000" }}>
        <Img
          src={currentImg}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.7)",
            transform: `scale(${scale})`,
          }}
        />
      </div>

      {/* ==================================================
          TEXT LYRICS OVERLAY (Center / Dynamic)
          ================================================== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 20,
        }}
      >
        <span
          style={{
            fontFamily: "Impact, sans-serif",
            fontSize: "55px",
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: "3px",
            textShadow: "3px 3px 15px rgba(0, 0, 0, 0.9)",
          }}
        >
          {LYRICS}
        </span>
      </div>

      {/* ==================================================
          MUSIC PLAYER
          ================================================== */}
      {musicSrc && <MusicPlayer src={musicSrc} volume={music?.volume ?? 1} />}

    </AbsoluteFill>
  );
};

export const Template38 = GridSplitReel;
export default GridSplitReel;