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

interface Template33Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIG
// ======================================================

export const FPS = 30;

// EXACT 11 SECONDS
export const DURATION_IN_FRAMES = 330;

// ======================================================
// IMAGE COUNT
// ======================================================

export const IMAGE_COUNT = 4;

// ======================================================
// TIMING
// ======================================================
//
// 0 - 3 sec  = 4 image grid
// 3 - 11 sec = 4 framed fullscreen images
//
// ======================================================

const GRID_DURATION = 90; // 3 sec

const FULLSCREEN_DURATION = 240; // 8 sec

// ======================================================
// GRID IMAGE DURATIONS
// ======================================================
//
// Image 1 = 0.0 - 0.5 sec
// Image 2 = 0.5 - 1.0 sec
// Image 3 = 1.0 - 1.5 sec
// Image 4 = 1.5 - 2.0 sec
//
// 2.0 - 3.0 sec = complete grid hold
//
// ======================================================

const GRID_IMAGE_DURATION = 15;

// ======================================================
// FULLSCREEN DURATIONS
// ======================================================
//
// 3 - 5 sec  = Image 1
// 5 - 7 sec  = Image 2
// 7 - 9 sec  = Image 3
// 9 - 11 sec = Image 4
//
// ======================================================

const FULLSCREEN_DURATIONS = [
  60,
  60,
  60,
  60,
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

export const DEFAULT_PROPS: Template33Props = {
  images: [
    {
      path:
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
    },
    {
      path:
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    },
    {
      path:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
    },
    {
      path:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop",
    },
  ],

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
    return (
      DEFAULT_PROPS.images?.[0]?.path ||
      ""
    );
  }

  const actualIndex =
    index % images.length;

  const image =
    images[actualIndex];

  // Prefer URL
  if (image?.url) {
    return image.url;
  }

  // Fallback to path
  if (image?.path) {
    return image.path;
  }

  return (
    DEFAULT_PROPS.images?.[0]?.path ||
    ""
  );
};

// ======================================================
// GET FULLSCREEN IMAGE INDEX
// ======================================================

const getFullscreenImageIndex = (
  frame: number
): number => {
  const localFrame =
    frame - GRID_DURATION;

  let accumulated = 0;

  for (
    let i = 0;
    i < FULLSCREEN_DURATIONS.length;
    i++
  ) {
    accumulated +=
      FULLSCREEN_DURATIONS[i];

    if (
      localFrame < accumulated
    ) {
      return i;
    }
  }

  return 3;
};

// ======================================================
// GET FULLSCREEN START
// ======================================================

const getFullscreenStart = (
  imageIndex: number
): number => {
  let start = 0;

  for (
    let i = 0;
    i < imageIndex;
    i++
  ) {
    start +=
      FULLSCREEN_DURATIONS[i];
  }

  return start;
};

// ======================================================
// GRID POSITIONS
// ======================================================
//
// Reference-style masonry layout
//
// ======================================================

const GRID_POSITIONS = [

  // ====================================================
  // IMAGE 1 - TOP LEFT
  // Text ke liye upar blank space
  // ====================================================

  {
    left: "6%",
    top: "15%",
    width: "44%",
    height: "36.5%",
  },

  // ====================================================
  // IMAGE 2 - TOP RIGHT
  // ====================================================

  {
    left: "48%",
    top: "8.5%",
    width: "46%",
    height: "43%",
  },

  // ====================================================
  // IMAGE 3 - BOTTOM LEFT
  // ====================================================

  {
    left: "6%",
    top: "51.5%",
    width: "44%",
    height: "43%",
  },

  // ====================================================
  // IMAGE 4 - BOTTOM RIGHT
  // ====================================================

  {
    left: "48%",
    top: "51.5%",
    width: "46%",
    height: "43%",
  },
];

// ======================================================
// GRID IMAGE PROPS
// ======================================================

interface GridImageProps {
  src: string;
  index: number;
  frame: number;
}

// ======================================================
// GRID IMAGE
// ======================================================

const GridImage: React.FC<
  GridImageProps
