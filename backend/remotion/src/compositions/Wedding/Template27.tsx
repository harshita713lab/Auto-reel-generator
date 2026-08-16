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

interface Template27Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// GLOBAL
// ======================================================

export const FPS = 30;

// 18.5 seconds
export const DURATION_IN_FRAMES = 555;

export const IMAGE_COUNT = 9;

// ======================================================
// TIMING
// ======================================================

// Scene 1
// 0 → 2 sec
export const SCENE1_START = 0;
export const SCENE1_DURATION = 60;

// Scene 2
// 2 → 3 sec
export const SCENE2_START = 60;
export const SCENE2_DURATION = 30;

// Scene 3
// 3 → 18.5 sec
export const SCENE3_START = 90;
export const SCENE3_DURATION = 465;

// ======================================================
// SCENE 3 IMAGE TIMING
// ======================================================
//
// Scene 3 = 465 frames
//
// 9 images
//
// 465 / 9 = 51.67 frames
//
// Timing:
// Image 1 → 90  frames
// Image 2 → 52  frames
// Image 3 → 52  frames
// Image 4 → 52  frames
// Image 5 → 52  frames
// Image 6 → 51  frames
// Image 7 → 51  frames
// Image 8 → 51  frames
// Image 9 → 51  frames
//
// Total = 465 frames
// ======================================================

const SCENE3_IMAGE_DURATIONS = [
  52, // image 1
  52, // image 2
  52, // image 3
  52, // image 4
  52, // image 5
  51, // image 6
  51, // image 7
  51, // image 8
  51, // image 9
];

// ======================================================
// COMMON
// ======================================================

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// SCENE 1
// 6 IMAGE COLLAGE
// 0 → 2 SEC
// ======================================================

