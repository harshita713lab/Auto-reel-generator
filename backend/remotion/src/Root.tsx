
import React from 'react';
import { Composition, AbsoluteFill, Sequence } from 'remotion';
import { default as AnimatedImage } from './components/AnimatedImage';
import WeddingComposition from './compositions/Wedding/WeddingComposition'; // <-- यहाँ से कलीब्रेट ब्रेसेस हटा दिए गए हैं क्योंकि यह default export है
import { MemoryBlendComposition } from './compositions/Wedding/MemoryBlendComposition';
import { WhiteCardGrid3x3 } from './compositions/Wedding/CardGridComposition';
import WhiteCardCarousel from "./compositions/Wedding/WhiteCarouselComposition";
import WhiteCardPolaroidStack from "./compositions/Wedding/WhitePolaroidComposition";
import WhiteCardMasonry from "./compositions/Wedding/MasonryComposition";
import { PremiumGrid } from "./compositions/Wedding/PreiumGrid";
import WeddingSequenceComposition from "./compositions/Wedding/WeddingSequenceComposition";
import  CinematicWeddingReel  from "./compositions/Wedding/template9";

import WeddingSplitSlider from "./compositions/Wedding/SplitSlider";
 import{ MemoryJourneyWeddingReel} from "./compositions/Wedding/template18";

import { RoyalWeddingStory } from './compositions/Wedding/template14';
import FastBeatWeddingStory from './compositions/Wedding/FastBeatWeddingStory';


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
          const scenes = generateScenes(typedProps.images || [], typedProps.beatTimestamps || []);
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
      <Composition
  id="WhiteCardGrid3x3"
  component={WhiteCardGrid3x3}
  fps={30}
  width={1080}
  height={1920}
  durationInFrames={450}
  defaultProps={{
    images: [],
    music: undefined,
  }}
/>
<Composition
  id="WhiteCardCarousel"
  component={WhiteCardCarousel}
  fps={30}
  width={1080}
  height={1920}
  calculateMetadata={async ({ props }) => {
    const typedProps = props as any;

    const images = typedProps.images || [];
    const slideDuration = typedProps.slideDuration || 3;

    return {
      durationInFrames: Math.max(
        450,
        images.length * slideDuration * 30
      ),
    };
  }}

    defaultProps={{
    images: [],
    music: undefined,

    slideDuration: 3,

    title: "Wedding Gallery",
    subtitle: "",

    backgroundColor: "#F4F4F4",

    showTitle: true,
    showCounter: true,
    showDots: true,

    cardColor: "#FFFFFF",
    cardRadius: 28,
    cardShadow: true,
  }}

/>
<Composition
  id="WhiteCardPolaroidStack"
  component={WhiteCardPolaroidStack}
  fps={30}
  width={1080}
  height={1920}
  calculateMetadata={async ({ props }) => {
    const typedProps = props as any;

    const images = typedProps.images || [];

    // 6 images per stack
    const groups = Math.max(1, Math.ceil(images.length / 6));

    return {
      durationInFrames: Math.max(450, groups * 240), // min 15 sec
    };
  }}
  defaultProps={{
    images: [],

    title: "Our Memories",

    backgroundColor: "#F8F8F8",

    cardColor: "#FFFFFF",

    showCounter: true,
  }}
/>
<Composition
 id="WhiteCardMasonry"
 component={WhiteCardMasonry}
 fps={30}
 width={1080}
 height={1920}
 durationInFrames={450}
 defaultProps={{
   images:[],
   music:undefined
 }}
/>
<Composition
  id="PremiumGrid"
  component={PremiumGrid}
  width={1080}
  height={1920}
  fps={30}
  durationInFrames={450}
  defaultProps={{
    images: [],
    slideDuration: 4,
    backgroundColor:
      "linear-gradient(135deg,#0a0a1a,#1a1a3e)",
    transition: "glide",
    effect: "cinematic",
    showCounter: true,
    music: undefined,
  }}
/>
<Composition
  id="WeddingSequenceComposition"
  component={WeddingSequenceComposition}
  width={1080}
  height={1920}
  fps={30}
  durationInFrames={450} // ya 60+45+60+45+90 = 300
  defaultProps={{
    images: [],
    music: undefined,
  }}
/>
<Composition
  id="WeddingSplitSlider"
  component={WeddingSplitSlider}
  width={1080}
  height={1920}
  fps={30}
  durationInFrames={450}
  defaultProps={{
    images: [],
    music: undefined,
  }}
/>
<Composition
  id="CinematicWeddingReel"
component={CinematicWeddingReel}
  durationInFrames={360}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{
    images: [],
    music: undefined,
  }}
/>

<Composition

id="MemoryJourneyWeddingReel"

component={MemoryJourneyWeddingReel}

durationInFrames={450}

fps={30}

width={1080}

height={1920}


defaultProps={{

images:[],

namesText:"JULIAN & JULI"

}}

/>
<Composition
  id="RoyalWeddingStory"
  component={RoyalWeddingStory}
  durationInFrames={360}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="FastBeatWeddingStory"
  component={FastBeatWeddingStory}
  durationInFrames={450}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{
    images: [],
    music: undefined,
  }}
/>
    </>
  );
};