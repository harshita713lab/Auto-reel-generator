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

export const IMAGE_COUNT = 4;
export const FPS = 30;
export const DURATION_IN_FRAMES = 330; // 11 seconds

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
}

interface TemplateProps {
  images?: ImageItem[];
}

// ======================================================
// DEFAULT IMAGES
// ======================================================

const DEFAULT_IMAGES: ImageItem[] = [
  {
    path: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
  },
];

// ======================================================
// HELPERS
// ======================================================

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// TEXT TIMELINE
// 330 frames / 4 scenes
// ======================================================

const LYRICS_TIMELINE = [
  {
    start: 0,
    end: 83,
    imageIdx: 0,
    lines: [
      {
        text: "DUNIYA",
        color: "#352722",
        font: "sans",
        weight: 800,
      },
      {
        text: "Zamanaana",
        color: "#875f55",
        font: "script",
        weight: 500,
      },
    ],
  },

  {
    start: 83,
    end: 166,
    imageIdx: 1,
    lines: [
      {
        text: "JAUTHA",
        color: "#9b4d55",
        font: "sans",
        weight: 800,
      },
      {
        text: "fasana",
        color: "#594038",
        font: "script",
        weight: 500,
      },
    ],
  },

  {
    start: 166,
    end: 248,
    imageIdx: 2,
    lines: [
      {
        text: "JEENE",
        color: "#352722",
        font: "sans",
        weight: 800,
      },
      {
        text: "Marne ka",
        color: "#a45a61",
        font: "script",
        weight: 500,
      },
      {
        text: "VADAA",
        color: "#52705d",
        font: "sans",
        weight: 800,
      },
    ],
  },

  {
    start: 248,
    end: 330,
    imageIdx: 3,
    lines: [
      {
        text: "SANCHAA",
        color: "#352722",
        font: "sans",
        weight: 800,
      },
      {
        text: "Mera",
        color: "#875f55",
        font: "script",
        weight: 500,
      },
    ],
  },
];

// ======================================================
// ROUGH PAPER SHAPES
// ======================================================

const ROUGH_CARD_CLIP = `
polygon(
  2% 2%,
  10% 0%,
  20% 1.5%,
  31% 0%,
  43% 1.2%,
  55% 0%,
  67% 1.5%,
  79% 0%,
  90% 1%,
  98% 3%,

  100% 13%,
  98.5% 25%,
  100% 38%,
  98.5% 51%,
  100% 64%,
  98.5% 78%,
  100% 91%,

  97% 98%,
  87% 99%,
  76% 98%,
  65% 100%,
  52% 98.5%,
  39% 100%,
  26% 98.5%,
  14% 100%,
  3% 97%,

  0% 88%,
  1.5% 75%,
  0% 62%,
  1% 49%,
  0% 36%,
  1.5% 23%,
  0% 11%
)
`;

const ROUGH_PHOTO_CLIP = `
polygon(
  2% 1%,
  14% 0%,
  27% 1%,
  40% 0%,
  54% 1%,
  68% 0%,
  82% 1%,
  98% 2%,

  100% 14%,
  98% 28%,
  100% 43%,
  98.5% 57%,
  100% 72%,
  98% 86%,
  99% 98%,

  85% 97%,
  72% 100%,
  58% 98%,
  44% 100%,
  30% 98%,
  16% 100%,
  2% 98%,

  0% 86%,
  1% 71%,
  0% 57%,
  1% 42%,
  0% 27%
)
`;

// ======================================================
// DECORATIONS
// ======================================================

const decorations = [
  { x: 8, y: 14, text: "✦", size: 22, rotate: -12 },
  { x: 90, y: 17, text: "♡", size: 28, rotate: 10 },
  { x: 13, y: 31, text: "✧", size: 16, rotate: 8 },
  { x: 91, y: 39, text: "✦", size: 18, rotate: -8 },
  { x: 7, y: 64, text: "♡", size: 21, rotate: -14 },
  { x: 94, y: 67, text: "✧", size: 16, rotate: 12 },
  { x: 12, y: 83, text: "✦", size: 15, rotate: 5 },
  { x: 88, y: 88, text: "♡", size: 19, rotate: -10 },
  { x: 76, y: 10, text: "·", size: 30, rotate: 0 },
  { x: 23, y: 22, text: "·", size: 28, rotate: 0 },
  { x: 82, y: 55, text: "·", size: 25, rotate: 0 },
  { x: 18, y: 56, text: "✧", size: 13, rotate: 0 },
];

