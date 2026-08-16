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
  // Exact requested timings:
  // 0s to 4s (Frames 0 - 120): "Aashiyana mera..."
  // 5s to 7s (Frames 150 - 210): "Saath tere hai na..."
  // 7s to 10s (Frames 210 - 300): "Dhoondhte teri gali, mujhko ghar mila..."

  let lyricText = "";

  if (frame >= 0 && frame < 120) {
    lyricText = "Aashiyana mera...";
  } else if (frame >= 150 && frame < 210) {
    lyricText = "Saath tere hai na...";
  } else if (frame >= 210 && frame <= 300) {
    lyricText = "Dhoondhte teri gali, mujhko ghar mila...";
  }

  if (!lyricText) return null;

  // Calculate smooth fade-in and fade-out per line
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
        bottom: frame >= 240 ? "5%" : "10%",
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
          SCENE 2: EXACT DIAMOND SLICE & RGB PRISM LINES (2-5s / Frames 60-150)
          Matches the reference image provided by the user!
          =================================================================== */}
      {(isScene2 || (frame >= 55 && frame < 155)) && (
        <AbsoluteFill style={{ zIndex: 2 }}>
          {(() => {
            const s2Frame = frame - 60;

            // Expansion progress
            const expandProgress = interpolate(
              s2Frame,
              [0, 30, 85],
              [0.35, 0.75, 2.2],
              {
                ...clamp,
                easing: Easing.out(Easing.cubic),
              }
            );

            // Opacity & Dip-to-black
            const scene2Opacity = interpolate(s2Frame, [0, 8], [0, 1], clamp);
            const dipToBlackOpacity = interpolate(
              s2Frame,
              [78, 90],
              [1, 0],
              clamp
            );

            // Size of center diamond
            const diamondSize = expandProgress * 50;

            return (
              <AbsoluteFill style={{ opacity: scene2Opacity * dipToBlackOpacity }}>
                {/* Background Layer: Slightly Desaturated / B&W High-Contrast Image */}
                <AbsoluteFill>
                  <Img
                    src={getImgSrc(safeImages[4], 4)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(0.85) contrast(1.1) grayscale(0.6)",
                      transform: `scale(${interpolate(s2Frame, [0, 90], [1.08, 1.0], clamp)})`,
                    }}
                  />
                </AbsoluteFill>

                {/* Center Diamond Mask: Vibrant Full-Color Image */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    clipPath: `polygon(50% ${50 - diamondSize}%, ${50 + diamondSize}% 50%, 50% ${50 + diamondSize}%, ${50 - diamondSize}% 50%)`,
                    overflow: "hidden",
                  }}
                >
                  <Img
                    src={getImgSrc(safeImages[4], 4)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(1.05) saturate(1.2)",
                    }}
                  />
                </div>

                {/* GEOMETRIC DIAMOND & CORNER SLICE LINES (Matches reference image!) */}
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
                      {/* RGB Chromatic Split Filters */}
                      <filter id="rgbPrism">
                        <feDropShadow dx="3" dy="-3" stdDeviation="0" floodColor="#ff0055" />
                        <feDropShadow dx="-3" dy="3" stdDeviation="0" floodColor="#00e5ff" />
                        <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ffea00" />
                      </filter>
                    </defs>

                    {/* SVG Coordinates for Center Diamond */}
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
                          {/* Outer Chromatic RGB Glow Lines */}
                          <polygon
                            points={`${topP} ${rightP} ${botP} ${leftP}`}
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="16"
                            filter="url(#rgbPrism)"
                          />

                          {/* Inner Solid Black Bar Line */}
                          <polygon
                            points={`${topP} ${rightP} ${botP} ${leftP}`}
                            fill="none"
                            stroke="#000000"
                            strokeWidth="10"
                          />

                          {/* 4 Diagonal Extension Lines to Screen Corners */}
                          {/* Top-Left Diagonal */}
                          <line
                            x1={cX - dW}
                            y1={cY}
                            x2="0"
                            y2="0"
                            stroke="#ffffff"
                            strokeWidth="14"
                            filter="url(#rgbPrism)"
                          />
                          <line
                            x1={cX - dW}
                            y1={cY}
                            x2="0"
                            y2="0"
                            stroke="#000000"
                            strokeWidth="8"
                          />

                          {/* Top-Right Diagonal */}
                          <line
                            x1={cX + dW}
                            y1={cY}
                            x2="1000"
                            y2="0"
                            stroke="#ffffff"
                            strokeWidth="14"
                            filter="url(#rgbPrism)"
                          />
                          <line
                            x1={cX + dW}
                            y1={cY}
                            x2="1000"
                            y2="0"
                            stroke="#000000"
                            strokeWidth="8"
                          />

                          {/* Bottom-Left Diagonal */}
                          <line
                            x1={cX - dW}
                            y1={cY}
                            x2="0"
                            y2="1777"
                            stroke="#ffffff"
                            strokeWidth="14"
                            filter="url(#rgbPrism)"
                          />
                          <line
                            x1={cX - dW}
                            y1={cY}
                            x2="0"
                            y2="1777"
                            stroke="#000000"
                            strokeWidth="8"
                          />

                          {/* Bottom-Right Diagonal */}
                          <line
                            x1={cX + dW}
                            y1={cY}
                            x2="1000"
                            y2="1777"
                            stroke="#ffffff"
                            strokeWidth="14"
                            filter="url(#rgbPrism)"
                          />
                          <line
                            x1={cX + dW}
                            y1={cY}
                            x2="1000"
                            y2="1777"
                            stroke="#000000"
                            strokeWidth="8"
                          />
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
          SCENE 4: ULTRA-SMOOTH 3D POLAROID PHOTO CARDS STACK (8-10s / Frames 240-300)
          =================================================================== */}
      {isScene4 && (
        <AbsoluteFill style={{ zIndex: 4 }}>
          {(() => {
            const s4Frame = frame - 240;

            // Background Fade In
            const s4BgOpacity = interpolate(s4Frame, [0, 12], [0, 1], clamp);

            // Floating Gentle Wobble for Main Card
            const floatWobbleY = Math.sin(s4Frame * 0.12) * 5;
            const floatWobbleRot = Math.cos(s4Frame * 0.08) * 1.5;

            // Card 1 (Bottom Card - Image 9 / Index 8)
            const card1Progress = interpolate(
              s4Frame,
              [0, 20],
              [0, 1],
              { ...clamp, easing: Easing.out(Easing.back(1.3)) }
            );
            const card1Y = interpolate(card1Progress, [0, 1], [400, 0], clamp);
            const card1Scale = interpolate(card1Progress, [0, 1], [0.65, 1], clamp);

            // Card 2 (Middle Card - Image 8 / Index 7)
            const card2Progress = interpolate(
              s4Frame,
              [6, 26],
              [0, 1],
              { ...clamp, easing: Easing.out(Easing.back(1.3)) }
            );
            const card2Y = interpolate(card2Progress, [0, 1], [450, 0], clamp);
            const card2Scale = interpolate(card2Progress, [0, 1], [0.65, 1], clamp);

            // Card 3 (Main Center Front Card - Image 7 / Index 6)
            const card3Progress = interpolate(
              s4Frame,
              [12, 34],
              [0, 1],
              { ...clamp, easing: Easing.out(Easing.back(1.5)) }
            );
            const card3Y = interpolate(card3Progress, [0, 1], [500, 0], clamp);
            const card3Scale = interpolate(card3Progress, [0, 1], [0.6, 1], clamp);

            return (
              <AbsoluteFill
                style={{
                  background:
                    "linear-gradient(135deg, #fff6f8 0%, #f7e1e9 50%, #fff9fb 100%)",
                  opacity: s4BgOpacity,
                  overflow: "hidden",
                  perspective: 1200,
                }}
              >
                {/* Soft Radial Ambient Glow */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at 50% 40%, rgba(255,200,220,0.65) 0%, transparent 70%)",
                  }}
                />

                {/* CARD 1 (Bottom Left Stacked Card - Image 9 / Index 8) */}
                <div
                  style={{
                    position: "absolute",
                    left: "44%",
                    top: "46%",
                    width: 720,
                    height: 940,
                    padding: "24px 24px 85px 24px",
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                    boxShadow: "0 22px 55px rgba(0,0,0,0.22)",
                    transform: `
                      translate(-50%, -50%)
                      translateY(${card1Y}px)
                      rotateX(8deg)
                      rotateY(-10deg)
                      rotateZ(-13deg)
                      scale(${card1Scale})
                    `,
                    opacity: card1Progress,
                    zIndex: 10,
                  }}
                >
                  <Img
                    src={getImgSrc(safeImages[8], 8)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "3px",
                    }}
                  />
                </div>

                {/* CARD 2 (Middle Right Stacked Card - Image 8 / Index 7) */}
                <div
                  style={{
                    position: "absolute",
                    left: "56%",
                    top: "44%",
                    width: 740,
                    height: 960,
                    padding: "24px 24px 85px 24px",
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.26)",
                    transform: `
                      translate(-50%, -50%)
                      translateY(${card2Y}px)
                      rotateX(-6deg)
                      rotateY(12deg)
                      rotateZ(12deg)
                      scale(${card2Scale})
                    `,
                    opacity: card2Progress,
                    zIndex: 20,
                  }}
                >
                  <Img
                    src={getImgSrc(safeImages[7], 7)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "3px",
                    }}
                  />
                </div>

                {/* CARD 3 (Main Center Front Card - Image 7 / Index 6) */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "42%",
                    width: 780,
                    height: 1000,
                    padding: "26px 26px 95px 26px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow:
                      "0 35px 80px rgba(0,0,0,0.35), 0 0 20px rgba(255,215,0,0.3)",
                    transform: `
                      translate(-50%, -50%)
                      translateY(${card3Y + floatWobbleY}px)
                      rotateX(4deg)
                      rotateY(-4deg)
                      rotateZ(${-2.5 + floatWobbleRot}deg)
                      scale(${card3Scale})
                    `,
                    opacity: card3Progress,
                    zIndex: 30,
                  }}
                >
                  <Img
                    src={getImgSrc(safeImages[6], 6)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "4px",
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

export default Template29;
