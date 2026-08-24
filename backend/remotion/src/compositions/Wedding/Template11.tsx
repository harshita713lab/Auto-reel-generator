import React from "react";

import {
  AbsoluteFill,
  Img,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MusicPlayer } from "../../components";
// =====================================
// TYPES
// =====================================

interface ImageItem {
  path: string;
}

interface Template11Props {
  images?: ImageItem[];
    music?: string;

}

// =====================================
// TEMPLATE SETTINGS
// =====================================

export const IMAGE_COUNT = 18;

// 14 sec @ 30fps
export const DURATION_IN_FRAMES = 420;

export const DEFAULT_PROPS = {
  images: [],
  music: undefined,

};

// =====================================
// SCENE DURATIONS
// =====================================

// Scene 1 = 0 - 6 sec
const SCENE1_START = 0;
const SCENE1_DURATION = 180;

// Gap = 6 - 7 sec
const GAP_START = 180;
const GAP_DURATION = 30;

// Scene 2 = 7 - 10 sec
const SCENE2_START = 210;
const SCENE2_DURATION = 90;

// Scene 3 = 10 - 14 sec
const SCENE3_START = 300;
const SCENE3_DURATION = 120;


// =====================================================
// SCENE 1 CARD
// =====================================================

const FloatingCard = ({
  image,
  index,
  position,
}: {
  image: ImageItem;
  index: number;
  position: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Har image ka alag delay
  const delay = index * 10;

  const progress = spring({
    frame: frame - delay,
    fps,

    config: {
      damping: 14,
      stiffness: 90,
      mass: 0.8,
    },
  });

  // ==========================================
  // START POSITIONS
  // ==========================================

  const startPositions = [
    { x: -300, y: 0 },
    { x: 0, y: -300 },
    { x: 300, y: 0 },
    { x: -300, y: 300 },
    { x: 300, y: 300 },
    { x: -350, y: 200 },
    { x: 0, y: 400 },
    { x: 350, y: 200 },
  ];

  const pos =
    startPositions[index % startPositions.length];

  // ==========================================
  // MOVEMENT
  // ==========================================

  const translateX = interpolate(
    progress,
    [0, 1],
    [pos.x, 0]
  );

  const translateY = interpolate(
    progress,
    [0, 1],
    [pos.y, 0]
  );

  // ==========================================
  // ROTATION
  // ==========================================

  const rotate = interpolate(
    progress,
    [0, 1],
    [
      index % 2 === 0 ? -20 : 20,
      0,
    ]
  );

  // ==========================================
  // SCALE
  // ==========================================

  const scale = interpolate(
    progress,
    [0, 1],
    [0.4, 1]
  );

  // ==========================================
  // OPACITY
  // ==========================================

  const opacity = interpolate(
    progress,
    [0, 1],
    [0, 1]
  );

  return (
    <div
      style={{
        position: "absolute",

        left: position.left,
        top: position.top,

        width: position.width,
        height: position.height,

        border: "8px solid black",

        opacity,

        transform: `
          translate(${translateX}px, ${translateY}px)
          scale(${scale})
          rotate(${rotate}deg)
        `,

        borderRadius: 24,

        overflow: "hidden",

        boxShadow:
          "0 25px 60px rgba(0,0,0,0.5)",
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
  );
};


// =====================================================
// SCENE 1
// 0 - 6 SEC
// 8 IMAGES
// =====================================================

const Scene1 = ({
  images = [],
}: {
  images: ImageItem[];
}) => {
  const frame = useCurrentFrame();

  const positions = [
    {
      left: 20,
      top: 180,
      width: 330,
      height: 450,
    },

    {
      left: 375,
      top: 80,
      width: 330,
      height: 430,
    },

    {
      left: 730,
      top: 180,
      width: 330,
      height: 450,
    },

    {
      left: 180,
      top: 600,
      width: 330,
      height: 450,
    },

    {
      left: 560,
      top: 560,
      width: 330,
      height: 430,
    },

    {
      left: 20,
      top: 1050,
      width: 330,
      height: 450,
    },

    {
      left: 375,
      top: 980,
      width: 330,
      height: 430,
    },

    {
      left: 730,
      top: 1050,
      width: 330,
      height: 450,
    },
  ];

  // ==========================================
  // TEXT ANIMATION
  // Scene ke end mein text aayega
  // ==========================================

  const textOpacity = interpolate(
    frame,
    [100, 130],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const textY = interpolate(
    frame,
    [100, 130],
    [50, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,

        background:
          "linear-gradient(135deg, #F6E9D8 0%, #EBD7C5 50%, #DFC2B0 100%)",

        overflow: "hidden",
      }}
    >

      {/* ==========================================
          8 IMAGES
      ========================================== */}

      {images
        .slice(0, 8)
        .filter((img) => img?.path)
        .map((img, index) => (
          <FloatingCard
            key={index}
            image={img}
            index={index}
            position={positions[index]}
          />
        ))}


      {/* ==========================================
          TEXT
      ========================================== */}

      <div
        style={{
          position: "absolute",

          left: 0,
          right: 0,

          bottom: 200,

          textAlign: "center",

          fontSize: 80,

          fontFamily: "cursive",

          color: "#3a2b22",

          fontWeight: 600,

          opacity: textOpacity,

          transform: `
            translateY(${textY}px)
          `,

          textShadow:
            "0 3px 8px rgba(255,255,255,0.4)",
        }}
      >
        I Love You ❤️
      </div>
    </AbsoluteFill>
  );
};


// =====================================================
// SCENE 2 CARD
// =====================================================
const Scene2Card = ({
  image,
  index,
}: {
  image: ImageItem;
  index: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = index * 15;

  const progress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 12,
      stiffness: 80,
      mass: 0.8,
    },
  });

  const rotate = interpolate(
    progress,
    [0, 1],
    [
      index % 2 === 0 ? -15 : 15,
      index % 2 === 0 ? -3 : 3,
    ]
  );

  const cardScale = interpolate(
    progress,
    [0, 1],
    [0.7, 1]
  );

  const y = interpolate(
    progress,
    [0, 1],
    [300, 0]
  );

  const opacity = interpolate(
    progress,
    [0, 1],
    [0, 1]
  );

  return (
    <div
      style={{
        position: "absolute",

        left: "50%",
        top: "50%",

        width: 800,
        height: 1400,

        transform: `
          translate(-50%, -50%)
          translateY(${y}px)
          rotate(${rotate}deg)
          scale(${cardScale})
        `,

        opacity,

        background: "#fff",

        padding: 25,

        boxSizing: "border-box",

        borderRadius: 8,

        boxShadow:
          "0 30px 80px rgba(0,0,0,0.45)",

        overflow: "hidden",
      }}
    >
      {/* IMAGE AREA */}
      <div
        style={{
          width: "100%",
          height: "100%",

          overflow: "hidden",

          position: "relative",

          background: "#f7f4ed",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img
          src={image.path}
          style={{
            width: "100%",
            height: "100%",

            // IMPORTANT
            objectFit: "contain",

            objectPosition: "center",

            display: "block",

            // scale hata diya
          }}
        />
      </div>
    </div>
  );
};


// =====================================================
// SCENE 2
// 7 - 10 SEC
// 6 IMAGES
// images[8 - 13]
// =====================================================

const Scene2 = ({
  images = [],
}: {
  images: ImageItem[];
}) => {
  const frame = useCurrentFrame();

  const backgroundScale = interpolate(
    frame,
    [0, SCENE2_DURATION],
    [1, 1.15],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,

        background: "#000",

        overflow: "hidden",
      }}
    >

      {/* ==========================================
          BACKGROUND IMAGE
          images[8]
      ========================================== */}

      {images[8]?.path && (
        <Img
          src={images[8].path}
          style={{
            position: "absolute",

            width: "100%",
            height: "100%",

            objectFit: "cover",

            filter:
              "grayscale(100%) brightness(0.9) contrast(1.05)",

            transform:
              `scale(${backgroundScale})`,
          }}
        />
      )}


      {/* ==========================================
          DARK OVERLAY
      ========================================== */}

      <AbsoluteFill
        style={{
          background:
            "rgba(0,0,0,0.35)",
        }}
      />


      {/* ==========================================
          6 STACKED CARDS
          images[8 - 13]
      ========================================== */}

      {images
        .slice(8, 14)
        .filter((img) => img?.path)
        .map((img, index) => (
          <Scene2Card
            key={index}
            image={img}
            index={index}
          />
        ))}
    </AbsoluteFill>
  );
};


// =====================================================
// SCENE 3 CARD
// =====================================================
const Scene3Card = ({
  image,
  index,
  offsetY,
}: {
  image: ImageItem;
  index: number;
  offsetY: number;
}) => {
  /*
   * 1080 x 1920 composition
   *
   * Photos intentionally overlap.
   * This avoids the boring left-right grid.
   */

  const layouts = [
    {
      x: 70,
      y: 70,
      rotate: -3,
      scale: 1,
    },
    {
      x: 445,
      y: 245,
      rotate: 2.5,
      scale: 0.96,
    },
    {
      x: 85,
      y: 690,
      rotate: 1.8,
      scale: 0.98,
    },
    {
      x: 425,
      y: 850,
      rotate: -2.5,
      scale: 0.96,
    },
  ];

  const layout = layouts[index % layouts.length];

  return (
    <div
      style={{
        position: "absolute",

        left: layout.x,
        top: layout.y + offsetY,

        width: 500,
        height: 590,

        transform: `
          rotate(${layout.rotate}deg)
          scale(${layout.scale})
        `,

        transformOrigin: "center center",

        zIndex: index + 1,
      }}
    >
      {/* ======================================
          SOFT SHADOW
      ====================================== */}
      <div
        style={{
          position: "absolute",

          left: 15,
          right: 15,
          top: 20,
          bottom: 5,

          borderRadius: 8,

          background: "rgba(0,0,0,0.45)",

          filter: "blur(25px)",

          opacity: 0.7,
        }}
      />

      {/* ======================================
          PHOTO FRAME
      ====================================== */}
      <div
        style={{
          position: "absolute",

          inset: 0,

          padding: 14,

          boxSizing: "border-box",

          background:
            "linear-gradient(145deg, #fffdf8 0%, #f4eee3 100%)",

          borderRadius: 7,

          border:
            "1px solid rgba(255,255,255,0.85)",

          boxShadow:
            "0 12px 28px rgba(0,0,0,0.28)",
        }}
      >
        {/* ==================================
            INNER GOLD LINE
        ================================== */}
        <div
          style={{
            position: "absolute",

            inset: 8,

            borderRadius: 4,

            border:
              "1px solid rgba(171,139,88,0.28)",

            pointerEvents: "none",

            zIndex: 3,
          }}
        />

        {/* ==================================
            PHOTO AREA
        ================================== */}
        <div
          style={{
            position: "absolute",

            left: 23,
            right: 23,

            top: 23,
            bottom: 23,

            borderRadius: 4,

            overflow: "hidden",

            background: "#e8e2d7",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            boxShadow:
              "inset 0 0 18px rgba(0,0,0,0.08)",
          }}
        >
          <Img
            src={image.path}
            style={{
              width: "100%",
              height: "100%",

              /*
               * IMPORTANT:
               * contain = photo will NOT be cropped
               */
              objectFit: "contain",

              objectPosition: "center",

              display: "block",
            }}
          />

          {/* ==================================
              SOFT CINEMATIC OVERLAY
          ================================== */}
          <div
            style={{
              position: "absolute",

              inset: 0,

              background: `
                linear-gradient(
                  180deg,
                  rgba(255,255,255,0.08),
                  transparent 30%,
                  transparent 70%,
                  rgba(0,0,0,0.07)
                )
              `,

              pointerEvents: "none",
            }}
          />
        </div>

        {/* ==================================
            SMALL GOLD CORNER DETAILS
        ================================== */}

        <div
          style={{
            position: "absolute",

            left: 8,
            top: 8,

            width: 30,
            height: 30,

            borderTop:
              "1px solid rgba(180,145,90,0.45)",

            borderLeft:
              "1px solid rgba(180,145,90,0.45)",
          }}
        />

        <div
          style={{
            position: "absolute",

            right: 8,
            bottom: 8,

            width: 30,
            height: 30,

            borderBottom:
              "1px solid rgba(180,145,90,0.45)",

            borderRight:
              "1px solid rgba(180,145,90,0.45)",
          }}
        />
      </div>
    </div>
  );
};



// =====================================================
// SCENE 3
// 10 - 14 SEC
// 4 IMAGES
// images[14 - 17]
// MOVING UPWARD
// =====================================================

const Scene3 = ({
  images = [],
}: {
  images: ImageItem[];
}) => {
  const frame = useCurrentFrame();

  // ==========================================
  // Cards continuously move upward
  // ==========================================
  const offsetY = -frame * 4;

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,

        background: `
          radial-gradient(
            circle at 50% 25%,
            rgba(100, 75, 120, 0.20),
            transparent 32%
          ),
          radial-gradient(
            circle at 20% 75%,
            rgba(160, 110, 70, 0.12),
            transparent 28%
          ),
          linear-gradient(
            180deg,
            #071a3d 0%,
            #081f47 48%,
            #050d20 100%
          )
        `,

        overflow: "hidden",
      }}
    >
      {/* ==========================================
          SUBTLE LIGHT
      ========================================== */}
      <div
        style={{
          position: "absolute",

          width: 700,
          height: 700,

          borderRadius: "50%",

          left: 190,
          top: 500,

          background:
            "radial-gradient(circle, rgba(255,220,170,0.07), transparent 68%)",

          filter: "blur(20px)",
        }}
      />

      {/* ==========================================
          SUBTLE GOLD GLOW BEHIND TEXT
      ========================================== */}
      <div
        style={{
          position: "absolute",

          width: 600,
          height: 350,

          left: 240,
          top: 1450,

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(196,155,95,0.09), transparent 70%)",

          filter: "blur(30px)",
        }}
      />

      {/* ==========================================
          IMAGES 15 - 18
      ========================================== */}
      {images
        .slice(14, 18)
        .filter((img) => img?.path)
        .map((img, index) => (
          <Scene3Card
            key={index}
            image={img}
            index={index}
            offsetY={offsetY}
          />
        ))}

      {/* ==========================================
          BOTTOM WEDDING TEXT
      ========================================== */}
      <div
        style={{
          position: "absolute",

          left: 0,
          right: 0,

          top: 1465,

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          justifyContent: "center",

          textAlign: "center",

          zIndex: 20,

          opacity: 0.98,
        }}
      >
        {/* small top ornament */}
        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: 16,

            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 70,
              height: 1,

              background:
                "linear-gradient(90deg, transparent, rgba(211,174,112,0.8))",
            }}
          />

          <div
            style={{
              fontSize: 18,

              color: "#d8b878",

              lineHeight: 1,
            }}
          >
            ✦
          </div>

          <div
            style={{
              width: 70,
              height: 1,

              background:
                "linear-gradient(90deg, rgba(211,174,112,0.8), transparent)",
            }}
          />
        </div>

        {/* ======================================
            SMALL HEADING
        ====================================== */}
        <div
          style={{
            fontFamily: "serif",

            fontSize: 17,

            letterSpacing: 7,

            color: "#d8c29c",

            marginBottom: 12,

            textTransform: "uppercase",
          }}
        >
          SOME STORIES
        </div>

        {/* ======================================
            MAIN TEXT
        ====================================== */}
        <div
          style={{
            fontFamily: "serif",

            fontSize: 34,

            letterSpacing: 3,

            color: "#f5ead5",

            lineHeight: 1.25,

            fontWeight: 400,
          }}
        >
          ARE MEANT TO LAST
        </div>

        {/* ======================================
            FOREVER
        ====================================== */}
        <div
          style={{
            marginTop: 4,

            fontFamily: "serif",

            fontSize: 64,

            letterSpacing: 8,

            color: "#d9b474",

            lineHeight: 1.15,

            fontWeight: 400,

            textShadow:
              "0 3px 18px rgba(0,0,0,0.35)",
          }}
        >
          FOREVER
        </div>

        {/* ======================================
            DECORATIVE LINE
        ====================================== */}
        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: 10,

            marginTop: 16,
          }}
        >
          <div
            style={{
              width: 95,
              height: 1,

              background:
                "linear-gradient(90deg, transparent, #b99660)",
            }}
          />

          <div
            style={{
              width: 7,
              height: 7,

              transform: "rotate(45deg)",

              border:
                "1px solid #c7a66f",

              background: "#071a3d",
            }}
          />

          <div
            style={{
              width: 95,
              height: 1,

              background:
                "linear-gradient(90deg, #b99660, transparent)",
            }}
          />
        </div>

        {/* ======================================
            SMALL ENDING TEXT
        ====================================== */}
        <div
          style={{
            marginTop: 18,

            fontFamily: "cursive",

            fontSize: 25,

            color: "#d8c09a",

            letterSpacing: 2,
          }}
        >
          our beautiful beginning
        </div>
      </div>
    </AbsoluteFill>
  );
};


