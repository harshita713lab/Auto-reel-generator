import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { AnimatedImage } from "../../components";

interface PremiumGridProps {
  images?: Array<{ path: string }>;

  music?: {
    path: string;
    volume?: number;
  };

  slideDuration?: number;

  backgroundColor?: string;

  title?: string;

  overlayText?: string;

  gap?: number;

  transition?:
    | "fade"
    | "glide"
    | "slide"
    | "zoom";

  effect?:
    | "none"
    | "cinematic"
    | "warm"
    | "cool"
    | "golden";

  showCounter?: boolean;
}

const getEffect = (
  effect: string,
  frame: number,
  duration: number
) => {
  const progress = frame / duration;

  switch (effect) {
    case "cinematic":
      return {
        filter:
          "contrast(1.15) brightness(.95) saturate(.9)",
        transform: `scale(${1 + progress * .08})`,
      };

    case "warm":
      return {
        filter:
          "sepia(.25) saturate(1.2) brightness(1.05)",
      };

    case "cool":
      return {
        filter:
          "hue-rotate(15deg) saturate(.8)",
      };

    case "golden":
      return {
        filter:
          "sepia(.35) saturate(1.3)",
      };

    default:
      return {};
  }
};

const getTransition = (
  transition: string,
  frame: number,
  duration: number
) => {
  const progress = frame / duration;

  switch (transition) {
    case "fade":
      return {
        opacity: progress,
      };

    case "slide":
      return {
        opacity: progress,
        transform: `translateX(${(1 - progress) * 100}px)`,
      };

    case "zoom":
      return {
        opacity: progress,
        transform: `scale(${.8 + progress * .2})`,
      };

    case "glide":
      return {
        opacity: progress,
        transform: `translateY(${(1 - progress) * 60}px)
                   scale(${.95 + progress * .05})`,
      };

    default:
      return {};
  }
};

const glassCardStyle = {
  background: "rgba(255,255,255,.12)",

  backdropFilter: "blur(20px)",

  WebkitBackdropFilter: "blur(20px)",

  border: "1px solid rgba(255,255,255,.18)",

  borderRadius: 22,

  overflow: "hidden" as const,

  boxShadow:
    "0 12px 40px rgba(0,0,0,.28)",

  position: "relative" as const,
};

export const PremiumGrid: React.FC<PremiumGridProps> = ({
  images = [],

  music,

  slideDuration = 4,

  backgroundColor =
    "linear-gradient(135deg,#0a0a1a,#1a1a3e)",

  gap = 16,

  title,

  overlayText,

  transition = "glide",

  effect = "cinematic",

  showCounter = true,
}) => {

  const frame = useCurrentFrame();

  const { fps } = useVideoConfig();

  const durationInFrames =
    Math.round(slideDuration * fps);

  const transitionStyle =
    getTransition(
      transition,
      frame,
      durationInFrames
    );

  const effectStyle =
    getEffect(
      effect,
      frame,
      durationInFrames
    );

  const imageList = images.slice(0, 4);
  return (
    <AbsoluteFill
      style={{
        background: backgroundColor,
        padding: 30,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Gold Corner Decorations */}

      {[
        { top: 18, left: 18 },
        { top: 18, right: 18 },
        { bottom: 18, left: 18 },
        { bottom: 18, right: 18 },
      ].map((corner, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 42,
            height: 42,

            top: corner.top,
            bottom: corner.bottom,
            left: corner.left,
            right: corner.right,

            borderTop:
              corner.top !== undefined
                ? "2px solid rgba(255,215,0,.45)"
                : undefined,

            borderBottom:
              corner.bottom !== undefined
                ? "2px solid rgba(255,215,0,.45)"
                : undefined,

            borderLeft:
              corner.left !== undefined
                ? "2px solid rgba(255,215,0,.45)"
                : undefined,

            borderRight:
              corner.right !== undefined
                ? "2px solid rgba(255,215,0,.45)"
                : undefined,

            zIndex: 20,
          }}
        />
      ))}

      {/* Optional Title */}

      {title && (
        <div
          style={{
            position: "absolute",
            top: 45,
            width: "100%",
            textAlign: "center",
            color: "#ffffff",
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: 2,
            zIndex: 10,
          }}
        >
          {title}
        </div>
      )}

      {/* 2x2 Grid */}

      <div
        style={{
          width: "100%",
          height: "100%",

          display: "grid",

          gridTemplateColumns: "1fr 1fr",

          gridTemplateRows: "1fr 1fr",

          gap,

          paddingTop: 80,

          ...transitionStyle,
        }}
      >
        {imageList.map((img, index) => (
          <div
            key={index}
            style={{
              ...glassCardStyle,
            }}
          >
            <AnimatedImage
    src={img.path}
    animation="kenBurns"
    durationInFrames={durationInFrames}
    style={{
        width:"100%",
        height:"100%",
        objectFit:"cover"
    }}
/>
            

            {/* Counter */}

            {showCounter && (
              <div
                style={{
                  position: "absolute",

                  right: 12,

                  bottom: 12,

                  background: "rgba(0,0,0,.55)",

                  backdropFilter: "blur(10px)",

                  color: "#fff",

                  padding: "6px 12px",

                  borderRadius: 50,

                  fontSize: 16,

                  fontWeight: 700,

                  letterSpacing: 1,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
            )}

            {/* Overlay Text */}

            {overlayText && index === 0 && (
              <div
                style={{
                  position: "absolute",

                  left: 0,

                  right: 0,

                  bottom: 55,

                  padding: "18px",

                  textAlign: "center",

                  color: "#fff",

                  fontSize: 24,

                  fontWeight: 600,

                  textShadow:
                    "0 2px 12px rgba(0,0,0,.5)",

                  background:
                    "linear-gradient(transparent,rgba(0,0,0,.45))",
                }}
              >
                {overlayText}
              </div>
            )}
          </div>
        ))}
                {/* Empty Cards */}

        {Array.from({
          length: Math.max(0, 4 - imageList.length),
        }).map((_, index) => (
          <div
            key={`empty-${index}`}
            style={{
              ...glassCardStyle,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              color: "rgba(255,255,255,.25)",

              fontSize: 60,

              fontWeight: 300,

              background:
                "rgba(255,255,255,.05)",
            }}
          >
            +
          </div>
        ))}
      </div>

      {/* Music */}

    
    </AbsoluteFill>
  );
};

export default PremiumGrid;