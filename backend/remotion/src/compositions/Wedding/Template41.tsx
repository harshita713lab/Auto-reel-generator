import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  Easing,
  staticFile,
} from "remotion";

// ======================================================
// CONFIG
// ======================================================

export const FPS = 30;
export const DURATION_IN_FRAMES = 462; // 15.4 sec
export const IMAGE_COUNT = 10;

const TOTAL_IMAGES = 10;

// Scene timings
const INTRO_END = 30;        // 0 - 1 sec
const COLLAGE_END = 168;     // 1 - 5.6 sec
const SHOWCASE_END = 462;    // 5.6 - 15.4 sec

interface ImageItem {
  path: string;
}

interface TemplateProps {
  images?: ImageItem[];
}

// ======================================================
// DEFAULT IMAGES
// ======================================================

const DEFAULT_IMAGES: ImageItem[] = Array.from(
  { length: TOTAL_IMAGES },
  () => ({
    path:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
  })
);

// ======================================================
// GRID POSITIONS
// ======================================================

const GRID = [
  {
    left: "3%",
    top: "7%",
    width: "50%",
    height: "45%",
  },
  {
    left: "54%",
    top: "7%",
    width: "21%",
    height: "23%",
  },
  {
    left: "77%",
    top: "7%",
    width: "21%",
    height: "23%",
  },
  {
    left: "54%",
    top: "31%",
    width: "21%",
    height: "23%",
  },
  {
    left: "77%",
    top: "31%",
    width: "21%",
    height: "23%",
  },
  {
    left: "3%",
    top: "53%",
    width: "24%",
    height: "21%",
  },
  {
    left: "28%",
    top: "53%",
    width: "24%",
    height: "21%",
  },
  {
    left: "54%",
    top: "55%",
    width: "44%",
    height: "35%",
  },
  {
    left: "3%",
    top: "75%",
    width: "24%",
    height: "21%",
  },
  {
    left: "28%",
    top: "75%",
    width: "24%",
    height: "21%",
  },
];

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// MAIN
// ======================================================

export const ExactReelTemplate: React.FC<TemplateProps> = ({
  images,
}) => {
  const frame = useCurrentFrame();

  const safeImages =
    images && images.length >= TOTAL_IMAGES
      ? images.slice(0, TOTAL_IMAGES)
      : DEFAULT_IMAGES;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* ==============================================
          INTRO
      ============================================== */}

      {frame < INTRO_END && (
        <IntroScene frame={frame} />
      )}

      {/* ==============================================
          COLLAGE
      ============================================== */}

      {frame >= INTRO_END && frame < COLLAGE_END && (
        <CollageScene
          images={safeImages}
          frame={frame - INTRO_END}
        />
      )}

      {/* ==============================================
          FULLSCREEN SHOWCASE
      ============================================== */}

      {frame >= COLLAGE_END && (
        <ShowcaseScene
          images={safeImages}
          frame={frame - COLLAGE_END}
        />
      )}
    </AbsoluteFill>
  );
};

// ======================================================
// INTRO
// ======================================================

