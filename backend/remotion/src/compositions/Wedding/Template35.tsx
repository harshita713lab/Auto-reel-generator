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

interface Template35Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIGURATION & CONSTANTS
// ======================================================

export const FPS = 30;

// 20 Seconds total duration (600 frames @ 30 FPS)
export const DURATION_IN_FRAMES = 600;

// Exactly 25 Images required
export const IMAGE_COUNT = 25;

// Default fallback props for Remotion preview
export const DEFAULT_PROPS: Template35Props = {
  images: Array(25).fill({
    path: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
  }),
  music: undefined,
};

// Common interpolation clamping helper
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// Helper to extract image source safely
const getImgSrc = (img?: ImageItem, index: number = 0): string => {
  if (img?.path) return img.path;
  if (img?.url) return img.url;
  return DEFAULT_PROPS.images![index]?.path || "";
};

// ======================================================
// SOFT BEAT KEYFRAME HELPER
// ======================================================

const getBeatPulse = (frame: number): number => {
  const beatCycle = frame % 15;
  if (beatCycle < 4) {
    return interpolate(beatCycle, [0, 2, 4], [0, 0.025, 0], clamp);
  }
  return 0;
};

// ======================================================
// GOLDEN GLOWING FLOATING PARTICLES
// ======================================================

const GoldenParticles: React.FC<{ frame: number }> = ({ frame }) => {
  const particles = [
    { id: 1, x: 12, y: 30, size: 65, speedY: -0.5, speedX: 0.25, delay: 0 },
    { id: 2, x: 82, y: 75, size: 95, speedY: -0.6, speedX: -0.3, delay: 5 },
    { id: 3, x: 38, y: 88, size: 75, speedY: -0.7, speedX: 0.2, delay: 10 },
    { id: 4, x: 88, y: 25, size: 55, speedY: -0.4, speedX: -0.25, delay: 3 },
    { id: 5, x: 22, y: 60, size: 85, speedY: -0.55, speedX: 0.3, delay: 7 },
    { id: 6, x: 68, y: 40, size: 80, speedY: -0.65, speedX: -0.2, delay: 12 },
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
                "radial-gradient(circle, rgba(255,225,140,0.9) 0%, rgba(255,190,80,0.4) 50%, rgba(255,140,0,0) 70%)",
              filter: "blur(5px)",
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
// CURSIVE ELEGANT LYRICS OVERLAY ("APNA BANA LE PIYA")
// ======================================================

const CursiveLyricsOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  // Stanza Duration = 100 frames (~3.3 seconds per stanza)
  const stanzaLength = 100;
  const stanzaIndex = Math.min(5, Math.floor(frame / stanzaLength));
  const stanzaFrame = frame % stanzaLength;

  const lyricsData = [
    {
      main: "Chhoone Se Tere...",
      sub: "Haan Tere... Haan Tere ❤️✨",
      color: "#ffe58f",
    },
    {
      main: "Feeki Ruton Ko Rang Lage",
      sub: "Teri Disha Mein Kyun Chalne Se Mere 🌹",
      color: "#ffffff",
    },
    {
      main: "Pairon Ko Pankh Lage 🕊️",
      sub: "Raha Na Mere Kaam Ka Jag Saara ✨",
      color: "#ffe58f",
    },
    {
      main: "Haan Bas Tere Naam Se...",
      sub: "Hi Guzaara... 💖",
      color: "#ffffff",
    },
    {
      main: "Ulajh Ke Yoon Na...",
      sub: "Sulajh Na Sakun ✨",
      color: "#ffe58f",
    },
    {
      main: "Zubaaniyan Teri Jhoothi Bhi Sach Laage",
      sub: "Tu Mera Koyi Na Hoke Bhi Kuchh Laage ❤️",
      color: "#ffffff",
    },
  ];

  const currentStanza = lyricsData[stanzaIndex] || lyricsData[0];

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

  const textScale = interpolate(textZoomProgress, [0, 1], [0.35, 1.05], clamp);
  const textY = interpolate(textZoomProgress, [0, 1], [35, 0], clamp);

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
        bottom: "8%",
        transform: `translate(-50%, ${textY}px) scale(${textScale})`,
        opacity,
        zIndex: 50,
        textAlign: "center",
        width: "94%",
        pointerEvents: "none",
      }}
    >
      {/* Big Cursive Main Lyric */}
      <div
        style={{
          fontFamily: "'Dancing Script', 'Brush Script MT', 'Great Vibes', cursive, sans-serif",
          fontSize: 56,
          fontWeight: 900,
          color: currentStanza.color,
          lineHeight: 1.2,
          letterSpacing: "1px",
          textShadow: `
            0 0 25px ${currentStanza.color},
            -2px -2px 0 #000,
             2px -2px 0 #000,
            -2px  2px 0 #000,
             2px  2px 0 #000,
             0px  6px 20px rgba(0,0,0,0.95)
          `,
        }}
      >
        {currentStanza.main}
      </div>

      {/* Sub Cursive Lyric */}
      {currentStanza.sub && (
        <div
          style={{
            fontFamily: "'Dancing Script', 'Brush Script MT', cursive, sans-serif",
            fontSize: 44,
            fontWeight: 700,
            color: "#ffffff",
            textShadow: "0 4px 18px rgba(255,225,140,0.9), 0 0 10px #000",
            marginTop: 6,
          }}
        >
          {currentStanza.sub}
        </div>
      )}
    </div>
  );
};

