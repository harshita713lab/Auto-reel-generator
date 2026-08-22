import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  Easing,
  Sequence,
} from "remotion";

// ======================================================
// CONFIG
// ======================================================

export const IMAGE_COUNT = 15;
export const FPS = 30;
export const DURATION_IN_FRAMES = 550;

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
    path: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
  },
];

// ======================================================
// HELPERS
// ======================================================

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const smooth = Easing.bezier(0.22, 1, 0.36, 1);

// ======================================================
// MAIN COMPONENT
// ======================================================

export const MultiPhase15ImageReel: React.FC<TemplateProps> = ({
  images,
}) => {
  const safeImages =
    images && images.length >= 15
      ? images
      : DEFAULT_IMAGES;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#111",
        overflow: "hidden",
      }}
    >
      {/* ==================================================
          SCENE 1
      ================================================== */}

      <Sequence
        from={0}
        durationInFrames={124}
      >
        <PhaseOneGrid
          images={safeImages.slice(0, 4)}
        />
      </Sequence>

      {/* ==================================================
          SCENE 2
      ================================================== */}

      <Sequence
        from={124}
        durationInFrames={129}
      >
        <PhaseTwoEnvelopeCards
          images={safeImages.slice(4, 8)}
        />
      </Sequence>

      {/* ==================================================
          SCENE 3
      ================================================== */}

      <Sequence
        from={253}
        durationInFrames={297}
      >
        <PhaseThreeFullscreen
          images={safeImages.slice(8, 15)}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 1
// GRID
// ======================================================

