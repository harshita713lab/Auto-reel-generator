import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { MusicPlayer } from "../../components";

// ======================================================
// TYPES
// ======================================================

export type Template48Image = {
  path: string;
};

export type Template48Props = {
  images?: Template48Image[];
  music?: Music;
};

interface Music {
  path: string;
  volume?: number;
}

// ======================================================
// CONFIGURATION & CONSTANTS (FAST 18 SECONDS DURATION)
// ======================================================

export const FPS = 30;
export const SCENE_DURATION = 45; // Fast 1.5 seconds per scene
export const TOTAL_SCENES = 12;
export const DURATION_IN_FRAMES = SCENE_DURATION * TOTAL_SCENES; // 540 frames = 18 seconds
export const IMAGE_COUNT = 12;

export const DEFAULT_PROPS: Template48Props = {
  images: [
    { path: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop" },
    { path: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop" },
    { path: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1000&auto=format&fit=crop" },
    { path: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1000&auto=format&fit=crop" },
    { path: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000&auto=format&fit=crop" },
    { path: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1000&auto=format&fit=crop" },
    { path: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1000&auto=format&fit=crop" },
    { path: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop" },
    { path: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop" },
    { path: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop" },
    { path: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1000&auto=format&fit=crop" },
    { path: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1000&auto=format&fit=crop" },
  ],
  music: undefined,
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
};

const Photo = ({ src, style }: { src?: string; style?: React.CSSProperties }) => {
  if (!src) {
    return <AbsoluteFill style={{ background: "linear-gradient(135deg, #111, #333, #111)" }} />;
  }
  return <Img src={src} style={{ ...imageStyle, ...style }} />;
};

const getImgSrc = (images: Template48Image[] | undefined, index: number): string => {
  if (!images || images.length === 0) return DEFAULT_PROPS.images![0].path;
  const safeIdx = Math.abs(index) % images.length;
  const img = images[safeIdx];
  if (img?.path) return img.path;
  return DEFAULT_PROPS.images![safeIdx % DEFAULT_PROPS.images!.length]?.path || "";
};

// ======================================================
// 🔲 PATTI EFFECT: BLIND SLATS / STRIP WIPE
// ======================================================

const StripSlatsWipeScene: React.FC<{
  src: string;
  frame: number;
  direction?: "vertical" | "horizontal";
}> = ({ src, frame, direction = "vertical" }) => {
  const numStrips = 9;

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080D" }}>
      <Photo src={src} style={{ transform: "scale(1.06)" }} />

      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {Array.from({ length: numStrips }).map((_, i) => {
          const stripSize = 100 / numStrips;
          const stripDelay = i * 2;
          const stripProgress = interpolate(
            Math.max(0, frame - stripDelay),
            [0, 18],
            [0, 100],
            { ...clamp, easing: Easing.out(Easing.cubic) }
          );

          if (direction === "vertical") {
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${i * stripSize}%`,
                  top: 0,
                  width: `${stripSize + 0.5}%`,
                  height: `${100 - stripProgress}%`,
                  backgroundColor: "#06080D",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                }}
              />
            );
          } else {
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: `${i * stripSize}%`,
                  left: 0,
                  height: `${stripSize + 0.5}%`,
                  width: `${100 - stripProgress}%`,
                  backgroundColor: "#06080D",
                  boxShadow: "4px 0 15px rgba(0,0,0,0.5)",
                }}
              />
            );
          }
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ======================================================
// 🔴 HALFTONE DOT MATRIX TO IMAGE REVEAL ("Dot Dot Se Image Ban Jaye")
// ======================================================

const HalftoneDotRevealScene: React.FC<{
  src: string;
  frame: number;
}> = ({ src, frame }) => {
  // Dot matrix grid settings
  const rows = 8;
  const cols = 6;
  const dots = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({ r, c, id: `${r}-${c}` });
    }
  }

  // Dots expand and merge into the image from 0 to 22 frames
  const dotScale = interpolate(frame, [0, 22], [0.2, 3.2], { ...clamp, easing: Easing.out(Easing.cubic) });
  const imageOpacity = interpolate(frame, [10, 25], [0, 1], clamp);
  const dotGridOpacity = interpolate(frame, [18, 28], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#040508", overflow: "hidden" }}>
      {/* Target Sharp Image */}
      <Photo src={src} style={{ opacity: imageOpacity, transform: "scale(1.05)" }} />

      {/* Luminous Dot Grid Array Overlay */}
      {dotGridOpacity > 0 && (
        <AbsoluteFill style={{ opacity: dotGridOpacity, pointerEvents: "none" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              width: "100%",
              height: "100%",
            }}
          >
            {dots.map((d) => {
              const delay = (d.r + d.c) * 1.2;
              const localDotScale = interpolate(
                Math.max(0, frame - delay),
                [0, 18],
                [0.15, 3.0],
                { ...clamp, easing: Easing.out(Easing.cubic) }
              );

              return (
                <div
                  key={d.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255, 230, 160, 0.95)",
                      boxShadow: "0 0 15px rgba(255, 220, 140, 1)",
                      transform: `scale(${localDotScale})`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ======================================================
// 🎞️ 1. HORIZONTAL MOVING COLLAGE (EK-EK KARKE PHOTOS AAYE)
// ======================================================

const HorizontalCollageScene: React.FC<{
  img1: string;
  img2: string;
  img3: string;
  frame: number;
}> = ({ img1, img2, img3, frame }) => {
  // Staggered slide in delays for each photo bar
  const bar1X = interpolate(frame, [0, 14], [-600, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bar2X = interpolate(Math.max(0, frame - 6), [0, 14], [600, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bar3X = interpolate(Math.max(0, frame - 12), [0, 14], [-600, 0], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080D", display: "flex", flexDirection: "column", padding: 20, gap: 15 }}>
      {/* Horizontal Bar 1 */}
      <div
        style={{
          flex: 1,
          borderRadius: 16,
          overflow: "hidden",
          border: "3px solid rgba(255,255,255,0.85)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
          transform: `translateX(${bar1X}px)`,
        }}
      >
        <Photo src={img1} />
      </div>

      {/* Horizontal Bar 2 */}
      <div
        style={{
          flex: 1,
          borderRadius: 16,
          overflow: "hidden",
          border: "3px solid rgba(255,255,255,0.85)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
          transform: `translateX(${bar2X}px)`,
        }}
      >
        <Photo src={img2} />
      </div>

      {/* Horizontal Bar 3 */}
      <div
        style={{
          flex: 1,
          borderRadius: 16,
          overflow: "hidden",
          border: "3px solid rgba(255,255,255,0.85)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
          transform: `translateX(${bar3X}px)`,
        }}
      >
        <Photo src={img3} />
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// 📊 2. VERTICAL MOVING COLLAGE (EK-EK KARKE TOP-DOWN AAYE)
// ======================================================

const VerticalCollageScene: React.FC<{
  img1: string;
  img2: string;
  img3: string;
  frame: number;
}> = ({ img1, img2, img3, frame }) => {
  // Staggered top-down drop delays for each column
  const col1Y = interpolate(frame, [0, 14], [-700, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const col2Y = interpolate(Math.max(0, frame - 6), [0, 14], [700, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const col3Y = interpolate(Math.max(0, frame - 12), [0, 14], [-700, 0], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080D", display: "flex", flexDirection: "row", padding: 20, gap: 15 }}>
      {/* Column 1 */}
      <div
        style={{
          flex: 1,
          borderRadius: 16,
          overflow: "hidden",
          border: "3px solid rgba(255,255,255,0.85)",
          boxShadow: "0 15px 35px rgba(0,0,0,0.8)",
          transform: `translateY(${col1Y}px)`,
        }}
      >
        <Photo src={img1} />
      </div>

      {/* Column 2 */}
      <div
        style={{
          flex: 1,
          borderRadius: 16,
          overflow: "hidden",
          border: "3px solid rgba(255,255,255,0.9)",
          boxShadow: "0 15px 35px rgba(0,0,0,0.8)",
          transform: `translateY(${col2Y}px)`,
        }}
      >
        <Photo src={img2} />
      </div>

      {/* Column 3 */}
      <div
        style={{
          flex: 1,
          borderRadius: 16,
          overflow: "hidden",
          border: "3px solid rgba(255,255,255,0.85)",
          boxShadow: "0 15px 35px rgba(0,0,0,0.8)",
          transform: `translateY(${col3Y}px)`,
        }}
      >
        <Photo src={img3} />
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// 🧱 3. 2x2 GRID MASONRY COLLAGE (EK-EK KARKE POP IN AAYE)
// ======================================================

const GridMasonryCollageScene: React.FC<{
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  frame: number;
}> = ({ img1, img2, img3, img4, frame }) => {
  // Staggered pop-in scale for each grid quadrant
  const pop1 = interpolate(frame, [0, 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pop2 = interpolate(Math.max(0, frame - 5), [0, 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pop3 = interpolate(Math.max(0, frame - 10), [0, 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pop4 = interpolate(Math.max(0, frame - 15), [0, 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#06080D",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        padding: 20,
        gap: 15,
      }}
    >
      <div style={{ borderRadius: 16, overflow: "hidden", border: "3px solid #FFF", transform: `scale(${pop1})` }}>
        <Photo src={img1} />
      </div>
      <div style={{ borderRadius: 16, overflow: "hidden", border: "3px solid #FFF", transform: `scale(${pop2})` }}>
        <Photo src={img2} />
      </div>
      <div style={{ borderRadius: 16, overflow: "hidden", border: "3px solid #FFF", transform: `scale(${pop3})` }}>
        <Photo src={img3} />
      </div>
      <div style={{ borderRadius: 16, overflow: "hidden", border: "3px solid #FFF", transform: `scale(${pop4})` }}>
        <Photo src={img4} />
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// ⚡ FAST FLASH OVERLAY
// ======================================================

const FastFlash = ({ frame }: { frame: number }) => {
  const opacity = interpolate(frame, [0, 4, 10], [0.9, 0.3, 0], clamp);
  return <AbsoluteFill style={{ background: "#FFFFFF", opacity, pointerEvents: "none", zIndex: 25 }} />;
};

// ======================================================
// 🎬 12 FAST SCENES (1.5s PER SCENE = 18s TOTAL)
// ======================================================

const FrameScene = ({ scene, images }: { scene: number; images?: Template48Image[] }) => {
  const frame = useCurrentFrame();

  const img0 = getImgSrc(images, 0);
  const img1 = getImgSrc(images, 1);
  const img2 = getImgSrc(images, 2);
  const img3 = getImgSrc(images, 3);
  const img4 = getImgSrc(images, 4);
  const img5 = getImgSrc(images, 5);
  const img6 = getImgSrc(images, 6);
  const img7 = getImgSrc(images, 7);
  const img8 = getImgSrc(images, 8);
  const img9 = getImgSrc(images, 9);
  const img10 = getImgSrc(images, 10);
  const img11 = getImgSrc(images, 11);

  switch (scene) {
    // SCENE 1: Fast Zoom In
    case 1: {
      const scale = interpolate(frame, [0, SCENE_DURATION], [1.0, 1.15], clamp);
      return (
        <AbsoluteFill>
          <Photo src={img0} style={{ transform: `scale(${scale})` }} />
          <FastFlash frame={frame} />
        </AbsoluteFill>
      );
    }

    // SCENE 2: Vertical Strip Slats Wipe (PATTI EFFECT)
    case 2:
      return <StripSlatsWipeScene src={img1} frame={frame} direction="vertical" />;

    // SCENE 3: Horizontal Moving Collage (EK-EK KARKE PHOTOS AAYE)
    case 3:
      return <HorizontalCollageScene img1={img2} img2={img3} img3={img4} frame={frame} />;

    // SCENE 4: HALFTONE DOT MATRIX TO IMAGE REVEAL ("Dot Dot Se Image Ban Jaye")
    case 4:
      return <HalftoneDotRevealScene src={img3} frame={frame} />;

    // SCENE 5: Horizontal Strip Slats Wipe (PATTI EFFECT)
    case 5:
      return <StripSlatsWipeScene src={img4} frame={frame} direction="horizontal" />;

    // SCENE 6: Vertical Moving Collage (EK-EK KARKE TOP-DOWN AAYE)
    case 6:
      return <VerticalCollageScene img1={img5} img2={img6} img3={img7} frame={frame} />;

    // SCENE 7: Fast Whip Pan + Blur
    case 7: {
      const x = interpolate(frame, [0, 14, SCENE_DURATION], [-600, 0, 25], { ...clamp, easing: Easing.out(Easing.cubic) });
      const blur = interpolate(frame, [0, 10], [18, 0], clamp);
      return (
        <AbsoluteFill>
          <Photo src={img6} style={{ transform: `translateX(${x}px) scale(1.08)`, filter: `blur(${blur}px)` }} />
          <FastFlash frame={frame} />
        </AbsoluteFill>
      );
    }

    // SCENE 8: Vertical Strip Slats Wipe 2 (PATTI EFFECT)
    case 8:
      return <StripSlatsWipeScene src={img7} frame={frame} direction="vertical" />;

    // SCENE 9: 2x2 Grid Masonry Collage (EK-EK KARKE POP IN AAYE)
    case 9:
      return <GridMasonryCollageScene img1={img8} img2={img9} img3={img10} img4={img11} frame={frame} />;

    // SCENE 10: HALFTONE DOT MATRIX REVEAL 2 ("Dot Dot Se Image Ban Jaye")
    case 10:
      return <HalftoneDotRevealScene src={img9} frame={frame} />;

    // SCENE 11: Horizontal Strip Slats Wipe 2 (PATTI EFFECT)
    case 11:
      return <StripSlatsWipeScene src={img10} frame={frame} direction="horizontal" />;

    // SCENE 12: Fast Closing Hero
    case 12: {
      const scale = interpolate(frame, [0, SCENE_DURATION], [1.14, 1.0], clamp);
      return (
        <AbsoluteFill>
          <Photo src={img11} style={{ transform: `scale(${scale})` }} />
          <FastFlash frame={frame} />
        </AbsoluteFill>
      );
    }

    default:
      return null;
  }
};

// ======================================================
// 🎬 MAIN TEMPLATE 48 COMPONENT
// ======================================================

export const Template48: React.FC<Template48Props> = ({ images = [], music }) => {
  const musicSrc = typeof music === "string" ? music : music?.path;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {Array.from({ length: TOTAL_SCENES }).map((_, idx) => (
        <Sequence key={idx} from={idx * SCENE_DURATION} durationInFrames={SCENE_DURATION}>
          <FrameScene scene={idx + 1} images={images} />
        </Sequence>
      ))}

      {/* Audio Player */}
      {musicSrc && <MusicPlayer src={musicSrc} volume={music?.volume ?? 1} showVisualizer={true} />}
    </AbsoluteFill>
  );
};

export default Template48;