// ======================================================
// MAIN
// ======================================================

export const AestheticTextCutoutReel: React.FC<TemplateProps> = ({
  images,
}) => {
  const frame = useCurrentFrame();

  const safeImages =
    images && images.length >= IMAGE_COUNT
      ? images
      : DEFAULT_IMAGES;

  // ====================================================
  // ACTIVE SCENE
  // ====================================================

  const activeBlock =
    LYRICS_TIMELINE.find(
      (item) => frame >= item.start && frame < item.end
    ) ||
    LYRICS_TIMELINE[LYRICS_TIMELINE.length - 1];

  const currentImg =
    safeImages[activeBlock.imageIdx] || DEFAULT_IMAGES[0];

  const localFrame = frame - activeBlock.start;

  const sceneDuration =
    activeBlock.end - activeBlock.start;

  // ====================================================
  // TEXT FADE
  // ====================================================

  const textOpacity = interpolate(
    localFrame,
    [0, 10, sceneDuration - 12, sceneDuration],
    [0, 1, 1, 0],
    clamp
  );

  // ====================================================
  // TEXT ENTRY
  // ====================================================

  const textY = interpolate(
    localFrame,
    [0, 20],
    [48, 0],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  const textScale = interpolate(
    localFrame,
    [0, 20],
    [0.90, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.back(1.1)),
    }
  );

  // ====================================================
  // CARD ENTRY DIRECTION
  // ====================================================

  /*
    0 = bottom
    1 = right
    2 = top
    3 = left
  */

  const direction = activeBlock.imageIdx % 4;

  let startX = 0;
  let startY = 0;

  if (direction === 0) {
    startY = 1050;
  }

  if (direction === 1) {
    startX = 1050;
  }

  if (direction === 2) {
    startY = -1050;
  }

  if (direction === 3) {
    startX = -1050;
  }

  // ====================================================
  // CARD PROGRESS
  // ====================================================

  const cardProgress = interpolate(
    localFrame,
    [0, 10, 32],
    [0, 0.38, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.back(1.12)),
    }
  );

  // ====================================================
  // CARD MOVEMENT
  // ====================================================

  const cardX = interpolate(
    cardProgress,
    [0, 1],
    [startX, 0],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  const cardY = interpolate(
    cardProgress,
    [0, 1],
    [startY, 0],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ====================================================
  // CARD ROTATION
  // ====================================================

  const entryRotation =
    direction === 0
      ? -7
      : direction === 1
      ? 8
      : direction === 2
      ? 6
      : -8;

  /*
    IMPORTANT:
    Card ab end me 0deg par nahi jayega.
    Thoda natural tilted rahega.
  */

  const finalRotation =
    activeBlock.imageIdx % 2 === 0
      ? -2.2
      : 2.2;

  const cardRotate = interpolate(
    cardProgress,
    [0, 0.35, 0.72, 1],
    [
      entryRotation,
      entryRotation * 0.35,
      finalRotation * 1.3,
      finalRotation,
    ],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ====================================================
  // CARD SCALE
  // ====================================================

  const cardScale = interpolate(
    cardProgress,
    [0, 0.65, 1],
    [0.72, 1.025, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.back(1.05)),
    }
  );

  // ====================================================
  // CARD OPACITY
  // ====================================================

  const cardOpacity = interpolate(
    localFrame,
    [0, 6, sceneDuration - 10, sceneDuration],
    [0, 1, 1, 0],
    clamp
  );

  // ====================================================
  // VERY SUBTLE FLOAT
  // ====================================================

  const floatY = interpolate(
    localFrame,
    [30, sceneDuration],
    [0, -5],
    {
      ...clamp,
      easing: Easing.inOut(Easing.sin),
    }
  );

  // ====================================================
  // IMAGE KEN BURNS
  // ====================================================

  const imageScale = interpolate(
    localFrame,
    [0, sceneDuration],
    [1.02, 1.085],
    clamp
  );

  const imageX = interpolate(
    localFrame,
    [0, sceneDuration],
    [-10, 10],
    {
      ...clamp,
      easing: Easing.inOut(Easing.sin),
    }
  );

  const imageY = interpolate(
    localFrame,
    [0, sceneDuration],
    [7, -7],
    {
      ...clamp,
      easing: Easing.inOut(Easing.sin),
    }
  );

  // ====================================================
  // BACKGROUND MOVEMENT
  // ====================================================

  const bgMove = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [-10, 10],
    {
      ...clamp,
      easing: Easing.inOut(Easing.sin),
    }
  );

  // ====================================================
  // DECORATION OPACITY
  // ====================================================

  const decorationOpacity = interpolate(
    localFrame,
    [0, 14, sceneDuration - 12, sceneDuration],
    [0, 0.9, 0.9, 0],
    clamp
  );

  // ====================================================
  // FLASH
  // ====================================================

  const transitionFlash = interpolate(
    localFrame,
    [0, 4, 12],
    [0.20, 0.06, 0],
    clamp
  );

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f8f0e7",
        overflow: "hidden",
      }}
    >

      {/* ==================================================
          BASE PAPER
      ================================================== */}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(135deg, #fbf6ef 0%, #f6e9df 42%, #fcf8f2 100%)",
        }}
      />

      {/* ==================================================
          CENTER GLOW
      ================================================== */}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1100,
          height: 1100,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.96) 0%, rgba(255,249,244,0.70) 38%, transparent 74%)",
        }}
      />

      {/* ==================================================
          PINK WASH
      ================================================== */}

      <div
        style={{
          position: "absolute",
          width: 750,
          height: 520,
          left: -280,
          top: -100,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(194,123,133,0.12) 0%, rgba(194,123,133,0.04) 45%, transparent 72%)",
          filter: "blur(28px)",
          transform: `
            translate(${bgMove}px, ${bgMove * 0.25}px)
            rotate(-15deg)
          `,
        }}
      />

      {/* ==================================================
          PEACH WASH
      ================================================== */}

      <div
        style={{
          position: "absolute",
          width: 680,
          height: 500,
          right: -260,
          bottom: -100,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(211,165,129,0.11) 0%, rgba(211,165,129,0.035) 45%, transparent 72%)",
          filter: "blur(30px)",
          transform: `
            translate(${-bgMove}px, ${-bgMove * 0.2}px)
            rotate(18deg)
          `,
        }}
      />

      {/* ==================================================
          GREEN WASH
      ================================================== */}

      <div
        style={{
          position: "absolute",
          width: 500,
          height: 400,
          right: -220,
          top: 170,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(116,142,122,0.065) 0%, transparent 70%)",
          filter: "blur(25px)",
        }}
      />

      {/* ==================================================
          TOP BRUSH
      ================================================== */}

      <div
        style={{
          position: "absolute",
          top: 25,
          left: "50%",
          width: 760,
          height: 70,
          transform:
            "translateX(-50%) rotate(-2deg)",
          background:
            "linear-gradient(90deg, transparent, rgba(137,88,79,0.075) 20%, rgba(137,88,79,0.12) 50%, rgba(137,88,79,0.04) 85%, transparent)",
          clipPath: `
            polygon(
              0 45%,
              8% 25%,
              18% 39%,
              29% 20%,
              42% 35%,
              55% 18%,
              69% 33%,
              82% 20%,
              100% 40%,
              100% 68%,
              85% 58%,
              72% 75%,
              58% 61%,
              43% 79%,
              28% 61%,
              14% 74%,
              0 61%
            )
          `,
        }}
      />

      {/* ==================================================
          STARS + HEARTS
      ================================================== */}

      {decorations.map((item, index) => {
        const pulse = interpolate(
          (frame + index * 9) % 90,
          [0, 45, 90],
          [0.75, 1, 0.75],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.sin),
          }
        );

        const float = interpolate(
          (frame + index * 13) % 120,
          [0, 60, 120],
          [0, -5, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.sin),
          }
        );

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${item.x}%`,
              top: `${item.y}%`,
              zIndex: 4,
              opacity:
                decorationOpacity * pulse,
              transform: `
                translateY(${float}px)
                rotate(${item.rotate}deg)
              `,
              fontFamily:
                "'Playfair Display', Georgia, serif",
              fontSize: item.size,
              color:
                item.text === "♡"
                  ? "rgba(168,91,103,0.48)"
                  : "rgba(119,91,74,0.48)",
            }}
          >
            {item.text}
          </div>
        );
      })}

      {/* ==================================================
          CIRCLES
      ================================================== */}

      <div
        style={{
          position: "absolute",
          left: 38,
          top: 190,
          width: 105,
          height: 105,
          border:
            "1.5px solid rgba(126,88,76,0.13)",
          borderRadius: "50%",
          transform: "rotate(-12deg)",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 42,
          bottom: 170,
          width: 88,
          height: 88,
          border:
            "1.5px solid rgba(117,91,77,0.11)",
          borderRadius: "50%",
          transform: "rotate(18deg)",
        }}
      />

      {/* ==================================================
          PAPER GRAIN
      ================================================== */}

      <AbsoluteFill
        style={{
          opacity: 0.13,
          backgroundImage: `
            radial-gradient(
              circle at 15% 20%,
              rgba(70,45,35,0.14) 0px,
              transparent 1px
            ),
            radial-gradient(
              circle at 75% 70%,
              rgba(70,45,35,0.10) 0px,
              transparent 1px
            ),
            radial-gradient(
              circle at 45% 55%,
              rgba(255,255,255,0.30) 0px,
              transparent 1px
            )
          `,
          backgroundSize:
            "17px 19px, 23px 27px, 31px 29px",
          pointerEvents: "none",
        }}
      />

      {/* ==================================================
          TOP LABEL
      ================================================== */}

      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 25,
          opacity: textOpacity,
        }}
      >
        <span
          style={{
            fontFamily:
              "'Montserrat', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "5px",
            color:
              "rgba(66,49,42,0.48)",
          }}
        >
          OUR STORY
        </span>
      </div>

      {/* ==================================================
          MAIN TEXT
          MORE DOWN + BIGGER
      ================================================== */}

      <div
        style={{
          position: "absolute",

          // ⬇️ TEXT AB AUR NICHE
          top: 145,

          left: 0,
          right: 0,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",

          zIndex: 30,

          opacity: textOpacity,

          transform: `
            translateY(${textY}px)
            scale(${textScale})
          `,
        }}
      >

        {/* TOP HEART */}

        <div
          style={{
            fontFamily:
              "'Playfair Display', Georgia, serif",
            fontSize: 25,
            color:
              "rgba(165,84,96,0.70)",
            marginBottom: 6,
          }}
        >
          ♡
        </div>

        {/* LINE */}

        <div
          style={{
            width: 55,
            height: 1.5,
            backgroundColor:
              "rgba(76,55,46,0.28)",
            marginBottom: 12,
            transform:
              "rotate(-3deg)",
          }}
        />

        {/* TEXT LINES */}

        {activeBlock.lines.map(
          (line, idx) => {
            const delay = idx * 7;

            const lineFrame = Math.max(
              0,
              localFrame - delay
            );

            const lineOpacity =
              interpolate(
                lineFrame,
                [0, 9],
                [0, 1],
                clamp
              );

            const lineY =
              interpolate(
                lineFrame,
                [0, 14],
                [22, 0],
                {
                  ...clamp,
                  easing:
                    Easing.out(Easing.quad),
                }
              );

            return (
              <div
                key={idx}
                style={{
                  opacity: lineOpacity,

                  transform:
                    `translateY(${lineY}px)`,

                  fontFamily:
                    line.font === "sans"
                      ? "'Montserrat', 'Helvetica Neue', sans-serif"
                      : "'Brush Script MT', 'Segoe Script', 'Snell Roundhand', 'URW Chancery L', cursive",

                  // ⬆️ TEXT BIGGER
                  fontSize:
                    line.font === "sans"
                      ? 58
                      : 54,

                  fontWeight:
                    line.font === "sans"
                      ? 800
                      : 500,

                  color: line.color,

                  letterSpacing:
                    line.font === "sans"
                      ? "4px"
                      : "1px",

                  lineHeight: 1.04,

                  textTransform:
                    line.font === "sans"
                      ? "uppercase"
                      : "none",

                  whiteSpace:
                    "nowrap",

                  textShadow:
                    line.font === "script"
                      ? "0 3px 12px rgba(90,60,45,0.08)"
                      : "none",
                }}
              >
                {line.text}
              </div>
            );
          }
        )}

        {/* BOTTOM HEART */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 14,
          }}
        >
          <div
            style={{
              width: 40,
              height: 1,
              backgroundColor:
                "rgba(76,55,46,0.20)",
            }}
          />

          <span
            style={{
              fontSize: 17,
              color:
                "rgba(165,84,96,0.70)",
            }}
          >
            ✦ ♡
          </span>

          <div
            style={{
              width: 40,
              height: 1,
              backgroundColor:
                "rgba(76,55,46,0.20)",
            }}
          />
        </div>
      </div>

      {/* ==================================================
          CARD SHADOW
      ================================================== */}

      <div
        style={{
          position: "absolute",

          left: "50%",
          top: "63%",

          width: "76%",
          height: "53%",

          transform: `
            translate(-50%, -50%)
            translate(
              ${cardX * 0.92}px,
              ${cardY * 0.92 + floatY}px
            )
            rotate(${cardRotate + 2}deg)
          `,

          zIndex: 7,

          opacity:
            cardOpacity * 0.20,

          filter:
            "blur(5px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor:
              "#b7a69b",
            clipPath:
              ROUGH_CARD_CLIP,
          }}
        />
      </div>

      {/* ==================================================
          MAIN CARD
      ================================================== */}

      <div
        style={{
          position: "absolute",

          left: "50%",
          top: "63%",

          width: "76%",
          height: "53%",

          transform: `
            translate(-50%, -50%)
            translate(
              ${cardX}px,
              ${cardY + floatY}px
            )
            rotate(${cardRotate}deg)
            scale(${cardScale})
          `,

          opacity: cardOpacity,

          zIndex: 10,

          filter:
            "drop-shadow(0 30px 40px rgba(70,45,35,0.16))",
        }}
      >

        {/* CARD PAPER */}

        <div
          style={{
            position: "absolute",
            inset: 0,

            background:
              "linear-gradient(135deg, #fffefa 0%, #faf2e9 100%)",

            clipPath:
              ROUGH_CARD_CLIP,
          }}
        />

        {/* CARD TEXTURE */}

        <div
          style={{
            position: "absolute",
            inset: 0,

            opacity: 0.15,

            backgroundImage: `
              radial-gradient(
                circle at 20% 30%,
                rgba(80,60,40,0.15) 0px,
                transparent 1px
              ),
              radial-gradient(
                circle at 70% 60%,
                rgba(80,60,40,0.10) 0px,
                transparent 1px
              )
            `,

            backgroundSize:
              "16px 17px, 21px 24px",

            clipPath:
              ROUGH_CARD_CLIP,
          }}
        />

        {/* ==================================================
            PHOTO
        ================================================== */}

        <div
          style={{
            position: "absolute",

            left: "5%",
            right: "5%",
            top: "6%",
            bottom: "6%",

            overflow: "hidden",

            backgroundColor:
              "#ddd3c8",

            clipPath:
              ROUGH_PHOTO_CLIP,
          }}
        >

          <Img
            key={activeBlock.imageIdx}
            src={currentImg.path}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",

              display: "block",

              transform: `
                translate(
                  ${imageX}px,
                  ${imageY}px
                )
                scale(${imageScale})
              `,

              filter:
                "contrast(104%) saturate(96%)",
            }}
          />

          {/* PHOTO LIGHT */}

          <div
            style={{
              position: "absolute",
              inset: 0,

              background:
                "linear-gradient(135deg, rgba(255,255,255,0.16), transparent 38%, rgba(0,0,0,0.08))",

              pointerEvents:
                "none",
            }}
          />
        </div>

        {/* PHOTO BORDER */}

        <div
          style={{
            position: "absolute",

            left: "4.5%",
            right: "4.5%",
            top: "5.5%",
            bottom: "5.5%",

            border:
              "1px solid rgba(83,63,45,0.13)",

            clipPath:
              ROUGH_PHOTO_CLIP,

            pointerEvents:
              "none",

            zIndex: 5,
          }}
        />

        {/* TOP TAPE */}

        <div
          style={{
            position: "absolute",

            top: -11,
            left: "50%",

            width: 110,
            height: 30,

            transform:
              "translateX(-50%) rotate(-3deg)",

            background:
              "linear-gradient(90deg, rgba(222,204,165,0.55), rgba(244,230,194,0.78), rgba(218,198,158,0.55))",

            boxShadow:
              "0 3px 7px rgba(60,40,20,0.05)",

            zIndex: 8,
          }}
        />

        {/* CORNER TAPE */}

        <div
          style={{
            position: "absolute",

            right: 24,
            bottom: 18,

            width: 55,
            height: 18,

            transform:
              "rotate(-8deg)",

            background:
              "rgba(224,208,174,0.50)",

            zIndex: 8,
          }}
        />

        {/* CARD HEART */}

        <div
          style={{
            position: "absolute",

            left: 22,
            bottom: 17,

            fontFamily:
              "'Playfair Display', Georgia, serif",

            fontSize: 19,

            color:
              "rgba(166,87,98,0.55)",

            zIndex: 8,

            transform:
              "rotate(-8deg)",
          }}
        >
          ♡
        </div>

        {/* ROUGH WHITE EDGE */}

        <div
          style={{
            position: "absolute",

            inset: 3,

            border:
              "1px solid rgba(255,255,255,0.82)",

            clipPath:
              ROUGH_CARD_CLIP,

            pointerEvents:
              "none",

            zIndex: 9,
          }}
        />
      </div>

      {/* ==================================================
          PAPER FLASH
      ================================================== */}

      <AbsoluteFill
        style={{
          backgroundColor:
            "#fffaf3",

          opacity:
            transitionFlash,

          zIndex: 35,

          pointerEvents:
            "none",

          mixBlendMode:
            "screen",
        }}
      />

      {/* ==================================================
          BOTTOM DECORATION
      ================================================== */}

      <div
        style={{
          position: "absolute",

          bottom: 38,

          left: 0,
          right: 0,

          display: "flex",

          justifyContent:
            "center",

          alignItems:
            "center",

          gap: 12,

          zIndex: 25,

          opacity:
            textOpacity,
        }}
      >

        <div
          style={{
            width: 35,
            height: 1,

            backgroundColor:
              "rgba(70,50,35,0.18)",
          }}
        />

        <div
          style={{
            fontSize: 16,

            color:
              "rgba(165,84,96,0.60)",
          }}
        >
          ♡
        </div>

        <div
          style={{
            width: 35,
            height: 1,

            backgroundColor:
              "rgba(70,50,35,0.18)",
          }}
        />
      </div>

      {/* ==================================================
          VIGNETTE
      ================================================== */}

      <AbsoluteFill
        style={{
          zIndex: 40,

          pointerEvents:
            "none",

          background:
            "radial-gradient(circle, transparent 62%, rgba(80,50,40,0.035) 100%)",
        }}
      />

    </AbsoluteFill>
  );
};

export default AestheticTextCutoutReel;