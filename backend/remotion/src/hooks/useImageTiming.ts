import { useCurrentFrame, useVideoConfig } from 'remotion';

interface ImageTimingConfig {
  imageCount: number;
  totalDuration?: number;
  durationPerImage?: number;
  startDelay?: number;
  transitionDuration?: number;
}

export const useImageTiming = (config: ImageTimingConfig) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const {
    imageCount,
    totalDuration,
    durationPerImage = 3,
    startDelay = 0,
    transitionDuration = 0.5,
  } = config;

  // Calculate total duration if not provided
  const total = totalDuration || (imageCount * durationPerImage) + (imageCount - 1) * transitionDuration;
  const totalFrames = total * fps;
  const startFrames = startDelay * fps;

  // Current progress through the whole sequence
  const progress = Math.max(0, Math.min((frame - startFrames) / totalFrames, 1));

  // Calculate which image is currently active
  let currentIndex = 0;
  let imageProgress = 0;
  let isTransitioning = false;
  let transitionProgress = 0;

  let accumulatedTime = 0;
  for (let i = 0; i < imageCount; i++) {
    const imageDuration = durationPerImage;
    const transDuration = i < imageCount - 1 ? transitionDuration : 0;
    const segmentDuration = imageDuration + transDuration;
    
    if (frame >= (accumulatedTime + startDelay) * fps && 
        frame < (accumulatedTime + startDelay + imageDuration) * fps) {
      currentIndex = i;
      imageProgress = (frame - (accumulatedTime + startDelay) * fps) / (imageDuration * fps);
      isTransitioning = false;
      break;
    } else if (i < imageCount - 1 && 
               frame >= (accumulatedTime + startDelay + imageDuration) * fps &&
               frame < (accumulatedTime + startDelay + imageDuration + transDuration) * fps) {
      currentIndex = i;
      imageProgress = 1;
      isTransitioning = true;
      transitionProgress = (frame - (accumulatedTime + startDelay + imageDuration) * fps) / (transDuration * fps);
      break;
    }
    accumulatedTime += segmentDuration;
  }

  return {
    currentIndex,
    imageProgress,
    isTransitioning,
    transitionProgress,
    progress,
    totalDuration: total,
    totalFrames,
    currentFrame: frame - startFrames,
    // Helper to get image timing
    getImageTiming: (index: number) => {
      let start = startDelay;
      for (let i = 0; i < index; i++) {
        start += durationPerImage + (i < imageCount - 1 ? transitionDuration : 0);
      }
      const end = start + durationPerImage;
      return { start, end, duration: durationPerImage };
    },
  };
};