const IntroScene: React.FC<{ frame: number }> = ({
  frame,
}) => {
  const opacity = interpolate(
    frame,
    [0, 12, 24, 30],
    [0, 1, 1, 0],
    clamp
  );

  const scale = interpolate(
    frame,
    [0, 30],
    [0.8, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            fontSize: 22,
            display: "flex",
            gap: 5,
          }}
        >
          🌿 🤍 🧸
        </div>

        <div
          style={{
            fontFamily:
              "Brush Script MT, cursive",
            fontSize: 58,
            color: "#d4edbc",
            fontStyle: "italic",
            letterSpacing: 1,
            textShadow:
              "0 4px 18px rgba(0,0,0,0.9)",
          }}
        >
          i love you
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// COLLAGE SCENE
// ======================================================

const CollageScene: React.FC<{
  images: ImageItem[];
  frame: number;
}> = ({ images, frame }) => {
  // Background image changes quickly
  const bgIndex =
    Math.floor(frame / 5) % images.length;

  const bgImage =
    images[bgIndex]?.path ||
    images[0]?.path;

  // Whole collage subtle zoom
  const collageScale = interpolate(
    frame,
    [0, 135],
    [1.05, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // Dark → visible
  const backgroundOpacity = interpolate(
    frame,
    [0, 30],
    [0, 0.8],
    clamp
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
      }}
    >
      {/* ==========================================
          MOVING BACKGROUND
      ========================================== */}

      <AbsoluteFill>
        <Img
          src={bgImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter:
              "blur(25px) brightness(0.38)",
            transform: "scale(1.12)",
          }}
        />

        <AbsoluteFill
          style={{
            background:
              `rgba(0,0,0,${backgroundOpacity})`,
          }}
        />
      </AbsoluteFill>

      {/* ==========================================
          COLLAGE
      ========================================== */}

      <AbsoluteFill
        style={{
          transform: `scale(${collageScale})`,
        }}
      >
        {GRID.map((pos, index) => {
          /*
           * IMPORTANT:
           * staggered timing
           */

          const delay = 10 + index * 7;

          const localFrame =
            frame - delay;

          const opacity = interpolate(
            localFrame,
            [0, 8, 18],
            [0, 1, 1],
            clamp
          );

          const scale = interpolate(
            localFrame,
            [0, 14, 26],
            [0.65, 1.04, 1],
            {
              ...clamp,
              easing:
                Easing.out(
                  Easing.back(1.7)
                ),
            }
          );

          const translateY = interpolate(
            localFrame,
            [0, 18],
            [35, 0],
            {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            }
          );

          if (localFrame < 0) {
            return null;
          }

          const image =
            images[index]?.path ||
            images[0]?.path;

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: pos.left,
                top: pos.top,
                width: pos.width,
                height: pos.height,

                opacity,

                transform:
                  `translateY(${translateY}px) ` +
                  `scale(${scale})`,

                overflow: "hidden",

                borderRadius:
                  index === 0 ||
                  index === 7
                    ? 10
                    : 5,

                border:
                  "2px solid rgba(255,255,255,0.88)",

                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.7)",

                backgroundColor: "#111",

                zIndex: 20 + index,
              }}
            >
              <Img
                src={image}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* ==========================================
          CENTER TEXT
      ========================================== */}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "52%",
          transform:
            "translate(-50%,-50%)",
          zIndex: 100,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",

          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 5,
            fontSize: 21,
          }}
        >
          🌿 🤍 🧸
        </div>

        <div
          style={{
            fontFamily:
              "Brush Script MT, cursive",
            fontSize: 62,
            color: "#d4edbc",
            fontStyle: "italic",
            letterSpacing: 1,

            textShadow:
              "0 3px 15px rgba(0,0,0,0.95)",

            opacity: interpolate(
              frame,
              [45, 65],
              [0, 1],
              clamp
            ),
          }}
        >
          i love you
        </div>
      </div>

      {/* ==========================================
          SOFT FLASH DURING COLLAGE
      ========================================== */}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.18), transparent 60%)",

          opacity: interpolate(
            frame,
            [115, 130, 145],
            [0, 0.55, 0],
            clamp
          ),

          pointerEvents: "none",
          zIndex: 200,
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// SHOWCASE SCENE
// ======================================================

// ======================================================
// SCENE 2 — REFERENCE VIDEO STYLE
// FULLSCREEN VINTAGE / BLUR / LIGHT LEAK / FILM EFFECT
// ======================================================

