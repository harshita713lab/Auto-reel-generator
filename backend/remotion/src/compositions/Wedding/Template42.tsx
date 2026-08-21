import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  Easing,
  random,
} from "remotion";

// ======================================================
// CONFIG
// ======================================================

export const IMAGE_COUNT = 1;
export const FPS = 30;
export const DURATION_IN_FRAMES = 300; // 10 seconds

interface ImageItem {
  path: string;
}

interface TemplateProps {
  images?: ImageItem[];
}

const DEFAULT_IMAGES: ImageItem[] = [
  {
    path: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
  },
];

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// MAIN
// ======================================================

export const SingleImageRomanceReel: React.FC<TemplateProps> = ({
  images,
}) => {
  const frame = useCurrentFrame();

  const safeImages =
    images && images.length > 0 ? images : DEFAULT_IMAGES;

  const image = safeImages[0].path;

  // ====================================================
  // MASTER CINEMATIC MOTION
  // ====================================================

  const scale = interpolate(
    frame,
    [0, 100, 200, 300],
    [1.02, 1.08, 1.14, 1.18],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // Slow horizontal movement
  const translateX = interpolate(
    frame,
    [0, 150, 300],
    [-12, 8, -5],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // Slow vertical movement
  const translateY = interpolate(
    frame,
    [0, 150, 300],
    [8, -8, -18],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // ====================================================
  // IMAGE FADE IN
  // ====================================================

  const imageOpacity = interpolate(
    frame,
    [0, 25],
    [0, 1],
    {
      ...clamp,
    }
  );

  // ====================================================
  // CINEMATIC OVERLAY
  // ====================================================

  const darkOverlay = interpolate(
    frame,
    [0, 30, 300],
    [0.15, 0.28, 0.35],
    {
      ...clamp,
    }
  );

  // ====================================================
  // WARM LIGHT
  // ====================================================

  const warmLightOpacity = interpolate(
    frame,
    [0, 80, 160, 240, 300],
    [0.08, 0.18, 0.10, 0.16, 0.08],
    {
      ...clamp,
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080608",
        overflow: "hidden",
      }}
    >
      {/* ==================================================
          IMAGE
      ================================================== */}

      <AbsoluteFill
        style={{
          opacity: imageOpacity,
          transform: `
            translateX(${translateX}px)
            translateY(${translateY}px)
            scale(${scale})
          `,
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
      </AbsoluteFill>

      {/* ==================================================
          CINEMATIC COLOR TONE
      ================================================== */}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(135deg, rgba(255,180,190,0.10), transparent 45%, rgba(120,80,120,0.12))",
          mixBlendMode: "screen",
          opacity: warmLightOpacity,
        }}
      />

      {/* ==================================================
          DARK CINEMATIC GRADIENT
      ================================================== */}

      <AbsoluteFill
        style={{
          background: `
            linear-gradient(
              180deg,
              rgba(0,0,0,${darkOverlay * 0.55}) 0%,
              rgba(0,0,0,${darkOverlay * 0.05}) 42%,
              rgba(0,0,0,${darkOverlay}) 100%
            )
          `,
        }}
      />

      {/* ==================================================
          VIGNETTE
      ================================================== */}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.48) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ==================================================
          FLOATING PARTICLES
      ================================================== */}

      <RomanticParticles frame={frame} />

      {/* ==================================================
          LIGHT LEAK
      ================================================== */}

      <LightLeak frame={frame} />

      {/* ==================================================
          TEXT
      ================================================== */}

      <RomanticText frame={frame} />

      {/* ==================================================
          FINAL HEART GLOW
      ================================================== */}

      <HeartGlow frame={frame} />

      {/* ==================================================
          FILM GRAIN
      ================================================== */}

      <AbsoluteFill
        style={{
          opacity: 0.045,
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// ROMANTIC TEXT
// ======================================================

const RomanticText: React.FC<{ frame: number }> = ({ frame }) => {
  // =====================================================
  // MAIN ENTRANCE
  // =====================================================

  const progress = interpolate(
    frame,
    [20, 65],
    [0, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.back(1.15)),
    }
  );

  const opacity = interpolate(
    frame,
    [15, 45, 270, 315],
    [0, 1, 1, 0],
    clamp
  );

  const scale = interpolate(
    progress,
    [0, 1],
    [0.82, 1],
    clamp
  );

  const translateY = interpolate(
    progress,
    [0, 1],
    [40, 0],
    clamp
  );

  // =====================================================
  // VERY SUBTLE FLOATING
  // =====================================================

  const floatingY = Math.sin(frame / 32) * 2.5;
  const floatingX = Math.sin(frame / 55) * 1.5;

  // =====================================================
  // SHIMMER
  // =====================================================

  const shimmerX = interpolate(
    frame % 150,
    [0, 75, 150],
    [-120, 120, -120],
    clamp
  );

  // =====================================================
  // HEART PULSE
  // =====================================================

  const heartPulse =
    1 + Math.sin(frame / 9) * 0.055;

  // =====================================================
  // DECORATIVE HEARTS
  // =====================================================

  const heart1Y =
    Math.sin(frame / 18) * 7;

  const heart2Y =
    Math.sin(frame / 23 + 1) * 9;

  const heart3Y =
    Math.sin(frame / 20 + 2) * 6;

  // =====================================================
  // SPARKLE OPACITY
  // =====================================================

  const sparkle1 =
    0.35 +
    Math.sin(frame / 12) * 0.3;

  const sparkle2 =
    0.35 +
    Math.sin(frame / 17 + 2) * 0.3;

  const sparkle3 =
    0.35 +
    Math.sin(frame / 20 + 4) * 0.3;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        pointerEvents: "none",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        opacity,

        transform: `
          translateY(${translateY + floatingY}px)
          translateX(${floatingX}px)
          scale(${scale})
        `,
      }}
    >

      {/* =================================================
          SOFT ROMANTIC GLOW BEHIND TEXT
      ================================================= */}

      <div
        style={{
          position: "absolute",

          width: "82%",
          height: "62%",

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(255,90,125,.16), rgba(255,255,255,.04) 40%, transparent 72%)",

          filter: "blur(22px)",

          opacity: 0.9,
        }}
      />

      {/* =================================================
          FLOATING HEART — LEFT
      ================================================= */}

      <div
        style={{
          position: "absolute",

          left: "12%",
          top: "24%",

          transform: `
            translateY(${heart1Y}px)
            rotate(-12deg)
          `,

          fontFamily: "'Great Vibes', cursive",

          fontSize: 24,

          color: "rgba(255,120,145,.85)",

          textShadow:
            "0 0 15px rgba(255,70,110,.8)",

          opacity: 0.8,
        }}
      >
        ♡
      </div>

      {/* =================================================
          FLOATING HEART — RIGHT
      ================================================= */}

      <div
        style={{
          position: "absolute",

          right: "12%",
          top: "32%",

          transform: `
            translateY(${heart2Y}px)
            rotate(14deg)
          `,

          fontFamily: "'Great Vibes', cursive",

          fontSize: 20,

          color: "rgba(255,150,165,.8)",

          textShadow:
            "0 0 14px rgba(255,70,110,.7)",

          opacity: 0.75,
        }}
      >
        ♡
      </div>

      {/* =================================================
          SMALL HEART — BOTTOM LEFT
      ================================================= */}

      <div
        style={{
          position: "absolute",

          left: "20%",
          bottom: "24%",

          transform: `
            translateY(${heart3Y}px)
            rotate(-8deg)
          `,

          fontSize: 15,

          color: "rgba(255,255,255,.7)",

          textShadow:
            "0 0 12px rgba(255,255,255,.8)",
        }}
      >
        ♡
      </div>

      {/* =================================================
          SPARKLE 1
      ================================================= */}

      <div
        style={{
          position: "absolute",

          left: "17%",
          top: "35%",

          fontSize: 12,

          color: "#fff",

          opacity: sparkle1,

          transform: `scale(${
            0.8 +
            Math.sin(frame / 10) * 0.2
          })`,

          textShadow:
            "0 0 12px rgba(255,255,255,.9)",
        }}
      >
        ✦
      </div>

      {/* =================================================
          SPARKLE 2
      ================================================= */}

      <div
        style={{
          position: "absolute",

          right: "18%",
          top: "25%",

          fontSize: 10,

          color: "#ffdce3",

          opacity: sparkle2,

          textShadow:
            "0 0 12px rgba(255,150,180,.9)",
        }}
      >
        ✧
      </div>

      {/* =================================================
          SPARKLE 3
      ================================================= */}

      <div
        style={{
          position: "absolute",

          right: "21%",
          bottom: "27%",

          fontSize: 9,

          color: "#fff",

          opacity: sparkle3,

          textShadow:
            "0 0 10px rgba(255,255,255,.9)",
        }}
      >
        ✦
      </div>

      {/* =================================================
          MAIN TYPOGRAPHY CARD
      ================================================= */}

      <div
        style={{
          position: "relative",

          width: "86%",

          textAlign: "center",

          padding: "30px 18px 20px",

          borderRadius: 28,

          background:
            "linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,.18))",

          boxShadow:
            "0 15px 50px rgba(0,0,0,.18)",

          overflow: "hidden",
        }}
      >

        {/* =================================================
            TOP ORNAMENT
        ================================================= */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            gap: 10,

            marginBottom: 12,

            opacity: 0.85,
          }}
        >
          <div
            style={{
              width: 32,
              height: 1,

              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,.7))",
            }}
          />

          <span
            style={{
              fontSize: 12,
              color: "#ffd7df",

              textShadow:
                "0 0 12px rgba(255,100,130,.8)",
            }}
          >
            ✦
          </span>

          <span
            style={{
              fontFamily:
                "'Great Vibes', cursive",

              fontSize: 21,

              color: "rgba(255,190,205,.9)",
            }}
          >
            forever
          </span>

          <span
            style={{
              fontSize: 12,
              color: "#ffd7df",

              textShadow:
                "0 0 12px rgba(255,100,130,.8)",
            }}
          >
            ✦
          </span>

          <div
            style={{
              width: 32,
              height: 1,

              background:
                "linear-gradient(to left, transparent, rgba(255,255,255,.7))",
            }}
          />
        </div>

        {/* =================================================
            MAIN TEXT
        ================================================= */}

        <div
          style={{
            position: "relative",

            fontFamily:
              "'Great Vibes', 'Allura', 'Caveat', cursive",

            fontSize: 50,

            lineHeight: 1.23,

            fontWeight: 400,

            color: "#fff",

            letterSpacing: "1.3px",

            textShadow: `
              0 3px 8px rgba(0,0,0,.95),
              0 8px 25px rgba(0,0,0,.65),
              0 0 18px rgba(255,120,150,.18)
            `,
          }}
        >

          <div>
            TU MILE JAHA
          </div>

          <div
            style={{
              color: "#fff",
            }}
          >
            MERA JAHAAN
          </div>

          {/* SPECIAL HIGHLIGHT LINE */}

          <div
            style={{
              position: "relative",

              display: "inline-block",

              marginTop: 1,

              color: "#ffe7ec",

              textShadow: `
                0 3px 8px rgba(0,0,0,.9),
                0 0 20px rgba(255,90,120,.35)
              `,
            }}
          >
            HAIN WAHA

            {/* tiny heart */}

            <span
              style={{
                position: "absolute",

                right: -23,
                top: 1,

                fontSize: 17,

                color: "#ff7187",

                transform: `scale(${heartPulse})`,

                textShadow:
                  "0 0 15px rgba(255,70,110,.9)",
              }}
            >
              ♥
            </span>
          </div>

          <div>
            ROUNAKE SAARI
          </div>

          {/* FINAL LINE */}

          <div
            style={{
              marginTop: 2,

              fontSize: 55,

              color: "#ffb5c2",

              textShadow: `
                0 3px 8px rgba(0,0,0,.95),
                0 0 18px rgba(255,70,110,.5),
                0 0 35px rgba(255,70,110,.18)
              `,
            }}
          >
            TUM SE HI
          </div>
        </div>

        {/* =================================================
            SHIMMER LINE
        ================================================= */}

        <div
          style={{
            position: "relative",

            width: 100,
            height: 1,

            margin:
              "16px auto 10px",

            overflow: "hidden",

            background:
              "rgba(255,255,255,.3)",
          }}
        >
          <div
            style={{
              position: "absolute",

              top: 0,
              left: `${shimmerX}%`,

              width: 35,
              height: 1,

              background:
                "rgba(255,255,255,.95)",

              filter:
                "blur(1px)",

              boxShadow:
                "0 0 12px rgba(255,255,255,.9)",
            }}
          />
        </div>

        {/* =================================================
            BOTTOM ROMANTIC SYMBOL
        ================================================= */}

        <div
          style={{
            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            gap: 8,
          }}
        >

          <span
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,.55)",
            }}
          >
            ✧
          </span>

          <span
            style={{
              fontFamily:
                "'Great Vibes', cursive",

              fontSize: 38,

              color: "#ff7187",

              transform:
                `scale(${heartPulse})`,

              textShadow: `
                0 0 12px rgba(255,70,110,.8),
                0 0 25px rgba(255,70,110,.45)
              `,
            }}
          >
            ♡
          </span>

          <span
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,.55)",
            }}
          >
            ✧
          </span>

        </div>

      </div>
    </div>
  );
};

