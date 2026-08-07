import { useCurrentFrame, interpolate, Easing } from 'remotion';

interface AnimationConfig {
  durationInFrames: number;
  delay?: number;
  easing?: (t: number) => number;
  from?: Record<string, any>;
  to?: Record<string, any>;
}

export const useAnimation = (config: AnimationConfig) => {
  const frame = useCurrentFrame();
  const {
    durationInFrames,
    delay = 0,
    easing = Easing.inOut(Easing.ease),
    from = { opacity: 0, scale: 0.8 },
    to = { opacity: 1, scale: 1 },
  } = config;

  const progress = Math.max(0, Math.min((frame - delay) / durationInFrames, 1));
  const easedProgress = easing(progress);

  const result: Record<string, any> = {};

  // Interpolate all properties
  for (const key in from) {
    if (key in to) {
      result[key] = interpolate(
        easedProgress,
        [0, 1],
        [from[key], to[key]]
      );
    }
  }

  return {
    progress,
    easedProgress,
    ...result,
    isActive: progress < 1,
    isComplete: progress >= 1,
  };
};

// Variant for spring animation
export const useSpringAnimation = (config: AnimationConfig) => {
  const frame = useCurrentFrame();
  const {
    durationInFrames,
    delay = 0,
    from = { opacity: 0, scale: 0.8 },
    to = { opacity: 1, scale: 1 },
  } = config;

  const progress = Math.max(0, Math.min((frame - delay) / durationInFrames, 1));
  
  // Spring-like easing
  const springEasing = (t: number) => {
    return 1 - Math.pow(1 - t, 3) * Math.cos(t * Math.PI * 0.5);
  };

  const easedProgress = springEasing(progress);

  const result: Record<string, any> = {};

  for (const key in from) {
    if (key in to) {
      result[key] = interpolate(
        easedProgress,
        [0, 1],
        [from[key], to[key]]
      );
    }
  }

  return {
    progress,
    easedProgress,
    ...result,
    isActive: progress < 1,
    isComplete: progress >= 1,
  };
};

// Variant for sequence animation
export const useSequenceAnimation = (configs: AnimationConfig[]) => {
  const frame = useCurrentFrame();
  const results: Record<string, any>[] = [];

  let totalDuration = 0;
  for (const config of configs) {
    totalDuration += config.durationInFrames + (config.delay || 0);
  }

  for (const config of configs) {
    const result = useAnimation({
      ...config,
      delay: (config.delay || 0) + totalDuration,
    });
    results.push(result);
  }

  return results;
};