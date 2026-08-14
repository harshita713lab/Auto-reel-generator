import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { MusicPlayer } from "../../components";

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
}

interface Music {
  path: string;
  volume?: number;
}

interface Template23Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// SETTINGS
// ======================================================

export const IMAGE_COUNT = 14;
export const FPS = 30;
export const DURATION_IN_FRAMES = 14 * FPS; // 14 seconds

const IMAGE_DURATION = FPS; // 1 second per image

// ======================================================
// MAIN COMPONENT
// ======================================================

export const Template23: React.FC<Template23Props> = ({
  images = [],
  music,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* ==================================================
          SCENE 1
          Frames 00:00 - 00:02
          Images: 0, 1, 2
          Black & White Romantic
      ================================================== */}

      <Sequence
        from={0}
        durationInFrames={3 * FPS}
      >
        {images.slice(0, 3).map((image, index) => (
          <Sequence
            key={`scene1-${index}`}
            from={index * IMAGE_DURATION}
            durationInFrames={IMAGE_DURATION}
          >
            <RomanticImage
              src={image.path}
              blackWhite
            />
          </Sequence>
        ))}
      </Sequence>

      {/* ==================================================
          SCENE 2
          Frames 00:03 - 00:05
          Images: 3, 4, 5
          Romantic + Blurred Lights
      ================================================== */}

      <Sequence
        from={3 * FPS}
        durationInFrames={3 * FPS}
      >
        {images.slice(3, 6).map((image, index) => (
          <Sequence
            key={`scene2-${index}`}
            from={index * IMAGE_DURATION}
            durationInFrames={IMAGE_DURATION}
          >
            <RomanticImage
              src={image.path}
              blurLights
            />
          </Sequence>
        ))}
      </Sequence>

      {/* ==================================================
          SCENE 3
          Frames 00:06 - 00:08
          Images: 6, 7, 8
          Traditional Wedding
      ================================================== */}

      <Sequence
        from={6 * FPS}
        durationInFrames={3 * FPS}
      >
        {images.slice(6, 9).map((image, index) => (
          <Sequence
            key={`scene3-${index}`}
            from={index * IMAGE_DURATION}
            durationInFrames={IMAGE_DURATION}
          >
            <WeddingImage src={image.path} />
          </Sequence>
        ))}
      </Sequence>

      {/* ==================================================
          SCENE 4
          Frames 00:09 - 00:13
          Images: 9, 10, 11, 12, 13
          Laughing + Ring Ceremony
      ================================================== */}

      <Sequence
        from={9 * FPS}
        durationInFrames={5 * FPS}
      >
        {images.slice(9, 14).map((image, index) => (
          <Sequence
            key={`scene4-${index}`}
            from={index * IMAGE_DURATION}
            durationInFrames={IMAGE_DURATION}
          >
            <WeddingImage
              src={image.path}
              ending={index >= 3}
            />
          </Sequence>
        ))}
      </Sequence>

      {/* ==================================================
          MUSIC
      ================================================== */}

      {music?.path && (
        <MusicPlayer
          src={music.path}
          volume={music.volume ?? 0.8}
        />
      )}
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 1 / 2 IMAGE
// ======================================================

const RomanticImage: React.FC<{
  src: string;
  blackWhite?: boolean;
  blurLights?: boolean;
}> = ({
  src,
  blackWhite = false,
  blurLights = false,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [0, FPS - 1],
    [1.03, 1.10],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          filter: blackWhite
            ? "grayscale(100%)"
            : blurLights
            ? "saturate(1.1) contrast(1.05)"
            : "none",
        }}
      />

      {/* Cinematic dark overlay */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.12), rgba(0,0,0,0.28))",
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 3 / 4 WEDDING IMAGE
// ======================================================

const WeddingImage: React.FC<{
  src: string;
  ending?: boolean;
}> = ({ src, ending = false }) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [0, FPS - 1],
    ending ? [1.06, 1.13] : [1.02, 1.07],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.22))",
        }}
      />
    </AbsoluteFill>
  );
};

export default Template23;