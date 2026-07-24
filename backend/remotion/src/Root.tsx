import { Composition } from 'remotion';
import { ReelComposition } from './ReelComposition';
import type { ReelProps } from './types';

// 🔥 Default props for preview
const defaultProps: ReelProps = {
  images: [],
  template: {
    name: 'Default Template',
    width: 1080,
    height: 1920,
    slideDuration: 3,
    transitionDuration: 0.5,
    transitions: ['fade'],
    effects: ['none'],
    colorGrades: [],
    vignette: false,
  },
  totalDuration: 15,
  numImages: 5,
};

export const Root: React.FC = () => {
  return (
    <Composition
      id="ReelComposition"
      component={ReelComposition as any}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
      // 🔥 FIX: props ko pehle 'unknown' mein cast kiya taaki TypeScript error na de
      calculateMetadata={async ({ props }) => {
        const typedProps = props as unknown as ReelProps;
        
        const duration = typedProps.totalDuration || (typedProps.images.length * (typedProps.template?.slideDuration || 3));
        const fps = 30;

        return {
          durationInFrames: Math.round(duration * fps),
        };
      }}
    />
  );
};