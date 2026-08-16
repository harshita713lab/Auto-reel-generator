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
}

interface Music {
  path: string;
  volume?: number;
}

interface Template24Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// SETTINGS
// ======================================================

export const IMAGE_COUNT = 14;

export const FPS = 30;

// Scene 1 = 0–4 sec
export const SCENE_1_DURATION = 4 * FPS; // 120 frames

// Scene 2 = 4–8 sec
export const SCENE_2_DURATION = 4 * FPS; // 120 frames

// Scene 3 = 8–15 sec
export const SCENE_3_DURATION = 7 * FPS; // 210 frames

export const DURATION_IN_FRAMES =
  SCENE_1_DURATION +
  SCENE_2_DURATION +
  SCENE_3_DURATION;

// ======================================================
// MAIN COMPONENT
// ======================================================

export const Template24: React.FC<Template24Props> = ({
  images = [],
  music,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* ==================================================
          SCENE 1
          00:00 – 00:04
          CUMULATIVE COLLAGE
          Images 1–5 stay visible
      ================================================== */}

      <Scene1 images={images.slice(0, 5)} />

      {/* ==================================================
          SCENE 2
          00:04 – 00:08
          CUMULATIVE SCRAPBOOK
          Images 6–9 stay visible
      ================================================== */}

      <AbsoluteFill
        style={{
          display: "none",
        }}
      />

      {/* Scene 2 is positioned after Scene 1 using wrapper */}
      <Scene2Wrapper images={images.slice(5, 9)} />

      {/* ==================================================
          SCENE 3
          00:08 – 00:15
      ================================================== */}

      <Scene3Wrapper images={images.slice(9, 14)} />

      {/* ==================================================
          MUSIC
      ================================================== */}

      {music?.path && (
        <MusicPlayer
          src={music.path}
          volume={music.volume ?? 0.8}
        />
      )}
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 1
// 0 – 4 SEC
//
// IMPORTANT:
// Images NEVER disappear.
// Every new image gets added to the canvas.
// ======================================================

const Scene1: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const IMAGE_DURATION = 24; // 0.8 sec

  const items = [
    {
      image: images[0],
      text: "Esi",
      left: "2.2%",
      top: "6.5%",
      width: "95.6%",
      height: "28.8%",
      textLeft: "40%",
      textTop: "17%",
      textColor: "#f5b800",
      fontSize: 68,
      rotate: -5,
    },
    {
      image: images[1],
      text: "Diwangi",
      left: "0.5%",
      top: "37.2%",
      width: "30.2%",
      height: "25.7%",
      textLeft: "7%",
      textTop: "50%",
      textColor: "#72d5c2",
      fontSize: 28,
      rotate: -7,
    },
    {
      image: images[2],
      text: "Se me",
      left: "34%",
      top: "37.2%",
      width: "32%",
      height: "25.7%",
      textLeft: "40%",
      textTop: "50%",
      textColor: "#ff4d70",
      fontSize: 38,
      rotate: -7,
    },
    {
      image: images[3],
      text: "Chau",
      left: "70.2%",
      top: "37.2%",
      width: "29.3%",
      height: "25.7%",
      textLeft: "75%",
      textTop: "49%",
      textColor: "#f5c542",
      fontSize: 36,
      rotate: -8,
    },
    {
      image: images[4],
      text: "Tumhe jaise",
      left: "2.2%",
      top: "66%",
      width: "95.6%",
      height: "29%",
      textLeft: "30%",
      textTop: "77%",
      textColor: "#f2a900",
      fontSize: 55,
      rotate: -4,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {items.map((item, index) => {
        if (!item.image) return null;

        const startFrame = index * IMAGE_DURATION;

        // Before its time → invisible
        const opacity = interpolate(
          frame,
          [startFrame, startFrame + 8],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const scale = interpolate(
          frame,
          [startFrame, startFrame + 18],
          [0.92, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }
        );

        const textOpacity = interpolate(
          frame,
          [startFrame + 2, startFrame + 15],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const textScale = interpolate(
          frame,
          [startFrame + 2, startFrame + 15],
          [0.75, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(1.2)),
          }
        );

        return (
          <React.Fragment key={`scene1-${index}`}>
            {/* IMAGE */}
            <div
              style={{
                position: "absolute",
                overflow: "hidden",

                border: "3px solid white",
                borderRadius: 28,

                backgroundColor: "#111",

                opacity,

                transform: `scale(${scale})`,

                boxSizing: "border-box",

                left: item.left,
                top: item.top,
                width: item.width,
                height: item.height,
              }}
            >
              <Img
                src={item.image.path}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            {/* TEXT */}
            <div
              style={{
                position: "absolute",

                left: item.textLeft,
                top: item.textTop,

                fontFamily:
                  "'Brush Script MT', 'Segoe Script', cursive",

                fontWeight: 500,
                lineHeight: 1,

                whiteSpace: "nowrap",

                color: item.textColor,
                fontSize: item.fontSize,

                opacity: textOpacity,

                transform: `scale(${textScale}) rotate(${item.rotate}deg)`,

                textShadow:
                  "0 2px 4px rgba(0,0,0,0.35)",
              }}
            >
              {item.text}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 2 WRAPPER
// 4 – 8 SEC
// ======================================================

const Scene2Wrapper: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const sceneStart = SCENE_1_DURATION;

  const localFrame = frame - sceneStart;

  // Scene 2 should not appear before 4 sec
  if (localFrame < 0 || localFrame >= SCENE_2_DURATION) {
    return null;
  }

  return (
    <AbsoluteFill>
      <Scene2
        images={images}
        frame={localFrame}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 2
// 4 – 8 SEC
//
// IMPORTANT:
// Image 1 stays.
// Image 2 comes.
// Image 1 + Image 2 stay.
// Image 3 comes.
// All previous images stay.
// ======================================================

const Scene2: React.FC<{
  images: ImageItem[];
  frame: number;
}> = ({ images, frame }) => {
  const IMAGE_DURATION = 30; // 1 sec

  const items = [
    {
      image: images[0],
      text: "Pehli",
      left: "5%",
      top: "7%",
      width: "38%",
      height: "19%",
      textLeft: "61%",
      textTop: "10%",
      textColor: "#f5df32",
      fontSize: 44,
      rotate: -3,
    },
    {
      image: images[1],
      text: "Dafa",
      left: "55%",
      top: "25%",
      width: "39%",
      height: "19%",
      textLeft: "10%",
      textTop: "29%",
      textColor: "#ffffff",
      fontSize: 40,
      rotate: -8,
    },
    {
      image: images[2],
      text: "Koi pagl",
      left: "5%",
      top: "47%",
      width: "39%",
      height: "19%",
      textLeft: "66%",
      textTop: "48%",
      textColor: "#35d7c4",
      fontSize: 36,
      rotate: -8,
    },
    {
      image: images[3],
      text: "Hua...",
      left: "55%",
      top: "65%",
      width: "40%",
      height: "19%",
      textLeft: "48%",
      textTop: "87%",
      textColor: "#e7a51a",
      fontSize: 36,
      rotate: -7,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {items.map((item, index) => {
        if (!item.image) return null;

        const startFrame = index * IMAGE_DURATION;

        // Image isn't visible before its entry time.
        const opacity = interpolate(
          frame,
          [startFrame, startFrame + 8],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const progress = interpolate(
          frame,
          [startFrame, startFrame + 20],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(1.1)),
          }
        );

        const scale = interpolate(
          progress,
          [0, 1],
          [0.85, 1]
        );

        const rotate = interpolate(
          progress,
          [0, 1],
          [-4, 0]
        );

        const textOpacity = interpolate(
          frame,
          [startFrame + 3, startFrame + 15],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const textScale = interpolate(
          frame,
          [startFrame + 3, startFrame + 15],
          [0.75, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(1.2)),
          }
        );

        return (
          <React.Fragment key={`scene2-${index}`}>
            {/* SCRAPBOOK IMAGE */}
            <div
              style={{
                position: "absolute",
                overflow: "hidden",

                border: "3px solid white",
                borderRadius: 20,

                backgroundColor: "#111",

                opacity,

                transform: `scale(${scale}) rotate(${rotate}deg)`,

                boxSizing: "border-box",

                left: item.left,
                top: item.top,
                width: item.width,
                height: item.height,
              }}
            >
              <Img
                src={item.image.path}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            {/* TEXT */}
            <div
              style={{
                position: "absolute",

                left: item.textLeft,
                top: item.textTop,

                fontFamily:
                  "'Brush Script MT', 'Segoe Script', cursive",

                fontWeight: 500,
                lineHeight: 1,

                whiteSpace: "nowrap",

                color: item.textColor,
                fontSize: item.fontSize,

                opacity: textOpacity,

                transform: `scale(${textScale}) rotate(${item.rotate}deg)`,

                textShadow:
                  "0 2px 4px rgba(0,0,0,0.35)",
              }}
            >
              {item.text}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 3 WRAPPER
// 8 – 15 SEC
// ======================================================

const Scene3Wrapper: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const sceneStart =
    SCENE_1_DURATION + SCENE_2_DURATION;

  const localFrame = frame - sceneStart;

  if (localFrame < 0 || localFrame >= SCENE_3_DURATION) {
    return null;
  }

  return (
    <AbsoluteFill>
      <Scene3
        images={images}
        frame={localFrame}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 3
// 8 – 15 SEC
//
// Here images REPLACE each other.
// ======================================================

const Scene3: React.FC<{
  images: ImageItem[];
  frame: number;
}> = ({ images, frame }) => {
  const IMAGE_DURATION = 42;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {images.map((image, index) => {
        const startFrame = index * IMAGE_DURATION;
        const endFrame = startFrame + IMAGE_DURATION;

        // Don't render image before its time.
        if (frame < startFrame || frame >= endFrame) {
          return null;
        }

        return (
          <Scene3Image
            key={`scene3-${index}`}
            src={image.path}
            index={index}
            frame={frame - startFrame}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 3 IMAGE
// ======================================================

const Scene3Image: React.FC<{
  src: string;
  index: number;
  frame: number;
}> = ({ src, index, frame }) => {
  const scale = interpolate(
    frame,
    [0, 41],
    index === 4
      ? [1.05, 1.14]
      : [1.02, 1.08],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const transitionOpacity = interpolate(
    frame,
    [0, 10, 20],
    [1, 0.4, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* MAIN IMAGE */}

      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />

      {/* ORANGE TRANSITION */}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(115deg, rgba(255,80,20,0.95), rgba(255,150,50,0.45), transparent 65%)",
          opacity: transitionOpacity,
        }}
      />

      {/* CINEMATIC OVERLAY */}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.04), rgba(0,0,0,0.22))",
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// EXPORT
// ======================================================

export default Template24;