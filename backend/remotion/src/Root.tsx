
import React from "react";
import {
  Composition,
  AbsoluteFill,
  Sequence,
} from "remotion";

import AnimatedImage from "./components/AnimatedImage";

import WeddingComposition from "./compositions/Wedding/WeddingComposition";

import { MemoryBlendComposition } from "./compositions/Wedding/MemoryBlendComposition";

import { WhiteCardGrid3x3 } from "./compositions/Wedding/CardGridComposition";

import WhiteCardCarousel from "./compositions/Wedding/WhiteCarouselComposition";

import WhiteCardPolaroidStack from "./compositions/Wedding/WhitePolaroidComposition";

import WhiteCardMasonry from "./compositions/Wedding/MasonryComposition";

import { PremiumGrid } from "./compositions/Wedding/PreiumGrid";

import WeddingSequenceComposition from "./compositions/Wedding/WeddingSequenceComposition";

import CinematicWeddingReel from "./compositions/Wedding/template19";

import WeddingSplitSlider from "./compositions/Wedding/SplitSlider";

import { MemoryJourneyWeddingReel } from "./compositions/Wedding/template18";

import { RoyalWeddingStory } from "./compositions/Wedding/template14";

import { Reel } from "./compositions/Wedding/template9";

import { Cinematic13Composition } from "./compositions/Wedding/template13";

import { ScrapbookWedding15 } from "./compositions/Wedding/template15";

import { WeddingTemplate14 } from "./compositions/Wedding/template25";

import { Template26 } from "./compositions/Wedding/template26";


// ======================================================
// DEFAULT COMPOSITION
// ======================================================

interface DefaultCompositionProps {
  images?: any[];
  template?: any;
}

const DefaultComposition: React.FC<DefaultCompositionProps> = ({
  images = [],
  template = {},
}) => {
  const slideDuration = template.slideDuration || 3;

  const fps = 30;

  const slideFrames = Math.round(
    slideDuration * fps
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor:
          template.backgroundColor || "#000000",
      }}
    >
      {images.map(
        (img: any, index: number) => {
          const imageSrc =
            typeof img === "string"
              ? img
              : img.path || img.url;

          return (
            <Sequence
              key={index}
              from={index * slideFrames}
              durationInFrames={slideFrames}
            >
              <AnimatedImage
                src={imageSrc}
              />
            </Sequence>
          );
        }
      )}
    </AbsoluteFill>
  );
};


// ======================================================
// DEFAULT PROPS
// ======================================================

const defaultProps = {
  images: [],

  template: {
    name: "Default Template",
    width: 1080,
    height: 1920,
    slideDuration: 3,
  },
};


// ======================================================
// ROOT
// ======================================================

export const Root: React.FC = () => {
  return (
    <>
      {/* =================================================
          1. REEL COMPOSITION
      ================================================= */}

      <Composition
        id="ReelComposition"
        component={WeddingComposition}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
        calculateMetadata={async ({
          props,
        }) => {
          const typedProps =
            props as any;

          const {
            generateScenes,
          } = await import(
            "./utils/SceneGenrator"
          );

          const scenes =
            generateScenes(
              typedProps.images || [],
              typedProps.beatTimestamps || []
            );

          const totalFrames =
            scenes.reduce(
              (
                sum: number,
                scene: any
              ) =>
                sum + scene.duration,
              0
            );

          return {
            durationInFrames:
              Math.max(
                30,
                totalFrames
              ),
          };
        }}
      />


      {/* =================================================
          2. MEMORY BLEND
      ================================================= */}

      <Composition
        id="MemoryBlendReel"
        component={
          MemoryBlendComposition as any
        }
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={450}
        defaultProps={{
          bgVideoSrc:
            "assets/videos/wedding-bg.mp4",

          images: [],

          introText:
            "Our little love story.",

          outroText:
            "Happy Valentine's Day",
        }}
      />


      {/* =================================================
          3. WHITE CARD GRID 3x3
      ================================================= */}

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


      {/* =================================================
          4. WHITE CARD CAROUSEL
      ================================================= */}

      <Composition
        id="WhiteCardCarousel"
        component={WhiteCardCarousel}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={async ({
          props,
        }) => {
          const typedProps =
            props as any;

          const images =
            typedProps.images || [];

          const slideDuration =
            typedProps.slideDuration || 3;

          return {
            durationInFrames:
              Math.max(
                450,
                images.length *
                  slideDuration *
                  30
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


      {/* =================================================
          5. WHITE POLAROID STACK
      ================================================= */}

      <Composition
        id="WhiteCardPolaroidStack"
        component={WhiteCardPolaroidStack}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={async ({
          props,
        }) => {
          const typedProps =
            props as any;

          const images =
            typedProps.images || [];

          const groups =
            Math.max(
              1,
              Math.ceil(
                images.length / 6
              )
            );

          return {
            durationInFrames:
              Math.max(
                450,
                groups * 240
              ),
          };
        }}
        defaultProps={{
          images: [],

          title: "Our Memories",

          backgroundColor:
            "#F8F8F8",

          cardColor: "#FFFFFF",

          showCounter: true,
        }}
      />


      {/* =================================================
          6. WHITE MASONRY
      ================================================= */}

      <Composition
        id="WhiteCardMasonry"
        component={WhiteCardMasonry}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={450}
        defaultProps={{
          images: [],
          music: undefined,
        }}
      />


      {/* =================================================
          7. PREMIUM GRID
      ================================================= */}

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


      {/* =================================================
          8. WEDDING SEQUENCE
      ================================================= */}

      <Composition
        id="WeddingSequenceComposition"
        component={
          WeddingSequenceComposition
        }
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={300}
        defaultProps={{
          images: [],
          music: undefined,
        }}
      />


      {/* =================================================
          9. WEDDING SPLIT SLIDER
      ================================================= */}

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


      {/* =================================================
          10. CINEMATIC WEDDING
      ================================================= */}

      <Composition
        id="CinematicWeddingReel"
        component={
          CinematicWeddingReel
        }
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          images: [],
          music: undefined,
        }}
      />


      {/* =================================================
          11. MEMORY JOURNEY
      ================================================= */}

      <Composition
        id="MemoryJourneyWeddingReel"
        component={
          MemoryJourneyWeddingReel
        }
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          images: [],

          namesText:
            "JULIAN & JULI",
        }}
      />


      {/* =================================================
          12. REEL
      ================================================= */}

      <Composition
        id="Reel"
        component={Reel}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={360}
        defaultProps={{
          images: [],

          music: {
            path: "",
            volume: 0.5,
          },
        }}
      />


      {/* =================================================
          13. WEDDING CINEMATIC 13
      ================================================= */}

      <Composition
        id="WeddingCinematic13"
        component={
          Cinematic13Composition
        }
        durationInFrames={440}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          images: [],
        }}
      />


      {/* =================================================
          14. SCRAPBOOK 15
      ================================================= */}

      <Composition
        id="ScrapbookWedding15"
        component={
          ScrapbookWedding15
        }
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={440}
        defaultProps={{
          images: [],
        }}
      />


      {/* =================================================
          15. WEDDING TEMPLATE 14
      ================================================= */}

      <Composition
        id="WeddingTemplate14"
        component={
          WeddingTemplate14
        }
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={440}
        defaultProps={{
          images: [],
        }}
      />


      {/* =================================================
          16. TEMPLATE 26
      ================================================= */}

      <Composition
        id="Template26"
        component={Template26}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={440}
        defaultProps={{
          images: [],
        }}
      />
    </>
  );
};
