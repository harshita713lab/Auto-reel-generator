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

interface Template36Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIG
// ======================================================

export const FPS = 30;

// Total = 14.1 sec
export const DURATION_IN_FRAMES = 423;

// ======================================================
// IMAGE COUNT
// ======================================================

export const IMAGE_COUNT = 24;

// ======================================================
// SCENE TIMING
// ======================================================
//
// Scene 1 = 0 - 4 sec   = 120 frames
// Scene 2 = 4 - 6 sec   = 60 frames
// Scene 3 = 6 - 14.1 sec = 243 frames
//
// 16 images -> Scene 1
// 3 images  -> Scene 2
// 5 images  -> Scene 3
//
// Total = 24 images
// ======================================================

const COLLAGE_DURATION = 120; // 4 sec

const STACK_DURATION = 60; // 2 sec

const FULLSCREEN_START = 180; // 6 sec

// ======================================================
// FULLSCREEN IMAGE DURATIONS
// ======================================================
//
// Total = 243 frames
//
// 48 + 39 + 39 + 39 + 78 = 243
// ======================================================

const FULLSCREEN_DURATIONS = [
  48,
  39,
  39,
  39,
  78,
];

// ======================================================
// SAFE CLAMP
// ======================================================

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// DEFAULT PROPS
// ======================================================

export const DEFAULT_PROPS: Template36Props = {
  images: Array.from({ length: 24 }, (_, i) => ({
    path: `https://images.unsplash.com/photo-${
      [
        "1583939003579-730e3918a45a",
        "1519741497674-611481863552",
        "1511285560929-80b456fea0bc",
        "1519225421980-715cb0215aed",
        "1606800052052-a08af7148866",
        "1606216794074-735e91aa2c92",
        "1515934751635-c81c6bc9a2d8",
        "1507504031003-b417219a0fde",
        "1517841905240-472988babdf9",
        "1492562080023-ab3db95bfbce",
        "1523438885200-e635ba2c371e",
        "1520854221256-3f7c0f0b6e5f",
        "1504150558240-0b4fd8946624",
        "1511285560929-80b456fea0bc",
        "1519741497674-611481863552",
        "1519225421980-715cb0215aed",
        "1583939003579-730e3918a45a",
        "1606800052052-a08af7148866",
        "1515934751635-c81c6bc9a2d8",
        "1507504031003-b417219a0fde",
        "1517841905240-472988babdf9",
        "1492562080023-ab3db95bfbce",
        "1523438885200-e635ba2c371e",
        "1520854221256-3f7c0f0b6e5f",
      ][i]
    }?q=80&w=1200&auto=format&fit=crop`,
  })),

  music: undefined,
};

// ======================================================
// IMAGE SOURCE
// ======================================================

const getImgSrc = (
  images: ImageItem[],
  index: number
): string => {
  if (!images || images.length === 0) {
    return DEFAULT_PROPS.images?.[0]?.path || "";
  }

  const actualIndex = index % images.length;

  const image = images[actualIndex];

  if (image?.url) {
    return image.url;
  }

  if (image?.path) {
    return image.path;
  }

  return DEFAULT_PROPS.images?.[0]?.path || "";
};

// ======================================================
// COLLAGE POSITIONS
// ======================================================

const COLLAGE_POSITIONS = [
  // 1
  {
    left: "20%",
    top: "25%",
    width: "11%",
    height: "10%",
    rotate: -1,
  },

  // 2
  {
    left: "31%",
    top: "25%",
    width: "11%",
    height: "10%",
    rotate: 1,
  },

  // 3
  {
    left: "7%",
    top: "35%",
    width: "12%",
    height: "18%",
    rotate: -1,
  },

  // 4
  {
    left: "20%",
    top: "34%",
    width: "21%",
    height: "20%",
    rotate: 0,
  },

  // 5
  {
    left: "42%",
    top: "35%",
    width: "11%",
    height: "13%",
    rotate: 2,
  },

  // 6
  {
    left: "54%",
    top: "29%",
    width: "23%",
    height: "24%",
    rotate: 0,
  },

  // 7
  {
    left: "79%",
    top: "36%",
    width: "12%",
    height: "13%",
    rotate: 1,
  },

  // 8
  {
    left: "20%",
    top: "55%",
    width: "12%",
    height: "11%",
    rotate: -1,
  },

  // 9
  {
    left: "33%",
    top: "54%",
    width: "22%",
    height: "25%",
    rotate: 0,
  },

  // 10
  {
    left: "57%",
    top: "55%",
    width: "12%",
    height: "11%",
    rotate: 1,
  },

  // 11
  {
    left: "70%",
    top: "53%",
    width: "12%",
    height: "12%",
    rotate: -1,
  },

  // 12
  {
    left: "39%",
    top: "68%",
    width: "11%",
    height: "12%",
    rotate: 1,
  },

  // 13
  {
    left: "51%",
    top: "68%",
    width: "11%",
    height: "13%",
    rotate: -1,
  },

  // 14
  {
    left: "63%",
    top: "66%",
    width: "12%",
    height: "12%",
    rotate: 1,
  },

  // 15
  {
    left: "51%",
    top: "80%",
    width: "12%",
    height: "12%",
    rotate: 0,
  },

  // 16
  {
    left: "39%",
    top: "80%",
    width: "11%",
    height: "11%",
    rotate: -1,
  },
];

