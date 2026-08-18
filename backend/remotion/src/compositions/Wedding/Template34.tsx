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

interface Template34Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIGURATION
// ======================================================

export const FPS = 30;

export const DURATION_IN_FRAMES = 570;

export const IMAGE_COUNT = 19;

export const DEFAULT_PROPS: Template34Props = {
  images: Array(19).fill({
    path: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop",
  }),
  music: undefined,
};

// ======================================================
// COMMON HELPERS
// ======================================================

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const getImgSrc = (
  img?: ImageItem,
  index: number = 0
): string => {
  if (img?.path) return img.path;
  if (img?.url) return img.url;

  return DEFAULT_PROPS.images?.[index]?.path || "";
};

// ======================================================
// VERY SOFT BEAT PULSE
// ======================================================
// Previous value was too aggressive.
// Now beat pulse is only 0.8% and does NOT create visible shaking.

const getBeatPulse = (frame: number): number => {
  const beatCycle = frame % 15;

  if (beatCycle < 5) {
    return interpolate(
      beatCycle,
      [0, 2, 5],
      [0, 0.008, 0],
      clamp
    );
  }

  return 0;
};

// ======================================================
// PARTICLES
// ======================================================

const EnergeticParticles: React.FC<{
  frame: number;
}> = ({ frame }) => {
  const particles = [
    {
      id: 1,
      x: 15,
      y: 25,
      size: 70,
      speedY: -0.6,
      speedX: 0.3,
      delay: 0,
    },
    {
      id: 2,
      x: 80,
      y: 70,
      size: 100,
      speedY: -0.7,
      speedX: -0.4,
      delay: 4,
    },
    {
      id: 3,
      x: 35,
      y: 85,
      size: 85,
      speedY: -0.8,
      speedX: 0.25,
      delay: 8,
    },
    {
      id: 4,
      x: 90,
      y: 30,
      size: 55,
      speedY: -0.5,
      speedX: -0.3,
      delay: 2,
    },
    {
      id: 5,
      x: 20,
      y: 65,
      size: 95,
      speedY: -0.65,
      speedX: 0.35,
      delay: 6,
    },
    {
      id: 6,
      x: 65,
      y: 45,
      size: 90,
      speedY: -0.75,
      speedX: -0.15,
      delay: 10,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 12,
      }}
    >
      {particles.map((p) => {
        const pFrame = Math.max(0, frame - p.delay);

        const currentY =
          p.y + pFrame * p.speedY;

        const currentX =
          p.x + pFrame * p.speedX;

        const opacity = interpolate(
          pFrame % 60,
          [0, 30, 60],
          [0.2, 0.85, 0.2],
          clamp
        );

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${currentX}%`,
              top: `${currentY}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(0,229,255,0.4) 50%, rgba(255,0,85,0) 70%)",
              filter: "blur(6px)",
              opacity,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ======================================================
// LYRICS OVERLAY
// ======================================================

const ChaleyaLyricsOverlay: React.FC<{
  frame: number;
}> = ({ frame }) => {
  let mainText = "";
  let subText = "";
  let activeColor = "#ffffff";

  const stanzaLength = 285;

  const stanzaFrame =
    frame % stanzaLength;

  if (frame >= 0 && frame < 285) {
    mainText =
      "Tere Saare Rang Odh Ke Dhang Odh Ke";

    subText =
      "Tera Hua Main Sabko Chhod Ke Ho Ho Ho ❤️✨";

    activeColor = "#ffffff";
  } else if (
    frame >= 285 &&
    frame < 570
  ) {
    mainText =
      "Ishq Ni Karna Naap Tol Ke Raaj Khol Ke";

    subText =
      "Aaya Hoon Main Sabko Bol Ke Ho 🔥";

    activeColor = "#00e5ff";
  }

  if (!mainText) return null;

  // ====================================================
  // SMOOTH TEXT ENTRANCE
  // ====================================================

  const textZoomProgress = interpolate(
    stanzaFrame,
    [0, 18],
    [0, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.back(1.2)),
    }
  );

  const textScale = interpolate(
    textZoomProgress,
    [0, 1],
    [0.35, 1],
    clamp
  );

  const textY = interpolate(
    textZoomProgress,
    [0, 1],
    [40, 0],
    clamp
  );

  // Very subtle beat pulse
  const beatPulse =
    getBeatPulse(frame);

  // ====================================================
  // FADE
  // ====================================================

  const opacity = interpolate(
    stanzaFrame,
    [0, 12, stanzaLength - 15, stanzaLength],
    [0, 1, 1, 0],
    clamp
  );

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom:
          frame >= 285 ? "8%" : "10%",

        transform: `
          translate(-50%, ${textY}px)
          scale(${textScale + beatPulse})
        `,

        opacity,
        zIndex: 50,
        textAlign: "center",
        width: "92%",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily:
            "'Segoe UI', Roboto, sans-serif",

          fontSize:
            frame >= 285 ? 46 : 42,

          fontWeight: 900,
          color: activeColor,
          letterSpacing: "1px",
          textTransform: "uppercase",

          textShadow: `
            -3px -3px 0 #000,
             3px -3px 0 #000,
            -3px  3px 0 #000,
             3px  3px 0 #000,
             0px 8px 24px rgba(0,0,0,0.95)
          `,
        }}
      >
        {mainText}
      </div>

      {subText && (
        <div
          style={{
            fontFamily:
              "'Brush Script MT', 'Dancing Script', cursive, sans-serif",

            fontSize: 48,
            fontWeight: 800,
            color: "#ffffff",

            textShadow:
              "0 4px 18px rgba(0,229,255,0.8), 0 0 12px #000",

            marginTop: 4,
          }}
        >
          {subText}
        </div>
      )}
    </div>
  );
};

