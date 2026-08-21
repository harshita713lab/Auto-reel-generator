import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  Easing,
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

interface Template49Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIGURATION
// ======================================================

export const FPS = 30;

// 20 seconds
// 20 × 30 = 600 frames
export const DURATION_IN_FRAMES = 600;

// Exactly 8 photos
export const IMAGE_COUNT = 8;

// ======================================================
// DEFAULT PROPS
// ======================================================

export const DEFAULT_PROPS: Template49Props = {
  images: [
    {
      path:
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
    },
    {
      path:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop",
    },
    {
      path:
        "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1000&auto=format&fit=crop",
    },
    {
      path:
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1000&auto=format&fit=crop",
    },
    {
      path:
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000&auto=format&fit=crop",
    },
    {
      path:
        "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1000&auto=format&fit=crop",
    },
    {
      path:
        "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1000&auto=format&fit=crop",
    },
    {
      path:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop",
    },
  ],

  music: undefined,
};

// ======================================================
// CLAMP
// ======================================================

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// IMAGE SOURCE
// ======================================================

const getImgSrc = (
  images: ImageItem[] | undefined,
  index: number
): string => {
  if (!images || images.length === 0) {
    return DEFAULT_PROPS.images![0].path;
  }

  const safeIdx =
    Math.abs(index) % images.length;

  const img = images[safeIdx];

  if (img?.url) {
    return img.url;
  }

  if (img?.path) {
    return img.path;
  }

  return (
    DEFAULT_PROPS.images![
      safeIdx % DEFAULT_PROPS.images!.length
    ]?.path || ""
  );
};

// ======================================================
// SMOOTH CINEMATIC PROGRESS
// ======================================================
//
// IMPORTANT:
// Previous version used aggressive FAST-SLOW-FAST
// velocity ramps. That caused visible shaking/jumping.
//
// This version uses one smooth cinematic curve.
// ======================================================

const getSmoothProgress = (
  localFrame: number,
  duration: number
): number => {
  const progress = Math.max(
    0,
    Math.min(
      1,
      localFrame / duration
    )
  );

  return Easing.bezier(
    0.22,
    1,
    0.36,
    1
  )(progress);
};

// ======================================================
// EXTRA SLOW CINEMATIC PROGRESS
// Used for subtle camera movement.
// ======================================================

const getSoftProgress = (
  localFrame: number,
  duration: number
): number => {
  const progress = Math.max(
    0,
    Math.min(
      1,
      localFrame / duration
    )
  );

  return Easing.bezier(
    0.25,
    0.1,
    0.25,
    1
  )(progress);
};

// ======================================================
// GOLDEN DUST & RAIN FX
// ======================================================

