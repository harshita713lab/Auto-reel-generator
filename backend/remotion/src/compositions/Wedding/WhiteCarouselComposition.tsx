import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import {
  AnimatedImage,
  MusicPlayer,
  Overlay,
} from "../../components";

interface WhiteCardCarouselProps {
  images?: Array<{ path: string }>;

  music?: {
    path: string;
    volume?: number;
  };

  slideDuration?: number;

  title?: string;
  subtitle?: string;

  backgroundColor?: string;

  showTitle?: boolean;
  showCounter?: boolean;
  showDots?: boolean;

  cardColor?: string;
  cardRadius?: number;
  cardShadow?: boolean;
}

export const WhiteCardCarousel: React.FC<WhiteCardCarouselProps> = ({
  images = [],    
  music,

  slideDuration = 1,

  title = "Wedding Gallery",
  subtitle = "",

  backgroundColor = "#efefef",

  showTitle = true,
  showCounter = true,
  showDots = true,

  cardColor = "#ffffff",
  cardRadius = 28,
  cardShadow = true,
}) => {

  const frame = useCurrentFrame();

  const { fps } = useVideoConfig();

  const slideFrames = Math.round(slideDuration * fps);

  const totalImages = Math.max(images.length, 1);

  const currentIndex =
    Math.floor(frame / slideFrames) % totalImages;

  const currentImage =
    images[currentIndex];

  const localFrame =
    frame % slideFrames;

  // card entry animation

  const cardScale = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 14,
      stiffness: 120,
    },
  });

  const scale =
    interpolate(
      cardScale,
      [0, 1],
      [0.9, 1]
    );

  const opacity =
    interpolate(
      localFrame,
      [0, 8],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

  // slide animation

  const translateX =
    interpolate(
      localFrame,
      [0, slideFrames],
      [60, -60],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

  return (
    <AbsoluteFill
      style={{
        background: backgroundColor,
        justifyContent: "space-between",
        alignItems: "center",
        padding: 60,
      }}
    >

      {/* ---------- Music ---------- */}

      {music && (
        <MusicPlayer
          src={music.path}
          volume={music.volume ?? 1}
        />
      )}

      {/* ---------- Header ---------- */}

      {showTitle && (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          <div
            style={{
              fontSize: 58,
              fontWeight: 700,
              color: "#222",
            }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                marginTop: 10,
                fontSize: 28,
                color: "#666",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      )}

      {/* ---------- Card Area ---------- */}

     <div
  style={{
    width: "100%",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  {currentImage && (
    <div
      style={{
        width: 820,
        height: 1180,
        background: cardColor,
        borderRadius: cardRadius,
        overflow: "hidden",
        position: "relative",
        transform: `translateX(${translateX}px) scale(${scale})`,
        opacity,
        boxShadow: cardShadow
          ? "0 30px 70px rgba(0,0,0,0.18)"
          : "none",
      }}
    >
      {/* White Border */}

      <div
        style={{
          position: "absolute",
          inset: 18,
          borderRadius: cardRadius - 10,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <AnimatedImage
          src={currentImage.path}
          animation="kenBurns"
          durationInFrames={slideFrames}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {showCounter && (
        <div
          style={{
            position: "absolute",
            right: 24,
            bottom: 24,
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 999,
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          {String(currentIndex + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </div>
      )}
    </div>
  )}
</div>
    </AbsoluteFill>
  );
};

export default WhiteCardCarousel;