// ======================================================
// TEMPLATE 34
// ======================================================

export const Template34: React.FC<
  Template34Props
> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();

  // ====================================================
  // SAFE IMAGES
  // ====================================================

  const safeImages =
    images.length >= IMAGE_COUNT
      ? images
      : DEFAULT_PROPS.images!;

  // ====================================================
  // SCENE BOUNDARIES
  // ====================================================

  const isScene1 =
    frame >= 0 && frame < 90;

  const isScene2 =
    frame >= 90 && frame < 180;

  const isScene3 =
    frame >= 180 && frame < 270;

  const isScene4 =
    frame >= 270 && frame < 390;

  const isScene5 =
    frame >= 390 && frame < 570;

  // ====================================================
  // GLOBAL FADE
  // ====================================================

  const globalFadeOut = interpolate(
    frame,
    [550, 570],
    [1, 0],
    clamp
  );

  // ====================================================
  // MUSIC
  // ====================================================

  const musicSrc =
    typeof music === "string"
      ? music
      : music?.path;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        opacity: globalFadeOut,
        overflow: "hidden",
      }}
    >
      {/* ==================================================
          MUSIC
      ================================================== */}

      {musicSrc && (
        <MusicPlayer
          src={musicSrc}
          volume={
            typeof music === "object"
              ? music?.volume
              : 1
          }
        />
      )}

      {/* ==================================================
          LYRICS
      ================================================== */}

      <ChaleyaLyricsOverlay
        frame={frame}
      />

      {/* ==================================================
          SCENE 1
          0 - 3 SEC
          4 IMAGES
      ================================================== */}

      {isScene1 && (
        <AbsoluteFill
          style={{
            zIndex: 1,
            backgroundColor: "#000000",
          }}
        >
          {(() => {
            const s1Frame = frame;

            // --------------------------------------------
            // 4 images
            // --------------------------------------------

            const subIndex = Math.min(
              3,
              Math.floor(s1Frame / 22.5)
            );

            const subFrame =
              s1Frame % 22.5;

            // --------------------------------------------
            // Smooth zoom only
            // NO ROTATION
            // NO SIN WOBBLE
            // --------------------------------------------

            const smoothZoom =
              interpolate(
                subFrame,
                [0, 22.5],
                [1, 1.035],
                clamp
              );

            // --------------------------------------------
            // Small beat pulse
            // --------------------------------------------

            const beatPulse =
              getBeatPulse(s1Frame);

            const pulseScale =
              smoothZoom + beatPulse;

            // --------------------------------------------
            // Fade in
            // --------------------------------------------

            const strobeOpacity =
              interpolate(
                subFrame,
                [0, 4, 22],
                [0.3, 1, 1],
                clamp
              );

            return (
              <AbsoluteFill
                style={{
                  opacity: strobeOpacity,
                  backgroundColor: "#000000",
                }}
              >
                <Img
                  src={getImgSrc(
                    safeImages[subIndex],
                    subIndex
                  )}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",

                    transform: `
                      scale(${pulseScale})
                    `,

                    filter:
                      "contrast(1.15) saturate(1.2)",
                  }}
                />

                {/* Neon Border */}

                <div
                  style={{
                    position: "absolute",
                    inset: 20,

                    border:
                      "4px solid #ff0055",

                    boxShadow:
                      "0 0 25px #ff0055, inset 0 0 25px #00e5ff",

                    pointerEvents: "none",
                  }}
                />
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ==================================================
          SCENE 2
          3 - 6 SEC
          6 PHOTO GRID
      ================================================== */}

      {isScene2 && (
        <AbsoluteFill
          style={{
            zIndex: 2,
            backgroundColor: "#000000",
          }}
        >
          {(() => {
            const s2Frame =
              frame - 90;

            // --------------------------------------------
            // Smooth scene fade
            // --------------------------------------------

            const s2Opacity =
              interpolate(
                s2Frame,
                [0, 10],
                [0, 1],
                clamp
              );

            // --------------------------------------------
            // VERY SMALL overall zoom
            // No beat pulse here
            // --------------------------------------------

            const gridScale =
              interpolate(
                s2Frame,
                [0, 90],
                [1.0, 1.025],
                clamp
              );

            // --------------------------------------------
            // Individual card entrances
            // --------------------------------------------

            const p0 = interpolate(
              s2Frame,
              [0, 12],
              [0, 1],
              {
                ...clamp,
                easing:
                  Easing.out(
                    Easing.back(1.15)
                  ),
              }
            );

            const p1 = interpolate(
              s2Frame,
              [8, 20],
              [0, 1],
              {
                ...clamp,
                easing:
                  Easing.out(
                    Easing.back(1.15)
                  ),
              }
            );

            const p2 = interpolate(
              s2Frame,
              [16, 28],
              [0, 1],
              {
                ...clamp,
                easing:
                  Easing.out(
                    Easing.back(1.15)
                  ),
              }
            );

            const p3 = interpolate(
              s2Frame,
              [24, 36],
              [0, 1],
              {
                ...clamp,
                easing:
                  Easing.out(
                    Easing.back(1.15)
                  ),
              }
            );

            const p4 = interpolate(
              s2Frame,
              [32, 44],
              [0, 1],
              {
                ...clamp,
                easing:
                  Easing.out(
                    Easing.back(1.15)
                  ),
              }
            );

            const p5 = interpolate(
              s2Frame,
              [40, 52],
              [0, 1],
              {
                ...clamp,
                easing:
                  Easing.out(
                    Easing.back(1.15)
                  ),
              }
            );

            return (
              <AbsoluteFill
                style={{
                  opacity: s2Opacity,
                  backgroundColor: "#000000",

                  transform:
                    `scale(${gridScale})`,
                }}
              >
                <div
                  style={{
                    display: "grid",

                    gridTemplateColumns:
                      "1fr 1fr",

                    gridTemplateRows:
                      "1fr 1fr 1fr",

                    width: "100%",
                    height: "100%",

                    gap: "6px",

                    backgroundColor:
                      "#000000",

                    padding: "4px",
                  }}
                >
                  {/* IMAGE 5 */}

                  <div
                    style={{
                      overflow: "hidden",
                      transform:
                        `scale(${p0})`,
                      opacity: p0,
                      backgroundColor: "#000",
                    }}
                  >
                    <Img
                      src={getImgSrc(
                        safeImages[4],
                        4
                      )}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* IMAGE 6 */}

                  <div
                    style={{
                      overflow: "hidden",
                      transform:
                        `scale(${p1})`,
                      opacity: p1,
                      backgroundColor: "#000",
                    }}
                  >
                    <Img
                      src={getImgSrc(
                        safeImages[5],
                        5
                      )}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* IMAGE 7 */}

                  <div
                    style={{
                      overflow: "hidden",
                      transform:
                        `scale(${p2})`,
                      opacity: p2,
                      backgroundColor: "#000",
                    }}
                  >
                    <Img
                      src={getImgSrc(
                        safeImages[6],
                        6
                      )}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* IMAGE 8 */}

                  <div
                    style={{
                      overflow: "hidden",
                      transform:
                        `scale(${p3})`,
                      opacity: p3,
                      backgroundColor: "#000",
                    }}
                  >
                    <Img
                      src={getImgSrc(
                        safeImages[7],
                        7
                      )}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* IMAGE 9 */}

                  <div
                    style={{
                      overflow: "hidden",
                      transform:
                        `scale(${p4})`,
                      opacity: p4,
                      backgroundColor: "#000",
                    }}
                  >
                    <Img
                      src={getImgSrc(
                        safeImages[8],
                        8
                      )}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* IMAGE 10 */}

                  <div
                    style={{
                      overflow: "hidden",
                      transform:
                        `scale(${p5})`,
                      opacity: p5,
                      backgroundColor: "#000",
                    }}
                  >
                    <Img
                      src={getImgSrc(
                        safeImages[9],
                        9
                      )}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ==================================================
          SCENE 3
          6 - 9 SEC
          3D CUBE
      ================================================== */}

      {isScene3 && (
        <AbsoluteFill
          style={{
            zIndex: 3,
            backgroundColor: "#000000",
          }}
        >
          {(() => {
            const s3Frame =
              frame - 180;

            const phase = Math.min(
              2,
              Math.floor(s3Frame / 30)
            );

            const subFrame =
              s3Frame % 30;

            // --------------------------------------------
            // Smooth cube rotation
            // --------------------------------------------

            const cubeRot =
              interpolate(
                subFrame,
                [0, 24, 30],
                [0, -78, -90],
                {
                  ...clamp,
                  easing:
                    Easing.inOut(
                      Easing.cubic
                    ),
                }
              );

            const currentImg =
              safeImages[10 + phase];

            const nextImg =
              safeImages[
                10 +
                  Math.min(
                    2,
                    phase + 1
                  )
              ];

            return (
              <AbsoluteFill
                style={{
                  perspective: 1400,
                  overflow: "hidden",
                  backgroundColor: "#000000",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",

                    transformStyle:
                      "preserve-3d",

                    transform:
                      `translateZ(-540px) rotateY(${cubeRot}deg)`,

                    willChange: "transform",
                  }}
                >
                  {/* FRONT */}

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,

                      transform:
                        "rotateY(0deg) translateZ(540px)",

                      overflow: "hidden",
                      backfaceVisibility:
                        "hidden",
                    }}
                  >
                    <Img
                      src={getImgSrc(
                        currentImg,
                        10 + phase
                      )}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* SIDE */}

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,

                      transform:
                        "rotateY(90deg) translateZ(540px)",

                      overflow: "hidden",
                      backfaceVisibility:
                        "hidden",
                    }}
                  >
                    <Img
                      src={getImgSrc(
                        nextImg,
                        10 +
                          Math.min(
                            2,
                            phase + 1
                          )
                      )}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ==================================================
          SCENE 4
          9 - 13 SEC
          DIAMOND PRISM
      ================================================== */}

      {isScene4 && (
        <AbsoluteFill
          style={{
            zIndex: 4,
            backgroundColor: "#000000",
          }}
        >
          {(() => {
            const s4Frame =
              frame - 270;

            // --------------------------------------------
            // Smooth diamond expansion
            // --------------------------------------------

            const expandProgress =
              interpolate(
                s4Frame,
                [0, 45, 110],
                [0.4, 1.2, 2.4],
                {
                  ...clamp,
                  easing:
                    Easing.out(
                      Easing.cubic
                    ),
                }
              );

            const diamondSize =
              expandProgress * 50;

            return (
              <AbsoluteFill
                style={{
                  backgroundColor: "#000000",
                }}
              >
                {/* BACKGROUND */}

                <AbsoluteFill>
                  <Img
                    src={getImgSrc(
                      safeImages[13],
                      13
                    )}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",

                      filter:
                        "brightness(0.6) blur(4px)",
                    }}
                  />
                </AbsoluteFill>

                {/* DIAMOND */}

                <div
                  style={{
                    position: "absolute",
                    inset: 0,

                    clipPath:
                      `polygon(
                        50% ${50 - diamondSize}%,
                        ${50 + diamondSize}% 50%,
                        50% ${50 + diamondSize}%,
                        ${50 - diamondSize}% 50%
                      )`,

                    overflow: "hidden",
                  }}
                >
                  <Img
                    src={getImgSrc(
                      safeImages[14],
                      14
                    )}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",

                      filter:
                        "brightness(1.1) saturate(1.3)",
                    }}
                  />
                </div>

                {/* NEON BORDER */}

                {expandProgress < 1.9 && (
                  <div
                    style={{
                      position: "absolute",

                      left: "50%",
                      top: "50%",

                      width:
                        `${diamondSize * 2}%`,

                      height:
                        `${diamondSize * 2}%`,

                      transform:
                        "translate(-50%, -50%) rotate(45deg)",

                      border:
                        "4px solid #00e5ff",

                      boxShadow:
                        "0 0 30px #ff0055, inset 0 0 30px #00e5ff",

                      pointerEvents: "none",
                    }}
                  />
                )}
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ==================================================
          SCENE 5
          13 - 19 SEC
          POLAROID FINALE
      ================================================== */}

      {isScene5 && (
        <AbsoluteFill
          style={{
            zIndex: 5,
            backgroundColor: "#000000",
          }}
        >
          {(() => {
            const s5Frame =
              frame - 390;

            // --------------------------------------------
            // Background fade
            // --------------------------------------------

            const s5BgOpacity =
              interpolate(
                s5Frame,
                [0, 15],
                [0, 1],
                clamp
              );

            // --------------------------------------------
            // Very slow stable zoom
            // NO BEAT PULSE
            // --------------------------------------------

            const slowMoZoom =
              interpolate(
                s5Frame,
                [0, 180],
                [1.0, 1.08],
                clamp
              );

            // --------------------------------------------
            // CARD 1
            // --------------------------------------------

            const c1Progress =
              interpolate(
                s5Frame,
                [0, 25],
                [0, 1],
                {
                  ...clamp,
                  easing:
                    Easing.out(
                      Easing.cubic
                    ),
                }
              );

            const c1Y =
              interpolate(
                c1Progress,
                [0, 1],
                [400, 0],
                clamp
              );

            // --------------------------------------------
            // CARD 2
            // --------------------------------------------

            const c2Progress =
              interpolate(
                s5Frame,
                [12, 37],
                [0, 1],
                {
                  ...clamp,
                  easing:
                    Easing.out(
                      Easing.cubic
                    ),
                }
              );

            const c2Y =
              interpolate(
                c2Progress,
                [0, 1],
                [450, 0],
                clamp
              );

            // --------------------------------------------
            // CARD 3
            // --------------------------------------------

            const c3Progress =
              interpolate(
                s5Frame,
                [24, 50],
                [0, 1],
                {
                  ...clamp,
                  easing:
                    Easing.out(
                      Easing.cubic
                    ),
                }
              );

            const c3Y =
              interpolate(
                c3Progress,
                [0, 1],
                [500, 0],
                clamp
              );

            return (
              <AbsoluteFill
                style={{
                  background:
                    "linear-gradient(135deg, #100018 0%, #000000 50%, #001520 100%)",

                  opacity:
                    s5BgOpacity,

                  overflow: "hidden",

                  perspective: 1200,
                }}
              >
                {/* ========================================
                    PARTICLES
                ======================================== */}

                <EnergeticParticles
                  frame={s5Frame}
                />

                {/* ========================================
                    CARD 1
                ======================================== */}

                <div
                  style={{
                    position: "absolute",

                    left: "44%",
                    top: "46%",

                    width: 700,
                    height: 920,

                    padding:
                      "20px 20px 75px 20px",

                    backgroundColor:
                      "#ffffff",

                    borderRadius: "8px",

                    boxShadow:
                      "0 25px 60px rgba(255,0,85,0.35)",

                    transform: `
                      translate(-50%, -50%)
                      translateY(${c1Y}px)
                      rotate(-14deg)
                      scale(${c1Progress * slowMoZoom})
                    `,

                    opacity: c1Progress,

                    zIndex: 10,

                    willChange:
                      "transform, opacity",
                  }}
                >
                  <Img
                    src={getImgSrc(
                      safeImages[16],
                      16
                    )}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* ========================================
                    CARD 2
                ======================================== */}

                <div
                  style={{
                    position: "absolute",

                    left: "56%",
                    top: "44%",

                    width: 720,
                    height: 940,

                    padding:
                      "20px 20px 75px 20px",

                    backgroundColor:
                      "#ffffff",

                    borderRadius: "8px",

                    boxShadow:
                      "0 25px 60px rgba(0,229,255,0.35)",

                    transform: `
                      translate(-50%, -50%)
                      translateY(${c2Y}px)
                      rotate(12deg)
                      scale(${c2Progress * slowMoZoom})
                    `,

                    opacity: c2Progress,

                    zIndex: 20,

                    willChange:
                      "transform, opacity",
                  }}
                >
                  <Img
                    src={getImgSrc(
                      safeImages[17],
                      17
                    )}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* ========================================
                    CARD 3
                ======================================== */}

                <div
                  style={{
                    position: "absolute",

                    left: "50%",
                    top: "42%",

                    width: 760,
                    height: 980,

                    padding:
                      "24px 24px 85px 24px",

                    backgroundColor:
                      "#ffffff",

                    borderRadius: "10px",

                    boxShadow:
                      "0 35px 80px rgba(0,229,255,0.45)",

                    transform: `
                      translate(-50%, -50%)
                      translateY(${c3Y}px)
                      rotate(-2.5deg)
                      scale(${c3Progress * slowMoZoom})
                    `,

                    opacity: c3Progress,

                    zIndex: 30,

                    willChange:
                      "transform, opacity",
                  }}
                >
                  <Img
                    src={getImgSrc(
                      safeImages[18],
                      18
                    )}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Template34;