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

interface Template30Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// CONFIG
// ======================================================

export const FPS = 30;

// 14 seconds = 420 frames
export const DURATION_IN_FRAMES = 420;

// Exactly 8 images
export const IMAGE_COUNT = 8;

// ======================================================
// DEFAULT PROPS
// ======================================================

export const DEFAULT_PROPS: Template30Props = {
  images: Array(8).fill({
    path:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop",
  }),
  music: undefined,
};

// ======================================================
// HELPERS
// ======================================================

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const getImgSrc = (
  img?: ImageItem,
  index: number = 0
): string => {
  if (img?.path) return img.path;
  if (img?.url) return img.url;

  return DEFAULT_PROPS.images?.[index]?.path || "";
};

// ======================================================
// TEMPLATE 30
// ======================================================

export const Template30: React.FC<Template30Props> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();

  const safeImages =
    images.length >= IMAGE_COUNT
      ? images
      : DEFAULT_PROPS.images!;

  // ====================================================
  // MUSIC
  // ====================================================

  const musicSrc =
    typeof music === "string"
      ? music
      : music?.path;

  // ====================================================
  // GLOBAL FADE
  // ====================================================

  const fadeIn = interpolate(
    frame,
    [0, 18],
    [0, 1],
    clamp
  );

  const fadeOut = interpolate(
    frame,
    [402, 420],
    [1, 0],
    clamp
  );

  const globalOpacity = fadeIn * fadeOut;

  // ====================================================
  // CARD CONFIG
  // ====================================================

  const CARD_WIDTH = 950;
  const CARD_HEIGHT = 650;

  const CARD_GAP = 32;

  const TOTAL_CARD_HEIGHT =
    CARD_HEIGHT + CARD_GAP;

  // ====================================================
  // CONTINUOUS VERTICAL SCROLL
  // ====================================================
const startScrollY = 420;

// Last card ko end mein center ke aas-paas lana
const lastCardCenterY = 960;

const endScrollY =
  lastCardCenterY -
  CARD_HEIGHT / 2 -
  (IMAGE_COUNT - 1) * TOTAL_CARD_HEIGHT;

// CONSTANT / SLOW MOVEMENT
const scrollY = interpolate(
  frame,
  [0, DURATION_IN_FRAMES],
  [startScrollY, endScrollY],
  clamp
);

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050505",
        overflow: "hidden",
        opacity: globalOpacity,
      }}
    >

      {/* ==================================================
          MUSIC
          ================================================== */}

      {musicSrc && (
        <MusicPlayer
          src={musicSrc}
          volume={
            typeof music === "object"
              ? music?.volume
              : 1
          }
        />
      )}

      {/* ==================================================
          BACKGROUND
          ================================================== */}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, #020202 0%, #080808 50%, #020202 100%)",
        }}
      />

      {/* ==================================================
          VERTICAL CARD STRIP
          ================================================== */}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,

          width: CARD_WIDTH,

          height:
            IMAGE_COUNT * TOTAL_CARD_HEIGHT,

          transform: `
            translateX(-50%)
            translateY(${scrollY}px)
          `,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",

          gap: CARD_GAP,

          willChange: "transform",

          zIndex: 5,
        }}
      >

        {safeImages
          .slice(0, IMAGE_COUNT)
          .map((img, index) => {

            // ==========================================
            // CARD POSITION
            // ==========================================

            const cardY =
              scrollY +
              index * TOTAL_CARD_HEIGHT;

            const cardCenter =
              cardY + CARD_HEIGHT / 2;

            // ==========================================
            // CENTER FOCUS
            // ==========================================

            const distanceFromCenter =
              Math.abs(cardCenter - 960);

            const focusAmount = interpolate(
              distanceFromCenter,
              [0, 700],
              [1, 0],
              clamp
            );

            const scale = interpolate(
              focusAmount,
              [0, 1],
              [0.94, 1],
              clamp
            );

            const brightness = interpolate(
              focusAmount,
              [0, 1],
              [0.72, 1],
              clamp
            );

            const opacity = interpolate(
              distanceFromCenter,
              [0, 900],
              [1, 0.72],
              clamp
            );

            return (
              <div
                key={index}
                style={{
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,

                  flexShrink: 0,

                  borderRadius: 42,

                  overflow: "hidden",

                  backgroundColor: "#111",

                  transform: `scale(${scale})`,

                  opacity,

                  filter:
                    `brightness(${brightness})`,

                  boxShadow:
                    "0 18px 50px rgba(0,0,0,0.55)",

                  border:
                    "2px solid rgba(255,255,255,0.08)",

                  position: "relative",
                }}
              >

                {/* ======================================
                    IMAGE
                    ====================================== */}

                <Img
                  src={getImgSrc(img, index)}
                  style={{
                    width: "100%",
                    height: "100%",

                    objectFit: "cover",

                    display: "block",

                    transform: `
                      scale(
                        ${interpolate(
                          frame,
                          [0, 420],
                          [1.02, 1.08],
                          clamp
                        )}
                      )
                    `,
                  }}
                />

                {/* ======================================
                    CARD VIGNETTE
                    ====================================== */}

                <div
                  style={{
                    position: "absolute",
                    inset: 0,

                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 45%, rgba(0,0,0,0.18) 100%)",

                    pointerEvents: "none",
                  }}
                />

              </div>
            );
          })}
      </div>


      {/* ==================================================
          FIXED CENTER TEXT
          
          IMPORTANT:
          Ye card strip ke BAHAR hai.
          Isliye cards move karenge,
          lekin text screen ke center mein FIX rahega.
          ================================================== */}

      <div
        style={{
          position: "absolute",

          left: "50%",
          top: "50%",

          transform:
            "translate(-50%, -50%)",

          width: "88%",

          textAlign: "center",

          zIndex: 30,

          pointerEvents: "none",

          color: "#ffffff",

          fontFamily:
            "'Segoe Print', 'Comic Sans MS', cursive",

          fontSize: 38,

          fontWeight: 600,

          lineHeight: 1.25,

          letterSpacing: "0.5px",

          textShadow: `
            0 2px 4px rgba(0,0,0,0.95),
            0 4px 12px rgba(0,0,0,0.9),
            0 0 2px rgba(0,0,0,1)
          `,
        }}
      >

        <div>
          Tu ishq ishq sa mere
        </div>

        <div>
          Rooh mai aake basja
        </div>

        {/* Emojis */}
        <div
          style={{
            marginTop: 8,

            fontFamily:
              "'Segoe UI Emoji', 'Apple Color Emoji', sans-serif",

            fontSize: 30,

            lineHeight: 1,
          }}
        >
          ❤️👁️🤞
        </div>

      </div>


      {/* ==================================================
          SOFT EDGE VIGNETTE
          ================================================== */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",

          zIndex: 40,

          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.35) 100%)",
        }}
      />

    </AbsoluteFill>
  );
};

export default Template30;