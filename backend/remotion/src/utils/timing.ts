/**
 * Timing utilities for animations and sequences
 */

export interface TimingConfig {
  duration: number;
  delay?: number;
  repeat?: number;
  repeatDelay?: number;
  alternate?: boolean;
}

export interface SequenceItem {
  duration: number;
  delay?: number;
  overlap?: number;
}

/**
 * Calculate timing for a sequence of items
 */
export const calculateSequenceTiming = (items: SequenceItem[]): TimingInfo[] => {
  const results: TimingInfo[] = [];
  let currentTime = 0;

  for (const item of items) {
    const start = currentTime + (item.delay || 0);
    const end = start + item.duration;
    const overlap = item.overlap || 0;

    results.push({
      start,
      end,
      duration: item.duration,
      delay: item.delay || 0,
      overlap,
    });

    currentTime = end - overlap;
  }

  return results;
};

export interface TimingInfo {
  start: number;
  end: number;
  duration: number;
  delay: number;
  overlap: number;
}

/**
 * Calculate beat timing for music
 */
export const calculateBeatTiming = (bpm: number, beatCount: number): number[] => {
  const beatDuration = 60 / bpm;
  const beats: number[] = [];

  for (let i = 0; i < beatCount; i++) {
    beats.push(i * beatDuration);
  }

  return beats;
};

/**
 * Get timing for image sequence
 */
export const getImageTiming = (
  imageCount: number,
  durationPerImage: number,
  transitionDuration: number = 0
): ImageTimingInfo[] => {
  const timings: ImageTimingInfo[] = [];
  let currentTime = 0;

  for (let i = 0; i < imageCount; i++) {
    const start = currentTime;
    const end = start + durationPerImage;
    const transitionStart = end;
    const transitionEnd = end + (i < imageCount - 1 ? transitionDuration : 0);

    timings.push({
      index: i,
      start,
      end,
      duration: durationPerImage,
      transitionStart,
      transitionEnd,
      transitionDuration: i < imageCount - 1 ? transitionDuration : 0,
      nextStart: transitionEnd,
    });

    currentTime = transitionEnd;
  }

  return timings;
};

export interface ImageTimingInfo {
  index: number;
  start: number;
  end: number;
  duration: number;
  transitionStart: number;
  transitionEnd: number;
  transitionDuration: number;
  nextStart: number;
}

/**
 * Sync timing to beats
 */
export const syncToBeats = (
  beats: number[],
  duration: number,
  offset: number = 0
): number[] => {
  const synced: number[] = [];
  const totalDuration = duration + offset;

  for (const beat of beats) {
    if (beat >= offset && beat <= totalDuration) {
      synced.push(beat - offset);
    }
  }

  return synced;
};

/**
 * Calculate progress through timeline
 */
export const calculateProgress = (
  currentTime: number,
  startTime: number,
  endTime: number
): number => {
  if (currentTime <= startTime) return 0;
  if (currentTime >= endTime) return 1;
  return (currentTime - startTime) / (endTime - startTime);
};

/**
 * Get timing for transitions
 */
export const getTransitionTiming = (
  fromIndex: number,
  toIndex: number,
  transitionDuration: number,
  imageDuration: number
): TransitionTiming => {
  const fromStart = fromIndex * (imageDuration + transitionDuration);
  const fromEnd = fromStart + imageDuration;
  const toStart = fromEnd;
  const toEnd = toStart + transitionDuration;

  return {
    fromStart,
    fromEnd,
    toStart,
    toEnd,
    duration: transitionDuration,
    imageDuration,
  };
};

export interface TransitionTiming {
  fromStart: number;
  fromEnd: number;
  toStart: number;
  toEnd: number;
  duration: number;
  imageDuration: number;
}

/**
 * Calculate frames from time
 */
export const timeToFrames = (time: number, fps: number): number => {
  return Math.round(time * fps);
};

/**
 * Calculate time from frames
 */
export const framesToTime = (frames: number, fps: number): number => {
  return frames / fps;
};

/**
 * Get timing for keyframes
 */
export const getKeyframeTiming = (
  keyframes: number[],
  duration: number
): KeyframeTiming[] => {
  const timings: KeyframeTiming[] = [];

  for (let i = 0; i < keyframes.length; i++) {
    const time = keyframes[i];
    const progress = time / duration;

    timings.push({
      index: i,
      time,
      progress,
      isLast: i === keyframes.length - 1,
      isFirst: i === 0,
      nextTime: i < keyframes.length - 1 ? keyframes[i + 1] : duration,
      prevTime: i > 0 ? keyframes[i - 1] : 0,
      durationToNext: i < keyframes.length - 1 ? keyframes[i + 1] - time : duration - time,
    });
  }

  return timings;
};

export interface KeyframeTiming {
  index: number;
  time: number;
  progress: number;
  isLast: boolean;
  isFirst: boolean;
  nextTime: number;
  prevTime: number;
  durationToNext: number;
}

/**
 * Get loop timing
 */
export const getLoopTiming = (
  duration: number,
  loopCount: number = 0
): LoopTiming => {
  const totalDuration = loopCount > 0 ? duration * loopCount : duration;

  return {
    duration,
    loopCount,
    totalDuration,
    getLoopIndex: (time: number) => {
      if (loopCount === 0) return 0;
      return Math.floor(time / duration) % loopCount;
    },
    getLoopProgress: (time: number) => {
      const loopTime = time % duration;
      return loopTime / duration;
    },
  };
};

export interface LoopTiming {
  duration: number;
  loopCount: number;
  totalDuration: number;
  getLoopIndex: (time: number) => number;
  getLoopProgress: (time: number) => number;
}