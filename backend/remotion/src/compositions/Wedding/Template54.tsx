import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

// ======================================================
// CONFIG & TYPES
// ======================================================

export const IMAGE_COUNT = 13;
export const FPS = 30;
export const DURATION_IN_FRAMES = 840; // 28 seconds

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
  {
    path: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  },
  {
    path: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop",
  },
];

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// MAIN COMPONENT
// ======================================================

export const SongReelTemplate: React.FC<SceneProps> = ({ images }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const safeImages =
    images && images.length >= 13 ? images : DEFAULT_IMAGES;

  // ======================================================
  // BACKGROUND SLOW ZOOM
  // ======================================================

  const bgScale = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [1, 1.10],
    CLAMP
  );

  // ======================================================
  // FLOATING PARTICLES
  // ======================================================

  const particles = Array.from({ length: 12 }).map((_, i) => {
    const seed = i * 45.67;

    const x = (Math.sin(seed) * 500 + 500) % 100;

    const ySpeed = 0.15 + (i % 3) * 0.08;

    const y =
      100 - ((frame * ySpeed + i * 30) % 120);

    const size = 4 + (i % 5);

    const opacity =
      0.12 + (i % 4) * 0.08;

    return {
      x,
      y,
      size,
      opacity,
    };
  });

  // ======================================================
  // IMAGE SLIDE SYSTEM
  // ======================================================

  const imageInterval = 60;

  const currentIndex =
    Math.floor(frame / imageInterval) %
    safeImages.length;

  const nextIndex =
    (currentIndex + 1) %
    safeImages.length;

  // ======================================================
  // IMAGE TRANSITION
  // ======================================================

  const frameInInterval =
    frame % imageInterval;

  const transitionProgress = interpolate(
    frameInInterval,
    [0, 20],
    [0, 1],
    CLAMP
  );

  // ======================================================
  // FIXED TEXT ANIMATION
  // ONLY ONCE AT START
  // ======================================================

  const textSpring = spring({
    frame,
    fps,
    config: {
      damping: 18,
      stiffness: 80,
    },
  });

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b0807",

        overflow: "hidden",

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        justifyContent: "space-between",

        padding: "55px 40px 55px",
      }}
    >

      {/* ======================================================
          CINEMATIC BACKGROUND
      ====================================================== */}

      <AbsoluteFill
        style={{
          overflow: "hidden",
          zIndex: 0,
        }}
      >

        <Img
          src={safeImages[currentIndex].path}
          style={{
            width: "100%",
            height: "100%",

            objectFit: "cover",

            // Much less blur
            filter: "blur(10px) brightness(0.42)",

            transform: `scale(${bgScale})`,
          }}
        />

        {/* Warm Dark Cinematic Overlay */}

        <div
          style={{
            position: "absolute",

            inset: 0,

            background:
              "linear-gradient(180deg, rgba(8,6,5,0.48) 0%, rgba(8,6,5,0.30) 45%, rgba(8,6,5,0.72) 100%)",
          }}
        />

      </AbsoluteFill>


      {/* ======================================================
          SOFT FLOATING LIGHT PARTICLES
      ====================================================== */}

      {particles.map((p, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",

            left: `${p.x}%`,

            top: `${p.y}%`,

            width: `${p.size}px`,

            height: `${p.size}px`,

            borderRadius: "50%",

            backgroundColor: "#fff4df",

            opacity: p.opacity,

            boxShadow:
              "0 0 8px rgba(255,240,210,0.5)",

            zIndex: 1,

            pointerEvents: "none",
          }}
        />
      ))}


      {/* ======================================================
          TOP POV TEXT
      ====================================================== */}

      <div
        style={{
          position: "relative",

          zIndex: 10,

          width: "100%",

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          transform:
            `translateY(${interpolate(
              textSpring,
              [0, 1],
              [-15, 0],
              CLAMP
            )}px)`,

          opacity: textSpring,
        }}
      >

        <div
          style={{
            fontFamily:
              "'Cormorant Garamond', 'Times New Roman', serif",

            fontSize: "48px",

            fontWeight: 500,

            fontStyle: "italic",

            color: "#fff7ef",

            letterSpacing: "1px",

            textAlign: "center",

            lineHeight: "1.2",

            textShadow:
              "0 3px 12px rgba(0,0,0,0.85)",
          }}
        >
          POV: Mai Teri Rahun ♡
        </div>

      </div>


      {/* ======================================================
          CENTER PHOTO FRAME
      ====================================================== */}

      <div
        style={{
          position: "relative",

          width: "600px",

          height: "750px",

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          zIndex: 10,
        }}
      >

        {/* Soft Neutral Glow */}

        <div
          style={{
            position: "absolute",

            inset: "-8px",

            borderRadius: "26px",

            background:
              "rgba(255,220,190,0.16)",

            filter: "blur(18px)",

            opacity: 0.8,
          }}
        />


        {/* Photo Container */}

        <div
          style={{
            width: "100%",

            height: "100%",

            backgroundColor:
              "rgba(255,255,255,0.06)",

            backdropFilter: "blur(6px)",

            borderRadius: "18px",

            padding: "14px",

            border:
              "1px solid rgba(255,245,235,0.22)",

            boxShadow:
              "0 25px 55px rgba(0,0,0,0.65)",

            display: "flex",

            overflow: "hidden",

            position: "relative",
          }}
        >

          {/* Inner Image */}

          <div
            style={{
              width: "100%",

              height: "100%",

              borderRadius: "12px",

              overflow: "hidden",

              position: "relative",
            }}
          >

            {/* Current Image */}

            <div
              style={{
                position: "absolute",

                inset: 0,

                opacity:
                  1 - transitionProgress,

                transform:
                  `scale(${1 + transitionProgress * 0.05})`,
              }}
            >

              <Img
                src={
                  safeImages[currentIndex].path
                }
                style={{
                  width: "100%",

                  height: "100%",

                  objectFit: "cover",
                }}
              />

            </div>


            {/* Next Image */}

            <div
              style={{
                position: "absolute",

                inset: 0,

                opacity:
                  transitionProgress,

                transform:
                  `scale(${1.05 - transitionProgress * 0.05})`,
              }}
            >

              <Img
                src={
                  safeImages[nextIndex].path
                }
                style={{
                  width: "100%",

                  height: "100%",

                  objectFit: "cover",
                }}
              />

            </div>

          </div>

        </div>

      </div>


      {/* ======================================================
          BOTTOM FIXED ROMANTIC TEXT
          NO BOX
      ====================================================== */}

      <div
        style={{
          position: "relative",

          zIndex: 10,

          width: "90%",

          textAlign: "center",

          transform:
            `translateY(${interpolate(
              textSpring,
              [0, 1],
              [18, 0],
              CLAMP
            )}px)`,

          opacity: textSpring,

          paddingBottom: "5px",
        }}
      >

        {/* First Line */}

        <div
          style={{
            fontFamily:
              "'Cormorant Garamond', 'Times New Roman', serif",

            fontSize: "36px",

            fontWeight: 600,

            lineHeight: "1.15",

            color: "#fff9f2",

            letterSpacing: "0.4px",

            textShadow:
              "0 3px 14px rgba(0,0,0,0.9)",
          }}
        >
          Bas tera saath chahiye,
        </div>


        {/* Second Line */}

        <div
          style={{
            marginTop: "5px",

            fontFamily:
              "'Cormorant Garamond', 'Times New Roman', serif",

            fontSize: "31px",

            fontWeight: 500,

            fontStyle: "italic",

            lineHeight: "1.2",

            color: "#f7e8d9",

            letterSpacing: "0.5px",

            textShadow:
              "0 3px 14px rgba(0,0,0,0.9)",
          }}
        >
          baaki zindagi khud khoobsurat ho jayegi. ♡
        </div>

      </div>

    </AbsoluteFill>
  );
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default SongReelTemplate;