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
          (pFrame % 90),
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
// TEMPLATE 29 COMPONENT
// ======================================================

export const Template29: React.FC<Template29Props> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();

  // Validate image array length
  const safeImages = images.length >= 9 ? images : DEFAULT_PROPS.images!;

  // ----------------------------------------------------
  // SCENE TIMINGS (Total 300 Frames / 10 Sec)
  // ----------------------------------------------------
  // Scene 1: 0 - 60 frames (0.0s - 2.0s) -> 4-Photo Collage + "i love you"
  // Scene 2: 60 - 150 frames (2.0s - 5.0s) -> RGB Diamond Mask Reveal
  // Scene 3: 150 - 240 frames (5.0s - 8.0s) -> Garden Bokeh + Radial Blur Zoom
  // Scene 4: 240 - 300 frames (8.0s - 10.0s) -> 3D Polaroid Card Stack

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
      {musicSrc && <MusicPlayer src={musicSrc} volume={typeof music === "object" ? music?.volume : 1} />}

      {/* ===================================================================
          SCENE 1: 4-PHOTO COLLAGE GRID & "i love you" ANIMATED TEXT (0-2s)
          =================================================================== */}
      {(isScene1 || frame < 65) && (
        <AbsoluteFill style={{ zIndex: 1 }}>
          {(() => {
            const s1Frame = frame;

            // Blur & Darkening Transition at end of Scene 1 (Frames 45-60)
            const s1Darken = interpolate(s1Frame, [45, 60], [1, 0.3], clamp);
            const s1Blur = interpolate(s1Frame, [45, 60], [0, 10], clamp);
            const s1Scale = interpolate(s1Frame, [0, 60], [1, 1.05], clamp);

            // Text Animations ("i love you")
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
            const textFloatY = interpolate(s1Frame, [15, 60], [0, -12], clamp);

            return (
              <AbsoluteFill
                style={{
                  filter: `brightness(${s1Darken}) blur(${s1Blur}px)`,
                  transform: `scale(${s1Scale})`,
                  transition: "filter 0.1s ease",
                }}
              >
                {/* 2x2 Photo Grid */}
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
                  {/* Top Left - Image 1 */}
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

                  {/* Top Right - Image 2 */}
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

                  {/* Bottom Left - Image 3 */}
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

                  {/* Bottom Right - Image 4 */}
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

                {/* Animated "i love you" Text Overlay */}
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
                      fontSize: 82,
                      fontWeight: 800,
                      color: "#ffffff",
                      letterSpacing: "1px",
                      textTransform: "lowercase",
                      textShadow: `
                        -2px -2px 0 #000,
                         2px -2px 0 #000,
                        -2px  2px 0 #000,
                         2px  2px 0 #000,
                         0px  8px 20px rgba(0,0,0,0.7)
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
          SCENE 2: RGB CHROMATIC DIAMOND MASK REVEAL (2-5s / Frames 60-150)
          =================================================================== */}
      {(isScene2 || (frame >= 55 && frame < 155)) && (
        <AbsoluteFill style={{ zIndex: 2 }}>
          {(() => {
            const s2Frame = frame - 60;

            // Diamond scale animation from 0% -> 100% -> 220%
            const diamondScale = interpolate(
              s2Frame,
              [0, 30, 80],
              [0, 0.7, 2.2],
              {
                ...clamp,
                easing: Easing.out(Easing.cubic),
              }
            );

            // Opacity of scene 2
            const scene2Opacity = interpolate(s2Frame, [0, 10], [0, 1], clamp);

            // Dip to black transition at end of Scene 2 (Frames 80-90 in s2Frame, i.e. 140-150 total)
            const dipToBlackOpacity = interpolate(
              s2Frame,
              [75, 88],
              [1, 0],
              clamp
            );

            // RGB Shift Border Offset Animation
            const rgbOffset = interpolate(s2Frame, [0, 30, 80], [18, 12, 4], clamp);

            return (
              <AbsoluteFill style={{ opacity: scene2Opacity * dipToBlackOpacity }}>
                {/* Full Image Container */}
                <AbsoluteFill>
                  <Img
                    src={getImgSrc(safeImages[4], 4)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: `scale(${interpolate(s2Frame, [0, 90], [1.15, 1.0], clamp)})`,
                    }}
                  />
                </AbsoluteFill>

                {/* Animated Diamond Mask Layer */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    clipPath: `polygon(50% ${50 - diamondScale * 50}%, ${50 + diamondScale * 50}% 50%, 50% ${50 + diamondScale * 50}%, ${50 - diamondScale * 50}% 50%)`,
                    overflow: "hidden",
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

                {/* RGB Chromatic Aberration Prism Lines around Diamond Border */}
                {diamondScale > 0.05 && diamondScale < 1.8 && (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: `${diamondScale * 100}%`,
                      height: `${diamondScale * 100}%`,
                      transform: "translate(-50%, -50%) rotate(45deg)",
                      border: "6px solid #ffffff",
                      boxShadow: `
                        ${rgbOffset}px -${rgbOffset}px 0 #ff0055,
                        -${rgbOffset}px ${rgbOffset}px 0 #00e5ff,
                        0 0 25px rgba(255,255,255,0.9)
                      `,
                      pointerEvents: "none",
                    }}
                  />
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

            // Ken Burns slow zoom
            const kenBurnsZoom = interpolate(s3Frame, [0, 90], [1.0, 1.15], clamp);

            // Scene Entry Opacity
            const s3Opacity = interpolate(s3Frame, [0, 10], [0, 1], clamp);

            // Radial Motion Blur & Push-In Zoom (Frames 75-90 in s3Frame, i.e., 225-240 total)
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
                {/* Photo Image */}
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

                {/* Light Leak Flare Overlay */}
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

                {/* Floating Bokeh Gold Particles */}
                <BokehParticles frame={s3Frame} />
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ===================================================================
          SCENE 4: 3D POLAROID PHOTO CARDS STACK CAROUSEL (8-10s / Frames 240-300)
          =================================================================== */}
      {isScene4 && (
        <AbsoluteFill style={{ zIndex: 4 }}>
          {(() => {
            const s4Frame = frame - 240;

            // Background Fade In
            const s4BgOpacity = interpolate(s4Frame, [0, 12], [0, 1], clamp);

            // Card 1 (Bottom Card - Image 9 / Index 8)
            const card1Progress = interpolate(
              s4Frame,
              [0, 18],
              [0, 1],
              { ...clamp, easing: Easing.out(Easing.back(1.2)) }
            );
            const card1Y = interpolate(card1Progress, [0, 1], [300, 0], clamp);
            const card1Scale = interpolate(card1Progress, [0, 1], [0.7, 1], clamp);

            // Card 2 (Middle Card - Image 8 / Index 7)
            const card2Progress = interpolate(
              s4Frame,
              [6, 24],
              [0, 1],
              { ...clamp, easing: Easing.out(Easing.back(1.2)) }
            );
            const card2Y = interpolate(card2Progress, [0, 1], [350, 0], clamp);
            const card2Scale = interpolate(card2Progress, [0, 1], [0.7, 1], clamp);

            // Card 3 (Main Front Card - Image 7 / Index 6)
            const card3Progress = interpolate(
              s4Frame,
              [12, 32],
              [0, 1],
              { ...clamp, easing: Easing.out(Easing.back(1.4)) }
            );
            const card3Y = interpolate(card3Progress, [0, 1], [400, 0], clamp);
            const card3Scale = interpolate(card3Progress, [0, 1], [0.65, 1], clamp);

            return (
              <AbsoluteFill
                style={{
                  background:
                    "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
                  opacity: s4BgOpacity,
                  overflow: "hidden",
                }}
              >
                {/* Soft Radial Ambient Glow */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at 50% 40%, rgba(255,230,240,0.6) 0%, transparent 70%)",
                  }}
                />

                {/* CARD 1 (Bottom Stacked Card - Image 9 / Index 8) */}
                <div
                  style={{
                    position: "absolute",
                    left: "46%",
                    top: "48%",
                    width: 720,
                    height: 940,
                    padding: "24px 24px 80px 24px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 20px 45px rgba(0,0,0,0.18)",
                    transform: `
                      translate(-50%, -50%)
                      translateY(${card1Y}px)
                      rotate(-14deg)
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
                    }}
                  />
                </div>

                {/* CARD 2 (Middle Stacked Card - Image 8 / Index 7) */}
                <div
                  style={{
                    position: "absolute",
                    left: "54%",
                    top: "46%",
                    width: 740,
                    height: 960,
                    padding: "24px 24px 80px 24px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 22px 50px rgba(0,0,0,0.22)",
                    transform: `
                      translate(-50%, -50%)
                      translateY(${card2Y}px)
                      rotate(11deg)
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
                    }}
                  />
                </div>

                {/* CARD 3 (Main Center Card - Image 7 / Index 6) */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "45%",
                    width: 780,
                    height: 1000,
                    padding: "26px 26px 90px 26px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 30px 70px rgba(0,0,0,0.30)",
                    transform: `
                      translate(-50%, -50%)
                      translateY(${card3Y}px)
                      rotate(-3deg)
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
