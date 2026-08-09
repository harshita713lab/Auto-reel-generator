import React from "react";

import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";

// ======================================================
// INTERFACE
// ======================================================

interface ImageItem {
  path: string;
}

interface Template29Props {
  images?: ImageItem[];
}

const Scene1: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  // ============================================
  // SCENE 1
  // 0s → 2s
  // 4 IMAGES
  // ============================================

  const sceneImages = images
    .slice(0, 4)
    .filter((img) => img?.path);

  // ============================================
  // 4 IMAGES → 2x2 GRID
  // ============================================

  const positions = [
    { left: 35, top: 280 },
    { left: 555, top: 280 },
    { left: 35, top: 960 },
    { left: 555, top: 960 },
  ];

  // ============================================
  // CARD SIZE
  // ============================================

  const CARD_WIDTH = 490;
  const CARD_HEIGHT = 630;

  // ============================================
  // HEART FLOAT ANIMATION
  // ============================================

  const float1 = Math.sin(frame * 0.08) * 6;
  const float2 = Math.sin(frame * 0.065 + 1) * 7;
  const float3 = Math.sin(frame * 0.09 + 2) * 5;
  const float4 = Math.sin(frame * 0.07 + 3) * 6;
  const float5 = Math.sin(frame * 0.085 + 4) * 5;
  const float6 = Math.sin(frame * 0.06 + 5) * 7;

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#f6e9e9",
        overflow: "hidden",
      }}
    >

      {/* ==========================================
          BACKGROUND
      ========================================== */}

      <AbsoluteFill
        style={{
          backgroundColor: "#f6e9e9",
        }}
      />

      {/* ==========================================
          4 IMAGE GRID
      ========================================== */}

      {sceneImages.map((img, index) => {
        const position = positions[index];

        // Each image appears one after another

        const startFrame = index * 8;
        const endFrame = startFrame + 12;

        const opacity = interpolate(
          frame,
          [startFrame, endFrame],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const scale = interpolate(
          frame,
          [startFrame, endFrame],
          [0.92, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        return (
          <div
            key={index}
            style={{
              position: "absolute",

              left: position.left,
              top: position.top,

              width: CARD_WIDTH,
              height: CARD_HEIGHT,

              opacity,

              transform: `scale(${scale})`,

              transformOrigin: "center center",

              backgroundColor: "#ffffff",

              borderRadius: 18,

              padding: 12,

              boxSizing: "border-box",

              boxShadow:
                "0 8px 25px rgba(0,0,0,0.18)",

              overflow: "hidden",

              zIndex: 2,
            }}
          >
            <Img
              src={img.path}
              style={{
                width: "100%",
                height: "100%",

                objectFit: "cover",

                objectPosition: "center",

                borderRadius: 10,

                display: "block",
              }}
            />
          </div>
        );
      })}

      {/* ==========================================
          DECORATIVE HEARTS
      ========================================== */}

      {/* Top Left */}
      <div
        style={{
          position: "absolute",
          left: 45,
          top: 115,

          fontSize: 65,
          color: "rgba(220,130,150,0.45)",

          transform: `translateY(${float1}px) rotate(-20deg)`,

          lineHeight: 1,

          zIndex: 5,
        }}
      >
        ♡
      </div>

      {/* Top Center */}
      <div
        style={{
          position: "absolute",
          left: 505,
          top: 120,

          fontSize: 90,
          color: "rgba(220,130,150,0.55)",

          transform: `translateY(${float2}px) rotate(-12deg)`,

          lineHeight: 1,

          zIndex: 5,
        }}
      >
        ♡
      </div>

      {/* Top Right */}
      <div
        style={{
          position: "absolute",
          right: 45,
          top: 180,

          fontSize: 48,
          color: "rgba(220,130,150,0.40)",

          transform: `translateY(${float3}px) rotate(18deg)`,

          lineHeight: 1,

          zIndex: 5,
        }}
      >
        ♡
      </div>

      {/* Middle Left */}
      <div
        style={{
          position: "absolute",
          left: 5,
          top: 820,

          fontSize: 55,
          color: "rgba(220,130,150,0.38)",

          transform: `translateY(${float4}px) rotate(-15deg)`,

          lineHeight: 1,

          zIndex: 5,
        }}
      >
        ♡
      </div>

      {/* Middle Right */}
      <div
        style={{
          position: "absolute",
          right: 10,
          top: 860,

          fontSize: 60,
          color: "rgba(220,130,150,0.42)",

          transform: `translateY(${float5}px) rotate(20deg)`,

          lineHeight: 1,

          zIndex: 5,
        }}
      >
        ♡
      </div>

      {/* Bottom Left */}
      <div
        style={{
          position: "absolute",
          left: 55,
          bottom: 150,

          fontSize: 45,
          color: "rgba(220,130,150,0.35)",

          transform: `translateY(${float6}px) rotate(12deg)`,

          lineHeight: 1,

          zIndex: 5,
        }}
      >
        ♡
      </div>

      {/* Bottom Right */}
      <div
        style={{
          position: "absolute",
          right: 55,
          bottom: 120,

          fontSize: 70,
          color: "rgba(220,130,150,0.45)",

          transform: `translateY(${float2}px) rotate(15deg)`,

          lineHeight: 1,

          zIndex: 5,
        }}
      >
        ♡
      </div>

    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 2
// 2s → 4s
// 6 IMAGES - FAST SLIDESHOW
// ======================================================

const Scene2: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  // ====================================================
  // 6 IMAGES
  // ====================================================

  const sceneImages = images
    .slice(0, 6)
    .filter((img) => img?.path);

  // ====================================================
  // TOTAL SCENE = 2 SECONDS
  // 30 FPS × 2 = 60 FRAMES
  // ====================================================

  const totalFrames = 60;

  // 6 images
  // 60 / 6 = 10 frames per image
  const imageDuration = 10;

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >

      {sceneImages.map((img, index) => {
        const start = index * imageDuration;
        const end = start + imageDuration;

        // =================================================
        // FADE / FAST TRANSITION
        // =================================================

        const opacity = interpolate(
          frame,
          [
            start,
            start + 2,
            end - 2,
            end,
          ],
          [
            0,
            1,
            1,
            0,
          ],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        // =================================================
        // SLIGHT ZOOM
        // =================================================

        const scale = interpolate(
          frame,
          [
            start,
            end,
          ],
          [
            1,
            1.06,
          ],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        return (
          <AbsoluteFill
            key={index}
            style={{
              opacity,
              alignItems: "center",
              justifyContent: "center",
              zIndex: index,
              overflow: "hidden",
            }}
          >

            {/* =========================================
                IMAGE CARD
            ========================================= */}

            <div
              style={{
                width: 1000,
                height: 1550,

                position: "relative",

                overflow: "hidden",

                borderRadius: 16,

                backgroundColor: "#111",

                boxShadow:
                  "0 0 35px rgba(0,0,0,0.9)",
              }}
            >

              <Img
                src={img.path}
                style={{
                  width: "100%",
                  height: "100%",

                  objectFit: "cover",
                  objectPosition: "center",

                  transform: `scale(${scale})`,
                  transformOrigin: "center center",

                  display: "block",
                }}
              />

            </div>

          </AbsoluteFill>
        );
      })}

    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 3
// 4s → 7s
//
// IMAGE 1 → TOP LEFT  → LEFT TO RIGHT
// IMAGE 2 → TOP RIGHT → RIGHT TO LEFT
// IMAGE 3 → BOTTOM
// ======================================================

const Scene3: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const sceneImages = images
    .slice(0, 3)
    .filter((img) => img?.path);

  const WIDTH = 1080;
  const HEIGHT = 1920;

  // ====================================================
  // BACKGROUND IMAGE
  // ====================================================

  const backgroundScale = interpolate(
    frame,
    [0, 150],
    [1, 1.08],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const backgroundOpacity = interpolate(
    frame,
    [0, 45, 90, 135, 180],
    [0.65, 0.85, 0.7, 0.9, 0.75],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // IMAGE 1
  // LEFT → RIGHT → COMPLETELY OUT
  // ====================================================

  const image1X = interpolate(
    frame,
    [0, 25, 55],
    [-900, 0, 1200],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // IMAGE 2
  // LEFT → RIGHT → COMPLETELY OUT
  // थोड़ी देर बाद शुरू होगी
  // ====================================================

  const image2X = interpolate(
    frame,
    [30, 55, 85],
    [-900, 0, 1200],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // LAYOUT
  // ====================================================

  const IMAGE_WIDTH = 780;
  const IMAGE_HEIGHT = 650;

  const IMAGE_LEFT = 70;

  // Image 1
  const IMAGE1_TOP = 180;

  // Image 2 नीचे + gap
  const GAP = 45;

  const IMAGE2_TOP =
    IMAGE1_TOP + IMAGE_HEIGHT + GAP;

  return (
    <AbsoluteFill
      style={{
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >

      {/* ==================================================
          BACKGROUND IMAGE — IMAGE 3
      ================================================== */}

      {sceneImages[2]?.path && (
        <AbsoluteFill
          style={{
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <Img
            src={sceneImages[2].path}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",

              transform: `scale(${backgroundScale})`,

              opacity: backgroundOpacity,

              filter:
                "brightness(0.55) contrast(1.08) saturate(0.85) blur(1px)",
            }}
          />

          {/* Dark Overlay */}

          <AbsoluteFill
            style={{
              background:
                "linear-gradient(" +
                "180deg," +
                "rgba(0,0,0,0.35) 0%," +
                "rgba(0,0,0,0.15) 45%," +
                "rgba(0,0,0,0.55) 100%" +
                ")",
            }}
          />
        </AbsoluteFill>
      )}

      {/* ==================================================
          IMAGE 1
          LEFT → RIGHT → OUT
      ================================================== */}

      {sceneImages[0]?.path && (
        <div
          style={{
            position: "absolute",

            left: IMAGE_LEFT,
            top: IMAGE1_TOP,

            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,

            overflow: "hidden",

            transform: `translateX(${image1X}px)`,

            zIndex: 5,

            borderRadius: 8,

            boxShadow:
              "0 15px 45px rgba(0,0,0,0.5)",
          }}
        >
          <Img
            src={sceneImages[0].path}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",
              objectPosition: "center",

              display: "block",
            }}
          />
        </div>
      )}

      {/* ==================================================
          IMAGE 2
          LEFT → RIGHT → OUT
          BELOW IMAGE 1
      ================================================== */}

      {sceneImages[1]?.path && (
        <div
          style={{
            position: "absolute",

            left: IMAGE_LEFT,
            top: IMAGE2_TOP,

            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,

            overflow: "hidden",

            transform: `translateX(${image2X}px)`,

            zIndex: 5,

            borderRadius: 8,

            boxShadow:
              "0 15px 45px rgba(0,0,0,0.5)",
          }}
        >
          <Img
            src={sceneImages[1].path}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",
              objectPosition: "center",

              display: "block",
            }}
          />
        </div>
      )}

    </AbsoluteFill>
  );
};






export const Template29 = ({
  images = [],
}: Template29Props) => {
  return (
    <>
      {/* ==================================================
          SCENE 1
          0s → 2s
          60 FRAMES
          4 IMAGES
      ================================================== */}

      <Sequence
        from={0}
        durationInFrames={60}
      >
        <Scene1
          images={images.slice(0, 4)}
        />
      </Sequence>


      {/* ==================================================
          SCENE 2
          2s → 4s
          60 FRAMES
          6 IMAGES - FAST
      ================================================== */}

      <Sequence
        from={60}
        durationInFrames={60}
      >
        <Scene2
          images={images.slice(4, 11)}
        />
      </Sequence>


      {/* ==================================================
          SCENE 3
          4s → 7s
          90 FRAMES
          3 IMAGES
      ================================================== */}

      <Sequence
        from={120}
        durationInFrames={90}
      >
        <Scene3
          images={images.slice(11, 14)}
        />
      </Sequence>
    </>
  );
};