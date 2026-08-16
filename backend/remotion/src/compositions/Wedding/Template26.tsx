import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  Easing,
  useCurrentFrame,
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

interface Template26Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// GLOBAL CONFIG
// ======================================================

export const FPS = 30;

// ======================================================
// TIMING
// ======================================================

export const SCENE1_DURATION = 60;   // 0–2 sec
export const SCENE2_DURATION = 270;  // 2–10 sec
export const SCENE4_DURATION = 90;   // 11–14 

const scene1Start = 0;      // 0 sec
const scene2Start = 60;     // 2 sec
const scene4Start = 330;    // 11 sec
export const DURATION_IN_FRAMES = 420; // 14 sec



export const IMAGE_COUNT = 9;

// ======================================================
// COMMON
// ======================================================

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// SCENE 1
// ======================================================

interface Scene1Props {
  images: ImageItem[];
}

export const Scene1: React.FC<Scene1Props> = ({ images }) => {
  const frame = useCurrentFrame();

  const moveProgress = interpolate(
    frame,
    [10, 34],
    [0, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  const returnProgress = interpolate(
    frame,
    [57, 75],
    [0, 1],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // IMAGE 1

  const image1LeftSpread = interpolate(
    moveProgress,
    [0, 1],
    [50, 25]
  );

  const image1TopSpread = interpolate(
    moveProgress,
    [0, 1],
    [50, 28]
  );

  const image1Left = interpolate(
    returnProgress,
    [0, 1],
    [image1LeftSpread, 50]
  );

  const image1Top = interpolate(
    returnProgress,
    [0, 1],
    [image1TopSpread, 50]
  );

  // IMAGE 2

  const image2Left = 50;
  const image2Top = 50;

  // IMAGE 3

  const image3LeftSpread = interpolate(
    moveProgress,
    [0, 1],
    [50, 75]
  );

  const image3TopSpread = interpolate(
    moveProgress,
    [0, 1],
    [50, 72]
  );

  const image3Left = interpolate(
    returnProgress,
    [0, 1],
    [image3LeftSpread, 50]
  );

  const image3Top = interpolate(
    returnProgress,
    [0, 1],
    [image3TopSpread, 50]
  );

  // SCALE

  const scale = interpolate(
    frame,
    [0, 12, 58, 75],
    [0.78, 1, 1, 0.86],
    {
      ...clamp,
      easing: Easing.inOut(Easing.quad),
    }
  );

  // OPACITY

  const opacity1 = interpolate(
    frame,
    [0, 8, 65, 75],
    [0, 1, 1, 0],
    clamp
  );

  const opacity2 = interpolate(
    frame,
    [3, 11, 65, 75],
    [0, 1, 1, 0],
    clamp
  );

  const opacity3 = interpolate(
    frame,
    [6, 14, 65, 75],
    [0, 1, 1, 0],
    clamp
  );

  // ROTATION

  const rotate1 = interpolate(
    moveProgress,
    [0, 1],
    [0, -5]
  );

  const rotate3 = interpolate(
    moveProgress,
    [0, 1],
    [0, 5]
  );

  const cardStyle: React.CSSProperties = {
    position: "absolute",
    width: 460,
    height: 560,
    objectFit: "cover",
    borderRadius: 3,
    boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
    transformOrigin: "center center",
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      <Img
        src={images[0].path}
        style={{
          ...cardStyle,
          left: `${image1Left}%`,
          top: `${image1Top}%`,
          opacity: opacity1,
          transform: `
            translate(-50%, -50%)
            scale(${scale})
            rotate(${rotate1}deg)
          `,
          zIndex: 2,
        }}
      />

      <Img
        src={images[1].path}
        style={{
          ...cardStyle,
          left: `${image2Left}%`,
          top: `${image2Top}%`,
          opacity: opacity2,
          transform: `
            translate(-50%, -50%)
            scale(${scale})
          `,
          zIndex: 3,
        }}
      />

      <Img
        src={images[2].path}
        style={{
          ...cardStyle,
          left: `${image3Left}%`,
          top: `${image3Top}%`,
          opacity: opacity3,
          transform: `
            translate(-50%, -50%)
            scale(${scale})
            rotate(${rotate3}deg)
          `,
          zIndex: 2,
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 2
// ======================================================
interface Scene2Props {
  images: ImageItem[];
}

export const Scene2: React.FC<Scene2Props> = ({ images }) => {
  const frame = useCurrentFrame();

  const IMAGE_DURATION = 80;

  const renderImage = (
    image: ImageItem | undefined,
    index: number,
    text: string
  ) => {
    if (!image?.path) return null;

    const startFrame = index * IMAGE_DURATION;
    const localFrame = frame - startFrame;

    // -----------------------------
    // IMAGE FADE
    // -----------------------------

const opacity = interpolate(
  localFrame,
  [0, 8, 72, 80],
  [0, 1, 1, 0],
  clamp
);

const scale = interpolate(
  localFrame,
  [0, 80],
  [1.06, 1],
  {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  }
);

const textOpacity = interpolate(
  localFrame,
  [8, 18, 65, 80],
  [0, 1, 1, 0],
  clamp
);

const textY = interpolate(
  localFrame,
  [8, 20],
  [25, 0],
  {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  }
);

    return (
      <AbsoluteFill
        key={index}
        style={{
          opacity,
          overflow: "hidden",
        }}
      >
        {/* FULL SCREEN IMAGE */}

        <Img
          src={image.path}
          style={{
            position: "absolute",

            width: "100%",
            height: "100%",

            objectFit: "cover",

            transform: `scale(${scale})`,
          }}
        />

        {/* DARK GRADIENT */}

        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.65))",
          }}
        />

        {/* TEXT */}

        <div
          style={{
            position: "absolute",

            left: "50%",
            bottom: "13%",

            width: "90%",

            transform:
              `translate(-50%, ${textY}px)`,

            color: "#fff",

            textAlign: "center",

            fontSize: 30,

            fontWeight: 700,

            fontFamily:
              "Arial, Helvetica, sans-serif",

            textShadow:
              "0 3px 12px rgba(0,0,0,0.95)",

            opacity: textOpacity,

            zIndex: 10,

            whiteSpace: "normal",
          }}
        >
          {text}
        </div>
      </AbsoluteFill>
    );
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* IMAGE 1 */}

      {renderImage(
        images[0],
        0,
        "kabhi use noor noor kehta hoon🥺"
      )}

      {/* IMAGE 2 */}

      {renderImage(
        images[1],
        1,
        "kabhi mai hoor hoor kehta hoon💕"
      )}

      {/* IMAGE 3 */}

      {renderImage(
        images[2],
        2,
        "Ishq mai choor rehta hoon♡"
      )}
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 4 — TEXT FIRST, THEN IMAGES BUILD INTO GRID
// ======================================================

interface Scene4Props {
  images: ImageItem[];
}

export const Scene4: React.FC<Scene4Props> = ({ images }) => {
  const frame = useCurrentFrame();

  // ====================================================
  // TEXT FIRST
  // 0–18 frames
  // ====================================================

  const textOpacity = interpolate(
    frame,
    [0, 6, 16, 22],
    [0, 1, 1, 0],
    clamp
  );

  const textScale = interpolate(
    frame,
    [0, 10],
    [0.7, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.back(1.2)),
    }
  );

  // ====================================================
  // IMAGE 1
  // 20 frame se aayegi
  // Aane ke baad RAHEGI
  // ====================================================

  const img1Opacity = interpolate(
    frame,
    [20, 28],
    [0, 1],
    clamp
  );

  const img1Y = interpolate(
    frame,
    [20, 30],
    [-100, 0],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ====================================================
  // IMAGE 2
  // 43 frame se aayegi
  // Image 1 gayab NAHI hogi
  // ====================================================

  const img2Opacity = interpolate(
    frame,
    [43, 51],
    [0, 1],
    clamp
  );

  const img2Y = interpolate(
    frame,
    [43, 53],
    [100, 0],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ====================================================
  // IMAGE 3
  // 66 frame se aayegi
  // Image 1 + Image 2 dono rahengi
  // ====================================================

  const img3Opacity = interpolate(
    frame,
    [66, 74],
    [0, 1],
    clamp
  );

  const img3Y = interpolate(
    frame,
    [66, 76],
    [100, 0],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ====================================================
  // COMMON IMAGE STYLE
  // ====================================================

  const imageStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    width: "100%",
    height: "33.33%",
    objectFit: "cover",
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >

      {/* =================================================
          TEXT FIRST
          ================================================= */}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",

          transform: `
            translate(-50%, -50%)
            scale(${textScale})
          `,

          width: "90%",

          textAlign: "center",

          color: "#ffe900",

          fontSize: 39,
          fontWeight: 900,

          fontFamily: "Arial, sans-serif",

          textShadow: `
            2px 2px 0 #000,
            -2px -2px 0 #000,
            3px 3px 8px rgba(0,0,0,0.9)
          `,

          opacity: textOpacity,

          zIndex: 50,

          whiteSpace: "nowrap",
        }}
      >
        दूर ना जा। ❤️🕊️🎀
      </div>

      {/* =================================================
          IMAGE 1
          TOP
          ================================================= */}

      <Img
        src={images[0].path}
        style={{
          ...imageStyle,

          top: "0%",

          opacity: img1Opacity,

          transform: `translateY(${img1Y}px)`,

          zIndex: 5,
        }}
      />

      {/* =================================================
          IMAGE 2
          MIDDLE
          ================================================= */}

      <Img
        src={images[1].path}
        style={{
          ...imageStyle,

          top: "33.33%",

          opacity: img2Opacity,

          transform: `translateY(${img2Y}px)`,

          zIndex: 5,
        }}
      />

      {/* =================================================
          IMAGE 3
          BOTTOM
          ================================================= */}

      <Img
        src={images[2].path}
        style={{
          ...imageStyle,

          top: "66.66%",

          opacity: img3Opacity,

          transform: `translateY(${img3Y}px)`,

          zIndex: 5,
        }}
      />

      {/* =================================================
          GRID SEPARATORS
          ================================================= */}

      <div
        style={{
          position: "absolute",
          top: "33.33%",
          left: 0,
          width: "100%",
          height: 6,

          backgroundColor: "#000",

          zIndex: 20,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "66.66%",
          left: 0,
          width: "100%",
          height: 6,

          backgroundColor: "#000",

          zIndex: 20,
        }}
      />

    </AbsoluteFill>
  );
};


// ======================================================
// TEMPLATE 26
// ======================================================

export const Template26: React.FC<Template26Props> = ({
  images = [],
  music,
}) => {
  // ----------------------------------------------------
  // VALIDATION
  // ----------------------------------------------------

  const validImages = images.filter(
    (image): image is ImageItem =>
      Boolean(image && typeof image.path === "string" && image.path.trim())
  );

  if (validImages.length < IMAGE_COUNT) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          color: "#fff",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 35,
          textAlign: "center",
          padding: 40,
        }}
      >
        Need at least {IMAGE_COUNT} valid images.
        {"\n"}
        Received: {validImages.length}
      </AbsoluteFill>
    );
  }

  // ----------------------------------------------------
  // SCENE STARTS
  // ----------------------------------------------------



  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* MUSIC */}

      {music?.path && (
        <MusicPlayer
          src={music.path}
          volume={music.volume ?? 1}
        />
      )}

    {/* SCENE 1: 0 → 2 sec */}
<Sequence
  from={0}
  durationInFrames={60}
>
  <Scene1
    images={[
      validImages[0],
      validImages[1],
      validImages[2],
    ]}
  />
</Sequence>

{/* SCENE 2: 2 → 10 sec */}
<Sequence
  from={60}
  durationInFrames={270}
>
  <Scene2
    images={[
      validImages[3],
      validImages[4],
      validImages[5],
    ]}
  />
</Sequence>

{/* SCENE 4: 11 → 14 sec */}
<Sequence
  from={330}
  durationInFrames={90}
>
  <Scene4
    images={[
      validImages[6],
      validImages[7],
      validImages[8],
    ]}
  />
</Sequence>
    </AbsoluteFill>
  );
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default Template26;