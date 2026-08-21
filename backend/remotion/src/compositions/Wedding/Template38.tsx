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

interface GridSplitReelProps {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIG
// ======================================================

export const IMAGE_COUNT = 1;
export const FPS = 30;
export const DURATION_IN_FRAMES = 480; // 16 seconds

// ======================================================
// DEFAULT IMAGE
// ======================================================

const DEFAULT_IMAGES: ImageItem[] = [
  {
    path:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
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
// IMAGE STYLE
// ======================================================

const imageStyle = (
  scale: number,
  x: number,
  y: number,
  filter = "none",
  objectPosition = "center center"
): React.CSSProperties => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition,
  transform: `translate(${x}px, ${y}px) scale(${scale})`,
  filter,
});

// ======================================================
// COMPONENT
// ======================================================

export const GridSplitReel: React.FC<GridSplitReelProps> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();

  // ====================================================
  // IMAGE
  // ====================================================

  const safeImages =
    images.length > 0 ? images : DEFAULT_IMAGES;

  const img =
    safeImages[0]?.url ||
    safeImages[0]?.path ||
    DEFAULT_IMAGES[0].path;

  // ====================================================
  // MUSIC
  // ====================================================

  const musicSrc =
    typeof music === "string"
      ? music
      : music?.path;

  // ====================================================
  // SCENE TIMINGS
  // ====================================================

  const SCENE_1_END = 105; // 0 - 3.5 sec
  const SCENE_2_END = 195; // 3.5 - 6.5 sec
  const SCENE_3_END = 285; // 6.5 - 9.5 sec
  const SCENE_4_END = 360; // 9.5 - 12 sec
  const SCENE_5_END = 378; // 12 - 12.6 sec
  const SCENE_6_END = 480; // 12.6 - 16 sec

  // ====================================================
  // SCENES
  // ====================================================

  const scene1 = frame < SCENE_1_END;

  const scene2 =
    frame >= SCENE_1_END &&
    frame < SCENE_2_END;

  const scene3 =
    frame >= SCENE_2_END &&
    frame < SCENE_3_END;

  const scene4 =
    frame >= SCENE_3_END &&
    frame < SCENE_4_END;

  const scene5 =
    frame >= SCENE_4_END &&
    frame < SCENE_5_END;

  const scene6 =
    frame >= SCENE_5_END &&
    frame < SCENE_6_END;

  // ====================================================
  // SCENE 1
  // PREMIUM THREE STRIP INTRO
  // ====================================================

  const scene1Progress = interpolate(
    frame,
    [0, SCENE_1_END],
    [0, 1],
    clamp
  );

  const blurAmount = interpolate(
    scene1Progress,
    [0, 0.45, 1],
    [12, 7, 0],
    clamp
  );

  const scene1Scale = interpolate(
    scene1Progress,
    [0, 1],
    [1.18, 1.04],
    clamp
  );

  const scene1Y = interpolate(
    scene1Progress,
    [0, 1],
    [18, -8],
    clamp
  );

  // ====================================================
  // SCENE 2
  // THREE PANEL CINEMATIC REVEAL
  // ====================================================

  const s2 = frame - SCENE_1_END;