// ======================================================
// FLOATING PARTICLES
// ======================================================

const RomanticParticles: React.FC<{
  frame: number;
}> = ({ frame }) => {
  const particles = Array.from(
    { length: 18 },
    (_, i) => {
      const x =
        random(`x-${i}`) * 100;

      const startY =
        100 + random(`y-${i}`) * 20;

      const size =
        1.5 + random(`size-${i}`) * 3;

      const speed =
        0.15 + random(`speed-${i}`) * 0.35;

      const opacity =
        0.15 + random(`opacity-${i}`) * 0.45;

      const y =
        startY - frame * speed;

      const drift =
        Math.sin(frame / 40 + i) * 12;

      return {
        x,
        y,
        size,
        opacity,
        drift,
      };
    }
  );

  return (
    <AbsoluteFill
      style={{
        zIndex: 8,
        pointerEvents: "none",
      }}
    >
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",

            left: `${p.x}%`,
            top: `${p.y}%`,

            transform: `translateX(${p.drift}px)`,

            width: p.size,
            height: p.size,

            borderRadius: "50%",

            backgroundColor:
              "rgba(255,220,225,0.9)",

            opacity:
              p.y < 0
                ? 0
                : p.opacity,

            boxShadow:
              "0 0 8px rgba(255,180,190,0.8)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// ======================================================
// LIGHT LEAK
// ======================================================

const LightLeak: React.FC<{
  frame: number;
}> = ({ frame }) => {
  const x = interpolate(
    frame,
    [0, 150, 300],
    [-35, 60, 120],
    {
      ...clamp,
      easing: Easing.inOut(Easing.sin),
    }
  );

  const opacity = interpolate(
    frame,
    [0, 40, 120, 200, 300],
    [0, 0.18, 0.06, 0.14, 0],
    {
      ...clamp,
    }
  );

  return (
    <div
      style={{
        position: "absolute",

        top: "-20%",
        left: `${x}%`,

        width: "35%",
        height: "140%",

        background:
          "linear-gradient(90deg, transparent, rgba(255,170,190,0.22), transparent)",

        filter: "blur(35px)",

        transform:
          "rotate(18deg)",

        opacity,

        zIndex: 12,

        pointerEvents: "none",
      }}
    />
  );
};

// ======================================================
// HEART GLOW
// ======================================================

const HeartGlow: React.FC<{
  frame: number;
}> = ({ frame }) => {
  const pulse =
    1 +
    Math.sin(frame / 10) * 0.08;

  const opacity = interpolate(
    frame,
    [65, 85, 270, 300],
    [0, 1, 1, 0],
    {
      ...clamp,
    }
  );

  return (
    <div
      style={{
        position: "absolute",

        left: "50%",
        top: "77%",

        transform: `
          translate(-50%, -50%)
          scale(${pulse})
        `,

        opacity,

        zIndex: 25,

        fontFamily:
          "'Great Vibes', cursive",

        fontSize: "34px",

        color: "#ff6b81",

        textShadow: `
          0 0 10px rgba(255,90,120,0.8),
          0 0 30px rgba(255,90,120,0.5)
        `,
      }}
    >
      ✦
    </div>
  );
};

export default SingleImageRomanceReel;