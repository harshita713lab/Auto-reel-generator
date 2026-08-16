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

interface Template29Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIGURATION & CONSTANTS
// ======================================================

export const FPS = 30;

// 10 Seconds total duration (300 frames @ 30 FPS)
export const DURATION_IN_FRAMES = 300;

// Exactly 9 Images required
export const IMAGE_COUNT = 9;

// Default fallback props for Remotion preview
export const DEFAULT_PROPS: Template29Props = {
  images: Array(9).fill({
    path: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop",
  }),
  music: undefined,
};

// Common interpolation clamping helper
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// Helper to extract image source
const getImgSrc = (img?: ImageItem, index: number = 0): string => {
  if (img?.path) return img.path;
  if (img?.url) return img.url;
  return DEFAULT_PROPS.images![index]?.path || "";
};

// ======================================================
// BOKEH PARTICLES COMPONENT (SCENE 3)
// ======================================================

const BokehParticles: React.FC<{ frame: number }> = ({ frame }) => {
  const particles = [
    { id: 1, x: 20, y: 30, size: 80, speedY: -0.4, speedX: 0.2, delay: 0 },
    { id: 2, x: 75, y: 65, size: 120, speedY: -0.5, speedX: -0.3, delay: 5 },
    { id: 3, x: 40, y: 80, size: 90, speedY: -0.6, speedX: 0.15, delay: 10 },
    { id: 4, x: 85, y: 25, size: 60, speedY: -0.3, speedX: -0.25, delay: 2 },
    { id: 5, x: 15, y: 70, size: 110, speedY: -0.45, speedX: 0.3, delay: 8 },
    { id: 6, x: 60, y: 40, size: 100, speedY: -0.55, speedX: -0.1, delay: 12 },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 12 }}>
      {particles.map((p) => {
        const pFrame = Math.max(0, frame - p.delay);
        const currentY = p.y + pFrame * p.speedY;
        const currentX = p.x + pFrame * p.speedX;
        const opacity = interpolate(
          pFrame % 90,
          [0, 45, 90],
          [0.2, 0.7, 0.2],
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
                "radial-gradient(circle, rgba(255,225,160,0.85) 0%, rgba(255,210,120,0.3) 50%, rgba(255,200,100,0) 70%)",
              filter: "blur(8px)",
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
// SONG LYRICS OVERLAY (EXACT USER TIMING MATCH)
// ======================================================

const SongLyricsOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  let lyricText = "";

  if (frame >= 0 && frame < 120) {
    lyricText = "Aashiyana mera...";
  } else if (frame >= 150 && frame < 210) {
    lyricText = "Saath tere hai na...";
  } else if (frame >= 210 && frame <= 300) {
    lyricText = "Dhoondhte teri gali, mujhko ghar mila...";
  }

  if (!lyricText) return null;

  let opacity = 1;
  let scale = 1;

  if (frame < 120) {
    opacity = interpolate(frame, [0, 15, 105, 120], [0, 1, 1, 0], clamp);
    scale = interpolate(frame, [0, 20], [0.85, 1], {
      ...clamp,
      easing: Easing.out(Easing.back(1.2)),
    });
  } else if (frame >= 150 && frame < 210) {
    const f = frame - 150;
    opacity = interpolate(f, [0, 12, 48, 60], [0, 1, 1, 0], clamp);
    scale = interpolate(f, [0, 15], [0.85, 1], {
      ...clamp,
      easing: Easing.out(Easing.back(1.2)),
    });
  } else if (frame >= 210) {
    const f = frame - 210;
    opacity = interpolate(f, [0, 12, 75, 90], [0, 1, 1, 0], clamp);
    scale = interpolate(f, [0, 15], [0.85, 1], {
      ...clamp,
      easing: Easing.out(Easing.back(1.2)),
    });
  }

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: frame >= 240 ? "6%" : "10%",
        transform: `translateX(-50%) scale(${scale})`,
        opacity,
        zIndex: 50,
        textAlign: "center",
        width: "92%",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "'Segoe UI', Roboto, sans-serif",
          fontSize: frame >= 210 ? 38 : 44,
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: "0.5px",
          textShadow: `
            -2px -2px 0 #000,
             2px -2px 0 #000,
            -2px  2px 0 #000,
             2px  2px 0 #000,
             0px  6px 18px rgba(0,0,0,0.85)
          `,
        }}
      >
        {lyricText}
      </span>
    </div>
  );
};

// ======================================================
// TEMPLATE 29 MAIN COMPONENT
// ======================================================