  const panelReveal = interpolate(
    s2,
    [0, 24],
    [0, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  const leftPanelX = interpolate(
    panelReveal,
    [0, 1],
    [-100, 0],
    clamp
  );

  const centerPanelY = interpolate(
    panelReveal,
    [0, 1],
    [70, 0],
    clamp
  );

  const rightPanelX = interpolate(
    panelReveal,
    [0, 1],
    [100, 0],
    clamp
  );

  const panelScale = interpolate(
    panelReveal,
    [0, 1],
    [1.18, 1.05],
    clamp
  );

  const panelGlow = interpolate(
    s2,
    [0, 18, 50, 90],
    [0, 0.5, 0.15, 0],
    clamp
  );

  // ====================================================
  // SCENE 3
  // CLEAN EDITORIAL FRAME
  // ====================================================

  const s3 = frame - SCENE_2_END;

  const collageProgress = interpolate(
    s3,
    [0, 35],
    [0, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.back(1.15)),
    }
  );

  const collageScale = interpolate(
    s3,
    [0, 90],
    [1.08, 1],
    clamp
  );

  const collagePan = interpolate(
    s3,
    [0, 90],
    [0, -12],
    clamp
  );

  const mainFrameY = interpolate(
    collageProgress,
    [0, 1],
    [120, 0],
    clamp
  );

  const mainFrameRotate = interpolate(
    collageProgress,
    [0, 1],
    [-4, 0],
    clamp
  );

  const scene3Glow = interpolate(
    s3,
    [0, 30, 70, 90],
    [0, 0.6, 0.2, 0],
    clamp
  );

  // ====================================================
  // SCENE 4
  // CLEAN CINEMATIC HERO
  // ====================================================

  const s4 = frame - SCENE_3_END;

  const heroProgress = interpolate(
    s4,
    [0, 75],
    [0, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  const heroScale = interpolate(
    heroProgress,
    [0, 1],
    [1.13, 1.025],
    clamp
  );

  const heroX = interpolate(
    heroProgress,
    [0, 1],
    [18, -8],
    clamp
  );

  const heroY = interpolate(
    heroProgress,
    [0, 1],
    [8, -5],
    clamp
  );

  // ====================================================
  // SCENE 5
  // WHITE FLASH
  // ====================================================

  const transitionProgress = interpolate(
    frame,
    [SCENE_4_END, SCENE_4_END + 18],
    [0, 1],
    clamp
  );

  const flashOpacity = interpolate(
    transitionProgress,
    [0, 0.45, 0.7, 1],
    [0, 0.82, 0.3, 0],
    clamp
  );

  const flashBlur = interpolate(
    transitionProgress,
    [0, 0.5, 1],
    [0, 7, 0],
    clamp
  );

  // ====================================================
  // SCENE 6
  // FINAL CINEMATIC HERO
  // ====================================================

  const finalProgress = interpolate(
    frame,
    [SCENE_5_END, DURATION_IN_FRAMES],
    [0, 1],
    clamp
  );

  const finalScale = interpolate(
    finalProgress,
    [0, 1],
    [1.08, 1.015],
    clamp
  );

  const finalX = interpolate(
    finalProgress,
    [0, 1],
    [4, -10],
    clamp
  );

  const finalY = interpolate(
    finalProgress,
    [0, 1],
    [10, -5],
    clamp
  );

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >

      {/* ==================================================
          SCENE 1
          PREMIUM THREE STRIP INTRO
      ================================================== */}

      {scene1 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#000",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "10px 0",
          }}
        >

          {/* TOP STRIP */}

          <div
            style={{
              width: "100%",
              height: "31%",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Img
              src={img}
              style={imageStyle(
                scene1Scale,
                0,
                scene1Y,
                `blur(${blurAmount}px) brightness(.62)`,
                "35% center"
              )}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,.2), transparent, rgba(0,0,0,.35))",
              }}
            />
          </div>

          {/* CENTER STRIP */}

