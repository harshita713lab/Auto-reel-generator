import { useCurrentFrame, useVideoConfig } from 'remotion';

interface BeatSyncConfig {
  beats: Array<{ time: number; confidence?: number }>;
  durationInFrames?: number;
  offset?: number;
}

export const useBeatSync = (config: BeatSyncConfig) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { beats, durationInFrames, offset = 0 } = config;

  const currentTime = frame / fps;
  const totalDuration = durationInFrames ? durationInFrames / fps : 30;

  // Find current beat
  let currentBeatIndex = -1;
  let nextBeatIndex = -1;
  let timeToNextBeat = Infinity;
  let timeFromLastBeat = Infinity;

  for (let i = 0; i < beats.length; i++) {
    const beatTime = beats[i].time + offset;
    if (beatTime <= currentTime) {
      currentBeatIndex = i;
      timeFromLastBeat = currentTime - beatTime;
    }
    if (beatTime > currentTime && nextBeatIndex === -1) {
      nextBeatIndex = i;
      timeToNextBeat = beatTime - currentTime;
      break;
    }
  }

  // Calculate beat progress (0-1 between beats)
  let beatProgress = 0;
  if (currentBeatIndex >= 0 && nextBeatIndex >= 0) {
    const prevBeat = beats[currentBeatIndex].time + offset;
    const nextBeat = beats[nextBeatIndex].time + offset;
    const beatDuration = nextBeat - prevBeat;
    beatProgress = beatDuration > 0 ? (currentTime - prevBeat) / beatDuration : 0;
  }

  // Check if on beat
  const isOnBeat = timeFromLastBeat < 0.05 || timeToNextBeat < 0.05;

  // Get BPM
  const bpm = beats.length > 1 ? 60 / (beats[1].time - beats[0].time) : 120;

  return {
    currentBeatIndex,
    nextBeatIndex,
    timeToNextBeat,
    timeFromLastBeat,
    beatProgress,
    isOnBeat,
    bpm,
    beatCount: beats.length,
    currentTime,
    totalDuration,
    // Helper to sync to beat
    syncToBeat: (value: number) => {
      const beatDuration = 60 / bpm;
      return Math.floor(value / beatDuration) * beatDuration;
    },
  };
};

// For syncing animations to beats
export const useBeatAnimation = (config: BeatSyncConfig & { animationDuration?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { beats, animationDuration = 1, offset = 0 } = config;

  const sync = useBeatSync({ beats, offset });
  const currentTime = frame / fps;

  // Find if we should trigger animation
  let shouldAnimate = false;
  let animationProgress = 0;

  for (const beat of beats) {
    const beatTime = beat.time + offset;
    const diff = Math.abs(currentTime - beatTime);
    if (diff < 0.1) {
      shouldAnimate = true;
      animationProgress = diff / 0.1;
      break;
    }
  }

  return {
    ...sync,
    shouldAnimate,
    animationProgress: 1 - animationProgress,
    isBeatActive: shouldAnimate,
  };
};