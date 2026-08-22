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

export const FPS = 30;
export const DURATION_IN_FRAMES = 300;

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
// LYRIC TIMELINE
//
// NOTE:
// Negative offset means lyrics appear EARLIER.
// 6 frames = 0.20 sec at 30 FPS.
// ======================================================

const LYRIC_OFFSET_FRAMES = -6;

const LYRICS = [
  {
    start: 0,
    text: "CHAM\nCHAM\nCHAM",
  },
  {
    start: 55,
    text: "AMBRAN DE\nTAARE\nKEHDE",
  },
  {
    start: 112,
    text: "NE SAJNA",
  },
  {
    start: 195, // 165 + 30 frames = 1 sec break
    text: "TU HI CHANN MERE\nISS DIL DA",
  },
  {
    start: 252, // next lyric
    text: "MANN LAI VE SAJNA",
  },
];

// ======================================================
// MAIN
// ======================================================

export const SingleImageLyricReel: React.FC<SceneProps> = ({
  images,
}) => {
  const frame = useCurrentFrame();

  const safeImages =
    images && images.length > 0
      ? images
      : DEFAULT_IMAGES;

  const currentImage =
    safeImages[0].path;

  // ====================================================
  // IMAGE KEN BURNS
  // ====================================================

  const imageScale = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [1.02, 1.085],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.sin),
    }
  );

  const imageX = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [-4, 4],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.sin),
    }
  );

  const imageY = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [2, -2],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.sin),
    }
  );

  // ====================================================
  // LIGHT LEAK
  // ====================================================

  const lightMove = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [-10, 42],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.sin),
    }
  );

  // ====================================================
  // CURRENT LYRIC
  // ====================================================

  const currentLyricIndex =
    LYRICS.findIndex(
      (item, index) => {
        const nextItem =
          LYRICS[index + 1];

        const start =
          item.start +
          LYRIC_OFFSET_FRAMES;

        const end = nextItem
          ? nextItem.start +
            LYRIC_OFFSET_FRAMES
          : DURATION_IN_FRAMES;

        return (
          frame >= start &&
          frame < end
        );
      }
    );

  const activeIndex =
    currentLyricIndex !== -1
      ? currentLyricIndex
      : 0;

  const activeLyric =
    LYRICS[activeIndex];

  // ====================================================
  // LOCAL LYRIC FRAME
  // ====================================================

  const lyricStart =
    activeLyric.start +
    LYRIC_OFFSET_FRAMES;

  const lyricLocalFrame =
    frame - lyricStart;

  const nextLyric =
    LYRICS[activeIndex + 1];

  const nextStart = nextLyric
    ? nextLyric.start +
      LYRIC_OFFSET_FRAMES
    : DURATION_IN_FRAMES;

  const lyricDuration =
    nextStart - lyricStart;

  // ====================================================
  // LYRIC ENTER
  //
  // Smooth:
  // fade + rise + scale
  // ====================================================

  const enterProgress = interpolate(
    lyricLocalFrame,
    [0, 18],
    [0, 1],
    {
      ...CLAMP,
      easing: Easing.out(Easing.cubic),
    }
  );

  const textOpacity = interpolate(
    lyricLocalFrame,
    [0, 7, 18],
    [0, 0.55, 1],
    CLAMP
  );

  const textY = interpolate(
    enterProgress,
    [0, 1],
    [28, 0],
    {
      ...CLAMP,
      easing: Easing.out(Easing.cubic),
    }
  );

  const textScale = interpolate(
    enterProgress,
    [0, 1],
    [0.94, 1],
    {
      ...CLAMP,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ====================================================
  // LYRIC EXIT
  // ====================================================

  const exitStart =
    Math.max(
      0,
      lyricDuration - 18
    );

  const exitOpacity =
    interpolate(
      lyricLocalFrame,
      [
        exitStart,
        lyricDuration,
      ],
      [1, 0],
      CLAMP
    );

  const finalOpacity =
    textOpacity * exitOpacity;

  // ====================================================
  // SUBTLE TEXT FLOAT
  // ====================================================

  const subtleFloat =
    interpolate(
      lyricLocalFrame,
      [
        18,
        lyricDuration - 18,
      ],
      [0, -3],
      {
        ...CLAMP,
        easing: Easing.inOut(Easing.sin),
      }
    );

  // ====================================================
  // LETTER SPACING
  // ====================================================

  const letterSpacing =
    interpolate(
      enterProgress,
      [0, 1],
      [5, 2.8],
      {
        ...CLAMP,
        easing: Easing.out(Easing.cubic),
      }
    );

  // ====================================================
  // GLOW
  // ====================================================

  const glowOpacity =
    interpolate(
      enterProgress,
      [0, 1],
      [0, 0.65],
      {
        ...CLAMP,
        easing: Easing.out(Easing.cubic),
      }
    );

  // ====================================================
  // TEXT LINE SPLIT
  // ====================================================

  const lines =
    activeLyric.text.split("\n");

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >

      {/* ==================================================
          CINEMATIC IMAGE
      ================================================== */}

      <AbsoluteFill
        style={{
          transform: `
            translate(
              ${imageX}px,
              ${imageY}px
            )
            scale(${imageScale})
          `,
        }}
      >
        <Img
          src={currentImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter:
              "brightness(0.82) contrast(1.04) saturate(0.88)",
          }}
        />
      </AbsoluteFill>

      {/* ==================================================
          DARK CINEMATIC GRADIENT
      ================================================== */}

      <AbsoluteFill
        style={{
          background: `
            linear-gradient(
              180deg,
              rgba(20,12,8,0.38) 0%,
              rgba(20,10,5,0.05) 28%,
              rgba(10,5,3,0.08) 55%,
              rgba(8,4,2,0.60) 100%
            )
          `,
          pointerEvents: "none",
        }}
      />

      {/* ==================================================
          WARM VIGNETTE
      ================================================== */}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at center, transparent 38%, rgba(20,10,5,0.62) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ==================================================
          LIGHT LEAK
      ================================================== */}

      <AbsoluteFill
        style={{
          background: `
            radial-gradient(
              circle at ${lightMove}% 8%,
              rgba(255,220,165,0.32) 0%,
              rgba(255,205,140,0.10) 28%,
              transparent 62%
            )
          `,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* ==================================================
          SOFT GOLDEN GLOW BEHIND TEXT
      ================================================== */}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "29%",
          width: 520,
          height: 260,
          transform:
            "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,220,175,0.15), transparent 70%)",
          filter: "blur(25px)",
          opacity: glowOpacity,
          pointerEvents: "none",
        }}
      />

      {/* ==================================================
          MAIN LYRIC
      ================================================== */}

      <div
        style={{
          position: "absolute",

          top: "17%",
          left: 20,
          right: 20,

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          textAlign: "center",

          zIndex: 20,

          opacity: finalOpacity,

          transform: `
            translateY(${textY + subtleFloat}px)
            scale(${textScale})
          `,
        }}
      >

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >

          {/* ==============================================
              SMALL DECORATIVE LINE
          ============================================== */}

          <div
            style={{
              width: 38,
              height: 1,
              background:
                "rgba(255,225,195,0.65)",
              marginBottom: 15,

              transform:
                `scaleX(${enterProgress})`,
            }}
          />

          {/* ==============================================
              LYRICS
          ============================================== */}

          {lines.map(
            (line, index) => {
              const lineDelay =
                index * 5;

              const lineProgress =
                interpolate(
                  lyricLocalFrame -
                    lineDelay,
                  [0, 14],
                  [0, 1],
                  {
                    ...CLAMP,
                    easing:
                      Easing.out(
                        Easing.cubic
                      ),
                  }
                );

              const lineY =
                interpolate(
                  lineProgress,
                  [0, 1],
                  [14, 0],
                  CLAMP
                );

              const lineOpacity =
                interpolate(
                  lineProgress,
                  [0, 1],
                  [0, 1],
                  CLAMP
                );

              return (
                <div
                  key={index}
                  style={{
                    opacity:
                      lineOpacity,

                    transform:
                      `translateY(${lineY}px)`,

                    fontFamily:
                      "'Cormorant Garamond', 'Playfair Display', Georgia, serif",

                    fontSize:
                      line.length > 15
                        ? 34
                        : 42,

                    fontWeight:
                      500,

                    lineHeight:
                      1.05,

                    color:
                      "#fffaf2",

                    letterSpacing:
                      `${letterSpacing}px`,

                    textTransform:
                      "uppercase",

                    whiteSpace:
                      "nowrap",

                    textShadow: `
                      0 2px 4px rgba(0,0,0,0.65),
                      0 8px 24px rgba(0,0,0,0.35)
                    `,
                  }}
                >
                  {line}
                </div>
              );
            }
          )}

          {/* ==============================================
              BOTTOM DECORATIVE LINE
          ============================================== */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              marginTop: 17,

              opacity:
                enterProgress,
            }}
          >

            <div
              style={{
                width: 24,
                height: 1,
                background:
                  "rgba(255,225,195,0.48)",
              }}
            />

            <div
              style={{
                fontFamily:
                  "'Cormorant Garamond', serif",
                fontSize: 15,
                color:
                  "rgba(255,220,190,0.85)",
              }}
            >
              ✦
            </div>

            <div
              style={{
                width: 24,
                height: 1,
                background:
                  "rgba(255,225,195,0.48)",
              }}
            />

          </div>
        </div>
      </div>

      {/* ==================================================
          BOTTOM CREATOR TAG
      ================================================== */}

      <div
        style={{
          position: "absolute",

          bottom: "11%",
          left: 0,
          right: 0,

          display: "flex",
          justifyContent: "center",

          zIndex: 25,

          opacity: 0.72,
        }}
      >
        <div
          style={{
            fontFamily:
              "'Cormorant Garamond', Georgia, serif",

            fontSize: 18,

            fontStyle: "italic",

            color:
              "rgba(255,218,205,0.90)",

            letterSpacing:
              "1.5px",

            textShadow:
              "0 2px 8px rgba(0,0,0,0.7)",
          }}
        >
          Not your bye life ✨
        </div>
      </div>

      {/* ==================================================
          FILM GRAIN
      ================================================== */}

      <AbsoluteFill
        style={{
          opacity: 0.055,

          backgroundImage: `
            radial-gradient(
              circle at 20% 30%,
              rgba(255,255,255,0.8) 0px,
              transparent 1px
            ),
            radial-gradient(
              circle at 70% 70%,
              rgba(255,255,255,0.5) 0px,
              transparent 1px
            )
          `,

          backgroundSize:
            "17px 19px, 23px 27px",

          pointerEvents:
            "none",

          zIndex: 30,
        }}
      />

      {/* ==================================================
          FINAL VIGNETTE
      ================================================== */}

      <AbsoluteFill
        style={{
          zIndex: 40,
          pointerEvents: "none",

          background:
            "radial-gradient(circle, transparent 52%, rgba(0,0,0,0.32) 100%)",
        }}
      />

    </AbsoluteFill>
  );
};

export default SingleImageLyricReel;