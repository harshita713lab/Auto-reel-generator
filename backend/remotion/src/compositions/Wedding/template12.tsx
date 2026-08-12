import React from "react";

import {
  AbsoluteFill,
  Sequence,
  Audio,
  useCurrentFrame,
  interpolate,
} from "remotion";

import { AnimatedImage , MusicPlayer} from "../../components";

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
  duration?: number;
  animation?: string;
  transition?: string;
}

interface Template12Props {
  images?: ImageItem[];

  music?: {
    path: string;
    volume?: number;
  };
}

// ======================================================
// COMPOSITION SETTINGS
// ======================================================
export const IMAGE_COUNT = 23;



export const DEFAULT_PROPS = {
  images: [],
  music: undefined,
};
export const FPS = 30;

// Scene 1 = 4 sec
export const ROW_DURATION = 120;

// Scene 2 = 6 sec
export const FAST_DURATION = 180;

// Total = 10 sec
export const DURATION_IN_FRAMES =
  ROW_DURATION + FAST_DURATION;

// ======================================================
// ROW IMAGE
// ======================================================

const RowImage = ({
  image,
}: {
  image?: ImageItem;
}) => {
  if (!image?.path) return null;

  return (
    <AnimatedImage
      src={image.path}
      animation={image.animation ?? "slideUp"}
      durationInFrames={20}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: 18,
      }}
    />
  );
};

// ======================================================
// MAIN COMPOSITION
// ======================================================

const Template12: React.FC<
  Template12Props
> = ({
  images = [],
  music,
}) => {
  // ====================================================
  // SAFE IMAGES
  // ====================================================

  const safeImages =
    images.length > 0
      ? images
      : [{ path: "" }];

  const getImg = (idx: number) =>
    safeImages[idx % safeImages.length];

  // First 3 images
  const img1 = getImg(0);
  const img2 = getImg(1);
  const img3 = getImg(2);

  // ====================================================
  // IMAGES 4 - 23
  // ====================================================

  const fastImages = images
    .slice(3, 23)
    .filter((img) => img?.path);

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        background: "#000",
        overflow: "hidden",
      }}
    >
      {/* ==================================================
          MUSIC
      ================================================== */}

      {music?.path && (
        <MusicPlayer
          src={music.path}
          volume={music.volume ?? 1}
        />
      )}

      {/* ==================================================
          SCENE 1
          0 - 4 SEC
          120 FRAMES
      ================================================== */}

      <Sequence
        from={0}
        durationInFrames={ROW_DURATION}
      >
        <AbsoluteFill>

          {/* ==========================================
              ROW 1
          ========================================== */}

          <Sequence
            from={0}
            durationInFrames={120}
          >
            <div
              style={{
                position: "absolute",

                top: "0%",
                left: 0,

                width: "100%",
                height: "33%",

                overflow: "hidden",
              }}
            >
              <RowImage image={img1} />

              {/* Dark overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,

                  background:
                    "linear-gradient(90deg, rgba(0,0,0,.25), rgba(0,0,0,.05))",
                }}
              />

              {/* TEXT */}

              <div
                style={{
                  position: "absolute",

                  inset: 0,

                  display: "flex",

                  justifyContent: "center",
                  alignItems: "center",

                  zIndex: 10,

                  color: "#fff",

                  fontSize: 45,

                  fontFamily: "serif",

                  letterSpacing: 8,

                  textTransform: "uppercase",

                  textShadow:
                    "0 5px 20px rgba(0,0,0,.8)",
                }}
              >
                CAMERA
              </div>
            </div>
          </Sequence>

          {/* ==========================================
              ROW 2
          ========================================== */}

          <Sequence
            from={45}
            durationInFrames={75}
          >
            <div
              style={{
                position: "absolute",

                top: "33%",
                left: 0,

                width: "100%",
                height: "33%",

                overflow: "hidden",
              }}
            >
              <RowImage image={img2} />

              <div
                style={{
                  position: "absolute",
                  inset: 0,

                  background:
                    "linear-gradient(90deg, rgba(0,0,0,.25), rgba(0,0,0,.05))",
                }}
              />

              <div
                style={{
                  position: "absolute",

                  inset: 0,

                  display: "flex",

                  justifyContent: "center",
                  alignItems: "center",

                  zIndex: 10,

                  color: "#fff",

                  fontSize: 45,

                  fontFamily: "serif",

                  letterSpacing: 8,

                  textTransform: "uppercase",

                  textShadow:
                    "0 5px 20px rgba(0,0,0,.8)",
                }}
              >
                ROLLING
              </div>
            </div>
          </Sequence>

          {/* ==========================================
              ROW 3
          ========================================== */}

          <Sequence
            from={105}
            durationInFrames={15}
          >
            <div
              style={{
                position: "absolute",

                top: "66%",
                left: 0,

                width: "100%",
                height: "34%",

                overflow: "hidden",
              }}
            >
              <RowImage image={img3} />

              <div
                style={{
                  position: "absolute",
                  inset: 0,

                  background:
                    "linear-gradient(90deg, rgba(0,0,0,.25), rgba(0,0,0,.05))",
                }}
              />

              <div
                style={{
                  position: "absolute",

                  inset: 0,

                  display: "flex",

                  justifyContent: "center",
                  alignItems: "center",

                  zIndex: 10,

                  color: "#fff",

                  fontSize: 45,

                  fontFamily: "serif",

                  letterSpacing: 8,

                  textTransform: "uppercase",

                  textShadow:
                    "0 5px 20px rgba(0,0,0,.8)",
                }}
              >
                ACTION
              </div>
            </div>
          </Sequence>

        </AbsoluteFill>
      </Sequence>

      {/* ==================================================
          SCENE 2
          4 - 10 SEC
          180 FRAMES
      ================================================== */}

      <Sequence
        from={ROW_DURATION}
        durationInFrames={FAST_DURATION}
      >
        <AbsoluteFill>

          {fastImages.map((img, index) => (
            <Sequence
              key={index}
              from={index * 9}
              durationInFrames={9}
            >
              <AnimatedImage
                src={img.path}
                animation="zoomIn"
                durationInFrames={9}
                style={{
                  width: "100%",
                  height: "100%",

                  objectFit: "cover",
                }}
              />
            </Sequence>
          ))}

        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default Template12;