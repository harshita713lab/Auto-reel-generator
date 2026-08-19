import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
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
// LYRICS
// ======================================================

const LYRICS_TIMINGS = [
  { start: 118, end: 153, text: "CHULIYA", type: "bold" },
  { start: 153, end: 188, text: "TUNE", type: "bold" },
  { start: 188, end: 223, text: "LAFZON", type: "bold" },
  { start: 223, end: 258, text: "KO", type: "bold" },
  { start: 292, end: 350, text: "Mannate", type: "cursive" },
  { start: 350, end: 410, text: "Puri", type: "cursive" },
  { start: 410, end: 480, text: "Tumse Hee", type: "cursive" },
];

// ======================================================
// HELPERS
// ======================================================

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const imageStyle = (
  scale: number,
  x: number,
  y: number,
  filter = "none"
): React.CSSProperties => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
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
  const { fps } = useVideoConfig();

  const safeImages = images.length > 0 ? images : DEFAULT_IMAGES;
  const img =
    safeImages[0]?.url ||
    safeImages[0]?.path ||
    DEFAULT_IMAGES[0].path;

  const musicSrc = typeof music === "string" ? music : music?.path;

  // ====================================================
  // SCENE TIMINGS
  // ====================================================

  const SCENE_1_END = 105;
  const SCENE_2_END = 195;
  const SCENE_3_END = 255;
  const SCENE_4_END = 315;
  const SCENE_5_END = 345;

  const scene1 = frame < SCENE_1_END;
  const scene2 = frame >= SCENE_1_END && frame < SCENE_2_END;
  const scene3 = frame >= SCENE_2_END && frame < SCENE_3_END;
  const scene4 = frame >= SCENE_3_END && frame < SCENE_4_END;
  const scene5 = frame >= SCENE_4_END && frame < SCENE_5_END;
  const scene6 = frame >= SCENE_5_END;

  // ====================================================
  // SCENE 1 ANIMATIONS
  // ====================================================

  const scene1Progress = interpolate(frame, [0, SCENE_1_END], [0, 1], clamp);
  const blurAmount = interpolate(scene1Progress, [0, 0.55, 1], [10, 8, 0], clamp);
  const scene1Scale = interpolate(scene1Progress, [0, 1], [1.15, 1.03], clamp);
  const scene1Y = interpolate(scene1Progress, [0, 1], [15, -10], clamp);

  // ====================================================
  // SCENE 2 ANIMATIONS (3 Vertical Panels)
  // ====================================================

  const scene2Progress = interpolate(
    frame,
    [SCENE_1_END, SCENE_1_END + 18],
    [0, 1],
    clamp
  );

  const panelScale = interpolate(scene2Progress, [0, 1], [1.12, 1.02], clamp);
  const leftX = interpolate(scene2Progress, [0, 1], [40, 0], clamp);
  const centerY = interpolate(scene2Progress, [0, 1], [-25, 0], clamp);
  const rightX = interpolate(scene2Progress, [0, 1], [-40, 0], clamp);

  // ====================================================
  // SCENE 3 ANIMATIONS
  // ====================================================

  const scene3Start = SCENE_2_END;
  const gridProgress = interpolate(
    frame,
    [scene3Start, scene3Start + 20],
    [0, 1],
    clamp
  );

  const floatingSpring = spring({
    frame: Math.max(0, frame - scene3Start),
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.7 },
  });

  const floatingScale = interpolate(floatingSpring, [0, 1], [0.2, 1], clamp);
  const floatingRotate = interpolate(floatingSpring, [0, 1], [-12, 0], clamp);
  const gridScale = interpolate(gridProgress, [0, 1], [1.12, 1], clamp);

  // ====================================================
  // SCENE 4 ANIMATIONS
  // ====================================================

  const scene4Start = SCENE_3_END;
  const heroProgress = interpolate(
    frame,
    [scene4Start, scene4Start + 20],
    [0, 1],
    clamp
  );
  const heroScale = interpolate(heroProgress, [0, 1], [1.08, 1], clamp);

  const card1Spring = spring({
    frame: Math.max(0, frame - scene4Start),
    fps,
    config: { damping: 13, stiffness: 110 },
  });

  const card2Spring = spring({
    frame: Math.max(0, frame - scene4Start - 8),
    fps,
    config: { damping: 13, stiffness: 110 },
  });

  const card3Spring = spring({
    frame: Math.max(0, frame - scene4Start - 16),
    fps,
    config: { damping: 13, stiffness: 110 },
  });

  // ====================================================
  // SCENE 5 & 6 ANIMATIONS
  // ====================================================

  const darkProgress = interpolate(frame, [SCENE_4_END, SCENE_5_END], [0, 1], clamp);
  const darkOpacity = interpolate(darkProgress, [0, 0.45, 1], [0, 0.65, 1], clamp);

  const finalProgress = interpolate(frame, [SCENE_5_END, DURATION_IN_FRAMES], [0, 1], clamp);
  const finalScale = interpolate(finalProgress, [0, 1], [1.08, 1.02], clamp);
  const finalX = interpolate(finalProgress, [0, 1], [0, -8], clamp);
  const finalY = interpolate(finalProgress, [0, 1], [10, -5], clamp);

  // ====================================================
  // LYRICS
  // ====================================================

  const currentLyric = LYRICS_TIMINGS.find(
    (item) => frame >= item.start && frame < item.end
  );

  let lyricProgress = 0;
  if (currentLyric) {
    lyricProgress = interpolate(
      frame,
      [
        currentLyric.start,
        currentLyric.start + 8,
        currentLyric.end - 8,
        currentLyric.end,
      ],
      [0, 1, 1, 0],
      clamp
    );
  }

  const lyricScale = interpolate(lyricProgress, [0, 1], [0.75, 1], clamp);
  const lyricBlur = interpolate(lyricProgress, [0, 0.35, 1], [8, 2, 0], clamp);
  const lyricY = interpolate(lyricProgress, [0, 1], [25, 0], clamp);

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* SCENE 1: HORIZONTAL BLURRED STRIPS */}
      {scene1 && (
        <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "12px 0" }}>
          {/* TOP STRIP */}
          <div style={{ width: "100%", height: "31%", overflow: "hidden", position: "relative" }}>
            <Img
              src={img}
              style={imageStyle(
                scene1Scale,
                0,
                scene1Y,
                `blur(${blurAmount}px) brightness(0.65)`
              )}
            />
          </div>

          {/* MIDDLE STRIP WITH HEART REVEAL */}
          <div style={{ width: "100%", height: "34%", overflow: "hidden", position: "relative" }}>
            <Img
              src={img}
              style={imageStyle(
                scene1Scale + 0.03,
                0,
                scene1Y * -1,
                `blur(${Math.max(0, blurAmount - 2)}px) brightness(0.8)`
              )}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: interpolate(frame, [25, 45, 70], [0, 1, 0.9], clamp),
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
                  filter: "drop-shadow(0 5px 15px rgba(0,0,0,.7))",
                }}
              >
                ♥
              </span>
            </div>
          </div>

          {/* BOTTOM STRIP */}
          <div style={{ width: "100%", height: "31%", overflow: "hidden", position: "relative" }}>
            <Img
              src={img}
              style={imageStyle(
                scene1Scale,
                0,
                scene1Y * 0.5,
                `blur(${blurAmount}px) brightness(0.6)`
              )}
            />
          </div>

          <AbsoluteFill
            style={{
              backgroundColor: "#fff",
              opacity: interpolate(frame, [88, 105], [0.25, 0], clamp),
              mixBlendMode: "screen",
            }}
          />
        </AbsoluteFill>
      )}

      {/* SCENE 2: THREE VERTICAL PANELS */}
      {scene2 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            backgroundColor: "#000",
            padding: "0 2px",
          }}
        >
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <Img
              src={img}
              style={{
                ...imageStyle(panelScale, leftX, 0, "brightness(0.9)"),
                objectPosition: "40% center",
              }}
            />
          </div>
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <Img
              src={img}
              style={{
                ...imageStyle(panelScale + 0.02, 0, centerY, "brightness(1)"),
                objectPosition: "center center",
              }}
            />
          </div>
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <Img
              src={img}
              style={{
                ...imageStyle(panelScale, rightX, 0, "brightness(0.85)"),
                objectPosition: "60% center",
              }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 3: GRID + FLOATING CARD */}
      {scene3 && (
        <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: 4,
              transform: `scale(${gridScale})`,
            }}
          >
            <div style={{ overflow: "hidden" }}>
              <Img src={img} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.08)", objectPosition: "30% center" }} />
            </div>
            <div style={{ overflow: "hidden" }}>
              <Img src={img} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.12)", objectPosition: "70% center" }} />
            </div>
            <div style={{ overflow: "hidden" }}>
              <Img src={img} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.1)", objectPosition: "center 35%" }} />
            </div>
            <div style={{ overflow: "hidden" }}>
              <Img src={img} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.15)", objectPosition: "center 70%" }} />
            </div>
          </div>

          <AbsoluteFill style={{ background: "linear-gradient(135deg, rgba(0,0,0,.1), rgba(0,0,0,.45))" }} />

          {/* FLOATING CARD */}
          <div
            style={{
              position: "absolute",
              width: 125,
              height: 155,
              right: 35,
              top: 85,
              backgroundColor: "#fff",
              padding: 6,
              borderRadius: 3,
              boxShadow: "0 12px 30px rgba(0,0,0,.65)",
              transform: `translateY(${interpolate(floatingSpring, [0, 1], [80, 0], clamp)}px) rotate(${floatingRotate}deg) scale(${floatingScale})`,
            }}
          >
            <Img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <div
            style={{
              position: "absolute",
              width: 80,
              height: 100,
              left: 30,
              bottom: 75,
              border: "3px solid white",
              overflow: "hidden",
              transform: `translateY(${interpolate(floatingSpring, [0, 1], [100, 0], clamp)}px) rotate(-6deg)`,
              opacity: floatingSpring,
            }}
          >
            <Img src={img} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "65% center" }} />
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 4: HERO + FLOATING FRAMES */}
      {scene4 && (
        <AbsoluteFill style={{ backgroundColor: "#111", overflow: "hidden" }}>
          <Img
            src={img}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${heroScale})`,
              filter: "brightness(.78)",
            }}
          />
          <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.05), rgba(0,0,0,.65))" }} />

          <div style={{ position: "absolute", width: 115, height: 145, left: 28, top: 90, padding: 5, backgroundColor: "#fff", boxShadow: "0 12px 35px rgba(0,0,0,.7)", transform: `translateY(${interpolate(card1Spring, [0, 1], [100, 0], clamp)}px) rotate(-7deg)` }}>
            <Img src={img} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "30% center" }} />
          </div>

          <div style={{ position: "absolute", width: 105, height: 135, right: 25, top: 190, padding: 5, backgroundColor: "#fff", boxShadow: "0 12px 35px rgba(0,0,0,.7)", transform: `translateY(${interpolate(card2Spring, [0, 1], [120, 0], clamp)}px) rotate(6deg)` }}>
            <Img src={img} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "70% center" }} />
          </div>

          <div style={{ position: "absolute", width: 85, height: 110, right: 45, bottom: 90, border: "3px solid white", overflow: "hidden", transform: `translateY(${interpolate(card3Spring, [0, 1], [130, 0], clamp)}px) rotate(-4deg)` }}>
            <Img src={img} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 65%" }} />
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 5: DARK TRANSITION */}
      {scene5 && (
        <AbsoluteFill style={{ backgroundColor: "#000", opacity: darkOpacity, zIndex: 20 }} />
      )}

      {/* SCENE 6: FINAL FULLSCREEN */}
      {scene6 && (
        <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
          <Img
            src={img}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `translate(${finalX}px, ${finalY}px) scale(${finalScale})`,
              filter: "brightness(.82)",
            }}
          />
          <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.05), rgba(0,0,0,.55))" }} />
        </AbsoluteFill>
      )}

      {/* LYRICS */}
      {currentLyric && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: currentLyric.type === "cursive" ? "flex-end" : "center",
            paddingBottom: currentLyric.type === "cursive" ? 150 : 0,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontFamily: currentLyric.type === "bold" ? "Arial Black, Impact, sans-serif" : "Georgia, serif",
              fontSize: currentLyric.type === "bold" ? 62 : 54,
              fontWeight: currentLyric.type === "bold" ? 900 : 400,
              fontStyle: currentLyric.type === "cursive" ? "italic" : "normal",
              textTransform: currentLyric.type === "bold" ? "uppercase" : "none",
              letterSpacing: currentLyric.type === "bold" ? "4px" : "1px",
              opacity: lyricProgress,
              transform: `translateY(${lyricY}px) scale(${lyricScale})`,
              filter: `blur(${lyricBlur}px)`,
              textShadow: "0 4px 18px rgba(0,0,0,.95)",
              whiteSpace: "nowrap",
            }}
          >
            {currentLyric.text}
          </span>
        </div>
      )}

      {/* WATERMARK */}
      {scene6 && (
        <div
          style={{
            position: "absolute",
            bottom: 25,
            width: "100%",
            zIndex: 110,
            textAlign: "center",
            opacity: interpolate(frame, [SCENE_5_END + 20, DURATION_IN_FRAMES], [0, 0.75], clamp),
          }}
        >
          <span style={{ color: "rgba(255,255,255,.8)", fontSize: 10, fontFamily: "sans-serif", letterSpacing: "2px", textShadow: "0 2px 8px rgba(0,0,0,.9)" }}>
            INSTAGRAM • PRADIP_PICTURES
          </span>
        </div>
      )}

      {musicSrc && <MusicPlayer src={musicSrc} volume={music?.volume ?? 1} />}
    </AbsoluteFill>
  );
};

export default GridSplitReel;