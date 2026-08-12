import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MusicPlayer } from "../../components"; // ✅ MusicPlayer Import

interface ImageItem {
  path: string;
}

interface Template6Props {
  images?: ImageItem[];
  music?: string; // ✅ Music Prop
}

// ======================================================
// 🆕 AUTO-REGISTRATION EXPORTS
// ======================================================

export const IMAGE_COUNT = 12;
export const DURATION_IN_FRAMES = 450; // 15 seconds

export const DEFAULT_PROPS = {
  images: [],
  music: undefined, // ✅ कोई Fallback नहीं
};

// =====================================
// SCENE 1 – 0s to 6s
// =====================================

const Scene1 = ({ images = [] }: { images: ImageItem[] }) => {
  const frame = useCurrentFrame();

  const REEL_WIDTH = 1080;
  const TOP_HEIGHT = 300;
  const MIDDLE_TOP = 320;
  const MIDDLE_HEIGHT = 1280;
  const BOTTOM_HEIGHT = 300;

  const middleImages = images.slice(3, 7);
  const slideDuration = 45;
  const totalImages = middleImages.length;
  const sliderPosition = totalImages > 0 ? (frame / slideDuration) % totalImages : 0;
  const currentIndex = Math.floor(sliderPosition);
  const progress = sliderPosition - currentIndex;
  const translateX = -currentIndex * REEL_WIDTH - progress * REEL_WIDTH;

  return (
    <AbsoluteFill style={{ width: REEL_WIDTH, height: 1920, backgroundColor: "#111", overflow: "hidden" }}>
      {/* Top 3 */}
      <div style={{ position: "absolute", top: 0, left: 0, width: REEL_WIDTH, height: TOP_HEIGHT, display: "flex", gap: 6, overflow: "hidden" }}>
        {images.slice(0, 3).map((img, index) => (
          <div key={index} style={{ width: 356, height: TOP_HEIGHT, flex: "0 0 356px", overflow: "hidden" }}>
            <Img src={img.path} style={{ width: 356, height: TOP_HEIGHT, objectFit: "cover", objectPosition: "center", display: "block" }} />
          </div>
        ))}
      </div>

      {/* Middle Slider */}
      <div style={{ position: "absolute", top: MIDDLE_TOP, left: 0, width: REEL_WIDTH, height: MIDDLE_HEIGHT, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, display: "flex", width: totalImages * REEL_WIDTH, height: MIDDLE_HEIGHT, transform: `translateX(${translateX}px)`, willChange: "transform" }}>
          {middleImages.map((img, index) => (
            <div key={index} style={{ width: REEL_WIDTH, height: MIDDLE_HEIGHT, flex: `0 0 ${REEL_WIDTH}px`, overflow: "hidden" }}>
              <Img src={img.path} style={{ width: REEL_WIDTH, height: MIDDLE_HEIGHT, objectFit: "cover", objectPosition: "center", display: "block" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom 3 */}
      <div style={{ position: "absolute", bottom: 0, left: 0, width: REEL_WIDTH, height: BOTTOM_HEIGHT, display: "flex", gap: 6, overflow: "hidden" }}>
        {images.slice(7, 10).map((img, index) => (
          <div key={index} style={{ width: 356, height: BOTTOM_HEIGHT, flex: "0 0 356px", overflow: "hidden" }}>
            <Img src={img.path} style={{ width: 356, height: BOTTOM_HEIGHT, objectFit: "cover", objectPosition: "center", display: "block" }} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// =====================================
// SCENE 2 – 6s to 8s
// =====================================

const Scene2 = ({ images = [] }: { images: ImageItem[] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneImages = [images[0], images[10], images[1], images[11]];
  const progress = spring({ frame, fps, config: { damping: 12, stiffness: 150, mass: 0.7 } });
  const translateY = interpolate(progress, [0, 1], [500, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(progress, [0, 1], [0.75, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = interpolate(progress, [0, 0.15, 1], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ width: 1080, height: 1920, overflow: "hidden", background: "linear-gradient(180deg, #d8c9c0 0%, #d9bfd0 48%, #d89da2 100%)" }}>
      {/* Top Card */}
      <div style={{ position: "absolute", top: 170, left: 45, width: 990, height: 700, opacity, transform: `translateY(${translateY}px) scale(${scale})`, transformOrigin: "center center" }}>
        <div style={{ position: "absolute", top: 20, left: 55, width: 900, height: 590, padding: 20, boxSizing: "border-box", backgroundColor: "#f1e3d4", transform: "rotate(4deg)", boxShadow: "0 18px 38px rgba(0,0,0,0.16)" }}>
          <Img src={sceneImages[0]?.path} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ position: "absolute", top: 55, left: 45, width: 900, height: 600, padding: 20, boxSizing: "border-box", backgroundColor: "#f5e6d5", transform: "rotate(-6deg)", boxShadow: "0 22px 45px rgba(0,0,0,0.22)" }}>
          <Img src={sceneImages[1]?.path} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      </div>

      {/* Bottom Card */}
      <div style={{ position: "absolute", top: 1030, left: 45, width: 990, height: 700, opacity, transform: `translateY(${translateY}px) scale(${scale})`, transformOrigin: "center center" }}>
        <div style={{ position: "absolute", top: 20, left: 55, width: 900, height: 590, padding: 20, boxSizing: "border-box", backgroundColor: "#f1e3d4", transform: "rotate(-4deg)", boxShadow: "0 18px 38px rgba(0,0,0,0.16)" }}>
          <Img src={sceneImages[2]?.path} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ position: "absolute", top: 55, left: 45, width: 900, height: 600, padding: 20, boxSizing: "border-box", backgroundColor: "#f5e6d5", transform: "rotate(6deg)", boxShadow: "0 22px 45px rgba(0,0,0,0.22)" }}>
          <Img src={sceneImages[3]?.path} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================
// SCENE 3 – 8s to 10s
// =====================================

const Scene3 = ({ images = [] }: { images: ImageItem[] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneImages = images.slice(0, 3);

  return (
    <AbsoluteFill style={{ width: 1080, height: 1920, backgroundColor: "#000", overflow: "hidden" }}>
      {sceneImages.map((image, index) => {
        const delay = index * 15;
        const localFrame = frame - delay;
        const progress = spring({ frame: localFrame, fps, config: { damping: 8, stiffness: 220, mass: 0.5 } });
        const scale = interpolate(progress, [0, 0.45, 0.75, 1], [0.65, 1.08, 0.96, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const translateX = interpolate(progress, [0, 0.5, 1], [index % 2 === 0 ? -180 : 180, index % 2 === 0 ? 15 : -15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const rotate = interpolate(progress, [0, 0.5, 1], [index % 2 === 0 ? -10 : 10, index % 2 === 0 ? 3 : -3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const opacity = interpolate(progress, [0, 0.15, 1], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <AbsoluteFill key={index} style={{ opacity, transform: `translateX(${translateX}px) scale(${scale}) rotate(${rotate}deg)`, zIndex: index, backgroundColor: "#000" }}>
            <Img src={image.path} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)", display: "block" }} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// =====================================
// SCENE 4 – 11s to 15s
// =====================================

const Scene4 = ({ images = [] }: { images: ImageItem[] }) => {
  const frame = useCurrentFrame();
  const sceneImages = images.slice(0, 4);
  const imageDuration = 37.5;

  return (
    <AbsoluteFill style={{ width: 1080, height: 1920, backgroundColor: "#000", overflow: "hidden" }}>
      {sceneImages.map((image, index) => {
        const imageStart = index * imageDuration;
        const localFrame = frame - imageStart;
        const isZoomIn = index % 2 === 0;
        const scale = isZoomIn
          ? interpolate(localFrame, [0, imageDuration], [1, 1.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : interpolate(localFrame, [0, imageDuration], [1.18, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const opacity = interpolate(localFrame, [0, 6, imageDuration], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <AbsoluteFill key={index} style={{ opacity, transform: `scale(${scale})`, zIndex: index }}>
            <Img src={image.path} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// =====================================
// MAIN COMPOSITION
// =====================================

export const Template6 = ({
  images = [],
  music = undefined,
}: Template6Props) => {
  const musicSrc = music; // ✅ कोई Fallback नहीं

  console.log("🎵 Template6 musicSrc:", musicSrc);

  return (
    <>
      {musicSrc && (
        <MusicPlayer src={musicSrc} volume={0.8} loop={true} showVisualizer={true} />
      )}

      <Sequence from={0} durationInFrames={180}>
        <Scene1 images={images} />
      </Sequence>

      <Sequence from={180} durationInFrames={60}>
        <Scene2 images={images} />
      </Sequence>

      <Sequence from={240} durationInFrames={60}>
        <Scene3 images={images} />
      </Sequence>

      {/* 1 Second Gap (30 frames) - no scene, just black */}
      <Sequence from={300} durationInFrames={30}>
        <AbsoluteFill style={{ backgroundColor: "#000" }} />
      </Sequence>

      <Sequence from={330} durationInFrames={120}>
        <Scene4 images={images} />
      </Sequence>
    </>
  );
};

// =====================================
// DEFAULT EXPORT (Auto-Registration)
// =====================================

export default Template6;