interface Scene1Props {
  images: ImageItem[];
}
export const Scene1: React.FC<Scene1Props> = ({ images }) => {
  const frame = useCurrentFrame();

  const card = (
    image: ImageItem,
    index: number,
    left: number,
    top: number,
    rotate: number,
    delay: number
  ) => {

    // ------------------------------------------
    // CARD APPEAR
    // ------------------------------------------

    const opacity = interpolate(
      frame,
      [delay, delay + 6],
      [0, 1],
      clamp
    );

    // ------------------------------------------
    // CARD POP-IN
    // ------------------------------------------

    const progress = interpolate(
      frame,
      [delay, delay + 14],
      [0, 1],
      {
        ...clamp,
        easing: Easing.out(Easing.back(1.2)),
      }
    );

    const scale = interpolate(
      progress,
      [0, 1],
      [0.8, 1],
      clamp
    );

    const y = interpolate(
      progress,
      [0, 1],
      [45, 0],
      clamp
    );

    return (
      <Img
        key={index}
        src={image.path}
        style={{
          position: "absolute",

          left: `${left}%`,
          top: `${top}%`,

          // BIG POLAROID
          width: 300,
          height: 390,

          objectFit: "cover",

          padding: 10,

          backgroundColor: "#fff",

          boxShadow:
            "0 10px 28px rgba(150,60,90,0.25)",

          opacity,

          transform: `
            translate(-50%, -50%)
            translateY(${y}px)
            rotate(${rotate}deg)
            scale(${scale})
          `,

          zIndex: 10 + index,
        }}
      />
    );
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >

      {/* ==========================================
          BEAUTIFUL PINK / GOLD BACKGROUND
          ========================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,

          background:
            "linear-gradient(135deg, #fff7fa 0%, #fce4ec 45%, #fff0f5 100%)",

          zIndex: 0,
        }}
      />

      {/* ==========================================
          SOFT PINK GLOW - TOP LEFT
          ========================================== */}

      <div
        style={{
          position: "absolute",

          width: 500,
          height: 500,

          left: -230,
          top: -180,

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(242,81,135,0.20) 0%, rgba(242,81,135,0) 70%)",

          zIndex: 1,
        }}
      />

      {/* ==========================================
          GOLD GLOW - TOP RIGHT
          ========================================== */}

      <div
        style={{
          position: "absolute",

          width: 430,
          height: 430,

          right: -180,
          top: 80,

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0) 70%)",

          zIndex: 1,
        }}
      />

      {/* ==========================================
          PINK GLOW - BOTTOM
          ========================================== */}

      <div
        style={{
          position: "absolute",

          width: 600,
          height: 600,

          left: "50%",
          bottom: -450,

          transform: "translateX(-50%)",

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(242,81,135,0.15) 0%, rgba(242,81,135,0) 70%)",

          zIndex: 1,
        }}
      />

      {/* ==========================================
          DECORATIVE CIRCLES
          ========================================== */}

      <div
        style={{
          position: "absolute",

          left: 55,
          top: 320,

          width: 28,
          height: 28,

          border:
            "2px solid rgba(212,175,55,0.35)",

          borderRadius: "50%",

          zIndex: 2,
        }}
      />

      <div
        style={{
          position: "absolute",

          right: 55,
          top: 420,

          width: 18,
          height: 18,

          border:
            "2px solid rgba(242,81,135,0.30)",

          borderRadius: "50%",

          zIndex: 2,
        }}
      />

      <div
        style={{
          position: "absolute",

          right: 75,
          bottom: 250,

          width: 14,
          height: 14,

          backgroundColor:
            "rgba(212,175,55,0.35)",

          borderRadius: "50%",

          zIndex: 2,
        }}
      />

      {/* ==========================================
          SMALL HEART DECORATIONS
          ========================================== */}

      <div
        style={{
          position: "absolute",

          left: 75,
          top: 105,

          fontSize: 28,

          color: "#f25187",

          opacity: 0.22,

          transform: "rotate(-15deg)",

          zIndex: 2,
        }}
      >
        ♥
      </div>

      <div
        style={{
          position: "absolute",

          right: 65,
          top: 290,

          fontSize: 24,

          color: "#d4af37",

          opacity: 0.28,

          transform: "rotate(15deg)",

          zIndex: 2,
        }}
      >
        ♥
      </div>

      <div
        style={{
          position: "absolute",

          left: 85,
          bottom: 180,

          fontSize: 30,

          color: "#f25187",

          opacity: 0.20,

          transform: "rotate(-10deg)",

          zIndex: 2,
        }}
      >
        ♥
      </div>

      {/* ==========================================
          GOLDEN SPARKLES
          ========================================== */}

      <div
        style={{
          position: "absolute",

          left: 105,
          top: 470,

          color: "#d4af37",

          fontSize: 26,

          opacity: 0.45,

          zIndex: 2,
        }}
      >
        ✦
      </div>

      <div
        style={{
          position: "absolute",

          right: 100,
          top: 145,

          color: "#d4af37",

          fontSize: 22,

          opacity: 0.40,

          zIndex: 2,
        }}
      >
        ✦
      </div>

      <div
        style={{
          position: "absolute",

          right: 110,
          bottom: 150,

          color: "#f25187",

          fontSize: 20,

          opacity: 0.35,

          zIndex: 2,
        }}
      >
        ✦
      </div>


      {/* ==========================================
          6 POLAROID CARDS
          ========================================== */}

      {/* CARD 1 */}
      {images[0] &&
        card(
          images[0],
          0,
          32,
          18,
          -4,
          0
        )}

      {/* CARD 2 */}
      {images[1] &&
        card(
          images[1],
          1,
          68,
          18,
          4,
          8
        )}

      {/* CARD 3 - CENTER */}
      {images[2] &&
        card(
          images[2],
          2,
          50,
          40,
          -2,
          16
        )}

      {/* CARD 4 */}
      {images[3] &&
        card(
          images[3],
          3,
          30,
          62,
          3,
          24
        )}

      {/* CARD 5 */}
      {images[4] &&
        card(
          images[4],
          4,
          70,
          62,
          -4,
          32
        )}

      {/* CARD 6 */}
      {images[5] &&
        card(
          images[5],
          5,
          50,
          82,
          2,
          40
        )}

    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 2
// TITLE + 1 IMAGE
// 2 → 3 SEC
// ======================================================

interface Scene2Props {
  image?: ImageItem;
}

