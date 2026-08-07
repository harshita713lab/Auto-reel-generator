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
  const backgroundColor = config.backgroundColor || "#0a0a1a";

  const safeImages = images.length > 0 ? images : [{ path: "" }];
  const getImg = (idx: number) => safeImages[idx % safeImages.length];

  // 18 Photos Breakdown matching reference video:
  // Phase 1 (Intro 0s-4s): 8 Fast Beat-Cut Photos (Photos 0 to 7) - 15 frames each
  // Phase 2 (Middle 4s-12s): 5 Main Fullscreen Float Photos (Photos 8 to 12) - 48 frames each
  // Phase 3 (Outro 12s-20.7s): 5 Outro Montage Photos (Photos 13 to 17) - 52 frames each

  const introPhotos = Array.from({ length: 8 }, (_, i) => getImg(i));
  const mainPhotos = Array.from({ length: 5 }, (_, i) => getImg(i + 8));
  const outroPhotos = Array.from({ length: 5 }, (_, i) => getImg(i + 13));

  const introDuration = 120; // 4 seconds (8 x 15 frames)
  const mainDuration = 240;  // 8 seconds (5 x 48 frames)

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      {/* ============================================================ */}
      {/* PHASE 1: INTRO FAST BEAT CUTS (Frames 0 - 120 / 0s - 4s) */}
      {/* ============================================================ */}
      <Sequence from={0} durationInFrames={introDuration}>
        {introPhotos.map((img, index) => {
          const startFrame = index * 15;
          const localFrame = Math.max(0, frame - startFrame);

          const scale = interpolate(localFrame, [0, 15], [1.25, 1.0], {
            extrapolateRight: "clamp",
          });
          const opacity = interpolate(localFrame, [0, 3], [0.3, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <Sequence key={`intro_${index}`} from={startFrame} durationInFrames={15}>
              <AbsoluteFill style={{ opacity }}>
                <Img
                  src={img.path}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${scale})`,
                  }}
                />
                {/* Flash effect on beat cut */}
                <Overlay
                  opacity={interpolate(localFrame, [0, 4], [0.6, 0], {
                    extrapolateRight: "clamp",
                  })}
                  style={{ background: "#ffffff" }}
                />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </Sequence>

      {/* ============================================================ */}
      {/* PHASE 2: MAIN FULLSCREEN FLOAT SHOWCASE (Frames 120 - 360 / 4s - 12s) */}
      {/* ============================================================ */}
      <Sequence from={introDuration} durationInFrames={mainDuration}>
        {mainPhotos.map((img, index) => {
          const startFrame = introDuration + index * 48;
          const localFrame = Math.max(0, frame - startFrame);

          const isEven = index % 2 === 0;
          const animType = isEven ? "panLeft" : "panRight";

          return (
            <Sequence key={`main_${index}`} from={startFrame} durationInFrames={48}>
              <AnimatedImage
                src={img.path}
                animation={animType}
                durationInFrames={48}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* Gold Vignette Overlay */}
              <Overlay
                opacity={0.25}
                style={{
                  background:
                    "radial-gradient(circle, transparent 40%, rgba(20, 10, 0, 0.6) 100%)",
                }}
              />
            </Sequence>
          );
        })}
      </Sequence>

      {/* ============================================================ */}
      {/* PHASE 3: OUTRO MONTAGE (Frames 360 - 620 / 12s - 20.7s) */}
      {/* ============================================================ */}
      <Sequence from={introDuration + mainDuration} durationInFrames={260}>
        {outroPhotos.map((img, index) => {
          const startFrame = introDuration + mainDuration + index * 52;
          const localFrame = Math.max(0, frame - startFrame);

          const scale = interpolate(localFrame, [0, 52], [1.0, 1.15], {
            extrapolateRight: "clamp",
          });

          return (
            <Sequence key={`outro_${index}`} from={startFrame} durationInFrames={52}>
              <AbsoluteFill>
                <Img
                  src={img.path}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${scale})`,
                  }}
                />
                <Overlay
                  opacity={interpolate(localFrame, [40, 52], [0, 0.4], {
                    extrapolateRight: "clamp",
                  })}
                  style={{ background: "#000000" }}
                />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </Sequence>
    </AbsoluteFill>
  );
};

export default FastBeatWeddingStory;
