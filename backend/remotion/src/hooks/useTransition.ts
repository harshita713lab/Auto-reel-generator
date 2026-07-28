import { useCurrentFrame, interpolate, Easing } from 'remotion';

type TransitionType = 'fade' | 'slide' | 'zoom' | 'blur' | 'flash' | 'crossFade' | 'none';

interface TransitionConfig {
  durationInFrames: number;
  type?: TransitionType;
  direction?: 'left' | 'right' | 'up' | 'down' | 'center';
  easing?: (t: number) => number;
  delay?: number;
}

export const useTransition = (config: TransitionConfig) => {
  const frame = useCurrentFrame();
  const {
    durationInFrames,
    type = 'fade',
    direction = 'center',
    easing = Easing.easeInOut,
    delay = 0,
  } = config;

  const progress = Math.max(0, Math.min((frame - delay) / durationInFrames, 1));
  const easedProgress = easing(progress);

  const getTransitionStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      transition: 'all 0.05s ease-out',
    };

    switch (type) {
      case 'fade':
        return {
          ...baseStyle,
          opacity: interpolate(easedProgress, [0, 1], [0, 1]),
        };
      
      case 'crossFade':
        return {
          ...baseStyle,
          opacity: interpolate(easedProgress, [0, 1], [0, 1]),
        };
      
      case 'slide':
        let translateX = 0;
        let translateY = 0;
        
        switch (direction) {
          case 'left':
            translateX = interpolate(easedProgress, [0, 1], [100, 0]);
            break;
          case 'right':
            translateX = interpolate(easedProgress, [0, 1], [-100, 0]);
            break;
          case 'up':
            translateY = interpolate(easedProgress, [0, 1], [100, 0]);
            break;
          case 'down':
            translateY = interpolate(easedProgress, [0, 1], [-100, 0]);
            break;
          default:
            translateX = interpolate(easedProgress, [0, 1], [0, 0]);
        }
        
        return {
          ...baseStyle,
          transform: `translate(${translateX}px, ${translateY}px)`,
          opacity: interpolate(easedProgress, [0, 0.2], [0, 1]),
        };
      
      case 'zoom':
        const scale = interpolate(easedProgress, [0, 1], [0.8, 1]);
        return {
          ...baseStyle,
          transform: `scale(${scale})`,
          opacity: interpolate(easedProgress, [0, 0.2], [0, 1]),
        };
      
      case 'blur':
        const blur = interpolate(easedProgress, [0, 1], [20, 0]);
        return {
          ...baseStyle,
          filter: `blur(${blur}px)`,
          opacity: interpolate(easedProgress, [0, 0.3], [0, 1]),
        };
      
      case 'flash':
        const flash = interpolate(easedProgress, [0, 0.5], [1, 0]);
        return {
          ...baseStyle,
          backgroundColor: `rgba(255,255,255,${flash * 0.5})`,
          opacity: 1,
        };
      
      case 'none':
      default:
        return {
          ...baseStyle,
          opacity: 1,
        };
    }
  };

  return {
    progress,
    easedProgress,
    style: getTransitionStyle(),
    isActive: progress < 1,
    isComplete: progress >= 1,
  };
};

// Hook for transitioning between two elements
export const useTransitionBetween = (config: TransitionConfig & { 
  elementCount?: number;
  activeIndex?: number;
}) => {
  const frame = useCurrentFrame();
  const {
    durationInFrames,
    type = 'fade',
    elementCount = 2,
    activeIndex = 0,
    easing = Easing.easeInOut,
  } = config;

  const progress = Math.min(frame / durationInFrames, 1);
  const easedProgress = easing(progress);

  // Calculate which element is active
  const segmentDuration = 1 / elementCount;
  const currentSegment = Math.floor(progress / segmentDuration);
  const segmentProgress = (progress - currentSegment * segmentDuration) / segmentDuration;

  const isActive = currentSegment === activeIndex;
  const isTransitioning = segmentProgress > 0.5 && segmentProgress < 1;

  return {
    currentSegment,
    segmentProgress,
    isActive,
    isTransitioning,
    progress,
    easedProgress,
    getElementStyle: (index: number) => {
      if (index === currentSegment) {
        return {
          opacity: 1,
          transform: 'scale(1)',
          zIndex: 1,
        };
      } else if (index < currentSegment) {
        return {
          opacity: 0,
          transform: 'scale(0.9)',
          zIndex: 0,
          pointerEvents: 'none',
        };
      } else {
        return {
          opacity: 0,
          transform: 'scale(1.1)',
          zIndex: 0,
          pointerEvents: 'none',
        };
      }
    },
  };
};

// Hook for page transitions
export const usePageTransition = (config: TransitionConfig) => {
  const transition = useTransition(config);
  const { type = 'slide', direction = 'left' } = config;

  // For page transitions, we want the outgoing page to slide out
  const getOutgoingStyle = (): React.CSSProperties => {
    let translateX = 0;
    let translateY = 0;

    switch (direction) {
      case 'left':
        translateX = interpolate(transition.easedProgress, [0, 1], [0, -100]);
        break;
      case 'right':
        translateX = interpolate(transition.easedProgress, [0, 1], [0, 100]);
        break;
      case 'up':
        translateY = interpolate(transition.easedProgress, [0, 1], [0, -100]);
        break;
      case 'down':
        translateY = interpolate(transition.easedProgress, [0, 1], [0, 100]);
        break;
    }

    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${1 - transition.easedProgress * 0.05})`,
      opacity: 1 - transition.easedProgress,
    };
  };

  const getIncomingStyle = (): React.CSSProperties => {
    let translateX = 0;
    let translateY = 0;

    switch (direction) {
      case 'left':
        translateX = interpolate(transition.easedProgress, [0, 1], [100, 0]);
        break;
      case 'right':
        translateX = interpolate(transition.easedProgress, [0, 1], [-100, 0]);
        break;
      case 'up':
        translateY = interpolate(transition.easedProgress, [0, 1], [100, 0]);
        break;
      case 'down':
        translateY = interpolate(transition.easedProgress, [0, 1], [-100, 0]);
        break;
    }

    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${0.95 + transition.easedProgress * 0.05})`,
      opacity: transition.easedProgress,
    };
  };

  return {
    ...transition,
    getOutgoingStyle,
    getIncomingStyle,
  };
};