import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { MusicPlayer } from "../../components"; // ✅ MusicPlayer Import

// ======================================================
// INTERFACE
// ======================================================

interface ImageItem {
  path: string;
}

interface Template7Props {
  images?: ImageItem[];
  music?: string; // ✅ Music Prop
}

// ======================================================
// AUTO REGISTRATION
// ======================================================

export const IMAGE_COUNT = 8;

export const DURATION_IN_FRAMES = 270; // 9 sec @ 30fps

export const DEFAULT_PROPS = {
  images: [],
  music: undefined, // ✅ Default undefined (कोई Fallback नहीं)
};

// ======================================================
// DURATIONS
// ======================================================

const SCENE1_DURATION = 150; // 0 - 5 sec
const SCENE2_DURATION = 120; // 5 - 9 sec

// ======================================================
// SCENE 1
// 0 - 5 SEC
// 4 MOVING CARDS
// ======================================================

const Scene1: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const sceneImages = images
    .slice(0, 4)
    .filter((img) => img?.path);

  const CARD_SIZE = 460;

  const positions = [
    // 1 — Top Right
    { x: 620, y: 30 },

    // 2 — Left Upper
    { x: 20, y: 430 },

    // 3 — Right Middle
    { x: 600, y: 850 },

    // 4 — Left Bottom
    { x: 40, y: 1280 },
  ];

  const MOVE_DURATION = 30;

  const cycleDuration = positions.length * MOVE_DURATION;
  const cycleFrame = frame % cycleDuration;

  const currentStep = Math.floor(
    cycleFrame / MOVE_DURATION
  );

  const localFrame =
    cycleFrame - currentStep * MOVE_DURATION;

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#a09595",
       
        overflow: "hidden",
      }}
    >
      {/* =========================
          PINK HEART DECORATION
      ========================= */}
{/* ======================================================
    DARK PINK SHINING HEARTS
====================================================== */}

<div
  style={{
    position: "absolute",
    left: 45,
    top: 100,
    fontSize: 65,
    color: "#9e2348",
    textShadow:
      "0 0 6px rgba(255, 120, 160, 0.9), 0 0 14px rgba(255, 80, 130, 0.55)",
    transform: "rotate(-15deg)",
    zIndex: 1,
  }}
>
  ♡
</div>

<div
  style={{
    position: "absolute",
    left: 500,
    top: 120,
    fontSize: 85,
    color: "#a5224b",
    textShadow:
      "0 0 7px rgba(255, 140, 175, 0.95), 0 0 18px rgba(255, 70, 125, 0.65)",
    transform: "rotate(12deg)",
    zIndex: 1,
  }}
>
  ♡
</div>

<div
  style={{
    position: "absolute",
    right: 35,
    top: 250,
    fontSize: 55,
    color: "#8f1f42",
    textShadow:
      "0 0 6px rgba(255, 120, 160, 0.9), 0 0 13px rgba(255, 70, 120, 0.55)",
    transform: "rotate(18deg)",
    zIndex: 1,
  }}
>
  ♡
</div>

<div
  style={{
    position: "absolute",
    left: 15,
    top: 700,
    fontSize: 75,
    color: "#a5224b",
    textShadow:
      "0 0 7px rgba(255, 140, 175, 0.95), 0 0 17px rgba(255, 70, 125, 0.6)",
    transform: "rotate(-20deg)",
    zIndex: 1,
  }}
>
  ♡
</div>

<div
  style={{
    position: "absolute",
    right: 25,
    top: 800,
    fontSize: 60,
    color: "#951f45",
    textShadow:
      "0 0 6px rgba(255, 130, 170, 0.9), 0 0 14px rgba(255, 70, 120, 0.55)",
    transform: "rotate(15deg)",
    zIndex: 1,
  }}
>
  ♡
</div>

<div
  style={{
    position: "absolute",
    left: 60,
    top: 1120,
    fontSize: 50,
    color: "#8f1f42",
    textShadow:
      "0 0 6px rgba(255, 120, 160, 0.9), 0 0 12px rgba(255, 70, 120, 0.5)",
    transform: "rotate(10deg)",
    zIndex: 1,
  }}
>
  ♡
</div>

<div
  style={{
    position: "absolute",
    right: 50,
    top: 1250,
    fontSize: 80,
    color: "#a5224b",
    textShadow:
      "0 0 8px rgba(255, 150, 185, 1), 0 0 19px rgba(255, 70, 125, 0.65)",
    transform: "rotate(20deg)",
    zIndex: 1,
  }}
