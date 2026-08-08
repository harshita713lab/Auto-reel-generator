import { jsx as _jsx } from "react/jsx-runtime";
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
export const Frame = ({ children, durationInFrames = 30, animation = 'fade', delay = 0, className = '', style = {}, }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, Math.min((frame - delay) / durationInFrames, 1));
    const getStyle = () => {
        switch (animation) {
            case 'fade':
                return {
                    opacity: interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
                };
            case 'slide':
                return {
                    opacity: interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
                    transform: `translateY(${interpolate(progress, [0, 1], [50, 0])}px)`,
                };
            case 'zoom':
                return {
                    opacity: interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
                    transform: `scale(${interpolate(progress, [0, 1], [0.8, 1])})`,
                };
            default:
                return { opacity: 1 };
        }
    };
    return (_jsx(AbsoluteFill, { className: className, style: { ...style, ...getStyle() }, children: children }));
};