> = ({
  src,
  index,
  frame,
}) => {

  // ====================================================
  // START FRAME
  // ====================================================

  const startFrame =
    index *
    GRID_IMAGE_DURATION;

  // ====================================================
  // LOCAL FRAME
  // ====================================================

  const localFrame =
    frame - startFrame;

  // ====================================================
  // OPACITY
  // ====================================================

  const opacity =
    interpolate(
      localFrame,
      [0, 5],
      [0, 1],
      clamp
    );

  // ====================================================
  // ENTRANCE SCALE
  // ====================================================

  const scale =
    interpolate(
      localFrame,
      [0, 6],
      [0.96, 1],
      {
        ...clamp,
        easing:
          Easing.out(
            Easing.cubic
          ),
      }
    );

  // ====================================================
  // POSITION
  // ====================================================

  const position =
    GRID_POSITIONS[index];

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        left:
          position.left,

        top:
          position.top,

        width:
          position.width,

        height:
          position.height,

        opacity,

        transform:
          `scale(${scale})`,

        transformOrigin:
          "center center",

        overflow:
          "hidden",

        backgroundColor:
          "#ffffff",

        border:
          "3px solid #ffffff",

        boxSizing:
          "border-box",

        boxShadow:
          "none",

        zIndex:
          2,
      }}
    >

      <Img
        src={src}
        style={{
          width:
            "100%",

          height:
            "100%",

          objectFit:
            "cover",

          display:
            "block",

          filter:
            "none",

          WebkitFilter:
            "none",

          mixBlendMode:
            "normal",
        }}
      />

    </AbsoluteFill>
  );
};

// ======================================================
// GRID TITLE
// ======================================================
//
// Image 1 ke upar blank area mein text
//
// ======================================================
// ======================================================
// GRID TITLE
// ======================================================

