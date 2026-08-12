import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { MusicPlayer } from "../../components";

// ======================================================
// INTERFACE
// ======================================================

interface ImageItem {
  path: string;
}

interface Template9Props {
  images?: ImageItem[];
  music?: string;
}

// ======================================================
// TEMPLATE SETTINGS
// ======================================================

export const IMAGE_COUNT = 15;

export const DURATION_IN_FRAMES = 540; // 18 sec @ 30fps

export const DEFAULT_PROPS = {
  images: [],
  music: undefined,
};

// ======================================================
// SCENE DURATIONS
// ======================================================

// Scene 1 = 0 - 3 sec
const SCENE1_DURATION = 120;

// Scene 2 = 3 - 17 sec
const SCENE2_DURATION = 90;

// Scene 3 = 17 - 18 sec
const SCENE3_DURATION = 330;

// ======================================================
// SCENE 1
// 0 - 3 SEC
// 4 IMAGES
// images[0 - 3]
// ======================================================

const Scene1: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const sceneImages = images
    .slice(0, 4)
    .filter((img) => img?.path);

  const layouts = [
    // IMAGE 1 - MAIN
    {
      x: 30,
      y: 250,
      w: 650,
      h: 1000,
    },

    // IMAGE 2 - TOP RIGHT
    {
      x: 700,
      y: 100,
      w: 330,
      h: 500,
    },

    // IMAGE 3 - MIDDLE RIGHT
    {
      x: 700,
      y: 620,
      w: 330,
      h: 500,
    },

    // IMAGE 4 - BOTTOM RIGHT
    {
      x: 700,
      y: 1140,
      w: 330,
      h: 500,
    },
  ];

  // Text for each image
  const texts = [
    "-Sanjh tu",
    "-Savera tu",
    "-Raahen tu",
    "-Basera tu",
  ];

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#FAF7F2",
        overflow: "hidden",
      }}
    >
      {sceneImages.map((img, index) => {
        const layout = layouts[index];

        // ==========================================
        // SLOW SEQUENTIAL ENTRANCE
        // Scene = 3 sec = 90 frames @ 30fps
        // ==========================================

        const start = index * 30;

        // Each image takes 25 frames to appear
        const progress = interpolate(
          frame,
          [start, start + 35],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        // Smooth fade
        const opacity = progress;

        // Slow scale
        const scale = interpolate(
          progress,
          [0, 1],
          [0.90, 1]
        );

        // Slight upward movement
        const translateY = interpolate(
          progress,
          [0, 1],
          [35, 0]
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

              padding: 6,

              boxSizing: "border-box",

              backgroundColor: "#fff",

              opacity,

              transform: `
                translateY(${translateY}px)
                scale(${scale})
              `,

              transformOrigin: "center",

              overflow: "hidden",

              zIndex: 10 + index,
            }}
          >
            {/* IMAGE */}

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

            {/* DARK OVERLAY */}

            <div
              style={{
                position: "absolute",

                left: 0,
                right: 0,
                bottom: 0,

                height: "45%",

                background:
                  "linear-gradient(transparent, rgba(0,0,0,0.45))",

                pointerEvents: "none",
              }}
            />

            {/* TEXT */}

            <div
              style={{
                position: "absolute",

                left: 10,
                right: 10,

                bottom:
                  index === 0
                    ? 120
                    : 35,

                textAlign: "center",

                color: "#fff",

                fontSize:
                  index === 0
                    ? 58
                    : 38,

                fontFamily: "cursive",

                fontStyle: "italic",

                letterSpacing: 1,

                whiteSpace: "nowrap",

                textShadow:
                  "0 2px 8px rgba(0,0,0,0.6)",

                zIndex: 20,

                opacity: progress,
              }}
            >
              {texts[index]}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
// ======================================================
// SCENE 2
// 3 - 17 SEC
// 1 IMAGE
// images[4]
// ======================================================

const Scene2: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const sceneImages = images
    .slice(0, 1)
    .filter((img) => img?.path);

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {sceneImages.map((img) => {
        const scale = interpolate(
          frame,
          [0, SCENE2_DURATION],
          [1.08, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        return (
          <AbsoluteFill
            key={img.path}
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#000",
              overflow: "hidden",
            }}
          >
            {/* IMAGE */}
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

            {/* DARK GRADIENT */}
            <AbsoluteFill
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.5) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* ROMANTIC TEXT */}
            <AbsoluteFill
              style={{
                alignItems: "center",
                justifyContent: "center",
                padding: "0 80px",
              }}
            >
              <div
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontFamily: "Georgia, serif",
                  textShadow: "0 3px 18px rgba(0,0,0,0.9)",
                }}
              >
                {/* TOP HEARTS */}
                <div
                  style={{
                    fontSize: 38,
                    marginBottom: 22,
                    letterSpacing: 12,
                  }}
                >
                  ♡ ♥ ♡
                </div>

                {/* MAIN TEXT */}
                <div
                  style={{
                    fontSize: 64,
                    fontWeight: 500,
                    letterSpacing: 2,
                    lineHeight: 1.3,
                  }}
                >
                  Tere Sang Lagi
                  <br />
                  Jo Preet Re
                </div>

                {/* BOTTOM DECORATION */}
                <div
                  style={{
                    fontSize: 30,
                    marginTop: 24,
                    opacity: 0.9,
                    letterSpacing: 8,
                  }}
                >
                  ── ♡ ──
                </div>
              </div>
            </AbsoluteFill>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 3
// 17 - 18 SEC
// 10 IMAGES
// images[5 - 14]
// ======================================================

const Scene3: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const sceneImages = images
    .slice(0, 10)
    .filter((img) => img?.path);

  // Scene 3 = 7 - 18 sec
  // 11 sec = 330 frames
  // 10 images = 33 frames each
  const IMAGE_DURATION = 33;

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
        return (
          <Sequence
            key={index}
            from={index * IMAGE_DURATION}
            durationInFrames={IMAGE_DURATION}
          >
            <Scene3Image
              img={img}
              duration={IMAGE_DURATION}
            />
          </Sequence>
        );
      })}

      {/* ENDING TEXT */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 120,
          textAlign: "center",
          color: "#fff",
          fontSize: 70,
          fontFamily: "cursive",
          letterSpacing: 5,
          zIndex: 100,
          textShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        ALWAYS TOGETHER ♡
      </div>
    </AbsoluteFill>
  );
};


