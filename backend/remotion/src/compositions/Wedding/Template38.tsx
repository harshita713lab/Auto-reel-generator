import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
} from "remotion";

import { MusicPlayer } from "../../components";
import { SmartCutout } from "../../components/SmartCutout";

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
  url?: string; // Yeh property yahan add kar di gayi hai
}

interface Music {
  path: string;
  volume?: number;
}

interface FastCutoutReelProps {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIG
// ======================================================

export const FPS = 30;
export const DURATION_IN_FRAMES = 300; // 10 seconds total
export const IMAGE_COUNT = 6;

// Background images kitni tezi se change hongi
const BG_IMAGE_CHANGE_SPEED = 12; 

const LYRICS = "No one can be You to me.";

// Fallback images
const DEFAULT_IMAGES: ImageItem[] = [
  { path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" },
  { path: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop" },
  { path: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop" },
  { path: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop" },
  { path: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1000&auto=format&fit=crop" },
];

// ======================================================
// MAIN COMPONENT
// ======================================================

export const FastCutoutReel: React.FC<FastCutoutReelProps> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();
  const musicSrc = typeof music === "string" ? music : music?.path;

  const safeImages = images.length > 0 ? images : DEFAULT_IMAGES;

  // 1. Foreground image: Pehli image
  const foregroundImage = safeImages[0]?.url || safeImages[0]?.path || "";

  // 2. Background images list
  const bgList = safeImages.slice(1).length > 0 
    ? safeImages.slice(1).map(img => img.url || img.path)
    : safeImages.map(img => img.url || img.path);

  // Fast background slideshow logic
  const bgIndex = Math.floor(frame / BG_IMAGE_CHANGE_SPEED) % bgList.length;
  const currentBgImg = bgList[bgIndex];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      
      {/* ==================================================
          1. FAST-PACED BACKGROUND LAYER
         ================================================== */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          key={bgIndex}
          src={currentBgImg}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "grayscale(100%) brightness(0.55) contrast(130%)",
            transform: "scale(1.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          }}
        />
      </AbsoluteFill>

      {/* ==================================================
          2. FOREGROUND CUTOUT STICKER LAYER
         ================================================== */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <SmartCutout
          src={foregroundImage}
          width="85%"
          height="75%"

        />
      </AbsoluteFill>

      {/* ==================================================
          3. CURSIVE LYRICS TEXT OVERLAY
         ================================================== */}
      <div
        style={{
          position: "absolute",
          bottom: "60px",
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 20px",
          zIndex: 30,
        }}
      >
        <span
          style={{
            fontFamily: "Brush Script MT, cursive, sans-serif",
            fontSize: "36px",
            color: "#ffffff",
            textShadow: "2px 2px 10px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255,255,255,0.4)",
            fontStyle: "italic",
            letterSpacing: "1px",
          }}
        >
          {LYRICS}
        </span>
      </div>

      {/* ==================================================
          4. MUSIC PLAYER
         ================================================== */}
      {musicSrc && <MusicPlayer src={musicSrc} volume={music?.volume ?? 1} />}

    </AbsoluteFill>
  );
};

export default FastCutoutReel;