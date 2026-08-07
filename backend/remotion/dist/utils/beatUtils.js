/**
 * Returns a subtle scale pulse multiplier (1.0 to ~1.08) whenever the current frame matches a beat timestamp.
 *
 * @param frame Current frame number
 * @param fps Video FPS (default 30)
 * @param beatTimestamps Array of beat timestamps in seconds
 * @returns Scale factor (e.g., 1.0 to 1.08)
 */
export function getBeatScale(frame, fps = 30, beatTimestamps) {
    const beats = (beatTimestamps && Array.isArray(beatTimestamps) && beatTimestamps.length > 0)
        ? beatTimestamps
        : [3, 6, 9, 12]; // Default 3s rhythm pulses if none provided
    for (const ts of beats) {
        const beatFrame = Math.round(ts * fps);
        const diff = frame - beatFrame;
        // Beat pulse window: 0 to 8 frames (~0.25 seconds) after beat
        if (diff >= 0 && diff <= 8) {
            // Smooth pulse curve using sine wave
            const pulseProgress = Math.sin((diff / 8) * Math.PI);
            return 1.0 + pulseProgress * 0.07; // 7% micro-zoom pulse on beat
        }
    }
    return 1.0;
}
