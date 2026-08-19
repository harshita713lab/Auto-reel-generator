import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
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

interface ExactReelProps {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIG
// ======================================================

export const FPS = 30;
export const DURATION_IN_FRAMES = 750; // 25 seconds
export const IMAGE_COUNT = 10;

// ======================================================
// LYRIC TYPE
// ======================================================

interface LyricLine {
  startFrame: number;
  endFrame: number;
  text: string;
  imageIndex: number;
}

// ======================================================
// TIMELINE
// ======================================================

const LYRICS_TIMELINE: LyricLine[] = [
  // ====================================================
  // INTRO — 0 TO 5 SECONDS
  // Black background + text one by one
  // ====================================================

  // 0 - 1.25 sec
  {
    startFrame: 0,
    endFrame: 38,
    text: "MUJHE 🫶",
    imageIndex: 0,
  },

  // 1.25 - 2.5 sec
  {
    startFrame: 38,
    endFrame: 75,
    text: "Har PAAL",
    imageIndex: 0,
  },

  // 2.5 - 3.75 sec
  {
    startFrame: 75,
    endFrame: 113,
    text: "💌 Tere Rehna",
    imageIndex: 0,
  },

  // 3.75 - 5 sec
  {
    startFrame: 113,
    endFrame: 150,
    text: "HAI <3 SATH",
    imageIndex: 0,
  },

  // ====================================================
  // MAIN REEL — 5 SECONDS ONWARDS
  // ====================================================

  // 5 - 7 sec
  {
    startFrame: 150,
    endFrame: 210,
    text: "tm kch adhory sy <3",
    imageIndex: 0,
  },

  // 7 - 9 sec
  {
    startFrame: 210,
    endFrame: 270,
    text: "hm bh kch adhe hn",
    imageIndex: 1,
  },

  // 9 - 11 sec
  {
    startFrame: 270,
    endFrame: 330,
    text: "adha adha hm to dono mila dein",
    imageIndex: 2,
  },

  // 11 - 13 sec
  {
    startFrame: 330,
    endFrame: 390,
    text: "tou ban jaygi apni ek zindagani",
    imageIndex: 3,
  },

  // 13 - 15 sec
  {
    startFrame: 390,
    endFrame: 450,
    text: "ye duniya mile na mile humko",
    imageIndex: 4,
  },

  // 15 - 17 sec
  {
    startFrame: 450,
    endFrame: 510,
    text: "khushiya bhaga dengi har gum ko",
    imageIndex: 5,
  },

  // 17 - 19 sec
  {
    startFrame: 510,
    endFrame: 570,
    text: "tum sath ho phir kya baki ho",
    imageIndex: 6,
  },

  // 19 - 23 sec
  {
    startFrame: 570,
    endFrame: 690,
    text: "mery liye tm kafi ho",
    imageIndex: 7,
  },

  // 23 - 25 sec
  {
    startFrame: 690,
    endFrame: 750,
    text: "🥰",
    imageIndex: 8,
  },
];

// ======================================================
// DEFAULT IMAGES
// ======================================================

const DEFAULT_IMAGES: ImageItem[] = Array.from(
  { length: 10 },
  (_, index) => ({
    path: `https://images.unsplash.com/photo-${
      1500000000000 + index * 1000
    }?q=80&w=1000&auto=format&fit=crop`,
  })
);

// ======================================================
// MAIN COMPONENT
// ======================================================

export const ExactReel: React.FC<ExactReelProps> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();

  // ====================================================
  // MUSIC
  // ====================================================

  const musicSrc =
    typeof music === "string"
      ? music
      : music?.path;

  // ====================================================
  // SAFE IMAGES
  // ====================================================
  // IMPORTANT:
  // If user uploads even ONE image,
  // use that image instead of DEFAULT_IMAGES.
  //
  // For Template38 (1 image):
  // same image will repeat throughout the reel.
  // ====================================================

  const safeImages =
    images.length > 0
      ? images
      : DEFAULT_IMAGES;

  // ====================================================
  // CURRENT LYRIC
  // ====================================================

  const currentLyric =
    LYRICS_TIMELINE.find(
      (item) =>
        frame >= item.startFrame &&
        frame < item.endFrame
    ) || LYRICS_TIMELINE[0];

  // ====================================================
  // IMAGE VISIBILITY
  // ====================================================

  // First 5 seconds = black screen
  // After 5 seconds = image visible

  const showImage = frame >= 150;

  // ====================================================
  // SAFE IMAGE INDEX
  // ====================================================
  // This is VERY important for 1-image reel.
  //
  // Example:
  // imageIndex = 5
  // images.length = 1
  //
  // 5 % 1 = 0
  //
  // So the same image is safely reused.
  // ====================================================

  const activeImgIndex =
    currentLyric.imageIndex % safeImages.length;

  const currentImage =
    safeImages[activeImgIndex];

  const currentImg =
    currentImage?.url ||
    currentImage?.path;

  // ====================================================
  // IMAGE ZOOM
  // ====================================================

  const scale = interpolate(
    frame % 60,
    [0, 30, 60],
    [1, 1.02, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // INTRO TEXT FADE
  // ====================================================

  const introTextOpacity =
    frame < 150
      ? interpolate(
          frame % 38,
          [0, 7, 30, 38],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        )
      : 1;

  // ====================================================
  // MAIN LYRIC FADE
  // ====================================================

  const lyricDuration =
    currentLyric.endFrame -
    currentLyric.startFrame;

  const lyricFrame =
    frame - currentLyric.startFrame;

  const lyricOpacity =
    frame >= 150
      ? interpolate(
          lyricFrame,
          [
            0,
            8,
            Math.max(9, lyricDuration - 8),
            lyricDuration,
          ],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        )
      : introTextOpacity;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* ==================================================
          IMAGE
          ================================================== */}

      {showImage && currentImg && (
        <div
          style={{
            width: "85%",
            height: "65%",
            position: "relative",
            overflow: "hidden",
            borderRadius: "8px",
            boxShadow:
              "0px 10px 30px rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
      )}

      {/* ==================================================
          TEXT OVERLAY
          ================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 20,
          padding: "0 20px",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "sans-serif",

            fontSize:
              frame < 150
                ? "36px"
                : "32px",

            color: "#ffffff",

            textShadow:
              "2px 2px 8px rgba(0, 0, 0, 0.9)",

            fontWeight: "bold",

            whiteSpace: "pre-line",

            lineHeight: "1.4",

            opacity: lyricOpacity,
          }}
        >
          {currentLyric.text}
        </span>
      </div>

      {/* ==================================================
          WATERMARK
          ================================================== */}

      <div
        style={{
          position: "absolute",
          bottom: "30px",
          width: "100%",
          textAlign: "center",
          zIndex: 30,
        }}
      >
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: "12px",
            color:
              "rgba(255, 255, 255, 0.5)",
            letterSpacing: "1px",
          }}
        >
          @melodious_tanuu
        </span>
      </div>

      {/* ==================================================
          MUSIC
          ================================================== */}

      {musicSrc && (
        <MusicPlayer
          src={musicSrc}
          volume={music?.volume ?? 1}
        />
      )}
    </AbsoluteFill>
  );
};

// ======================================================
// EXPORT
// ======================================================

export default ExactReel;