const GoldenDustAndRainOverlay: React.FC<{
  frame: number;
}> = ({ frame }) => {
  const streaks = [
    {
      id: 1,
      left: 10,
      length: 140,
      speed: 18,
      opacity: 0.35,
    },
    {
      id: 2,
      left: 26,
      length: 110,
      speed: 22,
      opacity: 0.45,
    },
    {
      id: 3,
      left: 42,
      length: 160,
      speed: 16,
      opacity: 0.28,
    },
    {
      id: 4,
      left: 58,
      length: 120,
      speed: 20,
      opacity: 0.38,
    },
    {
      id: 5,
      left: 74,
      length: 150,
      speed: 23,
      opacity: 0.3,
    },
    {
      id: 6,
      left: 90,
      length: 125,
      speed: 18,
      opacity: 0.4,
    },
  ];

  const floatingDust = [
    {
      id: 1,
      x: 15,
      y: 30,
      size: 10,
      speedY: -0.18,
    },
    {
      id: 2,
      x: 80,
      y: 60,
      size: 14,
      speedY: -0.24,
    },
    {
      id: 3,
      x: 45,
      y: 85,
      size: 8,
      speedY: -0.14,
    },
    {
      id: 4,
      x: 70,
      y: 20,
      size: 12,
      speedY: -0.2,
    },
    {
      id: 5,
      x: 30,
      y: 50,
      size: 16,
      speedY: -0.26,
    },
  ];

  // Slower light leak
  const lightLeakOpacity = interpolate(
    frame % 120,
    [0, 60, 120],
    [0.08, 0.28, 0.08],
    clamp
  );

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 15,
        overflow: "hidden",
      }}
    >
      {/* ==================================================
          LIGHT LEAK
          ================================================== */}

      <div
        style={{
          position: "absolute",

          top: "-15%",
          right: "-15%",

          width: "60%",
          height: "45%",

          background:
            "radial-gradient(circle, rgba(255,210,130,0.5) 0%, rgba(255,140,50,0.2) 50%, rgba(0,0,0,0) 80%)",

          filter: "blur(40px)",

          opacity:
            lightLeakOpacity,

          transform:
            "rotate(-15deg)",
        }}
      />

      {/* ==================================================
          RAIN STREAKS
          ================================================== */}

      {streaks.map((s) => {
        const streakY =
          ((frame * s.speed +
            s.id * 50) %
            2200) -
          200;

        return (
          <div
            key={s.id}
            style={{
              position: "absolute",

              left: `${s.left}%`,

              top: streakY,

              width: 2,

              height: s.length,

              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.75), transparent)",

              opacity:
                s.opacity,

              transform:
                "rotate(6deg)",
            }}
          />
        );
      })}

      {/* ==================================================
          FLOATING GOLDEN DUST
          ================================================== */}

      {floatingDust.map((p) => {
        const currentY =
          ((p.y +
            frame * p.speedY) %
            100 +
            100) %
          100;

        const opacity =
          interpolate(
            (frame +
              p.id * 20) %
              120,
            [0, 60, 120],
            [0.2, 0.7, 0.2],
            clamp
          );

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",

              left: `${p.x}%`,

              top: `${currentY}%`,

              width: p.size,
              height: p.size,

              borderRadius: "50%",

              backgroundColor:
                "rgba(255, 220, 140, 0.85)",

              boxShadow:
                "0 0 12px rgba(255, 220, 140, 0.95)",

              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 1
// 3D DIAMOND GLASS SHARD
// ======================================================

const DiamondShardScene: React.FC<{
  imgSrc: string;
  localFrame: number;
  duration: number;
}> = ({
  imgSrc,
  localFrame,
  duration,
}) => {
  const progress =
    getSmoothProgress(
      localFrame,
      duration
    );

  // Very subtle camera movement
  const zoom =
    interpolate(
      progress,
      [0, 0.35, 1],
      [1.18, 1.02, 1.06],
      clamp
    );

  const cardScale =
    interpolate(
      progress,
      [0, 0.3, 1],
      [0.96, 1, 1.02],
      clamp
    );

  const cardY =
    interpolate(
      progress,
      [0, 1],
      [20, -8],
      clamp
    );

  const opacity =
    interpolate(
      localFrame,
      [0, 12, duration - 12, duration],
      [0, 1, 1, 0],
      clamp
    );

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor:
          "#06080D",
        overflow: "hidden",
      }}
    >
      {/* ==================================================
          BACKGROUND
          ================================================== */}

      <Img
        src={imgSrc}
        style={{
          width: "100%",
          height: "100%",

          objectFit: "cover",

          filter:
            "blur(18px) brightness(0.38)",

          transform:
            `scale(${zoom})`,

          display: "block",
        }}
      />

      {/* Soft background overlay */}

      <AbsoluteFill
        style={{
          background:
            "rgba(0,0,0,0.12)",
        }}
      />

      {/* ==================================================
          MAIN DIAMOND CARD
          ================================================== */}

      <div
        style={{
          position: "absolute",

          top: "12%",
          left: "10%",

          width: "80%",
          height: "72%",

          borderRadius: 28,

          overflow: "hidden",

          border:
            "4px solid rgba(255,255,255,0.85)",

          boxShadow:
            "0 30px 80px rgba(0,0,0,0.9), 0 0 50px rgba(255,220,150,0.3)",

          transform: `
            scale(${cardScale})
            translateY(${cardY}px)
          `,

          zIndex: 2,
        }}
      >
        <Img
          src={imgSrc}
          style={{
            width: "100%",
            height: "100%",

            objectFit: "cover",

            display: "block",

            transform:
              `scale(${1.02 + progress * 0.025})`,
          }}
        />

        {/* Card subtle dark gradient */}

        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.12))",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 2
// FLOATING GLASS PRISM COLLAGE
// ======================================================