// ======================================================
// SCENE 3 IMAGE
// ======================================================

const Scene3Image: React.FC<{
  img: ImageItem;
  duration: number;
}> = ({ img, duration }) => {
  const frame = useCurrentFrame();

  // Smooth fade
  const opacity = interpolate(
    frame,
    [0, 8, duration - 8, duration],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Slow cinematic zoom
  const scale = interpolate(
    frame,
    [0, duration],
    [1.06, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        opacity,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
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
};

// ======================================================
// MAIN TEMPLATE
// ======================================================

export const Template9 = ({
  images = [],
  music = undefined,
}: Template9Props) => {
  return (
    <>
      {music && <MusicPlayer src={music} />}

      <AbsoluteFill
        style={{
          width: 1080,
          height: 1920,
          backgroundColor: "#000",
        }}
      >
        {/* ==================================================
            SCENE 1
            0 - 3 SEC
            4 IMAGES
            images[0 - 3]
        ================================================== */}

        <Sequence
          from={0}
          durationInFrames={SCENE1_DURATION}
        >
          <Scene1 images={images.slice(0, 4)} />
        </Sequence>

        {/* ==================================================
            SCENE 2
            3 - 17 SEC
            1 IMAGE
            images[4]
        ================================================== */}

        <Sequence
          from={SCENE1_DURATION}
          durationInFrames={SCENE2_DURATION}
        >
          <Scene2 images={images.slice(4, 5)} />
        </Sequence>

        {/* ==================================================
            SCENE 3
            17 - 18 SEC
            10 IMAGES
            images[5 - 14]
        ================================================== */}

        <Sequence
          from={SCENE1_DURATION + SCENE2_DURATION}
          durationInFrames={SCENE3_DURATION}
        >
          <Scene3 images={images.slice(5, 15)} />
        </Sequence>
      </AbsoluteFill>
    </>
  );
};

export default Template9;