export const Template29: React.FC<Template29Props> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();

  const safeImages = images.length >= 9 ? images : DEFAULT_PROPS.images!;

  const isScene1 = frame >= 0 && frame < 60;
  const isScene2 = frame >= 60 && frame < 150;
  const isScene3 = frame >= 150 && frame < 240;
  const isScene4 = frame >= 240;

  // Global Outro Fade Out (Frames 290-300)
  const globalFadeOut = interpolate(frame, [290, 300], [1, 0], clamp);

  // Music source extraction
  const musicSrc = typeof music === "string" ? music : music?.path;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050505",
        opacity: globalFadeOut,
        overflow: "hidden",
      }}
    >
      {/* Background Music Player */}
      {musicSrc && (
        <MusicPlayer
          src={musicSrc}
          volume={typeof music === "object" ? music?.volume : 1}
        />
      )}

      {/* Lyrics Overlay ("Tu Jo Mila") */}
      <SongLyricsOverlay frame={frame} />

      {/* ===================================================================
          SCENE 1: 4-PHOTO COLLAGE GRID & "i love you" ANIMATED TEXT (0-2s)
          =================================================================== */}
      {(isScene1 || frame < 65) && (
        <AbsoluteFill style={{ zIndex: 1 }}>
          {(() => {
            const s1Frame = frame;

            // Darkening/Blur transition at end of Scene 1
            const s1Darken = interpolate(s1Frame, [45, 60], [1, 0.35], clamp);
            const s1Blur = interpolate(s1Frame, [45, 60], [0, 8], clamp);
            const s1Scale = interpolate(s1Frame, [0, 60], [1, 1.05], clamp);

            // Text Animations ("i love you" - Original style match)
            const textPopProgress = interpolate(
              s1Frame,
              [12, 28],
              [0, 1],
              {
                ...clamp,
                easing: Easing.out(Easing.back(1.4)),
              }
            );

            const textScale = interpolate(textPopProgress, [0, 1], [0.5, 1], clamp);
            const textOpacity = interpolate(s1Frame, [12, 22, 50, 60], [0, 1, 1, 0], clamp);
            const textFloatY = interpolate(s1Frame, [15, 60], [0, -10], clamp);

            return (
              <AbsoluteFill
                style={{
                  filter: `brightness(${s1Darken}) blur(${s1Blur}px)`,
                  transform: `scale(${s1Scale})`,
                  transition: "filter 0.1s ease",
                }}
              >
                {/* 2x2 Photo Grid Collage */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridTemplateRows: "1fr 1fr",
                    width: "100%",
                    height: "100%",
                    gap: "6px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <div style={{ overflow: "hidden", position: "relative" }}>
                    <Img
                      src={getImgSrc(safeImages[0], 0)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ overflow: "hidden", position: "relative" }}>
                    <Img
                      src={getImgSrc(safeImages[1], 1)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ overflow: "hidden", position: "relative" }}>
                    <Img
                      src={getImgSrc(safeImages[2], 2)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ overflow: "hidden", position: "relative" }}>
                    <Img
                      src={getImgSrc(safeImages[3], 3)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>

                {/* Original "i love you" Animated Text */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) translateY(${textFloatY}px) scale(${textScale})`,
                    opacity: textOpacity,
                    zIndex: 10,
                    textAlign: "center",
                    width: "90%",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
                      fontSize: 84,
                      fontWeight: 800,
                      color: "#ffffff",
                      letterSpacing: "1px",
                      textTransform: "lowercase",
                      textShadow: `
                        -3px -3px 0 #000,
                         3px -3px 0 #000,
                        -3px  3px 0 #000,
                         3px  3px 0 #000,
                         0px  8px 24px rgba(0,0,0,0.75)
                      `,
                    }}
                  >
                    i love you
                  </span>
                </div>
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ===================================================================
          SCENE 2: SHATTERED PIECE-BY-PIECE ASSEMBLE + 2S BLACK FILTER -> COLOR REVEAL
          (2-5s / Frames 60-150)
          =================================================================== */}
      {(isScene2 || (frame >= 55 && frame < 155)) && (
        <AbsoluteFill style={{ zIndex: 2 }}>
          {(() => {
            const s2Frame = frame - 60;

            const colorProgress = interpolate(
              s2Frame,
              [50, 75],
              [0, 1],
              clamp
            );

            const currentBrightness = interpolate(colorProgress, [0, 1], [0.35, 1.05], clamp);
            const currentGrayscale = interpolate(colorProgress, [0, 1], [1.0, 0], clamp);
            const currentSaturate = interpolate(colorProgress, [0, 1], [0.3, 1.25], clamp);

            const expandProgress = interpolate(
              s2Frame,
              [45, 88],
              [0.4, 2.3],
              {
                ...clamp,
                easing: Easing.out(Easing.cubic),
              }
            );

            const scene2Opacity = interpolate(s2Frame, [0, 8], [0, 1], clamp);
            const dipToBlackOpacity = interpolate(
              s2Frame,
              [78, 90],
              [1, 0],
              clamp
            );

            const p1 = interpolate(s2Frame, [0, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.2)) });
            const p1X = interpolate(p1, [0, 1], [-200, 0], clamp);
            const p1Y = interpolate(p1, [0, 1], [-200, 0], clamp);

            const p2 = interpolate(s2Frame, [6, 20], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.2)) });
            const p2X = interpolate(p2, [0, 1], [200, 0], clamp);
            const p2Y = interpolate(p2, [0, 1], [-200, 0], clamp);

            const p3 = interpolate(s2Frame, [12, 26], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.2)) });
            const p3X = interpolate(p3, [0, 1], [-200, 0], clamp);
            const p3Y = interpolate(p3, [0, 1], [200, 0], clamp);

            const p4 = interpolate(s2Frame, [18, 32], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.2)) });
            const p4X = interpolate(p4, [0, 1], [200, 0], clamp);
            const p4Y = interpolate(p4, [0, 1], [200, 0], clamp);

            const p5 = interpolate(s2Frame, [24, 40], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
            const p5Scale = interpolate(p5, [0, 1], [0.2, 1], clamp);

            const diamondSize = expandProgress * 50;

            return (
              <AbsoluteFill
                style={{
                  opacity: scene2Opacity * dipToBlackOpacity,
                  filter: `brightness(${currentBrightness}) grayscale(${currentGrayscale}) saturate(${currentSaturate})`,
                }}
              >
                <AbsoluteFill>
                  <Img
                    src={getImgSrc(safeImages[4], 4)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: `scale(${interpolate(s2Frame, [0, 90], [1.12, 1.0], clamp)})`,
                    }}
                  />
                </AbsoluteFill>

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    clipPath: `polygon(50% ${50 - diamondSize}%, ${50 + diamondSize}% 50%, 50% ${50 + diamondSize}%, ${50 - diamondSize}% 50%)`,
                    overflow: "hidden",
                    transform: `scale(${p5Scale})`,
                    opacity: p5,
                  }}
                >
                  <Img
                    src={getImgSrc(safeImages[4], 4)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {expandProgress < 1.8 && (
                  <svg
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                    viewBox="0 0 1000 1777"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <filter id="rgbPrismShatter">
                        <feDropShadow dx="3" dy="-3" stdDeviation="0" floodColor="#ff0055" />
                        <feDropShadow dx="-3" dy="3" stdDeviation="0" floodColor="#00e5ff" />
                        <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ffea00" />
                      </filter>
                    </defs>

                    {(() => {
                      const cX = 500;
                      const cY = 888.5;
                      const dW = (diamondSize / 100) * 1000;
                      const dH = (diamondSize / 100) * 1777;

                      const topP = `${cX},${cY - dH}`;
                      const rightP = `${cX + dW},${cY}`;
                      const botP = `${cX},${cY + dH}`;
                      const leftP = `${cX - dW},${cY}`;

                      return (
                        <g>
                          <polygon
                            points={`${topP} ${rightP} ${botP} ${leftP}`}
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="16"
                            filter="url(#rgbPrismShatter)"
                            style={{ opacity: p5 }}
                          />
                          <polygon
                            points={`${topP} ${rightP} ${botP} ${leftP}`}
                            fill="none"
                            stroke="#000000"
                            strokeWidth="10"
                            style={{ opacity: p5 }}
                          />

                          <g style={{ transform: `translate(${p1X}px, ${p1Y}px)`, opacity: p1 }}>
                            <line x1={cX - dW} y1={cY} x2="0" y2="0" stroke="#ffffff" strokeWidth="14" filter="url(#rgbPrismShatter)" />
                            <line x1={cX - dW} y1={cY} x2="0" y2="0" stroke="#000000" strokeWidth="8" />
                          </g>

                          <g style={{ transform: `translate(${p2X}px, ${p2Y}px)`, opacity: p2 }}>
                            <line x1={cX + dW} y1={cY} x2="1000" y2="0" stroke="#ffffff" strokeWidth="14" filter="url(#rgbPrismShatter)" />
                            <line x1={cX + dW} y1={cY} x2="1000" y2="0" stroke="#000000" strokeWidth="8" />
                          </g>

                          <g style={{ transform: `translate(${p3X}px, ${p3Y}px)`, opacity: p3 }}>
                            <line x1={cX - dW} y1={cY} x2="0" y2="1777" stroke="#ffffff" strokeWidth="14" filter="url(#rgbPrismShatter)" />
                            <line x1={cX - dW} y1={cY} x2="0" y2="1777" stroke="#000000" strokeWidth="8" />
                          </g>

                          <g style={{ transform: `translate(${p4X}px, ${p4Y}px)`, opacity: p4 }}>
                            <line x1={cX + dW} y1={cY} x2="1000" y2="1777" stroke="#ffffff" strokeWidth="14" filter="url(#rgbPrismShatter)" />
                            <line x1={cX + dW} y1={cY} x2="1000" y2="1777" stroke="#000000" strokeWidth="8" />
                          </g>
                        </g>
                      );
                    })()}
                  </svg>
                )}
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ===================================================================
          SCENE 3: GARDEN BOKEH & RADIAL MOTION BLUR (5-8s / Frames 150-240)
          =================================================================== */}
      {(isScene3 || (frame >= 145 && frame < 245)) && (
        <AbsoluteFill style={{ zIndex: 3 }}>
          {(() => {
            const s3Frame = frame - 150;

            const kenBurnsZoom = interpolate(s3Frame, [0, 90], [1.0, 1.15], clamp);
            const s3Opacity = interpolate(s3Frame, [0, 10], [0, 1], clamp);

            const radialBlur = interpolate(s3Frame, [75, 90], [0, 35], clamp);
            const exitZoom = interpolate(s3Frame, [75, 90], [1.0, 1.6], clamp);
            const exitOpacity = interpolate(s3Frame, [80, 90], [1, 0], clamp);

            return (
              <AbsoluteFill
                style={{
                  opacity: s3Opacity * exitOpacity,
                  backgroundColor: "#000",
                }}
              >
                <Img
                  src={getImgSrc(safeImages[5], 5)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: `blur(${radialBlur}px)`,
                    transform: `scale(${kenBurnsZoom * exitZoom})`,
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    top: "-20%",
                    left: "-10%",
                    width: "80%",
                    height: "80%",
                    background:
                      "radial-gradient(circle, rgba(255,230,170,0.45) 0%, rgba(255,200,120,0.15) 50%, transparent 80%)",
                    filter: "blur(20px)",
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                />

                <BokehParticles frame={s3Frame} />
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ===================================================================
          SCENE 4: 3D CUBE ROTATION & SLOW-MOTION ZOOM (8-10s / Frames 240-300)
          No Polaroid Cards! Full screen photos turning like a 3D Cube with Slow-Mo Zoom!
          =================================================================== */}
      {isScene4 && (
        <AbsoluteFill style={{ zIndex: 4, backgroundColor: "#000" }}>
          {(() => {
            const s4Frame = frame - 240;

            // Phase 1 (0 to 30 frames / 8.0s - 9.0s): Photo 7 -> Photo 8 3D Cube Turn
            // Phase 2 (30 to 60 frames / 9.0s - 10.0s): Photo 8 -> Photo 9 3D Cube Turn

            const isPhase1 = s4Frame < 30;
            const phaseFrame = isPhase1 ? s4Frame : s4Frame - 30;

            // 3D Cube Rotation Progress around Y axis
            const cubeRotation = interpolate(
              phaseFrame,
              [0, 26],
              [0, -90],
              {
                ...clamp,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
              }
            );

            // Slow Motion Zoom-In
            const slowMoZoomFront = interpolate(s4Frame, [0, 60], [1.0, 1.25], clamp);
            const slowMoZoomSide = interpolate(s4Frame, [0, 60], [1.05, 1.30], clamp);

            // Front & Next Photo Sources
            const frontImg = isPhase1 ? safeImages[6] : safeImages[7];
            const sideImg = isPhase1 ? safeImages[7] : safeImages[8];

            const frontIdx = isPhase1 ? 6 : 7;
            const sideIdx = isPhase1 ? 7 : 8;

            // Ambient Shadow Lighting during 3D Cube Turn
            const shadowOpacity = interpolate(
              Math.abs(cubeRotation),
              [0, 45, 90],
              [0, 0.45, 0],
              clamp
            );

            return (
              <AbsoluteFill
                style={{
                  perspective: 1200,
                  overflow: "hidden",
                  backgroundColor: "#000",
                }}
              >
                {/* 3D CUBE CONTAINER */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transform: `translateZ(-540px) rotateY(${cubeRotation}deg)`,
                  }}
                >
                  {/* FRONT CUBE FACE (Current Photo) */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      transform: "rotateY(0deg) translateZ(540px)",
                      overflow: "hidden",
                    }}
                  >
                    <Img
                      src={getImgSrc(frontImg, frontIdx)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: `scale(${slowMoZoomFront})`,
                      }}
                    />
                    {/* Shadow overlay during turn */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "#000",
                        opacity: shadowOpacity,
                        pointerEvents: "none",
                      }}
                    />
                  </div>

                  {/* RIGHT SIDE CUBE FACE (Incoming Photo) */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      transform: "rotateY(90deg) translateZ(540px)",
                      overflow: "hidden",
                    }}
                  >
                    <Img
                      src={getImgSrc(sideImg, sideIdx)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: `scale(${slowMoZoomSide})`,
                      }}
                    />
                    {/* Shadow overlay during turn */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "#000",
                        opacity: Math.max(0, 0.45 - shadowOpacity),
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Template29;