const ShowcaseScene: React.FC<{
  images: ImageItem[];
  frame: number;
}> = ({ images, frame }) => {

  // Scene 2 = 462 - 165 = 297 frames
  const SCENE2_DURATION = SHOWCASE_END - COLLAGE_END;

  // 10 photos distributed across Scene 2
  const FRAMES_PER_IMAGE =
    SCENE2_DURATION / images.length;

  const imageIndex = Math.min(
    Math.floor(frame / FRAMES_PER_IMAGE),
    images.length - 1
  );

  const image =
    images[imageIndex]?.path ||
    images[0]?.path;

  // Current image ka local frame
  const localFrame =
    frame - imageIndex * FRAMES_PER_IMAGE;

  // ====================================================
  // PHOTO ZOOM
  // ====================================================

  const zoom = interpolate(
    localFrame,
    [0, FRAMES_PER_IMAGE],
    [1.025, 1.085],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // ====================================================
  // SLOW PAN
  // ====================================================

  const panDirection =
    imageIndex % 2 === 0 ? 1 : -1;

  const panX = interpolate(
    localFrame,
    [0, FRAMES_PER_IMAGE],
    [
      panDirection * -4,
      panDirection * 4,
    ],
    clamp
  );

  const panY = interpolate(
    localFrame,
    [0, FRAMES_PER_IMAGE],
    [
      imageIndex % 3 === 0 ? -2 : 2,
      imageIndex % 3 === 0 ? 2 : -2,
    ],
    clamp
  );

  // ====================================================
  // BLUR → CLEAR TRANSITION
  // ====================================================

  const blur = interpolate(
    localFrame,
    [0, 3, 7, 12, 18],
    [10, 7, 3, 0.5, 0],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ====================================================
  // PHOTO OPACITY
  // ====================================================

  const photoOpacity = interpolate(
    localFrame,
    [0, 4, 9, 15],
    [0.45, 0.78, 1, 1],
    clamp
  );

  // ====================================================
  // WHITE FLASH
  // ====================================================

  const flashOpacity = interpolate(
    localFrame,
    [0, 2, 5, 9],
    [0.72, 0.28, 0.06, 0],
    clamp
  );

  // ====================================================
  // WARM LIGHT LEAK MOVEMENT
  // ====================================================

  const leakX = interpolate(
    localFrame,
    [0, FRAMES_PER_IMAGE * 0.45, FRAMES_PER_IMAGE],
    [-15, 55, 15],
    clamp
  );

  const leakY = interpolate(
    localFrame,
    [0, FRAMES_PER_IMAGE],
    [70, 25],
    clamp
  );

  const leakOpacity = interpolate(
    localFrame,
    [0, 5, 12, 22, FRAMES_PER_IMAGE],
    [0.12, 0.42, 0.25, 0.34, 0.16],
    clamp
  );

  // ====================================================
  // SECOND LIGHT LEAK
  // ====================================================

  const secondLeakX = interpolate(
    localFrame,
    [0, FRAMES_PER_IMAGE],
    [85, 25],
    clamp
  );

  // ====================================================
  // HEART ANIMATION
  // ====================================================

  const heartScale = interpolate(
    localFrame,
    [0, 4, 8, 15],
    [0.55, 1.12, 1, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.back(1.5)),
    }
  );

  const heartOpacity = interpolate(
    localFrame,
    [0, 4, 9],
    [0, 1, 1],
    clamp
  );

  // ====================================================
  // FILM FLICKER
  // ====================================================

  const flicker =
    imageIndex % 2 === 0
      ? interpolate(
          localFrame,
          [0, 5, 10, 16, 24, 30],
          [0.10, 0.18, 0.07, 0.15, 0.08, 0.12],
          clamp
        )
      : interpolate(
          localFrame,
          [0, 6, 12, 19, 26, 30],
          [0.08, 0.16, 0.06, 0.13, 0.08, 0.11],
          clamp
        );

  // ====================================================
  // RANDOM FILM SCRATCH MOVEMENT
  // ====================================================

  const scratch1 =
    (frame * 1.7 + imageIndex * 37) % 100;

  const scratch2 =
    (frame * 1.1 + imageIndex * 61) % 100;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#090807",
        overflow: "hidden",
      }}
    >

      {/* ==================================================
          MAIN PHOTO
      ================================================== */}

      <AbsoluteFill
        style={{
          overflow: "hidden",
          opacity: photoOpacity,
        }}
      >
        <Img
          src={image}
          style={{
            width: "100%",
            height: "100%",

            objectFit: "cover",

            transform:
              `translate(${panX}px, ${panY}px) ` +
              `scale(${zoom})`,

            filter:
              `blur(${blur}px) ` +
              "sepia(0.10) " +
              "saturate(0.90) " +
              "contrast(0.96) " +
              "brightness(0.97)",
          }}
        />
      </AbsoluteFill>


      {/* ==================================================
          WARM MOVING LIGHT LEAK
      ================================================== */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          background:
            `radial-gradient(
              ellipse at ${leakX}% ${leakY}%,
              rgba(255,190,90,0.46) 0%,
              rgba(232,157,65,0.25) 14%,
              rgba(170,100,35,0.13) 30%,
              transparent 58%
            )`,

          opacity: leakOpacity,

          mixBlendMode: "screen",
        }}
      />


      {/* ==================================================
          SECOND LIGHT LEAK
      ================================================== */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          background:
            `radial-gradient(
              ellipse at ${secondLeakX}% 28%,
              rgba(255,220,150,0.30),
              transparent 48%
            )`,

          opacity: 0.55,

          mixBlendMode: "screen",
        }}
      />


      {/* ==================================================
          VINTAGE COLOR OVERLAY
      ================================================== */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          background:
            "linear-gradient(" +
            "180deg," +
            "rgba(45,23,8,0.38)," +
            "rgba(100,55,15,0.07) 35%," +
            "rgba(70,35,8,0.12) 68%," +
            "rgba(20,9,3,0.42)" +
            ")",

          opacity: 0.72,
        }}
      />


      {/* ==================================================
          FILM GRAIN
      ================================================== */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          opacity: 0.20 + flicker,

          backgroundImage:
            `
            radial-gradient(
              circle at 20% 30%,
              rgba(255,255,255,0.32) 0px,
              transparent 1.5px
            ),
            radial-gradient(
              circle at 70% 65%,
              rgba(255,220,160,0.25) 0px,
              transparent 1.5px
            ),
            radial-gradient(
              circle at 45% 80%,
              rgba(255,255,255,0.18) 0px,
              transparent 1px
            )
            `,

          backgroundSize:
            "37px 41px, 53px 47px, 29px 31px",

          mixBlendMode: "screen",
        }}
      />


      {/* ==================================================
          MOVING FILM SCRATCHES
      ================================================== */}

      <div
        style={{
          position: "absolute",

          left: `${scratch1}%`,
          top: 0,

          width: 1,
          height: "100%",

          background:
            "rgba(255,225,170,0.24)",

          opacity: 0.45,

          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",

          left: `${scratch2}%`,
          top: 0,

          width: 1,
          height: "100%",

          background:
            "rgba(255,245,210,0.17)",

          opacity: 0.35,

          pointerEvents: "none",
        }}
      />


      {/* ==================================================
          HORIZONTAL FILM LINES
      ================================================== */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          opacity: 0.30,

          background:
            `
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 45px,
              rgba(255,220,170,0.14) 46px,
              transparent 48px
            )
            `,
        }}
      />


      {/* ==================================================
          SMALL FILM MARKS
      ================================================== */}

      <div
        style={{
          position: "absolute",

          left: 7,
          top: "18%",

          width: 7,
          height: 70,

          borderLeft:
            "2px solid rgba(255,210,120,0.28)",

          borderRight:
            "1px solid rgba(255,210,120,0.12)",

          opacity: 0.55,

          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",

          left: 7,
          top: "64%",

          width: 7,
          height: 90,

          borderLeft:
            "2px solid rgba(255,210,120,0.22)",

          opacity: 0.45,

          pointerEvents: "none",
        }}
      />


      {/* ==================================================
          DUST PARTICLE 1
      ================================================== */}

      <div
        style={{
          position: "absolute",

          width: 14,
          height: 14,

          left:
            `${18 + ((imageIndex * 17) % 60)}%`,

          top:
            `${20 + ((imageIndex * 23) % 55)}%`,

          borderRadius: "50%",

          background:
            "rgba(255,220,150,0.18)",

          filter: "blur(4px)",

          pointerEvents: "none",
        }}
      />


      {/* ==================================================
          DUST PARTICLE 2
      ================================================== */}

      <div
        style={{
          position: "absolute",

          width: 22,
          height: 22,

          right:
            `${10 + ((imageIndex * 13) % 45)}%`,

          top:
            `${45 + ((imageIndex * 11) % 30)}%`,

          borderRadius: "50%",

          background:
            "rgba(255,210,120,0.13)",

          filter: "blur(6px)",

          pointerEvents: "none",
        }}
      />


      {/* ==================================================
          VIGNETTE
      ================================================== */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          background:
            `
            radial-gradient(
              ellipse at center,
              transparent 42%,
              rgba(0,0,0,0.10) 62%,
              rgba(0,0,0,0.50) 100%
            )
            `,
        }}
      />


      {/* ==================================================
          CENTER WHITE HEART
      ================================================== */}

      <div
        style={{
          position: "absolute",

          left: "50%",
          top: "50%",

          transform:
            `translate(-50%, -50%) ` +
            `scale(${heartScale})`,

          fontSize: 29,

          opacity: heartOpacity,

          zIndex: 50,

          filter:
            "drop-shadow(0 2px 7px rgba(0,0,0,0.65))",

          pointerEvents: "none",
        }}
      >
        🤍
      </div>


      {/* ==================================================
          WHITE FLASH TRANSITION
      ================================================== */}

      <AbsoluteFill
        style={{
          backgroundColor: "#fff",

          opacity: flashOpacity,

          pointerEvents: "none",

          zIndex: 100,
        }}
      />


      {/* ==================================================
          VERY SOFT FINAL DARK OVERLAY
      ================================================== */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          background:
            "rgba(15,8,3,0.06)",

          zIndex: 110,
        }}
      />

    </AbsoluteFill>
  );
};

export default ExactReelTemplate;