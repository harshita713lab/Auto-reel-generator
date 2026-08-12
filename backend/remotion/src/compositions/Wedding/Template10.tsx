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

interface Template10Props {
  images?: ImageItem[];
  music?: string;
}

// ======================================================
// TEMPLATE SETTINGS
// ======================================================

export const IMAGE_COUNT = 16;

export const DURATION_IN_FRAMES = 420; // 14 sec @ 30fps

export const DEFAULT_PROPS = {
  images: [],
  music: undefined,
};

// ======================================================
// SCENE DURATIONS
// ======================================================

// Scene 1 = 0 - 4 sec
const SCENE1_DURATION = 120;

// Scene 2 = 4 - 6 sec
const SCENE2_DURATION = 60;

// Scene 3 = 6 - 14 sec
const SCENE3_DURATION = 240;

// ======================================================
// SCENE 1
// 0 - 4 SEC
// 8 IMAGES
// 2 COLUMN × 4 ROW
// WHOLE COLLAGE SLIDES BOTTOM → TOP
// ======================================================

const Scene1: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  // ==========================================
  // 8 IMAGES
  // ==========================================

  const sceneImages = images
    .slice(0, 8)
    .filter((img) => img?.path);

  // ==========================================
  // 0–4 SEC = 120 FRAMES
  // ==========================================

  const progress = interpolate(
    frame,
    [0, 110],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ==========================================
  // COLLAGE BOTTOM → TOP
  // ==========================================

  const translateY = interpolate(
    progress,
    [0, 1],
    [1150, 0]
  );

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,

       

   background:
  "linear-gradient(135deg, #FFF8F0 0%, #F8EBDD 50%, #EED8CC 100%)",

        overflow: "hidden",
      }}
    >

      {/* ==========================================
          SOFT TOP LEFT GLOW
      ========================================== */}

      <div
        style={{
          position: "absolute",

          width: 500,
          height: 500,

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(200,145,160,0.22) 55%, transparent 72%)",

          top: -220,
          left: -200,

          pointerEvents: "none",
        }}
      />

      {/* ==========================================
          SOFT TOP RIGHT GLOW
      ========================================== */}

      <div
        style={{
          position: "absolute",

          width: 380,
          height: 380,

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(200,145,160,0.2) 55%, transparent 72%)",

          top: 120,
          right: -170,

          pointerEvents: "none",
        }}
      />

      {/* ==========================================
          SOFT BOTTOM LEFT GLOW
      ========================================== */}

      <div
        style={{
          position: "absolute",

          width: 450,
          height: 450,

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(200,145,160,0.2) 55%, transparent 72%)",

          bottom: -200,
          left: -180,

          pointerEvents: "none",
        }}
      />

      {/* ==========================================
          SOFT BOTTOM RIGHT GLOW
      ========================================== */}

      <div
        style={{
          position: "absolute",

          width: 500,
          height: 500,

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(255,255,255,0.32) 0%, rgba(200,145,160,0.2) 55%, transparent 72%)",

          bottom: -220,
          right: -210,

          pointerEvents: "none",
        }}
      />

      {/* ==========================================
          TOP DECORATION
      ========================================== */}

      <div
        style={{
          position: "absolute",

          top: 25,
          left: 0,
          right: 0,

          textAlign: "center",

          fontSize: 30,

          color: "rgba(105,55,70,0.8)",

          letterSpacing: 14,

          zIndex: 2,

          pointerEvents: "none",
        }}
      >
        ♡ ✦ ♡
      </div>

      {/* ==========================================
          BOTTOM DECORATION
      ========================================== */}

      <div
        style={{
          position: "absolute",

          bottom: 28,
          left: 0,
          right: 0,

          textAlign: "center",

          fontSize: 28,

          color: "rgba(105,55,70,0.8)",

          letterSpacing: 12,

          zIndex: 2,

          pointerEvents: "none",
        }}
      >
        ✦ ♡ ✦
      </div>

      {/* ==========================================
          LEFT DECORATIVE LINE
      ========================================== */}

      <div
        style={{
          position: "absolute",

          left: 22,
          top: 600,

          width: 3,
          height: 300,

          borderRadius: 10,

          background:
            "linear-gradient(transparent, rgba(105,55,70,0.55), transparent)",

          zIndex: 2,

          pointerEvents: "none",
        }}
      />

      {/* ==========================================
          RIGHT DECORATIVE LINE
      ========================================== */}

      <div
        style={{
          position: "absolute",

          right: 22,
          top: 1050,

          width: 3,
          height: 300,

          borderRadius: 10,

          background:
            "linear-gradient(transparent, rgba(105,55,70,0.55), transparent)",

          zIndex: 2,

          pointerEvents: "none",
        }}
      />

      {/* ==========================================
          SMALL HEART - LEFT
      ========================================== */}

      <div
        style={{
          position: "absolute",

          left: 25,
          top: 930,

          fontSize: 25,

          color: "rgba(105,55,70,0.65)",

          zIndex: 2,

          pointerEvents: "none",
        }}
      >
        ♡
      </div>

      {/* ==========================================
          SMALL HEART - RIGHT
      ========================================== */}

      <div
        style={{
          position: "absolute",

          right: 25,
          top: 700,

          fontSize: 25,

          color: "rgba(105,55,70,0.65)",

          zIndex: 2,

          pointerEvents: "none",
        }}
      >
        ♡
      </div>

      {/* ==========================================
          COMPLETE 8 IMAGE COLLAGE
          BOTTOM → TOP
      ========================================== */}

      <div
        style={{
          position: "absolute",

          left: 48,
          top: 50,

          width: 984,

          display: "grid",

          gridTemplateColumns: "1fr 1fr",

          columnGap: 42,

          rowGap: 38,

          // WHOLE COLLAGE SLIDES UP
          transform: `translateY(${translateY}px)`,

          transformOrigin: "center center",

          boxSizing: "border-box",

          zIndex: 10,

          // Stronger shadow
          filter:
            "drop-shadow(0 18px 28px rgba(55,30,40,0.28))",
        }}
      >

        {/* ==========================================
            8 IMAGES
        ========================================== */}

        {sceneImages.map((img, index) => (
          <div
            key={index}
            style={{
              width: "100%",

              height: 360,

              padding: 6,

              boxSizing: "border-box",

              overflow: "hidden",

              borderRadius: 48,

              // WHITE FRAME
              backgroundColor: "#FFFFFF",

              // Strong frame shadow
              boxShadow:
                "0 10px 25px rgba(60,35,45,0.25)",

              position: "relative",
            }}
          >

            {/* ======================================
                BLURRED BACKGROUND
                Different ratio images ke liye
            ====================================== */}

            <Img
              src={img.path}
              style={{
                position: "absolute",

                inset: -20,

                width: "calc(100% + 40px)",
                height: "calc(100% + 40px)",

                objectFit: "cover",

                filter: "blur(22px)",

                opacity: 0.4,

                transform: "scale(1.08)",

                display: "block",
              }}
            />

            {/* ======================================
                ORIGINAL IMAGE
                NO CROPPING
            ====================================== */}

            <Img
              src={img.path}
              style={{
                position: "absolute",

                left: 6,
                top: 6,

                width: "calc(100% - 12px)",
                height: "calc(100% - 12px)",

                objectFit: "contain",

                objectPosition: "center",

                display: "block",

                borderRadius: 42,

                zIndex: 2,
              }}
            />

          </div>
        ))}

      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 2
