import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MusicPlayer } from "../../components";

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
}

interface Template6Props {
  images?: ImageItem[];
  music?: string;
}

// ======================================================
// TEMPLATE SETTINGS
// ======================================================

export const IMAGE_COUNT = 12;
export const DURATION_IN_FRAMES = 450; // 15 seconds

export const DEFAULT_PROPS = {
  images: [],
  music: undefined,
};

// ======================================================
// SMALL HEARTS
// FIXED - NO MOVEMENT
// ======================================================

const SmallHearts = () => {
  const hearts = [
    { x: 55, y: 120, size: 24, rotate: -12 },
    { x: 170, y: 260, size: 18, rotate: 10 },
    { x: 315, y: 105, size: 20, rotate: -8 },
    { x: 475, y: 190, size: 17, rotate: 12 },
    { x: 640, y: 110, size: 22, rotate: -10 },
    { x: 820, y: 220, size: 18, rotate: 8 },
    { x: 965, y: 125, size: 24, rotate: 12 },

    { x: 25, y: 500, size: 20, rotate: 8 },
    { x: 175, y: 690, size: 16, rotate: -12 },
    { x: 340, y: 530, size: 21, rotate: 7 },
    { x: 530, y: 720, size: 18, rotate: -8 },
    { x: 720, y: 560, size: 20, rotate: 12 },
    { x: 900, y: 690, size: 17, rotate: -10 },
    { x: 1020, y: 480, size: 21, rotate: 8 },

    { x: 65, y: 940, size: 17, rotate: -10 },
    { x: 240, y: 1100, size: 22, rotate: 8 },
    { x: 430, y: 940, size: 18, rotate: -12 },
    { x: 610, y: 1120, size: 20, rotate: 10 },
    { x: 800, y: 950, size: 17, rotate: -8 },
    { x: 965, y: 1080, size: 22, rotate: 12 },

    { x: 35, y: 1370, size: 21, rotate: 10 },
    { x: 190, y: 1510, size: 17, rotate: -8 },
    { x: 360, y: 1360, size: 20, rotate: 12 },
    { x: 540, y: 1530, size: 17, rotate: -10 },
    { x: 720, y: 1390, size: 21, rotate: 8 },
    { x: 900, y: 1510, size: 18, rotate: -12 },
    { x: 1010, y: 1320, size: 22, rotate: 10 },

    { x: 90, y: 1770, size: 18, rotate: -8 },
    { x: 280, y: 1700, size: 21, rotate: 10 },
    { x: 500, y: 1800, size: 17, rotate: -12 },
    { x: 700, y: 1720, size: 20, rotate: 8 },
    { x: 880, y: 1810, size: 18, rotate: -10 },
  ];

  return (
    <>
      {hearts.map((heart, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: heart.x,
            top: heart.y,
            fontSize: heart.size,
            lineHeight: 1,
            color: "#c78391",
            opacity: 0.55,
            transform: `rotate(${heart.rotate}deg)`,
            filter: "drop-shadow(0 2px 3px rgba(120,60,70,0.12))",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          ♥
        </div>
      ))}
    </>
  );
};

// ======================================================
// SCENE 1
// 0s → 6s
//
// LIGHT PINK BACKGROUND
// SMALL FIXED HEARTS
// TOP 3
// MIDDLE SLIDER
// BOTTOM 3
// ======================================================

