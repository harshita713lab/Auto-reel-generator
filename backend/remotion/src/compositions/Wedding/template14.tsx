import React from "react";
import {
  AbsoluteFill,
  Img,
  Audio,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { AnimatedImage ,MusicPlayer } from "../../components";
import { getBeatScale } from "../../utils/beatUtils";

// ======================================================
// TEMPLATE 14
// ======================================================

export const IMAGE_COUNT = 11;
export const DURATION_IN_FRAMES = 450; // 15 sec @ 30fps
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
  animation?: string;
}

interface Template14Props {
  images?: ImageItem[];
  music?: string;
  beatTimestamps?: number[];
}

// ======================================================
// TEMPLATE 14
// ======================================================

const Template14: React.FC<Template14Props> = ({
  images = [],
  music,
  beatTimestamps = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const beatScale = getBeatScale(
    frame,
    fps,
    beatTimestamps
  );

  const totalDuration = DURATION_IN_FRAMES;

  // ======================================================
  // IMAGE MAPPING
  // ======================================================

  // Image 1 → Background
  const bgImage = images[0];

  // Image 2 → Left Top
  const leftTop = images[1];

  // Image 3 → Left Bottom
  const leftBottom = images[2];

  // Image 4–11 → Right Slider
  const sliderImages = images.slice(3, 11);

  // ======================================================
  // BACKGROUND
  // ======================================================

  const Background = () => {
    if (!bgImage) return null;

    return (
      <AnimatedImage
        src={bgImage.path}
        animation="kenBurns"
        durationInFrames={totalDuration}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",

          filter:
            "blur(6px) brightness(1.1) saturate(1.1)",

          transform: "scale(1.03)",
          opacity: 0.9,
        }}
      />
    );
  };

  // ======================================================
  // POLAROID CARD
  // ======================================================

  const PolaroidCard = ({
    image,
    rotate,
    width,
    height,
  }: {
    image?: ImageItem;
    rotate: number;
    width: number;
    height: number;
  }) => {
    if (!image) return null;

    const scale = interpolate(
      frame,
      [0, totalDuration],
      [1, 1.05],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    return (
      <div
        style={{
          width,
          height,

          background: "#fff",

          padding: 12,

          borderRadius: 18,

          boxShadow:
            "0 20px 50px rgba(0,0,0,.35)",

          transform:
            `rotate(${rotate}deg) scale(${scale})`,
        }}
      >
        <Img
          src={image.path}
          style={{
            width: "100%",
            height: "100%",

            objectFit: "cover",

            borderRadius: 12,
          }}
        />
      </div>
    );
  };

  // ======================================================
  // SLIDER CARD
  // ======================================================

  const SliderCard = ({
    image,
    index,
  }: {
    image?: ImageItem;
    index: number;
  }) => {
    if (!image) return null;

    return (
      <div
        style={{
          width: 330,
          height: 420,

          background: "#fff",

          padding: 10,

          borderRadius: 16,

          marginBottom: 24,

          marginLeft: 15,

          transform:
            `rotate(${index % 2 === 0 ? -2 : 2}deg)`,

          boxShadow:
            "0 15px 35px rgba(0,0,0,.35)",
        }}
      >
        <Img
          src={image.path}
          style={{
            width: "100%",
            height: "100%",

            objectFit: "cover",

            borderRadius: 10,
          }}
        />
      </div>
    );
  };

  // ======================================================
  // RIGHT VERTICAL SLIDER
  // ======================================================

  const RightSlider = () => {
    if (sliderImages.length === 0) {
      return null;
    }

    const cards = [
      ...sliderImages,
      ...sliderImages,
      ...sliderImages,
    ];

    const cardHeight = 444;

    const trackHeight =
      sliderImages.length * cardHeight;

    const scrollDuration = 300;

    const translate =
      (frame / scrollDuration) * trackHeight;

    return (
      <div
        style={{
          position: "absolute",

          right: 70,

          top: 0,

          bottom: 0,

          width: 360,

          overflow: "hidden",

          zIndex: 10,
        }}
      >
        <div
          style={{
            position: "absolute",

            width: "100%",

            transform:
              `translateY(${250 - translate}px)`,
          }}
        >
          {cards.map((img, index) => (
            <SliderCard
              key={index}
              image={img}
              index={index}
            />
          ))}
        </div>
      </div>
    );
  };

  // ======================================================
  // LEFT FIXED CARDS
  // ======================================================

  const LeftCards = () => {
    return (
      <>
        {/* LEFT TOP */}

        <div
          style={{
            position: "absolute",

            left: 20,

            top: 60,

            zIndex: 5,
          }}
        >
          <PolaroidCard
            image={leftTop}
            rotate={-5}
            width={460}
            height={900}
          />
        </div>

        {/* LEFT BOTTOM */}

        <div
          style={{
            position: "absolute",

            left: 120,

            bottom: 120,

            zIndex: 5,
          }}
        >
          <PolaroidCard
            image={leftBottom}
            rotate={5}
            width={460}
            height={900}
          />
        </div>
      </>
    );
  };

  // ======================================================
  // MAIN
  // ======================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",

        overflow: "hidden",

        transform:
          `scale(${beatScale})`,
      }}
    >
       {music && (
              <MusicPlayer src={music} volume={0.8} loop={true} showVisualizer={false} />
            )}
      {/* ================================================
          MUSIC
      ================================================= */}

     

      {/* ================================================
          BACKGROUND
      ================================================= */}

      <Background />

      {/* ================================================
          DARK OVERLAY
      ================================================= */}

      <div
        style={{
          position: "absolute",

          inset: 0,

          background:
            "rgba(0,0,0,0.25)",

          zIndex: 2,
        }}
      />

      {/* ================================================
          LEFT CARDS
      ================================================= */}

      <LeftCards />

      {/* ================================================
          RIGHT SLIDER
      ================================================= */}

      <RightSlider />
    </AbsoluteFill>
  );
};

export default Template14;