const GlassPrismCollageScene: React.FC<{
  img1: string;
  img2: string;
  localFrame: number;
  duration: number;
}> = ({
  img1,
  img2,
  localFrame,
  duration,
}) => {
  const progress =
    getSmoothProgress(
      localFrame,
      duration
    );

  const opacity =
    interpolate(
      localFrame,
      [0, 12, duration - 12, duration],
      [0, 1, 1, 0],
      clamp
    );

  // Reduced rotation
  const rotY1 =
    interpolate(
      progress,
      [0, 1],
      [-12, 8],
      clamp
    );

  const rotY2 =
    interpolate(
      progress,
      [0, 1],
      [12, -8],
      clamp
    );

  // Reduced horizontal movement
  const slideX1 =
    interpolate(
      progress,
      [0, 1],
      [-180, 180],
      clamp
    );

  const slideX2 =
    interpolate(
      progress,
      [0, 1],
      [180, -180],
      clamp
    );

  // Tiny vertical floating
  const floatY =
    interpolate(
      progress,
      [0, 0.5, 1],
      [8, -4, 6],
      clamp
    );

  return (
    <AbsoluteFill
      style={{
        opacity,

        backgroundColor:
          "#070A10",

        perspective:
          "1400px",

        overflow:
          "hidden",
      }}
    >
      {/* ==================================================
          CARD 1
          ================================================== */}

      <div
        style={{
          position: "absolute",

          top: "14%",
          left: "6%",

          width: "48%",
          height: "64%",

          borderRadius: 24,

          overflow: "hidden",

          border:
            "3px solid rgba(255,255,255,0.8)",

          boxShadow:
            "0 25px 60px rgba(0,0,0,0.85)",

          transform: `
            translateX(${slideX1}px)
            translateY(${floatY}px)
            rotateY(${rotY1}deg)
            rotateZ(-2deg)
          `,

          zIndex: 2,
        }}
      >
        <Img
          src={img1}
          style={{
            width: "100%",
            height: "100%",

            objectFit: "cover",

            display: "block",
          }}
        />

        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.12))",
          }}
        />
      </div>

      {/* ==================================================
          CARD 2
          ================================================== */}

      <div
        style={{
          position: "absolute",

          top: "22%",
          right: "6%",

          width: "48%",
          height: "64%",

          borderRadius: 24,

          overflow: "hidden",

          border:
            "3px solid rgba(255,255,255,0.9)",

          boxShadow:
            "0 30px 70px rgba(0,0,0,0.9)",

          transform: `
            translateX(${slideX2}px)
            translateY(${-floatY}px)
            rotateY(${rotY2}deg)
            rotateZ(2deg)
          `,

          zIndex: 3,
        }}
      >
        <Img
          src={img2}
          style={{
            width: "100%",
            height: "100%",

            objectFit: "cover",

            display: "block",
          }}
        />

        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.12))",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 3
// FILM STRIP REEL ROLL
// ======================================================