const GridTitle: React.FC<{
  frame: number;
}> = ({ frame }) => {

  const opacity = interpolate(
    frame,
    [0, 8],
    [0, 1],
    clamp
  );

  const translateY = interpolate(
    frame,
    [0, 10],
    [6, 0],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  return (
    <AbsoluteFill
      style={{
        left: "6%",
        top: "9.5%",
        width: "44%",
        height: "5%",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        opacity,

        transform: `translateY(${translateY}px)`,

        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily:
            "Georgia, 'Times New Roman', serif",

          fontSize: "29px",

          fontWeight: 600,

          lineHeight: 1.1,

          color: "#171717",

          textAlign: "center",

          whiteSpace: "nowrap",

          letterSpacing: "0.2px",

          // very subtle, clean shadow
          textShadow:
            "0 1px 2px rgba(255,255,255,0.45)",
        }}
      >
        Hona tha Pyaar
        <span
          style={{
            marginLeft: "7px",
            fontSize: "24px",
          }}
        >
          ❤️
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// FULLSCREEN TITLE
// ======================================================
// Fullscreen image ke top par
// "YOU + ME = ❤️"
// ======================================================

const FullscreenTitle: React.FC<{
  frame: number;
}> = ({ frame }) => {
  const opacity = interpolate(
    frame,
    [0, 8],
    [0, 1],
    clamp
  );

  const translateY = interpolate(
    frame,
    [0, 10],
    [8, 0],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  return (
    <AbsoluteFill
      style={{
        position: "absolute",

        top: "2.5%",
        left: "0%",
        width: "100%",
        height: "7%",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        opacity,

        transform: `translateY(${translateY}px)`,

        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily:
            "Georgia, 'Times New Roman', serif",

          fontSize: "30px",

          fontWeight: 500,

          lineHeight: 1,

          color: "black",

          textAlign: "center",

          whiteSpace: "nowrap",

          letterSpacing: "1.5px",

          textShadow:
            "0 2px 6px rgba(0,0,0,0.45)",
        }}
      >
        YOU + ME
        <span
          style={{
            marginLeft: "9px",
            fontSize: "27px",
          }}
        >
          = ❤️
        </span>
      </div>
    </AbsoluteFill>
  );
};
// ======================================================
// TEMPLATE 33
// ======================================================

export const Template33: React.FC<
  Template33Props
> = ({
  images = [],
  music,
}) => {

  const frame =
    useCurrentFrame();

  // ====================================================
  // SAFE IMAGES
  // ====================================================

  const safeImages =
    images.length >= 4
      ? images
      : [
          ...images,
          ...DEFAULT_PROPS.images!,
        ].slice(0, 4);

  // ====================================================
  // MUSIC
  // ====================================================

  const musicSrc =
    music?.path;

  // ====================================================
  // FULLSCREEN STATE
  // ====================================================

  const isFullscreen =
    frame >= GRID_DURATION;

  // ====================================================
  // FULLSCREEN IMAGE INDEX
  // ====================================================

  const fullscreenIndex =
    isFullscreen
      ? getFullscreenImageIndex(
          frame
        )
      : 0;

  // ====================================================
  // FULLSCREEN START
  // ====================================================

  const fullscreenStart =
    isFullscreen
      ? getFullscreenStart(
          fullscreenIndex
        )
      : 0;

  // ====================================================
  // FULLSCREEN LOCAL FRAME
  // ====================================================

  const fullscreenLocalFrame =
    isFullscreen
      ? frame -
        GRID_DURATION -
        fullscreenStart
      : 0;

  // ====================================================
  // FULLSCREEN DURATION
  // ====================================================

  const fullscreenDuration =
    FULLSCREEN_DURATIONS[
      fullscreenIndex
    ];

  // ====================================================
  // FULLSCREEN PROGRESS
  // ====================================================

  const fullscreenProgress =
    interpolate(
      fullscreenLocalFrame,
      [
        0,
        Math.max(
          1,
          fullscreenDuration - 1
        ),
      ],
      [0, 1],
      clamp
    );

  // ====================================================
  // FULLSCREEN ZOOM
  // ====================================================

  const fullscreenZoom =
    interpolate(
      fullscreenProgress,
      [0, 1],
      [1.01, 1.025],
      {
        ...clamp,
        easing:
          Easing.inOut(
            Easing.cubic
          ),
      }
    );

  // ====================================================
  // FULLSCREEN OPACITY
  // ====================================================

  const fullscreenOpacity =
    interpolate(
      fullscreenLocalFrame,
      [0, 3],
      [0, 1],
      clamp
    );

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor:
          "#eee8e4",

        overflow:
          "hidden",
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
          0 - 3 SEC
          4 IMAGE GRID
          ================================================== */}

      {frame < GRID_DURATION && (
        <AbsoluteFill
          style={{
            backgroundColor:
              "#eee8e4",

            overflow:
              "hidden",
          }}
        >

          {/* ==============================================
              GRID TITLE
              Image 1 ke upar
              ============================================== */}

          <GridTitle
            frame={frame}
          />

          {/* ==============================================
              IMAGE 1
              TOP LEFT
              ============================================== */}

          <GridImage
            src={getImgSrc(
              safeImages,
              0
            )}
            index={0}
            frame={frame}
          />

          {/* ==============================================
              IMAGE 2
              TOP RIGHT
              ============================================== */}

          <GridImage
            src={getImgSrc(
              safeImages,
              1
            )}
            index={1}
            frame={frame}
          />

          {/* ==============================================
              IMAGE 3
              BOTTOM LEFT
              ============================================== */}

          <GridImage
            src={getImgSrc(
              safeImages,
              2
            )}
            index={2}
            frame={frame}
          />

          {/* ==============================================
              IMAGE 4
              BOTTOM RIGHT
              ============================================== */}

          <GridImage
            src={getImgSrc(
              safeImages,
              3
            )}
            index={3}
            frame={frame}
          />

        </AbsoluteFill>
      )}

      {/* ==================================================
          3 - 11 SEC
          FRAMED FULLSCREEN IMAGES
          ================================================== */}

      {isFullscreen && (
        <AbsoluteFill
          style={{
            backgroundColor:
              "#eee8e4",

            overflow:
              "hidden",

            opacity:
              fullscreenOpacity,
          }}
        >
  <FullscreenTitle
      frame={fullscreenLocalFrame}
    />
          {/* =================================================
              FULLSCREEN IMAGE FRAME
              ================================================= */}

          <AbsoluteFill
            style={{
              position:
                "absolute",

              left:
                "8%",

              top:
                "8.5%",

              width:
                "84%",

              height:
                "85.5%",

              overflow:
                "hidden",

              backgroundColor:
                "#ffffff",

              boxSizing:
                "border-box",
            }}
          >

            {/* ===============================================
                FULLSCREEN IMAGE
                =============================================== */}

            <Img
              src={getImgSrc(
                safeImages,
                fullscreenIndex
              )}
              style={{
                position:
                  "absolute",

                width:
                  "100%",

                height:
                  "100%",

                objectFit:
                  "cover",

                display:
                  "block",

                transform:
                  `scale(${fullscreenZoom})`,

                transformOrigin:
                  "center center",

                filter:
                  "none",

                WebkitFilter:
                  "none",

                mixBlendMode:
                  "normal",
              }}
            />

          </AbsoluteFill>

        </AbsoluteFill>
      )}

    </AbsoluteFill>
  );
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default Template33;