export const Scene2: React.FC<Scene2Props> = ({ image }) => {
  const frame = useCurrentFrame();

  // ==================================================
  // TITLE OPACITY
  // ==================================================

  const titleOpacity = interpolate(
    frame,
    [0, 5, 13, 18],
    [0, 1, 1, 0],
    clamp
  );

  // ==================================================
  // TITLE SCALE
  // ==================================================

  const titleScale = interpolate(
    frame,
    [0, 8, 18],
    [0.65, 1, 0.95],
    {
      ...clamp,
      easing: Easing.out(Easing.back(1.2)),
    }
  );

  // ==================================================
  // TITLE Y
  // Text starts center and moves slightly upward
  // ==================================================

  const titleY = interpolate(
    frame,
    [0, 10, 18],
    [30, 0, -15],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ==================================================
  // IMAGE OPACITY
  // Image comes AFTER title
  // ==================================================

  const imageOpacity = interpolate(
    frame,
    [8, 13, 30],
    [0, 1, 1],
    clamp
  );

  // ==================================================
  // IMAGE SCALE
  // Smooth zoom in
  // ==================================================

  const imageScale = interpolate(
    frame,
    [8, 30],
    [0.82, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  // ==================================================
  // IMAGE Y
  // ==================================================

  const imageY = interpolate(
    frame,
    [8, 20],
    [80, 0],
    {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }
  );

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #f7e8ec 0%, #ffffff 100%)",
        overflow: "hidden",
      }}
    >

      {/* ==================================================
          SOFT HEART BACKGROUND
          ================================================== */}

      <div
        style={{
          position: "absolute",

          left: "50%",
          top: "55%",

          transform:
            "translate(-50%, -50%)",

          fontSize: 330,

          opacity: 0.08,

          zIndex: 1,
        }}
      >
        ❤️
      </div>

      {/* ==================================================
          TITLE
          ================================================== */}

      <div
        style={{
          position: "absolute",

          left: "50%",
          top: "18%",

          width: "95%",

          transform: `
            translateX(-50%)
            translateY(${titleY}px)
            scale(${titleScale})
          `,

          textAlign: "center",

          opacity: titleOpacity,

          zIndex: 20,
        }}
      >

        {/* HAPPY */}

        <div
          style={{
            color: "#111",

            fontFamily:
              "cursive",

            fontSize: 56,

            fontWeight: 700,

            lineHeight: 1.05,

            textShadow:
              "0 2px 5px rgba(0,0,0,0.15)",
          }}
        >
          Happy
        </div>

        {/* WEDDING */}

        <div
          style={{
            color: "#ffd21f",

            fontFamily:
              "cursive",

            fontSize: 42,

            fontWeight: 900,

            lineHeight: 1.1,

            marginTop: 4,

            textShadow: `
              0 2px 0 #000,
              0 3px 7px rgba(0,0,0,0.35)
            `,
          }}
        >
          Wedding
        </div>

      </div>

      {/* ==================================================
          IMAGE
          ================================================== */}

      {image && (
        <Img
          src={image.path}
          style={{
            position: "absolute",

            left: "50%",
            bottom: "-2%",

            width: "88%",
            height: "68%",

            objectFit: "cover",

            transform: `
              translateX(-50%)
              translateY(${imageY}px)
              scale(${imageScale})
            `,

            opacity: imageOpacity,

            borderRadius: 22,

            boxShadow:
              "0 12px 35px rgba(0,0,0,0.25)",

            zIndex: 10,
          }}
        />
      )}

    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 3
// 9 IMAGES
// ONE BY ONE
// FULL SCREEN
// ZOOM IN
// ======================================================

interface Scene3Props {
  images: ImageItem[];
}

export const Scene3: React.FC<Scene3Props> = ({
  images,
}) => {
  const frame = useCurrentFrame();

  // ====================================================
  // FIND CURRENT IMAGE
  // ====================================================

  let currentImageIndex = 0;

  let accumulatedFrames = 0;

  for (
    let i = 0;
    i < SCENE3_IMAGE_DURATIONS.length;
    i++
  ) {
    const duration =
      SCENE3_IMAGE_DURATIONS[i];

    if (
      frame >= accumulatedFrames &&
      frame <
        accumulatedFrames + duration
    ) {
      currentImageIndex = i;
      break;
    }

    accumulatedFrames += duration;
  }

  // ====================================================
  // LOCAL FRAME
  // ====================================================

  const imageStartFrame =
    SCENE3_IMAGE_DURATIONS
      .slice(0, currentImageIndex)
      .reduce(
        (sum, duration) =>
          sum + duration,
        0
      );

  const localFrame =
    frame - imageStartFrame;

  const currentDuration =
    SCENE3_IMAGE_DURATIONS[
      currentImageIndex
    ];

  const image =
    images[currentImageIndex];

  if (!image) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
        }}
      />
    );
  }

  // ====================================================
  // FADE IN
  // ====================================================

  const opacity = interpolate(
    localFrame,
    [0, 5],
    [0, 1],
    clamp
  );

  // ====================================================
  // ZOOM IN
  // ====================================================

  const scale = interpolate(
    localFrame,
    [0, currentDuration],
    [1, 1.12],
    {
      ...clamp,
      easing: Easing.inOut(
        Easing.quad
      ),
    }
  );

  // ====================================================
  // SLIGHT PAN
  // ====================================================

  const x = interpolate(
    localFrame,
    [0, currentDuration],
    [-8, 8],
    clamp
  );

  const y = interpolate(
    localFrame,
    [0, currentDuration],
    [5, -5],
    clamp
  );

  // ====================================================
  // IMAGE
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      <Img
        src={image.path}
        style={{
          position: "absolute",

          left: 0,
          top: 0,

          width: "100%",
          height: "100%",

          objectFit: "cover",

          opacity,

          transform: `
            translate(${x}px, ${y}px)
            scale(${scale})
          `,
        }}
      />

      {/* DARK GRADIENT */}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.02), rgba(0,0,0,0.48))",

          pointerEvents: "none",
        }}
      />

     

   

      <div
        style={{
          position: "absolute",

          left: "50%",
          bottom: "15%",

          transform:
            "translateX(-50%)",

          width: "90%",

          textAlign: "center",
color: "#D4AF37",

           fontFamily:
      '"Segoe Script", "Brush Script MT", "Lucida Handwriting", cursive',

          fontSize: 48,

          fontWeight: 800,

          textShadow:
            "0 2px 7px rgba(0,0,0,0.95)",

          zIndex: 20,
        }}
      >
        OUR FOREVER
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// TEMPLATE 26
// ======================================================

