import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
} from "remotion";

import { AnimatedImage, Overlay } from "../../components";
import { LightLeak, Particles, Bokeh, Vignette, Glow } from "../../effects";

interface ImageItem {
  path: string;
  duration?: number;
  animation?: string;
  transition?: string;
}

interface FastBeatWeddingStoryProps {
  images?: ImageItem[];
  music?: {
    path: string;
    volume?: number;
  };
  beatTimestamps?: number[];
  config?: {
    backgroundColor?: string;
    effects?: string[];
  };
}

export const FastBeatWeddingStory: React.FC<FastBeatWeddingStoryProps> = ({
  images = [],
  config = {},
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const backgroundColor = config.backgroundColor || "#080714";

  const safeImages = images.length > 0 ? images : [{ path: "" }];
  const getImg = (idx: number) => safeImages[idx % safeImages.length];

  // 18 Photos Distribution across 15-second timeline (450 frames @ 30fps)
  // Scene 1 (0-3s / 90f): 2x2 Collage Grid (Photos 0-3) + "OUR LOVE STORY" Text
  // Scene 2 (3-7s / 120f): 3D Floating Polaroid Cards (Photos 4-8) + "PRECIOUS MEMORIES" Text
  // Scene 3 (7-10s / 90f): 3-Photo Split Mosaic (Photos 9-12)
  // Scene 4 (10-15s / 150f): Hero Fullscreen Showcase (Photos 13-17) + "FOREVER & ALWAYS" Outro

  const gridPhotos = Array.from({ length: 4 }, (_, i) => getImg(i));
  const polaroidPhotos = Array.from({ length: 5 }, (_, i) => getImg(i + 4));
  const mosaicPhotos = Array.from({ length: 4 }, (_, i) => getImg(i + 9));
  const heroPhotos = Array.from({ length: 5 }, (_, i) => getImg(i + 13));

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden", fontFamily: "'Playfair Display', serif" }}>
      {/* ============================================================ */}
      {/* SCENE 1: 2x2 ANIMATED COLLAGE GRID + TYPOGRAPHY (0s - 3s) */}
      {/* ============================================================ */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill style={{ padding: 24, background: "#060510" }}>
          {/* 2x2 Collage Grid */}
          <div
            style={{
              width: "100%",
              height: "82%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: 16,
              borderRadius: 28,
              overflow: "hidden",
            }}
          >
            {gridPhotos.map((img, idx) => {
              const localFrame = Math.max(0, frame);
              const scaleSpring = spring({
                frame: localFrame - idx * 4,
                fps,
                config: { damping: 14, stiffness: 100 },
              });
              const scale = interpolate(scaleSpring, [0, 1], [1.3, 1.0]);

              return (
                <div
                  key={`grid_${idx}`}
                  style={{
                    position: "relative",
                    borderRadius: 20,
                    overflow: "hidden",
                    border: "2px solid rgba(255,215,0,0.3)",
                    transform: `scale(${scale})`,
                    boxShadow: "0 15px 35px rgba(0,0,0,0.6)",
                  }}
                >
                  <Img
                    src={img.path}
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

          {/* CapCut Style Animated Text Banner */}
          <div
            style={{
              height: "18%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h1
              style={{
                color: "#ffffff",
                fontSize: 42,
                fontWeight: 700,
                letterSpacing: 6,
                margin: 0,
                textTransform: "uppercase",
                textShadow: "0 4px 20px rgba(255,215,0,0.6)",
                opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
                transform: `translateY(${interpolate(frame, [10, 30], [20, 0], { extrapolateRight: "clamp" })}px)`,
              }}
            >
              OUR LOVE STORY
            </h1>
            <p
              style={{
                color: "#ffd700",
                fontSize: 20,
                letterSpacing: 4,
                margin: "6px 0 0 0",
                fontWeight: 400,
                opacity: interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              • SPECIAL MOMENTS •
            </p>
          </div>

          {/* Light Leak Flash Transition */}
          <LightLeak opacity={interpolate(frame, [0, 8, 80, 90], [0.8, 0, 0, 0.7])} />
        </AbsoluteFill>
      </Sequence>

      {/* ============================================================ */}
      {/* SCENE 2: 3D FLOATING POLAROID CARDS (3s - 7s / Frames 90 - 210) */}
      {/* ============================================================ */}
      <Sequence from={90} durationInFrames={120}>
        <AbsoluteFill style={{ background: "#0c0a1d" }}>
          {/* Gold Particles Background */}
          <Particles opacity={0.4} count={30} speed={0.9} />
          <Bokeh opacity={0.3} count={15} />

          {/* Floating Polaroid Cards */}
          {polaroidPhotos.map((img, idx) => {
            const localFrame = Math.max(0, frame - 90);
            const cardDelay = idx * 12;
            const progress = spring({
              frame: localFrame - cardDelay,
              fps,
              config: { damping: 13, stiffness: 90 },
            });

            const cardRotations = [-8, 6, -5, 7, -3];
            const cardOffsets = [
              { left: "8%", top: "15%", w: "42%", h: "36%" },
              { left: "52%", top: "10%", w: "42%", h: "36%" },
              { left: "10%", top: "54%", w: "40%", h: "35%" },
              { left: "52%", top: "52%", w: "40%", h: "35%" },
              { left: "30%", top: "32%", w: "44%", h: "38%" },
            ];

            const pos = cardOffsets[idx % cardOffsets.length];
            const rot = cardRotations[idx % cardRotations.length];

            const translateY = interpolate(progress, [0, 1], [150, 0]);
            const scale = interpolate(progress, [0, 1], [0.6, 1.0]);
            const opacity = interpolate(progress, [0, 1], [0, 1]);

            return (
              <div
                key={`polaroid_${idx}`}
                style={{
                  position: "absolute",
                  left: pos.left,
                  top: pos.top,
                  width: pos.w,
                  height: pos.h,
                  background: "#ffffff",
                  padding: "12px 12px 36px 12px",
                  borderRadius: 16,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.7)",
                  transform: `translateY(${translateY}px) scale(${scale}) rotate(${rot}deg)`,
                  opacity,
                  zIndex: idx === 4 ? 10 : idx + 1,
                }}
              >
                <Img
                  src={img.path}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </div>
            );
          })}

          {/* Floating Caption Text */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              width: "100%",
              textAlign: "center",
              zIndex: 20,
            }}
          >
            <span
              style={{
                background: "rgba(255, 215, 0, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,215,0,0.4)",
                color: "#ffffff",
                fontSize: 22,
                letterSpacing: 4,
                padding: "10px 24px",
                borderRadius: 50,
                fontWeight: 600,
                textTransform: "uppercase",
                boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
              }}
            >
              ✨ PRECIOUS MEMORIES ✨
            </span>
          </div>

          <Vignette opacity={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* ============================================================ */}
      {/* SCENE 3: 3-PHOTO SPLIT MOSAIC COLLAGE (7s - 10s / Frames 210 - 300) */}
      {/* ============================================================ */}
      <Sequence from={210} durationInFrames={90}>
        <AbsoluteFill style={{ background: "#060510", padding: 16 }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1.2fr 1fr",
              gap: 14,
            }}
          >
            {/* Top Large Hero Mosaic Photo */}
            <div
              style={{
                gridColumn: "1 / span 2",
                borderRadius: 24,
                overflow: "hidden",
                border: "2px solid rgba(255,255,255,0.2)",
                boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
              }}
            >
              <AnimatedImage
                src={mosaicPhotos[0].path}
                animation="kenBurns"
                durationInFrames={90}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Bottom 2 Grid Photos */}
            {mosaicPhotos.slice(1, 3).map((img, idx) => (
              <div
                key={`mosaic_${idx}`}
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  border: "2px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                }}
              >
                <AnimatedImage
                  src={img.path}
                  animation={idx % 2 === 0 ? "panLeft" : "panRight"}
                  durationInFrames={90}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>

          <Glow opacity={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* ============================================================ */}
      {/* SCENE 4: HERO FULLSCREEN SHOWCASE & OUTRO (10s - 15s / Frames 300 - 450) */}
      {/* ============================================================ */}
      <Sequence from={300} durationInFrames={150}>
        {heroPhotos.map((img, index) => {
          const startFrame = 300 + index * 30;
          const localFrame = Math.max(0, frame - startFrame);

          return (
            <Sequence key={`hero_${index}`} from={startFrame} durationInFrames={30}>
              <AbsoluteFill>
                <AnimatedImage
                  src={img.path}
                  animation={index % 2 === 0 ? "zoomIn" : "cameraPush"}
                  durationInFrames={30}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* Final Outro Typography on Last Photo */}
                {index === heroPhotos.length - 1 && (
                  <AbsoluteFill
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      background: "rgba(0,0,0,0.45)",
                    }}
                  >
                    <h1
                      style={{
                        color: "#ffffff",
                        fontSize: 46,
                        fontWeight: 700,
                        letterSpacing: 8,
                        margin: 0,
                        textAlign: "center",
                        textShadow: "0 5px 25px rgba(255,215,0,0.8)",
                        opacity: interpolate(localFrame, [0, 15], [0, 1]),
                      }}
                    >
                      FOREVER & ALWAYS
                    </h1>
                  </AbsoluteFill>
                )}

                {/* Light Leak & Fade to Black on final 15 frames */}
                <LightLeak opacity={interpolate(localFrame, [0, 5, 25, 30], [0.6, 0, 0, 0.8])} />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </Sequence>
    </AbsoluteFill>
  );
};

export default FastBeatWeddingStory;