// =====================================================
// MAIN TEMPLATE 26
// =====================================================

export const Template11 = ({
  images = [],
    music = undefined,

}: Template11Props) => {
   const musicSrc = music; // ✅ कोई Fallback नहीं – सिर्फ Backend से आने पर ही Play होगी

  console.log("🎵 Template5 musicSrc:", musicSrc); // Debug Log
  return (
    
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,

        background: "#f8f5f0",
      }}
    >
  {musicSrc && (
        <MusicPlayer
          src={musicSrc}
          volume={0.8}
          loop={true}
          showVisualizer={true}
        />
      )}
      {/* ==========================================
          SCENE 1
          0 - 6 SEC
          180 FRAMES
          8 IMAGES
      ========================================== */}

      <Sequence
        from={SCENE1_START}
        durationInFrames={SCENE1_DURATION}
      >
        <Scene1
          images={images}
        />
      </Sequence>


      {/* ==========================================
          GAP
          6 - 7 SEC
          30 FRAMES
      ========================================== */}

      <Sequence
        from={GAP_START}
        durationInFrames={GAP_DURATION}
      >
        <AbsoluteFill
          style={{
            background: "#f8f5f0",
          }}
        />
      </Sequence>


      {/* ==========================================
          SCENE 2
          7 - 10 SEC
          90 FRAMES
          6 IMAGES
      ========================================== */}

      <Sequence
        from={SCENE2_START}
        durationInFrames={SCENE2_DURATION}
      >
        <Scene2
          images={images}
        />
      </Sequence>


      {/* ==========================================
          SCENE 3
          10 - 14 SEC
          120 FRAMES
          4 IMAGES
      ========================================== */}

      <Sequence
        from={SCENE3_START}
        durationInFrames={SCENE3_DURATION}
      >
        <Scene3
          images={images}
        />
      </Sequence>

    </AbsoluteFill>
  );
};

export default Template11;