const Scene1 = ({ images = [] }: { images: ImageItem[] }) => {
  const frame = useCurrentFrame();

  const REEL_WIDTH = 1080;

  const TOP_HEIGHT = 300;
  const MIDDLE_TOP = 320;
  const MIDDLE_HEIGHT = 1280;
  const BOTTOM_HEIGHT = 300;

  const middleImages = images.slice(3, 7);

  // ----------------------------------------------------
  // SLIDER
  // One image every 45 frames = 1.5 sec
  // ----------------------------------------------------

  const slideDuration = 45;

  const totalImages = middleImages.length;

  const sliderPosition =
    totalImages > 0
      ? (frame / slideDuration) % totalImages
      : 0;

  const currentIndex = Math.floor(sliderPosition);

  const progress = sliderPosition - currentIndex;

  const translateX =
    -currentIndex * REEL_WIDTH -
    progress * REEL_WIDTH;

  return (
    <AbsoluteFill
      style={{
        width: REEL_WIDTH,
        height: 1920,

        // LIGHT PINK BACKGROUND
        background:
          "linear-gradient(180deg, #fff4f6 0%, #fce9ed 48%, #f8dfe5 100%)",

        overflow: "hidden",
      }}
    >
      {/* ==================================================
          FIXED SMALL HEARTS
      ================================================== */}

      <SmallHearts />

      {/* ==================================================
          SOFT PINK GLOW
          STATIC
      ================================================== */}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.38), transparent 65%)",

          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* ==================================================
          TOP 3
      ================================================== */}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,

          width: REEL_WIDTH,
          height: TOP_HEIGHT,

          display: "flex",
          gap: 6,

          overflow: "hidden",

          zIndex: 10,
        }}
      >
        {images.slice(0, 3).map((img, index) => (
          <div
            key={index}
            style={{
              width: 356,
              height: TOP_HEIGHT,

              flex: "0 0 356px",

              overflow: "hidden",

              backgroundColor: "#fff",
            }}
          >
            <Img
              src={img.path}
              style={{
                width: 356,
                height: TOP_HEIGHT,

                objectFit: "cover",
                objectPosition: "center",

                display: "block",
              }}
            />
          </div>
        ))}
      </div>

      {/* ==================================================
          MIDDLE SLIDER
      ================================================== */}

      <div
        style={{
          position: "absolute",

          top: MIDDLE_TOP,
          left: 0,

          width: REEL_WIDTH,
          height: MIDDLE_HEIGHT,

          overflow: "hidden",

          zIndex: 10,
        }}
      >
        <div
          style={{
            position: "absolute",

            top: 0,
            left: 0,

            display: "flex",

            width:
              totalImages * REEL_WIDTH,

            height: MIDDLE_HEIGHT,

            transform:
              `translateX(${translateX}px)`,

            willChange: "transform",
          }}
        >
          {middleImages.map((img, index) => (
            <div
              key={index}
              style={{
                width: REEL_WIDTH,
                height: MIDDLE_HEIGHT,

                flex:
                  `0 0 ${REEL_WIDTH}px`,

                overflow: "hidden",

                backgroundColor: "#fff",
              }}
            >
              <Img
                src={img.path}
                style={{
                  width: REEL_WIDTH,
                  height: MIDDLE_HEIGHT,

                  objectFit: "cover",
                  objectPosition: "center",

                  display: "block",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================
          BOTTOM 3
      ================================================== */}

      <div
        style={{
          position: "absolute",

          bottom: 0,
          left: 0,

          width: REEL_WIDTH,
          height: BOTTOM_HEIGHT,

          display: "flex",
          gap: 6,

          overflow: "hidden",

          zIndex: 10,
        }}
      >
        {images.slice(7, 10).map((img, index) => (
          <div
            key={index}
            style={{
              width: 356,
              height: BOTTOM_HEIGHT,

              flex: "0 0 356px",

              overflow: "hidden",

              backgroundColor: "#fff",
            }}
          >
            <Img
              src={img.path}
              style={{
                width: 356,
                height: BOTTOM_HEIGHT,

                objectFit: "cover",
                objectPosition: "center",

                display: "block",
              }}
            />
          </div>
        ))}
      </div>

      {/* ==================================================
          SOFT BORDER
      ================================================== */}

      <AbsoluteFill
        style={{
          border:
            "12px solid rgba(255,255,255,0.35)",

          boxSizing: "border-box",

          pointerEvents: "none",

          zIndex: 50,
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 2
// 6s → 8s
// ======================================================

const Scene2 = ({ images = [] }: { images: ImageItem[] }) => {
  const frame = useCurrentFrame();

  const { fps } = useVideoConfig();

  const sceneImages = [
    images[0],
    images[10],
    images[1],
    images[11],
  ];

  const progress = spring({
    frame,
    fps,

    config: {
      damping: 12,
      stiffness: 150,
      mass: 0.7,
    },
  });

  const translateY = interpolate(
    progress,
    [0, 1],
    [500, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const scale = interpolate(
    progress,
    [0, 1],
    [0.75, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity = interpolate(
    progress,
    [0, 0.15, 1],
    [0, 1, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,

        overflow: "hidden",

        background:
          "linear-gradient(180deg, #d8c9c0 0%, #d9bfd0 48%, #d89da2 100%)",
      }}
    >
      {/* ==================================================
          TOP CARD
      ================================================== */}

      <div
        style={{
          position: "absolute",

          top: 170,
          left: 45,

          width: 990,
          height: 700,

          opacity,

          transform:
            `translateY(${translateY}px) scale(${scale})`,

          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            position: "absolute",

            top: 20,
            left: 55,

            width: 900,
            height: 590,

            padding: 20,

            boxSizing: "border-box",

            backgroundColor: "#f1e3d4",

            transform: "rotate(4deg)",

            boxShadow:
              "0 18px 38px rgba(0,0,0,0.16)",
          }}
        >
          <Img
            src={sceneImages[0]?.path}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",

              display: "block",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",

            top: 55,
            left: 45,

            width: 900,
            height: 600,

            padding: 20,

            boxSizing: "border-box",

            backgroundColor: "#f5e6d5",

            transform: "rotate(-6deg)",

            boxShadow:
              "0 22px 45px rgba(0,0,0,0.22)",
          }}
        >
          <Img
            src={sceneImages[1]?.path}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",

              display: "block",
            }}
          />
        </div>
      </div>

      {/* ==================================================
          BOTTOM CARD
      ================================================== */}

      <div
        style={{
          position: "absolute",

          top: 1030,
          left: 45,

          width: 990,
          height: 700,

          opacity,

          transform:
            `translateY(${translateY}px) scale(${scale})`,

          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            position: "absolute",

            top: 20,
            left: 55,

            width: 900,
            height: 590,

            padding: 20,

            boxSizing: "border-box",

            backgroundColor: "#f1e3d4",

            transform: "rotate(-4deg)",

            boxShadow:
              "0 18px 38px rgba(0,0,0,0.16)",
          }}
        >
          <Img
            src={sceneImages[2]?.path}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",

              display: "block",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",

            top: 55,
            left: 45,

            width: 900,
            height: 600,

            padding: 20,

            boxSizing: "border-box",

            backgroundColor: "#f5e6d5",

            transform: "rotate(6deg)",

            boxShadow:
              "0 22px 45px rgba(0,0,0,0.22)",
          }}
        >
          <Img
            src={sceneImages[3]?.path}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",

              display: "block",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 3
// 8s → 11s
//
// FAST PHOTO SEQUENCE
// 90 FRAMES TOTAL
//
// 3 images
// EACH = 30 FRAMES = 1 SECOND
// ======================================================

const Scene3 = ({ images = [] }: { images: ImageItem[] }) => {
  const frame = useCurrentFrame();

  const sceneImages = images.slice(0, 3);

  const IMAGE_DURATION = 30;

  const currentIndex = Math.min(
    sceneImages.length - 1,
    Math.floor(frame / IMAGE_DURATION)
  );

  const currentImage =
    sceneImages[currentIndex];

  const localFrame =
    frame - currentIndex * IMAGE_DURATION;

  // ----------------------------------------------------
  // FAST FADE
  // ----------------------------------------------------

  const fadeIn = interpolate(
    localFrame,
    [0, 4],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const fadeOut = interpolate(
    localFrame,
    [26, 30],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity =
    Math.min(fadeIn, fadeOut);

  // ----------------------------------------------------
  // VERY SMALL ZOOM
  // NO ROTATION
  // NO SIDE MOVEMENT
  //
  // This keeps the frame stable.
  // ----------------------------------------------------

  const scale = interpolate(
    localFrame,
    [0, 30],
    [1.02, 1.05],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,

        backgroundColor: "#000",

        overflow: "hidden",
      }}
    >
      {currentImage?.path && (
        <Img
          src={currentImage.path}
          style={{
            position: "absolute",

            width: "100%",
            height: "100%",

            objectFit: "cover",

            opacity,

            transform:
              `scale(${scale})`,

            transformOrigin:
              "center center",

            filter:
              "grayscale(100%)",

            display: "block",
          }}
        />
      )}

      {/* SOFT OVERLAY */}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.04), rgba(0,0,0,0.15))",

          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 4
// 12s → 15s
//
// NOTE:
// Scene 3 now ends at 11 sec.
// 11 → 12 sec = black transition.
// 12 → 15 sec = Scene 4
// ======================================================

const Scene4 = ({ images = [] }: { images: ImageItem[] }) => {
  const frame = useCurrentFrame();

  const sceneImages = images.slice(0, 4);

  const imageDuration = 22.5;

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,

        backgroundColor: "#000",

        overflow: "hidden",
      }}
    >
      {sceneImages.map((image, index) => {
        const imageStart =
          index * imageDuration;

        const localFrame =
          frame - imageStart;

        const isZoomIn =
          index % 2 === 0;

        const scale = isZoomIn
          ? interpolate(
              localFrame,
              [0, imageDuration],
              [1, 1.12],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            )
          : interpolate(
              localFrame,
              [0, imageDuration],
              [1.12, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

        const opacity = interpolate(
          localFrame,
          [0, 5, imageDuration],
          [0, 1, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        return (
          <AbsoluteFill
            key={index}
            style={{
              opacity,

              transform:
                `scale(${scale})`,

              zIndex: index,
            }}
          >
            <Img
              src={image.path}
              style={{
                width: "100%",
                height: "100%",

                objectFit: "cover",

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
// MAIN COMPOSITION
// ======================================================

export const Template6 = ({
  images = [],
  music = undefined,
}: Template6Props) => {
  const musicSrc = music;

  console.log(
    "🎵 Template6 musicSrc:",
    musicSrc
  );

  return (
    <>
      {/* ==================================================
          MUSIC
      ================================================== */}

      {musicSrc && (
        <MusicPlayer
          src={musicSrc}
          volume={0.8}
          loop={true}
          showVisualizer={true}
        />
      )}

      {/* ==================================================
          SCENE 1
          0 → 6 SEC
      ================================================== */}

      <Sequence
        from={0}
        durationInFrames={180}
      >
        <Scene1 images={images} />
      </Sequence>

      {/* ==================================================
          SCENE 2
          6 → 8 SEC
      ================================================== */}

      <Sequence
        from={180}
        durationInFrames={60}
      >
        <Scene2 images={images} />
      </Sequence>

      {/* ==================================================
          SCENE 3
          8 → 11 SEC
          FAST PHOTOS
      ================================================== */}

      <Sequence
        from={240}
        durationInFrames={90}
      >
        <Scene3 images={images} />
      </Sequence>

      {/* ==================================================
          1 SECOND BLACK TRANSITION
          11 → 12 SEC
      ================================================== */}

      <Sequence
        from={330}
        durationInFrames={30}
      >
        <AbsoluteFill
          style={{
            backgroundColor: "#000",
          }}
        />
      </Sequence>

      {/* ==================================================
          SCENE 4
          12 → 15 SEC
      ================================================== */}

      <Sequence
        from={360}
        durationInFrames={90}
      >
        <Scene4 images={images} />
      </Sequence>
    </>
  );
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default Template6;