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

export const IMAGE_COUNT = 1;
export const FPS = 30;
export const DURATION_IN_FRAMES = 360;

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
}

interface SceneProps {
  images?: ImageItem[];
}

// ======================================================
// DEFAULT IMAGE
// ======================================================

const DEFAULT_IMAGES: ImageItem[] = [
  {
    path: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
  },
];

// ======================================================
// CLAMP
// ======================================================

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// LYRICS
// ======================================================

const LYRICS = [
  {
    start: 0,
    text: "Cham\nCham\nCham",
  },
  {
    start: 60,
    text: "Ambran\nDe\nTaare",
  },
  {
    start: 100,
    text: "Kehnde\nNe\nSajna",
  },
  {
    start: 170,
    text: "Tu Hi\nChann\nMere",
  },
  {
    start: 240,
    text: "Mann\nLai Ve\nSajnaa",
  },
  {
    start: 300,
    text: "Tere\nBina\nMeraa",
  },
];

// ======================================================
// MAIN COMPONENT
// ======================================================

export const BlendedImageReel: React.FC<SceneProps> = ({
  images,
}) => {
  const frame = useCurrentFrame();

  const safeImages =
    images && images.length > 0
      ? images
      : DEFAULT_IMAGES;

  // ====================================================
  // SAME IMAGE REPEAT
  // ====================================================

  const image1 = safeImages[0];
  const image2 = safeImages[1] || safeImages[0];
  const image3 = safeImages[2] || safeImages[0];

  // ====================================================
  // ACTIVE LYRIC
  // ====================================================

  const currentLyricIndex = LYRICS.findIndex(
    (item, index) => {
      const nextItem = LYRICS[index + 1];

      return (
        frame >= item.start &&
        (!nextItem || frame < nextItem.start)
      );
    }
  );

  const activeLyric =
    LYRICS[
      currentLyricIndex !== -1
        ? currentLyricIndex
        : 0
    ];

  const lyricLocalFrame =
    frame - activeLyric.start;

  // ====================================================
  // LYRIC ANIMATION
  // ====================================================

  const lyricOpacity = interpolate(
    lyricLocalFrame,
    [0, 8, 45, 55],
    [0, 1, 1, 0],
    CLAMP
  );

  const lyricY = interpolate(
    lyricLocalFrame,
    [0, 14],
    [35, 0],
    {
      ...CLAMP,
      easing: Easing.out(Easing.cubic),
    }
  );

  const lyricScale = interpolate(
    lyricLocalFrame,
    [0, 14],
    [0.92, 1],
    {
      ...CLAMP,
      easing: Easing.out(
        Easing.back(1.2)
      ),
    }
  );

  const letterSpacing = interpolate(
    lyricLocalFrame,
    [0, 16],
    [6, 1],
    CLAMP
  );

  // ====================================================
  // TOP TEXT ANIMATION
  // ====================================================

  const fixedTextOpacity = interpolate(
    frame,
    [0, 20],
    [0, 1],
    CLAMP
  );

  const fixedTextY = interpolate(
    frame,
    [0, 25],
    [-45, 0],
    {
      ...CLAMP,
      easing: Easing.out(Easing.cubic),
    }
  );

  const fixedTextScale = interpolate(
    frame,
    [0, 20],
    [0.92, 1],
    {
      ...CLAMP,
      easing: Easing.out(
        Easing.back(1.1)
      ),
    }
  );

  const fixedTextFloat =
    Math.sin(frame / 22) * 3;

  const heartPulse =
    1 +
    Math.sin(frame / 6) * 0.08;

  // ====================================================
  // MIDDLE TEXT ANIMATION
  // ====================================================

  const middleTextOpacity = interpolate(
    frame,
    [45, 70],
    [0, 1],
    CLAMP
  );

  const middleTextX = interpolate(
    frame,
    [45, 70],
    [40, 0],
    {
      ...CLAMP,
      easing: Easing.out(Easing.cubic),
    }
  );

  const middleTextFloat =
    Math.sin(frame / 25 + 1) * 3;

  const middleHeartPulse =
    1 +
    Math.sin(frame / 7) * 0.1;

  // ====================================================
  // IMAGE 1 - ZOOM OUT
  // ====================================================

  const zoom1 = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [1.18, 1],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.sin),
    }
  );

  const moveY1 = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [-10, 8],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.sin),
    }
  );

  const moveX1 = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [4, -4],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.sin),
    }
  );

  // ====================================================
  // IMAGE 2 - ZOOM OUT
  // ====================================================

  const zoom2 = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [1.18, 1],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.sin),
    }
  );

  const moveY2 = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [-8, 8],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.sin),
    }
  );

  const moveX2 = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [-5, 5],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.sin),
    }
  );

  // ====================================================
  // IMAGE 3 - ZOOM OUT
  // ====================================================

  const zoom3 = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [1.18, 1],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.sin),
    }
  );

  const moveY3 = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [-10, 6],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.sin),
    }
  );

  const moveX3 = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [5, -4],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.sin),
    }
  );

  // ====================================================
  // BACKGROUND DECOR MOTION
  // ====================================================

  const decorMove = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [0, 25],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.sin),
    }
  );

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f4eee8",
        overflow: "hidden",
      }}
    >
      {/* ==============================================
          BACKGROUND
      ============================================== */}

      <AbsoluteFill
        style={{
          background: `
            radial-gradient(
              circle at 10% 10%,
              rgba(220,180,155,0.28),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 85%,
              rgba(190,150,130,0.22),
              transparent 30%
            ),
            linear-gradient(
              180deg,
              #f8f3ed 0%,
              #eee4da 100%
            )
          `,
        }}
      />

      {/* ==============================================
          TOP DECORATIVE CIRCLE
      ============================================== */}

      <div
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: "50%",
          border:
            "1px solid rgba(160,110,90,0.15)",
          top: -120,
          left: -110,
          transform: `translateY(${decorMove}px)`,
          zIndex: 1,
        }}
      />

      {/* ==============================================
          BOTTOM DECORATIVE CIRCLE
      ============================================== */}

      <div
        style={{
          position: "absolute",
          width: 220,
          height: 220,
          borderRadius: "50%",
          border:
            "1px solid rgba(160,110,90,0.12)",
          bottom: -100,
          right: -70,
          transform: `translateY(${-decorMove}px)`,
          zIndex: 1,
        }}
      />

      {/* ==============================================
          IMAGE 1 - TOP RIGHT
      ============================================== */}

      <div
        style={{
          position: "absolute",
          top: "6%",
          right: "5%",
          width: "50%",
          height: "25%",
          borderRadius: "18px",
          overflow: "hidden",
          transform: "rotate(-3deg)",
          boxShadow:
            "0 12px 30px rgba(80,50,35,0.18)",
          zIndex: 4,
          backgroundColor: "#fff",
        }}
      >
        <Img
          src={image1.path}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `
              translate(${moveX1}px, ${moveY1}px)
              scale(${zoom1})
            `,
          }}
        />
      </div>

      {/* ==============================================
          TOP FIXED TEXT + HEART
      ============================================== */}

      <div
        style={{
          position: "absolute",
          top: "9%",
          left: "7%",
          zIndex: 20,
          opacity: fixedTextOpacity,
          transform: `
            translateY(${fixedTextY + fixedTextFloat}px)
            scale(${fixedTextScale})
          `,
          transformOrigin: "left top",
        }}
      >
        <div
          style={{
            fontFamily:
              "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: "62px",
            lineHeight: 0.9,
            fontWeight: 600,
            color: "#4a3328",
            letterSpacing: "-2px",
          }}
        >
          YOU
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginLeft: "20px",
            marginTop: "8px",
          }}
        >
          <div
            style={{
              fontFamily:
                "'Cormorant Garamond', Georgia, serif",
              fontSize: "36px",
              fontStyle: "italic",
              color: "#b77d68",
            }}
          >
            + me =
          </div>

          <div
            style={{
              fontSize: "24px",
              transform: `scale(${heartPulse})`,
              filter:
                "drop-shadow(0 3px 8px rgba(180,80,80,0.25))",
            }}
          >
            ❤️
          </div>
        </div>

        <div
          style={{
            fontFamily:
              "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: "55px",
            lineHeight: 0.9,
            fontWeight: 600,
            color: "#4a3328",
            letterSpacing: "-1px",
            marginTop: "8px",
          }}
        >
          together
        </div>

        <div
          style={{
            width: "100px",
            height: "1px",
            background:
              "rgba(183,125,104,0.55)",
            marginTop: "18px",
          }}
        />
      </div>

      {/* ==============================================
          IMAGE 2 - MIDDLE LEFT
      ============================================== */}

      <div
        style={{
          position: "absolute",
          top: "36%",
          left: "6%",
          width: "48%",
          height: "30%",
          borderRadius: "18px",
          overflow: "hidden",
          transform: "rotate(2.5deg)",
          boxShadow:
            "0 15px 35px rgba(80,50,35,0.22)",
          zIndex: 6,
          backgroundColor: "#fff",
        }}
      >
        <Img
          src={image2.path}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `
              translate(${moveX2}px, ${moveY2}px)
              scale(${zoom2})
            `,
          }}
        />
      </div>

      {/* ==============================================
          MIDDLE FIXED TEXT + HEART
      ============================================== */}

      <div
        style={{
          position: "absolute",
          top: "46%",
          right: "7%",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          textAlign: "right",
          opacity: middleTextOpacity,
          transform: `
            translateX(${middleTextX}px)
            translateY(${middleTextFloat}px)
          `,
        }}
      >
        <div
          style={{
            fontFamily:
              "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: "48px",
            fontWeight: 600,
            lineHeight: 0.9,
            color: "#4a3328",
            letterSpacing: "-1px",
          }}
        >
          LOVE
        </div>

        <div
          style={{
            fontFamily:
              "'Cormorant Garamond', Georgia, serif",
            fontSize: "27px",
            fontStyle: "italic",
            color: "#b77d68",
            marginTop: "8px",
          }}
        >
          in every moment
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: "16px",
          }}
        >
          <div
            style={{
              width: "35px",
              height: "1px",
              background:
                "rgba(183,125,104,0.45)",
            }}
          />

          <div
            style={{
              fontSize: "19px",
              transform: `scale(${middleHeartPulse})`,
              filter:
                "drop-shadow(0 2px 6px rgba(180,80,80,0.25))",
            }}
          >
            💕
          </div>
        </div>
      </div>

      {/* ==============================================
          IMAGE 3 - BOTTOM RIGHT
      ============================================== */}

      <div
        style={{
          position: "absolute",
          bottom: "6%",
          right: "5%",
          width: "50%",
          height: "25%",
          borderRadius: "18px",
          overflow: "hidden",
          transform: "rotate(-2deg)",
          boxShadow:
            "0 12px 30px rgba(80,50,35,0.18)",
          zIndex: 8,
          backgroundColor: "#fff",
        }}
      >
        <Img
          src={image3.path}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `
              translate(${moveX3}px, ${moveY3}px)
              scale(${zoom3})
            `,
          }}
        />
      </div>

      {/* ==============================================
          ANIMATED LYRICS - BOTTOM LEFT
      ============================================== */}

      <div
        style={{
          position: "absolute",
          left: "8%",
          bottom: "12%",
          zIndex: 30,
          opacity: lyricOpacity,
          transform: `
            translateY(${lyricY}px)
            scale(${lyricScale})
          `,
          transformOrigin:
            "left bottom",
        }}
      >
        <div
          style={{
            fontFamily:
              "'Cormorant Garamond', 'Playfair Display', Georgia, serif",

            fontSize:
              activeLyric.text.length > 15
                ? "46px"
                : "54px",

            lineHeight: 0.92,
            fontWeight: 600,
            color: "#3e2920",

            letterSpacing:
              `${letterSpacing}px`,

            whiteSpace: "pre-line",

            textShadow:
              "0 3px 14px rgba(255,255,255,0.65)",
          }}
        >
          {activeLyric.text}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 16,
          }}
        >
          <div
            style={{
              width: 35,
              height: 1,
              background:
                "rgba(120,80,65,0.45)",
            }}
          />

          <div
            style={{
              fontSize: 16,
              color: "#b77d68",
            }}
          >
            ❤️
          </div>
        </div>
      </div>

      {/* ==============================================
          SOFT LIGHT
      ============================================== */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          zIndex: 15,

          background:
            "radial-gradient(circle at 25% 15%, rgba(255,245,235,0.45), transparent 35%)",
        }}
      />

      {/* ==============================================
          FINAL VIGNETTE
      ============================================== */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          zIndex: 50,

          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04), transparent 35%, rgba(80,50,35,0.08) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export default BlendedImageReel;