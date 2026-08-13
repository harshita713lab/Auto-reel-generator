import React from 'react';
import { Composition, AbsoluteFill, Sequence } from 'remotion';
import { default as AnimatedImage } from './components/AnimatedImage';

// ============================================================
//  DEFAULT COMPOSITION (FALLBACK – अगर कोई और Composition न मिले)
// ============================================================
const DefaultComposition: React.FC<any> = ({ images = [], template = {} }) => {
  const slideDuration = template.slideDuration || 3;
  const fps = 30;
  const slideFrames = Math.round(slideDuration * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: template.backgroundColor || '#986363' }}>
      {images.map((img: any, index: number) => {
        return (
          <Sequence
            key={index}
            from={index * slideFrames}
            durationInFrames={slideFrames}
          >
            <AnimatedImage src={img.path || img.url} />
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

// ============================================================
//  AUTO-REGISTRATION – सारी .tsx फाइलें Wedding फोल्डर से लोड करें
// ============================================================

// @ts-ignore
const weddingContext = require.context(
  './compositions/Wedding',
  false,
  /\.(tsx|ts)$/
);

const compositionRegistry: Record<
  string,
  {
    component: React.ComponentType<any>;
    durationInFrames?: number;
    calculateMetadata?: any;
    defaultProps?: any;
    imageCount?: number;
  }
> = {};

weddingContext.keys().forEach((filename: string) => {
  try {
    const id = filename
      .replace('./', '')
      .replace(/\.(tsx|ts)$/, '');

    const module = weddingContext(filename);

    console.log(`🔍 Loading: ${filename}`);
    console.log('Exports:', Object.keys(module));

    let Component = module.default;

    if (!Component) {
      Component = module[id];
    }

    if (!Component) {
      const matchingExport = Object.keys(module).find(
        (key) => key.toLowerCase() === id.toLowerCase()
      );

      if (matchingExport) {
        Component = module[matchingExport];
      }
    }

    if (!Component) {
      console.warn(
        `⚠️ Skipping ${filename} — no React component export found`
      );
      return;
    }

    const duration = module.DURATION_IN_FRAMES;
    const calculateMetadata = module.calculateMetadata;
    const defaultProps =
      module.DEFAULT_PROPS || {
        images: [],
        music: undefined,
      };
    const imageCount = module.IMAGE_COUNT;

    const aliases = new Set<string>();
    aliases.add(id);
    aliases.add(id.charAt(0).toUpperCase() + id.slice(1));
    aliases.add(id.toLowerCase());

    const match = id.match(/^(?:template|tempalte)(\d+)$/i);
    if (match) {
      const num = match[1];
      aliases.add(`Template${num}`);
      aliases.add(`template${num}`);
      aliases.add(`Tempalte${num}`);
      aliases.add(`tempalte${num}`);
    }

    const compConfig = {
      component: Component,
      durationInFrames: duration,
      calculateMetadata,
      defaultProps,
      imageCount,
    };

    aliases.forEach((alias) => {
      compositionRegistry[alias] = compConfig;
    });

    console.log(
      `✅ Auto-registered: ${id} (aliases: ${Array.from(aliases).join(', ')}) | IMAGE_COUNT: ${
        imageCount ?? 'not specified'
      }`
    );

  } catch (error) {
    console.error(
      `❌ Failed to load ${filename}:`,
      error
    );
  }
});

// ============================================================
//  🚀 ROOT COMPONENT – Registers all compositions dynamically
// ============================================================

// ============================================================
//  🚀 ROOT COMPONENT
// ============================================================

const Root: React.FC = () => {
  return (
    <>
      {Object.entries(compositionRegistry).map(([id, config]) => {
        const { component: Component, durationInFrames, calculateMetadata, defaultProps } = config;

        return (
          <Composition
            key={id}
            id={id}
            component={Component}
            fps={30}
            width={1080}
            height={1920}
            durationInFrames={durationInFrames || 300}
            calculateMetadata={calculateMetadata}
            defaultProps={defaultProps}
          />
        );
      })}
    </>
  );
};

export default Root;   // ✅ Default export