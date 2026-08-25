import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

// ======================================================
// CONFIG
// ======================================================

export const IMAGE_COUNT = 10;
export const FPS = 30;

// 10 Images × 3 Seconds = 30 Seconds
export const DURATION_IN_FRAMES = 900;

interface ImageItem {
  path: string;
}

interface SceneProps {
  images?: ImageItem[];
}

// ======================================================
// DEFAULT IMAGES
// ======================================================

const DEFAULT_IMAGES: ImageItem[] = [
  {
    path: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
  },
];

// ======================================================
// MAIN COMPONENT
// ======================================================

export const WeddingReel: React.FC<SceneProps> = ({
  images,
}) => {
  const frame = useCurrentFrame();

  // ======================================================
  // USER UPLOADED IMAGES
  // ======================================================

  const safeImages =
    images && images.length > 0
      ? images.slice(0, IMAGE_COUNT)
      : DEFAULT_IMAGES.slice(0, IMAGE_COUNT);

  // ======================================================
  // CAROUSEL SETTINGS
  // ======================================================

  const CARD_WIDTH = 500;
  const CARD_HEIGHT = 700;

  // Distance between images
  const STEP = 310;

  // ======================================================
  // SLIDER PROGRESS
  // ======================================================

  const sliderProgress = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [0, Math.max(safeImages.length - 1, 0)],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    }
  );

  // ======================================================
  // HEADER ANIMATION
  // ======================================================

  const headerOpacity = interpolate(
    frame,
    [0, 30],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const headerY = interpolate(
    frame,
    [0, 30],
    [-35, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // ======================================================
  // CAROUSEL ENTRY
  // ======================================================

  const sliderOpacity = interpolate(
    frame,
    [15, 45],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ======================================================
  // BOTTOM TEXT ENTRY
  // ======================================================

  const textOpacity = interpolate(
    frame,
    [30, 60],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: "#f2dfb9",
      }}
    >
      {/* ==================================================
          LUXURY WEDDING BACKGROUND
      ================================================== */}

      <AbsoluteFill
        style={{
          background: `
            radial-gradient(
              ellipse at 50% 20%,
              rgba(255,255,255,0.9) 0%,
              rgba(255,248,228,0.65) 25%,
              transparent 55%
            ),

            radial-gradient(
              ellipse at 8% 75%,
              rgba(179,133,79,0.25) 0%,
              transparent 45%
            ),

            radial-gradient(
              ellipse at 95% 70%,
              rgba(190,145,88,0.25) 0%,
              transparent 45%
            ),

            radial-gradient(
              ellipse at 50% 100%,
              rgba(155,110,60,0.16) 0%,
              transparent 55%
            ),

            linear-gradient(
              135deg,
              #fff8e8 0%,
              #f4dfb7 48%,
              #e9c98f 100%
            )
          `,
        }}
      />

      {/* ==================================================
          PAPER GRAIN TEXTURE
      ================================================== */}

      <AbsoluteFill
        style={{
          opacity: 0.2,

          backgroundImage: `
            radial-gradient(
              rgba(90,60,30,0.6) 0.7px,
              transparent 1.2px
            )
          `,

          backgroundSize: "11px 11px",

          mixBlendMode: "multiply",
        }}
      />

      {/* ==================================================
          SOFT VIGNETTE
      ================================================== */}

      <AbsoluteFill
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              transparent 45%,
              rgba(75,45,18,0.12) 100%
            )
          `,
        }}
      />

      {/* ==================================================
          DECORATIVE LIGHT
      ================================================== */}

      <div
        style={{
          position: "absolute",

          top: -200,
          left: -200,

          width: 650,
          height: 650,

          borderRadius: "50%",

          background:
            "rgba(255,255,255,0.25)",

          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          position: "absolute",

          bottom: -250,
          right: -200,

          width: 600,
          height: 600,

          borderRadius: "50%",

          background:
            "rgba(170,120,60,0.18)",

          filter: "blur(100px)",
        }}
      />

      {/* ==================================================
          TOP HEADING
      ================================================== */}

      <div
        style={{
          position: "absolute",

          top: 90,

          left: 0,
          right: 0,

          textAlign: "center",

          zIndex: 50,

          opacity: headerOpacity,

          transform:
            `translateY(${headerY}px)`,
        }}
      >
        {/* Decorative hearts */}

        <div
          style={{
            position: "absolute",

            left: 55,
            top: 5,

            fontSize: 40,

            color: "#5b3d25",

            fontFamily: "serif",
          }}
        >
          ♡
        </div>

        <div
          style={{
            position: "absolute",

            right: 55,
            top: 5,

            fontSize: 40,

            color: "#5b3d25",

            fontFamily: "serif",
          }}
        >
          ♡
        </div>

        {/* Heading */}

        <div
          style={{
            fontFamily:
              "'Snell Roundhand', 'Segoe Script', 'Brush Script MT', cursive",

            fontSize: 88,

            fontWeight: 500,

            letterSpacing: "1px",

            lineHeight: 1,

            color: "#4a2f1d",

            textShadow:
              "2px 3px 8px rgba(85,55,25,0.22)",
          }}
        >
          Our Forever
        </div>

        {/* Subtitle */}

        <div
          style={{
            marginTop: 18,

            fontFamily:
              "'Baskerville', Georgia, serif",

            fontSize: 20,

            letterSpacing: "5px",

            textTransform: "uppercase",

            color: "#8a6540",
          }}
        >
          A Love Story
        </div>
      </div>

      {/* ==================================================
          3D IMAGE CAROUSEL
      ================================================== */}

      <div
        style={{
          position: "absolute",

          // Images middle + thodi niche
          top: 450,

          left: 0,

          width: "100%",

          height: 750,

          overflow: "visible",

          opacity: sliderOpacity,

          perspective: "1400px",

          transformStyle: "preserve-3d",
        }}
      >
        {safeImages.map((image, index) => {
          // Current position
          const relativePosition =
            index - sliderProgress;

          const distance =
            Math.abs(relativePosition);

          // ==================================================
          // HORIZONTAL POSITION
          // ==================================================

          const x =
            relativePosition * STEP;

          // ==================================================
          // SCALE
          //
          // Center image largest
          // ==================================================

          const scale = interpolate(
            distance,
            [0, 0.7, 1.5, 3],
            [1.18, 0.95, 0.68, 0.5],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          // ==================================================
          // 3D ROTATION
          // ==================================================

          const rotateY = interpolate(
            relativePosition,

            [-3, -1, 0, 1, 3],

            [58, 40, 0, -40, -58],

            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          // ==================================================
          // 3D DEPTH
          // ==================================================

          const translateZ = interpolate(
            distance,

            [0, 1, 3],

            [100, -100, -280],

            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          // Side images slightly lower

          const translateY = interpolate(
            distance,

            [0, 1, 3],

            [0, 35, 80],

            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          // ==================================================
          // Z INDEX
          // ==================================================

          const zIndex =
            1000 -
            Math.round(distance * 100);

          // ==================================================
          // OPACITY
          // ==================================================

          const opacity = interpolate(
            distance,

            [0, 1, 2.5, 4],

            [1, 0.9, 0.45, 0],

            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          return (
            <div
              key={`${image.path}-${index}`}
              style={{
                position: "absolute",

                left: "50%",

                top: 0,

                width: CARD_WIDTH,

                height: CARD_HEIGHT,

                marginLeft:
                  -CARD_WIDTH / 2,

                backgroundColor:
                  "#ffffff",

                // White Polaroid frame
                padding:
                  "10px 10px 32px 10px",

                boxSizing:
                  "border-box",

                boxShadow: `
                  0 28px 50px rgba(65,40,18,0.28),
                  0 8px 18px rgba(0,0,0,0.15)
                `,

                opacity,

                zIndex,

                transform: `
                  translateX(${x}px)
                  translateY(${translateY}px)
                  translateZ(${translateZ}px)
                  rotateY(${rotateY}deg)
                  scale(${scale})
                `,

                transformStyle:
                  "preserve-3d",

                transformOrigin:
                  "center center",

                willChange:
                  "transform",
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
            </div>
          );
        })}
      </div>

      {/* ==================================================
          BOTTOM WEDDING TEXT
      ================================================== */}

      <div
        style={{
          position: "absolute",

          left: 40,
          right: 40,

          // Text bottom se upar
          bottom: 210,

          textAlign: "center",

          zIndex: 50,

          opacity: textOpacity,
        }}
      >
        <div
          style={{
            fontFamily:
              "'Baskerville', Georgia, serif",

            fontStyle: "italic",

            fontSize: 31,

            fontWeight: 500,

            lineHeight: 1.3,

            letterSpacing: "0.5px",

            color: "#4a3423",

            textShadow:
              "0 1px 2px rgba(255,255,255,0.7)",
          }}
        >
          Two souls, one beautiful journey,
          <br />
          and a love story written forever.
        </div>

        {/* Small decorative line */}

        <div
          style={{
            marginTop: 25,

            fontSize: 28,

            color: "#9a7044",

            letterSpacing: "12px",
          }}
        >
          ♡ ♡ ♡
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default WeddingReel;