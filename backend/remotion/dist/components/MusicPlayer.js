import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Audio, useCurrentFrame, useVideoConfig } from 'remotion';
export const MusicPlayer = ({ src, volume = 1, startFrom = 0, fadeInDuration = 1, fadeOutDuration = 1, duration, loop = false, showVisualizer = true, }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const totalDuration = duration || 30;
    const getVolume = () => {
        const startFadeFrames = fadeInDuration * fps;
        const endFadeFrames = (totalDuration - fadeOutDuration) * fps;
        const totalFrames = totalDuration * fps;
        let vol = volume;
        if (frame < startFadeFrames) {
            vol = volume * (frame / startFadeFrames);
        }
        if (frame > endFadeFrames && totalFrames > endFadeFrames) {
            vol = volume * (1 - (frame - endFadeFrames) / (totalFrames - endFadeFrames));
        }
        return Math.max(0, Math.min(1, vol));
    };
    // Generate waveform bars
    const bars = 40;
    const waveform = Array.from({ length: bars }, (_, i) => {
        return 10 + Math.sin(i * 0.5 + frame * 0.02) * 20 + Math.random() * 10;
    });
    return (_jsxs(_Fragment, { children: [_jsx(Audio, { src: src, volume: getVolume(), startFrom: startFrom, loop: loop }), showVisualizer && (_jsx("div", { style: {
                    position: 'absolute',
                    bottom: 30,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    height: 60,
                    opacity: 0.6,
                }, children: waveform.map((height, i) => (_jsx("div", { style: {
                        width: 3,
                        height: height * 0.6,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 2,
                    } }, i))) }))] }));
};