          <div
            style={{
              width: "100%",
              height: "34%",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Img
              src={img}
              style={imageStyle(
                scene1Scale + 0.03,
                0,
                scene1Y * -1,
                `blur(${Math.max(
                  0,
                  blurAmount - 2
                )}px) brightness(.82)`,
                "center center"
              )}
            />

            {/* CENTER SOFT GLOW */}

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,.15), transparent 58%)",
              }}
            />

            {/* HEART */}

            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                opacity: interpolate(
                  frame,
                  [25, 45, 75],
                  [0, 1, 0],
                  clamp
                ),

                transform: `scale(${interpolate(
                  frame,
                  [25, 45, 65],
                  [0.5, 1.15, 1],
                  clamp
                )})`,
              }}
            >
              <span
                style={{
                  fontSize: 58,
                  color: "#fff",

                  filter:
                    "drop-shadow(0 5px 18px rgba(0,0,0,.8)) drop-shadow(0 0 18px rgba(255,255,255,.35))",
                }}
              >
                ♥
              </span>
            </div>
          </div>

          {/* BOTTOM STRIP */}

          <div
            style={{
              width: "100%",
              height: "31%",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Img
              src={img}
              style={imageStyle(
                scene1Scale,
                0,
                scene1Y * 0.5,
                `blur(${blurAmount}px) brightness(.58)`,
                "65% center"
              )}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,.4), transparent)",
              }}
            />
          </div>

          {/* INTRO LIGHT */}

          <AbsoluteFill
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,.18), transparent 60%)",

              opacity: interpolate(
                frame,
                [70, 95, 105],
                [0, 0.4, 0],
                clamp
              ),

              pointerEvents: "none",
            }}
          />
        </AbsoluteFill>
      )}

      {/* ==================================================
          SCENE 2
          THREE PANEL PREMIUM REVEAL
      ================================================== */}

      {scene2 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#080808",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >

          {/* LEFT PANEL */}

          <div
            style={{
              flex: 1,
              overflow: "hidden",
              position: "relative",
              transform:
                `translateX(${leftPanelX}px)`,
            }}
          >
            <Img
              src={img}
              style={imageStyle(
                panelScale,
                0,
                0,
                "brightness(.82)",
                "28% center"
              )}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, transparent, rgba(0,0,0,.4))",
              }}
            />
          </div>

          {/* CENTER PANEL */}

          <div
            style={{
              flex: 1.15,
              overflow: "hidden",
              position: "relative",
              transform:
                `translateY(${centerPanelY}px)`,
            }}
          >
            <Img
              src={img}
              style={imageStyle(
                panelScale + 0.02,
                0,
                0,
                "brightness(1)",
                "center center"
              )}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,.05), rgba(0,0,0,.3))",
              }}
            />
          </div>

          {/* RIGHT PANEL */}

          <div
            style={{
              flex: 1,
              overflow: "hidden",
              position: "relative",
              transform:
                `translateX(${rightPanelX}px)`,
            }}
          >
            <Img
              src={img}
              style={imageStyle(
                panelScale,
                0,
                0,
                "brightness(.72)",
                "72% center"
              )}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, transparent, rgba(0,0,0,.4))",
              }}
            />
          </div>

          {/* CENTER LIGHT LINE */}

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              height: 1,
              backgroundColor:
                "rgba(255,255,255,.22)",
              opacity: panelGlow,
            }}
          />
        </AbsoluteFill>
      )}

      {/* ==================================================
          SCENE 3
          CLEAN EDITORIAL FRAME
      ================================================== */}

      {scene3 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#111",
            overflow: "hidden",
          }}
        >

          {/* BACKGROUND IMAGE */}

          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
            }}
          >
            <Img
              src={img}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",

                transform: `
                  scale(${collageScale})
                  translateX(${collagePan}px)
                `,

                filter:
                  "brightness(.36) saturate(.8) blur(1px)",
              }}
            />
          </div>

          {/* DARK CINEMATIC OVERLAY */}

          <AbsoluteFill
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,.65), rgba(0,0,0,.18), rgba(0,0,0,.72))",
            }}
          />

          {/* MAIN WHITE FRAME */}

          <div
            style={{
              position: "absolute",

              width: "70%",
              height: "72%",

              left: "15%",
              top: "13%",

              backgroundColor: "#fff",

              padding: 7,

              boxShadow:
                "0 25px 70px rgba(0,0,0,.7)",

              transform: `
                translateY(${mainFrameY}px)
                rotate(${mainFrameRotate}deg)
              `,
            }}
          >
            <Img
              src={img}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 35%",
              }}
            />
          </div>

          {/* FRAME SHINE */}

          <div
            style={{
              position: "absolute",
              left: "15%",
              top: "13%",
              width: "70%",
              height: "72%",

              background:
                "linear-gradient(120deg, transparent 35%, rgba(255,255,255,.2) 50%, transparent 65%)",

              transform: `translateX(${interpolate(
                s3,
                [25, 90],
                [-100, 100],
                clamp
              )}%)`,

              opacity: interpolate(
                s3,
                [20, 40, 75],
                [0, 0.5, 0],
                clamp
              ),

              pointerEvents: "none",
            }}
          />

          {/* TOP DECORATION */}

          <div
            style={{
              position: "absolute",
              top: 45,
              left: 42,

              width: 35,
              height: 1,

              backgroundColor:
                "rgba(255,255,255,.75)",

              opacity: interpolate(
                s3,
                [0, 20, 45],
                [0, 1, 0.8],
                clamp
              ),
            }}
          />

          {/* SMALL DOT */}

          <div
            style={{
              position: "absolute",

              width: 6,
              height: 6,

              borderRadius: "50%",

              backgroundColor: "#fff",

              right: 42,
              bottom: 55,

              opacity: interpolate(
                s3,
                [0, 25, 50],
                [0, 1, 0.6],
                clamp
              ),

              boxShadow:
                "0 0 18px rgba(255,255,255,.8)",
            }}
          />

          {/* SMALL GLOW */}

          <div
            style={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",

              left: -100,
              bottom: -100,

              background:
                "radial-gradient(circle, rgba(255,255,255,.12), transparent 70%)",

              filter: "blur(25px)",

              opacity: scene3Glow,
            }}
          />
        </AbsoluteFill>
      )}

      {/* ==================================================
          SCENE 4
          CLEAN CINEMATIC HERO
      ================================================== */}

      {scene4 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#111",
            overflow: "hidden",
          }}
        >

          {/* HERO IMAGE */}

          <Img
            src={img}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",
              objectPosition: "center",

              transform: `
                translate(${heroX}px, ${heroY}px)
                scale(${heroScale})
              `,

              filter:
                "brightness(.74) saturate(.88)",
            }}
          />

          {/* CINEMATIC VIGNETTE */}

          <AbsoluteFill
            style={{
              background:
                "radial-gradient(circle, transparent 25%, rgba(0,0,0,.68) 100%)",
            }}
          />

          {/* BOTTOM GRADIENT */}

          <AbsoluteFill
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,.02) 35%, rgba(0,0,0,.72) 100%)",
            }}
          />

          {/* SOFT LIGHT */}

          <div
            style={{
              position: "absolute",

              width: 320,
              height: 320,

              borderRadius: "50%",

              right: -120,
              top: 30,

              background:
                "radial-gradient(circle, rgba(255,255,255,.16), transparent 70%)",

              filter: "blur(25px)",

              opacity: interpolate(
                s4,
                [0, 30, 75],
                [0, 0.7, 0.25],
                clamp
              ),
            }}
          />

          {/* SUBTLE WHITE EDGE */}

          <div
            style={{
              position: "absolute",
              left: 28,
              right: 28,
              top: 28,
              bottom: 28,

              border:
                "1px solid rgba(255,255,255,.16)",

              opacity: interpolate(
                s4,
                [0, 30, 70],
                [0, 1, 0.45],
                clamp
              ),
            }}
          />

          {/* CORNER LIGHT */}

          <div
            style={{
              position: "absolute",
              top: 28,
              left: 28,
              width: 55,
              height: 55,

              borderTop:
                "2px solid rgba(255,255,255,.45)",

              borderLeft:
                "2px solid rgba(255,255,255,.45)",

              opacity: interpolate(
                s4,
                [0, 30, 70],
                [0, 1, 0.5],
                clamp
              ),
            }}
          />
        </AbsoluteFill>
      )}

      {/* ==================================================
          SCENE 5
          CINEMATIC FLASH
      ================================================== */}

      {scene5 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#fff",

            opacity: flashOpacity,

            filter:
              `blur(${flashBlur}px)`,

            zIndex: 50,
          }}
        />
      )}

      {/* ==================================================
          SCENE 6
          FINAL CINEMATIC HERO
      ================================================== */}

      {scene6 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#000",
            overflow: "hidden",
          }}
        >

          {/* FINAL IMAGE */}

          <Img
            src={img}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",
              objectPosition: "center",

              transform: `
                translate(${finalX}px, ${finalY}px)
                scale(${finalScale})
              `,

              filter:
                "brightness(.78) saturate(.9)",
            }}
          />

          {/* VIGNETTE */}

          <AbsoluteFill
            style={{
              background:
                "radial-gradient(circle at center, transparent 20%, rgba(0,0,0,.72) 100%)",
            }}
          />

          {/* BOTTOM GRADIENT */}

          <AbsoluteFill
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,.02) 40%, rgba(0,0,0,.72) 100%)",
            }}
          />

          {/* FILM GLOW */}

          <AbsoluteFill
            style={{
              background:
                "radial-gradient(circle at 50% 35%, rgba(255,255,255,.08), transparent 45%)",

              opacity: interpolate(
                finalProgress,
                [0, 0.4, 1],
                [0, 0.8, 0.3],
                clamp
              ),
            }}
          />

          {/* FINAL BORDER */}

          <div
            style={{
              position: "absolute",

              left: 25,
              right: 25,
              top: 25,
              bottom: 25,

              border:
                "1px solid rgba(255,255,255,.16)",
            }}
          />

          {/* MOVING BORDER SHINE */}

          <div
            style={{
              position: "absolute",

              left: 25,
              top: 25,

              width: "30%",
              height: 1,

              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,.65), transparent)",

              transform: `translateX(${interpolate(
                finalProgress,
                [0, 1],
                [0, 230],
                clamp
              )}%)`,

              opacity: interpolate(
                finalProgress,
                [0, 0.25, 0.7, 1],
                [0, 0.8, 0.35, 0],
                clamp
              ),
            }}
          />
        </AbsoluteFill>
      )}

      {/* ==================================================
          WATERMARK
      ================================================== */}

      {scene6 && (
        <div
          style={{
            position: "absolute",

            bottom: 25,

            width: "100%",

            zIndex: 110,

            textAlign: "center",

            opacity: interpolate(
              frame,
              [SCENE_5_END + 20, DURATION_IN_FRAMES],
              [0, 0.7],
              clamp
            ),
          }}
        >
          <span
            style={{
              color:
                "rgba(255,255,255,.72)",

              fontSize: 9,

              fontFamily:
                "Arial, sans-serif",

              letterSpacing: "3px",

              textShadow:
                "0 2px 8px rgba(0,0,0,.9)",
            }}
          >
            INSTAGRAM • PRADIP_PICTURES
          </span>
        </div>
      )}

      {/* ==================================================
          MUSIC
      ================================================== */}

      {musicSrc && (
        <MusicPlayer
          src={musicSrc}
          volume={music?.volume ?? 1}
        />
      )}
    </AbsoluteFill>
  );
};

export default GridSplitReel;