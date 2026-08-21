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

export type Template47Image = {
  path: string;
};

export type Template47Props = {
  images?: Template47Image[];
  music?: Music;
};

interface Music {
  path: string;
  volume?: number;
}

// ======================================================
// CONFIGURATION & CONSTANTS (EXACTLY 14.7 SECONDS FOR 17 PHOTOS)
// ======================================================

export const FPS = 30;
export const SCENE_DURATION = 26; // 0.86 seconds (26 frames) per scene
export const TOTAL_SCENES = 17;
export const DURATION_IN_FRAMES = SCENE_DURATION * TOTAL_SCENES; // 442 frames = 14.7 seconds!
export const IMAGE_COUNT = 17;

export const DEFAULT_PROPS: Template47Props = {
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
    { path: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000&auto=format&fit=crop" },
    { path: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1000&auto=format&fit=crop" },
    { path: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1000&auto=format&fit=crop" },
    { path: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop" },
    { path: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop" },
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

const getImgSrc = (images: Template47Image[] | undefined, index: number): string => {
  if (!images || images.length === 0) return DEFAULT_PROPS.images![0].path;
  const safeIdx = Math.abs(index) % images.length;
  const img = images[safeIdx];
  if (img?.path) return img.path;
  return DEFAULT_PROPS.images![safeIdx % DEFAULT_PROPS.images!.length]?.path || "";
};

// ======================================================
// ⚡ FAST FLASH OVERLAY
// ======================================================

const FastFlash = ({ frame }: { frame: number }) => {
  const opacity = interpolate(frame, [0, 4, 10], [0.9, 0.3, 0], clamp);
  return <AbsoluteFill style={{ background: "#FFFFFF", opacity, pointerEvents: "none", zIndex: 35 }} />;
};

const Vignette = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      zIndex: 20,
      background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.75) 100%)",
    }}
  />
);

// ======================================================
// 🔺 1. ROTATING TRIANGLE REVEAL ("Triangle Me Photos Rotate Krte Huye Change Ho")
// ======================================================

const RotatingTriangleScene: React.FC<{
  src: string;
  frame: number;
}> = ({ src, frame }) => {
  // Phase 1 (0-12): Rotate 360deg inside triangle
  const rotateProgress = interpolate(frame, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const rotation = interpolate(rotateProgress, [0, 1], [-360, 0], clamp);
  const initialScale = interpolate(rotateProgress, [0, 1], [0.2, 0.95], clamp);

  // Phase 2 (10-24): Triangle boundaries open up completely to full screen
  const expandProgress = interpolate(frame, [10, 24], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const topY = interpolate(expandProgress, [0, 1], [25, 0], clamp);
  const bottomY = interpolate(expandProgress, [0, 1], [75, 100], clamp);
  const leftX = interpolate(expandProgress, [0, 1], [25, 0], clamp);
  const rightX = interpolate(expandProgress, [0, 1], [75, 100], clamp);

  const finalScale = interpolate(expandProgress, [0, 1], [initialScale, 1.05], clamp);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#06080D",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          clipPath: `polygon(${leftX}% ${topY}%, ${rightX}% ${topY}%, ${rightX}% ${bottomY}%, ${leftX}% ${bottomY}%)`,
          transform: `scale(${finalScale}) rotate(${rotation}deg)`,
        }}
      >
        <Photo src={src} />
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ======================================================
// 🌀 2. SPIRAL VORTEX WIPE REVEAL ("Spiral Ki Tarah Alag Image Aaye")
// ======================================================

const SpiralVortexScene: React.FC<{
  src: string;
  frame: number;
}> = ({ src, frame }) => {
  const progress = interpolate(frame, [0, 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  const circleClip = interpolate(progress, [0, 1], [0, 110], clamp);
  const spiralRotation = interpolate(progress, [0, 1], [540, 0], clamp);
  const scale = interpolate(progress, [0, 1], [1.3, 1.0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080D", overflow: "hidden" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          clipPath: `circle(${circleClip}% at 50% 50%)`,
          transform: `scale(${scale}) rotate(${spiralRotation}deg)`,
        }}
      >
        <Photo src={src} />
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ======================================================
// ✂️ 3. MULTI-PIECE IMAGE PARTITION SPLIT ("Image Ke Partition Bnao")
// ======================================================

const ImagePartitionScene: React.FC<{
  prevSrc: string;
  nextSrc: string;
  frame: number;
  mode?: "columns" | "quadrants";
}> = ({ prevSrc, nextSrc, frame, mode = "columns" }) => {
  const splitProgress = interpolate(frame, [0, 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  if (mode === "columns") {
    // 4 Vertical Column Partitions Slicing Apart
    const colShift = interpolate(splitProgress, [0, 1], [0, 650], clamp);

    return (
      <AbsoluteFill style={{ backgroundColor: "#06080D", overflow: "hidden" }}>
        {/* Next Image Underneath */}
        <Photo src={nextSrc} style={{ transform: "scale(1.05)" }} />

        {/* Column 1 (Left) */}
        <div style={{ position: "absolute", left: 0, top: 0, width: "25%", height: "100%", transform: `translateY(${-colShift}px)`, zIndex: 10 }}>
          <Photo src={prevSrc} />
        </div>
        {/* Column 2 */}
        <div style={{ position: "absolute", left: "25%", top: 0, width: "25%", height: "100%", transform: `translateY(${colShift}px)`, zIndex: 10 }}>
          <Photo src={prevSrc} />
        </div>
        {/* Column 3 */}
        <div style={{ position: "absolute", left: "50%", top: 0, width: "25%", height: "100%", transform: `translateY(${-colShift}px)`, zIndex: 10 }}>
          <Photo src={prevSrc} />
        </div>
        {/* Column 4 (Right) */}
        <div style={{ position: "absolute", left: "75%", top: 0, width: "25%", height: "100%", transform: `translateY(${colShift}px)`, zIndex: 10 }}>
          <Photo src={prevSrc} />
        </div>
      </AbsoluteFill>
    );
  } else {
    // 4 Quadrant Tile Partitions Sliding Apart
    const shift = interpolate(splitProgress, [0, 1], [0, 650], clamp);

    return (
      <AbsoluteFill style={{ backgroundColor: "#06080D", overflow: "hidden" }}>
        <Photo src={nextSrc} style={{ transform: "scale(1.05)" }} />

        {/* Top-Left Quadrant */}
        <div style={{ position: "absolute", left: 0, top: 0, width: "50%", height: "50%", transform: `translate(${-shift}px, ${-shift}px)`, zIndex: 10 }}>
          <Photo src={prevSrc} />
        </div>
        {/* Top-Right Quadrant */}
        <div style={{ position: "absolute", right: 0, top: 0, width: "50%", height: "50%", transform: `translate(${shift}px, ${-shift}px)`, zIndex: 10 }}>
          <Photo src={prevSrc} />
        </div>
        {/* Bottom-Left Quadrant */}
        <div style={{ position: "absolute", left: 0, bottom: 0, width: "50%", height: "50%", transform: `translate(${-shift}px, ${shift}px)`, zIndex: 10 }}>
          <Photo src={prevSrc} />
        </div>
        {/* Bottom-Right Quadrant */}
        <div style={{ position: "absolute", right: 0, bottom: 0, width: "50%", height: "50%", transform: `translate(${shift}px, ${shift}px)`, zIndex: 10 }}>
          <Photo src={prevSrc} />
        </div>
      </AbsoluteFill>
    );
  }
};

// ======================================================
// 🍃 4. TROPICAL LEAF SHAPE MASK REVEAL ("Kisi Leaves Me Image Show Ho")
// ======================================================

const LeafShapeMaskScene: React.FC<{
  src: string;
  frame: number;
}> = ({ src, frame }) => {
  const leafProgress = interpolate(frame, [0, 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  const scale = interpolate(leafProgress, [0, 1], [0.2, 1.0], clamp);
  const clipPercent = interpolate(leafProgress, [0, 1], [0, 100], clamp);
  const rotate = interpolate(leafProgress, [0, 1], [-25, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#06080D",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Leaf Polygon Outline Mask opening up */}
      <div
        style={{
          width: "100%",
          height: "100%",
          clipPath: `ellipse(${clipPercent}% ${clipPercent * 0.8}% at 50% 50%)`,
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          border: "4px solid rgba(202, 220, 249, 0.8)",
          boxShadow: "0 0 30px rgba(207, 225, 246, 0.6)",
        }}
      >
        <Photo src={src} />
      </div>

      {/* Decorative Floating Green Leaf SVG Outline Overlays */}
      <div style={{ position: "absolute", top: "10%", left: "8%", pointerEvents: "none", zIndex: 25, opacity: 0.85 }}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(140,230,150,0.9)" strokeWidth="1.5">
          <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4C16.4 4 20 7.6 20 12C20 16.4 16.4 20 12 20Z" />
          <path d="M12 4C12 4 16 8 16 12C16 16 12 20 12 20" />
        </svg>
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ======================================================
// 🎬 17 FAST SCENES (0.86s PER SCENE = 14.7s TOTAL)
// ======================================================

const FrameScene = ({ scene, images }: { scene: number; images?: Template47Image[] }) => {
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
  const img12 = getImgSrc(images, 12);
  const img13 = getImgSrc(images, 13);
  const img14 = getImgSrc(images, 14);
  const img15 = getImgSrc(images, 15);
  const img16 = getImgSrc(images, 16);

  switch (scene) {
    // SCENE 1: Fast Zoom In (Photo 0)
    case 1: {
      const scale = interpolate(frame, [0, SCENE_DURATION], [1.0, 1.15], clamp);
      return (
        <AbsoluteFill>
          <Photo src={img0} style={{ transform: `scale(${scale})` }} />
          <FastFlash frame={frame} />
        </AbsoluteFill>
      );
    }

    // 🔺 SCENE 2: ROTATING TRIANGLE REVEAL (Photo 1)
    case 2:
      return <RotatingTriangleScene src={img1} frame={frame} />;

    // 🌀 SCENE 3: SPIRAL VORTEX WIPE REVEAL (Photo 2)
    case 3:
      return <SpiralVortexScene src={img2} frame={frame} />;

    // ✂️ SCENE 4: 4-COLUMN VERTICAL IMAGE PARTITION SPLIT (Photo 2 -> Photo 3)
    case 4:
      return <ImagePartitionScene prevSrc={img2} nextSrc={img3} frame={frame} mode="columns" />;

    // 🍃 SCENE 5: TROPICAL LEAF SHAPE MASK REVEAL (Photo 4)
    case 5:
      return <LeafShapeMaskScene src={img4} frame={frame} />;

    // 🔺 SCENE 6: ROTATING TRIANGLE REVEAL 2 (Photo 5)
    case 6:
      return <RotatingTriangleScene src={img5} frame={frame} />;

    // 🌀 SCENE 7: SPIRAL VORTEX WIPE REVEAL 2 (Photo 6)
    case 7:
      return <SpiralVortexScene src={img6} frame={frame} />;

    // ✂️ SCENE 8: 4-QUADRANT DIAGONAL IMAGE PARTITION SPLIT (Photo 6 -> Photo 7)
    case 8:
      return <ImagePartitionScene prevSrc={img6} nextSrc={img7} frame={frame} mode="quadrants" />;

    // 🍃 SCENE 9: TROPICAL LEAF SHAPE MASK REVEAL 2 (Photo 8)
    case 9:
      return <LeafShapeMaskScene src={img8} frame={frame} />;

    // 🔺 SCENE 10: ROTATING TRIANGLE REVEAL 3 (Photo 9)
    case 10:
      return <RotatingTriangleScene src={img9} frame={frame} />;

    // 🌀 SCENE 11: SPIRAL VORTEX WIPE REVEAL 3 (Photo 10)
    case 11:
      return <SpiralVortexScene src={img10} frame={frame} />;

    // ✂️ SCENE 12: 4-COLUMN VERTICAL IMAGE PARTITION SPLIT 2 (Photo 10 -> Photo 11)
    case 12:
      return <ImagePartitionScene prevSrc={img10} nextSrc={img11} frame={frame} mode="columns" />;

    // 🍃 SCENE 13: TROPICAL LEAF SHAPE MASK REVEAL 3 (Photo 12)
    case 13:
      return <LeafShapeMaskScene src={img12} frame={frame} />;

    // 🔺 SCENE 14: ROTATING TRIANGLE REVEAL 4 (Photo 13)
    case 14:
      return <RotatingTriangleScene src={img13} frame={frame} />;

    // 🌀 SCENE 15: SPIRAL VORTEX WIPE REVEAL 4 (Photo 14)
    case 15:
      return <SpiralVortexScene src={img14} frame={frame} />;

    // ✂️ SCENE 16: 4-QUADRANT DIAGONAL IMAGE PARTITION SPLIT 2 (Photo 14 -> Photo 15)
    case 16:
      return <ImagePartitionScene prevSrc={img14} nextSrc={img15} frame={frame} mode="quadrants" />;

    // 🎬 SCENE 17: Grand Fast Closing Hero (Photo 16)
    case 17: {
      const scale = interpolate(frame, [0, SCENE_DURATION], [1.14, 1.0], clamp);
      return (
        <AbsoluteFill>
          <Photo src={img16} style={{ transform: `scale(${scale})` }} />
          <FastFlash frame={frame} />
        </AbsoluteFill>
      );
    }

    default:
      return null;
  }
};

// ======================================================
// 🎬 MAIN TEMPLATE 47 COMPONENT
// ======================================================

export const Template47: React.FC<Template47Props> = ({ images = [], music }) => {
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

export default Template47;