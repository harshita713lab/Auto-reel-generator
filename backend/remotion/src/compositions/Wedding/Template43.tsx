import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

// ======================================================
// CONFIG & METADATA
// ======================================================

export const IMAGE_COUNT = 6;
export const FPS = 30;
export const DURATION_IN_FRAMES = 210; // 7 seconds

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
    path:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop",
  },
  {
    path:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
  },
  {
    path:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  },
  {
    path:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
  },
  {
    path:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
  },
  {
    path:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
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
// LYRICS
// ======================================================

const LYRICS_SEQUENCE = [
  {
    start: 0,
    text: "Saanjh tu...",
    sub: "shaam si khoobsurat",
  },
  {
    start: 35,
    text: "Savera tu...",
    sub: "meri har ek subah",
  },
  {
    start: 70,
    text: "Raahe tu...",
    sub: "jahan dil jaana chahe",
  },
  {
    start: 105,
    text: "Basera tu...",
    sub: "mera sukoon",
  },
  {
    start: 140,
    text: "Tere sang...",
    sub: "har pal haseen",
  },
  {
    start: 175,
    text: "Lagi jo preet re",
    sub: "bas tumse hi... ♡",
  },
];

// ======================================================
// MAIN COMPONENT
// ======================================================

export const SequentialRomanceReel: React.FC<TemplateProps> = ({
  images,
}) => {
  const frame = useCurrentFrame();

  const safeImages =
    images && images.length >= 6 ? images : DEFAULT_IMAGES;

  // ====================================================
  // IMAGE TIMING
  // ====================================================

  const framesPerImage = DURATION_IN_FRAMES / 6;

  const currentIndex = Math.min(
    Math.floor(frame / framesPerImage),
    safeImages.length - 1
  );

  const imageFrame = frame % framesPerImage;

  // ====================================================
  // IMAGE KEN BURNS
  // ====================================================

  const imageProgress = interpolate(
    imageFrame,
    [0, framesPerImage],
    [0, 1],
    {
      ...clamp,
      easing: Easing.inOut(Easing.quad),
    }
  );

  const scale = interpolate(
    imageProgress,
    [0, 1],
    [1.02, 1.12],
    clamp
  );

  const translateX = interpolate(
    imageProgress,
    [0, 1],
    [0, -10],
    clamp
  );

  const translateY = interpolate(
    imageProgress,
    [0, 1],
    [4, -5],
    clamp
  );

  // ====================================================
  // IMAGE FADE
  // ====================================================

  const imageOpacity = interpolate(
    imageFrame,
    [0, 7, framesPerImage - 7, framesPerImage],
    [0, 1, 1, 0],
    clamp
  );

  // ====================================================
  // ACTIVE LYRIC
  // ====================================================

  const currentLyric =
    LYRICS_SEQUENCE.slice()
      .reverse()
      .find((item) => frame >= item.start) ||
    LYRICS_SEQUENCE[0];

  // ====================================================
  // TEXT LOCAL FRAME
  // ====================================================

  const lyricFrame =
    frame - currentLyric.start;

  // ====================================================
  // MAIN TEXT ANIMATION
  // ====================================================

  const textProgress = interpolate(
    lyricFrame,
    [0, 12, 28],
    [0, 1, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  const textOpacity = interpolate(
    lyricFrame,
    [0, 8, framesPerImage - 8, framesPerImage],
    [0, 1, 1, 0],
    clamp
  );

  const textScale = interpolate(
    textProgress,
    [0, 1],
    [0.88, 1],
    clamp
  );

  const textY = interpolate(
    textProgress,
    [0, 1],
    [35, 0],
    clamp
  );

  // ====================================================
  // TEXT FLOAT
  // ====================================================

  const floatingY =
    Math.sin(frame / 18) * 2.5;

  // ====================================================
  // DECORATION ANIMATION
  // ====================================================

  const decorationProgress = interpolate(
    lyricFrame,
    [0, 18, 30],
    [0, 1, 1],
    clamp
  );

  const lineWidth = interpolate(
    decorationProgress,
    [0, 1],
    [0, 70],
    clamp
  );

  const heartScale = interpolate(
    decorationProgress,
    [0, 0.6, 1],
    [0.4, 1.15, 1],
    clamp
  );

  // ====================================================
  // SMALL LABEL
  // ====================================================

  const labelOpacity = interpolate(
    lyricFrame,
    [0, 15, framesPerImage - 10],
    [0, 0.75, 0.75],
    clamp
  );

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050505",
        overflow: "hidden",
      }}
    >

      {/* ==================================================
          IMAGE
      ================================================== */}

      <AbsoluteFill
        style={{
          opacity: imageOpacity,
        }}
      >
        <Img
          src={safeImages[currentIndex].path}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transform: `
              translate(${translateX}px, ${translateY}px)
              scale(${scale})
            `,
          }}
        />
      </AbsoluteFill>

      {/* ==================================================
          CINEMATIC COLOR OVERLAY
      ================================================== */}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,.38) 0%, rgba(0,0,0,.02) 35%, rgba(0,0,0,.28) 62%, rgba(0,0,0,.82) 100%)",
        }}
      />

      {/* ==================================================
          SOFT CENTER GLOW
      ================================================== */}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 48%, rgba(255,255,255,.10), transparent 45%)",
          opacity: 0.8,
        }}
      />

      {/* ==================================================
          FILM GRAIN
      ================================================== */}

      <AbsoluteFill
        style={{
          opacity: 0.08,
          mixBlendMode: "screen",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ==================================================
          FLOATING PARTICLES
      ================================================== */}

      <RomanticParticles frame={frame} />

      {/* ==================================================
          ROMANTIC TEXT AREA
      ================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          zIndex: 30,

          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "88%",
            textAlign: "center",

            transform: `
              translateY(${textY + floatingY}px)
              scale(${textScale})
            `,

            opacity: textOpacity,
          }}
        >

          {/* ==================================================
              SMALL TOP LABEL
          ================================================== */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              gap: 12,

              marginBottom: 18,

              opacity: labelOpacity,
            }}
          >

            <div
              style={{
                width: 34,
                height: 1,

                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,.8))",
              }}
            />

            <span
              style={{
                fontFamily:
                  "'Montserrat', 'Arial', sans-serif",

                fontSize: 9,

                fontWeight: 500,

                letterSpacing: "4px",

                color:
                  "rgba(255,255,255,.85)",

                textTransform: "uppercase",

                textShadow:
                  "0 2px 8px rgba(0,0,0,.8)",
              }}
            >
              A LITTLE LOVE
            </span>

            <div
              style={{
                width: 34,
                height: 1,

                background:
                  "linear-gradient(90deg, rgba(255,255,255,.8), transparent)",
              }}
            />

          </div>

          {/* ==================================================
              DECORATIVE HEART
          ================================================== */}

          <div
            style={{
              height: 38,

              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              marginBottom: 4,

              transform:
                `scale(${heartScale})`,

              opacity:
                decorationProgress,
            }}
          >

            <span
              style={{
                fontFamily:
                  "'Georgia', serif",

                fontSize: 22,

                color: "#fff",

                textShadow:
                  "0 0 14px rgba(255,255,255,.65), 0 3px 12px rgba(0,0,0,.8)",
              }}
            >
              ♡
            </span>

          </div>

          {/* ==================================================
              MAIN ROMANTIC LYRIC
          ================================================== */}

          <div
            style={{
              position: "relative",

              display: "inline-block",

              padding:
                "10px 25px 14px",
            }}
          >

            {/* Soft text glow */}
            <div
              style={{
                position: "absolute",
                inset: "-25px -40px",

                background:
                  "radial-gradient(ellipse, rgba(255,255,255,.12), transparent 65%)",

                filter: "blur(14px)",

                opacity: 0.7,

                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",

                fontFamily:
                  "'Bodoni Moda', 'Didot', 'Bodoni MT', 'Times New Roman', serif",

                fontSize:
                  currentLyric.text.length > 15
                    ? 42
                    : 48,

                lineHeight: 1.08,

                fontWeight: 400,

                fontStyle: "italic",

                color: "#fff",

                letterSpacing: "0.5px",

                textShadow: `
                  0 3px 12px rgba(0,0,0,.95),
                  0 7px 25px rgba(0,0,0,.75),
                  0 0 18px rgba(255,255,255,.18)
                `,
              }}
            >
              {currentLyric.text}
            </div>

          </div>

          {/* ==================================================
              DECORATIVE LINE
          ================================================== */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              marginTop: 8,

              gap: 8,
            }}
          >

            <div
              style={{
                width: lineWidth,
                height: 1,

                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,.75))",
              }}
            />

            <div
              style={{
                width: 4,
                height: 4,

                borderRadius: "50%",

                backgroundColor: "#fff",

                boxShadow:
                  "0 0 10px rgba(255,255,255,.8)",

                opacity:
                  decorationProgress,
              }}
            />

            <div
              style={{
                width: lineWidth,
                height: 1,

                background:
                  "linear-gradient(90deg, rgba(255,255,255,.75), transparent)",
              }}
            />

          </div>

          {/* ==================================================
              SMALL SUBTITLE
          ================================================== */}

          <div
            style={{
              marginTop: 12,

              fontFamily:
                "'Montserrat', 'Arial', sans-serif",

              fontSize: 10,

              fontWeight: 400,

              letterSpacing: "2px",

              color:
                "rgba(255,255,255,.72)",

              textTransform: "uppercase",

              opacity:
                textOpacity * 0.85,

              textShadow:
                "0 2px 8px rgba(0,0,0,.9)",
            }}
          >
            {currentLyric.sub}
          </div>

        </div>
      </div>

      {/* ==================================================
          CORNER DECORATION
      ================================================== */}

      <div
        style={{
          position: "absolute",

          top: 30,
          left: 25,

          width: 35,
          height: 35,

          borderTop:
            "1px solid rgba(255,255,255,.35)",

          borderLeft:
            "1px solid rgba(255,255,255,.35)",

          opacity: 0.65,

          zIndex: 40,
        }}
      />

      <div
        style={{
          position: "absolute",

          bottom: 30,
          right: 25,

          width: 35,
          height: 35,

          borderBottom:
            "1px solid rgba(255,255,255,.35)",

          borderRight:
            "1px solid rgba(255,255,255,.35)",

          opacity: 0.65,

          zIndex: 40,
        }}
      />

      {/* ==================================================
          BOTTOM BRANDING
      ================================================== */}

      <div
        style={{
          position: "absolute",

          bottom: 25,

          width: "100%",

          textAlign: "center",

          zIndex: 50,

          opacity: interpolate(
            imageFrame,
            [0, 20, framesPerImage],
            [0, 0.55, 0.55],
            clamp
          ),
        }}
      >
        <span
          style={{
            fontFamily:
              "'Montserrat', Arial, sans-serif",

            fontSize: 7,

            letterSpacing: "4px",

            color:
              "rgba(255,255,255,.65)",

            textTransform: "uppercase",

            textShadow:
              "0 2px 8px rgba(0,0,0,.9)",
          }}
        >
          FOREVER & ALWAYS
        </span>
      </div>

    </AbsoluteFill>
  );
};