const FilmStripCollageScene: React.FC<{
  img1: string;
  img2: string;
  img3: string;
  localFrame: number;
  duration: number;
}> = ({
  img1,
  img2,
  img3,
  localFrame,
  duration,
}) => {
  const progress =
    getSmoothProgress(
      localFrame,
      duration
    );

  const opacity =
    interpolate(
      localFrame,
      [0, 12, duration - 12, duration],
      [0, 1, 1, 0],
      clamp
    );

  // Much smaller movement
  const filmTrackX =
    interpolate(
      progress,
      [0, 1],
      [180, -420],
      clamp
    );

  // Subtle rotation only
  const filmRotation =
    interpolate(
      progress,
      [0, 1],
      [-2, -4],
      clamp
    );

  return (
    <AbsoluteFill
      style={{
        opacity,

        backgroundColor:
          "#05070B",

        overflow:
          "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",

          top: "18%",

          height: "60%",

          display: "flex",

          flexDirection:
            "row",

          gap: 28,

          transform: `
            translateX(${filmTrackX}px)
            rotate(${filmRotation}deg)
          `,

          padding:
            "20px 40px",

          backgroundColor:
            "rgba(15,18,25,0.95)",

          borderTop:
            "6px dashed rgba(255,255,255,0.75)",

          borderBottom:
            "6px dashed rgba(255,255,255,0.75)",

          boxShadow:
            "0 25px 60px rgba(0,0,0,0.9)",
        }}
      >
        {[
          img1,
          img2,
          img3,
          img1,
        ].map(
          (
            imgSrc,
            i
          ) => (
            <div
              key={i}
              style={{
                width: 320,
                height: "100%",

                borderRadius: 16,

                overflow: "hidden",

                border:
                  "3px solid rgba(255,255,255,0.85)",

                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.7)",

                flexShrink: 0,
              }}
            >
              <Img
                src={imgSrc}
                style={{
                  width: "100%",
                  height: "100%",

                  objectFit:
                    "cover",

                  display:
                    "block",
                }}
              />
            </div>
          )
        )}
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 4
// SOFT HERO FLASH CUT
// ======================================================

const FlashHeroScene: React.FC<{
  imgSrc: string;
  localFrame: number;
  duration: number;
}> = ({
  imgSrc,
  localFrame,
  duration,
}) => {
  const progress =
    getSmoothProgress(
      localFrame,
      duration
    );

  const opacity =
    interpolate(
      localFrame,
      [0, 10, duration - 10, duration],
      [0, 1, 1, 0],
      clamp
    );

  const scale =
    interpolate(
      progress,
      [0, 0.4, 1],
      [1.12, 1.02, 1.06],
      clamp
    );

  const y =
    interpolate(
      progress,
      [0, 1],
      [8, -8],
      clamp
    );

  // Very short soft flash
  const flashOpacity =
    interpolate(
      localFrame,
      [0, 3, 8],
      [0.45, 0.12, 0],
      clamp
    );

  return (
    <AbsoluteFill
      style={{
        opacity,
        overflow: "hidden",
      }}
    >
      <Img
        src={imgSrc}
        style={{
          width: "100%",
          height: "100%",

          objectFit: "cover",

          transform: `
            scale(${scale})
            translateY(${y}px)
          `,

          filter:
            "contrast(1.08) brightness(0.95)",

          display:
            "block",
        }}
      />

      <AbsoluteFill
        style={{
          backgroundColor:
            "#FFFFFF",

          opacity:
            flashOpacity,

          zIndex: 30,
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.25))",
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 5
// 3D CUBE SPIN
// ======================================================

const CubeSpinScene: React.FC<{
  frontImg: string;
  nextImg: string;
  localFrame: number;
  duration: number;
}> = ({
  frontImg,
  nextImg,
  localFrame,
  duration,
}) => {
  const progress =
    getSmoothProgress(
      localFrame,
      duration
    );

  const opacity =
    interpolate(
      localFrame,
      [0, 10, duration - 10, duration],
      [0, 1, 1, 0],
      clamp
    );

  // Reduced cube rotation
  const cubeAngle =
    interpolate(
      progress,
      [0, 0.35, 1],
      [0, -35, -90],
      clamp
    );

  return (
    <AbsoluteFill
      style={{
        opacity,

        backgroundColor:
          "#06080D",

        perspective:
          "1400px",

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        overflow:
          "hidden",
      }}
    >
      <div
        style={{
          width: "75%",
          height: "68%",

          position:
            "relative",

          transformStyle:
            "preserve-3d",

          transform:
            `rotateY(${cubeAngle}deg)`,
        }}
      >
        {/* ==================================================
            FRONT
            ================================================== */}

        <div
          style={{
            position:
              "absolute",

            inset: 0,

            borderRadius: 24,

            overflow:
              "hidden",

            border:
              "4px solid rgba(255,255,255,0.9)",

            boxShadow:
              "0 25px 60px rgba(0,0,0,0.9)",

            transform:
              "translateZ(300px)",

            backfaceVisibility:
              "hidden",
          }}
        >
          <Img
            src={frontImg}
            style={{
              width: "100%",
              height: "100%",

              objectFit:
                "cover",

              display:
                "block",
            }}
          />
        </div>

        {/* ==================================================
            RIGHT FACE
            ================================================== */}

        <div
          style={{
            position:
              "absolute",

            inset: 0,

            borderRadius: 24,

            overflow:
              "hidden",

            border:
              "4px solid rgba(255,255,255,0.9)",

            boxShadow:
              "0 25px 60px rgba(0,0,0,0.9)",

            transform:
              "rotateY(90deg) translateZ(300px)",

            backfaceVisibility:
              "hidden",
          }}
        >
          <Img
            src={nextImg}
            style={{
              width: "100%",
              height: "100%",

              objectFit:
                "cover",

              display:
                "block",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 6
// DUAL DIAGONAL GLASS COLLAGE
// ======================================================

const DualGlassCollageScene: React.FC<{
  img1: string;
  img2: string;
  localFrame: number;
  duration: number;
}> = ({
  img1,
  img2,
  localFrame,
  duration,
}) => {
  const progress =
    getSmoothProgress(
      localFrame,
      duration
    );

  const opacity =
    interpolate(
      localFrame,
      [0, 10, duration - 10, duration],
      [0, 1, 1, 0],
      clamp
    );

  // Reduced movement
  const topY =
    interpolate(
      progress,
      [0, 1],
      [-220, 220],
      clamp
    );

  const bottomY =
    interpolate(
      progress,
      [0, 1],
      [220, -220],
      clamp
    );

  // Very subtle rotation
  const topRotate =
    interpolate(
      progress,
      [0, 1],
      [1.5, 3],
      clamp
    );

  const bottomRotate =
    interpolate(
      progress,
      [0, 1],
      [-1.5, -3],
      clamp
    );

  return (
    <AbsoluteFill
      style={{
        opacity,

        backgroundColor:
          "#06080D",

        overflow:
          "hidden",
      }}
    >
      {/* ==================================================
          TOP IMAGE
          ================================================== */}

      <div
        style={{
          position:
            "absolute",

          top: "8%",
          left: "8%",

          width: "84%",
          height: "40%",

          borderRadius: 22,

          overflow:
            "hidden",

          border:
            "3px solid rgba(255,255,255,0.85)",

          transform: `
            translateY(${topY}px)
            rotate(${topRotate}deg)
          `,

          boxShadow:
            "0 20px 50px rgba(0,0,0,0.8)",
        }}
      >
        <Img
          src={img1}
          style={{
            width: "100%",
            height: "100%",

            objectFit:
              "cover",

            display:
              "block",
          }}
        />
      </div>

      {/* ==================================================
          BOTTOM IMAGE
          ================================================== */}

      <div
        style={{
          position:
            "absolute",

          bottom: "14%",
          left: "8%",

          width: "84%",
          height: "40%",

          borderRadius: 22,

          overflow:
            "hidden",

          border:
            "3px solid rgba(255,255,255,0.85)",

          transform: `
            translateY(${bottomY}px)
            rotate(${bottomRotate}deg)
          `,

          boxShadow:
            "0 20px 50px rgba(0,0,0,0.8)",
        }}
      >
        <Img
          src={img2}
          style={{
            width: "100%",
            height: "100%",

            objectFit:
              "cover",

            display:
              "block",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 7
// GRAND CLOSING HERO
// ======================================================

const ClosingHeroScene: React.FC<{
  imgSrc: string;
  localFrame: number;
  duration: number;
}> = ({
  imgSrc,
  localFrame,
  duration,
}) => {
  const progress =
    getSoftProgress(
      localFrame,
      duration
    );

  const opacity =
    interpolate(
      localFrame,
      [0, 10, duration - 12, duration],
      [0, 1, 1, 0],
      clamp
    );

  // Very slow cinematic zoom
  const scale =
    interpolate(
      progress,
      [0, 1],
      [1.05, 1.12],
      clamp
    );

  const y =
    interpolate(
      progress,
      [0, 1],
      [0, -8],
      clamp
    );

  return (
    <AbsoluteFill
      style={{
        opacity,

        overflow:
          "hidden",
      }}
    >
      <Img
        src={imgSrc}
        style={{
          width: "100%",
          height: "100%",

          objectFit:
            "cover",

          transform: `
            scale(${scale})
            translateY(${y}px)
          `,

          filter:
            "contrast(1.08) brightness(0.92)",

          display:
            "block",
        }}
      />

      {/* Cinematic overlay */}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.28))",
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// MAIN TEMPLATE 49
// ======================================================

export const Template49: React.FC<
  Template49Props
> = ({
  images,
  music,
}) => {
  const frame =
    useCurrentFrame();

  const musicSrc =
    typeof music === "string"
      ? music
      : music?.path;

  // ====================================================
  // SCENE LOCAL FRAMES
  // ====================================================

  const s1Local =
    frame;

  const s2Local =
    Math.max(
      0,
      frame - 90
    );

  const s3Local =
    Math.max(
      0,
      frame - 180
    );

  const s4Local =
    Math.max(
      0,
      frame - 270
    );

  const s5Local =
    Math.max(
      0,
      frame - 360
    );

  const s6Local =
    Math.max(
      0,
      frame - 450
    );

  const s7Local =
    Math.max(
      0,
      frame - 530
    );

  // ====================================================
  // GLOBAL FADE
  // ====================================================

  const globalOpacity =
    interpolate(
      frame,
      [0, 8, 592, 600],
      [0, 1, 1, 0],
      clamp
    );

  return (
    <AbsoluteFill
      style={{
        backgroundColor:
          "#06080D",

        color:
          "#FFF",

        overflow:
          "hidden",

        opacity:
          globalOpacity,
      }}
    >

      {/* ==================================================
          GLOBAL GOLDEN DUST / RAIN
          ================================================== */}

      <GoldenDustAndRainOverlay
        frame={frame}
      />

      {/* ==================================================
          VIGNETTE
          ================================================== */}

      <AbsoluteFill
        style={{
          pointerEvents:
            "none",

          zIndex: 20,

          background:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      {/* ==================================================
          SCENE 1
          FRAMES 0 - 100
          PHOTO 0
          ================================================== */}

      {frame >= 0 &&
        frame <= 100 && (
          <AbsoluteFill
            style={{
              zIndex: 1,
            }}
          >
            <DiamondShardScene
              imgSrc={getImgSrc(
                images,
                0
              )}
              localFrame={
                s1Local
              }
              duration={100}
            />
          </AbsoluteFill>
        )}

      {/* ==================================================
          SCENE 2
          FRAMES 90 - 190
          PHOTOS 1, 2
          ================================================== */}

      {frame >= 90 &&
        frame <= 190 && (
          <AbsoluteFill
            style={{
              zIndex: 2,
            }}
          >
            <GlassPrismCollageScene
              img1={getImgSrc(
                images,
                1
              )}
              img2={getImgSrc(
                images,
                2
              )}
              localFrame={
                s2Local
              }
              duration={100}
            />
          </AbsoluteFill>
        )}

      {/* ==================================================
          SCENE 3
          FRAMES 180 - 280
          PHOTOS 2, 3, 4
          ================================================== */}

      {frame >= 180 &&
        frame <= 280 && (
          <AbsoluteFill
            style={{
              zIndex: 3,
            }}
          >
            <FilmStripCollageScene
              img1={getImgSrc(
                images,
                2
              )}
              img2={getImgSrc(
                images,
                3
              )}
              img3={getImgSrc(
                images,
                4
              )}
              localFrame={
                s3Local
              }
              duration={100}
            />
          </AbsoluteFill>
        )}

      {/* ==================================================
          SCENE 4
          FRAMES 270 - 370
          PHOTO 5
          ================================================== */}

      {frame >= 270 &&
        frame <= 370 && (
          <AbsoluteFill
            style={{
              zIndex: 4,
            }}
          >
            <FlashHeroScene
              imgSrc={getImgSrc(
                images,
                5
              )}
              localFrame={
                s4Local
              }
              duration={100}
            />
          </AbsoluteFill>
        )}

      {/* ==================================================
          SCENE 5
          FRAMES 360 - 460
          PHOTOS 6, 7
          ================================================== */}

      {frame >= 360 &&
        frame <= 460 && (
          <AbsoluteFill
            style={{
              zIndex: 5,
            }}
          >
            <CubeSpinScene
              frontImg={getImgSrc(
                images,
                6
              )}
              nextImg={getImgSrc(
                images,
                7
              )}
              localFrame={
                s5Local
              }
              duration={100}
            />
          </AbsoluteFill>
        )}

      {/* ==================================================
          SCENE 6
          FRAMES 450 - 540
          PHOTOS 7, 0
          ================================================== */}

      {frame >= 450 &&
        frame <= 540 && (
          <AbsoluteFill
            style={{
              zIndex: 6,
            }}
          >
            <DualGlassCollageScene
              img1={getImgSrc(
                images,
                7
              )}
              img2={getImgSrc(
                images,
                0
              )}
              localFrame={
                s6Local
              }
              duration={90}
            />
          </AbsoluteFill>
        )}

      {/* ==================================================
          SCENE 7
          FRAMES 530 - 600
          PHOTO 0
          ================================================== */}

      {frame >= 530 &&
        frame <= 600 && (
          <AbsoluteFill
            style={{
              zIndex: 7,
            }}
          >
            <ClosingHeroScene
              imgSrc={getImgSrc(
                images,
                0
              )}
              localFrame={
                s7Local
              }
              duration={70}
            />
          </AbsoluteFill>
        )}

      {/* ==================================================
          AUDIO
          ================================================== */}

      {musicSrc && (
        <MusicPlayer
          src={musicSrc}
          volume={
            music?.volume ?? 1
          }
          showVisualizer={true}
        />
      )}
    </AbsoluteFill>
  );
};

export default Template49;