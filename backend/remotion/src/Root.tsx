import React from 'react';
import { Composition, AbsoluteFill, Sequence } from 'remotion';
import { AnimatedImage } from './components/AnimatedImage';

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
            <AnimatedImage
              src={imageSrc}
              durationInFrames={slideFrames}
              animation={animation}
            />
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
  totalDuration: 15,
};

export const Root: React.FC = () => {
  return (
    <Composition
      id="ReelComposition"
      component={DefaultComposition}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
      calculateMetadata={async ({ props }) => {
        const typedProps = props as any;
        const imgCount = typedProps.images?.length || 1;
        const slideDur = typedProps.template?.slideDuration || 3;
        const duration = typedProps.totalDuration || imgCount * slideDur;

        return {
          durationInFrames: Math.max(30, Math.round(duration * 30)),
        };
      }}
    />
  );
};