// ======================================================
// COLLAGE IMAGE
// ======================================================

interface CollageImageProps {
  src: string;
  index: number;
  frame: number;
}

const CollageImage: React.FC<CollageImageProps> = ({
  src,
  index,
  frame,
}) => {
  const startFrame = index * 6;

  const localFrame = frame - startFrame;

  // Fade
  const opacity = interpolate(
    localFrame,
    [0, 7],
    [0, 1],
    clamp
  );

  // Entrance scale
  const scale = interpolate(
    localFrame,
    [0, 10],
    [0.72, 1],
    {
      ...clamp,
      easing: Easing.out(
        Easing.back(1.15)
      ),
    }
  );

  const position = COLLAGE_POSITIONS[index];

  return (
    <AbsoluteFill
      style={{
        left: position.left,
        top: position.top,

        width: position.width,
        height: position.height,

        opacity,

        transform: `
          scale(${scale})
          rotate(${position.rotate}deg)
        `,

        transformOrigin: "center center",

        overflow: "hidden",

        backgroundColor: "#ffffff",

        border: "2px solid #ffffff",

        boxSizing: "border-box",

        boxShadow:
          "0 3px 12px rgba(0,0,0,0.15)",

        zIndex: index + 2,
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",

          objectFit: "cover",

          display: "block",
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// COLLAGE BACKGROUND
// ======================================================
//
// Background continuously zooms OUT
// throughout complete Scene 1.
// ======================================================

const CollageBackground: React.FC<{
  src: string;
  frame: number;
}> = ({
  src,
  frame,
}) => {
  const opacity = interpolate(
    frame,
    [0, 20],
    [0, 1],
    clamp
  );

  // Continuous zoom OUT
  const backgroundScale = interpolate(
    frame,
    [0, COLLAGE_DURATION - 1],
    [1.22, 1.05],
    {
      ...clamp,
      easing: Easing.inOut(
        Easing.cubic
      ),
    }
  );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        opacity,
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",

          objectFit: "cover",

          transform: `
            scale(${backgroundScale})
          `,

          transformOrigin:
            "center center",

          filter:
            "blur(9px) brightness(0.72)",

          display: "block",
        }}
      />

      <AbsoluteFill
        style={{
          backgroundColor:
            "rgba(220,220,230,0.35)",
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 2 — FULL WIDTH STACKED IMAGES
// ======================================================
//
// 4 - 6 sec
//
// IMPORTANT:
// No gap between images.
// No margin.
// No padding.
// No border.
// Exactly 3 horizontal strips.
// ======================================================

interface StackImageProps {
  src: string;
  index: number;
  frame: number;
}

const StackImage: React.FC<StackImageProps> = ({
  src,
  index,
  frame,
}) => {
  const localFrame =
    frame - COLLAGE_DURATION;

  // Slight stagger
  const start = index * 4;

  const cardFrame =
    localFrame - start;

  const opacity = interpolate(
    cardFrame,
    [0, 5],
    [0, 1],
    clamp
  );

  // Small entrance movement
  const translateX = interpolate(
    cardFrame,
    [0, 8],
    [
      index === 1 ? 25 : -25,
      0,
    ],
    {
      ...clamp,
      easing:
        Easing.out(Easing.cubic),
    }
  );

  // EXACTLY NO GAP
  const topPositions = [
    "0%",
    "33.333333%",
    "66.666666%",
  ];

  const positionTop =
    topPositions[index];

  return (
    <AbsoluteFill
      style={{
        left: "0%",
        top: positionTop,

        width: "100%",
        height: "33.333333%",

        margin: 0,
        padding: 0,

        opacity,

        transform:
          `translateX(${translateX}px)`,

        overflow: "hidden",

        // NO BORDER
        border: "none",

        boxSizing: "border-box",

        zIndex: index + 5,
      }}
    >
      <Img
        src={src}
        style={{
          position: "absolute",

          left: 0,
          top: 0,

          width: "100%",
          height: "100%",

          margin: 0,
          padding: 0,

          objectFit: "cover",

          display: "block",
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// MY LOVE TITLE
// ======================================================

// ======================================================
// MY LOVE TITLE — REFERENCE STYLE
// ======================================================

const MyLoveTitle: React.FC<{
  frame: number;
}> = ({ frame }) => {

  const opacity = interpolate(
    frame,
    [0, 8],
    [0, 1],
    clamp
  );

  const scale = interpolate(
    frame,
    [0, 10],
    [0.92, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  return (
    <AbsoluteFill
      style={{
        position: "absolute",

        top: "7%",

        left: "0%",

        width: "100%",

        height: "14%",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        opacity,

        transform: `scale(${scale})`,

        zIndex: 50,

        pointerEvents: "none",
      }}
    >

      {/* MAIN TEXT */}
      <div
        style={{
          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          gap: "18px",

          whiteSpace: "nowrap",
        }}
      >

        {/* MY */}
        <span
          style={{
            fontFamily:
              "'Comic Sans MS', 'Arial Rounded MT Bold', cursive",

            fontSize: "45px",

            fontWeight: 500,

            color: "#ffffff",

            letterSpacing: "1px",

            lineHeight: 1,

            textShadow:
              "0 2px 5px rgba(0,0,0,0.35)",
          }}
        >
          my
        </span>


        {/* ==================================================
            PINK HEART
            ================================================== */}
{/* ==================================================
    PINK HEART EMOJI
    ================================================== */}

<div
  style={{
    width: "70px",
    height: "70px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "62px",
    lineHeight: 1,

    transform: "scale(1.05)",

    filter:
      "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
  }}
>
  🩷
</div>


        {/* LOVE */}
        <span
          style={{
            fontFamily:
              "'Comic Sans MS', 'Arial Rounded MT Bold', cursive",

            fontSize: "45px",

            fontWeight: 500,

            color: "#ffffff",

            letterSpacing: "1px",

            lineHeight: 1,

            textShadow:
              "0 2px 5px rgba(0,0,0,0.35)",
          }}
        >
          love
        </span>

      </div>

    </AbsoluteFill>
  );
};

// ======================================================
// FULLSCREEN IMAGE INDEX
// ======================================================

const getFullscreenIndex = (
  frame: number
): number => {
  let accumulated =
    FULLSCREEN_START;

  for (
    let i = 0;
    i < FULLSCREEN_DURATIONS.length;
    i++
  ) {
    accumulated +=
      FULLSCREEN_DURATIONS[i];

    if (frame < accumulated) {
      return i;
    }
  }

  return 4;
};

// ======================================================
// FULLSCREEN START
// ======================================================

const getFullscreenStart = (
  index: number
): number => {
  let start =
    FULLSCREEN_START;

  for (
    let i = 0;
    i < index;
    i++
  ) {
    start +=
      FULLSCREEN_DURATIONS[i];
  }

  return start;
};

// ======================================================
// FULLSCREEN IMAGE
// ======================================================

// ======================================================
// FULLSCREEN IMAGE
// ======================================================

const FullscreenImage: React.FC<{
  src: string;
  frame: number;
  index: number;
}> = ({
  src,
  frame,
  index,
}) => {
  const start =
    getFullscreenStart(index);

  const localFrame =
    frame - start;

  const duration =
    FULLSCREEN_DURATIONS[index];

  // Fade
  const opacity = interpolate(
    localFrame,
    [0, 5],
    [0, 1],
    clamp
  );

  // ==================================================
  // ZOOM OUT
  // Start slightly zoomed in → slowly zoom out
  // ==================================================

  const progress = interpolate(
    localFrame,
    [
      0,
      Math.max(1, duration - 1),
    ],
    [0, 1],
    {
      ...clamp,
      easing: Easing.inOut(
        Easing.cubic
      ),
    }
  );

  const scale = interpolate(
    progress,
    [0, 1],
    [1.10, 1],
    {
      ...clamp,
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        opacity,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          left: "4%",
          top: "17%",
          width: "92%",
          height: "66%",

          overflow: "hidden",
          backgroundColor: "#111111",
        }}
      >
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",

            objectFit: "cover",

            transform: `scale(${scale})`,

            transformOrigin:
              "center center",

            display: "block",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ======================================================
// TEMPLATE 36
// ======================================================

export const Template36: React.FC<
  Template36Props
> = ({
  images = [],
  music,
}) => {
  const frame =
    useCurrentFrame();

  // ====================================================
  // SAFE 24 IMAGES
  // ====================================================

  const safeImages =
    images.length >= 24
      ? images
      : [
          ...images,
          ...(DEFAULT_PROPS.images || []),
        ].slice(0, 24);

  // ====================================================
  // MUSIC
  // ====================================================

  const musicSrc =
    music?.path;

  // ====================================================
  // CURRENT FULLSCREEN
  // ====================================================

  const fullscreenIndex =
    frame >= FULLSCREEN_START
      ? getFullscreenIndex(frame)
      : 0;

  // ====================================================
  // FULLSCREEN LOCAL FRAME
  // ====================================================

  const fullscreenStart =
    frame >= FULLSCREEN_START
      ? getFullscreenStart(
          fullscreenIndex
        )
      : FULLSCREEN_START;

  const fullscreenLocalFrame =
    frame >= FULLSCREEN_START
      ? frame - fullscreenStart
      : 0;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",

        overflow: "hidden",

        margin: 0,
        padding: 0,
      }}
    >
      {/* ==================================================
          MUSIC
          ================================================== */}

      {musicSrc && (
        <MusicPlayer
          src={musicSrc}
          volume={
            music?.volume ?? 1
          }
        />
      )}

      {/* ==================================================
          SCENE 1
          0 - 4 SEC
          16 PHOTO COLLAGE
          ================================================== */}

      {frame < COLLAGE_DURATION && (
        <AbsoluteFill
          style={{
            overflow: "hidden",
          }}
        >
          {/* Background continuously zooms OUT */}

          <CollageBackground
            src={getImgSrc(
              safeImages,
              0
            )}
            frame={frame}
          />

          {/* 16 PHOTO COLLAGE */}

          {Array.from(
            { length: 16 },
            (_, index) => (
              <CollageImage
                key={index}
                src={getImgSrc(
                  safeImages,
                  index
                )}
                index={index}
                frame={frame}
              />
            )
          )}
        </AbsoluteFill>
      )}

      {/* ==================================================
          SCENE 2
          4 - 6 SEC
          3 IMAGES
          NO GAP
          ================================================== */}

      {frame >= COLLAGE_DURATION &&
        frame < FULLSCREEN_START && (
          <AbsoluteFill
            style={{
              backgroundColor:
                "#000000",

              overflow: "hidden",

              margin: 0,
              padding: 0,
            }}
          >
            {/* IMAGE 17 */}

            <StackImage
              src={getImgSrc(
                safeImages,
                16
              )}
              index={0}
              frame={frame}
            />

            {/* IMAGE 18 */}

            <StackImage
              src={getImgSrc(
                safeImages,
                17
              )}
              index={1}
              frame={frame}
            />

            {/* IMAGE 19 */}

            <StackImage
              src={getImgSrc(
                safeImages,
                18
              )}
              index={2}
              frame={frame}
            />
          </AbsoluteFill>
        )}

      {/* ==================================================
          SCENE 3
          6 - 14.1 SEC
          5 FULLSCREEN IMAGES
          ================================================== */}

      {frame >= FULLSCREEN_START && (
        <AbsoluteFill
          style={{
            backgroundColor:
              "#000000",

            overflow: "hidden",
          }}
        >
          {/* MY LOVE */}

          <MyLoveTitle
            frame={
              fullscreenLocalFrame
            }
          />

          {/* CURRENT FULLSCREEN IMAGE */}

          <FullscreenImage
            src={getImgSrc(
              safeImages,
              19 +
                fullscreenIndex
            )}
            frame={frame}
            index={
              fullscreenIndex
            }
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default Template36;