const PhaseOneGrid: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const positions = [
    { left: "4%", top: "3%" },
    { right: "4%", top: "3%" },
    { left: "4%", bottom: "3%" },
    { right: "4%", bottom: "3%" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#111",
      }}
    >
      {images.map((img, index) => {
        if (!img?.path) return null;

        const start =
          index * 20 + 5;

        const local =
          frame - start;

        const scale = interpolate(
          local,
          [0, 22],
          [0.72, 1],
          {
            ...CLAMP,
            easing: Easing.out(
              Easing.back(1.4)
            ),
          }
        );

        const opacity = interpolate(
          local,
          [0, 8],
          [0, 1],
          CLAMP
        );

        const translateY =
          interpolate(
            local,
            [0, 22],
            [
              index < 2 ? -80 : 80,
              0,
            ],
            {
              ...CLAMP,
              easing: smooth,
            }
          );

        const pos =
          positions[index];

        return (
          <div
            key={index}
            style={{
              position: "absolute",

              width: "45%",
              height: "46%",

              left: pos.left,
              right: pos.right,
              top: pos.top,
              bottom: pos.bottom,

              overflow: "hidden",

              borderRadius: 4,

              opacity,

              transform: `
                translateY(${translateY}px)
                scale(${scale})
              `,

              filter:
                "grayscale(100%) contrast(115%) brightness(92%)",

              boxShadow:
                "0 8px 25px rgba(0,0,0,0.4)",
            }}
          >
            <Img
              src={img.path}
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

      {/* DARK OVERLAY */}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle, transparent 35%, rgba(0,0,0,0.38) 100%)",

          pointerEvents: "none",
        }}
      />

      <CenterMiniPhotos
        images={images}
        frame={frame}
      />

      <WeddingText
        frame={frame}
      />

      {/* USERNAME */}

      <div
        style={{
          position: "absolute",

          bottom: "8%",

          left: 0,
          right: 0,

          display: "flex",

          justifyContent: "center",

          fontSize: 13,

          color:
            "rgba(255,255,255,0.85)",

          fontFamily:
            "Arial, sans-serif",

          letterSpacing:
            "0.5px",

          opacity: interpolate(
            frame,
            [10, 35],
            [0, 1],
            CLAMP
          ),
        }}
      >
        ✨ @chanchal_creation_
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// CENTER MINI PHOTOS
// ======================================================

const CenterMiniPhotos: React.FC<{
  images: ImageItem[];
  frame: number;
}> = ({
  images,
  frame,
}) => {
  const positions = [
    {
      x: -48,
      rotation: -8,
    },
    {
      x: 48,
      rotation: 7,
    },
  ];

  return (
    <>
      {[0, 1].map((i) => {
        const image =
          images[i];

        if (!image?.path) {
          return null;
        }

        const start =
          66 + i * 10;

        const local =
          frame - start;

        const opacity =
          interpolate(
            local,
            [0, 10],
            [0, 1],
            CLAMP
          );

        const y = interpolate(
          local,
          [0, 20],
          [25, 0],
          {
            ...CLAMP,
            easing: smooth,
          }
        );

        const scale =
          interpolate(
            local,
            [0, 20],
            [0.55, 1],
            {
              ...CLAMP,
              easing: Easing.out(
                Easing.back(1.4)
              ),
            }
          );

        const p =
          positions[i];

        return (
          <div
            key={i}
            style={{
              position: "absolute",

              left: "50%",
              top: "50%",

              width: 115,
              height: 135,

              backgroundColor:
                "#fff",

              padding:
                "6px 6px 19px 6px",

              borderRadius: 4,

              boxShadow:
                "0 10px 24px rgba(0,0,0,0.5)",

              opacity,

              zIndex: 10,

              transform: `
                translate(-50%, -50%)
                translateX(${p.x}px)
                translateY(${y}px)
                scale(${scale})
                rotate(${p.rotation}deg)
              `,
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
    </>
  );
};

// ======================================================
// HAPPY BIRTHDAY TEXT
// ======================================================

// ======================================================
// WEDDING / COUPLE TEXT
// ======================================================

const WeddingText: React.FC<{
  frame: number;
}> = ({ frame }) => {
  const opacity = interpolate(
    frame,
    [72, 88, 112, 124],
    [0, 1, 1, 0],
    CLAMP
  );

  const scale = interpolate(
    frame,
    [72, 88],
    [0.65, 1],
    {
      ...CLAMP,
      easing: Easing.out(
        Easing.back(1.5)
      ),
    }
  );

  const y = interpolate(
    frame,
    [72, 88],
    [25, 0],
    {
      ...CLAMP,
      easing: smooth,
    }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "42%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        opacity,
        zIndex: 20,
        transform: `
          translateY(${y}px)
          scale(${scale})
        `,
      }}
    >
      {/* TOP SMALL TEXT */}

      <div
        style={{
          fontFamily:
            "Georgia, 'Times New Roman', serif",
          fontSize: 15,
          letterSpacing: 4,
          color: "rgba(255,255,255,0.95)",
          textShadow:
            "2px 3px 6px rgba(0,0,0,0.75)",
          marginBottom: -5,
        }}
      >
        TOGETHER
      </div>

      {/* MAIN WEDDING TEXT */}

      <div
        style={{
          fontFamily:
            "'Brush Script MT', 'Segoe Script', cursive",
          fontSize: 52,
          color: "#ffffff",
          textShadow:
            "3px 4px 7px rgba(0,0,0,0.75)",
          padding: "0 20px",
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        Forever
      </div>

      {/* HEART */}

      <div
        style={{
          fontSize: 18,
          marginTop: -2,
          textShadow:
            "2px 2px 5px rgba(0,0,0,0.6)",
        }}
      >
        🤍
      </div>
    </div>
  );
};

// ======================================================
// SCENE 2
// ENVELOPE + I LOVE YOU + CARDS
// ======================================================

const PhaseTwoEnvelopeCards: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame =
    useCurrentFrame();

  const polaroidConfigs = [
    {
      targetX: -245,
      targetY: -250,
      rotate: -13,
      delay: 58,
    },
    {
      targetX: 245,
      targetY: -235,
      rotate: 11,
      delay: 72,
    },
    {
      targetX: -230,
      targetY: 245,
      rotate: 9,
      delay: 86,
    },
    {
      targetX: 235,
      targetY: 255,
      rotate: -11,
      delay: 100,
    },
  ];

  // I LOVE YOU

  const loveOpacity =
    interpolate(
      frame,
      [10, 24, 45, 58],
      [0, 1, 1, 0],
      CLAMP
    );

  const loveScale =
    interpolate(
      frame,
      [10, 25, 45, 58],
      [0.4, 1.1, 1, 0.85],
      {
        ...CLAMP,
        easing: Easing.out(
          Easing.back(1.4)
        ),
      }
    );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",

        background:
          "radial-gradient(circle at 50% 35%, #f7e8ca 0%, #e5c7a5 35%, #9c795e 100%)",
      }}
    >
      {/* BACKGROUND GLOW */}

      <div
        style={{
          position: "absolute",

          width: 550,
          height: 550,

          left: "50%",
          top: "50%",

          borderRadius:
            "50%",

          background:
            "rgba(255,255,255,0.18)",

          filter:
            "blur(50px)",

          transform:
            "translate(-50%, -50%)",
        }}
      />

      {/* DECORATIONS */}

      <div
        style={{
          position: "absolute",

          left: "7%",
          top: "10%",

          fontSize: 45,

          opacity: 0.28,

          transform:
            "rotate(-15deg)",
        }}
      >
        ❤️
      </div>

      <div
        style={{
          position: "absolute",

          right: "9%",
          top: "16%",

          fontSize: 34,

          opacity: 0.3,

          transform:
            "rotate(18deg)",
        }}
      >
        ✦
      </div>

      <div
        style={{
          position: "absolute",

          left: "10%",
          bottom: "12%",

          fontSize: 38,

          opacity: 0.28,
        }}
      >
        ✨
      </div>

      <div
        style={{
          position: "absolute",

          right: "9%",
          bottom: "13%",

          fontSize: 42,

          opacity: 0.25,
        }}
      >
        ❤️
      </div>

      {/* ENVELOPE */}

      <div
        style={{
          position: "absolute",

          width: 340,
          height: 225,

          left: "50%",
          top: "50%",

          transform:
            "translate(-50%, -50%)",

          backgroundColor:
            "#b89467",

          borderRadius: 10,

          boxShadow:
            "0 25px 55px rgba(48,25,12,0.35)",

          zIndex: 5,
        }}
      >
        {/* TOP FLAP */}

        <div
          style={{
            position: "absolute",

            top: 0,
            left: 0,

            width: 0,
            height: 0,

            borderLeft:
              "170px solid transparent",

            borderRight:
              "170px solid transparent",

            borderTop:
              "115px solid #9d754f",

            zIndex: 3,
          }}
        />

        {/* BOTTOM FOLD */}

        <div
          style={{
            position: "absolute",

            bottom: 0,
            left: 0,

            width: 0,
            height: 0,

            borderLeft:
              "170px solid transparent",

            borderRight:
              "170px solid transparent",

            borderBottom:
              "115px solid #a9825b",

            opacity: 0.75,
          }}
        />
      </div>

      {/* I LOVE YOU */}

      <div
        style={{
          position: "absolute",

          left: "50%",
          top: "50%",

          zIndex: 20,

          transform: `
            translate(-50%, -50%)
            scale(${loveScale})
          `,

          opacity: loveOpacity,

          textAlign:
            "center",

          whiteSpace:
            "nowrap",
        }}
      >
        <div
          style={{
            fontFamily:
              "'Brush Script MT', cursive",

            fontSize: 64,

            color: "#fff8ed",

            textShadow:
              "0 4px 12px rgba(0,0,0,0.35)",
          }}
        >
          I Love You
        </div>

        <div
          style={{
            fontSize: 30,
            marginTop: -5,
          }}
        >
          ❤️
        </div>
      </div>

      {/* POLAROID CARDS */}

      {images
        .slice(0, 4)
        .map((img, idx) => {
          if (!img?.path) {
            return null;
          }

          const config =
            polaroidConfigs[idx];

          const localFrame =
            Math.max(
              0,
              frame -
                config.delay
            );

          const translateX =
            interpolate(
              localFrame,
              [0, 32],
              [
                0,
                config.targetX,
              ],
              {
                ...CLAMP,
                easing: Easing.out(
                  Easing.cubic
                ),
              }
            );

          const translateY =
            interpolate(
              localFrame,
              [0, 32],
              [
                0,
                config.targetY,
              ],
              {
                ...CLAMP,
                easing: Easing.out(
                  Easing.cubic
                ),
              }
            );

          const rotateVal =
            interpolate(
              localFrame,
              [0, 32],
              [
                0,
                config.rotate,
              ],
              {
                ...CLAMP,
                easing: Easing.out(
                  Easing.cubic
                ),
              }
            );

          const opacity =
            interpolate(
              localFrame,
              [0, 6],
              [0, 1],
              CLAMP
            );

          const cardScale =
            interpolate(
              localFrame,
              [0, 22, 32],
              [0.2, 1.1, 1],
              {
                ...CLAMP,
                easing: Easing.out(
                  Easing.back(1.2)
                ),
              }
            );

          return (
            <div
              key={idx}
              style={{
                position:
                  "absolute",

                left: "50%",
                top: "50%",

                width: 290,
                height: 355,

                backgroundColor:
                  "#fff8ef",

                padding:
                  "7px 7px 24px 7px",

                borderRadius: 6,

                boxShadow:
                  "0 22px 50px rgba(0,0,0,0.35)",

                transform: `
                  translate(-50%, -50%)
                  translateX(${translateX}px)
                  translateY(${translateY}px)
                  scale(${cardScale})
                  rotate(${rotateVal}deg)
                `,

                opacity,

                zIndex:
                  30 + idx,

                willChange:
                  "transform, opacity",
              }}
            >
              <Img
                src={img.path}
                style={{
                  width: "100%",
                  height: "100%",

                  objectFit:
                    "cover",

                  display:
                    "block",

                  borderRadius: 3,
                }}
              />
            </div>
          );
        })}
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 3
// BLACK FRAME + ZOOM IN / OUT
// ======================================================

// ======================================================
// SCENE 3
// CINEMATIC BLACK FRAME + BLURRED BACKGROUND
// ======================================================

const PhaseThreeFullscreen: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const framesPerImage = 42;

  const currentIndex = Math.min(
    Math.floor(frame / framesPerImage),
    images.length - 1
  );

  const localFrame =
    frame - currentIndex * framesPerImage;

  const image = images[currentIndex];

  if (!image?.path) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#111",
        }}
      />
    );
  }

  // ====================================================
  // IMAGE FADE ONLY
  // Frame fade nahi hoga
  // ====================================================

  const imageOpacity = interpolate(
    localFrame,
    [0, 6, framesPerImage - 6, framesPerImage],
    [0, 1, 1, 0],
    CLAMP
  );

  // ====================================================
  // ZOOM IN → ZOOM OUT
  // Only image move karegi
  // ====================================================

  const imageScale = interpolate(
    localFrame,
    [0, 12, 30, framesPerImage],
    [1, 1.06, 1.1, 1.02],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.quad),
    }
  );

  // ====================================================
  // SMALL IMAGE MOTION
  // ====================================================

  const translateY = interpolate(
    localFrame,
    [0, framesPerImage],
    [6, -6],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.quad),
    }
  );

  // ====================================================
  // BACKGROUND IMAGE SCALE
  // ====================================================

  const bgScale = interpolate(
    localFrame,
    [0, framesPerImage],
    [1.1, 1.16],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.quad),
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a1a",
        overflow: "hidden",
      }}
    >
      {/* ================================================
          BACKGROUND
      ================================================= */}

      <AbsoluteFill
        style={{
          overflow: "hidden",
        }}
      >
        <Img
          src={image.path}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",

            transform: `scale(${bgScale})`,

            filter:
              "blur(25px) brightness(0.4) saturate(0.75)",

            display: "block",
          }}
        />
      </AbsoluteFill>

      {/* DARK BACKGROUND OVERLAY */}

      <AbsoluteFill
        style={{
          background:
            "rgba(0,0,0,0.2)",
        }}
      />

      {/* ================================================
          FIXED BLACK FRAME
          Ye poore Scene 3 me ek baar rahega
      ================================================= */}

      <div
        style={{
          position: "absolute",

          left: "50%",
          top: "50%",

          width: "83%",
          height: "90%",

          backgroundColor: "#0b0b0b",

          padding: 9,

          boxSizing: "border-box",

          borderRadius: 2,

          boxShadow:
            "0 12px 45px rgba(0,0,0,0.7)",

          // FRAME FIXED HAI
          transform:
            "translate(-50%, -50%)",

          overflow: "hidden",

          zIndex: 10,
        }}
      >
        {/* ============================================
            IMAGE INSIDE FIXED FRAME
        ============================================ */}

        <Img
          key={currentIndex}
          src={image.path}
          style={{
            width: "100%",
            height: "100%",

            objectFit: "cover",

            display: "block",

            opacity: imageOpacity,

            transform: `
              translateY(${translateY}px)
              scale(${imageScale})
            `,
          }}
        />

        {/* IMAGE BOTTOM SHADOW */}

        <div
          style={{
            position: "absolute",

            left: 0,
            right: 0,
            bottom: 0,

            height: "20%",

            background:
              "linear-gradient(to top, rgba(0,0,0,0.28), transparent)",

            pointerEvents: "none",
          }}
        />
      </div>

      {/* ================================================
          FIXED HEART
      ================================================= */}

      <div
        style={{
          position: "absolute",

          bottom: "7%",
          right: "12%",

          fontSize: 24,

          textShadow:
            "0 3px 8px rgba(0,0,0,0.5)",

          zIndex: 20,
        }}
      >
        🤍
      </div>

      {/* ================================================
          VIGNETTE
      ================================================= */}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle, transparent 45%, rgba(0,0,0,0.32) 100%)",

          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default MultiPhase15ImageReel;