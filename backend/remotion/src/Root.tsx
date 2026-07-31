import React from 'react';
import { Composition, AbsoluteFill, Sequence } from 'remotion';
import { default as AnimatedImage } from './components/AnimatedImage';
import WeddingComposition from './compositions/Wedding/WeddingComposition'; // <-- यहाँ से कलीब्रेट ब्रेसेस हटा दिए गए हैं क्योंकि यह default export है
import { MemoryBlendComposition } from './compositions/Wedding/MemoryBlendComposition';

const DefaultComposition: React.FC<any> = ({ images = [], template = {} }) => {
  const slideDuration = template.slideDuration || 3;
  const fps = 30;
  const slideFrames = Math.round(slideDuration * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: template.backgroundColor || '#000000' }}>
      {images.map((img: any, index: number) => {
        const imageSrc = typeof img === 'string' ? img : img.path || img.url;
        const animation = (typeof img === 'object' && img.animation) || 'kenBurns';

        return (
          <Sequence
            key={index}
            from={index * slideFrames}
            durationInFrames={slideFrames}
          >
            <AnimatedImage src={img.path} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const defaultProps = {
  images: [],
  template: {
    name: 'Default Template',
    width: 1080,
    height: 1920,
    slideDuration: 3,
  },
};

export const Root: React.FC = () => {
  return (
    <>
      {/* 1. आपकी पुरानी वेडिंग कंपोजीशन */}
      <Composition
        id="ReelComposition"
        component={WeddingComposition}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
        calculateMetadata={async ({ props }) => {
          const typedProps = props as any;
          const { generateScenes } = await import("./utils/SceneGenrator");
          const scenes = generateScenes(typedProps.images || []);
          const totalFrames = scenes.reduce(
            (sum: number, scene: any) => sum + scene.duration,
            0
          );
          return {
            durationInFrames: Math.max(30, totalFrames),
          };
        }}
      />

      {/* 2. आपकी नई मेमोरी-मर्ज / डबल-एक्सपोजर रील कंपोजीशन */}
      <Composition
        id="MemoryBlendReel"
        component={MemoryBlendComposition as any}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={450}
        defaultProps={{
          bgVideoSrc: "assets/videos/wedding-bg.mp4",
          images: [],
          introText: "Our little love story.",
          outroText: "Happy Valentine's Day",
        }}
      />
    </>
  );
};