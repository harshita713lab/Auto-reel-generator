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

interface Template8Props {
  images?: ImageItem[];
  music?: string; // ✅ Music Prop
}
export const IMAGE_COUNT = 17;

export const DURATION_IN_FRAMES = 450;
// Scene 1 = 9 sec
// Scene 2 = 4 sec
// TOTAL = 13 sec

export const DEFAULT_PROPS = {
  images: [],
  music: undefined,
};

const SCENE1_DURATION = 180; // 9 sec
const SCENE2_DURATION = 270; // 4 sec

// ======================================================
// SCENE 1
// 13 IMAGE COLLAGE
// ======================================================

const Scene1: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const sceneImages = images
    .slice(0, 13)
    .filter((img) => img?.path);

  const BG = "#d8bcbc";
const layouts = [
  // ==================================================
  // TOP 4
  // ==================================================

  {
    x: 10,
    y: 20,
    w: 260,
    h: 370,
  },

  {
    x: 280,
    y: 20,
    w: 260,
    h: 370,
  },

  {
    x: 550,
    y: 20,
    w: 260,
    h: 370,
  },

  {
    x: 820,
    y: 20,
    w: 250,
    h: 370,
  },

  // ==================================================
  // MIDDLE
  // ==================================================

  // Image 5 - BIG LEFT
  {
    x: 10,
    y: 405,
    w: 530,
    h: 700,
  },

  // Image 6 - RIGHT TOP
  {
    x: 560,
    y: 405,
    w: 245,
    h: 335,
  },

  // Image 7 - RIGHT TOP 2
  {
    x: 815,
    y: 405,
    w: 255,
    h: 335,
  },

  // Image 8 - RIGHT BOTTOM
  {
    x: 560,
    y: 755,
    w: 245,
    h: 350,
  },

  // Image 9 - RIGHT BOTTOM 2
  {
    x: 815,
    y: 755,
    w: 255,
    h: 350,
  },

  // ==================================================
  // BOTTOM 4
  // SAME AS TOP 4
  // ==================================================

  {
    x: 10,
    y: 1530,
    w: 260,
    h: 370,
  },

  {
    x: 280,
    y: 1530,
    w: 260,
    h: 370,
  },

  {
    x: 550,
    y: 1530,
    w: 260,
    h: 370,
  },

  {
    x: 820,
    y: 1530,
    w: 260,
    h: 370,
  },
];
  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: BG,
        overflow: "hidden",
      }}
    >
      {/* ==================================================
          HEARTS
      ================================================== */}

      <div
        style={{
          position: "absolute",
          left: 15,
          top: 15,
          fontSize: 55,
          color: "rgba(180,65,95,0.65)",
          zIndex: 1,
        }}
      >
        ♡
      </div>

      <div
        style={{
          position: "absolute",
          right: 20,
          top: 370,
          fontSize: 65,
          color: "rgba(180,65,95,0.60)",
          zIndex: 1,
        }}
      >
        ♡
      </div>

      <div
        style={{
          position: "absolute",
          left: 10,
          top: 1010,
          fontSize: 70,
          color: "rgba(180,65,95,0.60)",
          zIndex: 1,
        }}
      >
        ♡
      </div>

      <div
        style={{
          position: "absolute",
          right: 15,
          top: 1040,
          fontSize: 55,
          color: "rgba(180,65,95,0.65)",
          zIndex: 1,
        }}
      >
        ♡
      </div>

      <div
        style={{
          position: "absolute",
          left: 20,
          bottom: 30,
          fontSize: 60,
          color: "rgba(180,65,95,0.60)",
          zIndex: 1,
        }}
      >
        ♡
      </div>

      <div
        style={{
          position: "absolute",
          right: 20,
          bottom: 30,
          fontSize: 70,
          color: "rgba(180,65,95,0.65)",
          zIndex: 1,
        }}
      >
        ♡
      </div>

      {/* ==================================================
          IMAGES
      ================================================== */}

      {sceneImages.map((img, index) => {
        const layout = layouts[index];

        if (!layout) return null;

       const start = Math.round((index / 12) * 120);
const animationDuration = 36;

        const opacity = interpolate(
          frame,
          [start, start + animationDuration],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const scale = interpolate(
          frame,
          [start, start + animationDuration],
          [0.92, 1],
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

              left: layout.x,
              top: layout.y,

              width: layout.w,
              height: layout.h,

              padding: 5,

              boxSizing: "border-box",

              backgroundColor: "#fff",

              opacity,

              transform: `scale(${scale})`,

              transformOrigin: "center center",

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

      {/* ==================================================
          I LOVE YOU
      ================================================== */}

      <div
        style={{
          position: "absolute",

          left: 0,
          right: 0,

          top: 1250,

          display: "flex",

          justifyContent: "center",
          alignItems: "center",

          zIndex: 50,

          pointerEvents: "none",
        }}
      >
        <div
          style={{
            color: "#fff",

            fontSize: 92,

            fontFamily: "cursive",

            fontWeight: 300,

            letterSpacing: 5,

            textShadow:
              "0 2px 8px rgba(0,0,0,0.25)",

            transform: "rotate(-2deg)",
          }}
        >
          I LOVE YOU
        </div>
      </div>
    </AbsoluteFill>
  );
};
// ======================================================
// SCENE 2
// CINEMATIC FULL SCREEN
// IMAGES 14-17
// ======================================================

// ======================================================
// SCENE 2
// CINEMATIC FULL SCREEN
// IMAGES 14-17
// TOTAL = 9 SEC
// ======================================================

const Scene2: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const sceneImages = images
    .slice(0, 4)
    .filter((img) => img?.path);

  // ======================================================
  // 4 IMAGES = 270 FRAMES = 9 SEC
  // ======================================================

  const IMAGE_DURATIONS = [68, 67, 68, 67];

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
        // ==================================================
        // CALCULATE START / END
        // ==================================================

        const start = IMAGE_DURATIONS
          .slice(0, index)
          .reduce((sum, duration) => sum + duration, 0);

        const duration = IMAGE_DURATIONS[index] ?? 67;

        const end = start + duration;

        // ==================================================
        // CROSS FADE
        // ==================================================

        const opacity = interpolate(
          frame,
          [
            start,
            start + 8,
            end - 8,
            end,
          ],
          [
            0,
            1,
            1,
            0,
          ],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        // ==================================================
        // SLOW ZOOM
        // ==================================================

        const scale = interpolate(
          frame,
          [start, end],
          [1.08, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        // ==================================================
        // SLIGHT VERTICAL MOVEMENT
        // ==================================================

        const translateY = interpolate(
          frame,
          [start, end],
          [15, -10],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        // ==================================================
        // IMAGE
        // ==================================================

        return (
          <AbsoluteFill
            key={index}
            style={{
              opacity,

              overflow: "hidden",

              alignItems: "center",
              justifyContent: "center",

              backgroundColor: "#000",

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

                transform: `
                  translateY(${translateY}px)
                  scale(${scale})
                `,

                filter: `
                  grayscale(0.55)
                  brightness(0.82)
                  contrast(1.12)
                `,

                display: "block",
              }}
            />

            {/* ==================================================
                DARK OVERLAY
            ================================================== */}

            <AbsoluteFill
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.52) 100%)",

                pointerEvents: "none",
              }}
            />

            {/* ==================================================
                VIGNETTE
            ================================================== */}

            <AbsoluteFill
              style={{
                background:
                  "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.45) 100%)",

                pointerEvents: "none",
              }}
            />

            {/* ==================================================
                LOVE WATERMARK
            ================================================== */}

            <div
              style={{
                position: "absolute",

                left: 0,
                right: 0,

                bottom: 430,

                display: "flex",

                justifyContent: "center",
                alignItems: "center",

                zIndex: 20,

                opacity: interpolate(
                  frame,
                  [
                    start,
                    start + 8,
                    end - 8,
                    end,
                  ],
                  [0, 1, 1, 0],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }
                ),
              }}
            >
              <div
                style={{
                  color: "rgba(255,255,255,0.92)",

                  fontSize: 28,

                  fontFamily: "cursive",

                  letterSpacing: 3,

                  textShadow:
                    "0 2px 10px rgba(0,0,0,0.7)",

                  display: "flex",

                  alignItems: "center",

                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 55,
                  }}
                >
                  ♡
                </span>

                <span>
                  Love
                </span>

                <span
                  style={{
                    fontSize: 55,
                  }}
                >
                  ♡
                </span>
              </div>
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
// SCENE 2
// CINEMATIC FULL-SCREEN PHOTO SEQUENCE
// ======================================================


// ======================================================
// MAIN TEMPLATE
// ======================================================

export const Template8 = ({
  images = [],
  music = undefined,
}: Template8Props) => {
  const musicSrc = music;

  return (
    <>
      {/* ==================================================
          MUSIC
      ================================================== */}

      {musicSrc && (
        <MusicPlayer src={musicSrc} />
      )}

      {/* ==================================================
          MAIN VIDEO
      ================================================== */}

      <AbsoluteFill
        style={{
          width: 1080,
          height: 1920,
          backgroundColor: "#000",
        }}
      >
        {/* ================================================
            SCENE 1
            FIRST 13 IMAGES
            ================================================ */}

        <Sequence
          from={0}
          durationInFrames={SCENE1_DURATION}
        >
          <Scene1
            images={images.slice(0, 13)}
          />
        </Sequence>

        {/* ================================================
            SCENE 2
            NEXT 4 IMAGES
            IMAGE 14-17
            ================================================ */}

        <Sequence
          from={SCENE1_DURATION}
          durationInFrames={SCENE2_DURATION}
        >
          <Scene2
            images={images.slice(13, 17)}
          />
        </Sequence>
      </AbsoluteFill>
    </>
  );
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default Template8;