// ======================================================
// TEMPLATE 35 MAIN COMPONENT
// ======================================================

export const Template35: React.FC<Template35Props> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();

  // Validate image array length (exactly 25 images expected)
  const safeImages = images.length >= 25 ? images : DEFAULT_PROPS.images!;

  // ----------------------------------------------------
  // SCENE TIMINGS (Total 600 Frames / 20 Sec)
  // ----------------------------------------------------
  // Scene 1: 0 - 150 frames (0-5s) -> SCATTERED PHOTO DROP (12 photos drop across different screen locations!)
  // Scene 2: 150 - 270 frames (5-9s) -> SOFT LIGHT-GOLD GLOW SHUTTER SPLIT (Images 12-14) [BLACK BG + FULL IMAGE IN MIDDLE, NO LINE]
  // Scene 3: 270 - 390 frames (9-13s) -> HOLOGRAPHIC GOLD DIAMOND SHATTER (Images 15-17)
  // Scene 4 & 5: 390 - 600 frames (13-20s) -> SMOOTH REVOLVING 3D ORBIT CAROUSEL (Images 18-24) [NO POLAROID CARDS, SMOOTH SLIDE]

  const isScene1 = frame >= 0 && frame < 150;
  const isScene2 = frame >= 150 && frame < 270;
  const isScene3 = frame >= 270 && frame < 390;
  const isScene4Or5 = frame >= 390;

  // Global Outro Fade Out (Frames 580-600)
  const globalFadeOut = interpolate(frame, [580, 600], [1, 0], clamp);

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

      {/* Cursive Lyrics Overlay */}
      <CursiveLyricsOverlay frame={frame} />

      {/* Floating Gold Particles */}
      <GoldenParticles frame={frame} />

      {/* ===================================================================
          SCENE 1: SCATTERED PHOTO DROP (0-5s / Frames 0-150)
          12 photos drop rapidly across DIFFERENT POSITIONS on the screen!
          =================================================================== */}
      {(isScene1 || frame < 155) && (
        <AbsoluteFill style={{ zIndex: 1, backgroundColor: "#000000" }}>
          {(() => {
            const s1Frame = frame;

            // 12 photos drop across different scattered positions
            const stackCount = 12;
            const stepDuration = 11.5;

            // Diverse landing coordinates & angles for each photo
            const scatteredPos = [
              { x: "32%", y: "35%", rot: -14, scale: 0.9 },
              { x: "65%", y: "42%", rot: 15, scale: 0.95 },
              { x: "25%", y: "58%", rot: -8, scale: 0.9 },
              { x: "68%", y: "26%", rot: 18, scale: 0.85 },
              { x: "48%", y: "52%", rot: -10, scale: 1.0 },
              { x: "20%", y: "32%", rot: 12, scale: 0.9 },
              { x: "72%", y: "60%", rot: -16, scale: 0.92 },
              { x: "50%", y: "28%", rot: 9, scale: 0.88 },
              { x: "30%", y: "66%", rot: -12, scale: 0.94 },
              { x: "62%", y: "48%", rot: 15, scale: 0.96 },
              { x: "40%", y: "40%", rot: -6, scale: 1.02 },
              { x: "50%", y: "46%", rot: 3, scale: 1.08 },
            ];

            return (
              <AbsoluteFill
                style={{
                  backgroundColor: "#000000",
                  perspective: 1200,
                }}
              >
                {/* Scattered Cards Assembly */}
                {Array.from({ length: stackCount }).map((_, idx) => {
                  const cardStart = idx * stepDuration;
                  if (s1Frame < cardStart) return null;

                  const cardAge = s1Frame - cardStart;
                  const pos = scatteredPos[idx % scatteredPos.length];

                  // Rapid Drop In Keyframe Animation with Physics Bounce
                  const dropProgress = interpolate(
                    cardAge,
                    [0, 12],
                    [0, 1],
                    { ...clamp, easing: Easing.out(Easing.back(1.6)) }
                  );

                  const dropY = interpolate(dropProgress, [0, 1], [-800, 0], clamp);
                  const scaleProgress = interpolate(dropProgress, [0, 1], [1.3, pos.scale], clamp);

                  return (
                    <div
                      key={idx}
                      style={{
                        position: "absolute",
                        left: pos.x,
                        top: pos.y,
                        width: 580,
                        height: 780,
                        padding: "16px 16px 65px 16px",
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        boxShadow: "0 25px 55px rgba(0,0,0,0.95), 0 0 30px rgba(255,225,140,0.4)",
                        transform: `
                          translate(-50%, -50%)
                          translateY(${dropY}px)
                          rotate(${pos.rot}deg)
                          scale(${scaleProgress})
                        `,
                        zIndex: 10 + idx,
                      }}
                    >
                      <Img
                        src={getImgSrc(safeImages[idx], idx)}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  );
                })}
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ===================================================================
          SCENE 2: BLACK SCREEN + LIGHT GOLD GLOW SHUTTER SPLIT (5-9s / Frames 150-270)
          Black screen, Light glowing gold aura curtain slides UP & DOWN, showing FULL IMAGE (No solid line!)
          =================================================================== */}
      {(isScene2 || (frame >= 145 && frame < 275)) && (
        <AbsoluteFill style={{ zIndex: 2, backgroundColor: "#000000" }}>
          {(() => {
            const s2Frame = frame - 150;

            // 2 Sub-cycles for Images (12 & 13)
            const cycleDuration = 60;
            const subCycle = Math.min(1, Math.floor(s2Frame / cycleDuration));
            const subFrame = s2Frame % cycleDuration;

            const currentIdx = 12 + subCycle;

            // Light Gold Glow Intensity (0 to 1)
            const glowIntensity = interpolate(
              subFrame,
              [0, 18, 35],
              [0, 0.85, 0.5],
              clamp
            );

            // Shutter Split Progress: Top slides UP -540px, Bottom slides DOWN +540px
            const splitProgress = interpolate(
              subFrame,
              [12, 52],
              [0, 1],
              { ...clamp, easing: Easing.bezier(0.6, 0, 0.2, 1) }
            );

            const slideOffset = splitProgress * 540;

            // Full Image Middle Scale
            const imageScale = interpolate(splitProgress, [0, 1], [0.88, 1.0], clamp);

            return (
              <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
                {/* FULL IMAGE IN THE MIDDLE (CONTAIN / NO CROP) WITH SOFT LIGHT GOLD GLOW */}
                <AbsoluteFill
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                    backgroundColor: "#000000",
                  }}
                >
                  <div
                    style={{
                      width: "92%",
                      height: "82%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "14px",
                      overflow: "hidden",
                      boxShadow: "0 0 60px rgba(255,225,140,0.5), 0 0 120px rgba(255,180,60,0.25)",
                      transform: `scale(${imageScale})`,
                      backgroundColor: "#000000",
                    }}
                  >
                    <Img
                      src={getImgSrc(safeImages[currentIdx], currentIdx)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain", // 100% FULL UNCROPPED IMAGE
                        backgroundColor: "#000000",
                      }}
                    />
                  </div>
                </AbsoluteFill>

                {/* BLACK SHUTTER TOP HALF (SOFT LIGHT GOLD GLOW CURTAIN - NO HARSH LINE!) */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "50%",
                    backgroundColor: "#000000",
                    transform: `translateY(-${slideOffset}px)`,
                    zIndex: 10,
                    boxShadow: `0 25px 60px rgba(255,225,140,${glowIntensity * 0.7})`,
                  }}
                >
                  {/* Soft Light Gold Glow Edge (No solid border line!) */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: 16,
                      background: "linear-gradient(180deg, transparent 0%, rgba(255,225,140,0.6) 70%, rgba(255,255,255,0.85) 100%)",
                      filter: "blur(3px)",
                    }}
                  />
                </div>

                {/* BLACK SHUTTER BOTTOM HALF (SOFT LIGHT GOLD GLOW CURTAIN - NO HARSH LINE!) */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    width: "100%",
                    height: "50%",
                    backgroundColor: "#000000",
                    transform: `translateY(${slideOffset}px)`,
                    zIndex: 10,
                    boxShadow: `0 -25px 60px rgba(255,225,140,${glowIntensity * 0.7})`,
                  }}
                >
                  {/* Soft Light Gold Glow Edge (No solid border line!) */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: 16,
                      background: "linear-gradient(0deg, transparent 0%, rgba(255,225,140,0.6) 70%, rgba(255,255,255,0.85) 100%)",
                      filter: "blur(3px)",
                    }}
                  />
                </div>
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ===================================================================
          SCENE 3: HOLOGRAPHIC GOLD DIAMOND SHATTER (9-13s / Frames 270-390)
          Active full photo shatters into 4 rotating golden diamond shards, revealing the next photo!
          =================================================================== */}
      {(isScene3 || (frame >= 265 && frame < 395)) && (
        <AbsoluteFill style={{ zIndex: 3, backgroundColor: "#000000" }}>
          {(() => {
            const s3Frame = frame - 270;

            const subPhase = Math.min(1, Math.floor(s3Frame / 60));
            const subFrame = s3Frame % 60;

            const currentIdx = 14 + subPhase * 2;
            const nextIdx = currentIdx + 1;

            // Shatter Progress (0 to 1)
            const shatterProgress = interpolate(
              subFrame,
              [20, 55],
              [0, 1],
              { ...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1) }
            );

            const shatterRot = shatterProgress * 45;
            const shatterSpread = shatterProgress * 600;

            return (
              <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden", perspective: 1200 }}>
                {/* NEXT REVEALED FULL IMAGE */}
                <AbsoluteFill
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "90%",
                      height: "80%",
                      borderRadius: "14px",
                      overflow: "hidden",
                      boxShadow: "0 0 45px rgba(255,225,140,0.5)",
                      transform: `scale(${0.85 + shatterProgress * 0.17})`,
                    }}
                  >
                    <Img
                      src={getImgSrc(safeImages[nextIdx], nextIdx)}
                      style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "#000" }}
                    />
                  </div>
                </AbsoluteFill>

                {/* ACTIVE IMAGE SHATTERING INTO 4 DIAMOND SHARDS */}
                {shatterProgress < 0.98 && (
                  <AbsoluteFill style={{ zIndex: 10 }}>
                    {/* Top Diamond Shard */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        clipPath: "polygon(50% 0%, 100% 50%, 50% 50%, 0% 50%)",
                        transform: `translateY(-${shatterSpread}px) rotateX(${shatterRot}deg)`,
                        filter: "drop-shadow(0 0 20px rgba(255,225,140,0.8))",
                      }}
                    >
                      <Img
                        src={getImgSrc(safeImages[currentIdx], currentIdx)}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>

                    {/* Bottom Diamond Shard */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        clipPath: "polygon(0% 50%, 50% 50%, 100% 50%, 50% 100%)",
                        transform: `translateY(${shatterSpread}px) rotateX(-${shatterRot}deg)`,
                        filter: "drop-shadow(0 0 20px rgba(255,225,140,0.8))",
                      }}
                    >
                      <Img
                        src={getImgSrc(safeImages[currentIdx], currentIdx)}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>

                    {/* Left Diamond Shard */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        clipPath: "polygon(0% 0%, 50% 50%, 0% 100%)",
                        transform: `translateX(-${shatterSpread}px) rotateY(-${shatterRot}deg)`,
                        filter: "drop-shadow(0 0 20px rgba(255,225,140,0.8))",
                      }}
                    >
                      <Img
                        src={getImgSrc(safeImages[currentIdx], currentIdx)}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>

                    {/* Right Diamond Shard */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        clipPath: "polygon(100% 0%, 100% 100%, 50% 50%)",
                        transform: `translateX(${shatterSpread}px) rotateY(${shatterRot}deg)`,
                        filter: "drop-shadow(0 0 20px rgba(255,225,140,0.8))",
                      }}
                    >
                      <Img
                        src={getImgSrc(safeImages[currentIdx], currentIdx)}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>
                  </AbsoluteFill>
                )}
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ===================================================================
          SCENE 4 & 5: SMOOTH REVOLVING 3D ORBIT CAROUSEL (13-20s / Frames 390-600)
          Images revolve smoothly in a 3D circle in space! (NO POLAROID CARDS, SMOOTH SLIDE)
          =================================================================== */}
      {isScene4Or5 && (
        <AbsoluteFill style={{ zIndex: 4, backgroundColor: "#000000" }}>
          {(() => {
            const s4Frame = frame - 390;

            // Smooth continuous 3D rotation angle (0 to 360 degrees)
            const orbitRotation = interpolate(
              s4Frame,
              [0, 210],
              [0, 360],
              { ...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1) }
            );

            // Orbiting 3D images (Images 17 to 24)
            const orbitImages = [17, 18, 19, 20, 21, 22, 23, 24];
            const angleStep = 360 / orbitImages.length;

            return (
              <AbsoluteFill
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  perspective: 1400,
                  backgroundColor: "#000000",
                  overflow: "hidden",
                }}
              >
                {/* Center Ambient Light Gold Glow */}
                <div
                  style={{
                    position: "absolute",
                    width: 800,
                    height: 800,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,225,140,0.25) 0%, rgba(255,180,60,0.08) 50%, rgba(0,0,0,0) 75%)",
                    filter: "blur(25px)",
                  }}
                />

                {/* 3D CONTINUOUS REVOLVING CAROUSEL (NO CARDS, FULL FRAMES) */}
                <div
                  style={{
                    position: "relative",
                    width: 720,
                    height: 980,
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${orbitRotation}deg)`,
                  }}
                >
                  {orbitImages.map((imgIdx, i) => {
                    const cardAngle = i * angleStep;

                    return (
                      <div
                        key={i}
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "16px",
                          overflow: "hidden",
                          boxShadow: "0 0 45px rgba(255,225,140,0.45), 0 20px 50px rgba(0,0,0,0.9)",
                          transform: `
                            rotateY(${cardAngle}deg)
                            translateZ(650px)
                          `,
                          backgroundColor: "#000000",
                        }}
                      >
                        <Img
                          src={getImgSrc(safeImages[imgIdx], imgIdx)}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </AbsoluteFill>
            );
          })()}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Template35;
