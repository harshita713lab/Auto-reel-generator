import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
}

interface Template28Props {
  images?: ImageItem[];
}

// ======================================================
// CONFIG
// ======================================================

export const FPS = 25;

// 16 seconds × 25 FPS
export const DURATION_IN_FRAMES = 400;

// EXACTLY 10 IMAGES
export const IMAGE_COUNT = 10;

// ======================================================
// SCENE TIMING
// ======================================================

// Scene 1 → 0-4 sec
const SCENE1_DURATION = 100;

// Scene 2 → 4-7 sec
const SCENE2_DURATION = 75;

// Scene 3 → 7-10 sec
const SCENE3_DURATION = 75;

// Scene 4 → 10-13 sec
const SCENE4_DURATION = 75;

// Scene 5 → 13-16 sec
const SCENE5_DURATION = 75;

// ======================================================
// HELPER
// ======================================================

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// MAIN COMPONENT
// ======================================================

export const Template28: React.FC<Template28Props> = ({
  images = [],
}) => {
  const frame = useCurrentFrame();

  // ====================================================
  // VALIDATION
  // ====================================================

  if (images.length < IMAGE_COUNT) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#080808",
          color: "#fff",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 38,
          fontFamily: "Arial",
        }}
      >
        Need 10 images
      </AbsoluteFill>
    );
  }

  // ====================================================
  // ====================================================
  // SCENE 1
  // FLOATING MEMORY CARDS
  // IMAGES 1-4
  // ====================================================
  // ====================================================

  if (frame < SCENE1_DURATION) {
    const sceneFrame = frame;

    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#080808",
          overflow: "hidden",
        }}
      >
        {/* ==================================================
            BACKGROUND GLOW
        ================================================== */}

        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.08), transparent 55%)",
          }}
        />

        {/* ==================================================
            FLOATING CARDS
        ================================================== */}

        {images.slice(0, 4).map((image, index) => {
          const startFrame = index * 14;

          const progress = interpolate(
            sceneFrame,
            [startFrame, startFrame + 35],
            [0, 1],
            {
              ...clamp,
              easing: Easing.out(Easing.back(1.2)),
            }
          );

          // ----------------------------------------------
          // DIFFERENT ENTRY DIRECTIONS
          // ----------------------------------------------

          const fromX = [-260, 260, -220, 220][index];

          const fromY = [-180, -150, 170, 150][index];

          const translateX = interpolate(
            progress,
            [0, 1],
            [fromX, 0],
            clamp
          );

          const translateY = interpolate(
            progress,
            [0, 1],
            [fromY, 0],
            clamp
          );

          // ----------------------------------------------
          // ROTATION
          // ----------------------------------------------

          const startRotation = [-12, 10, 8, -9][index];

          const rotation = interpolate(
            progress,
            [0, 1],
            [startRotation, 0],
            {
              ...clamp,
              easing: Easing.out(Easing.back(1.1)),
            }
          );

          // ----------------------------------------------
          // SCALE
          // ----------------------------------------------

          const scale = interpolate(
            progress,
            [0, 1],
            [0.72, 1],
            {
              ...clamp,
              easing: Easing.out(Easing.back(1.15)),
            }
          );

          // ----------------------------------------------
          // OPACITY
          // ----------------------------------------------

          const opacity = interpolate(
            progress,
            [0, 0.2, 1],
            [0, 1, 1],
            clamp
          );

          // ----------------------------------------------
          // FLOATING MOTION
          // ----------------------------------------------

          const floatingY =
            progress > 0.95
              ? Math.sin(
                  (sceneFrame - startFrame) / 18 + index
                ) * 4
              : 0;

          // ----------------------------------------------
          // CARD POSITIONS
          // ----------------------------------------------

          const positions = [
            {
              left: "5%",
              top: "8%",
              width: "43%",
              height: "39%",
            },
            {
              right: "5%",
              top: "8%",
              width: "43%",
              height: "39%",
            },
            {
              left: "5%",
              bottom: "8%",
              width: "43%",
              height: "39%",
            },
            {
              right: "5%",
              bottom: "8%",
              width: "43%",
              height: "39%",
            },
          ];

          return (
            <div
              key={index}
              style={{
                position: "absolute",

                ...positions[index],

                opacity,

                transform: `
                  translate(
                    ${translateX}px,
                    ${translateY + floatingY}px
                  )
                  rotate(${rotation}deg)
                  scale(${scale})
                `,

                transformOrigin: "center center",

                zIndex: 10 + index,

                padding: 8,

                backgroundColor:
                  "rgba(255,255,255,0.96)",

                boxShadow:
                  "0 18px 45px rgba(0,0,0,0.45)",

                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Img
                  src={image.path}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",

                    transform: `
                      scale(
                        ${
                          1.06 +
                          Math.sin(
                            (sceneFrame + index * 20) / 35
                          ) *
                            0.012
                        }
                      )
                    `,
                  }}
                />

                {/* IMAGE SHADE */}

                <AbsoluteFill
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.18) 100%)",
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* ==================================================
            CENTER ORNAMENT
        ================================================== */}

        <div
          style={{
            position: "absolute",

            left: "50%",
            top: "50%",

            transform:
              "translate(-50%, -50%)",

            width: 55,
            height: 55,

            borderRadius: "50%",

            border:
              "1px solid rgba(255,255,255,0.7)",

            display: "flex",

            alignItems: "center",
            justifyContent: "center",

            background:
              "rgba(0,0,0,0.45)",

            zIndex: 50,

            opacity: interpolate(
              sceneFrame,
              [45, 65, 100],
              [0, 1, 0],
              clamp
            ),
          }}
        >
          <span
            style={{
              fontSize: 25,
            }}
          >
            ♡
          </span>
        </div>

        {/* ==================================================
            EDGE VIGNETTE
        ================================================== */}

        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.55) 100%)",

            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    );
  }

  // ====================================================
  // ====================================================
  // SCENE 2
  // CINEMATIC CENTER CURTAIN REVEAL
  // IMAGES 5-6
  // ====================================================
  // ====================================================

  if (
    frame <
    SCENE1_DURATION + SCENE2_DURATION
  ) {
    const sceneFrame =
      frame - SCENE1_DURATION;

    // 2 images
    const imageIndex = Math.min(
      Math.floor(sceneFrame / 37),
      1
    );

    const localFrame =
      sceneFrame - imageIndex * 37;

    const image =
      images[4 + imageIndex];

    // ==================================================
    // REVEAL PROGRESS
    // ==================================================

    const progress = interpolate(
      localFrame,
      [0, 30],
      [0, 1],
      {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      }
    );

    // ==================================================
    // LEFT CURTAIN
    // STARTS AT CENTER → MOVES LEFT
    // ==================================================

    const curtainX = interpolate(
      progress,
      [0, 1],
      [0, -100],
      {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      }
    );

    // ==================================================
    // RIGHT CURTAIN
    // STARTS AT CENTER → MOVES RIGHT
    // ==================================================

    const rightCurtainX = interpolate(
      progress,
      [0, 1],
      [0, 100],
      {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      }
    );

    // ==================================================
    // IMAGE SCALE
    // ==================================================

    const imageScale = interpolate(
      progress,
      [0, 0.45, 1],
      [1.16, 1.08, 1],
      {
        ...clamp,
        easing: Easing.out(Easing.cubic),
      }
    );

    // ==================================================
    // CAMERA X
    // ==================================================

    const imageX = interpolate(
      progress,
      [0, 1],
      [-18, 0],
      {
        ...clamp,
        easing: Easing.out(Easing.cubic),
      }
    );

    // ==================================================
    // CAMERA Y
    // ==================================================

    const imageY = interpolate(
      progress,
      [0, 1],
      [8, 0],
      {
        ...clamp,
        easing: Easing.out(Easing.cubic),
      }
    );

    // ==================================================
    // IMAGE OPACITY
    // ==================================================

    const imageOpacity = interpolate(
      progress,
      [0, 0.15, 1],
      [0.55, 0.9, 1],
      clamp
    );

    // ==================================================
    // CURTAIN OPACITY
    // ==================================================

    const curtainOpacity = interpolate(
      progress,
      [0, 0.55, 1],
      [1, 0.98, 0],
      clamp
    );

    // ==================================================
    // CENTER SEAM
    // ==================================================

    const seamOpacity = interpolate(
      progress,
      [0, 0.35, 0.75, 1],
      [1, 0.9, 0.25, 0],
      clamp
    );

    // ==================================================
    // INITIAL LIGHT FLASH
    // ==================================================

    const flashOpacity = interpolate(
      localFrame,
      [0, 3, 8, 15],
      [0.45, 0.18, 0.04, 0],
      clamp
    );

    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#050505",
          overflow: "hidden",
        }}
      >
        {/* ==================================================
            IMAGE BACKGROUND
        ================================================== */}

        <AbsoluteFill
          style={{
            overflow: "hidden",

            opacity: imageOpacity,
          }}
        >
          <Img
            src={image.path}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",

              transform: `
                translate(
                  ${imageX}px,
                  ${imageY}px
                )
                scale(${imageScale})
              `,

              transformOrigin:
                "center center",

              filter:
                "brightness(0.98) contrast(1.08) saturate(1.08)",
            }}
          />
        </AbsoluteFill>

        {/* ==================================================
            CINEMATIC DARK OVERLAY
        ================================================== */}

        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.32))",

            opacity: interpolate(
              progress,
              [0, 1],
              [0.8, 1],
              clamp
            ),

            zIndex: 5,

            pointerEvents: "none",
          }}
        />

        {/* ==================================================
            LEFT CURTAIN
        ================================================== */}

        <div
          style={{
            position: "absolute",

            top: 0,
            bottom: 0,
            left: 0,

            width: "50%",

            transform: `
              translateX(${curtainX}%)
            `,

            background:
              "linear-gradient(90deg, #020202 0%, #080808 75%, #151515 100%)",

            opacity: curtainOpacity,

            zIndex: 20,

            boxShadow:
              "18px 0 45px rgba(0,0,0,0.65)",
          }}
        >
          {/* LEFT CURTAIN LIGHT EDGE */}

          <div
            style={{
              position: "absolute",

              top: 0,
              right: 0,

              width: 3,
              height: "100%",

              background:
                "linear-gradient(180deg, transparent, rgba(255,255,255,0.45), transparent)",

              opacity: interpolate(
                progress,
                [0, 0.4, 1],
                [0.7, 0.45, 0],
                clamp
              ),

              boxShadow:
                "0 0 25px rgba(255,255,255,0.3)",
            }}
          />

          {/* CURTAIN FOLD */}

          <div
            style={{
              position: "absolute",

              inset: 0,

              background:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 3px, transparent 14px, transparent 28px)",

              opacity: 0.7,
            }}
          />
        </div>

        {/* ==================================================
            RIGHT CURTAIN
        ================================================== */}

        <div
          style={{
            position: "absolute",

            top: 0,
            bottom: 0,
            right: 0,

            width: "50%",

            transform: `
              translateX(${rightCurtainX}%)
            `,

            background:
              "linear-gradient(90deg, #151515 0%, #080808 25%, #020202 100%)",

            opacity: curtainOpacity,

            zIndex: 20,

            boxShadow:
              "-18px 0 45px rgba(0,0,0,0.65)",
          }}
        >
          {/* RIGHT CURTAIN LIGHT EDGE */}

          <div
            style={{
              position: "absolute",

              top: 0,
              left: 0,

              width: 3,
              height: "100%",

              background:
                "linear-gradient(180deg, transparent, rgba(255,255,255,0.45), transparent)",

              opacity: interpolate(
                progress,
                [0, 0.4, 1],
                [0.7, 0.45, 0],
                clamp
              ),

              boxShadow:
                "0 0 25px rgba(255,255,255,0.3)",
            }}
          />

          {/* CURTAIN FOLD */}

          <div
            style={{
              position: "absolute",

              inset: 0,

              background:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 3px, transparent 14px, transparent 28px)",

              opacity: 0.7,
            }}
          />
        </div>

        {/* ==================================================
            CENTER LIGHT SEAM
        ================================================== */}

        <div
          style={{
            position: "absolute",

            left: "50%",
            top: "-5%",

            width: 3,
            height: "110%",

            transform:
              "translateX(-50%)",

            background:
              "linear-gradient(180deg, transparent, rgba(255,255,255,0.9), transparent)",

            opacity: seamOpacity,

            boxShadow:
              "0 0 35px rgba(255,255,255,0.8)",

            zIndex: 30,

            pointerEvents: "none",
          }}
        />

        {/* ==================================================
            CENTER GLOW
        ================================================== */}

        <div
          style={{
            position: "absolute",

            left: "50%",
            top: "50%",

            width: `${interpolate(
              progress,
              [0, 1],
              [8, 180],
              clamp
            )}%`,

            height: `${interpolate(
              progress,
              [0, 1],
              [8, 180],
              clamp
            )}%`,

            transform:
              "translate(-50%, -50%)",

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(255,255,255,0.16), transparent 70%)",

            opacity: interpolate(
              progress,
              [0, 0.35, 0.8, 1],
              [0.8, 0.5, 0.1, 0],
              clamp
            ),

            zIndex: 25,

            pointerEvents: "none",
          }}
        />

        {/* ==================================================
            CAMERA FLASH
        ================================================== */}

        <AbsoluteFill
          style={{
            backgroundColor: "#fff",

            opacity: flashOpacity,

            zIndex: 40,

            pointerEvents: "none",
          }}
        />

        {/* ==================================================
            ELEGANT FRAME
        ================================================== */}

        <div
          style={{
            position: "absolute",

            left: "7%",
            right: "7%",

            top: "8%",
            bottom: "8%",

            border:
              "1px solid rgba(255,255,255,0.55)",

            opacity: interpolate(
              progress,
              [0, 0.35, 0.8, 1],
              [0, 0.8, 0.35, 0.2],
              clamp
            ),

            zIndex: 45,

            pointerEvents: "none",
          }}
        />

        {/* ==================================================
            VIGNETTE
        ================================================== */}

        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at center, transparent 38%, rgba(0,0,0,0.5) 100%)",

            zIndex: 50,

            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    );
  }

  // ====================================================
  // ====================================================
  // SCENE 3
  // FULLSCREEN CINEMATIC FOCUS
  // IMAGES 7-8
  // ====================================================
  // ====================================================

  if (
    frame <
    SCENE1_DURATION +
      SCENE2_DURATION +
      SCENE3_DURATION
  ) {
    const sceneFrame =
      frame -
      SCENE1_DURATION -
      SCENE2_DURATION;

    const imageIndex = Math.min(
      Math.floor(sceneFrame / 37),
      1
    );

    const localFrame =
      sceneFrame - imageIndex * 37;

    const image =
      images[6 + imageIndex];

    // ==================================================
    // CINEMATIC PROGRESS
    // ==================================================

    const progress = interpolate(
      localFrame,
      [0, 28],
      [0, 1],
      {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      }
    );

    // ==================================================
    // FULLSCREEN ZOOM
    // ==================================================

    const scale = interpolate(
      progress,
      [0, 0.45, 1],
      [1.32, 1.08, 1],
      {
        ...clamp,
        easing: Easing.out(Easing.cubic),
      }
    );

    // ==================================================
    // DIAGONAL CAMERA
    // ==================================================

    const x = interpolate(
      progress,
      [0, 1],
      [-35, 0],
      clamp
    );

    const y = interpolate(
      progress,
      [0, 1],
      [25, 0],
      clamp
    );

    // ==================================================
    // CIRCULAR REVEAL
    // ==================================================

    const circle = interpolate(
      progress,
      [0, 0.15, 0.5, 1],
      [4, 22, 70, 155],
      {
        ...clamp,
        easing: Easing.out(Easing.cubic),
      }
    );

    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          overflow: "hidden",
        }}
      >
        {/* ==================================================
            IMAGE
        ================================================== */}

        <div
          style={{
            position: "absolute",
            inset: 0,

            overflow: "hidden",

            clipPath: `
              circle(
                ${circle}%
                at 50% 50%
              )
            `,
          }}
        >
          <Img
            src={image.path}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",

              transform: `
                translate(
                  ${x}px,
                  ${y}px
                )
                scale(${scale})
              `,

              transformOrigin:
                "center center",

              filter:
                "brightness(0.98) contrast(1.08) saturate(1.08)",
            }}
          />
        </div>

        {/* ==================================================
            FOCUS RING
        ================================================== */}

        {progress < 0.85 && (
          <div
            style={{
              position: "absolute",

              left: "50%",
              top: "50%",

              width: `${circle + 3}%`,
              height: `${circle + 3}%`,

              transform:
                "translate(-50%, -50%)",

              borderRadius: "50%",

              border:
                "1px solid rgba(255,255,255,0.8)",

              opacity: interpolate(
                progress,
                [0, 0.3, 0.75, 1],
                [1, 0.8, 0.3, 0],
                clamp
              ),

              boxShadow:
                "0 0 35px rgba(255,255,255,0.3)",

              zIndex: 20,
            }}
          />
        )}

        {/* ==================================================
            CAMERA FLASH
        ================================================== */}

        <AbsoluteFill
          style={{
            backgroundColor: "#fff",

            opacity: interpolate(
              localFrame,
              [0, 3, 8],
              [0.7, 0.15, 0],
              clamp
            ),

            pointerEvents: "none",

            zIndex: 40,
          }}
        />

        {/* ==================================================
            VIGNETTE
        ================================================== */}

        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.5) 100%)",

            pointerEvents: "none",

            zIndex: 30,
          }}
        />
      </AbsoluteFill>
    );
  }

  // ====================================================
  // ====================================================
  // SCENE 4
  // 3D IMAGE TURN
  // IMAGE 9
  // ====================================================
  // ====================================================

  if (
    frame <
    SCENE1_DURATION +
      SCENE2_DURATION +
      SCENE3_DURATION +
      SCENE4_DURATION
  ) {
    const sceneFrame =
      frame -
      SCENE1_DURATION -
      SCENE2_DURATION -
      SCENE3_DURATION;

    // ==================================================
    // PROGRESS
    // ==================================================

    const progress = interpolate(
      sceneFrame,
      [0, 32],
      [0, 1],
      {
        ...clamp,
        easing: Easing.out(Easing.cubic),
      }
    );

    // ==================================================
    // 3D ROTATION
    // ==================================================

    const rotateY = interpolate(
      progress,
      [0, 1],
      [-65, 0],
      {
        ...clamp,
        easing: Easing.out(Easing.cubic),
      }
    );

    // ==================================================
    // DEPTH
    // ==================================================

    const translateX = interpolate(
      progress,
      [0, 1],
      [-100, 0],
      {
        ...clamp,
        easing: Easing.out(Easing.cubic),
      }
    );

    // ==================================================
    // SCALE
    // ==================================================

    const scale = interpolate(
      progress,
      [0, 1],
      [0.82, 1],
      {
        ...clamp,
        easing: Easing.out(Easing.back(1.1)),
      }
    );

    // ==================================================
    // OPACITY
    // ==================================================

    const opacity = interpolate(
      progress,
      [0, 0.15, 1],
      [0, 1, 1],
      clamp
    );

    // ==================================================
    // LIGHT SWEEP
    // ==================================================

    const sweepX = interpolate(
      progress,
      [0, 1],
      [-25, 120],
      clamp
    );

    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#0a0a0a",

          overflow: "hidden",

          perspective: 1200,
        }}
      >
        {/* ==================================================
            BACKGROUND LIGHT
        ================================================== */}

        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.09), transparent 60%)",
          }}
        />

        {/* ==================================================
            3D PHOTO
        ================================================== */}

        <div
          style={{
            position: "absolute",

            left: "8%",
            right: "8%",

            top: "7%",
            bottom: "7%",

            opacity,

            transform: `
              translateX(${translateX}px)
              rotateY(${rotateY}deg)
              scale(${scale})
            `,

            transformStyle:
              "preserve-3d",

            transformOrigin:
              "left center",

            boxShadow:
              "0 30px 80px rgba(0,0,0,0.65)",

            overflow: "hidden",

            border:
              "1px solid rgba(255,255,255,0.4)",
          }}
        >
          <Img
            src={images[8].path}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",

              transform:
                "scale(1.03)",

              filter:
                "brightness(0.98) contrast(1.06) saturate(1.06)",
            }}
          />

          {/* PHOTO SHADOW */}

          <AbsoluteFill
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.35), transparent 35%, transparent 70%, rgba(0,0,0,0.25))",
            }}
          />
        </div>

        {/* ==================================================
            LIGHT SWEEP
        ================================================== */}

        <div
          style={{
            position: "absolute",

            top: "-20%",
            bottom: "-20%",

            width: "18%",

            left: `${sweepX}%`,

            transform:
              "rotate(18deg)",

            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",

            zIndex: 30,

            pointerEvents: "none",
          }}
        />

        {/* ==================================================
            CORNER MARK TOP LEFT
        ================================================== */}

        <div
          style={{
            position: "absolute",

            left: "6%",
            top: "6%",

            width: 45,
            height: 45,

            borderLeft:
              "2px solid rgba(255,255,255,0.7)",

            borderTop:
              "2px solid rgba(255,255,255,0.7)",

            opacity: progress,
          }}
        />

        {/* ==================================================
            CORNER MARK BOTTOM RIGHT
        ================================================== */}

        <div
          style={{
            position: "absolute",

            right: "6%",
            bottom: "6%",

            width: 45,
            height: 45,

            borderRight:
              "2px solid rgba(255,255,255,0.7)",

            borderBottom:
              "2px solid rgba(255,255,255,0.7)",

            opacity: progress,
          }}
        />

        {/* ==================================================
            VIGNETTE
        ================================================== */}

        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at center, transparent 42%, rgba(0,0,0,0.45) 100%)",

            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    );
  }

  // ====================================================
  // ====================================================
  // SCENE 5
  // FINAL HERO CINEMATIC PUSH
  // IMAGE 10
  // ====================================================
  // ====================================================

  const heroFrame =
    frame -
    SCENE1_DURATION -
    SCENE2_DURATION -
    SCENE3_DURATION -
    SCENE4_DURATION;

  // ==================================================
  // HERO PROGRESS
  // ==================================================

  const heroProgress = interpolate(
    heroFrame,
    [0, SCENE5_DURATION],
    [0, 1],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // ==================================================
  // HERO SCALE
  // ==================================================

  const heroScale = interpolate(
    heroProgress,
    [0, 1],
    [1.0, 1.18],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // ==================================================
  // HERO Y
  // ==================================================

  const heroY = interpolate(
    heroProgress,
    [0, 1],
    [5, -10],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // ==================================================
  // HERO X
  // ==================================================

  const heroX = interpolate(
    heroProgress,
    [0, 1],
    [0, -8],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // ==================================================
  // LIGHT SWEEP
  // ==================================================

  const sweepX = interpolate(
    heroProgress,
    [0, 0.65, 1],
    [-30, 100, 130],
    clamp
  );

  // ==================================================
  // HERO ROTATION
  // ==================================================

  const heroRotation = interpolate(
    heroProgress,
    [0, 0.5, 1],
    [0, -0.3, 0],
    clamp
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",

        overflow: "hidden",
      }}
    >
      {/* ==================================================
          HERO IMAGE
      ================================================== */}

      <Img
        src={images[9].path}
        style={{
          position: "absolute",

          inset: 0,

          width: "100%",
          height: "100%",

          objectFit: "cover",

          transform: `
            translate(
              ${heroX}px,
              ${heroY}px
            )
            scale(${heroScale})
            rotate(${heroRotation}deg)
          `,

          transformOrigin:
            "center center",

          filter:
            "brightness(0.98) contrast(1.06) saturate(1.06)",
        }}
      />

      {/* ==================================================
          CINEMATIC DARK GRADIENT
      ================================================== */}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.02) 20%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.58) 100%)",

          zIndex: 10,
        }}
      />

      {/* ==================================================
          MOVING LIGHT
      ================================================== */}

      <div
        style={{
          position: "absolute",

          top: "-30%",
          bottom: "-30%",

          width: "35%",

          left: `${sweepX}%`,

          transform:
            "rotate(18deg)",

          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",

          zIndex: 20,

          pointerEvents: "none",
        }}
      />

      {/* ==================================================
          CENTER HEART
      ================================================== */}

      <div
        style={{
          position: "absolute",

          left: "50%",
          top: "50%",

          transform:
            "translate(-50%, -50%)",

          fontSize: 54,

          opacity: interpolate(
            heroProgress,
            [0, 0.2, 0.7, 1],
            [0, 1, 1, 0.75],
            clamp
          ),

          zIndex: 30,

          textShadow:
            "0 0 25px rgba(255,255,255,0.35)",
        }}
      >
        ♡
      </div>

      {/* ==================================================
          ELEGANT FRAME
      ================================================== */}

      <div
        style={{
          position: "absolute",

          left: "6%",
          right: "6%",

          top: "7%",
          bottom: "7%",

          border:
            "1px solid rgba(255,255,255,0.6)",

          opacity: interpolate(
            heroProgress,
            [0, 0.25, 1],
            [0, 0.85, 0.65],
            clamp
          ),

          zIndex: 30,

          pointerEvents: "none",
        }}
      />

      {/* ==================================================
          TOP LEFT CORNER
      ================================================== */}

      <div
        style={{
          position: "absolute",

          left: "6%",
          top: "7%",

          width: 65,
          height: 65,

          borderLeft:
            "2px solid rgba(255,255,255,0.8)",

          borderTop:
            "2px solid rgba(255,255,255,0.8)",

          zIndex: 35,

          opacity: heroProgress,
        }}
      />

      {/* ==================================================
          BOTTOM RIGHT CORNER
      ================================================== */}

      <div
        style={{
          position: "absolute",

          right: "6%",
          bottom: "7%",

          width: 65,
          height: 65,

          borderRight:
            "2px solid rgba(255,255,255,0.8)",

          borderBottom:
            "2px solid rgba(255,255,255,0.8)",

          zIndex: 35,

          opacity: heroProgress,
        }}
      />

      {/* ==================================================
          FINAL SOFT LIGHT
      ================================================== */}

      <div
        style={{
          position: "absolute",

          left: "50%",
          top: "50%",

          width: `${interpolate(
            heroProgress,
            [0, 0.5, 1],
            [5, 35, 55],
            clamp
          )}%`,

          height: `${interpolate(
            heroProgress,
            [0, 0.5, 1],
            [5, 35, 55],
            clamp
          )}%`,

          transform:
            "translate(-50%, -50%)",

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(255,255,255,0.10), transparent 70%)",

          opacity: interpolate(
            heroProgress,
            [0, 0.5, 1],
            [0, 0.5, 0.15],
            clamp
          ),

          zIndex: 28,

          pointerEvents: "none",
        }}
      />

      {/* ==================================================
          FINAL VIGNETTE
      ================================================== */}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.5) 100%)",

          zIndex: 40,

          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export default Template28;