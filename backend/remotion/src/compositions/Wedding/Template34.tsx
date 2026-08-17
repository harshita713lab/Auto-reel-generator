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
// CONFIGURATION & CONSTANTS
// ======================================================

export const FPS = 30;

// 19 Seconds total duration (570 frames @ 30 FPS)
export const DURATION_IN_FRAMES = 570;

// Exactly 19 Images required
export const IMAGE_COUNT = 19;

// Default fallback props for Remotion preview
export const DEFAULT_PROPS: Template34Props = {
  images: Array(19).fill({
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
// BEAT DETECTION & PULSE HELPER (120 BPM SYNC)
// ======================================================

const getBeatPulse = (frame: number): number => {
  const beatCycle = frame % 15; // 120 BPM = 1 beat every 15 frames
  if (beatCycle < 5) {
    return interpolate(beatCycle, [0, 2, 5], [0, 0.035, 0], clamp);
  }
  return 0;
};

// ======================================================
// ENERGETIC NEON SPARKLE PARTICLES (SCENE 5)
// ======================================================

const EnergeticParticles: React.FC<{ frame: number }> = ({ frame }) => {
  const particles = [
    { id: 1, x: 15, y: 25, size: 70, speedY: -0.6, speedX: 0.3, delay: 0 },
    { id: 2, x: 80, y: 70, size: 100, speedY: -0.7, speedX: -0.4, delay: 4 },
    { id: 3, x: 35, y: 85, size: 85, speedY: -0.8, speedX: 0.25, delay: 8 },
    { id: 4, x: 90, y: 30, size: 55, speedY: -0.5, speedX: -0.3, delay: 2 },
    { id: 5, x: 20, y: 65, size: 95, speedY: -0.65, speedX: 0.35, delay: 6 },
    { id: 6, x: 65, y: 45, size: 90, speedY: -0.75, speedX: -0.15, delay: 10 },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 12 }}>
      {particles.map((p) => {
        const pFrame = Math.max(0, frame - p.delay);
        const currentY = p.y + pFrame * p.speedY;
        const currentX = p.x + pFrame * p.speedX;
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
// ENERGETIC CHALEYA LYRICS OVERLAY (ANIMATED ZOOM-IN)
// ======================================================

const ChaleyaLyricsOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  let mainText = "";
  let subText = "";
  let activeColor = "#ffffff";
  const activeZIndex = 50;

  // Stanza Duration = 285 frames (~9.5 seconds per stanza)
  const stanzaLength = 285;
  const stanzaFrame = frame % stanzaLength;

  if (frame >= 0 && frame < 285) {
    mainText = "Tere Saare Rang Odh Ke Dhang Odh Ke";
    subText = "Tera Hua Main Sabko Chhod Ke Ho Ho Ho ❤️✨";
    activeColor = "#ffffff";
  } else if (frame >= 285 && frame <= 570) {
    mainText = "Ishq Ni Karna Naap Tol Ke Raaj Khol Ke";
    subText = "Aaya Hoon Main Sabko Bol Ke Ho 🔥";
    activeColor = "#00e5ff";
  }

  if (!mainText) return null;

  // Animated Spring Zoom-In Entrance for lyrics
  const textZoomProgress = interpolate(
    stanzaFrame,
    [0, 18],
    [0, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.back(1.5)),
    }
  );

  const textScale = interpolate(textZoomProgress, [0, 1], [0.35, 1.0], clamp);
  const textY = interpolate(textZoomProgress, [0, 1], [40, 0], clamp);

  // Pulse animation on musical beats
  const beatPulse = getBeatPulse(frame);

  // Smooth Fade-In and Fade-Out per stanza
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
        bottom: frame >= 285 ? "8%" : "10%",
        transform: `translate(-50%, ${textY}px) scale(${textScale + beatPulse * 1.5})`,
        opacity,
        zIndex: activeZIndex,
        textAlign: "center",
        width: "92%",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: "'Segoe UI', Roboto, sans-serif",
          fontSize: frame >= 285 ? 46 : 42,
          fontWeight: 900,
          color: activeColor,
          letterSpacing: "1px",
          textTransform: "uppercase",
          textShadow: `
            -3px -3px 0 #000,
             3px -3px 0 #000,
            -3px  3px 0 #000,
             3px  3px 0 #000,
             0px  8px 24px rgba(0,0,0,0.95)
          `,
        }}
      >
        {mainText}
      </div>
      {subText && (
        <div
          style={{
            fontFamily: "'Brush Script MT', 'Dancing Script', cursive, sans-serif",
            fontSize: 48,
            fontWeight: 800,
            color: "#ffffff",
            textShadow: "0 4px 18px rgba(0,229,255,0.8), 0 0 12px #000",
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
// TEMPLATE 34 MAIN COMPONENT
// ======================================================

export const Template34: React.FC<Template34Props> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();

  // Validate image array length
  const safeImages = images.length >= 19 ? images : DEFAULT_PROPS.images!;

  // ----------------------------------------------------
  // SCENE TIMINGS (Total 570 Frames / 19 Sec)
  // ----------------------------------------------------
  // Scene 1: 0 - 90 frames (0s - 3s) -> Neon Strobe & Fast Beats (Images 1-4)
  // Scene 2: 90 - 180 frames (3s - 6s) -> 6-Photo Dynamic Grid Stagger (Images 5-10) [BLACK BG]
  // Scene 3: 180 - 270 frames (6s - 9s) -> Fast 3D Cube Spin & Zoom (Images 11-13)
  // Scene 4: 270 - 390 frames (9s - 13s) -> Shattered Prism & Flash Cuts (Images 14-16)
  // Scene 5: 390 - 570 frames (13s - 19s) -> Grand Finale 3D Polaroid & Slow-Mo Outro (Images 17-19)

  const isScene1 = frame >= 0 && frame < 90;
  const isScene2 = frame >= 90 && frame < 180;
  const isScene3 = frame >= 180 && frame < 270;
  const isScene4 = frame >= 270 && frame < 390;
  const isScene5 = frame >= 390;

  // Global Outro Fade Out (Frames 550-570)
  const globalFadeOut = interpolate(frame, [550, 570], [1, 0], clamp);

  // Global Beat Pulse
  const beatPulse = getBeatPulse(frame);

  // Music source extraction
  const musicSrc = typeof music === "string" ? music : music?.path;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
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

      {/* Synced Chaleya Lyrics Overlay */}
      <ChaleyaLyricsOverlay frame={frame} />

      {/* ===================================================================
          SCENE 1: FAST ENERGETIC NEON STROBE & BEAT CUTS (0-3s / Frames 0-90)
          =================================================================== */}
      {(isScene1 || frame < 95) && (
        <AbsoluteFill style={{ zIndex: 1, backgroundColor: "#000000" }}>
          {(() => {
            const s1Frame = frame;

            // Sub-cuts every 22.5 frames (approx 0.75s per photo)
            const subIndex = Math.min(3, Math.floor(s1Frame / 22.5));
            const subFrame = s1Frame % 22.5;

            // Beat Pulse Shake & Dynamic Camera Push
            const pulseScale = 1 + beatPulse + Math.sin(subFrame * 0.3) * 0.04;
            const strobeOpacity = interpolate(subFrame, [0, 4, 22], [0.3, 1, 1], clamp);
            const rotTilt = Math.sin(s1Frame * 0.1) * 1.5;

            return (
              <AbsoluteFill style={{ opacity: strobeOpacity, backgroundColor: "#000000" }}>
                <Img
                  src={getImgSrc(safeImages[subIndex], subIndex)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${pulseScale}) rotate(${rotTilt}deg)`,
                    filter: "contrast(1.15) saturate(1.2)",
                  }}
                />

                {/* Neon Cyber Glow Border */}
                <div
                  style={{
                    position: "absolute",
                    inset: 20,
                    border: "4px solid #ff0055",
                    boxShadow: "0 0 25px #ff0055, inset 0 0 25px #00e5ff",
                    pointerEvents: "none",
                  }}
                />
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ===================================================================
          SCENE 2: MULTI-SCREEN DYNAMIC STAGGERED GRID COLLAGE (3-6s / Frames 90-180)
          BLACK BACKGROUND (User requested: "34 me jo piche yellow background aa rha h use black kro")
          =================================================================== */}
      {(isScene2 || (frame >= 85 && frame < 185)) && (
        <AbsoluteFill style={{ zIndex: 2, backgroundColor: "#000000" }}>
          {(() => {
            const s2Frame = frame - 90;

            const s2Opacity = interpolate(s2Frame, [0, 10], [0, 1], clamp);
            const gridScale = interpolate(s2Frame, [0, 90], [1.0, 1.08], clamp) + beatPulse;

            // Staggered pop-in for 6 photos (Images 4-9)
            const p0 = interpolate(s2Frame, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
            const p1 = interpolate(s2Frame, [8, 20], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
            const p2 = interpolate(s2Frame, [16, 28], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
            const p3 = interpolate(s2Frame, [24, 36], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
            const p4 = interpolate(s2Frame, [32, 44], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
            const p5 = interpolate(s2Frame, [40, 52], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });

            return (
              <AbsoluteFill
                style={{
                  opacity: s2Opacity,
                  backgroundColor: "#000000",
                  transform: `scale(${gridScale})`,
                }}
              >
                {/* 6-Photo Grid Layout WITH BLACK BACKGROUND SEPARATORS */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridTemplateRows: "1fr 1fr 1fr",
                    width: "100%",
                    height: "100%",
                    gap: "6px",
                    backgroundColor: "#000000",
                    padding: "4px",
                  }}
                >
                  <div style={{ overflow: "hidden", transform: `scale(${p0})`, opacity: p0, backgroundColor: "#000" }}>
                    <Img src={getImgSrc(safeImages[4], 4)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ overflow: "hidden", transform: `scale(${p1})`, opacity: p1, backgroundColor: "#000" }}>
                    <Img src={getImgSrc(safeImages[5], 5)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ overflow: "hidden", transform: `scale(${p2})`, opacity: p2, backgroundColor: "#000" }}>
                    <Img src={getImgSrc(safeImages[6], 6)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ overflow: "hidden", transform: `scale(${p3})`, opacity: p3, backgroundColor: "#000" }}>
                    <Img src={getImgSrc(safeImages[7], 7)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ overflow: "hidden", transform: `scale(${p4})`, opacity: p4, backgroundColor: "#000" }}>
                    <Img src={getImgSrc(safeImages[8], 8)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ overflow: "hidden", transform: `scale(${p5})`, opacity: p5, backgroundColor: "#000" }}>
                    <Img src={getImgSrc(safeImages[9], 9)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ===================================================================
          SCENE 3: FAST 3D CUBE SPIN & PERSPECTIVE FLIP (6-9s / Frames 180-270)
          =================================================================== */}
      {(isScene3 || (frame >= 175 && frame < 275)) && (
        <AbsoluteFill style={{ zIndex: 3, backgroundColor: "#000000" }}>
          {(() => {
            const s3Frame = frame - 180;

            // 3 Sub-phases for Images 10, 11, 12
            const phase = Math.min(2, Math.floor(s3Frame / 30));
            const subFrame = s3Frame % 30;

            const cubeRot = interpolate(subFrame, [0, 24], [0, -90], {
              ...clamp,
              easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            });

            const currentImg = safeImages[10 + phase];
            const nextImg = safeImages[10 + Math.min(2, phase + 1)];
            const zoomScale = 1 + beatPulse;

            return (
              <AbsoluteFill style={{ perspective: 1200, overflow: "hidden", backgroundColor: "#000000" }}>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transform: `translateZ(-540px) rotateY(${cubeRot}deg) scale(${zoomScale})`,
                  }}
                >
                  {/* Front Face */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      transform: "rotateY(0deg) translateZ(540px)",
                      overflow: "hidden",
                    }}
                  >
                    <Img
                      src={getImgSrc(currentImg, 10 + phase)}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  {/* Side Face */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      transform: "rotateY(90deg) translateZ(540px)",
                      overflow: "hidden",
                    }}
                  >
                    <Img
                      src={getImgSrc(nextImg, 10 + Math.min(2, phase + 1))}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                </div>
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ===================================================================
          SCENE 4: SHATTERED DIAMOND PRISM & FLASH CUTS (9-13s / Frames 270-390)
          =================================================================== */}
      {(isScene4 || (frame >= 265 && frame < 395)) && (
        <AbsoluteFill style={{ zIndex: 4, backgroundColor: "#000000" }}>
          {(() => {
            const s4Frame = frame - 270;

            const expandProgress = interpolate(
              s4Frame,
              [0, 45, 110],
              [0.4, 1.2, 2.4],
              { ...clamp, easing: Easing.out(Easing.cubic) }
            );

            const diamondSize = expandProgress * 50;

            return (
              <AbsoluteFill style={{ backgroundColor: "#000000" }}>
                {/* Background Image (Image 13) */}
                <AbsoluteFill>
                  <Img
                    src={getImgSrc(safeImages[13], 13)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(0.6) blur(4px)",
                    }}
                  />
                </AbsoluteFill>

                {/* Center Diamond Mask (Image 14) */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    clipPath: `polygon(50% ${50 - diamondSize}%, ${50 + diamondSize}% 50%, 50% ${50 + diamondSize}%, ${50 - diamondSize}% 50%)`,
                    overflow: "hidden",
                  }}
                >
                  <Img
                    src={getImgSrc(safeImages[14], 14)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(1.1) saturate(1.3)",
                      transform: `scale(${1 + beatPulse})`,
                    }}
                  />
                </div>

                {/* Neon Border Overlay (Clean Cyan/Pink Glitch) */}
                {expandProgress < 1.9 && (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: `${diamondSize * 2}%`,
                      height: `${diamondSize * 2}%`,
                      transform: "translate(-50%, -50%) rotate(45deg)",
                      border: "4px solid #00e5ff",
                      boxShadow: "0 0 30px #ff0055, inset 0 0 30px #00e5ff",
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
          SCENE 5: GRAND FINALE 3D POLAROID & SLOW-MO OUTRO (13-19s / Frames 390-570)
          =================================================================== */}
      {isScene5 && (
        <AbsoluteFill style={{ zIndex: 5, backgroundColor: "#000000" }}>
          {(() => {
            const s5Frame = frame - 390;

            const s5BgOpacity = interpolate(s5Frame, [0, 15], [0, 1], clamp);
            const slowMoZoom = interpolate(s5Frame, [0, 180], [1.0, 1.2], clamp) + beatPulse * 0.5;

            // Card 1 (Bottom Left - Image 16)
            const c1Progress = interpolate(s5Frame, [0, 25], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
            const c1Y = interpolate(c1Progress, [0, 1], [400, 0], clamp);

            // Card 2 (Middle Right - Image 17)
            const c2Progress = interpolate(s5Frame, [12, 37], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
            const c2Y = interpolate(c2Progress, [0, 1], [450, 0], clamp);

            // Card 3 (Main Center - Image 18)
            const c3Progress = interpolate(s5Frame, [24, 50], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
            const c3Y = interpolate(c3Progress, [0, 1], [500, 0], clamp);

            return (
              <AbsoluteFill
                style={{
                  background: "linear-gradient(135deg, #100018 0%, #000000 50%, #001520 100%)",
                  opacity: s5BgOpacity,
                  overflow: "hidden",
                  perspective: 1200,
                }}
              >
                {/* Floating Gold Sparkle Particles */}
                <EnergeticParticles frame={s5Frame} />

                {/* CARD 1 (Image 16) */}
                <div
                  style={{
                    position: "absolute",
                    left: "44%",
                    top: "46%",
                    width: 700,
                    height: 920,
                    padding: "20px 20px 75px 20px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 25px 60px rgba(255,0,85,0.35)",
                    transform: `
                      translate(-50%, -50%)
                      translateY(${c1Y}px)
                      rotate(-14deg)
                      scale(${c1Progress * slowMoZoom})
                    `,
                    opacity: c1Progress,
                    zIndex: 10,
                  }}
                >
                  <Img src={getImgSrc(safeImages[16], 16)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                {/* CARD 2 (Image 17) */}
                <div
                  style={{
                    position: "absolute",
                    left: "56%",
                    top: "44%",
                    width: 720,
                    height: 940,
                    padding: "20px 20px 75px 20px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 25px 60px rgba(0,229,255,0.35)",
                    transform: `
                      translate(-50%, -50%)
                      translateY(${c2Y}px)
                      rotate(12deg)
                      scale(${c2Progress * slowMoZoom})
                    `,
                    opacity: c2Progress,
                    zIndex: 20,
                  }}
                >
                  <Img src={getImgSrc(safeImages[17], 17)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                {/* CARD 3 (Main Center - Image 18) */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "42%",
                    width: 760,
                    height: 980,
                    padding: "24px 24px 85px 24px",
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    boxShadow: "0 35px 80px rgba(0,229,255,0.45)",
                    transform: `
                      translate(-50%, -50%)
                      translateY(${c3Y}px)
                      rotate(-2.5deg)
                      scale(${c3Progress * slowMoZoom})
                    `,
                    opacity: c3Progress,
                    zIndex: 30,
                  }}
                >
                  <Img src={getImgSrc(safeImages[18], 18)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