// ======================================================
// ROMANTIC PARTICLES
// ======================================================

const RomanticParticles: React.FC<{
  frame: number;
}> = ({ frame }) => {

  const particles = [
    {
      left: "12%",
      top: "20%",
      size: 7,
      speed: 0.018,
      phase: 0,
    },
    {
      left: "82%",
      top: "18%",
      size: 5,
      speed: 0.024,
      phase: 1,
    },
    {
      left: "20%",
      top: "72%",
      size: 4,
      speed: 0.021,
      phase: 2,
    },
    {
      left: "87%",
      top: "67%",
      size: 7,
      speed: 0.016,
      phase: 3,
    },
    {
      left: "67%",
      top: "30%",
      size: 3,
      speed: 0.028,
      phase: 4,
    },
    {
      left: "30%",
      top: "35%",
      size: 4,
      speed: 0.022,
      phase: 5,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 15,
      }}
    >
      {particles.map((particle, index) => {

        const floatY =
          Math.sin(
            frame * particle.speed +
              particle.phase
          ) * 18;

        const floatX =
          Math.cos(
            frame * particle.speed * 0.7 +
              particle.phase
          ) * 8;

        const opacity =
          0.25 +
          Math.sin(
            frame / 12 +
              particle.phase
          ) *
            0.2;

        return (
          <div
            key={index}
            style={{
              position: "absolute",

              left: particle.left,
              top: particle.top,

              width: particle.size,
              height: particle.size,

              borderRadius: "50%",

              backgroundColor: "#fff",

              opacity,

              transform: `
                translate(${floatX}px, ${floatY}px)
              `,

              boxShadow:
                "0 0 10px rgba(255,255,255,.9)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export default SequentialRomanceReel;