// 4 - 6 SEC
// 3 IMAGES
// VERTICAL STACK
// I / LOVE / YOU
// ======================================================
const Scene2: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const sceneImages = images
    .slice(0, 3)
    .filter((img) => img?.path);

  const texts = ["I", "LOVE", "YOU"];

  // 4-6 sec = 60 frames
  // 3 images = 20 frames each
  const IMAGE_DURATION = 20;

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      {sceneImages.map((img, index) => {
        const top = index * 640;

        // Har image apne time par appear hogi
        const start = index * IMAGE_DURATION;

        const progress = interpolate(
          frame,
          [start, start + 8],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const opacity = progress;

        const scale = interpolate(
          progress,
          [0, 1],
          [0.96, 1]
        );

        return (
          <div
            key={index}
            style={{
              position: "absolute",

              left: 0,
              top,

              width: 1080,
              height: 640,

              overflow: "hidden",

              opacity,

              transform: `scale(${scale})`,
              transformOrigin: "center",

              backgroundColor: "#000",
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

            {/* TEXT */}

            <div
              style={{
                position: "absolute",

                left: 0,
                right: 0,

                top: "50%",

                transform: "translateY(-50%)",

                textAlign: "center",

                color: "#fff",

                fontSize:
                  index === 1
                    ? 145
                    : 165,

                fontFamily: "Georgia, serif",

                fontWeight: 700,

                letterSpacing: 4,

                WebkitTextStroke: "5px #000",

                textShadow:
                  "0 4px 10px rgba(0,0,0,0.6)",

                zIndex: 20,
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
// SCENE 3
// 6 - 14 SEC
// 5 IMAGES
// ONE BY ONE
// ======================================================

const Scene3: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const sceneImages = images
    .slice(0, 5)
    .filter((img) => img?.path);

  // 8 sec = 240 frames
  // 5 images = 48 frames each
  const IMAGE_DURATION = 48;

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {sceneImages.map((img, index) => (
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
      ))}
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

  const opacity = interpolate(
    frame,
    [0, 8, duration - 8, duration],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const scale = interpolate(
    frame,
    [0, duration],
    [1.04, 1],
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

export const Template10: React.FC<Template10Props> = ({
  images = [],
  music,
}) => {
  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#000",
      }}
    >
      {/* MUSIC */}

      {music && (
        <MusicPlayer src={music} />
      )}

      {/* ==================================================
          SCENE 1
          0 - 4 SEC
          images[0 - 7]
      ================================================== */}

      <Sequence
        from={0}
        durationInFrames={SCENE1_DURATION}
      >
        <Scene1
          images={images.slice(0, 8)}
        />
      </Sequence>

      {/* ==================================================
          SCENE 2
          4 - 6 SEC
          images[8 - 10]
      ================================================== */}

      <Sequence
        from={SCENE1_DURATION}
        durationInFrames={SCENE2_DURATION}
      >
        <Scene2
          images={images.slice(8, 11)}
        />
      </Sequence>

      {/* ==================================================
          SCENE 3
          6 - 14 SEC
          images[11 - 15]
      ================================================== */}

      <Sequence
        from={
          SCENE1_DURATION +
          SCENE2_DURATION
        }
        durationInFrames={SCENE3_DURATION}
      >
        <Scene3
          images={images.slice(11, 16)}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export default Template10;