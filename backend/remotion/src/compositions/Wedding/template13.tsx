import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { MusicPlayer } from "../../components";

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
}

interface Template13Props {
  images?: ImageItem[];
  music?: string;
  lyrics?: { text: string; startFrame: number; duration: number }[];
}

// ======================================================
// SETTINGS
// ======================================================

export const FPS = 30;
export const IMAGE_COUNT = 4; // 1 Background + 3 Collage
export const SCENE_DURATION = 250; // 8.33 sec
export const DURATION_IN_FRAMES = SCENE_DURATION;

export const DEFAULT_PROPS = {
  images: [],
  music: undefined,
lyrics: [
  { text: "Jo bhi hai", startFrame: 0, duration: 45 },      // 0.0–1.5 sec
  { text: "Sab mera", startFrame: 45, duration: 75 },       // 1.5–3.0 sec
  { text: "Tere hawale", startFrame: 150, duration: 45 },   // 3.0–4.5 sec
  { text: "Kar diya", startFrame: 195, duration: 45 },     // 4.5–6.0 sec
],
};

// ======================================================
// BACKGROUND HERO (Unchanged)
// ======================================================

const BackgroundHero = ({ image }: { image?: ImageItem }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, SCENE_DURATION], [1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (!image?.path) return <AbsoluteFill style={{ background: "#080808" }} />;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#080808" }}>
      <Img
        src={image.path}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          opacity,
          filter: "grayscale(100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `
            linear-gradient(
              180deg,
              rgba(0,0,0,0.58) 0%,
              rgba(0,0,0,0.18) 42%,
              rgba(0,0,0,0.38) 65%,
              rgba(0,0,0,0.78) 100%
            )
          `,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.13), transparent 48%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// COLLAGE PHOTO (Unchanged)
// ======================================================

const CollagePhoto = ({ image, index }: { image?: ImageItem; index: number }) => {
  const frame = useCurrentFrame();
  const startFrame = index * 12;
  const localFrame = frame - startFrame;
  const opacity = interpolate(localFrame, [0, 12, 30], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(localFrame, [0, 18], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(localFrame, [0, 20], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (!image?.path) return null;

  const positions = [
    { left: 35, top: 760, width: 320, height: 520, rotate: -1.5 },
    { left: 380, top: 760, width: 320, height: 520, rotate: 0 },
    { left: 725, top: 760, width: 320, height: 520, rotate: 1.5 },
  ];
  const pos = positions[index % positions.length];

  return (
    <div
      style={{
        position: "absolute",
        left: pos.left,
        top: pos.top,
        width: pos.width,
        height: pos.height,
        padding: 14,
        boxSizing: "border-box",
        background: "#f8f5ed",
        borderRadius: 2,
        boxShadow: "0 20px 55px rgba(0,0,0,0.55)",
        opacity,
        transform: `
          translateY(${translateY}px)
          scale(${scale})
          rotate(${pos.rotate}deg)
        `,
        zIndex: 20 + index,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ddd8cf",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Img
          src={image.path}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />
      </div>
    </div>
  );
};

// ======================================================
// LYRIC – Custom Timing
// 
const LyricText = ({
  text,
  duration,
  index,
}: {
  text: string;
  duration: number;
  index: number;
}) => {
  const frame = useCurrentFrame();

  // ==========================================
  // TEXT ANIMATION
  // ==========================================

  const opacity = interpolate(
    frame,
    [0, 10, Math.max(10, duration - 10), duration],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const translateY = interpolate(
    frame,
    [0, 15],
    [30, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const scale = interpolate(
    frame,
    [0, 20, duration],
    [0.94, 1, 1.02],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ==========================================
  // DIFFERENT POSITION FOR EACH LYRIC
  // ==========================================

  const positions = [
    {
      top: 240,
      left: 70,
      justifyContent: "flex-start" as const,
      rotate: -2,
    },
    {
      top: 330,
      left: 0,
      justifyContent: "center" as const,
      rotate: 1,
    },
    {
      top: 420,
      left: 0,
      justifyContent: "center" as const,
      rotate: -1,
    },
    {
      top: 510,
      left: 0,
      justifyContent: "flex-end" as const,
      rotate: 2,
    },
  ];

  const position =
    positions[index % positions.length] || positions[0];

  return (
    <div
      style={{
        position: "absolute",

        top: position.top,
        left: position.left,
        right: 60,

        display: "flex",
        justifyContent: position.justifyContent,

        opacity,

        transform: `
          translateY(${translateY}px)
          scale(${scale})
          rotate(${position.rotate}deg)
        `,

        zIndex: 100 + index,

        flexDirection: "column",
        alignItems:
          position.justifyContent === "flex-start"
            ? "flex-start"
            : position.justifyContent === "flex-end"
            ? "flex-end"
            : "center",
      }}
    >

      {/* SMALL LABEL */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,

          color: "rgba(243,229,171,0.75)",

          fontFamily:
            "Arial, Helvetica, sans-serif",

          fontSize: 12,
          fontWeight: 400,

          letterSpacing: 6,

          textTransform: "uppercase",
        }}
      >
        <div
          style={{
            width: 28,
            height: 1,
            background:
              "rgba(243,229,171,0.65)",
          }}
        />

        MOMENT

        <div
          style={{
            width: 28,
            height: 1,
            background:
              "rgba(243,229,171,0.65)",
          }}
        />
      </div>


      {/* MAIN LYRIC */}
      <div
        style={{
          position: "relative",

          color: "#f5e7b5",

          fontFamily:
            "Georgia, 'Times New Roman', serif",

          fontSize: 64,

          fontWeight: 400,

          fontStyle: "italic",

          letterSpacing: 1,

          lineHeight: 1.05,

          textAlign: "center",

          whiteSpace: "nowrap",

          textShadow: `
            0 2px 5px rgba(0,0,0,0.9),
            0 8px 30px rgba(0,0,0,0.65)
          `,
        }}
      >
        {text}

        {/* UNDERLINE */}
        <div
          style={{
            position: "absolute",

            left: "50%",

            bottom: -12,

            transform: "translateX(-50%)",

            width: 55,

            height: 1,

            background:
              "linear-gradient(90deg, transparent, #f3e5ab, transparent)",
          }}
        />
      </div>

    </div>
  );
};
// ======================================================
// MAIN SCENE
// ======================================================

const Scene = ({
  images = [],
  lyrics = [],
}: {
  images: ImageItem[];
  lyrics: { text: string; startFrame: number; duration: number }[];
}) => {
  const backgroundImage = images[0];
  const collageImages = images.slice(1, 4).filter((img) => img?.path);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <BackgroundHero image={backgroundImage} />

      {/* Top Title */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 120,
          color: "rgba(255,255,255,0.9)",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 20,
          letterSpacing: 9,
        }}
      >
        OUR STORY
      </div>
      <div
        style={{
          position: "absolute",
          top: 170,
          left: "50%",
          transform: "translateX(-50%)",
          width: 90,
          height: 1,
          background: "rgba(255,255,255,0.8)",
          zIndex: 120,
        }}
      />

      {/* ==========================================
          LYRICS – Custom Timing
      ========================================== */}
 {lyrics.map((item, index) => (
  <Sequence
    key={index}
    from={item.startFrame}
    durationInFrames={item.duration}
  >
    <LyricText
      text={item.text}
      duration={item.duration}
      index={index}
    />
  </Sequence>
))}

      {/* 3 Photo Collage */}
      {collageImages.map((img, index) => (
        <CollagePhoto key={index} image={img} index={index} />
      ))}

      {/* Bottom Text */}
      <div
        style={{
          position: "absolute",
          bottom: 160,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 150,
          color: "rgba(255,255,255,0.92)",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 24,
          fontStyle: "italic",
          letterSpacing: 4,
        }}
      >
        Forever begins here
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 125,
          left: "50%",
          transform: "translateX(-50%)",
          width: 55,
          height: 1,
          background: "rgba(255,255,255,0.65)",
          zIndex: 150,
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// MAIN COMPOSITION
// ======================================================

const Template13: React.FC<Template13Props> = ({
  images = [],
  music,
  lyrics,
}) => {
  // अगर lyrics नहीं आया तो DEFAULT_PROPS का Use करें
  const finalLyrics = lyrics || DEFAULT_PROPS.lyrics;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {music && (
        <MusicPlayer src={music} volume={0.8} loop={true} showVisualizer={false} />
      )}

      <Sequence from={0} durationInFrames={SCENE_DURATION}>
        <Scene images={images.slice(0, IMAGE_COUNT)} lyrics={finalLyrics} />
      </Sequence>
    </AbsoluteFill>
  );
};

export default Template13;