export const Template27: React.FC<
  Template27Props
> = ({
  images = [],
  music,
}) => {

  // ====================================================
  // VALIDATE IMAGES
  // ====================================================

  const validImages = images.filter(
    (
      image
    ): image is ImageItem =>
      Boolean(
        image &&
        typeof image.path === "string" &&
        image.path.trim()
      )
  );

  // ====================================================
  // IMAGE COUNT
  // ====================================================

  if (validImages.length < IMAGE_COUNT) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000",

          color: "#fff",

          justifyContent:
            "center",

          alignItems: "center",

          fontSize: 35,

          textAlign: "center",

          padding: 40,
        }}
      >
        Need at least {IMAGE_COUNT} valid
        images.
        {"\n"}
        Received: {validImages.length}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >

      {/* ==================================================
          MUSIC
          ================================================== */}

      {music?.path && (
        <MusicPlayer
          src={music.path}
          volume={music.volume ?? 1}
        />
      )}

      {/* ==================================================
          SCENE 1
          0 → 2 SEC
          6 IMAGES
          ================================================== */}

      <Sequence
        from={SCENE1_START}
        durationInFrames={
          SCENE1_DURATION
        }
      >
        <Scene1
          images={[
            validImages[0],
            validImages[1],
            validImages[2],
            validImages[3],
            validImages[4],
            validImages[5],
          ]}
        />
      </Sequence>

      {/* ==================================================
          SCENE 2
          2 → 3 SEC
          1 IMAGE
          ================================================== */}

      <Sequence
        from={SCENE2_START}
        durationInFrames={
          SCENE2_DURATION
        }
      >
        <Scene2
          image={validImages[6]}
        />
      </Sequence>

      {/* ==================================================
          SCENE 3
          3 → 18.5 SEC
          9 IMAGES
          ONE BY ONE
          ================================================== */}

      <Sequence
        from={SCENE3_START}
        durationInFrames={
          SCENE3_DURATION
        }
      >
        <Scene3
          images={[
            validImages[0],
            validImages[1],
            validImages[2],
            validImages[3],
            validImages[4],
            validImages[5],
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

export default Template27;