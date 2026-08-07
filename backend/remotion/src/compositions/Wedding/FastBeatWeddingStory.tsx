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
  const backgroundColor = config.backgroundColor || "#060612";

  const safeImages = images.length > 0 ? images : [{ path: "" }];
  const getImg = (idx: number) => safeImages[idx % safeImages.length];

  // 18 Photos Distribution
  // Phase 1 (Intro 0s-4s): 8 Fast Beat-Cut Photos (Photos 0 to 7) - 15 frames each
  // Phase 2 (Middle 4s-12s): 5 Main Fullscreen Float Photos (Photos 8 to 12) - 48 frames each
  // Phase 3 (Outro 12s-20.7s): 5 Outro Montage Photos (Photos 13 to 17) - 52 frames each

  const introPhotos = Array.from({ length: 8 }, (_, i) => getImg(i));
  const mainPhotos = Array.from({ length: 5 }, (_, i) => getImg(i + 8));
  const outroPhotos = Array.from({ length: 5 }, (_, i) => getImg(i + 13));

  const introDuration = 120; // 4 seconds (8 x 15 frames)
  const mainDuration = 240;  // 8 seconds (5 x 48 frames)

  // Motion animation style patterns for 18 photos
  const introAnimations = ["zoomIn", "slideLeft", "zoomOut", "slideRight", "zoomIn", "slideUp", "zoomOut", "rotateZoom"];
  const mainAnimations = ["kenBurns", "panLeft", "cameraPush", "panRight", "parallax"];
  const outroAnimations = ["zoomIn", "panUp", "slideLeft", "cameraPull", "zoomOut"];

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      {/* ============================================================ */}
      {/* PHASE 1: INTRO FAST BEAT CUTS WITH FLASH & SLIDE TRANSITIONS (0s - 4s) */}
      {/* ============================================================ */}
      <Sequence from={0} durationInFrames={introDuration}>
        {introPhotos.map((img, index) => {
          const startFrame = index * 15;
          const localFrame = Math.max(0, frame - startFrame);

          // Spring bounce scale on fast beat entry
          const scaleSpring = spring({
            frame: localFrame,
            fps,
            config: { damping: 14, stiffness: 120, mass: 0.7 },
          });

          const scale = interpolate(scaleSpring, [0, 1], [1.35, 1.05]);
          const rotation = index % 2 === 0 ? interpolate(localFrame, [0, 15], [-4, 0]) : interpolate(localFrame, [0, 15], [4, 0]);

          // Whip-slide entry direction
          const slideDirs = [-width * 0.4, width * 0.4, -height * 0.3, height * 0.3];
          const slideOffset = interpolate(
            localFrame,
            [0, 5],
            [slideDirs[index % slideDirs.length], 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const isXSlide = index % 2 === 0;

          return (
            <Sequence key={`intro_${index}`} from={startFrame} durationInFrames={15}>
              <AbsoluteFill
                style={{
                  transform: isXSlide
                    ? `translateX(${slideOffset}px) scale(${scale}) rotate(${rotation}deg)`
                    : `translateY(${slideOffset}px) scale(${scale}) rotate(${rotation}deg)`,
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
                {/* Snappy Camera Flash & Film Burn Transition Effect */}
                <Overlay
                  opacity={interpolate(localFrame, [0, 4, 12, 15], [0.8, 0, 0, 0.4], {
                    extrapolateRight: "clamp",
                  })}
                  style={{
                    background:
                      index % 3 === 0
                        ? "linear-gradient(45deg, #ffffff, #ffd700)"
                        : "radial-gradient(circle, #ffffff 30%, #ff8c00 100%)",
                  }}
                />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </Sequence>

      {/* ============================================================ */}
      {/* PHASE 2: MAIN FULLSCREEN SHOWCASE WITH LIGHTLEAK & DUST (4s - 12s) */}
      {/* ============================================================ */}
      <Sequence from={introDuration} durationInFrames={mainDuration}>
        {mainPhotos.map((img, index) => {
          const startFrame = introDuration + index * 48;
          const localFrame = Math.max(0, frame - startFrame);
          const animType = mainAnimations[index % mainAnimations.length];

          // Smooth Zoom & Motion Blur Entry Transition
          const enterBlur = interpolate(localFrame, [0, 8], [12, 0], {
            extrapolateRight: "clamp",
          });

          return (
            <Sequence key={`main_${index}`} from={startFrame} durationInFrames={48}>
              <AbsoluteFill style={{ filter: `blur(${enterBlur}px)` }}>
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

                {/* Floating Gold Dust Particles Overlay */}
                <Particles opacity={0.4} count={25} speed={0.8} />

                {/* Shimmer Light Leak Effect */}
                <LightLeak opacity={interpolate(localFrame, [0, 15, 35, 48], [0.7, 0.1, 0.1, 0.6])} />

                {/* Color Grade: Warm Golden Hours */}
                <Overlay
                  opacity={0.18}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,180,50,0.3) 0%, rgba(200,50,150,0.15) 100%)",
                    mixBlendMode: "overlay",
                  }}
                />

                {/* Radial Vignette */}
                <Vignette opacity={0.35} />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </Sequence>

      {/* ============================================================ */}
      {/* PHASE 3: OUTRO MONTAGE WITH BOKEH & WHIP TRANSITIONS (12s - 20.7s) */}
      {/* ============================================================ */}
      <Sequence from={introDuration + mainDuration} durationInFrames={260}>
        {outroPhotos.map((img, index) => {
          const startFrame = introDuration + mainDuration + index * 52;
          const localFrame = Math.max(0, frame - startFrame);
          const animType = outroAnimations[index % outroAnimations.length];

          // Whip Zoom Out Transition on scene entry
          const whipScale = interpolate(localFrame, [0, 10, 52], [1.3, 1.0, 1.12], {
            extrapolateRight: "clamp",
          });

          return (
            <Sequence key={`outro_${index}`} from={startFrame} durationInFrames={52}>
              <AbsoluteFill style={{ transform: `scale(${whipScale})` }}>
                <AnimatedImage
                  src={img.path}
                  animation={animType}
                  durationInFrames={52}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* Bokeh Light Particles Overlay */}
                <Bokeh opacity={0.35} count={18} />

                {/* Glow Shimmer Flare */}
                <Glow opacity={interpolate(localFrame, [0, 12, 40, 52], [0.5, 0, 0, 0.3])} />

                {/* Fade to Black on final photo */}
                {index === outroPhotos.length - 1 && (
                  <Overlay
                    opacity={interpolate(localFrame, [32, 52], [0, 0.95], {
                      extrapolateRight: "clamp",
                    })}
                    style={{ background: "#000000" }}
                  />
                )}
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </Sequence>
    </AbsoluteFill>
  );
};

export default FastBeatWeddingStory;
