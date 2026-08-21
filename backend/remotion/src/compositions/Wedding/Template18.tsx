import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Img,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { MusicPlayer } from "../../components";

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
}

interface Template18Props {
  images?: ImageItem[];

  music?: {
    path: string;
    volume?: number;
  };
}

// ======================================================
// TEMPLATE SETTINGS
// ======================================================

export const IMAGE_COUNT = 17;

export const FPS = 30;

export const DURATION_IN_FRAMES = 660;

// ======================================================
// TEMPLATE
// ======================================================

export const Template18 = ({
  images = [],
  music,
}: Template18Props) => {
  const frame = useCurrentFrame();

  // ====================================================
  // IMAGES
  // ====================================================

  const [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
    img13,
    img14,
    img15,
    img16,
    img17,
  ] = images;

  // ====================================================
  // CLAMP
  // ====================================================

  const clamp = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
  };

  // ====================================================
  // IMAGE COUNT CHECK
  // ====================================================

  if (images.length < IMAGE_COUNT) {
    console.warn(
      `Template18: Expected ${IMAGE_COUNT} images, but received ${images.length}.`
    );
  }

  // ======================================================
  // COMMON CREAM BACKGROUND
  // ======================================================

  const creamBackground = {
    backgroundColor: "#f3eee5",

    backgroundImage: `
      radial-gradient(
        rgba(120,100,80,0.08) 1px,
        transparent 1px
      )
    `,

    backgroundSize: "5px 5px",
  };

  // ======================================================
  // FIXED SMALL HEARTS
  // These stay on cream background
  // ======================================================

  const smallHearts = [
    { x: 45, y: 145, size: 34, rotate: -12 },
    { x: 900, y: 135, size: 30, rotate: 15 },

    { x: 25, y: 430, size: 27, rotate: 10 },
    { x: 940, y: 470, size: 30, rotate: -8 },

    { x: 55, y: 760, size: 35, rotate: -15 },
    { x: 900, y: 780, size: 32, rotate: 12 },

    { x: 80, y: 1050, size: 28, rotate: -8 },
    { x: 870, y: 1080, size: 30, rotate: 8 },

    { x: 500, y: 115, size: 25, rotate: 5 },
    { x: 500, y: 1120, size: 28, rotate: -5 },

    { x: 270, y: 80, size: 22, rotate: -10 },
    { x: 740, y: 90, size: 24, rotate: 10 },
  ];

  // ======================================================
  // HEART COMPONENT
  // ======================================================

  const SmallHearts = () => {
    return (
      <>
        {smallHearts.map((heart, index) => (
          <div
            key={index}
            style={{
              position: "absolute",

              left: heart.x,
              top: heart.y,

              fontSize: heart.size,
              lineHeight: 1,

              transform: `rotate(${heart.rotate}deg)`,

              color: "#b88982",

              opacity: 0.7,

              zIndex: 2,

              filter:
                "drop-shadow(0 2px 3px rgba(0,0,0,0.10))",

              pointerEvents: "none",
            }}
          >
            ♥
          </div>
        ))}
      </>
    );
  };

  // ======================================================
  // SCENE 1
  // 0 → 7.2 SEC
  // 9 POLAROID CARDS
  // ======================================================

  const scene1Start = 0;
  const scene1Duration = 216;

  const scene1Cards = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
  ];

  // ======================================================
  // SCENE 1 CARD POSITIONS
  // ======================================================

  const cardPositions = [
    { x: 50, y: 105 },
    { x: 395, y: 105 },
    { x: 740, y: 105 },

    { x: 50, y: 600 },
    { x: 395, y: 600 },
    { x: 740, y: 600 },

    { x: 50, y: 1095 },
    { x: 395, y: 1095 },
    { x: 740, y: 1095 },
  ];

  // ======================================================
  // SCENE 1 POLAROID
  // ======================================================

  const Scene1Polaroid = ({
    image,
    index,
  }: {
    image?: ImageItem;
    index: number;
  }) => {
    const position = cardPositions[index];

    const startFrame = index * 20;

    const localFrame = frame - startFrame;

    const opacity = interpolate(
      localFrame,
      [0, 8, 20],
      [0, 1, 1],
      clamp
    );

    const scale = interpolate(
      localFrame,
      [0, 20],
      [0.88, 1],
      clamp
    );

    const translateY = interpolate(
      localFrame,
      [0, 20],
      [35, 0],
      clamp
    );

    const rotateValues = [
      -1.2,
      0.8,
      -0.7,
      1,
      -0.8,
      1.1,
      -1,
      0.7,
      -0.9,
    ];

    const rotate = rotateValues[index] ?? 0;

    return (
      <div
        style={{
          position: "absolute",

          left: position.x,
          top: position.y,

          width: 285,
          height: 430,

          opacity,

          transform: `
            translateY(${translateY}px)
            scale(${scale})
            rotate(${rotate}deg)
          `,

          transformOrigin: "center center",

          zIndex: index + 1,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",

            backgroundColor: "#ffffff",

            borderRadius: 4,

            padding: 18,

            boxSizing: "border-box",

            boxShadow:
              "0 8px 20px rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 315,

              backgroundColor: "#f5f5f5",

              overflow: "hidden",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {image?.path && (
              <Img
                src={image.path}
                style={{
                  width: "100%",
                  height: "100%",

                  objectFit: "contain",

                  display: "block",
                }}
              />
            )}
          </div>

          <div
            style={{
              height: 75,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              fontSize: 42,

              lineHeight: 1,

              color: "#c90016",

              fontFamily: "Arial, sans-serif",
            }}
          >
            ♥
          </div>
        </div>
      </div>
    );
  };

  // ======================================================
  // SCENE 2
  // 7.2 → 11 SEC
  // 4 CARDS
  // CREAM BACKGROUND + FIXED HEARTS
  // ======================================================

  const scene2Start = 216;
  const scene2Duration = 114;

  const scene2Cards = [
    img10,
    img11,
    img12,
    img13,
  ];

  const scene2CardStarts = [
    0,
    29,
    57,
    86,
  ];

  // ======================================================
  // SCENE 2 POLAROID
  // ======================================================

 // ======================================================
// SCENE 2 POLAROID STACK
// COMPACT CENTER DESIGN
// ======================================================

const Scene2Polaroid = ({
  image,
  index,
}: {
  image?: ImageItem;
  index: number;
}) => {
  const localFrame = frame - scene2Start;

  const cardStart =
    scene2CardStarts[index] ?? 0;

  // Card abhi start nahi hua
  if (localFrame < cardStart) {
    return null;
  }

  const cardFrame =
    localFrame - cardStart;

  // ================================================
  // ENTRY
  // ================================================

  const progress = interpolate(
    cardFrame,
    [0, 16],
    [0, 1],
    clamp
  );

  // ================================================
  // CARD ROTATION
  // ================================================

  const rotations = [
    -5,
    4,
    -3,
    5,
  ];

  const rotation =
    rotations[index] ?? 0;

  // ================================================
  // STACK OFFSET
  // Every card slightly shifted
  // ================================================

  const stackOffsets = [
    { x: -28, y: 18 },
    { x: 22, y: -8 },
    { x: -15, y: 12 },
    { x: 0, y: 0 },
  ];

  const offset =
    stackOffsets[index] ?? {
      x: 0,
      y: 0,
    };

  // ================================================
  // ENTRY FROM BELOW
  // ================================================

  const translateY = interpolate(
    progress,
    [0, 1],
    [120, 0],
    clamp
  );

  // ================================================
  // ENTRY SCALE
  // ================================================

  const scale = interpolate(
    progress,
    [0, 1],
    [0.90, 1],
    clamp
  );

  // ================================================
  // OPACITY
  // ================================================

  const opacity = interpolate(
    cardFrame,
    [0, 6, 16],
    [0, 0.8, 1],
    clamp
  );

  // ================================================
  // CARD
  // ================================================

  return (
    <div
      style={{
        position: "absolute",

        /*
         * COMPACT CENTER
         */
        left: 145,
        top: 500,

        width: 850,
        height: 700,

        opacity,

        transform: `
          translate(
            ${offset.x}px,
            ${offset.y + translateY}px
          )
          scale(${scale})
          rotate(${rotation}deg)
        `,

        transformOrigin:
          "center center",

        zIndex: 10 + index,
      }}
    >

      {/* ==========================================
          WHITE BORDER CARD
      ========================================== */}

      <div
        style={{
          width: "100%",
          height: "100%",

          backgroundColor: "#ffffff",

          /*
           * THICK WHITE BORDER
           */
          padding: 18,

          boxSizing: "border-box",

          /*
           * SMALL ROUND CORNER
           */
          borderRadius: 3,

          /*
           * REAL PHOTO STACK SHADOW
           */
          boxShadow:
            "0 12px 28px rgba(0,0,0,0.22)",
        }}
      >

        {/* ========================================
            PHOTO
        ======================================== */}

        <div
          style={{
            width: "100%",
            height: "100%",

            overflow: "hidden",

            backgroundColor: "#eee",

            position: "relative",
          }}
        >

          {image?.path && (
            <Img
              src={image.path}
              style={{
                width: "100%",
                height: "100%",

                objectFit: "cover",

                display: "block",
              }}
            />
          )}

        </div>
      </div>
 
    </div>
    
  );
};
// ======================================================
// SCENE 3
// 11 → 22 SEC
//
// FULL SCREEN IMAGES
//
// img14 → img15 → img16 → img17
//
// Each image:
// Fade In → Slow Zoom → Fade Out
// ======================================================

const scene3Start = 330;
const scene3Duration = 330;

const scene3Images = [
  img14,
  img15,
  img16,
  img17,
];

// 11 sec / 4 images
// 82.5 frames per image
const scene3ImageDuration = scene3Duration / 4;

const scene3LocalFrame = frame - scene3Start;

// Current image
const scene3ImageIndex = Math.min(
  scene3Images.length - 1,
  Math.floor(scene3LocalFrame / scene3ImageDuration)
);

const currentScene3Image =
  scene3Images[scene3ImageIndex];

// Frame inside current image
const currentImageStart =
  scene3ImageIndex * scene3ImageDuration;

const imageLocalFrame =
  scene3LocalFrame - currentImageStart;

// ======================================================
// FADE
// ======================================================

const fadeDuration = 12;

const fadeIn = interpolate(
  imageLocalFrame,
  [0, fadeDuration],
  [0, 1],
  clamp
);

const fadeOut = interpolate(
  imageLocalFrame,
  [
    scene3ImageDuration - fadeDuration,
    scene3ImageDuration,
  ],
  [1, 0],
  clamp
);

const imageOpacity = Math.min(
  fadeIn,
  fadeOut
);

// ======================================================
// ZOOM
// ======================================================

// img14 → zoom IN
// img15 → zoom OUT
// img16 → zoom IN
// img17 → zoom OUT

const isZoomIn =
  scene3ImageIndex % 2 === 0;

const zoom = isZoomIn
  ? interpolate(
      imageLocalFrame,
      [0, scene3ImageDuration],
      [1, 1.08],
      clamp
    )
  : interpolate(
      imageLocalFrame,
      [0, scene3ImageDuration],
      [1.08, 1],
      clamp
    );

// ======================================================
// SLIGHT PAN
// ======================================================

const panX = isZoomIn
  ? interpolate(
      imageLocalFrame,
      [0, scene3ImageDuration],
      [-1.5, 1.5],
      clamp
    )
  : interpolate(
      imageLocalFrame,
      [0, scene3ImageDuration],
      [1.5, -1.5],
      clamp
    );

const panY = interpolate(
  imageLocalFrame,
  [0, scene3ImageDuration],
  [0, -1],
  clamp
);
  // ======================================================
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* ==================================================
          SCENE 1
      ================================================== */}

      <Sequence
        from={scene1Start}
        durationInFrames={scene1Duration}
      >
        <AbsoluteFill
          style={{
            backgroundColor: "#ffffff",
            overflow: "hidden",
          }}
        >
          {scene1Cards.map(
            (image, index) => (
              <Scene1Polaroid
                key={index}
                image={image}
                index={index}
              />
            )
          )}

          <AbsoluteFill
            style={{
              backgroundColor: "#000000",

              opacity: interpolate(
                frame,
                [204, 216],
                [0, 0.75],
                clamp
              ),

              zIndex: 100,

              pointerEvents: "none",
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* ==================================================
          SCENE 2
          CREAM BACKGROUND
          FIXED HEARTS
          4 CENTER CARDS
      ================================================== */}

      <Sequence
        from={scene2Start}
        durationInFrames={scene2Duration}
      >
        <AbsoluteFill
          style={{
            ...creamBackground,
            overflow: "hidden",
          }}
        >
          {/* FIXED BACKGROUND HEARTS */}

          <SmallHearts />

          {/* CARDS */}

          {scene2Cards.map(
            (image, index) => (
              <Scene2Polaroid
                key={index}
                image={image}
                index={index}
              />
            )
          )}
{/* ============================================
    SCENE 2 BOTTOM TEXT
    ONLY ONE TIME
============================================ */}

<div
  style={{
    position: "absolute",

    left: 0,
    right: 0,

    bottom: 220,

    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    textAlign: "center",

    zIndex: 70,
  }}
>
  <div
    style={{
      fontSize: 68,

      fontFamily:
        "'Brush Script MT', 'Segoe Script', cursive",

      color: "#4a4038",

      fontWeight: 400,

      letterSpacing: 1.5,

      lineHeight: 1.1,
    }}
  >
    you & me❤️Always Together
  </div>

  <div
    style={{
      marginTop: 8,

      fontSize: 28,

      color: "#b07e6e",

      fontFamily: "Georgia, serif",

      lineHeight: 1,
    }}
  >
    ♡♡♡♡
  </div>
</div>
          {/* SOFT VIGNETTE */}

          <AbsoluteFill
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(0,0,0,0.08))",

              pointerEvents: "none",

              zIndex: 80,
            }}
          />

          {/* END FADE */}

          <AbsoluteFill
            style={{
              backgroundColor: "#000000",

              opacity: interpolate(
                frame,
                [
                  scene2Start + 105,
                  scene2Start + 114,
                ],
                [0, 0.7],
                clamp
              ),

              zIndex: 100,

              pointerEvents: "none",
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* ==================================================
          SCENE 3
          11 → 22 SEC
          
          BIG FIXED CARD
          
          img14 → ZOOM IN
          img15 → ZOOM OUT
          img16 → ZOOM IN
          img17 → ZOOM OUT
      ================================================== */}
{/* ==================================================
    SCENE 3
    11 → 22 SEC

    FULL SCREEN PHOTO SLIDESHOW

    img14 → img15 → img16 → img17
================================================== */}

<Sequence
  from={scene3Start}
  durationInFrames={scene3Duration}
>
  <AbsoluteFill
    style={{
      backgroundColor: "#000000",
      overflow: "hidden",
    }}
  >

    {/* ==============================================
        CURRENT FULL SCREEN IMAGE
    ============================================== */}

    {currentScene3Image?.path && (
      <Img
        src={currentScene3Image.path}
        style={{
          position: "absolute",

          width: "100%",
          height: "100%",

          objectFit: "cover",

          opacity: imageOpacity,

          transform: `
            scale(${zoom})
            translate(${panX}px, ${panY}px)
          `,

          transformOrigin: "center center",

          display: "block",
        }}
      />
    )}

    {/* ==============================================
        SOFT CINEMATIC OVERLAY
    ============================================== */}

    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(0,0,0,0.18))",

        pointerEvents: "none",

        zIndex: 10,
      }}
    />

    {/* ==============================================
        SUBTLE VIGNETTE
    ============================================== */}

    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle, transparent 55%, rgba(0,0,0,0.22) 100%)",

        pointerEvents: "none",

        zIndex: 11,
      }}
    />

    {/* ==============================================
        SMALL HEART
    ============================================== */}

    <div
      style={{
        position: "absolute",

        right: 45,
        bottom: 55,

        fontSize: 48,

        opacity: 0.9,

        zIndex: 20,

        filter:
          "drop-shadow(0 4px 8px rgba(0,0,0,0.35))",
      }}
    >
      ♡
    </div>

    {/* ==============================================
        FINAL FADE
        21.6 → 22 SEC
    ============================================== */}

    <AbsoluteFill
      style={{
        backgroundColor: "#000000",

        opacity: interpolate(
          scene3LocalFrame,
          [318, 330],
          [0, 1],
          clamp
        ),

        pointerEvents: "none",

        zIndex: 100,
      }}
    />

  </AbsoluteFill>
</Sequence>
  

      {/* ==================================================
          MUSIC
      ================================================== */}

      {music?.path && (
        <MusicPlayer
          src={music.path}
          volume={music.volume ?? 1}
        />
      )}
    </AbsoluteFill>
  );
};

export default Template18;