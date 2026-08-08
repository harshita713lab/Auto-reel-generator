import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCurrentFrame, useVideoConfig } from 'remotion';
export const ProgressBar = ({ durationInFrames, progress, color = '#4A9DFF', backgroundColor = 'rgba(255,255,255,0.2)', height = 4, width = '80%', position = 'bottom', showPercentage = false, style = {}, }) => {
    const frame = useCurrentFrame();
    const { durationInFrames: totalFrames } = useVideoConfig();
    const totalDuration = durationInFrames || totalFrames;
    const currentProgress = progress !== undefined
        ? progress
        : totalDuration > 0 ? frame / totalDuration : 0;
    const clamped = Math.max(0, Math.min(1, currentProgress));
    const posStyles = {
        position: 'absolute',
        overflow: 'hidden',
        borderRadius: height / 2,
    };
    const isVertical = position === 'left' || position === 'right';
    switch (position) {
        case 'top':
            posStyles.top = 0;
            posStyles.left = '50%';
            posStyles.transform = 'translateX(-50%)';
            posStyles.width = typeof width === 'number' ? width : width;
            posStyles.height = height;
            break;
        case 'bottom':
            posStyles.bottom = 0;
            posStyles.left = '50%';
            posStyles.transform = 'translateX(-50%)';
            posStyles.width = typeof width === 'number' ? width : width;
            posStyles.height = height;
            break;
        case 'left':
            posStyles.left = 0;
            posStyles.top = '50%';
            posStyles.transform = 'translateY(-50%)';
            posStyles.width = height;
            posStyles.height = typeof width === 'number' ? width : width;
            break;
        case 'right':
            posStyles.right = 0;
            posStyles.top = '50%';
            posStyles.transform = 'translateY(-50%)';
            posStyles.width = height;
            posStyles.height = typeof width === 'number' ? width : width;
            break;
    }
    const fillStyle = {
        backgroundColor: color,
        borderRadius: height / 2,
        ...(isVertical
            ? { height: `${clamped * 100}%`, width: '100%' }
            : { width: `${clamped * 100}%`, height: '100%' }),
    };
    return (_jsxs("div", { style: { ...posStyles, backgroundColor, ...style }, children: [_jsx("div", { style: fillStyle }), showPercentage && (_jsxs("div", { style: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 'bold',
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                    zIndex: 1,
                }, children: [Math.round(clamped * 100), "%"] }))] }));
};
