import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { MusicPlayer } from "../../components"; // ✅ MusicPlayer Import

// ======================================================
// INTERFACES
// ======================================================

interface ImageItem {
  path: string;
}

interface TemplateGridProps {
  images?: ImageItem[];
  music?: string; // ✅ Music Prop
  textOverlay?: {
    image1?: string;
    image2?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
  };
}

// ======================================================
// 🆕 AUTO-REGISTRATION EXPORTS
// ======================================================

export const IMAGE_COUNT = 5;
export const DURATION_IN_FRAMES = 300; // 10 seconds

export const DEFAULT_PROPS = {
  images: [],
  music: undefined, // ✅ Default undefined (koi Fallback nahi)
  textOverlay: {
    image1: "you\nand",
    image2: "me",
    topRight: "belong\ntogether",
    bottomLeft: "like\ncold\nICED\ntea",
    bottomRight: "and\nwarmer\nweather",
  },
};

// ======================================================
// OVERLAY TEXT (unchanged)
// ======================================================

const OverlayText: React.FC<{
  text?: string;
  startFrame: number;
}> = ({ text, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!text) return null;

  const textSpring = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 12,
    },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${textSpring})`,
        color: "#FFFFFF",
        fontFamily: "Comic Sans MS, Changa One, sans-serif",
        fontSize: "48px",
        fontWeight: "bold",
        lineHeight: 1.1,
        textAlign: "center",
        textShadow:
          "3px 3px 8px rgba(0,0,0,0.8), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
        opacity: textSpring,
        whiteSpace: "pre-line",
        width: "90%",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
};

// ======================================================
// MAIN SCENE (unchanged)
// ======================================================

const SequentialGridScene: React.FC<TemplateGridProps> = ({
  images = [],
  textOverlay = {
    image1: "you\nand",
    image2: "me",
    topRight: "belong\ntogether",
    bottomLeft: "like\ncold\nICED\ntea",
    bottomRight: "and\nwarmer\nweather",
  },
}) => {
  const frame = useCurrentFrame();

  const img1 = images[0]?.path || "";
  const img2 = images[1]?.path || "";
  const img3 = images[2]?.path || "";
  const img4 = images[3]?.path || "";
  const img5 = images[4]?.path || "";

  const getCardAnim = (startFrame: number) => {
    const opacity = interpolate(
      frame,
      [startFrame, startFrame + 10],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const scale = interpolate(
      frame,
      [startFrame, startFrame + 15],
      [0.9, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    return { opacity, transform: `scale(${scale})` };
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          width: "100%",
          height: "100%",
          gap: "4px",
          backgroundColor: "#000000",
        }}
      >
        {/* Box 1 */}
        <div style={{ position: "relative", overflow: "hidden", ...getCardAnim(0) }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "50%", overflow: "hidden" }}>
            {img1 && <Img src={img1} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            <OverlayText text={textOverlay.image1} startFrame={0} />
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "50%", overflow: "hidden" }}>
            {img2 && <Img src={img2} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            <OverlayText text={textOverlay.image2} startFrame={0} />
          </div>
        </div>

        {/* Box 2 */}
        <div style={{ position: "relative", overflow: "hidden", ...getCardAnim(60) }}>
          {img3 && <Img src={img3} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          {frame >= 60 && <OverlayText text={textOverlay.topRight} startFrame={60} />}
        </div>

        {/* Box 3 */}
        <div style={{ position: "relative", overflow: "hidden", ...getCardAnim(120) }}>
          {img4 && <Img src={img4} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          {frame >= 120 && <OverlayText text={textOverlay.bottomLeft} startFrame={120} />}
        </div>

        {/* Box 4 */}
        <div style={{ position: "relative", overflow: "hidden", ...getCardAnim(180) }}>
          {img5 && <Img src={img5} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          {frame >= 180 && <OverlayText text={textOverlay.bottomRight} startFrame={180} />}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// TEMPLATE 5 – WITH MUSIC PLAYER
// ======================================================

export const Template5: React.FC<TemplateGridProps> = ({
  images = [],
  music = undefined, // ✅ Optional Music Prop
  textOverlay,
}) => {
  const musicSrc = music; // ✅ कोई Fallback नहीं – सिर्फ Backend से आने पर ही Play होगी

  console.log("🎵 Template5 musicSrc:", musicSrc); // Debug Log

  return (
    <>
      {/* 🎵 MusicPlayer – अगर music available है तो Render होगा */}
      {musicSrc && (
        <MusicPlayer
          src={musicSrc}
          volume={0.8}
          loop={true}
          showVisualizer={true}
        />
      )}

      <SequentialGridScene
        images={images}
        textOverlay={textOverlay}
      />
    </>
  );
};

// ======================================================
// DEFAULT EXPORT (Auto-Registration के लिए)
// ======================================================

export default Template5;