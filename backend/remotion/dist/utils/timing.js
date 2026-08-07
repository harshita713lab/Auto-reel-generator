/**
 * Timing utilities for animations and sequences
 */
/**
 * Calculate timing for a sequence of items
 */
export const calculateSequenceTiming = (items) => {
    const results = [];
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
/**
 * Calculate beat timing for music
 */
export const calculateBeatTiming = (bpm, beatCount) => {
    const beatDuration = 60 / bpm;
    const beats = [];
    for (let i = 0; i < beatCount; i++) {
        beats.push(i * beatDuration);
    }
    return beats;
};
/**
 * Get timing for image sequence
 */
export const getImageTiming = (imageCount, durationPerImage, transitionDuration = 0) => {
    const timings = [];
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
/**
 * Sync timing to beats
 */
export const syncToBeats = (beats, duration, offset = 0) => {
    const synced = [];
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
export const calculateProgress = (currentTime, startTime, endTime) => {
    if (currentTime <= startTime)
        return 0;
    if (currentTime >= endTime)
        return 1;
    return (currentTime - startTime) / (endTime - startTime);
};
/**
 * Get timing for transitions
 */
export const getTransitionTiming = (fromIndex, toIndex, transitionDuration, imageDuration) => {
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
/**
 * Calculate frames from time
 */
export const timeToFrames = (time, fps) => {
    return Math.round(time * fps);
};
/**
 * Calculate time from frames
 */
export const framesToTime = (frames, fps) => {
    return frames / fps;
};
/**
 * Get timing for keyframes
 */
export const getKeyframeTiming = (keyframes, duration) => {
    const timings = [];
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
/**
 * Get loop timing
 */
export const getLoopTiming = (duration, loopCount = 0) => {
    const totalDuration = loopCount > 0 ? duration * loopCount : duration;
    return {
        duration,
        loopCount,
        totalDuration,
        getLoopIndex: (time) => {
            if (loopCount === 0)
                return 0;
            return Math.floor(time / duration) % loopCount;
        },
        getLoopProgress: (time) => {
            const loopTime = time % duration;
            return loopTime / duration;
        },
    };
};