>
  ♡
</div>

<div
  style={{
    position: "absolute",
    left: 25,
    bottom: 170,
    fontSize: 55,
    color: "#951f45",
    textShadow:
      "0 0 6px rgba(255, 130, 170, 0.9), 0 0 14px rgba(255, 70, 120, 0.55)",
    transform: "rotate(-10deg)",
    zIndex: 1,
  }}
>
  ♡
</div>

<div
  style={{
    position: "absolute",
    right: 45,
    bottom: 100,
    fontSize: 70,
    color: "#9e2348",
    textShadow:
      "0 0 7px rgba(255, 140, 175, 0.95), 0 0 17px rgba(255, 70, 125, 0.6)",
    transform: "rotate(15deg)",
    zIndex: 1,
  }}
>
  ♡
</div>

      {/* =========================
          MOVING CARDS
      ========================= */}

      {sceneImages.map((img, index) => {
        const currentPositionIndex =
          (index - currentStep + positions.length) %
          positions.length;

        const nextPositionIndex =
          (currentPositionIndex - 1 + positions.length) %
          positions.length;

        const currentPosition =
          positions[currentPositionIndex];

        const nextPosition =
          positions[nextPositionIndex];

        const progress = interpolate(
          localFrame,
          [0, MOVE_DURATION],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const easedProgress =
          progress * progress * (3 - 2 * progress);

        const x = interpolate(
          easedProgress,
          [0, 1],
          [
            currentPosition.x,
            nextPosition.x,
          ]
        );

        const y = interpolate(
          easedProgress,
          [0, 1],
          [
            currentPosition.y,
            nextPosition.y,
          ]
        );

        const entryStart = index * 4;

        const opacity = interpolate(
          frame,
          [entryStart, entryStart + 10],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const scale = interpolate(
          frame,
          [entryStart, entryStart + 10],
          [0.96, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: x,
              top: y,

              width: CARD_SIZE,
              height: CARD_SIZE,

              padding: 7,
              boxSizing: "border-box",

              backgroundColor: "#ffffff",

              opacity,

              transform: `translateZ(0) scale(${scale})`,

              transformOrigin: "center center",

              boxShadow:
                "0 2px 8px rgba(0,0,0,0.10)",

              overflow: "hidden",

              zIndex: 10 + index,
            }}
          >
            <Img
              src={img.path}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
// ======================================================
// SCENE 2
// 5 - 9 SEC
// 4 FULL SCREEN IMAGES
// ======================================================

const Scene2: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const sceneImages = images.slice(0, 4).filter((img) => img?.path);
  const IMAGE_DURATION = 30;

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {sceneImages.map((img, index) => {
        const start = index * IMAGE_DURATION;
        const end = start + IMAGE_DURATION;
        const opacity = interpolate(
          frame,
          [start, start + 4, end - 4, end],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const scale = interpolate(frame, [start, end], [1.05, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <AbsoluteFill
            key={index}
            style={{
              opacity,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              zIndex: index,
            }}
          >
            <Img
              src={img.path}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                transform: `scale(${scale})`,
                display: "block",
              }}
            />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// ======================================================
// MAIN TEMPLATE
// ======================================================

export const Template7 = ({
  images = [],
  music = undefined, // ✅ Music Prop Accept
}: Template7Props) => {
  const musicSrc = music; // ✅ कोई Fallback नहीं
  console.log("🎵 Template7 musicSrc:", musicSrc);

  return (
    <>
      {/* 🎵 MusicPlayer – अगर music available है तो Render होगा */}
      {musicSrc && (
        <MusicPlayer
          src={musicSrc}
          volume={0.8}
          loop={true}
          showVisualizer={true}
        />
      )}

      <AbsoluteFill
        style={{
          width: 1080,
          height: 1920,
          backgroundColor: "#000",
        }}
      >
        <Sequence from={0} durationInFrames={SCENE1_DURATION}>
          <Scene1 images={images.slice(0, 4)} />
        </Sequence>

        <Sequence from={SCENE1_DURATION} durationInFrames={SCENE2_DURATION}>
          <Scene2 images={images.slice(4, 8)} />
        </Sequence>
      </AbsoluteFill>
    </>
  );
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default Template7;