import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { generateScenes } from "../../utils/SceneGenrator";
import {
  AnimatedImage,
  AnimatedCollage,
  MusicPlayer,
  Overlay,
} from "../../components";

interface WeddingCompositionProps {
  images?: Array<{
    path: string;
    duration: number;
    animation: string;
    transition: string;
  }>;

  music?: {
    path: string;
    volume?: number;
  };

  config?: {
    backgroundColor?: string;
    effects?: string[];
  };
}

const WeddingComposition: React.FC<WeddingCompositionProps> = ({
  images = [],
  music,
  config = {},
}) => {
  const {
    backgroundColor = "#000",
    effects = ["vignette"],
  } = config;

  const scenes = generateScenes(images);

  let currentFrame = 0;

  const totalFrames = scenes.reduce(
    (sum, scene) => sum + scene.duration,
    0
  );
  console.log(totalFrames);
console.log(scenes);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
      }}
    >
      {scenes.map((scene, index) => {
        const from = currentFrame;
        currentFrame += scene.duration;

        return (
          <Sequence
  key={index}
  from={from}
  durationInFrames={scene.duration}
>
  {scene.layout === "hero" ? (
   <AnimatedImage
  src={scene.images[0].path}
  animation={scene.animation}
  durationInFrames={scene.duration}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }}
/>
  ) : (
    <AnimatedCollage
      layoutType={scene.layout}
      images={scene.images.map((img) => img.path)}
      animation={scene.animation}
    />
  )}
</Sequence>
        );
      })}

      {effects.includes("vignette") && (
        <Overlay
          opacity={0.12}
          style={{
            background:
              "radial-gradient(circle, transparent 45%, rgba(0,0,0,.45) 100%)",
          }}
        />
      )}

      {music && (
        <MusicPlayer
          src={music.path}
          volume={music.volume ?? 1}
          duration={totalFrames / 30}
          fadeInDuration={0.5}
          fadeOutDuration={0.8}
          showVisualizer={false}
        />
      )}
    </AbsoluteFill>
  );
};

export default WeddingComposition;